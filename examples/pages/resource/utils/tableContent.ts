// @ts-nocheck
// 主表格表头
const resourceListTableColumns = [

  {
    title: '菜单名称',
    dataIndex: 'menuName',
    align: 'center',
    search: false,
    width: 200
  },
  {
    title: '排序号',
    dataIndex: 'sortNum',
    scopedSlots: { customRender: 'sortNum' },
    align: 'center',
    search: false,
    width: 200
  },
  {
    title: '资源名称',
    dataIndex: 'resourceName',
    scopedSlots: { customRender: 'resourceName' },
    align: 'center',
    search: false,
    width: 200
  },
  {
    title: '操作描述',
    dataIndex: 'resourceDesc',
    scopedSlots: { customRender: 'resourceDescn' },
    align: 'center',
    search: false,
    width: 200
  },
  {
    title: 'api请求路径',
    dataIndex: 'apiUri',
    scopedSlots: { customRender: 'apiUri' },
    align: 'center',
    search: false,
    width: 200
  },
  {
    title: '商城通用接口',
    dataIndex: 'portalApi',
    align: 'center',
    search: false,
    width: 200
  },
  {
    title: '后台通用接口',
    dataIndex: 'adminApi',
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
    width: 200
  },
  {
    title: '资源主键',
    dataIndex: 'id',
    colSpan: 0,
    customRender: () => { return { attrs: { colSpan: 0 } } },
    search: false,
    width: 0
  },
  {
    title: '菜单主键',
    dataIndex: 'menuId',
    colSpan: 0,
    customRender: () => { return { attrs: { colSpan: 0 } } },
    search: false,
    width: 0
  }
]

export {
  resourceListTableColumns

}
