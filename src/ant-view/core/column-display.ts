import type { ViewColumn } from "./types";

export interface ColumnDisplayGroup {
  name: string;
  sortNo?: number;
  list: ViewColumn[];
}

export interface ColumnDisplayState {
  selectedColumns: ViewColumn[];
  groupedColumns: ColumnDisplayGroup[];
}

/** 提取可配置列（applicationFlag 0/1） */
export function buildColumnDisplayGroups(groups: ColumnDisplayGroup[]): ColumnDisplayGroup[] {
  return groups.map((group) => ({
    ...group,
    list: group.list.filter((item) => item.applicationFlag === 0 || item.applicationFlag === 1 || typeof item.applicationFlag === "undefined")
  }));
}

/** 计算是否全选 */
export function isAllChecked(groups: ColumnDisplayGroup[]): boolean {
  const all = groups.flatMap((group) => group.list);
  if (!all.length) {
    return false;
  }
  return all.every((item) => item.defaultIsShow === 1 || item.defaultIsShow === true);
}

/** 勾选单列 */
export function toggleColumnSelection(state: ColumnDisplayState, columnCode: string, checked: boolean): ColumnDisplayState {
  const groupedColumns = state.groupedColumns.map((group) => ({
    ...group,
    list: group.list.map((item) => {
      if ((item.code || item.columnCode || item.dataIndex) !== columnCode) {
        return item;
      }
      return {
        ...item,
        defaultIsShow: checked ? 1 : 0
      };
    }) 
  }));
  const selectedColumns = collectSelectedColumns(groupedColumns);
  return {
    groupedColumns,
    selectedColumns
  };
}

/** 全选/反选 */
export function toggleAllColumns(state: ColumnDisplayState, checked: boolean): ColumnDisplayState {
  const groupedColumns = state.groupedColumns.map((group) => ({
    ...group,
    list: group.list.map((item) => {
      if (item.isRequired === 1) {
        return { ...item, defaultIsShow: 1 };
      }
      return {
        ...item,
        defaultIsShow: checked ? 1 : 0
      };
    })
  }));
  const selectedColumns = collectSelectedColumns(groupedColumns);
  return {
    groupedColumns,
    selectedColumns
  };
}

/** 删除已选列 */
export function removeSelectedColumn(state: ColumnDisplayState, columnCode: string): ColumnDisplayState {
  const groupedColumns = state.groupedColumns.map((group) => ({
    ...group,
    list: group.list.map((item) => {
      if ((item.code || item.columnCode || item.dataIndex) !== columnCode) {
        return item;
      }
      if (item.isRequired === 1) {
        return { ...item, defaultIsShow: 1 };
      }
      return { ...item, defaultIsShow: 0 };
    })
  }));
  const selectedColumns = collectSelectedColumns(groupedColumns);
  return {
    groupedColumns,
    selectedColumns
  };
}

/** 构建更新列配置 payload */
export function buildUpdateColumnsPayload(viewId: string | number, groupedColumns: ColumnDisplayGroup[]) {
  const normalizedGroups = groupedColumns.map((group, index) => ({
    name: group.name,
    sortNo: typeof group.sortNo === "number" ? group.sortNo : index,
    columnList: group.list.map((column, columnIndex) => ({
      ...column,
      sortNo: column.defaultIsShow ? columnIndex : column.sortNo
    }))
  }));
  return {
    viewId,
    columns: normalizedGroups
  };
}

/** 收集已选列并排序 */
function collectSelectedColumns(groups: ColumnDisplayGroup[]): ViewColumn[] {
  return groups
    .flatMap((group) =>
      group.list
        .filter((item) => item.defaultIsShow === 1 || item.defaultIsShow === true)
        .map((item) => ({ ...item, groupName: item.groupName || group.name }))
    )
    .sort((a, b) => (a.sortNo || 0) - (b.sortNo || 0));
}
