// @ts-nocheck
// 主表格表头
const roleListTableColumns = [

  // {
  //   title: '角色编码',
  //   dataIndex: 'roleCode',
  //   align: 'center',
  //   width: 200,
  //   search: false
  // },
  {
    title: '角色名称',
    dataIndex: 'roleName',
    align: 'center',
    width: 200
  },
  {
    title: '角色描述',
    dataIndex: 'roleDesc',
    align: 'center'

  },
  {
    title: '用户数',
    dataIndex: 'userNum',
    scopedSlots: { customRender: 'userNum' },
    align: 'center',
    search: false,
    width: 200
  },
  {
    title: '菜单数',
    dataIndex: 'menuNum',
    scopedSlots: { customRender: 'menuNum' },
    align: 'center',
    search: false,
    width: 200
  },
  {
    title: '修改时间',
    dataIndex: 'updateOn',
    align: 'center',
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
    width: 400
  },
  {
    title: 'id',
    dataIndex: 'id',
    colSpan: 0,
    customRender: () => { return { attrs: { colSpan: 0 } } },
    search: false,
    width: 0
  }

]

const roleFunctionListTableColumns = [

  {
    title: '菜单名称',
    dataIndex: 'menuName',
    align: 'left',
    // width: 300,
    search: false
  },
  // {
  //   title: '菜单标识',
  //   dataIndex: 'id',
  //   align: 'center',
  //   width: 100,
  //   search: false
  // },
  {
    title: '标题',
    dataIndex: 'title',
    align: 'center',
    search: false,
    width: 400
  }

  // {
  //   title: '授权',
  //   dataIndex: 'authorize',
  //   scopedSlots: { customRender: 'authorize' },
  //   align: 'center',
  //   search: false,
  //   width: 200
  // },

]

const roleDataListTableColumns = [

  {
    title: '数据对象',
    dataIndex: 'dataName',
    align: 'center',
    search: false,
    width: 200
  },
  {
    title: '权限',
    dataIndex: 'dataScope',
    scopedSlots: { customRender: 'dataScope' },
    align: 'center',
    search: false,
    width: 200
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
    align: 'center',
    search: false,
    width: 200
  },
  {
    title: 'id',
    dataIndex: 'id',
    colSpan: 0,
    customRender: () => { return { attrs: { colSpan: 0 } } },
    search: false
  }

]

export {
  roleListTableColumns,
  roleFunctionListTableColumns,
  roleDataListTableColumns

}
