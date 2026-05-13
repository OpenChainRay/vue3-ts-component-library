import { ColumnType, type ColumnMapByTableCode, type ColumnMapConfig, type ViewColumn, type ViewColumnGroup } from "./types";
import { whiteColumns } from "./constants";

export interface NormalizedColumnsResult {
  allColumns: ViewColumn[];
  visibleColumns: ViewColumn[];
  allColumnQuote: Array<{ name: string; sortNo?: number; list: ViewColumn[] }>;
  querySourceColumns: ViewColumn[];
}

/** 规范化后端视图列结构 */
export function normalizeViewColumns(
  groups: ViewColumnGroup[] | ViewColumnGroup | Record<string, unknown> | null | undefined,
  tableCode: string,
  columnMapByTableCode: ColumnMapByTableCode = {}
): NormalizedColumnsResult {
  const normalizedGroups = normalizeGroups(groups);
  const allColumnQuote = normalizedGroups
    .map((group) => ({
      name: String(group.name || (group as unknown as Record<string, unknown>).groupName || ""),
      sortNo: group.sortNo,
      list: resolveGroupColumns(group).map((column) => normalizeBaseColumn(column))
    }))
    .sort((a, b) => (a.sortNo || 0) - (b.sortNo || 0));

  const allColumns = allColumnQuote.flatMap((group) => group.list);
  const querySourceColumns: ViewColumn[] = [];
  const currentTableColumnMap = columnMapByTableCode[tableCode] || {};

  allColumns.forEach((column) => {
    column.searchValue = "";
    hydrateColumnDataSource(column, currentTableColumnMap);
    if (column.querySource?.queryCode) {
      querySourceColumns.push(column);
    }
  });

  return {
    allColumns,
    visibleColumns: pickVisibleColumns(allColumns, []),
    allColumnQuote,
    querySourceColumns
  };
}

/** 计算当前应展示列 */
export function pickVisibleColumns(allColumns: ViewColumn[], prependColumns: ViewColumn[]): ViewColumn[] {
  const visible = allColumns
    .filter((column) => isVisible(column))
    .sort((a, b) => (a.sortNo || 0) - (b.sortNo || 0));
  const visibleOrAll = visible.length ? visible : allColumns;

  const whiteDataIndexSet = new Set(whiteColumns.map((item) => item.dataIndex));
  const prepend = prependColumns.filter((item) => whiteDataIndexSet.has(item.dataIndex));
  return [...prepend, ...visibleOrAll];
}

/** 填充分页配置到视图信息 */
export function attachPageInfo(view: { pageInfo?: { currentPageNum: number; pageSizeList: Array<{ num: number; isCurrent: boolean }> } }) {
  const pageInfo = view.pageInfo;
  if (!pageInfo) {
    return {
      currentPageNum: 1,
      currentPageSize: "50",
      pageSizeOptions: ["50", "100", "150", "200"]
    };
  }

  let currentPageSize = String(pageInfo.pageSizeList[0]?.num || 50);
  const pageSizeOptions = pageInfo.pageSizeList.map((item) => {
    if (item.isCurrent) {
      currentPageSize = String(item.num);
    }
    return String(item.num);
  });

  return {
    currentPageNum: pageInfo.currentPageNum || 1,
    currentPageSize,
    pageSizeOptions
  };
}

/** 去重 queryCode，避免重复请求 */
export function dedupeQuerySourceColumns(columns: ViewColumn[]): ViewColumn[] {
  const seen = new Set<string>();
  return columns.filter((column) => {
    const code = column.querySource?.queryCode;
    if (!code || seen.has(code)) {
      return false;
    }
    seen.add(code);
    return true;
  });
}

/** 标准化列默认值 */
function normalizeBaseColumn(column: ViewColumn): ViewColumn {
  const normalized = { ...column } as ViewColumn;
  normalized.dataIndex = normalized.dataIndex || normalized.dataField || normalized.columnCode || "";
  normalized.columnTitle = normalized.columnTitle || normalized.dataIndex;
  const defaultIsShowValue = normalized.defaultIsShow ?? normalized.checked;
  normalized.defaultIsShow = toBoolean(defaultIsShowValue);
  normalized.search = normalized.search === 1 || normalized.search === true;
  normalized.width = normalized.width || 200;
  normalized.minWidth = normalized.minWidth || 10;
  normalized.sorter = !["serial", "finishCount", "allCount", "notQuoteCount"].includes(normalized.dataIndex);
  if (normalized.dataIndex === "action") {
    normalized.fixed = "left";
  }
  if (normalized.columnType === ColumnType.Dict) {
    normalized.list = normalized.viewDict?.options || [];
  }
  return normalized;
}

/** 兼容后端 columnList / columnlist */
function resolveGroupColumns(group: ViewColumnGroup): ViewColumn[] {
  if (Array.isArray(group.columnList)) {
    return group.columnList;
  }
  if (Array.isArray(group.columnlist)) {
    return group.columnlist;
  }
  const rawGroup = group as unknown as Record<string, unknown>;
  if (Array.isArray(rawGroup.list)) {
    return rawGroup.list as ViewColumn[];
  }
  return [];
}

/** 兼容 columns 是数组/对象 */
function normalizeGroups(groups: ViewColumnGroup[] | ViewColumnGroup | Record<string, unknown> | null | undefined): ViewColumnGroup[] {
  if (Array.isArray(groups)) {
    return groups as ViewColumnGroup[];
  }
  if (groups && typeof groups === "object") {
    const one = groups as ViewColumnGroup;
    if (Array.isArray(one.columnList) || Array.isArray(one.columnlist)) {
      return [one];
    }
    const raw = groups as Record<string, unknown>;
    if (Array.isArray(raw.columns)) {
      return raw.columns as ViewColumnGroup[];
    }
    if (Array.isArray(raw.list)) {
      return raw.list as ViewColumnGroup[];
    }
  }
  return [];
}

/** 挂载列级数据源配置 */
function hydrateColumnDataSource(column: ViewColumn, columnMap: Record<string, ColumnMapConfig>) {
  const mapItem = columnMap[column.dataIndex];
  if (!mapItem) {
    return;
  }
  column.columnMap = mapItem;
  if (mapItem.custom) {
    const request = mapItem.request;
    const requestName = typeof request === "function" ? request.name : mapItem.name;
    column.requestName = requestName || column.dataIndex;
    return;
  }
  column.list = mapItem.list || [];
}

/** 判断列是否应展示在表格 */
function isVisible(column: ViewColumn): boolean {
  const visible = toBoolean(column.defaultIsShow ?? column.checked);
  const appFlag = Number(column.applicationFlag);
  const allowByAppFlag = Number.isNaN(appFlag) || appFlag === 0 || appFlag === 1;
  return visible && allowByAppFlag;
}

/** 兼容数字/字符串/布尔值 */
function toBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const lower = value.toLowerCase();
    return lower === "1" || lower === "true";
  }
  return false;
}
