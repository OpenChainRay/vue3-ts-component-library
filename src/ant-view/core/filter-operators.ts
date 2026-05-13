import { ColumnType } from "./types";
import type { FilterOperator } from "./filter-types";

export const logicOperate = {
  LIKE: { state: 1, stateName: "包含" },
  NOT_LIKE: { state: 2, stateName: "不包含" },
  IS_NULL: { state: 3, stateName: "为空" },
  IS_NOT_NULL: { state: 4, stateName: "不为空" },
  EQ: { state: 5, stateName: "等于" },
  GT: { state: 6, stateName: "大于" },
  LT: { state: 7, stateName: "小于" },
  GE: { state: 8, stateName: "大于等于" },
  LE: { state: 9, stateName: "小于等于" },
  NE: { state: 10, stateName: "不等于" },
  BETWEEN: { state: 11, stateName: "之间" },
  IN: { state: 12, stateName: "属于" },
  NOT_IN: { state: 13, stateName: "不属于" },
  D_DATE: { state: 14, stateName: "动态时间" },
  C_DATE: { state: 15, stateName: "日历时间" },
  DATE: { state: 16, stateName: "普通时间" },
  AFTER_TODAY_BEFORE_ONE_DAY: { state: 36, stateName: "今天之后N天之前" }
} as const;

const dateTimeOperate: FilterOperator[] = [
  { label: logicOperate.BETWEEN.stateName, value: logicOperate.BETWEEN.state },
  { label: logicOperate.EQ.stateName, value: logicOperate.EQ.state },
  { label: logicOperate.GT.stateName, value: logicOperate.GT.state },
  { label: logicOperate.LT.stateName, value: logicOperate.LT.state },
  { label: logicOperate.GE.stateName, value: logicOperate.GE.state },
  { label: logicOperate.LE.stateName, value: logicOperate.LE.state },
  { label: logicOperate.NE.stateName, value: logicOperate.NE.state },
  { label: logicOperate.IS_NULL.stateName, value: logicOperate.IS_NULL.state },
  { label: logicOperate.IS_NOT_NULL.stateName, value: logicOperate.IS_NOT_NULL.state },
  { label: logicOperate.D_DATE.stateName, value: logicOperate.D_DATE.state },
  { label: logicOperate.C_DATE.stateName, value: logicOperate.C_DATE.state },
  { label: logicOperate.DATE.stateName, value: logicOperate.DATE.state },
  { label: logicOperate.AFTER_TODAY_BEFORE_ONE_DAY.stateName, value: logicOperate.AFTER_TODAY_BEFORE_ONE_DAY.state }
];

const operateMap: Record<number, FilterOperator[]> = {
  [ColumnType.Input]: [
    { label: logicOperate.LIKE.stateName, value: logicOperate.LIKE.state },
    { label: logicOperate.NOT_LIKE.stateName, value: logicOperate.NOT_LIKE.state },
    { label: logicOperate.IS_NULL.stateName, value: logicOperate.IS_NULL.state },
    { label: logicOperate.IS_NOT_NULL.stateName, value: logicOperate.IS_NOT_NULL.state }
  ],
  [ColumnType.Dict]: [
    { label: logicOperate.IN.stateName, value: logicOperate.IN.state },
    { label: logicOperate.NOT_IN.stateName, value: logicOperate.NOT_IN.state },
    { label: logicOperate.IS_NULL.stateName, value: logicOperate.IS_NULL.state },
    { label: logicOperate.IS_NOT_NULL.stateName, value: logicOperate.IS_NOT_NULL.state }
  ],
  [ColumnType.Date]: dateTimeOperate,
  [ColumnType.DateTime]: dateTimeOperate,
  [ColumnType.Number]: [
    { label: logicOperate.EQ.stateName, value: logicOperate.EQ.state },
    { label: logicOperate.GT.stateName, value: logicOperate.GT.state },
    { label: logicOperate.LT.stateName, value: logicOperate.LT.state },
    { label: logicOperate.GE.stateName, value: logicOperate.GE.state },
    { label: logicOperate.LE.stateName, value: logicOperate.LE.state },
    { label: logicOperate.NE.stateName, value: logicOperate.NE.state }
  ],
  [ColumnType.Amount]: [
    { label: logicOperate.EQ.stateName, value: logicOperate.EQ.state },
    { label: logicOperate.GT.stateName, value: logicOperate.GT.state },
    { label: logicOperate.LT.stateName, value: logicOperate.LT.state },
    { label: logicOperate.GE.stateName, value: logicOperate.GE.state },
    { label: logicOperate.LE.stateName, value: logicOperate.LE.state },
    { label: logicOperate.NE.stateName, value: logicOperate.NE.state },
    { label: logicOperate.IS_NULL.stateName, value: logicOperate.IS_NULL.state },
    { label: logicOperate.IS_NOT_NULL.stateName, value: logicOperate.IS_NOT_NULL.state }
  ],
  [ColumnType.Boolean]: [{ label: logicOperate.EQ.stateName, value: logicOperate.EQ.state }],
  [ColumnType.DataSource]: [
    { label: logicOperate.LIKE.stateName, value: logicOperate.LIKE.state },
    { label: logicOperate.NOT_LIKE.stateName, value: logicOperate.NOT_LIKE.state },
    { label: logicOperate.IN.stateName, value: logicOperate.IN.state },
    { label: logicOperate.NOT_IN.stateName, value: logicOperate.NOT_IN.state },
    { label: logicOperate.IS_NULL.stateName, value: logicOperate.IS_NULL.state },
    { label: logicOperate.IS_NOT_NULL.stateName, value: logicOperate.IS_NOT_NULL.state }
  ],
  [ColumnType.TreeMode]: [
    { label: logicOperate.IN.stateName, value: logicOperate.IN.state },
    { label: logicOperate.NOT_IN.stateName, value: logicOperate.NOT_IN.state },
    { label: logicOperate.IS_NULL.stateName, value: logicOperate.IS_NULL.state },
    { label: logicOperate.IS_NOT_NULL.stateName, value: logicOperate.IS_NOT_NULL.state }
  ]
};

