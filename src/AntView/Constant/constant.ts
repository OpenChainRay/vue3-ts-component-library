export const ColumnType = {
  Input: 0,
  Dict: 1,
  Date: 2,
  DateTime: 3,
  NUMBER: 4,
  JE: 5,
  BOOLEAN: 6,
  DataSource: 7,
  TreeMode: 8,
  CustomType: 9
} as const

export const YesOrNo = [
  { value: '', label: '全部' },
  { value: '1', label: '是' },
  { value: '0', label: '否' }
]

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
  C_DATE: { state: 15, stateName: '日历时间' },
  DATE: { state: 16, stateName: '普通时间' },
  GT_EQ_TODAY: { state: 17, stateName: '大于等于今天' },
  LT_EQ_TODAY: { state: 18, stateName: '小于等于今天' },
  GT_TODAY: { state: 19, stateName: '大于今天' },
  LT_TODAY: { state: 20, stateName: '小于今天' },
  GT_EQ_YESTERDAY: { state: 21, stateName: '大于等于昨天' },
  LT_EQ_YESTERDAY: { state: 22, stateName: '小于等于昨天' },
  GT_YESTERDAY: { state: 23, stateName: '大于昨天' },
  LT_YESTERDAY: { state: 24, stateName: '小于昨天' },
  GT_EQ_TOMORROW: { state: 25, stateName: '大于等于明天' },
  LT_EQ_TOMORROW: { state: 26, stateName: '小于等于明天' },
  GT_TOMORROW: { state: 27, stateName: '大于明天' },
  LT_TOMORROW: { state: 28, stateName: '小于明天' },
  THIS_WEEK: { state: 29, stateName: '本周' },
  LAST_WEEK: { state: 30, stateName: '上周' },
  NEXT_WEEK: { state: 31, stateName: '下周' },
  THIS_MONTH: { state: 32, stateName: '本月' },
  LAST_MONTH: { state: 33, stateName: '上月' },
  NEXT_MONTH: { state: 34, stateName: '下月' },
  APPOINT_DATE: { state: 35, stateName: '指定日期' },
  AFTER_TODAY_BEFORE_ONE_DAY: { state: 36, stateName: '今天之后N天之前' },
  EQ_TODAY: { state: 37, stateName: '等于今天' },
  EQ_TOMORROW: { state: 38, stateName: '等于明天' },
  EQ_YESTERDAY: { state: 39, stateName: '等于昨天' }
} as const

