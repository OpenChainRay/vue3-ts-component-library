/** 个人视图配置表头 */
const configurationViewPage = [
  { title: '当前视图', key: 'currentView', dataIndex: 'isDefaultView', align: 'center', width: 90, slots: { customRender: 'currentView' } },
  { title: '视图标题', key: 'viewName', dataIndex: 'viewName', align: 'center', ellipsis: true },
  { title: '视图类型', key: 'viewType', dataIndex: 'viewType', align: 'center', slots: { customRender: 'viewTypeSolt' }, ellipsis: true },
  { title: '操作', key: 'action', align: 'center', width: 120, slots: { customRender: 'action' } }
]

export { configurationViewPage }
