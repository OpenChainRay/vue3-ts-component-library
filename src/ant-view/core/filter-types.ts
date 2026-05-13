import { ColumnType } from "./types";

export interface FilterOperator {
  label: string;
  value: number;
}

export interface FilterNode {
  id: string;
  fieldName: string;
  columnTitle: string;
  columnType: ColumnType | number;
  operator: number;
  relationType: 0 | 1;
  paramType?: 1 | 2;
  value?: unknown;
}

export interface FilterGroup {
  id: string;
  relationType: 0 | 1;
  children: FilterNode[];
}

export interface FilterDraftState {
  groups: FilterGroup[];
}

export interface FilterColumnMeta {
  code?: string;
  dataIndex: string;
  columnTitle: string;
  columnType: ColumnType | number;
  paramType?: 1 | 2;
  operators?: Array<{ operatorId: number; operatorName: string }>;
}
