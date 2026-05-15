const configurationViewPage = [
  { title: "当前视图", dataIndex: "isDefaultView", scopedSlots: { customRender: "radio" }, align: "center" },
  { title: "视图标题", dataIndex: "viewName", align: "center", search: true },
  { title: "视图类型", dataIndex: "viewType", align: "center", scopedSlots: { customRender: "viewTypeSolt" }, search: true, ellipsis: true },
  { title: "操作", scopedSlots: { customRender: "action" }, align: "center", search: false }
]

export { configurationViewPage }
