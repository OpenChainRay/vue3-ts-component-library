// @ts-nocheck
// 主表格表头
const departmentListTableColumns = [

  {
    title: '部门编码',
    dataIndex: 'departmentCode',
    align: 'center',
    search: false,
    width: 200
  },
  {
    title: '金蝶部门编码',
    dataIndex: 'kingDepartmentCode',
    scopedSlots: { customRender: 'kingDepartmentCode' },
    align: 'center',
    search: false,
    width: 200
  },
  {
    title: '部门名称',
    dataIndex: 'departmentName',
    scopedSlots: { customRender: 'departmentName' },
    align: 'center',
    width: 200
  },
  {
    title: '员工数量',
    dataIndex: 'employeeNum',
    align: 'center',
    search: false,
    width: 100
  },
  {
    title: '是否有效',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
    align: 'center',
    search: false,
    width: 100
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
    align: 'center',
    search: false,
    width: 100
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

export {
  departmentListTableColumns
}
