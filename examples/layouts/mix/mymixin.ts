// @ts-nocheck
import { logicOperate, ColumnType } from '@/utils/constant'

import UniversalContainer from '@/components/universal-container/index.vue'

import { upDateVwView } from '@/services/common'
import Sortable from 'sortablejs'

const myMixin = {
  components: {
    UniversalContainer
  },
  data() {
    return {
      mergeColumns: [],
      ColumnType,
      resizeObserver: {},
      cardheight: 500,
      lastSelectedRow: null, // 上一次选中的行
      selectedRow: null, // 当前选中的行
      customTotal: '', // 自定义合计
      // 视图配置变量
      tableType: 'openTiny', // 根据 tableType 刷新不同框架的表格  openTiny  和  ant  两个类型
      resourceButtonList: [], // 当前角色、当前页面的按钮权限
      // 视图变量
      dropConfig: {
        plugin: Sortable,
        column: true,
        row: false // 取消行拖拽
      },
      isDraging: false,
      tableLoading: false, // 表格loading
      allColumnQuote: [], // 表头总数据 (包括不显示的)
      AllColumns: [], // 所有列(包括未显示的)平铺
      viewConfig: {}, // 视图配置
      total: 0, // 总条数
      pageNum: 1, // 当前页码
      pageSize: 100, // 每页显示条数
      pageSizes: [50, 100, 150, 200], // 条数集合
      tableList: [], // 表格数据
      tableKey: -1, // 表格key
      align: 'right', // 可选值：['left', 'center', 'right']
      fetchData: {
        api: this.initTableData // 表格数据接口
      },
      searchObj: {}, // 搜索条件
      tableColumns: [], // 表头数据
      searchShow: false,// 搜索条件是否显示
      viewSearchDisabled: [], // 视图筛选 默认禁用的搜索表单
      defaultColumnsValue: {}, // 视图筛选 默认值
      searchType: '' // 默认空  如果是重置会被赋值
    }
  },
  watch: {
    AllColumns: {
      handler() {
        if (this.$refs.table) {
          this.$refs.table.loadData(this.tableList)
        }
      },
      deep: true
    }
  },
  mounted() {
    // console.log('mixin mounted')
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const cr = entry.contentRect
        if (cr.width !== 0 && cr.height !== 0) {
          this.cardheight = window.innerHeight - 150 - entry.contentRect.height - 12
        }
      }
      // if (this.resizeObserver) { this.resizeObserver.disconnect() }
    })
    this.resizeObserver = resizeObserver
    if (this.$refs.tContainer) {
      resizeObserver.observe(this.$refs.tContainer.$el || this.$refs.tContainer)
    }

    // 监听shift松开 清空之前的选中
    document.addEventListener('keyup', this.removeState)

    // 按钮权限：获取用户按钮资源  (查询当前路由的meunId)
    // this.getUserResourceFun()
  },
  destroyed() {
    // console.log('mixin destoryed')

    if (this.resizeObserver) { this.resizeObserver.disconnect() }
    // 卸载shift事件
    document.removeEventListener('keyup', this.removeState)
  },
  methods: {
    colspanMethod({ row, $rowIndex, column, data }) {
      // console.log(row, $rowIndex, column, data)
      let fields = []
      if (this.mergeColumns.length) {
        fields.push(this.mergeColumns[0])

        const cellValue = row[fields[0]]
        // 有值 看是否要合并
        if (cellValue) {
          fields = []
          this.mergeColumns.forEach(e => {
            fields.push(e)
    })
          return this.megerFunction(data, fields, column, $rowIndex, cellValue)
        }
      }
    },

    /**
* 功能：合并行或列，该函数返回计算后的值
*/
    megerFunction(data, fields, column, $rowIndex, cellValue) {
      const property = fields[0]
      if (~fields.indexOf(column.property)) {
        const prevRow = data[$rowIndex - 1]
        // 下一行数据
        let nextRow = data[$rowIndex + 1]
        // 如果前一行数据和 当前行数据相同 占0行0列
        if (prevRow && prevRow[property] === cellValue) {
          return { rowspan: 0, colspan: 0 }
        } else {
          let countRowspan = 1

          while (nextRow && nextRow[property] === cellValue) {
            nextRow = data[++countRowspan + $rowIndex]
          }

          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 }
          }
        }
      }
    },
    /**
     * 列合并
     * @param {*} v
     */
    rowMerge(v) {
      /**
       * {mergeColumnList: ["fe5e45f7-e382-4af3-8812-4d1f6f5c485d", "1e376602-c7bd-4f37-b8de-9aae94324f15",…]
        mergeKeyColumn:"bf7ec32d-2d42-4b23-bdcb-bf31518ff705"
    }
       */

      if (v.rowMerge) {
        // TODO 设置合并数据
        const mergeColumns = []
        const tempColums = []

        tempColums.push(v.rowMerge.mergeKeyColumn)
        v.rowMerge.mergeColumnList.forEach(e => {
          tempColums.push(e)
   })

        tempColums.forEach(e => {
          const item = this.tableColumns.find(colums => {
            return colums.code == e
    })
          if (item) {
            mergeColumns.push(item.dataIndex)
          }
        })
        console.log('mergeColumns', mergeColumns)
        this.mergeColumns = mergeColumns
      }
    },
    /**
   * 功能：按钮权限：获取用户按钮资源  (查询当前路由的meunId)
   * @param {Array} treeFlatten -- 平铺的树结构数据
   * @param {Array} fullPath -- 路由完整的key 例 /ams/middlegroundManage/middlegroundList
   */
    getUserResourceFun() {
      const currentPath = this.$route.path
      const treeFlatten = localStorage.getItem('treeFlatten')
      // console.log(this.$route, treeFlatten)
      if (treeFlatten) {
        const tree = JSON.parse(treeFlatten)
        const index = tree.findIndex(item => item.fullPath == currentPath)
        // console.log(index)
        if (index != -1) {
          const menuId = tree[index].id
          getUserResource({ menuId }).then((result) => {
            if (result.data.code && result.data.code == 200) {
              // console.log(result)
              this.resourceButtonList = result.data.data
            } else {
              this.$antmessage.error(result.data.msg)
            }
          }).catch((error) => { throw new Error(error) })
        }
      }
    },
    /**
* 列显示隐藏回掉
*/
    switchColumn() {
      // 重置列数据
      this.$refreshPage(this.$route.fullPath)
    },
    /**
     *
     * @param {*} columns  列数组
     * @param {*} allColumnQuote 所有列
     * @param {*} viewConfig 视图对象
     */
    async saveViewChange(columns, allColumnQuote, viewConfig) {
      columns.forEach((element, index) => {
        // 重新排序
        element.sortNo = index
  })
      // 将列上的顺序赋给保存所有列的数据
      columns.forEach(item => {
        allColumnQuote.forEach(it => {
          if (item.groupName == it.name) {
            it.list.forEach(item2 => {
              if (item2.columnTitle == item.columnTitle) {
                item2.sortNo = item.sortNo
                item2.sorter = true

                // 删除序号
                if (item2.dataIndex == 'serial') {
                  delete item2.sorter
                }
              }
            })
          }
   })
  })
      // 准备接口需要的数据格式
      const groups = []

      allColumnQuote.map((item, index) => {
        const obj = {
          name: item.name,
          sort: index,
          columnList: item.list

        }
        groups.push(obj)
        return obj
  })

      const params = {
        columns: groups,
        viewId: viewConfig.viewId
      }
      const updateResult = await upDateVwView(params).catch((error) => { throw new Error(error) })
      if (updateResult.data.code && updateResult.data.code == 200) {
        this.$antmessage.success(updateResult.data.msg)
      }
    },
    updateviewConfig(v) {
      // console.log(v, this.tableColumns, 'shitututut')
      this.viewConfig = v
      this.pageNum = v.currentPageNum * 1
      this.pageSize = v.currentPageSize * 1
      this.pageSizes = v.pageSizeOptions.map((item) => item * 1)
      this.tableKey++
    },
    dragTableTh(data) {
      console.log(data)
      this.isDraging = true
      this.tableLoading = true

      this.tableColumns.forEach(item => {
        if (item.dataIndex == data.column.property) {
          console.log(item)
          item.width = data.column.resizeWidth
        }
      })

      const requestGroups = []
      this.allColumnQuote.forEach(group => {
        if (group) {
          group.list.forEach(item => {
            if (item.dataIndex == data.column.property) {
              console.log(item)
              item.width = data.column.resizeWidth
            }
          })
          requestGroups.push({
            name: group.name,
            columnList: group.list
          })
        }
      })

      const params = {
        columns: requestGroups,
        viewId: this.viewConfig.viewId
      }
      clearInterval(this.clearId)
      this.clearId = setTimeout(() => {
        this.updata(params)
      }, 1000)
    },
    columnDropEnd({ oldIndex, newIndex }) {
      if (newIndex == oldIndex) return
      const headerDom = this.$refs.table.$el.querySelector('.tiny-grid-header__row')

      headerDom.childNodes.forEach((cell, index) => {
        const column = this.$refs.table.getColumnById(cell.attributes[0].value)
        if (column && column.property) {
          this.tableColumns.findIndex((remoteColumn) => {
            if (remoteColumn.dataIndex == column.property) {
              remoteColumn.sortNo = index
              return true
            }
            return false
          })
        }
      })

      const newColumns = JSON.parse(JSON.stringify(this.tableColumns))
      newColumns.sort((a, b) => {
        if (a.sortNo > b.sortNo) {
          return 1
        }
        return -1
      })
      this.tinySwitchColumnAndSaveData(newColumns, this.allColumnQuote, this.viewConfig)
    },
    tinySwitchColumnAndSaveData(columns, allColumnQuote, viewConfig) {
      columns.forEach((element, index) => {
        if (element.sortNo > -1) { element.sortNo = index }// 重新排序
  })
      columns.forEach(item => {
        allColumnQuote.forEach(it => {
          if (item.groupName == it.name) {
            it.list.forEach(item2 => {
              if (item2.columnTitle == item.columnTitle) {
                item2.sortNo = item.sortNo
                item2.sorter = true
                if (item2.dataIndex == 'serial') {
                  delete item2.sorter
                }
              }
            })
          }
        })
      })
      const groups = []

      allColumnQuote.map((item, index) => {
        const obj = {
          name: item.name,
          sort: index,
          columnList: item.list

        }

        groups.push(obj)
        return obj
  })

      const params = {
        columns: groups,
        tableId: viewConfig.tableId,
        viewId: viewConfig.viewId
      }
      this.updata(params)
    },
    async updata(params) {
      const updateResult = await upDateVwView(params).catch((error) => { throw new Error(error) }).finally(() => {
        this.isDraging = false
  })
      if (updateResult.data.code && updateResult.data.code == 200) {
        this.tableLoading = false
        this.$nextTick(() => {
          this.changeColumn = true
   })
      } else {
        this.tableLoading = false
        this.$nextTick(() => {
          this.changeColumn = true
   })
        this.$antmessage.error(updateResult.data.msg)
      }
    },
    refreshTable() {
      if (this.tableType === 'openTiny') {
        this.initTableData()
      } else if (this.tableType === 'ant') {
        this.$refs.table.refresh(true)
      }
    },
    searchMethods(params, searchType) {
      console.log(params, Object.keys(params), 'params')
      this.searchType = searchType
      if (Object.keys(params).length === 1 && params.filters.length === 0) {
        this.searchObj = {}
      } else {
        this.searchObj = params
      }
      // 搜索刷新表格默认 openTiny  根据 tableType 刷新不同框架的表格  tableType 设置为 ''  不刷新表格
      if (this.tableType === 'openTiny') {
        this.initTableData()
      } else if (this.tableType === 'ant') {
        this.$refs.table.refresh(true)
      }
      this.tableColumns.forEach(item => {
        // console.log(this.$refs[item.dataIndex], item.dataIndex)
        if (this.$refs[item.dataIndex]) {
          this.$refs[item.dataIndex][0].clear()
        }
      })
    },
    // 设置默认值
    setDefaultSearchFun() {
      const keys = Object.keys(this.defaultColumnsValue)
      // console.log(keys, this.viewSearchDisabled, 'viewSearchDisabled')
      const arr = this.AllColumns.filter((column) => keys.includes(column.dataIndex))
      let columns = arr
      if (this.searchType == '重置') {
        columns = arr.filter((column) => this.viewSearchDisabled.includes(column.dataIndex))
      }
      // console.log(columns, 'columns')
      const currentColumns = columns.map((item) => {
        let operator;
        // 0 配置视图信息   1 页面过滤
        item.operators = item.operators.filter((item) => item.showPosition.includes('1'))
        // 读取默认值  没有的话默认显示第一个操作符
        const index = item.operators.findIndex((operator) => operator.isDefaultShow)
        if (index > -1) {
          operator = item.operators[index].operatorId
        } else {
          operator = item.operators[0].operatorId
        }
        let value = this.defaultColumnsValue[item.dataIndex]
        if (this.searchType == '搜索') {
          const searchList = this.$refs.viewSerch.searchList
          const index = searchList.findIndex((column) => column.dataIndex == item.dataIndex)
          // console.log(searchList, index, 'searchList')
          if (index != -1 && searchList[index] != '') {
            value = searchList[index].searchValue
          }
        }
        return {
          operator: operator,
          relationType: 0,
          value: value,
          columnTitle: item.dataIndex,
          paramType: item.paramType
        }
      })
      console.log(currentColumns, 'currentColumns')
      currentColumns.forEach(columns => {
        this.columnSearch(columns, false)
      });
    },

    // 搜索数据过滤  paramType // "过滤条件类型:1.基础 (在filter里面);2.扩展(在search里面)"
    // 由于 paramType 是新增的  某些项目页面没有传 paramType 就默认是基础过滤
    columnSearch(obj, isexcelRefresh = true) {
      console.log(this.searchObj, obj)
      if (typeof this.searchObj.filters === 'undefined') {
        this.searchObj.filters = []
      }
      const filters = this.searchObj.filters
      if (obj.paramType == 1 || typeof obj.paramType === 'undefined') {
        const index = filters.findIndex(item => item.fieldName === obj.columnTitle)
        console.log(index)
        if (index != -1) {
          filters[index] = {
            ...obj,
            fieldName: obj.columnTitle
          }
          delete filters[index].columnTitle
          delete filters[index].paramType
          if (filters[index].value === '' || filters[index].value === undefined) {
            // delete filters[index]
            filters.splice(index, 1)
          }
        } else {
          filters.push({
            ...obj,
            fieldName: obj.columnTitle
    })
        }
      } else if (obj.paramType == 2) {
        this.searchObj[obj.columnTitle] = {
          ...obj
        }
        console.log(this.searchObj, 'searchObj')
        delete this.searchObj[obj.columnTitle].columnTitle
        delete this.searchObj[obj.columnTitle].paramType
        if (this.searchObj[obj.columnTitle].value === '' || this.searchObj[obj.columnTitle].value === undefined) {
          delete this.searchObj[obj.columnTitle]
        }
      }
      if (isexcelRefresh) { this.initTableData() }
    },
    doSearch(array) {
      console.log(array)
      this.searchObj = {}
      if (array.length) {
        array.forEach(item => {
          // TODO 根据relationType 封装查询代码
          this.trans2Search(item)
   })

        this.$refs.table.refresh(true)
      } else {
        this.searchObj = {}
        this.$refs.table.refresh(true)
      }
    },
    trans2Search(item) {
      switch (item.operator) {
        case logicOperate.BETWEEN.state:
          if (item.transform) {
            for (const key of Object.keys(item.transform)) {
              this.searchObj[key] = item.transform[key]
            }
          }

          break
        case logicOperate.IN.state:
        default:
          this.searchObj[item.columnTitle] = item.value
          // this.searchObj[item.columnTitle] = item.value

          break
      }
    },
    changeSearch() { // 打开过滤组件
      this.searchShow = !this.searchShow
    },
    // 清空之前的选中
    removeState() {
      this.lastSelectedRow = null
      this.selectedRow = null
    },
    // 监听单元格选中
    cellClick(args, event) {
      console.log(args, event)
      this.lastSelectedRow = this.selectedRow
      this.selectedRow = args.row
      if (this.lastSelectedRow && event.shiftKey) {
        const startIndex = this.tableList.indexOf(this.lastSelectedRow)
        const endIndex = this.tableList.indexOf(args.row)
        console.log(startIndex, endIndex)
        const [start, end] = startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex]
        // console.log(start, end)
        for (let i = start; i <= end; i++) {
          const row = this.tableList[i]
          this.$refs.table.setSelection(row, true)
        }
      }
    },
    numberToCurrencyNo(value, decimals = 4) {
      if (typeof value !== 'number' && !value) {
        return '-'
      }
      // 正则表达式 传参 插入参数 或者插入变量
      // 1、两侧的"/"需要去除。
      // 2、当中的转义字符\需要用"\\"。
      // 3、变量用字符串拼接。
      // 保留四位小数
      const regx = new RegExp('^(.*\\.\\d{' + decimals + '}).*$')
      // 获取整数部分
      // eslint-disable-next-line no-unreachable
      const intPart = Math.trunc(value)
      // 整数部分处理，增加,
      const intPartFormat = intPart
        .toString()
        .replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      // 预定义小数部分
      let floatPart = ''
      // 将数值截取为小数部分和整数部分
      const valueArray = value.toString().split('.')
      // console.log(valueArray)
      if (valueArray.length === 2) {
        // 有小数部分
        floatPart = valueArray[1].toString() // 取得小数部分
        // 循环添加0 补齐decimals位小数
        const decimalsLength = decimals - floatPart.length
        for (let i = 0; i < decimalsLength; i++) {
          floatPart += '0'
        }
        return (intPartFormat + '.' + floatPart).replace(regx, '$1')
      } else {
        floatPart = '.'
        for (let i = 0; i < decimals; i++) {
          floatPart += '0'
        }
        return (intPartFormat + floatPart).replace(regx, '$1')
      }
    },
    thousands(value) {
      if (typeof value !== 'number' && !value) {
        return '-'
      }
      // 获取整数部分
      // eslint-disable-next-line no-unreachable
      const intPart = Math.trunc(value)
      // 整数部分处理，增加,
      const intPartFormat = intPart
        .toString()
        .replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      // 预定义小数部分
      let floatPart = ''
      // 将数值截取为小数部分和整数部分
      const valueArray = value.toString().split('.')
      if (valueArray.length === 2) {
        // 有小数部分
        floatPart = valueArray[1].toString() // 取得小数部分
        // console.log(value, floatPart, decimalsLength, 'floatPart')
        // floatPart = `${floatPart}`.replace(/^(.*\.\d{2}).*$/, '$1') // 小数点保留四位
        return (intPartFormat + '.' + floatPart).replace(/^(.*\.\d{2}).*$/, '$1')
      } else {
        return (intPartFormat + floatPart).replace(/^(.*\.\d{2}).*$/, '$1')
      }
    },
    // 字典回显名称
    dictTextFun(list, value) {
      // console.log(list, value)
      if (list && list.length && (typeof value !== 'undefined' && value !== 'null' && value !== '')) {
        const index = list.findIndex((item) => item.dictId === value)
        if (index != -1) {
          return list[index].dictText
        } else {
          return value
        }
      } else {
        return value
      }
    },
    // 字典回显名称多项
    dictTextMultitermFun(list, value, key = 'dictId', label = 'dictText') {
      // console.log(list, value)
      if (
        list &&
        list.length &&
        (typeof value !== "undefined" && value !== "null" && value !== "")
      ) {
        let valueList = value.split(",");
        let valueTextList = [];
        valueList.forEach((item) => {
          const index = list.findIndex((item2) => item2[key] == item);
          if (index != -1) {
            valueTextList.push(list[index][label]);
          } else {
            valueTextList.push(item);
          }
        });
        return valueTextList.join(",");
      } else {
        return value;
      }
    },
    // 列表回显名称
    getText(list, value, key = 'dictId', label = 'dictText', row) {
      // console.log(list, value, key, label, 'getText', row)
      // const rowIndex = this.AllColumns.findIndex((item) => item.dataIndex == row.dataIndex)
      // console.log(rowIndex, this.AllColumns[rowIndex], 'AllColumns')
      // if (rowIndex == -1) return value
      // list = this.AllColumns[rowIndex].list
      if ((!list || list.length == 0)) return value
      const index = list.findIndex((item) => item[key] == value)
      // console.log(index, value, 'index')
      if (index !== -1) {
        return list[index][label]
      } else {
        return value
      }

    },
  }
}


export default myMixin
