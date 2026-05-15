// @ts-nocheck
// import { planSelectStockList, getSupplierName } from '@/services/purchase/purchasePlan'
// import { getAllOrganizations } from '@/services/common'
// import { getEmployeeList } from '@/services/callManagement/callManagement'
export const ColumnType = {
  Input: 0, // 文本
  Dict: 1, // 字典
  Date: 2, // 日期
  DateTime: 3, // 日期
  NUMBER: 4, // 数宇
  JE: 5, // 金额
  BOOLEAN: 6, // 布尔
  DataSource: 7, // 自定义数据源
  TreeMode: 8,
  CustomType: 9
}

export const YesOrNo = [
  { value: '', label: '全部' },
  { value: '1', label: '是' },
  { value: '0', label: '否' }
]

// 操作符说明
export const logicOperate = {
  LIKE: { state: 1, stateName: '包含' },
  NOT_LIKE: { state: 2, stateName: '不包含' },
  IS_NULL: { state: 3, stateName: '为空' },
  IS_NOT_NULL: { state: 4, stateName: '不为空' },
  EQ: { state: 5, stateName: '等于' },
  GT: { state: 6, stateName: '大于' },
  LT: { state: 7, stateName: '小于' },
  GE: { state: 8, stateName: '大于等于' },
  LE: { state: 9, stateName: '小于等于' },
  NE: { state: 10, stateName: '不等于' },
  BETWEEN: { state: 11, stateName: '之间' },
  IN: { state: 12, stateName: '属于' },
  NOT_IN: { state: 13, stateName: '不属于' },
  D_DATE: { state: 14, stateName: '动态时间' },
  C_DATE: { state: 15, stateName: '日历时间' }
}

// 不同type对应不同的逻辑选择数据
export const operateMap = {
  [ColumnType.Input]: [
    { key: logicOperate.LIKE.stateName, value: logicOperate.LIKE.state },
    { key: logicOperate.NOT_LIKE.stateName, value: logicOperate.NOT_LIKE.state },
    { key: logicOperate.IS_NULL.stateName, value: logicOperate.IS_NULL.state },
    { key: logicOperate.IS_NOT_NULL.stateName, value: logicOperate.IS_NOT_NULL.state }
  ],

  [ColumnType.Dict]: [
    { key: logicOperate.IN.stateName, value: logicOperate.IN.state },
    { key: logicOperate.NOT_IN.stateName, value: logicOperate.NOT_IN.state },
    { key: logicOperate.IS_NOT_NULL.stateName, value: logicOperate.IS_NOT_NULL.state }
  ],
  [ColumnType.Date]: [
    { key: logicOperate.BETWEEN.stateName, value: logicOperate.BETWEEN.state },
    { key: logicOperate.EQ.stateName, value: logicOperate.EQ.state },
    { key: logicOperate.GT.stateName, value: logicOperate.GT.state },
    { key: logicOperate.LT.stateName, value: logicOperate.LT.state },
    { key: logicOperate.GE.stateName, value: logicOperate.GE.state },
    { key: logicOperate.LE.stateName, value: logicOperate.LE.state },
    { key: logicOperate.NE.stateName, value: logicOperate.NE.state },
    { key: logicOperate.IS_NULL.stateName, value: logicOperate.IS_NULL.state },
    { key: logicOperate.IS_NOT_NULL.stateName, value: logicOperate.IS_NOT_NULL.state },
    { key: logicOperate.D_DATE.stateName, value: logicOperate.D_DATE.state },
    { key: logicOperate.C_DATE.stateName, value: logicOperate.C_DATE.state }
  ],

  [ColumnType.DateTime]: [
    { key: logicOperate.BETWEEN.stateName, value: logicOperate.BETWEEN.state },
    { key: logicOperate.EQ.stateName, value: logicOperate.EQ.state },
    { key: logicOperate.GT.stateName, value: logicOperate.GT.state },
    { key: logicOperate.LT.stateName, value: logicOperate.LT.state },
    { key: logicOperate.GE.stateName, value: logicOperate.GE.state },
    { key: logicOperate.LE.stateName, value: logicOperate.LE.state },
    { key: logicOperate.NE.stateName, value: logicOperate.NE.state },
    { key: logicOperate.IS_NULL.stateName, value: logicOperate.IS_NULL.state },
    { key: logicOperate.IS_NOT_NULL.stateName, value: logicOperate.IS_NOT_NULL.state },
    { key: logicOperate.D_DATE.stateName, value: logicOperate.D_DATE.state },
    { key: logicOperate.C_DATE.stateName, value: logicOperate.C_DATE.state }
  ],

  [ColumnType.NUMBER]: [
    { key: logicOperate.EQ.stateName, value: logicOperate.EQ.state },
    { key: logicOperate.GT.stateName, value: logicOperate.GT.state },
    { key: logicOperate.LT.stateName, value: logicOperate.LT.state },
    { key: logicOperate.GE.stateName, value: logicOperate.GE.state },
    { key: logicOperate.LE.stateName, value: logicOperate.LE.state },
    { key: logicOperate.NE.stateName, value: logicOperate.NE.state }
  ],
  [ColumnType.JE]: [
    { key: logicOperate.EQ.stateName, value: logicOperate.EQ.state },
    { key: logicOperate.GT.stateName, value: logicOperate.GT.state },
    { key: logicOperate.LT.stateName, value: logicOperate.LT.state },
    { key: logicOperate.GE.stateName, value: logicOperate.GE.state },
    { key: logicOperate.LE.stateName, value: logicOperate.LE.state },
    { key: logicOperate.NE.stateName, value: logicOperate.NE.state }
  ],
  [ColumnType.BOOLEAN]: [
    { key: logicOperate.EQ.stateName, value: logicOperate.EQ.state }
  ],
  [ColumnType.DataSource]: [
    { key: logicOperate.IN.stateName, value: logicOperate.IN.state },
    { key: logicOperate.NOT_IN.stateName, value: logicOperate.NOT_IN.state },
    { key: logicOperate.IS_NOT_NULL.stateName, value: logicOperate.IS_NOT_NULL.state }
  ],
  [ColumnType.TreeMode]: [
    { key: logicOperate.IN.stateName, value: logicOperate.IN.state },
    { key: logicOperate.NOT_IN.stateName, value: logicOperate.NOT_IN.state },
    { key: logicOperate.IS_NOT_NULL.stateName, value: logicOperate.IS_NOT_NULL.state }
  ]
}
export const whiteColumns = [{
  title: '序号',
  scopedSlots: { customRender: 'serial' },
  align: 'center',
  dataIndex: 'serial',
  sortNo: 0
},]

