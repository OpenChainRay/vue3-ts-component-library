import { ColumnType } from "./types";
import type { FilterColumnMeta, FilterDraftState, FilterGroup, FilterNode } from "./filter-types";
import { getOperatorsByColumnType, isValueRequired, logicOperate, normalizeFilterValue } from "./filter-operators";

export interface FilterValidationError {
  nodeId: string;
  message: string;
}

export interface FilterPayload {
  filters?: Array<{
    fieldName: string;
    operator: number;
    relationType: 0 | 1;
    value: unknown;
  }>;
  [field: string]:
    | unknown
    | {
        operator: number;
        relationType: 0 | 1;
        value: unknown;
      }
    | Array<{
        fieldName: string;
        operator: number;
        relationType: 0 | 1;
        value: unknown;
      }>;
}

/** 根据列配置创建筛选草稿 */
export function createFilterDraft(columns: FilterColumnMeta[]): FilterDraftState {
  return {
    groups: [
      {
        id: createId("group"),
        relationType: 0,
        children: columns.map((column) => createFilterNode(column))
      }
    ]
  };
}

/** 新增筛选组 */
export function addGroup(draft: FilterDraftState): FilterDraftState {
  const groups = [...draft.groups];
  groups.push({ id: createId("group"), relationType: 0, children: [] });
  return { groups };
}

/** 删除筛选组 */
export function removeGroup(draft: FilterDraftState, groupId: string): FilterDraftState {
  const groups = draft.groups.filter((group) => group.id !== groupId);
  return { groups: groups.length ? groups : [{ id: createId("group"), relationType: 0, children: [] }] };
}

/** 新增筛选条件 */
export function addCondition(draft: FilterDraftState, groupId: string, column: FilterColumnMeta): FilterDraftState {
  return mutateGroup(draft, groupId, (group) => {
    group.children.push(createFilterNode(column));
  });
}

/** 删除筛选条件 */
export function removeCondition(draft: FilterDraftState, groupId: string, nodeId: string): FilterDraftState {
  return mutateGroup(draft, groupId, (group) => {
    group.children = group.children.filter((node) => node.id !== nodeId);
  });
}

/** 更新筛选条件 */
export function updateCondition(
  draft: FilterDraftState,
  groupId: string,
  nodeId: string,
  patch: Partial<Omit<FilterNode, "id">>
): FilterDraftState {
  return mutateGroup(draft, groupId, (group) => {
    group.children = group.children.map((node) => {
      if (node.id !== nodeId) return node;
      const nextNode: FilterNode = { ...node, ...patch };
      if (patch.columnType !== undefined && patch.operator === undefined) {
        const defaultOperator = getOperatorsByColumnType(Number(nextNode.columnType))[0];
        nextNode.operator = defaultOperator?.value || logicOperate.LIKE.state;
      }
      return nextNode;
    });
  });
}

/** 校验筛选草稿 */
export function validateFilterDraft(draft: FilterDraftState): FilterValidationError[] {
  const errors: FilterValidationError[] = [];
  draft.groups.forEach((group) => {
    group.children.forEach((node) => {
      if (!node.fieldName) {
        errors.push({ nodeId: node.id, message: "字段不能为空" });
        return;
      }
      if (isValueRequired(node.operator)) {
        const normalized = normalizeFilterValue(Number(node.columnType), node.operator, node.value);
        const isEmpty = normalized === "" || normalized === null || normalized === undefined;
        if (isEmpty) {
          errors.push({ nodeId: node.id, message: "筛选值不能为空" });
        }
      }
      if (
        Number(node.columnType) === ColumnType.Date &&
        node.operator === logicOperate.BETWEEN.state &&
        !isValidDateRange(node.value)
      ) {
        errors.push({ nodeId: node.id, message: "日期区间格式不正确" });
      }
    });
  });
  return errors;
}

/** 生成后端查询 payload */
export function buildFilterPayload(draft: FilterDraftState): FilterPayload {
  const payload: FilterPayload = {};
  const filters: NonNullable<FilterPayload["filters"]> = [];

  draft.groups.forEach((group) => {
    group.children.forEach((node) => {
      const normalizedValue = normalizeFilterValue(Number(node.columnType), node.operator, node.value);
      if (!shouldEmitNode(node, normalizedValue)) {
        return;
      }
      if (node.paramType === 2) {
        payload[node.fieldName] = {
          operator: node.operator,
          relationType: node.relationType,
          value: normalizedValue
        };
        return;
      }
      filters.push({
        fieldName: node.fieldName,
        operator: node.operator,
        relationType: node.relationType,
        value: normalizedValue
      });
    });
  });

  if (filters.length) {
    payload.filters = filters;
  }
  return payload;
}

/** 创建筛选条件 */
function createFilterNode(column: FilterColumnMeta): FilterNode {
  const firstOperator = column.operators?.[0]?.operatorId ?? getOperatorsByColumnType(Number(column.columnType))[0]?.value;
  return {
    id: createId("node"),
    fieldName: column.dataIndex,
    columnTitle: column.columnTitle,
    columnType: Number(column.columnType),
    operator: firstOperator || logicOperate.LIKE.state,
    relationType: 0,
    paramType: column.paramType || 1,
    value: ""
  };
}

/** 分组变更工具 */
function mutateGroup(draft: FilterDraftState, groupId: string, updater: (group: FilterGroup) => void): FilterDraftState {
  const groups = draft.groups.map((group) => {
    if (group.id !== groupId) return group;
    const clonedGroup: FilterGroup = {
      ...group,
      children: [...group.children]
    };
    updater(clonedGroup);
    return clonedGroup;
  });
  return { groups };
}

/** 判断是否可输出当前条件 */
function shouldEmitNode(node: FilterNode, value: unknown): boolean {
  if (!isValueRequired(node.operator)) {
    return true;
  }
  if (Number(node.columnType) === ColumnType.Date || Number(node.columnType) === ColumnType.DateTime) {
    return true;
  }
  return !(value === "" || value === undefined);
}

/** 判断日期区间合法性 */
function isValidDateRange(value: unknown): boolean {
  if (!Array.isArray(value) || value.length !== 2) {
    return false;
  }
  return Boolean(value[0] && value[1]);
}

/** 生成唯一 id */
function createId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
