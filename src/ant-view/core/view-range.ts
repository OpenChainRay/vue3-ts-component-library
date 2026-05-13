import type { FilterDraftState, FilterColumnMeta } from "./filter-types";
import type { ViewColumn } from "./types";
import { buildFilterPayload, createFilterDraft } from "./filter-tree";

export interface ViewRangeContext {
  tableCode: string;
  viewId?: string | number;
  viewType?: number;
  id?: string | number;
  mode: "view" | "default" | "table-condition";
}

export interface ViewRangeSubmitPayload {
  tableCode: string;
  columns: ViewColumn[];
  viewId?: string | number;
  viewType?: number;
  id?: string | number;
  viewFilter?: unknown;
  tableFilter?: unknown;
}

/** 从列信息构建范围草稿 */
export function createRangeDraft(columns: FilterColumnMeta[]): FilterDraftState {
  return createFilterDraft(columns);
}

/** 根据模式构建提交参数 */
export function buildViewRangeSubmitPayload(
  context: ViewRangeContext,
  columns: ViewColumn[],
  draft: FilterDraftState
): ViewRangeSubmitPayload {
  const filterPayload = convertToFilterPayload(draft);
  if (context.mode === "view") {
    return {
      tableCode: context.tableCode,
      viewId: context.viewId,
      viewType: context.viewType,
      columns,
      viewFilter: filterPayload
    };
  }
  if (context.mode === "default") {
    return {
      tableCode: context.tableCode,
      viewId: context.viewId,
      viewType: context.viewType,
      columns,
      tableFilter: filterPayload
    };
  }
  return {
    tableCode: context.tableCode,
    id: context.id,
    columns,
    tableFilter: filterPayload
  };
}

/** 检测字段是否可作为过滤条件 */
export function canUseAsFilterColumn(column: ViewColumn): boolean {
  return column.applicationFlag !== 3 && column.applicationFlag !== 1 && column.search !== 0 && column.columnType !== 9;
}

/** 构造 table/view filter 结构 */
function convertToFilterPayload(draft: FilterDraftState) {
  const payload = buildFilterPayload(draft);
  const filters = Array.isArray(payload.filters) ? payload.filters : [];
  return {
    relationType: 0,
    groupType: null,
    filters: filters.map((item) => ({
      groupType: 1,
      relationType: item.relationType,
      filters: [
        {
          columnCode: item.fieldName,
          operator: item.operator,
          type: "0",
          value: item.value
        }
      ]
    }))
  };
}
