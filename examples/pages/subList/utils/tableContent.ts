// @ts-nocheck
const SubListTableColumns = [
  {
    title: '系统名称',
    dataIndex: 'moduleName',
    align: 'center',
    search: false,
    width: 250
  },
  {
    title: '系统状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
    align: 'center',
    search: false,
    width: 250
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
    align: 'center',
    search: false,
    fixed: 'right',
    width: 200
  }
]
export {
  SubListTableColumns
}
