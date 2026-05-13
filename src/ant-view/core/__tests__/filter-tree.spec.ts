import { describe, expect, it } from "vitest";
import { ColumnType } from "../types";
import {
  addCondition,
  buildFilterPayload,
  createFilterDraft,
  removeCondition,
  validateFilterDraft
} from "../filter-tree";
import { logicOperate } from "../filter-operators";

const columns = [
  {
    dataIndex: "code",
    columnTitle: "编码",
    columnType: ColumnType.Input as number,
    paramType: 1 as const
  },
  {
    dataIndex: "isEnable",
    columnTitle: "启用状态",
    columnType: ColumnType.Boolean as number,
    paramType: 2 as const
  }
];

describe("filter-tree", () => {
  it("creates draft with initial nodes", () => {
    const draft = createFilterDraft(columns);
    expect(draft.groups).toHaveLength(1);
    expect(draft.groups[0].children).toHaveLength(2);
  });

  it("supports add and remove condition", () => {
    const draft = createFilterDraft(columns);
    const groupId = draft.groups[0].id;
    const added = addCondition(draft, groupId, columns[0]);
    expect(added.groups[0].children).toHaveLength(3);
    const nodeId = added.groups[0].children[2].id;
    const removed = removeCondition(added, groupId, nodeId);
    expect(removed.groups[0].children).toHaveLength(2);
  });

  it("validates required value node", () => {
    const draft = createFilterDraft(columns);
    draft.groups[0].children[0].operator = logicOperate.LIKE.state;
    draft.groups[0].children[0].value = "";
    const errors = validateFilterDraft(draft);
    expect(errors.length).toBeGreaterThan(0);
  });

  it("builds payload with filters and search fields", () => {
    const draft = createFilterDraft(columns);
    draft.groups[0].children[0].operator = logicOperate.LIKE.state;
    draft.groups[0].children[0].value = "abc";
    draft.groups[0].children[1].operator = logicOperate.EQ.state;
    draft.groups[0].children[1].value = "1";
    const payload = buildFilterPayload(draft);
    expect(payload.filters).toEqual([
      {
        fieldName: "code",
        operator: logicOperate.LIKE.state,
        relationType: 0,
        value: "abc"
      }
    ]);
    expect(payload.isEnable).toEqual({
      operator: logicOperate.EQ.state,
      relationType: 0,
      value: 1
    });
  });
});
