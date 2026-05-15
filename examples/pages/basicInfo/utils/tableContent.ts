// @ts-nocheck
//  客户信息主表格表头
const customerInfoTableColumns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'serial' },
    // fixed: true,
    width: 70,
    align: 'center',
    search: false
  },
  {
    title: 'ERP客户编码',
    dataIndex: 'erpCustomerCode',
    width: 250,
    align: 'center',
    ellipsis: true,
    search: false
  },
  {
    title: '客户名称',
    dataIndex: 'customerName',
    width: 200,
    align: 'center',
    ellipsis: true
  },
  {
    title: '客户等级',
    dataIndex: 'rankName',
    width: 100,
    align: 'center',
    ellipsis: true,
    search: false
  },
  {
    title: '所属销售员',
    dataIndex: 'userName',
    width: 200,
    align: 'center',
    ellipsis: true,
    search: false
  },
  {
    title: '更新时间',
    dataIndex: 'updateOn',
    width: 200,
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

// 客户信息主表格测试数据
const customerInfoData = [
  {
    key: 1,
    inquiryPostCode: 'John Brown',
    customerName: 32,
    contactName: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
    id: 15
  },
  {
    key: 2,
    inquiryPostCode: 'John Brown23333',
    customerName: 32333,
    contactName: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
    id: 1512
  }
]

const containerInfoTableColumns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'serial' },
    // fixed: true,
    width: 70,
    align: 'center',
    search: false
  },
  {
    title: '容器编码',
    dataIndex: 'erpCustomerCode',
    width: 150,
    align: 'center',
    ellipsis: true,
    search: false
  },
  {
    title: '容器状态',
    dataIndex: 'erpCustomerCode',
    width: 100,
    align: 'center',
    ellipsis: true,
    search: false
  },
  {
    title: '仓库名称',
    dataIndex: 'erpCustomerCode',
    width: 200,
    align: 'center',
    ellipsis: true,
    search: false
  },
  {
    title: '容器类型',
    dataIndex: 'erpCustomerCode',
    width: 100,
    align: 'center',
    ellipsis: true,
    search: true
  },
  {
    title: '容器序号',
    dataIndex: 'erpCustomerCode',
    width: 100,
    align: 'center',
    ellipsis: true,
    search: true
  },
  {
    title: '规格尺寸',
    dataIndex: 'erpCustomerCode',
    width: 100,
    align: 'center',
    ellipsis: true,
    search: false
  },
  {
    title: '维护人',
    dataIndex: 'erpCustomerCode',
    width: 150,
    align: 'center',
    ellipsis: true,
    search: false
  },
  {
    title: '维护时间',
    dataIndex: 'erpCustomerCode',
    width: 200,
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

export {
  customerInfoTableColumns,
  customerInfoData,
  containerInfoTableColumns
}
