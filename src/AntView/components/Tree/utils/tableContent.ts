const classifyTableColumns = [
  { title: "序号", scopedSlots: { customRender: "serial" }, width: 100, maxWidth: 100, minWidth: 100, align: "center", fixed: true, search: false },
  { title: "是否启用", scopedSlots: { customRender: "erpCustomerCode" }, dataIndex: "status", width: 150, align: "center", fixed: true, search: false },
  { title: "产品类别", dataIndex: "productKind", scopedSlots: { customRender: "productKind" }, width: 0, search: false, ellipsis: true, align: "center", sorter: true },
  { title: "分类编码PMS", dataIndex: "categoryCode", width: 150, search: true, ellipsis: true, align: "center", sorter: true },
  { title: "分类名称", dataIndex: "categoryName", scopedSlots: { customRender: "categoryName" }, width: 150, search: true, ellipsis: true, align: "center", sorter: true },
  { title: "成本系数", dataIndex: "costFactor", scopedSlots: { customRender: "costFactor" }, width: 0, search: false, ellipsis: true, align: "center", sorter: true },
  { title: "分类编码产品中心", dataIndex: "productCenterCode", scopedSlots: { customRender: "productCenterCode" }, width: 200, search: false, ellipsis: true, align: "center", sorter: true },
  { title: "分类编码金蝶", dataIndex: "kingdeecode", scopedSlots: { customRender: "kingdeecode" }, width: 0, search: false, ellipsis: true, align: "center", sorter: true },
  { title: "金蝶税收编码", dataIndex: "taxCode", scopedSlots: { customRender: "taxCode" }, width: 0, search: false, ellipsis: true, align: "center", sorter: true },
  { title: "HALF-SPU数量", dataIndex: "halfSpuCount", scopedSlots: { customRender: "halfSpuCount" }, width: 140, search: false, ellipsis: true, align: "center", sorter: true },
  { title: "SPU数量", dataIndex: "spuCount", scopedSlots: { customRender: "spuCount" }, width: 140, search: false, ellipsis: true, align: "center", sorter: true },
  { title: "SKU数量", dataIndex: "skuCount", scopedSlots: { customRender: "skuCount" }, width: 140, search: false, ellipsis: true, align: "center", sorter: true },
  { title: "排序", dataIndex: "sortNum", scopedSlots: { customRender: "sortNum" }, width: 100, search: false, ellipsis: true, align: "center", sorter: true },
  { title: "修改人", dataIndex: "updateUser", width: 120, search: false, ellipsis: true, align: "center", sorter: true },
  { title: "修改时间", dataIndex: "updateOn", width: 200, search: false, ellipsis: true, align: "center", sorter: true }
]

const productKindOptions = [
  { value: 1, name: "FA自营产品" },
  { value: 2, name: "AL铝型材" },
  { value: 3, name: "代理品牌" },
  { value: 4, name: "代采品牌" }
]

export { classifyTableColumns, productKindOptions }
