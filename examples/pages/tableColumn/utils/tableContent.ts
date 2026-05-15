// @ts-nocheck
const tableColumns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'serial' },
    align: 'center',
    search: false,
    width: 80,
    ellipsis: true,
    fixed: 'left'
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'operate' },
    align: 'center',
    search: false,
    width: 80,
    ellipsis: true,
    fixed: 'left'
  },
  // {
  //   title: '是否有效',
  //   dataIndex: 'status',
  //   scopedSlots: { customRender: 'status' },
  //   align: 'center',
  //   search: false,
  //   width: 100,
  //   fixed: 'left'
  // },
  {
    title: '列标题',
    dataIndex: 'columnTitle',
    scopedSlots: { customRender: 'columnTitle' },
    align: 'center',
    width: 200,
    search: false,
    fixed: 'left'
  },
  {
    title: '数据源名称',
    dataIndex: 'dataIndex',
    scopedSlots: { customRender: 'dataIndex' },
    align: 'center',
    search: false,
    width: 200,
    fixed: 'left'
  }, {
    title: '数据源字段名',
    dataIndex: 'dataColumn',
    scopedSlots: { customRender: 'dataColumn' },
    align: 'center',
    search: false,
    width: 200
  },
  {
    title: '排序',
    dataIndex: 'sortNo',
    scopedSlots: { customRender: 'sortNo' },
    align: 'center',
    search: false,
    width: 150
  },
  {
    title: '分组名称',
    dataIndex: 'groupName',
    scopedSlots: { customRender: 'groupName' },
    align: 'center',
    search: false,
    width: 150
  },
  {
    title: '分组排序号',
    dataIndex: 'groupSortNo',
    scopedSlots: { customRender: 'groupSortNo' },
    align: 'center',
    search: false,
    width: 150
  },
  {
    title: '查询列类型',
    dataIndex: 'columnType',
    scopedSlots: { customRender: 'columnType' },
    align: 'center',
    search: false,
    width: 150
  },
  {
    title: '是否必选列',
    dataIndex: 'isRequired',
    scopedSlots: { customRender: 'isRequired' },
    align: 'center',
    search: false,
    width: 150
  },
  {
    title: '用途标记',
    dataIndex: 'applicationFlag',
    scopedSlots: { customRender: 'applicationFlag' },
    align: 'center',
    search: false,
    width: 150
  },
  {
    title: '字典表类型Id',
    dataIndex: 'dictTypeId',
    scopedSlots: { customRender: 'dictTypeId' },
    align: 'center',
    search: false,
    width: 150
  },
  {
    title: '查询自定义数据源',
    dataIndex: 'querySource',
    scopedSlots: { customRender: 'querySource' },
    align: 'center',
    search: false,
    width: 150
  },
  {
    title: '默认列宽',
    dataIndex: 'width',
    scopedSlots: { customRender: 'width' },
    align: 'center',
    search: false,
    width: 150
  },
  {
    title: '默认是否显示',
    dataIndex: 'defaultIsShow',
    scopedSlots: { customRender: 'defaultIsShow' },
    align: 'center',
    search: false,
    width: 150
  },
  {
    title: '列对齐方式',
    dataIndex: 'align',
    scopedSlots: { customRender: 'align' },
    align: 'center',
    search: false,
    width: 150
  },
  {
    title: '是否为检索条件',
    dataIndex: 'search',
    scopedSlots: { customRender: 'search' },
    align: 'center',
    search: false,
    width: 150
  },
  {
    title: '文本超出是否省略号隐藏',
    dataIndex: 'ellipsis',
    scopedSlots: { customRender: 'ellipsis' },
    align: 'center',
    search: false,
    width: 200
  },
  {
    title: '是否是表头搜索',
    dataIndex: 'isGaugeOutfit',
    scopedSlots: { customRender: 'isGaugeOutfit' },
    align: 'center',
    search: false,
    width: 150
  },

  {
    title: '列编码',
    dataIndex: 'code',
    scopedSlots: { customRender: 'code' },
    align: 'center',
    width: 400,
    search: false
  },
  {
    title: '数据源表名称',
    dataIndex: 'dbTableName',
    scopedSlots: { customRender: 'dbTableName' },
    align: 'center',
    search: false,
    width: 150
  },
  {
    title: '数据源字段称',
    dataIndex: 'dbColumnName',
    scopedSlots: { customRender: 'dbColumnName' },
    align: 'center',
    search: false,
    width: 150
  }
]

const COLUMN_TYPE = {
  // 文本
  INPUT: { dictId: 0, dictText: '文本' },
  // 字典
  DICT: { dictId: 1, dictText: '字典' },
  // 时间
  DATE: { dictId: 2, dictText: '时间' },
  // 日期
  DATETIME: { dictId: 3, dictText: '日期' },
  // 数宇
  NUMBER: { dictId: 4, dictText: '数宇' },
  // 金额
  PRICE: { dictId: 5, dictText: '金额' },
  // 布尔
  BOOLEAN: { dictId: 6, dictText: '布尔' },
  // 自定义数据源
  DATASOURCE: { dictId: 7, dictText: '自定义数据源' },
  // 树形数据
  TREE_MODE: { dictId: 8, dictText: '树形数据' },
  // 前端自定义组建
  CUSTOM_ELEMENTS: { dictId: 9, dictText: '前端自定义组件' }
}
const COLUMN_TYPE_LIST = [
  COLUMN_TYPE.INPUT,
  COLUMN_TYPE.DICT,
  COLUMN_TYPE.DATE,
  COLUMN_TYPE.DATETIME,
  COLUMN_TYPE.NUMBER,
  COLUMN_TYPE.PRICE,
  COLUMN_TYPE.BOOLEAN,
  COLUMN_TYPE.DATASOURCE,
  COLUMN_TYPE.TREE_MODE,
  COLUMN_TYPE.CUSTOM_ELEMENTS
]
const APPLICATION_FLAG_LIST = [
  { dictId: 0, dictText: ' 用于查询列和条件' },
  { dictId: 1, dictText: '仅用于查询列' },
  { dictId: 2, dictText: '仅用于条件' },
  { dictId: 3, dictText: '页面传参' }
]
export {
  tableColumns,
  COLUMN_TYPE,
  COLUMN_TYPE_LIST,
  APPLICATION_FLAG_LIST
}