const dateTimeOperate = [
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
  { key: logicOperate.C_DATE.stateName, value: logicOperate.C_DATE.state },
  { key: logicOperate.DATE.stateName, value: logicOperate.DATE.state },
  { key: logicOperate.GT_EQ_TODAY.stateName, value: logicOperate.GT_EQ_TODAY.state },
  { key: logicOperate.LT_EQ_TODAY.stateName, value: logicOperate.LT_EQ_TODAY.state },
  { key: logicOperate.GT_TODAY.stateName, value: logicOperate.GT_TODAY.state },
  { key: logicOperate.LT_TODAY.stateName, value: logicOperate.LT_TODAY.state },
  { key: logicOperate.GT_EQ_YESTERDAY.stateName, value: logicOperate.GT_EQ_YESTERDAY.state },
  { key: logicOperate.LT_EQ_YESTERDAY.stateName, value: logicOperate.LT_EQ_YESTERDAY.state },
  { key: logicOperate.GT_YESTERDAY.stateName, value: logicOperate.GT_YESTERDAY.state },
  { key: logicOperate.LT_YESTERDAY.stateName, value: logicOperate.LT_YESTERDAY.state },
  { key: logicOperate.GT_EQ_TOMORROW.stateName, value: logicOperate.GT_EQ_TOMORROW.state },
  { key: logicOperate.LT_EQ_TOMORROW.stateName, value: logicOperate.LT_EQ_TOMORROW.state },
  { key: logicOperate.GT_TOMORROW.stateName, value: logicOperate.GT_TOMORROW.state },
  { key: logicOperate.LT_TOMORROW.stateName, value: logicOperate.LT_TOMORROW.state },
  { key: logicOperate.THIS_WEEK.stateName, value: logicOperate.THIS_WEEK.state },
  { key: logicOperate.LAST_WEEK.stateName, value: logicOperate.LAST_WEEK.state },
  { key: logicOperate.NEXT_WEEK.stateName, value: logicOperate.NEXT_WEEK.state },
  { key: logicOperate.THIS_MONTH.stateName, value: logicOperate.THIS_MONTH.state },
  { key: logicOperate.LAST_MONTH.stateName, value: logicOperate.LAST_MONTH.state },
  { key: logicOperate.NEXT_MONTH.stateName, value: logicOperate.NEXT_MONTH.state },
  { key: logicOperate.APPOINT_DATE.stateName, value: logicOperate.APPOINT_DATE.state },
  { key: logicOperate.AFTER_TODAY_BEFORE_ONE_DAY.stateName, value: logicOperate.AFTER_TODAY_BEFORE_ONE_DAY.state },
  { key: logicOperate.EQ_TODAY.stateName, value: logicOperate.EQ_TODAY.state },
  { key: logicOperate.EQ_TOMORROW.stateName, value: logicOperate.EQ_TOMORROW.state },
  { key: logicOperate.EQ_YESTERDAY.stateName, value: logicOperate.EQ_YESTERDAY.state }
]

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
  [ColumnType.Date]: dateTimeOperate,
  [ColumnType.DateTime]: dateTimeOperate,
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
    { key: logicOperate.LIKE.stateName, value: logicOperate.LIKE.state },
    { key: logicOperate.NOT_LIKE.stateName, value: logicOperate.NOT_LIKE.state },
    { key: logicOperate.IN.stateName, value: logicOperate.IN.state },
    { key: logicOperate.NOT_IN.stateName, value: logicOperate.NOT_IN.state },
    { key: logicOperate.IS_NULL.stateName, value: logicOperate.IS_NULL.state },
    { key: logicOperate.IS_NOT_NULL.stateName, value: logicOperate.IS_NOT_NULL.state }
  ],
  [ColumnType.TreeMode]: [
    { key: logicOperate.LIKE.stateName, value: logicOperate.LIKE.state },
    { key: logicOperate.NOT_LIKE.stateName, value: logicOperate.NOT_LIKE.state },
    { key: logicOperate.IN.stateName, value: logicOperate.IN.state },
    { key: logicOperate.NOT_IN.stateName, value: logicOperate.NOT_IN.state },
    { key: logicOperate.IS_NULL.stateName, value: logicOperate.IS_NULL.state },
    { key: logicOperate.IS_NOT_NULL.stateName, value: logicOperate.IS_NOT_NULL.state }
  ]
}

export const dateExcludeOperate = [
  { key: logicOperate.GT_EQ_TODAY.stateName, value: logicOperate.GT_EQ_TODAY.state },
  { key: logicOperate.LT_EQ_TODAY.stateName, value: logicOperate.LT_EQ_TODAY.state },
  { key: logicOperate.GT_TODAY.stateName, value: logicOperate.GT_TODAY.state },
  { key: logicOperate.LT_TODAY.stateName, value: logicOperate.LT_TODAY.state },
  { key: logicOperate.GT_EQ_YESTERDAY.stateName, value: logicOperate.GT_EQ_YESTERDAY.state },
  { key: logicOperate.LT_EQ_YESTERDAY.stateName, value: logicOperate.LT_EQ_YESTERDAY.state },
  { key: logicOperate.GT_YESTERDAY.stateName, value: logicOperate.GT_YESTERDAY.state },
  { key: logicOperate.LT_YESTERDAY.stateName, value: logicOperate.LT_YESTERDAY.state },
  { key: logicOperate.GT_EQ_TOMORROW.stateName, value: logicOperate.GT_EQ_TOMORROW.state },
  { key: logicOperate.LT_EQ_TOMORROW.stateName, value: logicOperate.LT_EQ_TOMORROW.state },
  { key: logicOperate.GT_TOMORROW.stateName, value: logicOperate.GT_TOMORROW.state },
  { key: logicOperate.LT_TOMORROW.stateName, value: logicOperate.LT_TOMORROW.state },
  { key: logicOperate.THIS_WEEK.stateName, value: logicOperate.THIS_WEEK.state },
  { key: logicOperate.LAST_WEEK.stateName, value: logicOperate.LAST_WEEK.state },
  { key: logicOperate.NEXT_WEEK.stateName, value: logicOperate.NEXT_WEEK.state },
  { key: logicOperate.THIS_MONTH.stateName, value: logicOperate.THIS_MONTH.state },
  { key: logicOperate.LAST_MONTH.stateName, value: logicOperate.LAST_MONTH.state },
  { key: logicOperate.NEXT_MONTH.stateName, value: logicOperate.NEXT_MONTH.state },
  { key: logicOperate.EQ_TODAY.stateName, value: logicOperate.EQ_TODAY.state },
  { key: logicOperate.EQ_TOMORROW.stateName, value: logicOperate.EQ_TOMORROW.state },
  { key: logicOperate.EQ_YESTERDAY.stateName, value: logicOperate.EQ_YESTERDAY.state }
]

