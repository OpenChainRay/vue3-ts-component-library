import { describe, expect, it } from "vitest";
import { buildViewRangeSubmitPayload, canUseAsFilterColumn, createRangeDraft } from "../view-range";
import { ColumnType } from "../types";

const columns = [
  { code: "a", dataIndex: "name", columnCode: "name", columnTitle: "名称", columnType: ColumnType.Input, search: 1, applicationFlag: 0 },
  { code: "b", dataIndex: "inner", columnCode: "inner", columnTitle: "内部", columnType: ColumnType.CustomType, search: 1, applicationFlag: 3 }
];

describe("view-range", () => {
  it("checks filter column eligibility", () => {
    expect(canUseAsFilterColumn(columns[0] as any)).toBe(true);
    expect(canUseAsFilterColumn(columns[1] as any)).toBe(false);
  });

  it("creates range draft from columns", () => {
    const draft = createRangeDraft([
      {
        dataIndex: "name",
        columnTitle: "名称",
        columnType: ColumnType.Input
      }
    ]);
    expect(draft.groups[0].children.length).toBe(1);
  });

  it("builds submit payload for table condition mode", () => {
    const draft = createRangeDraft([
      {
        dataIndex: "name",
        columnTitle: "名称",
        columnType: ColumnType.Input
      }
    ]);
    draft.groups[0].children[0].value = "abc";
    const payload = buildViewRangeSubmitPayload(
      {
        tableCode: "tb1",
        id: "biz-1",
        mode: "table-condition"
      },
      columns as any,
      draft
    );
    expect(payload.id).toBe("biz-1");
    expect(payload.tableFilter).toBeTruthy();
  });
});
