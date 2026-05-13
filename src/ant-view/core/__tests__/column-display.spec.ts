import { describe, expect, it } from "vitest";
import {
  buildColumnDisplayGroups,
  buildUpdateColumnsPayload,
  isAllChecked,
  toggleColumnSelection,
  type ColumnDisplayState
} from "../column-display";

const groups = [
  {
    name: "基础字段",
    sortNo: 0,
    list: [
      { code: "c1", dataIndex: "code", columnTitle: "编码", applicationFlag: 0, defaultIsShow: 1, sortNo: 0 },
      { code: "c2", dataIndex: "name", columnTitle: "名称", applicationFlag: 1, defaultIsShow: 1, sortNo: 1 },
      { code: "c3", dataIndex: "ext", columnTitle: "扩展", applicationFlag: 2, defaultIsShow: 0, sortNo: 2 }
    ]
  }
];

describe("column-display", () => {
  it("filters configurable columns", () => {
    const result = buildColumnDisplayGroups(groups as any);
    expect(result[0].list).toHaveLength(2);
  });

  it("checks all selected", () => {
    const result = buildColumnDisplayGroups(groups as any);
    expect(isAllChecked(result as any)).toBe(true);
  });

  it("toggles single column", () => {
    const state: ColumnDisplayState = {
      groupedColumns: buildColumnDisplayGroups(groups as any) as any,
      selectedColumns: []
    };
    const next = toggleColumnSelection(state, "c2", false);
    expect(next.selectedColumns.find((item) => item.code === "c2")).toBeUndefined();
  });

  it("builds update payload", () => {
    const payload = buildUpdateColumnsPayload("v1", buildColumnDisplayGroups(groups as any));
    expect(payload.viewId).toBe("v1");
    expect(Array.isArray(payload.columns)).toBe(true);
  });
});
