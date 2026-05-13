import { computed, ref, watch } from "vue";
import {
  getOperatorsByColumnType,
  normalizeFilterValue,
  type ColumnMapByTableCode,
  type FilterColumnMeta,
  type ViewColumn
} from "../core";

export interface RowSearchPayload {
  operator: number;
  relationType: 0 | 1;
  value: unknown;
  columnTitle: string;
  paramType?: 1 | 2;
}

export interface UseRowSearchControllerOptions {
  tableColumnObj: ViewColumn & FilterColumnMeta;
  modelValue?: unknown;
  debounceMs?: number;
  columnMap?: ColumnMapByTableCode;
  currentTableCode?: string;
}

/** 管理行内搜索状态 */
export function useRowSearchController(options: UseRowSearchControllerOptions) {
  const searchValue = ref<unknown>(options.modelValue);
  const selectList = ref<Array<{ label: string; value: string | number }>>([]);
  const debounceMs = options.debounceMs ?? 500;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  /** 初始化下拉选项 */
  function initOptions() {
    const column = options.tableColumnObj;
    if (!column.list?.length) {
      return;
    }
    if (column.columnType === 1) {
      selectList.value = column.list.map((item: any) => ({ label: item.dictText, value: item.dictId }));
      return;
    }
    const tableMap = options.columnMap?.[options.currentTableCode || ""];
    const currentMap = tableMap?.[column.dataIndex];
    const nameKey = currentMap?.["selectName"] || column.selectName || "label";
    const valueKey = currentMap?.["selectValue"] || column.selectValue || "value";
    selectList.value = column.list.map((item: any) => ({
      label: item[nameKey] ?? item.label,
      value: item[valueKey] ?? item.value
    }));
  }

  /** 触发搜索参数生成 */
  function buildPayload(value: unknown = searchValue.value): RowSearchPayload {
    const operators = getOperatorsByColumnType(Number(options.tableColumnObj.columnType));
    const operator = operators[0]?.value || 1;
    const normalized = normalizeFilterValue(Number(options.tableColumnObj.columnType), operator, value);
    return {
      operator,
      relationType: 0,
      value: normalized,
      columnTitle: options.tableColumnObj.dataIndex,
      paramType: options.tableColumnObj.paramType as 1 | 2 | undefined
    };
  }

  /** 手动更新搜索值 */
  function setSearchValue(value: unknown) {
    searchValue.value = value;
  }

  /** 清空搜索值 */
  function clear() {
    searchValue.value = undefined;
  }

  watch(
    () => searchValue.value,
    (value) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(() => {
        debounceTimer = null;
      }, debounceMs);
      return value;
    }
  );

  const currentOperator = computed(() => {
    return getOperatorsByColumnType(Number(options.tableColumnObj.columnType))[0]?.value || 1;
  });

  initOptions();

  return {
    searchValue,
    selectList,
    currentOperator,
    setSearchValue,
    clear,
    buildPayload
  };
}
