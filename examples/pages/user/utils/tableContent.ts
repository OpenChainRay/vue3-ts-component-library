// @ts-nocheck
// 主表格表头
const userListTableColumns = [

  {
    title: '用户名',
    dataIndex: 'userName',
    align: 'center',
    width: 200
  },
  {
    title: '用户全称',
    dataIndex: 'fullName',
    scopedSlots: { customRender: 'fullName' },
    align: 'center',
    width: 200
  },
  {
    title: '手机号码',
    dataIndex: 'mobile',
    scopedSlots: { customRender: 'mobile' },
    align: 'center',

    width: 200
  },
  // {
  //   title: '邮件地址',
  //   dataIndex: 'email',
  //   scopedSlots: { customRender: 'email' },
  //   align: 'center',
  //   search: false,
  //   width: 200
  // },

  {
    title: '员工姓名',
    dataIndex: 'employeeName',
    align: 'center',

    width: 200
  },

  {
    title: '修改时间',
    dataIndex: 'updateOn',

    align: 'center',
    search: false

  },
  {
    title: '最后登录',
    dataIndex: 'lastLoginTime',

    align: 'center',
    search: false
  },
  {
    title: '是否有效',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
    align: 'center',
    search: false,
    width: 200,
    fixed: 'right'
  },

  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
    align: 'center',
    search: false,
    width: 300,
    fixed: 'right'
  },
  {
    title: 'id',
    dataIndex: 'id',
    colSpan: 0,
    customRender: () => { return { attrs: { colSpan: 0 } } },
    search: false,
    width: 0
  }
  // {
  //   title: '部门',
  //   dataIndex: 'deptName',
  //   colSpan: 0,
  //   customRender: () => { return { attrs: { colSpan: 0 } } },
  //   width: 0

  // }

]

const roleListTableColumns = [

  {
    title: '角色名称',
    dataIndex: 'roleName',
    align: 'center',
    width: 500,
    search: false
  },
  {
    title: '角色描述',
    dataIndex: 'roleDesc',
    align: 'center',
    width: 500,
    search: false
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
    align: 'center',
    search: false,
    width: 400

  }
]

export {
  userListTableColumns,
  roleListTableColumns

}
