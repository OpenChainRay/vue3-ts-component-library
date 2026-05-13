export enum ColumnType {
  Input = 0,
  Dict = 1,
  Date = 2,
  DateTime = 3,
  Number = 4,
  Amount = 5,
  Boolean = 6,
  DataSource = 7,
  TreeMode = 8,
  CustomType = 9
}

export interface QuerySource {
  queryCode: string;
}

export interface ColumnMapConfig {
  custom?: boolean;
  list?: unknown[];
  name?: string;
  selectName?: string;
  selectValue?: string;
  allowMultiple?: boolean;
  replaceFields?: Record<string, string>;
  params?: Record<string, unknown>;
  request?: ((params?: Record<string, unknown>) => Promise<unknown>) | Promise<unknown>;
  transfrom?: (column: ViewColumn, list: unknown[]) => void;
}

export interface ViewColumn {
  code?: string;
  columnCode?: string;
  dataIndex: string;
  dataField?: string;
  columnTitle?: string;
  checked?: number | boolean;
  columnType?: number;
  defaultIsShow?: number | boolean;
  applicationFlag?: number;
  groupName?: string;
  isRequired?: number;
  sortNo?: number;
  sortOrder?: string;
  width?: number;
  minWidth?: number;
  search?: number | boolean;
  dictTypeId?: string;
  viewDict?: { options?: unknown[] };
  querySource?: QuerySource;
  requestName?: string;
  selectName?: string;
  selectValue?: string;
  columnMap?: ColumnMapConfig;
  list?: unknown[];
  searchValue?: string;
  sorter?: boolean;
  align?: "left" | "center" | "right" | string;
  fixed?: "left" | "right";
}

export interface ViewColumnGroup {
  name: string;
  sortNo?: number;
  columnList: ViewColumn[];
  columnlist?: ViewColumn[];
}

export interface ViewListGroupItem {
  isGroup: boolean;
  groupName: string;
  viewOptionList: Array<{ viewId: string | number; viewName: string }>;
}

export interface PageInfo {
  currentPageNum: number;
  pageSizeList: Array<{ num: number; isCurrent: boolean }>;
}

export interface ViewConfig {
  viewId: string | number;
  viewName?: string;
  viewType?: number;
  columns: ViewColumnGroup[];
  pageInfo?: PageInfo;
  currentPageNum?: number;
  currentPageSize?: string;
  pageSizeOptions?: string[];
}

export interface ViewListResponse {
  currentView: ViewConfig;
  viewList: ViewListGroupItem[];
}

export interface ColumnMapByTableCode {
  [tableCode: string]: {
    [dataIndex: string]: ColumnMapConfig;
  };
}
