// @ts-nocheck
// 主表格表头
const personnelListTableColumns = [

  {
    title: '员工编码',
    dataIndex: 'employeeCode',
    align: 'center',
    width: 200
  },
  {
    title: '姓名',
    dataIndex: 'employeeName',
    scopedSlots: { customRender: 'employeeName' },
    align: 'center',
    width: 200
  },
  {
    title: '用户数量',
    dataIndex: 'userNum',
    scopedSlots: { customRender: 'userNum' },
    align: 'center',
    search: false,
    width: 200
  },
  {
    title: '部门',
    dataIndex: 'departmentName',
    scopedSlots: { customRender: 'departmentName' },
    align: 'center',

    width: 200
  },
  {
    title: '岗位',
    dataIndex: 'positionName',
    scopedSlots: { positionName: 'positionName' },
    align: 'center',

    width: 200
  },
  {
    title: '兼职部门',
    dataIndex: 'partTimeNum',
    scopedSlots: { customRender: 'partTimeNum' },
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
  // {
  //   title: '最后登录',
  //   dataIndex: 'lastLogin',
  //   align: 'center',
  //   search: false
  // },
  {
    title: '是否有效',
    dataIndex: 'status',
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
    title: '员工主键',
    dataIndex: 'id',
    colSpan: 0,
    customRender: () => { return { attrs: { colSpan: 0 } } },
    search: false,
    width: 0
  }
]

const relationListTableColumns = [

  {
    title: '员工编码',
    dataIndex: 'employeeCode',
    scopedSlots: { customRender: 'employeeCode' },
    align: 'center',
    width: 200,
    search: false
  },
  {
    title: '姓名',
    dataIndex: 'employeeName',
    align: 'center',
    width: 200,
    search: false
  },
  {
    title: '部门',
    dataIndex: 'departmentName',
    scopedSlots: { customRender: 'departmentName' },
    align: 'center',

    width: 200
  },
  {
    title: '岗位',
    dataIndex: 'positionName',
    scopedSlots: { customRender: 'positionName' },
    align: 'center'

  },

  {
    title: '默认',
    dataIndex: 'default',
    align: 'center',
    scopedSlots: { customRender: 'default' },
    search: false,
    width: 200,
    fixed: 'right'
  },

  // {
  //   title: '是否有效',
  //   dataIndex: 'isValid',
  //   scopedSlots: { customRender: 'isValid' },
  //   align: 'center',
  //   search: false,
  //   width: 200,
  //   fixed: 'right'
  // },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
    align: 'center',
    search: false,
    width: 200,
    fixed: 'right'
  },
  {
    title: '员工主键',
    dataIndex: 'employeeId',
    colSpan: 0,
    customRender: () => { return { attrs: { colSpan: 0 } } },
    search: false,
    width: 0
  }
]

const userRelationListTableColumns = [
  {
    title: '员工编码',
    dataIndex: 'employeeCode',
    scopedSlots: { customRender: 'Code' },
    align: 'center',
    width: 200,
    search: false
  },
  {
    title: '登录账号',
    dataIndex: 'userName',
    align: 'center',
    width: 200,
    search: false
  },

  {
    title: '用户姓名',
    dataIndex: 'fullName',
    align: 'center',
    width: 200,
    search: false
  },

  {
    title: '修改时间',
    dataIndex: 'updateOn',
    align: 'center',
    search: false,
    width: 200
  },

  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center',

    search: false,
    width: 200
  },
  {
    title: '员工主键',
    dataIndex: 'id',
    colSpan: 0,
    customRender: () => { return { attrs: { colSpan: 0 } } },
    search: false,
    width: 0
  }

]

export {
  personnelListTableColumns,
  relationListTableColumns,
  userRelationListTableColumns

}
