// @ts-nocheck
// 主表格表头
const menuListTableColumns = [

  {
    title: '菜单名称',
    dataIndex: 'menuName',
    align: 'center',
    scopedSlots: { customRender: 'menuName' },
    width: 200
  },
  {
    title: '所属系统名称',
    dataIndex: 'moduleName',
    align: 'center',
    width: 200,
    search: false
  },

  {
    title: '页面路径',
    dataIndex: 'path',
    align: 'center',
    ellipsis: true,
    search: false
  },

  {
    title: '是否有效',
    dataIndex: 'isValid',
    scopedSlots: { customRender: 'isValid' },
    align: 'center',
    search: false,
    fixed: 'right',
    width: 200
  },

  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
    align: 'center',
    search: false,
    fixed: 'right',
    width: 200
  },
  {
    title: 'id',
    dataIndex: 'id',
    colSpan: 0,
    customRender: () => { return { attrs: { colSpan: 0 } } },
    search: false,
    width: 0
  },
  {
    title: '角色数量',
    dataIndex: 'count',
    colSpan: 0,
    customRender: () => { return { attrs: { colSpan: 0 } } },
    align: 'center',
    search: false,
    width: 0
  }
]

export {
  menuListTableColumns
}
