import { describe, expect, it } from "vitest";
import { ColumnType } from "../types";
import { getOperatorsByColumnType, isValueRequired, logicOperate, normalizeFilterValue } from "../filter-operators";

describe("filter-operators", () => {
  it("returns operators by column type", () => {
    const operators = getOperatorsByColumnType(ColumnType.Input);
    expect(operators.length).toBeGreaterThan(0);
    expect(operators[0]?.value).toBe(logicOperate.LIKE.state);
  });

  it("knows null operators do not require value", () => {
    expect(isValueRequired(logicOperate.IS_NULL.state)).toBe(false);
    expect(isValueRequired(logicOperate.IS_NOT_NULL.state)).toBe(false);
  });

  it("normalizes boolean values", () => {
    expect(normalizeFilterValue(ColumnType.Boolean, logicOperate.EQ.state, "1")).toBe(1);
    expect(normalizeFilterValue(ColumnType.Boolean, logicOperate.EQ.state, "0")).toBe(0);
  });

  it("normalizes date range for between", () => {
    const normalized = normalizeFilterValue(ColumnType.Date, logicOperate.BETWEEN.state, [
      "2026-05-01",
      "2026-05-02"
    ]);
    expect(normalized).toEqual({
      first: "2026-05-01 00:00:00",
      last: "2026-05-02 23:59:59"
    });
  });
});
