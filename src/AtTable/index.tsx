// @ts-nocheck
// import antTable from 'ant-design-vue/es/table'
// import { tableAllProps } from './utils/utils'
import tableAllProps from './utils/antDesignTableProps'
import { get } from 'lodash'
import { eventBus } from './utils/EventBus'
import './index.less'
import Vue from 'vue'
import debounce from 'lodash/debounce'
import atSelect from '../AtSelect'
import Sortable from 'sortablejs'
import virtualized from './utils/virtualized'
const minColWidth = 10

// 拖拽排序用的缓存数据
// 当前拖拽的列
let sourceItem = {}
// 拖到的目标列
let targetItem = {}
// 是否是有效拖动
let isDrop = false

export default {
  eventBus: eventBus,
  name: 'AtTable',
  components: {
    'at-select': atSelect
  },
  data () {
    return {
      needTotalList: [],
      selectedRows: [],
      selectedRowKeys: [],
      localLoading: false,
      localDataSource: this.dataSource,
      localScroll: (() => {
        const totalWidth = this.columns.reduce((total, item) => {
          return total + (item.width || 260)
        }, 0)
        return Object.assign({ y: this.selfHeight ? this.getTableScroll() : 'auto' }, { x: totalWidth }, this.scroll)
      })(),
      localPagination: Object.assign({}, this.pagination),
      localColumns: this.columns,
      // 存储表格onchange时的filters， sorter对象
      filters: {},
      sorter: {},
      searchFormModel: {},
      expandFlag: false,
      dateStartAndEnd: {},
      // 表格过滤项
      filterObj: {},
      // 一行过滤项显示数
      filterItemNum: this.search.filterItemNum || 4,
      filterLabelCol: this.search.filterLabelCol || {
        span: 7
      },
      filterWrapperCol: this.search.filterWrapperCol || {
        span: 15,
        offset: 1
      },
      columnsFilterAll: [],
      // 表格列筛选项
      columnsCheckAll: [],
      // 列筛选数据，从 columns 里面处理出来的，只有 title 和 value 字段
      columnsMenus: [],
      // 列筛选选中数据
      columnsSelectedMenus: [],
      indeterminate: true,
      searchBtnLoadingFlag: false,
      localShowPagination: this.showPagination,
      // 表头初始数据
      initialColumns: [],
      // 下面是虚拟列表变量
      start: 0,
      end: undefined,
      sizes: {}, // 尺寸映射（依赖响应式）
      renderData: [],
      // 兼容多选
      isCheckedAll: false, // 全选
      isCheckedImn: false, // 控制半选样式
      isHideAppend: false
    }
  },
  props: Object.assign({}, { ...tableAllProps }, {
    rowKey: {
      type: [String, Function],
      default: 'key'
    },
    data: {
      type: Function,
      required: false
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    showSizeChanger: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'small'
    },
    /**
     * alert: {
     *   show: true,
     *   clear: Function
     * }
     */
    alert: {
      type: [Object, Boolean],
      default: null
    },
    rowSelection: {
      type: Object,
      default: null
    },
    /** @Deprecated */
    showAlertInfo: {
      type: String | Boolean,
      default: false
    },
    showPagination: {
      type: String | Boolean,
      default: false
    },
    /**
     * enable page URI mode
     *
     * e.g:
     * /users/1
     * /users/2
     * /users/3?queryParam=test
     * ...
     */
    pageURI: {
      type: String | Boolean,
      default: false
    },
    search: {
      type: String | Boolean | Object,
      default: false
    },

    // 表格唯一key
    tableKey: {
      type: String
    },
    // 表格搜索表单ref
    formRef: {
      type: String
    },
    // 表头 th 是否可以拖动改变列宽
    drag: {
      type: Boolean,
      default: false
    },
    filterColumns: {
      type: Boolean,
      default: false
    },
    // 表格列拖动钩子函数
    dragTableTh: {
      type: Function,
      default: () => {}
    },
    // 搜索按钮钩子函数
    searchBtnSubmit: {
      type: Function,
      default: () => {}
    },
    // 搜索重置按钮钩子函数
    searchBtnReset: {
      type: Function,
      default: () => {}
    },
    // 点击搜索过滤栏重置按钮是否自动重载表格数据
    searchBtnResetOnload: {
      type: Boolean,
      default: true
    },
    // 是否需要根据一屏分辨率高度自适应计算表格高度
    selfHeight: {
      type: Boolean,
      default: true
    },
    // 标题栏 a-card props
    toolBarCardProps: {
      type: Object,
      default: () => {}
    },
    /**
       *  表格拖拽配置
       */
    dropConfig: {
      type: Object,
      default: () => {
        return {
          // 列拖拽  默认不启用
          column: false,
          // 行拖拽  默认不启用
          row: false
        }
      }
    },
    // 每一行的预估高度
    itemSize: {
      type: Number,
      default: 60
    },
    // 指定滚动容器
    scrollBox: {
      type: String
    },
    // 顶部和底部缓冲区域，值越大显示表格的行数越多
    buffer: {
      type: Number,
      default: 300
    },
    // 滚动事件的节流时间
    throttleTime: {
      type: Number,
      default: 10
    },
    // 是否获取表格行动态高度
    dynamic: {
      type: Boolean,
      default: true
    },
    // 是否开启虚拟滚动
    virtualized: {
      type: Boolean,
      default: false
    },
    // 是否是树形结构
    isTree: {
      type: Boolean,
      default: false
    }
  }),
  watch: {
    'search.filterWrapperCol' (val) {
      this.filterWrapperCol = val
    },
    'search.filterLabelCol' (val) {
      this.filterLabelCol = val
    },
    'search.filterItemNum' (val) {
      this.filterItemNum = val
    },
    'localPagination.current' (val) {
      this.pageURI && this.$router.push({
        ...this.$route,
        name: this.$route.name,
        params: Object.assign({}, this.$route.params, {
          pageNo: val
        })
      })
      // change pagination, reset total data
      this.needTotalList = this.initTotalList(this.columns)
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    pageNum (val) {
      Object.assign(this.localPagination, {
        current: val
      })
    },
    pageSize (val) {
      Object.assign(this.localPagination, {
        pageSize: val
      })
    },
    showSizeChanger (val) {
      Object.assign(this.localPagination, {
        showSizeChanger: val
      })
    },
    dataSource (val) {
      this.localDataSource = val
      if (this.selfHeight) {
        this.localScroll.y = this.scroll.y || this.getTableScroll()
      }
      if (!this.virtualized) {
        this.renderAllData()
      } else {
        this.doUpdate()
      }
    },
    columns (val) {
      const totalWidth = val.reduce((total, item) => {
        return total + (item.width || 260)
      }, 0)
      this.localScroll = Object.assign({ y: this.selfHeight ? this.getTableScroll() : 'auto' }, { x: totalWidth }, this.scroll)
      this.localColumns = val
    },
    showPagination (val) {
      this.localShowPagination = val
      // 是否分页状态更新以后需要重新加载表格分页状态
      const { pageNo } = this.$route.params
      const localPageNum = (this.pageURI && (pageNo && parseInt(pageNo))) || this.pageNum
      this.localPagination = (['auto', true].includes(this.localShowPagination) && Object.assign({}, this.localPagination, {
        current: localPageNum,
        pageSize: this.pageSize,
        showSizeChanger: this.showSizeChanger
      })) || false
      // 是否分页状态更新以后需要重新加载表格数据
      if (this.data) {
        this.loadData()
        // 绑定表格刷新事件
        eventBus.on(this.$props.tableKey, (bool = false) => {
          this.refresh(bool)
        })
      } else {
        this.localDataSource = this.dataSource
      }
    },
    virtualized: {
      immediate: true,
      handler (val) {
        if (!val) {
          this.renderAllData()
        } else {
          this.doUpdate()
        }
      }
    }
  },
  mounted () {
    const vueThis = this
    window.onresize = debounce(function () {
      const totalWidth = vueThis.localColumns.reduce((total, item) => {
        return total + (item.width || 260)
      }, 0)
      vueThis.localScroll = Object.assign({ y: vueThis.selfHeight ? vueThis.getTableScroll() : 'auto' }, { x: totalWidth }, vueThis.scroll)
    }, 500)
    if (this.dropConfig && this.dropConfig.column) {
      this.initDrop()
    }

    const appendEl = this.$refs.append
    this.$el.querySelector('.ant-table-body').appendChild(appendEl)
  },
  created () {
    // 深拷贝一份表头初始数据
    this.initialColumns = JSON.parse(JSON.stringify(this.columns))
    this.needTotalList = this.initTotalList(this.columns)

    const { pageNo } = this.$route.params
    const localPageNum = (this.pageURI && (pageNo && parseInt(pageNo))) || this.pageNum
    this.localPagination = (['auto', true].includes(this.localShowPagination) && Object.assign({}, this.localPagination, {
      current: localPageNum,
      pageSize: this.pageSize,
      showSizeChanger: this.showSizeChanger
    })) || false

    if (this.data) {
      this.loadData()
      // 绑定表格刷新事件
      eventBus.on(this.$props.tableKey, (bool = false) => {
        this.refresh(bool)
      })
    } else {
      this.localDataSource = this.dataSource
    }
    this.dragTable()
    this.initFilterColumns()

    const totalWidth = this.columns.reduce((total, item) => {
      return total + (item.width || 260)
    }, 0)
    this.localScroll = Object.assign({ y: this.selfHeight ? this.getTableScroll() : 'auto' }, { x: totalWidth }, this.scroll)
  },
  beforeDestroy () {
    if (this.$props.tableKey && this.data) eventBus.off(this.$props.tableKey)

    if (this.scroller) {
      this.scroller.removeEventListener('scroll', this.onScroll)
      window.removeEventListener('resize', this.onScroll)
    }
  },
  beforeUnmount () {
    this.beforeDestroy()
  },
  computed: {
    searchCount () {
      // 搜索栏收起时候展示4项
      return this.expandFlag ? this.columns.length : this.filterItemNum
    },
    showAlert () {
      return ((typeof this.alert === 'object' && this.alert !== null && this.alert.show) && typeof this.rowSelection.selectedRowKeys !== 'undefined') || this.alert
    },
    // 计算出每个item（的key值）到滚动容器顶部的距离
    offsetMap ({ rowKey, itemSize, sizes, localDataSource }) {
      console.log(rowKey, itemSize, sizes, localDataSource)
      if (!this.dynamic) return {}

      const res = {}
      let total = 0
      for (let i = 0; i < localDataSource.length; i++) {
        const key = localDataSource[i][rowKey]
        res[key] = total

        const curSize = sizes[key]
        const size = typeof curSize === 'number' ? curSize : itemSize
        total += size
      }
      return res
    }
  },
  methods: {
    ...virtualized,
    /**
     * 更新搜索表单字段值。
     */
    updateSearchFieldValue (field, value) {
      this.searchFormModel = Object.assign({}, this.searchFormModel, { [field]: value })
    },
    /**
     * 获取当前搜索表单值快照。
     */
    getSearchFormValues () {
      return Object.assign({}, this.searchFormModel)
    },
    /**
     * 表格头拖拽初始化
     * @param {*} thead 表头 DOM元素
     * @param {*} Sortable 拖拽插件
     */
    initDrop () {
      // 表头DOM
      let thead
      // 如果页面有多个表格  根据tableKey找表头
      if (this.tableKey) {
        thead = document.querySelectorAll(`.${this.tableKey} .ant-table-thead`)[0]
      } else {
        // 没有设置tableKey 通过class找表格
        thead = document.querySelectorAll('.ant-table-thead')[0]
      }
      // console.log(thead, 'thead')
      if (thead) {
        const _this = this
        Sortable.create(thead.childNodes[0], {
          sort: true,
          // fallbackClass: true,
          animation: 150, // 动画
          disabled: false, // boolean 定义是否此sortable对象是否可用，为true时sortable对象不能拖放排序等功能，为false时为可以进行排序，相当于一个开关；
          group: { name: 'name', pull: true, put: true },
          // 开始拖拽Function
          onStart: function (/** Event */) {
            // console.log(evt, '开始拖拽')
            _this.$emit('column-drop-start')
          },
          // 改变拖拽Function
          onEnd ({ newIndex, oldIndex }) {
            // console.log(newIndex, '结束拖拽')
            // console.log(newIndex, oldIndex)
            // 新index 是 开始的index 说明没任何改变
            if (newIndex === oldIndex) return
            const currRow = _this.columns.splice(oldIndex, 1)[0]
            _this.columns.splice(newIndex, 0, currRow)
            _this.$emit('column-drop-end')
          }
        })
      }
    },

    /**
     * 获取第一个表格的可视化高度
     * @param {*} extraHeight 额外的高度(表格底部的内容高度 Number类型)
     * @param {*} id 当前页面中有多个table时需要制定table的id
     */
    getTableScroll (extraHeight = 116, id = this.tableKey) {
      let tHeader = null
      if (id) {
        tHeader = document.getElementById(id) ? document.getElementById(id).getElementsByClassName('ant-table-thead')[0] : null
      } else {
        tHeader = document.getElementsByClassName('ant-table-thead')[0]
      }
      // 表格内容距离顶部的距离
      let tHeaderBottom = 0
      if (tHeader) {
        tHeaderBottom = tHeader.getBoundingClientRect().bottom
      }
      // 窗体高度-表格内容顶部的高度-表格内容底部的高度
      // const height = `calc(100vh - ${tHeaderBottom + extraHeight}px)`
      return document.body.clientHeight - tHeaderBottom - extraHeight
    },
    refreshLocalData (dataSource) {
      this.localDataSource = dataSource
    },
    /**
     * 表格重新加载方法
     * 如果参数为 true, 则强制刷新到第一页
     * @param Boolean bool
     */
    refresh (bool = false, filterObj) {
      bool && (this.localPagination = Object.assign({}, {
        current: 1, pageSize: this.pageSize
      }))
      if (filterObj) {
        this.localPagination = Object.assign({}, {
          current: 1, pageSize: this.pageSize
        })
        // const allFilterObj = Object.assign({ ...this.filterObj }, filterObj)
        this.filterObj = filterObj
        this.loadData(this.localPagination, filterObj)
      } else {
        this.loadData(this.localPagination, this.filterObj)
      }
    },
    /**
     * 加载数据方法
     * @param {Object} pagination 分页选项器
     * @param {Object} filters 过滤条件
     * @param {Object} sorter 排序条件
     */
    loadData (pagination, filters = this.filters, sorter = this.sorter) {
      if (this.data) {
        // this.filters = filters
        const localFilters = filters || {}
        this.sorter = sorter
        console.log(this.renderData, 'renderData')
        this.localLoading = true
        const parameter = Object.assign({
          pageNo: (pagination && pagination.current) ||
          (this.localShowPagination && this.localPagination.current) || this.pageNum,
          pageSize: (pagination && pagination.pageSize) ||
          (this.localShowPagination && this.localPagination.pageSize) || this.pageSize
        },
        (sorter && sorter.field && {
          sortField: sorter.field
        }) || {},
        (sorter && sorter.order && {
          sortOrder: sorter.order
        }) || {}, {
          ...filters
        }
        )

        const result = this.data(parameter)
        // 对接自己的通用数据接口需要修改下方代码中的 r.pageNo, r.totalCount, r.data
        // eslint-disable-next-line
        if ((typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {
          result.then(r => {
            if (r) {
              this.localPagination = (this.localShowPagination && Object.assign({}, this.localPagination, {
                ...localFilters,
                current: r.pageNo, // 返回结果中的当前分页数
                total: r.totalCount, // 返回结果中的总记录数
                showSizeChanger: this.showSizeChanger,
                pageSize: (pagination && pagination.pageSize) ||
                this.localPagination.pageSize
              })) || false
              // 为防止删除数据后导致页面当前页面数据长度为 0 ,自动翻页到上一页
              // debugger
              if (r.data.length === 0 && this.localShowPagination && this.localPagination.current > 1) {
                this.localPagination.current--
                // this.loadData(pagination, filters, sorter)
                this.loadData(this.localPagination, filters, sorter)
                return
              }
              // 这里用于判断接口是否有返回 r.totalCount 且 this.localShowPagination = true 且 pageNo 和 pageSize 存在 且 totalCount 小于等于 pageNo * pageSize 的大小
              // 当情况满足时，表示数据不满足分页大小，关闭 table 分页功能
              try {
                if ((['auto'].includes(this.localShowPagination) && r.totalCount <= (r.pageNo * this.localPagination.pageSize))) {
                  this.localPagination.hideOnSinglePage = true
                }
              } catch (e) {
                this.localPagination = false
              }

              // TODO
              //
              this.localDataSource = r.data // 返回结果中的数组数据
              this.localLoading = false
              // 虚拟滚动
              this.$nextTick(() => {
                this.initData()
              })
              return r.data
            } else {
              this.localLoading = false
              return {}
            }
          }).catch((error) => { throw new Error(error) })
        }
      }
    },
    // 分页按钮事件
    paginationChange (pagination, filters, sorter) {
      this.$emit('change', {
        pagination, filters, sorter
      })

      this.loadData(pagination, { ...filters, ...this.filterObj }, sorter)
    },
    initTotalList (columns) {
      const totalList = []
      columns && columns instanceof Array && columns.forEach(column => {
        if (column.needTotal) {
          totalList.push({
            ...column,
            total: 0
          })
        }
      })
      return totalList
    },
    /**
     * 用于更新已选中的列表数据 total 统计
     * @param selectedRowKeys
     * @param selectedRows
     */
    updateSelect (selectedRowKeys, selectedRows) {
      this.selectedRows = selectedRows
      this.selectedRowKeys = selectedRowKeys
      const list = this.needTotalList
      this.needTotalList = list.map(item => {
        return {
          ...item,
          total: selectedRows.reduce((sum, val) => {
            const total = sum + parseInt(get(val, item.dataIndex))
            return isNaN(total) ? 0 : total
          }, 0)
        }
      })
    },
    /**
     * 清空 table 已选中项
     */
    clearSelected () {
      if (this.rowSelection) {
        this.rowSelection.onChange([], [])
        this.updateSelect([], [])
      }
    },
    /**
     * 处理交给 table 使用者去处理 clear 事件时，内部选中统计同时调用
     * @param callback
     * @returns {*}
     */
    renderClear (callback) {
      if (this.selectedRowKeys.length <= 0) return null
      return (
        <a style="margin-left: 24px" onClick={() => {
          callback()
          this.clearSelected()
        }}>清空</a>
      )
    },
    renderAlert () {
      // 绘制统计列数据
      const needTotalItems = this.needTotalList.map((item) => {
        return (<span style="margin-right: 12px">
          {item.title}总计 <a style="font-weight: 600">{!item.customRender ? item.total : item.customRender(item.total)}</a>
        </span>)
      })

      // 绘制 清空 按钮
      const clearItem = (typeof this.alert.clear === 'boolean' && this.alert.clear)
        ? (
            this.renderClear(this.clearSelected)
          )
        : (this.alert !== null && typeof this.alert.clear === 'function')
            ? (
                this.renderClear(this.alert.clear)
              )
            : null

      // 绘制 alert 组件
      return (
        <a-alert showIcon={true} style="margin-bottom: 16px">
          <template slot="message">
            <span style="margin-right: 12px">已选择: <a style="font-weight: 600">{this.selectedRows.length}</a></span>
            {needTotalItems}
            {clearItem}
          </template>
        </a-alert>
      )
    },
    // 设置表格列拖动
    dragTable () {
      if (this.drag && this.dropConfig.column === false) {
        // 初始化列头宽度
        const thWidth = {}
        this.columns.forEach(item => {
          item.minWidth = item.minWidth || minColWidth
          thWidth[item.key] = item.width
        })
        const dragState = Vue.observable(thWidth)

        // 自定义列头渲染
        const resizeHeader = (h, props, children) => {
          // console.log(children, 'children')
          let refTh = null
          let refDraggable = null

          // 如果没有设置宽度或dataIndex，则不拖动
          const { key, ...restProps } = props
          // console.log(restProps, 'restProps')
          const col = this.columns.find(item => (item.dataIndex || item.key) === key) || {}
          // console.log(col, 'col')
          if (col && !col.width) {
            return <th {...restProps}>{children}</th>
          }
          // 拖动时实时更新列宽
          const onDrag = (x) => {
            dragState[key] = 0
            if (x < col.minWidth) {
              refDraggable.left = col.minWidth
              return
            }
            // 如果设置了总列宽，拖动的时候同时更新总列宽
            if (this.localScroll && this.localScroll.x) {
              this.localScroll.x += x - col.width
            }
            col.width = Math.max(x, col.minWidth)
            this.dragTableTh({ record: col, width: Math.max(x, col.minWidth) })
          }
          // 拖动结束后缓存最终的列宽
          const onDragStop = () => {
            dragState[key] = refTh.getBoundingClientRect().width
            // 列拖动结束后缓存
            if (this.columnStorage && this.$utils && this.$utils.setStorage && typeof window !== 'undefined') {
              this.$utils.setStorage(this.$route.path, { columns: this.columns })
            }
          }
          return (
            <th {...restProps} v-ant-ref={r => (refTh = r)} width={col.width} class="table-th-resize">
              {children}
              <vue-draggable
                class="table-drag-box"
                key={col.key}
                v-ant-ref={r => (refDraggable = r)}
                w={10}
                x={dragState[key] || col.width}
                z={1}
                axis="x"
                draggable={true}
                resizable={false}
                onDragging={onDrag}
                onDragstop={onDragStop}
              ></vue-draggable>
            </th>
          )
        }
        this.componentHeader = {
          header: {
            cell: resizeHeader
          }
        }
      }
    },
    // 设置表格行属性，同时合并行拖拽
    onCustomRow (record, index) {
      const customRow = this.customRow ? this.customRow(record, index) : {}
      const rowProps = {
        style: {
          cursor: this.dropConfig.row ? 'pointer' : null
        },
        props: {
          ...customRow.props
        },
        on: {
          ...customRow.on
        }
      }
      // 如果是开启行拖拽，则添加拖拽事件
      if (this.dropConfig.row) {
        rowProps.on = {
          ...rowProps.on,
          ...this.onRowDrag(record, index)
        }
      }
      return rowProps
    },
    // 行拖拽
    onRowDrag (record, index) {
      return {
        // 鼠标移入
        mouseenter: event => {
          // 设置行属性
          event.target.draggable = true
        },
        // 开始拖拽
        dragstart: event => {
          event.stopPropagation()
          // 得到源目标数据
          sourceItem = { ...record }
        },
        // 拖动元素经过的元素
        dragover: event => {
          event.preventDefault()
          event.target.parentNode.style.background = 'rgba(197, 197, 197, 0.5)'
        },
        // 离开拖动元素
        dragleave: event => {
          event.preventDefault()
          event.target.parentNode.style.background = ''
        },
        // 鼠标松开
        drop: event => {
          event.stopPropagation()
          event.target.parentNode.style.background = ''
          // 得到目标数据
          targetItem = { ...record }
          this.dragDataMove(this.localDataSource, index)
          this.$emit('drop', sourceItem, targetItem, isDrop)
          sourceItem = null
          targetItem = null
          isDrop = false
        }
      }
    },
    // 行拖拽结束后，数据处理
    dragDataMove (list = [], endIndex) {
      list.forEach(item => {
        if (item[this.rowKey] === sourceItem[this.rowKey]) {
          isDrop = list.some(children => children[this.rowKey] === targetItem[this.rowKey])
          // 如果是有效拖动，进行页面数据排序
          if (isDrop) {
            const index = list.findIndex(item => sourceItem[this.rowKey] === item[this.rowKey])
            // 删除拖拽行之前的位置
            list.splice(index, 1)
            // 拖拽的行添加到新的位置，这里 endIndex 使用官方监听的 index，保证上移下移位置正确
            list.splice(endIndex, 0, sourceItem)
          }
        }
        if (item.children && item.children.length > 0) {
          this.dragDataMove(item.children, endIndex)
        }
      })
    },
    // 默认情况下，没有配置dataIndex,width以及配置了fixed，filterColumn=false的列都不可以进行列的过滤操作
    isFilterColumn (columnItem) {
      return columnItem.dataIndex && !columnItem.fixed && columnItem.width && columnItem.width != 0 && (columnItem.filterColumn || columnItem.filterColumn == undefined)
    },
    initFilterColumns () {
      // 初始列筛选列选中项
      const defaultSelectedMenus = []
      // 保存全量的 columns，以保证子组件的更新不会更改父组件的值，这里只有初始化的时候才会调用
      const allColumns = [...this.localColumns]
      // 初始列筛选数据
      const menus = allColumns.filter(filterItem => {
        return this.isFilterColumn(filterItem)
      }).map(item => {
        defaultSelectedMenus.push(item.dataIndex)
        return {
          title: item.title,
          value: item.dataIndex
        }
      })
      this.columnsMenus = menus
      this.columnsSelectedMenus = defaultSelectedMenus
      // 全选状态同步
      this.indeterminate = defaultSelectedMenus.length !== menus.length
      this.columnsCheckAll = this.indeterminate ? [] : ['all']

      // 展示选中的列
      const selectedColumns = allColumns.filter(item => defaultSelectedMenus.includes(item.dataIndex) || !this.isFilterColumn(item))
      this.columnsFilterAll = allColumns
      this.localColumns = selectedColumns
    },
    // value 是选中的列的数组，例如：['actions', 'lastStatus', 'times']
    onColumnChange (value) {
      this.columnsSelectedMenus = value
      const selectedColumns = []
      this.columnsFilterAll.forEach(item => {
        if (value.includes(item.dataIndex) || !this.isFilterColumn(item)) {
          selectedColumns.push(item)
        }
      })
      // 同步更新全选的状态
      this.indeterminate = !!value.length && value.length < this.columnsFilterAll.length
      this.columnsCheckAll = value.length === this.columnsFilterAll.length ? ['all'] : []
      // 同步到最新的父组件 columns 数据
      this.localColumns = selectedColumns
      this.resetTableScrollX(selectedColumns)
      // this.$utils.setStorage(this.$route.path, { selectedMenus: this.selectedMenus })
    },
    onCheckAllColumns (value) {
      this.columnsCheckAll = value
      this.columnsSelectedMenus = value.length ? this.columnsMenus.map(item => item.value) : []
      this.indeterminate = false
      const newColumns = value.length ? this.columnsFilterAll.slice() : this.columnsFilterAll.filter(item => !this.isFilterColumn(item))
      this.localColumns = newColumns
      this.resetTableScrollX(newColumns)
    },
    filterColumnsMenus (columns) {
      return columns.map(item => {
        return (
          <a-menu-item style={{ padding: '4px 8px' }} key={item.value}>
            <a-checkbox value={item.value}>{item.title}</a-checkbox>
          </a-menu-item>
        )
      })
    },
    resetTableScrollX (columns) {
      const totalWidth = columns.reduce((total, item) => {
        return total + (item.width || 260)
      }, 0)
      this.localScroll.x = totalWidth
    },
    // 初始化表格
    antTable () {
      const props = {}
      const localKeys = Object.keys(this.$data)
      Object.keys(tableAllProps).forEach(k => {
        const localKey = `local${k.substring(0, 1).toUpperCase()}${k.substring(1)}`
        // console.log(localKeys, 'localKeys')
        if (localKeys.includes(localKey)) {
          props[k] = this[localKey]
          return props[k]
        }
        if (k === 'rowSelection') {
          if (this.showAlert && this.rowSelection) {
            // 如果需要使用alert，则重新绑定 rowSelection 事件
            props[k] = {
              ...this.rowSelection,
              selectedRows: this.selectedRows,
              selectedRowKeys: this.selectedRowKeys,
              onChange: (selectedRowKeys, selectedRows) => {
                this.updateSelect(selectedRowKeys, selectedRows)
                typeof this[k].onChange !== 'undefined' && this[k].onChange(selectedRowKeys, selectedRows)
              }
            }
            return props[k]
          } else if (!this.rowSelection) {
            // 如果没打算开启 rowSelection 则清空默认的选择项
            props[k] = null
            return props[k]
          }
        }
        this[k] && (props[k] = this[k])
        return props[k]
      })
      if (this.virtualized) {
        props.dataSource = this.renderData
      }

      return (
        <div class="at_table__wrapper" class={this.tableKey}>
          <a-table ref='antTable' class="at_table" {...{ props, scopedSlots: { ...this.$scopedSlots } }}
            onChange={this.paginationChange}

            components={ { ...this.componentHeader } }
            customRow={this.onCustomRow}
            onExpand={ (expanded, record) => { this.$emit('expand', expanded, record) } }>
            { Object.keys(this.$slots).map(name => (<template slot={name}>{this.$slots[name]}</template>)) }
          </a-table>
        </div>
      )
    },
    // 根据valueType参数名渲染指定组件（待完善）
    // https://procomponents.ant.design/components/schema/#valuetype-%E5%88%97%E8%A1%A8
    formTypeItem (valueType, props) {
      const fieldProps = props.fieldProps ? props.fieldProps : {}
      const fieldOn = props.fieldOn ? props.fieldOn : {}
      const fieldValue = this.searchFormModel[props.dataIndex]
      switch (valueType) {
        case 'dateRange': {
          // 重新格式化dateRange组件value值
          if (props.transform && fieldValue) {
            this.dateStartAndEnd = props.transform(fieldValue)
          }
          return (
            <a-range-picker
              {...{ props: fieldProps }}
              value={fieldValue}
              valueFormat={'YYYY-MM-DD'}
              onChange={(value) => {
                this.updateSearchFieldValue(props.dataIndex, value)
                if (props.transform && value) {
                  this.dateStartAndEnd = props.transform(value)
                }
                if (fieldOn.onChange) {
                  fieldOn.onChange(value)
                }
              }}
            ></a-range-picker>
          )
        }
        case 'treeSelect': {
          const propsObj = props.fieldProps
          return (
            <a-tree-select { ...{ props: propsObj }}
              value={fieldValue}
              onSelect = { props.fieldProps.onSelect || (() => {})}
              onSearch = { props.fieldProps.onSearch || (() => {})}
              onChange = { (value, ...args) => {
                this.updateSearchFieldValue(props.dataIndex, value)
                if (props.fieldProps.onChange) {
                  props.fieldProps.onChange(value, ...args)
                }
              }}
              onTreeExpand = { props.fieldProps.onTreeExpand || (() => {})}
            />
          )
        }
        case 'atSelect': {
          return (
            <at-select
              {...{ props: fieldProps, on: fieldOn }}
              value={fieldValue}
              onChange={(value, ...args) => {
                this.updateSearchFieldValue(props.dataIndex, value)
                if (fieldOn.onChange) {
                  fieldOn.onChange(value, ...args)
                }
              }}
            ></at-select>
          )
        }
        case 'aSelect': {
          return (
            <a-select
              {...{ props: fieldProps, on: fieldOn }}
              value={fieldValue}
              onChange={(value, ...args) => {
                this.updateSearchFieldValue(props.dataIndex, value)
                if (fieldOn.onChange) {
                  fieldOn.onChange(value, ...args)
                }
              }}
            ></a-select>
          )
        }
        default:
          break
      }
    },
    formSearchDomItem () {
      //  由于表头渲染是循环的columns  表头拖拽会影响表单的顺序布局
      // 所以columns 改为 initialColumns
      return this.initialColumns.filter((item) => {
        return item.search !== false
      }).map((item, index) => {
        return this.formSearchItemDom(item, index)
      })
    },
    // 根据columns配置项渲染指定组件
    formSearchItemDom (item, index) {
      const search = item.search
      const valueEnum = typeof item.valueEnum == 'function' ? item.valueEnum() : []
      const valueType = item.valueType
      const fieldProps = item.fieldProps ? item.fieldProps : {}
      const fieldOn = item.fieldOn ? item.fieldOn : {}
      const renderFormItem = item.renderFormItem ? item.renderFormItem : null
      let formSearhItemNode = null
      if (search !== false) {
        if (valueEnum && valueEnum.length != 0) {
          if (this.searchFormModel[item.dataIndex] === undefined && fieldProps.initialValue !== undefined) {
            this.updateSearchFieldValue(item.dataIndex, fieldProps.initialValue)
          }
          formSearhItemNode = (
            <a-select {...{ props: fieldProps, on: fieldOn }}
              value={this.searchFormModel[item.dataIndex]}
              onChange={(value, ...args) => {
                this.updateSearchFieldValue(item.dataIndex, value)
                if (fieldOn.onChange) {
                  fieldOn.onChange(value, ...args)
                }
              }}
              style={{ minWith: '150px' }}
              options={valueEnum}
            />
          )
        } else if (renderFormItem) {
          return (
            <a-col key={index} span={24 / this.filterItemNum} style={{ display: index < this.searchCount ? 'block' : 'none' }}>
              <a-form-item style={{ width: '100%' }} label={item.title} name={item.dataIndex} labelCol={this.filterLabelCol} wrapperCol={this.filterWrapperCol} >
                { renderFormItem(item, this.$createElement) }
              </a-form-item>
            </a-col>
          )
        } else if (valueType) {
          // {vDecorator: [ `${item.dataIndex}`,{} ]}
          formSearhItemNode = this.formTypeItem(valueType, item)
        } else {
          formSearhItemNode = (
            <a-input
              {...{ props: fieldProps, on: fieldOn }}
              value={this.searchFormModel[item.dataIndex]}
              onChange={(event) => {
                const value = event && event.target ? event.target.value : event
                this.updateSearchFieldValue(item.dataIndex, value)
                if (fieldOn.onChange) {
                  fieldOn.onChange(event)
                }
              }}
              placeholder="请输入"
            />
          )
        }
      }
      return (
        <a-col key={index} span={24 / this.filterItemNum} style={{ display: index < this.searchCount ? 'block' : 'none' }}>
          <a-form-item style={{ width: '100%' }} label={item.title} name={item.dataIndex} labelCol={this.filterLabelCol} wrapperCol={this.filterWrapperCol} >
            { formSearhItemNode }
          </a-form-item>
        </a-col>
      )
    },
    // 提交搜索过滤项
    searchSubmit: debounce(function (event) {
      event.preventDefault()
      this.searchBtnSubmit()
      const values = this.getSearchFormValues()
      const filterObj = { ...values, ...this.dateStartAndEnd }
      this.filterObj = filterObj
      this.localPagination.current = 1
      this.loadData(this.localPagination, filterObj)
    }, 500),
    // 搜索过滤项展开/收起
    searchToggle () {
      this.expandFlag = !this.expandFlag
    },
    // 搜索过滤项数据重置为空
    resetSearchValue: debounce(function (event) {
      event.preventDefault()
      this.dateStartAndEnd = {}
      this.searchFormModel = {}
      this.searchBtnReset()
      if (this.searchBtnResetOnload) {
        const values = this.getSearchFormValues()
        const filterObj = { ...values, ...this.dateStartAndEnd }
        this.filterObj = filterObj
        this.localPagination.current = 1
        this.loadData(this.localPagination, filterObj)
      }
    }, 500),
    // 内置搜索栏主体
    formSearchDom () {
      if (this.formSearchDomItem().length > (this.filterItemNum - 1)) {
        return (
          <a-card bordered={false}>
            <a-form ref={this.$props.formRef} model={this.searchFormModel} layout={'inline'}>
              <a-row gutter={24}>
                { this.formSearchDomItem() }
              </a-row>
              <a-row style={{ marginTop: '5px' }}>
                <a-col span={24} style={{ textAlign: 'right' }}>
                  <a-button loading={this.localLoading} type={'primary'} htmlType={'submit'} onClick={ this.searchSubmit }>
                    搜索
                  </a-button>
                  <a-button loading={this.localLoading} style={{ marginLeft: '8px' }} onClick={ this.resetSearchValue }>
                    重置
                  </a-button>
                  { this.formSearchDomItem().length != this.filterItemNum && (
                    <a style={{ marginLeft: '8px', fontSize: '12px' }} onClick={ this.searchToggle }>
                    {this.expandFlag ? '收起' : '展开'}<a-icon type={this.expandFlag ? 'up' : 'down'} />
                    </a>
                  )}
                </a-col>
              </a-row>
            </a-form>
          </a-card>
        )
      } else if (this.formSearchDomItem().length != 0) {
        return (
          <a-card bordered={false}>
            <a-form ref={this.$props.formRef} model={this.searchFormModel} layout={'inline'}>
              <a-row gutter={24}>
                { this.formSearchDomItem() }
                <div style={{ float: 'right' }}>
                  <a-button loading={this.localLoading} type={'primary'} htmlType={'submit'} onClick={ this.searchSubmit }>
                    搜索
                  </a-button>
                  <a-button loading={this.localLoading} style={{ marginLeft: '8px' }} onClick={ this.resetSearchValue }>
                    重置
                  </a-button>
                </div>
              </a-row>
            </a-form>
          </a-card>
        )
      }
    },
    // 表格列过滤下拉菜单
    filterTableDropdown () {
      if (this.filterColumns) {
        return (
          <a-col flex="100px">
            <a-card bordered={false} style={{ textAlign: 'center', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <a-dropdown trigger={['click']} placement={'bottomLeft'}>
                <a onClick={e => e.preventDefault()}> 列筛选
                  <a-icon type="down" />
                </a>
                <a-menu slot="overlay" style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* 全选控制 */}
                  <a-checkbox-group onChange={this.onCheckAllColumns} value={this.columnsCheckAll} style={{ borderBottom: '1px solid #dfdfdf', paddingLeft: '8px' }} >
                    <a-checkbox indeterminate={this.indeterminate} value="all" style={{ padding: '4px 8px' }}>
                      全选
                    </a-checkbox>
                  </a-checkbox-group>
                  {/* 字段列表 */}
                  <a-checkbox-group style={{ padding: '0 0 0 8px' }} value={this.columnsSelectedMenus} onChange={this.onColumnChange}>
                    {this.filterColumnsMenus(this.columnsMenus)}
                  </a-checkbox-group>
                </a-menu>
              </a-dropdown>
            </a-card>
          </a-col>
        )
      }
    }
  },
  render () {
    return (
      <div id={this.tableKey} class="table_wrapper">
        {/* 高级筛选栏 */}
        { this.search && this.formSearchDom() }
        {/* 标题栏 */}
        {(this.$slots.toolBarRender || this.filterColumns) && (<a-row type="flex">
          <a-col flex="auto">
            { this.$slots.toolBarRender && (
              <a-card {...{ props: this.toolBarCardProps }} bordered={false} >
                { this.$slots.toolBarRender }
              </a-card>
            )}
          </a-col>
          {this.filterTableDropdown()}
        </a-row>)}
        { this.showAlert ? this.renderAlert() : null }
        { this.antTable() }
        <div class="ant-table-append" ref="append" v-show="!isHideAppend">
          <slot name="append"></slot>
        </div>
      </div>
    )
  }
}
