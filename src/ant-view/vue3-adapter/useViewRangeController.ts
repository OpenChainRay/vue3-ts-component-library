import { ref } from "vue";
import {
  buildViewRangeSubmitPayload,
  canUseAsFilterColumn,
  createRangeDraft,
  type FilterColumnMeta,
  type FilterDraftState,
  type ViewColumn
} from "../core";

interface UseViewRangeControllerOptions {
  tableCode: string;
  mode: "view" | "default" | "table-condition";
  viewId?: string | number;
  viewType?: number;
  id?: string | number;
  columns: ViewColumn[];
}

/** 数据范围控制器 */
export function useViewRangeController(options: UseViewRangeControllerOptions) {
  const filterColumns = ref<FilterColumnMeta[]>(
    options.columns
      .filter((column) => canUseAsFilterColumn(column))
      .map((column) => ({
        code: column.code,
        dataIndex: column.columnCode || column.dataIndex,
        columnTitle: column.columnTitle || column.dataIndex,
        columnType: Number(column.columnType || 0),
        paramType: 1
      }))
  );

  const draft = ref<FilterDraftState>(createRangeDraft(filterColumns.value));

  /** 重置范围 */
  function reset() {
    draft.value = createRangeDraft(filterColumns.value);
  }

  /** 生成提交参数 */
  function submit() {
    return buildViewRangeSubmitPayload(
      {
        mode: options.mode,
        tableCode: options.tableCode,
        viewId: options.viewId,
        viewType: options.viewType,
        id: options.id
      },
      options.columns,
      draft.value
    );
  }

  return {
    filterColumns,
    draft,
    reset,
    submit
  };
}
