// @ts-nocheck
const tableColumns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'serial' },
    align: 'center',
    search: false,
    width: 80,
    ellipsis: true
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
    align: 'center',
    width: 200,
    search: false
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
    align: 'center',
    width: 100,
    search: false
  },
  {
    title: '表格唯一编码',
    dataIndex: 'tableCode',
    scopedSlots: { customRender: 'tableCode' },
    align: 'center',
    width: 400,
    search: false
  },
  {
    title: '表格名称',
    dataIndex: 'tableName',
    scopedSlots: { customRender: 'tableName' },
    align: 'center',
    search: false
  },
  {
    title: '备注',
    dataIndex: 'remark',
    scopedSlots: { customRender: 'remark' },
    align: 'center',
    search: false
  },
  {
    title: '默认分页下拉选',
    dataIndex: 'pageInfo',
    scopedSlots: { customRender: 'pageInfo' },
    align: 'left',
    search: false
  },
  {
    title: '更新时间',
    dataIndex: 'updateOn',
    scopedSlots: { customRender: 'updateOn' },
    align: 'center',
    search: false
  }
]
export {
  tableColumns
}
