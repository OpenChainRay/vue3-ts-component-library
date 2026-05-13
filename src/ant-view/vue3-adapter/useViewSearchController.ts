import { computed, ref } from "vue";
import {
  addCondition,
  addGroup,
  buildFilterPayload,
  createFilterDraft,
  getOperatorsByColumnType,
  removeCondition,
  removeGroup,
  updateCondition,
  validateFilterDraft,
  type FilterColumnMeta,
  type FilterDraftState,
  type FilterNode
} from "../core";

export interface UseViewSearchControllerOptions {
  columns: FilterColumnMeta[];
}

/** 管理高级筛选状态 */
export function useViewSearchController(options: UseViewSearchControllerOptions) {
  const draft = ref<FilterDraftState>(createFilterDraft(options.columns));
  const errors = ref<string[]>([]);

  /** 重置筛选草稿 */
  function reset() {
    draft.value = createFilterDraft(options.columns);
    errors.value = [];
  }

  /** 新增筛选组 */
  function appendGroup() {
    draft.value = addGroup(draft.value);
  }

  /** 删除筛选组 */
  function dropGroup(groupId: string) {
    draft.value = removeGroup(draft.value, groupId);
  }

  /** 新增筛选条件 */
  function appendCondition(groupId: string, column: FilterColumnMeta) {
    draft.value = addCondition(draft.value, groupId, column);
  }

  /** 删除筛选条件 */
  function dropCondition(groupId: string, nodeId: string) {
    draft.value = removeCondition(draft.value, groupId, nodeId);
  }

  /** 更新筛选条件 */
  function patchCondition(groupId: string, nodeId: string, patch: Partial<Omit<FilterNode, "id">>) {
    draft.value = updateCondition(draft.value, groupId, nodeId, patch);
  }

  /** 获取字段可用操作符 */
  function getNodeOperators(node: FilterNode) {
    return getOperatorsByColumnType(Number(node.columnType));
  }

  /** 构建查询参数 */
  function submit(searchType: "搜索" | "重置" = "搜索") {
    const validationErrors = validateFilterDraft(draft.value);
    errors.value = validationErrors.map((item) => item.message);
    if (validationErrors.length) {
      return {
        ok: false as const,
        searchType,
        payload: {}
      };
    }
    return {
      ok: true as const,
      searchType,
      payload: buildFilterPayload(draft.value)
    };
  }

  const totalConditions = computed(() => {
    return draft.value.groups.reduce((count, group) => count + group.children.length, 0);
  });

  return {
    draft,
    errors,
    totalConditions,
    reset,
    appendGroup,
    dropGroup,
    appendCondition,
    dropCondition,
    patchCondition,
    getNodeOperators,
    submit
  };
}
