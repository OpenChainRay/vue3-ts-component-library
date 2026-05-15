// @ts-nocheck
const entryInspectionMainTableColumns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'serial' },
    // fixed: true,
    width: 70,
    align: 'center',
    search: false
  },
  {
    title: 'SKU编码',
    dataIndex: 'erpCustomerCode',
    width: 150,
    align: 'center',
    ellipsis: true,
    search: false
  },
  {
    title: '物料名称',
    dataIndex: 'erpCustomerCode',
    width: 100,
    align: 'center',
    ellipsis: true,
    search: false
  },
  {
    title: '所属入库单',
    dataIndex: 'erpCustomerCode',
    width: 200,
    align: 'center',
    ellipsis: true,
    search: false
  },
  {
    title: '组长审核时间',
    dataIndex: 'erpCustomerCode',
    width: 100,
    align: 'center',
    ellipsis: true,
    search: false
  },
  {
    title: '审核未通过原因',
    dataIndex: 'erpCustomerCode',
    width: 100,
    align: 'center',
    ellipsis: true,
    search: false
  },
  {
    title: '操作',
    width: '340px',
    scopedSlots: { customRender: 'action' },
    // fixed:'right',
    align: 'center',
    search: false
  }
]

const examineTableColumns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'serial' },
    // fixed: true,
    width: 50,
    align: 'center',
    search: false
  },
  {
    title: '报检单号',
    dataIndex: 'erpCustomerCode',
    width: 150,
    align: 'center',
    ellipsis: true,
    search: false
  },
  {
    title: '状态',
    dataIndex: 'erpCustomerCode',
    width: 150,
    align: 'center',
    ellipsis: true,
    search: false
  },
  {
    title: '暂存库位',
    dataIndex: 'erpCustomerCode',
    width: 200,
    align: 'center',
    ellipsis: true,
    search: false
  },
  {
    title: '质检进度',
    dataIndex: 'erpCustomerCode',
    width: 200,
    align: 'center',
    ellipsis: true,
    search: true
  },
  {
    title: '判定进度',
    dataIndex: 'erpCustomerCode',
    width: 100,
    align: 'center',
    ellipsis: true,
    search: true
  },
  {
    title: '操作',
    width: '340px',
    scopedSlots: { customRender: 'action' },
    // fixed:'right',
    align: 'center',
    search: false
  }
]

export {
  entryInspectionMainTableColumns,
  examineTableColumns
}
