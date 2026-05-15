const columnMap = {
  "b59337a5-ebb7-11ed-b2c4-0242ac110007": {
    123: {
      list: [
        { value: "", name: "全部" },
        { value: "S", name: "S" },
        { value: "A", name: "A" },
        { value: "B", name: "B" },
        { value: "C", name: "C" },
        { value: "D", name: "D" },
        { value: "E", name: "E" }
      ]
    }
  }
}

const ColumnType = {
  Input: 0,
  Dict: 1,
  Date: 2,
  DateTime: 3,
  NUMBER: 4,
  JE: 5,
  BOOLEAN: 6,
  DataSource: 7,
  TreeMode: 8
}

const operateMap = {
  [ColumnType.Input]: [
    { key: "包含", value: 1 },
    { key: "不包含", value: 2 },
    { key: "为空", value: 3 },
    { key: "不为空", value: 4 }
  ],
  [ColumnType.Dict]: [
    { key: "属于", value: 12 },
    { key: "不属于", value: 13 },
    { key: "不为空", value: 4 }
  ],
  [ColumnType.Date]: [
    { key: "之间", value: 11 },
    { key: "等于", value: 5 },
    { key: "大于", value: 6 },
    { key: "小于", value: 7 },
    { key: "大于等于", value: 8 },
    { key: "小于等于", value: 9 },
    { key: "不等于", value: 10 },
    { key: "为空", value: 3 },
    { key: "不为空", value: 4 },
    { key: "动态时间", value: 14 },
    { key: "日历时间", value: 15 }
  ],
  [ColumnType.DateTime]: [
    { key: "之间", value: 11 },
    { key: "等于", value: 5 },
    { key: "大于", value: 6 },
    { key: "小于", value: 7 },
    { key: "大于等于", value: 8 },
    { key: "小于等于", value: 9 },
    { key: "不等于", value: 10 },
    { key: "为空", value: 3 },
    { key: "不为空", value: 4 },
    { key: "动态时间", value: 14 },
    { key: "日历时间", value: 15 }
  ],
  [ColumnType.NUMBER]: [
    { key: "等于", value: 5 },
    { key: "大于", value: 6 },
    { key: "小于", value: 7 },
    { key: "大于等于", value: 8 },
    { key: "小于等于", value: 9 },
    { key: "不等于", value: 10 }
  ],
  [ColumnType.JE]: [
    { key: "等于", value: 5 },
    { key: "大于", value: 6 },
    { key: "小于", value: 7 },
    { key: "大于等于", value: 8 },
    { key: "小于等于", value: 9 },
    { key: "不等于", value: 10 }
  ],
  [ColumnType.BOOLEAN]: [{ key: "等于", value: 5 }],
  [ColumnType.DataSource]: [
    { key: "属于", value: 12 },
    { key: "不属于", value: 13 },
    { key: "不为空", value: 4 }
  ],
  [ColumnType.TreeMode]: [
    { key: "属于", value: 12 },
    { key: "不属于", value: 13 },
    { key: "不为空", value: 4 }
  ]
}

const logicOperate = {
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
  C_DATE: { state: 15, stateName: "日历时间" }
}

const whiteColumns = [
  {
    title: "序号",
    scopedSlots: { customRender: "serial" },
    align: "center",
    dataIndex: "serial",
    sortNo: 0
  },
  {
    title: "操作",
    dataIndex: "action",
    sortNo: 1,
    scopedSlots: { customRender: "action" }
  }
]

export default {
  columnMap,
  ColumnType,
  whiteColumns,
  operateMap,
  logicOperate
}