const noValueOperators = new Set<number>([logicOperate.IS_NULL.state, logicOperate.IS_NOT_NULL.state]);
const multiValueOperators = new Set<number>([logicOperate.IN.state, logicOperate.NOT_IN.state]);

/** 根据列类型获取操作符 */
export function getOperatorsByColumnType(columnType: number): FilterOperator[] {
  return operateMap[columnType] || [];
}

/** 判断操作符是否要求值 */
export function isValueRequired(operator: number): boolean {
  return !noValueOperators.has(operator);
}

/** 判断操作符是否为多值 */
export function isMultiValueOperator(operator: number): boolean {
  return multiValueOperators.has(operator);
}

/** 标准化筛选值 */
export function normalizeFilterValue(columnType: number, operator: number, rawValue: unknown): unknown {
  if (!isValueRequired(operator)) {
    return null;
  }
  if (rawValue === undefined || rawValue === null || rawValue === "") {
    return "";
  }
  if (columnType === ColumnType.Boolean) {
    if (rawValue === "1" || rawValue === 1) return 1;
    if (rawValue === "0" || rawValue === 0) return 0;
    return "";
  }
  if (columnType === ColumnType.Date || columnType === ColumnType.DateTime) {
    return normalizeDateValue(operator, rawValue);
  }
  if (columnType === ColumnType.Number || columnType === ColumnType.Amount) {
    return Number(rawValue);
  }
  if (isMultiValueOperator(operator)) {
    if (Array.isArray(rawValue)) {
      return rawValue.map((item) => String(item).trim()).join(",");
    }
    return String(rawValue)
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)
      .join(",");
  }
  if (Array.isArray(rawValue)) {
    return rawValue.join(",");
  }
  return String(rawValue).trim();
}

/** 日期值归一化 */
function normalizeDateValue(operator: number, rawValue: unknown): unknown {
  if (operator === logicOperate.AFTER_TODAY_BEFORE_ONE_DAY.state) {
    return Number(rawValue);
  }
  if (operator === logicOperate.BETWEEN.state) {
    if (!Array.isArray(rawValue) || rawValue.length !== 2) {
      return { first: null, last: null };
    }
    return {
      first: formatDateTimeStart(rawValue[0]),
      last: formatDateTimeEnd(rawValue[1])
    };
  }
  return {
    first: formatDateTimeStart(rawValue),
    last: formatDateTimeEnd(rawValue)
  };
}

/** 日期开始时间格式化 */
function formatDateTimeStart(date: unknown): string | null {
  const normalized = toDate(date);
  if (!normalized) return null;
  return `${normalized} 00:00:00`;
}

/** 日期结束时间格式化 */
function formatDateTimeEnd(date: unknown): string | null {
  const normalized = toDate(date);
  if (!normalized) return null;
  return `${normalized} 23:59:59`;
}

/** 日期对象转 yyyy-mm-dd */
function toDate(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") {
    return value.slice(0, 10);
  }
  if (value instanceof Date) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, "0");
    const d = String(value.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return null;
}