export const whiteColumns = [{
  title: '序号',
  scopedSlots: { customRender: 'serial' },
  align: 'center',
  dataIndex: 'serial',
  sortNo: 0
}, {
  title: '操作',
  dataIndex: 'action',
  sortNo: 1,
  scopedSlots: { customRender: 'action' }
}]

export const columnMap = {
  'b59337a5-ebb7-11ed-b2c4-0242ac110007': {
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
  default: { title: '默认视图', value: 0, disabled: true },
  system: { title: '系统视图', value: 1, disabled: true },
  personal: { title: '个人视图', value: 2, disabled: false },
  share: { title: '共享视图', value: 3, disabled: false },
  modal: { title: '弹窗视图', value: 4, disabled: true },
  agg: { title: '聚合视图', value: 5, disabled: true },
  imm: { title: '固定视图', value: 6, disabled: true }
}

export const viewTypeList = [
  viewType.default,
  viewType.system,
  viewType.personal,
  viewType.share
]

export const systemViewType = {
  default: { title: '默认视图', value: 0 },
  system: { title: '系统视图', value: 1 },
  personal: { title: '个人视图', value: 2 },
  share: { title: '共享视图', value: 3 },
  modal: { title: '弹窗视图', value: 4 },
  agg: { title: '聚合视图', value: 5 },
  imm: { title: '固定视图', value: 6 }
}

export const systemViewTypeList = [
  viewType.default,
  viewType.system,
  viewType.personal,
  viewType.share,
  viewType.modal,
  viewType.agg,
  viewType.imm
]

export const VIEW_CHANGE_TYPE = {
  edit: { value: 1, label: '修改' },
  saveAs: { value: 2, label: '另存为' },
  add: { value: 3, label: '新增' }
}

export const singleDataLogicOperateType = [
  logicOperate.DATE.state,
  logicOperate.GT.state,
  logicOperate.GE.state,
  logicOperate.NE.state,
  logicOperate.EQ.state,
  logicOperate.LT.state,
  logicOperate.LE.state
]

export const timeCompareList = [
  { key: '今天', value: 1 },
  { key: '昨天', value: 2 },
  { key: '明天', value: 3 },
  { key: '本周', value: 4 },
  { key: '上周', value: 5 },
  { key: '下周', value: 6 },
  { key: '本月', value: 7 },
  { key: '上月', value: 8 },
  { key: '下月', value: 9 },
  { key: '指定日期', value: 10 }
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

export const pickerOptionsDateRange = {
  firstDayOfWeek: 7,
  shortcuts: [
    {
      text: '最近一周',
      onClick (picker: any) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '最近一个月',
      onClick (picker: any) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '最近三个月',
      onClick (picker: any) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        picker.$emit('pick', [start, end])
      }
    }
  ]
}

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
  timeCompareList,
  viewTypeList,
  viewType
}
