import { computed, ref, watch } from "vue";
import {
  buildColumnDisplayGroups,
  buildUpdateColumnsPayload,
  isAllChecked,
  removeSelectedColumn,
  toggleAllColumns,
  toggleColumnSelection,
  type ColumnDisplayGroup,
  type ViewColumn
} from "../core";

interface UseColumnDisplayControllerOptions {
  viewId: string | number;
  tableColumns: ViewColumn[];
  allColumnQuote: ColumnDisplayGroup[];
}

/** 列显隐控制器 */
export function useColumnDisplayController(options: UseColumnDisplayControllerOptions) {
  const groupedColumns = ref<ColumnDisplayGroup[]>(buildColumnDisplayGroups(options.allColumnQuote));
  const selectedColumns = ref<ViewColumn[]>(options.tableColumns);

  watch(
    () => options.tableColumns,
    (value) => {
      selectedColumns.value = [...value];
    }
  );

  /** 切换单列 */
  function toggleColumn(columnCode: string, checked: boolean) {
    const next = toggleColumnSelection(
      {
        groupedColumns: groupedColumns.value,
        selectedColumns: selectedColumns.value
      },
      columnCode,
      checked
    );
    groupedColumns.value = next.groupedColumns;
    selectedColumns.value = next.selectedColumns;
  }

  /** 全选或取消 */
  function toggleAll(checked: boolean) {
    const next = toggleAllColumns(
      {
        groupedColumns: groupedColumns.value,
        selectedColumns: selectedColumns.value
      },
      checked
    );
    groupedColumns.value = next.groupedColumns;
    selectedColumns.value = next.selectedColumns;
  }

  /** 删除已选 */
  function removeColumn(columnCode: string) {
    const next = removeSelectedColumn(
      {
        groupedColumns: groupedColumns.value,
        selectedColumns: selectedColumns.value
      },
      columnCode
    );
    groupedColumns.value = next.groupedColumns;
    selectedColumns.value = next.selectedColumns;
  }

  /** 构建保存参数 */
  function buildPayload() {
    return buildUpdateColumnsPayload(options.viewId, groupedColumns.value);
  }

  const checkAll = computed(() => isAllChecked(groupedColumns.value));

  return {
    groupedColumns,
    selectedColumns,
    checkAll,
    toggleColumn,
    toggleAll,
    removeColumn,
    buildPayload
  };
}
