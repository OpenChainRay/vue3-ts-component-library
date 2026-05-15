/** Ant Design Table 兼容 props 表（历史 AtTable 遗留，供 ProTable utils 使用） */
const antDesignTableProps = {
  prefixCls: {},
  dropdownPrefixCls: {},
  rowSelection: {},
  pagination: {},
  size: {
    default: "default"
  },
  dataSource: [],
  components: {},
  columns: {},
  rowKey: {
    type: [String, Function],
    default: "key"
  },
  rowClassName: {},
  expandedRowRender: {
    type: Function
  },
  defaultExpandAllRows: {},
  defaultExpandedRowKeys: {},
  expandedRowKeys: {},
  expandIconAsCell: {},
  expandIconColumnIndex: {},
  expandRowByClick: {},
  loading: {
    default: false
  },
  locale: {},
  indentSize: {
    default: 20
  },
  customRow: {},
  customHeaderRow: {},
  useFixedHeader: {
    default: false
  },
  bordered: {
    default: false
  },
  showHeader: {
    default: true
  },
  footer: {},
  title: {},
  scroll: {},
  childrenColumnName: {
    default: "children"
  },
  bodyStyle: {
    type: Object
  },
  sortDirections: {},
  tableLayout: {},
  getPopupContainer: {},
  expandIcon: {},
  transformCellText: {}
}

export default antDesignTableProps
