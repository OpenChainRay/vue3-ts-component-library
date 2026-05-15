// @ts-nocheck
// 主表格表头
const staffListTableColumns = [

  {
    title: '岗位代码',
    // dataIndex: 'id',
    scopedSlots: { customRender: 'id' },
    align: 'center',
    search: false,
    width: 200
  },
  {
    title: '岗位名称',
    dataIndex: 'positionName',
    scopedSlots: { customRender: 'positionName' },
    align: 'center',

    width: 200
  },
  {
    title: '员工数量',
    dataIndex: 'employeeNum',
    scopedSlots: { customRender: 'employeeNum' },
    align: 'center',
    search: false,
    width: 200
  },

  {
    title: '是否有效',
    dataIndex: 'isValid',
    scopedSlots: { customRender: 'isValid' },
    align: 'center',
    search: false,
    width: 200

  },
  // {
  //   title: '操作',
  //   dataIndex: 'action',
  //   scopedSlots: { customRender: 'action' },
  //   align: 'center',
  //   search: false,
  //   width: 200

  // },

  {
    title: '状态',
    dataIndex: 'status',
    colSpan: 0,
    customRender: () => { return { attrs: { colSpan: 0 } } },
    search: false,
    width: 0
  }

]

export {
  staffListTableColumns

}