export const columnMap = {
  // 客户列表配置项
  'b59337a5-ebb7-11ed-b2c4-0242ac110007': {
    //
    123: {
      list: [{ value: '', name: '全部' },
        { value: 'S', name: 'S' },
        { value: 'A', name: 'A' },
        { value: 'B', name: 'B' },
        { value: 'C', name: 'C' },
        { value: 'D', name: 'D' },
        { value: 'E', name: 'E' }]
    }
  }
}
export const viewType = {
  default: { title: '默认视图', value: 0 },
  system: { title: '系统视图', value: 1 },
  personal: { title: '个人视图', value: 2 }
}
export const viewTypeList = [
  viewType.default,
  viewType.system,
  viewType.personal
]
export const VIEW_CHANGE_TYPE = {
  edit: { value: 1, label: '修改' },
  saveAs: { value: 2, label: '另存为' },
  add: { value: 3, label: '新增' }
}
export const singleDataLogicOperateType = [
  logicOperate.EQ.state,
  logicOperate.GT.state,
  logicOperate.LT.state,
  logicOperate.GE.state,
  logicOperate.LE.state,
  logicOperate.NE.state
]
export const timeList = [
  { key: '月前', value: 1 },
  { key: '周前', value: 2 },
  { key: '天前', value: 3 },
  { key: '当天', value: 4 },
  { key: '月后', value: 5 },
  { key: '周后', value: 6 },
  { key: '天后', value: 7 }
]
export const calendarTimeOption = [
  { key: '前', value: 1 },
  { key: '当前', value: 2 },
  { key: '后', value: 3 }
]
export const calendarDateType = [
  { key: '周', value: 1 },
  { key: '月', value: 2 },
  { key: '年', value: 3 }
]
export const defaultPageSizeList = [
  '50', '100', '150', '200'
]
export const defaultPageInfo = {
  currentPageNum: 1,
  pageSizeList: [
    { num: Number(defaultPageSizeList[0]), isCurrent: true },
    { num: Number(defaultPageSizeList[1]), isCurrent: false },
    { num: Number(defaultPageSizeList[2]), isCurrent: false },
    { num: Number(defaultPageSizeList[3]), isCurrent: false }
  ]
}

export default {
  defaultPageSizeList,
  ColumnType,
  YesOrNo,
  logicOperate,
  operateMap,
  whiteColumns,
  columnMap,
  VIEW_CHANGE_TYPE,
  singleDataLogicOperateType,
  calendarTimeOption,
  calendarDateType,
  timeList,
  viewTypeList,
  viewType
}
