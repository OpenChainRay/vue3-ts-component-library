<template>
  <div class="ant-table-view-toolbar" v-if="isShow">
    <!-- <AntViewRange :viewConfig="viewConfig" :tableCode='currentTableCode' :isCustomRequest="false" :columnMap="columnMap"
      :columns="columns" @customRviewRange="customRviewRange" @initViewData="initViewData">
      <span><a-icon type="profile" style='margin-right:5px;' />视图数据范围</span>
    </AntViewRange> -->
    <div class="shitu">

      <a-tooltip class="header-item" title="视图条件配置" placement="bottom">
        <!-- <a-icon type="profile" style="cursor:pointer" /> -->
        <AntViewRange :viewConfig="viewConfig" :tableCode='currentTableCode' :isCustomRequest="false"
          :columnMap="columnMap" :columns="columns" @customRviewRange="customRviewRange" @initViewData="initViewData">
          <span>
            <a-icon type="profile" style="cursor:pointer" />
          </span>
        </AntViewRange>
      </a-tooltip>
      <span style="color:#DFDFDF">｜</span>
      <!-- <a-select style="width:150px;border:none !important;" @change="handleChange" v-model='viewId'>
        <a-select-option v-for="(item, index) in ViewPageList" :key='index' :value='item.viewId'>
          {{ item.viewName }}
        </a-select-option>
        <div slot="dropdownRender" slot-scope='menu'>
          <v-nodes :vnodes="menu" />
          <a-divider style='margin:0px;' />
          <div style="padding: 4px 8px; cursor: pointer;" @click="openNewView">
            <a-icon type="plus" style='color: rgba(0, 0, 0, 0.65);' /><span style='color: rgba(0, 0, 0, 0.65);'>新建视图</span>
          </div>
          <div style="padding: 4px 8px; cursor: pointer;" @click="openPersonView">
            <span style='color: rgba(0, 0, 0, 0.65);'>配置个人视图</span>
          </div>
        </div>
      </a-select> -->
      <a-select
        v-model:value="viewId"
        style="width:150px;border:none !important;"
        placeholder="请选择视图"
        @change="handleChange">
        <a-select-option v-for="(item, index) in topLevelList" :key='index' :value="item.viewId">
          {{ item.viewName }}
        </a-select-option>
        <a-select-opt-group v-for="(item, index) in ViewPageList" :key='index' :label="item.groupName">
          <a-select-option v-for="(view, i) in item.viewOptionList" :key='i' :value="view.viewId">
            {{ view.viewName }}
          </a-select-option>
        </a-select-opt-group>
        <template #dropdownRender="dropdownSlot">
          <vnode-renderer :node="resolveDropdownMenu(dropdownSlot)" />
          <a-divider style='margin:0px;' />
          <div style="padding: 4px 8px; cursor: pointer;" @click="openNewView">
            <a-icon type="plus" style='color: rgba(0, 0, 0, 0.65);' /><span
              style='color: rgba(0, 0, 0, 0.65);'>新建视图</span>
          </div>
          <div style="padding: 4px 8px; cursor: pointer;" @click="openPersonView">
            <span style='color: rgba(0, 0, 0, 0.65);'>配置个人视图</span>
          </div>
        </template>
      </a-select>
    </div>
    <AntColumnDisplay v-if="isShowSetting" :viewConfig="viewConfig" v-model="columns"
      :allColumnQuote="allColumnQuoteCopy" />
    <!--新建视图弹框-->
    <a-modal class="addModel ant-view-modal-align-top" wrap-class-name="ant-view-modal-align-top" title="新建视图"
      :visible="openNewViewVisable" :footer='null' :destroy-on-close="true" :centered="false"
      :mask-closable="false" ok-text="确认" @ok="handleNewViewOk" cancel-text="取消" @cancel="handleNewViewCancel"
      width="70%">
      <div class="vheight">
        <edit-view ref="newView" :columnMap="columnMap" :viewId='viewConfig.viewId' :judge="VIEW_CHANGE_TYPE.add.value"
          :tableCode='currentTableCode' :columns="columns" :currentViewType="currentViewType"
          :viewTypeDisabled="viewTypeDisabled" :current-view-page-info="viewConfig.pageInfo"
          @handleNewViewCancel='handleNewViewCancel'
          @handleNewViewOk='handleNewViewOk' />
      </div>
    </a-modal>

    <!-- 配置列表：垂直居中基础上微调垂直偏移（见 .ant-view-modal-config-personal margin-top） -->
    <a-modal class="ant-view-modal-config-personal" wrap-class-name="ant-view-modal-config-personal" title="配置个人视图"
      :visible="personalView" :destroy-on-close="true" :mask-closable="false" :centered="false" ok-text="确认"
      @ok="handlePersonOk" cancel-text="取消" @cancel="handleConfigCancel" :confirmLoading="configLoading" width="1000px">
      <div>
        <configurationView ref="configurationView" :columnMap="columnMap" :viewId='viewConfig.viewId'
          :tableCode='currentTableCode' :columns="columns" :viewTypeDisabled="viewTypeDisabled"
          :current-view-page-info="viewConfig.pageInfo" :currentViewType="currentViewType" @refresh="refreshData" />
      </div>
    </a-modal>
  </div>
</template>

<script>
import { getViewList, changeCurrentView, getDictByTypeId, filterQuerySource, updateByView } from '../sevrices/configurationView'
import editView from './views/edit-view.vue'
import configurationView from './views/configurationView.vue'
import AntViewRange from '../AntViewRange/AntViewRange.vue'
import _ from 'lodash'
import AntColumnDisplay from '../AntColumnDisplay/index.vue'
import { getTableCode } from './getTableCode'
import {
  ColumnType,
  whiteColumns,
  VIEW_CHANGE_TYPE,
  defaultPageInfo,
  defaultPageSizeList,
  viewType
} from '../Constant/constant'

export default {
  name: 'AntTableView',
  props: {
    tableCode: {
      type: [String],
      required: true
    },
    //  table的列数组（Vue2 :tableColumns / v-model:tableColumns）
    tableColumns: {
      type: Array,
      default: () => []
    },
    // Vue3 v-model 默认绑定
    modelValue: {
      type: Array,
      default: () => []
    },
    // 所有列 包括未显示的
    allColumnQuote: {
      type: [Array],
      default: () => {
        return []
      }
    },
    // 自定义请求
    columnMap: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isShow: {
      type: Boolean,
      default: true
    },
    isShowSetting: {
      type: Boolean,
      default: true
    },
    isReview: {
      type: Boolean,
      default: false
    },
    // 设置视图类型的默认值
    viewTypeValue: {},
    // 是否禁用视图类型  默认false
    viewTypeDisabled: {
      type: Boolean,
      default: true
    },
    // 自定义列请求的size配置
    // 例子  customColumnSizeList: [{ code: '9a8d3994-6f68-4a54-a0f9-fd970fb26b03', pageSize: 100000 }]
    customColumnSizeList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  model: {
    prop: 'tableColumns',
    event: 'change'
  },
  components: {
    AntColumnDisplay,
    AntViewRange,
    configurationView,
    editView,
    /** 渲染 Select dropdownRender 传入的 menu VNode（Vue3） */
    VnodeRenderer: {
      props: {
        node: {
          default: null
        }
      },
      setup (props) {
        return () => props.node ?? null
      }
    }
  },
  data () {
    return {
      defaultPageInfo,
      VIEW_CHANGE_TYPE,
      allColumnQuoteCopy: [],
      AllColumns: [],
      columns: [],
      quote: 'quote',
      personalView: false,
      currentViewType: viewType.personal.value, // 默认是个人视图
      openNewViewVisable: false,
      searchShow: false,
      // 当前视图对象
      viewConfig: {},
      viewId: undefined,
      // 视图列表
      ViewPageList: [],
      topLevelList: [],
      viewRangeVisable: false,
      currentTableCode: '',
      configLoading: false
    }
  },
  watch: {
    viewTypeValue (newValue) {
      if (typeof newValue !== 'undefined') {
        this.currentViewType = newValue
      }
    }
  },
  created () {
    this.currentTableCode = getTableCode(this)
  },
  mounted () {
    if (typeof this.viewTypeValue !== 'undefined') {
      this.currentViewType = this.viewTypeValue
    }
    this.columns = this.resolveExternalColumns()
    this.initViewData()
  },
  methods: {
    /** 解析 Select 下拉菜单节点，兼容 ant-design-vue 3/4 */
    resolveDropdownMenu (slotProps) {
      if (!slotProps) {
        return null
      }
      return slotProps.menuNode ?? slotProps.menu ?? null
    },
    /** 匹配下拉 option 的 value，避免 number/string 不一致导致不显示文案 */
    matchViewOptionValue (currentId) {
      if (currentId === null || currentId === undefined) {
        return undefined
      }
      for (const item of this.topLevelList) {
        if (item.viewId == currentId) {
          return item.viewId
        }
      }
      for (const group of this.ViewPageList) {
        const options = group.viewOptionList || []
        for (const view of options) {
          if (view.viewId == currentId) {
            return view.viewId
          }
        }
      }
      return currentId
    },
    /** 解析外部列配置，兼容 Vue2 tableColumns 与 Vue3 modelValue */
    resolveExternalColumns () {
      if (Array.isArray(this.tableColumns)) {
        return this.tableColumns
      }
      if (Array.isArray(this.modelValue)) {
        return this.modelValue
      }
      return []
    },
    /** 同步列变更到父组件 */
    emitColumnsChange (columns) {
      this.$emit('change', columns)
      this.$emit('update:modelValue', columns)
    },
    customRviewRange (params) {
      console.log(params)
    },
    async getDict (typeID) {
      const params = {
        dictIds: [],
        dictKeys: [],
        dictTexts: [],
        typeId: typeID
      }
      const {
        data
      } = await getDictByTypeId(params).catch((error) => {
        throw new Error(error)
      })
      if (data.code && data.code == 200 && data.data) {
        const list = data.data
        return list.dictList
      }

      return []
    },

    /** 刷新table列和视图列表数据 */
    refreshData () {
      this.currentTableCode = getTableCode(this)
      if (typeof this.viewTypeValue !== 'undefined') {
        this.currentViewType = this.viewTypeValue
      }
      this.columns = this.resolveExternalColumns()
      this.initViewData()
    },
    handleConfigCancel () {
      this.personalView = false
      this.initViewData()
      // this.$refreshPage(this.$route.path)
    },
    async handlePersonOk () {
      const configData = this.$refs.configurationView.configData
      const ViewPageList = this.$refs.configurationView.ViewPageList
      console.log(configData, ViewPageList, 'ViewPageList')
      configData.viewList.forEach(item => {
        const viewOptionList = [] // 新的顺序
        ViewPageList.forEach((li, liIndex) => {
          if (item.groupName == li.viewTypeName) {
            li.sort = liIndex
            viewOptionList.push(li)
          }
        })
        item.viewOptionList = viewOptionList
      })
      console.log(configData, 'update')
      this.configLoading = true
      const result = await updateByView(configData).catch((error) => { throw new Error(error) })
      this.configLoading = false
      // console.log(result, this.viewConfig)
      if (result.data.code && result.data.code === 200) {
        this.personalView = false
        this.initViewData()
      } else {
        this.$antmessage.error(result.data.msg)
      }
    },
    handleNewViewOk () {
      this.openNewViewVisable = false
      this.initViewData()
    },
    changeSearch () {
      this.searchShow = !this.searchShow
    },
    handleNewViewCancel () {
      this.openNewViewVisable = false
    },
    openPersonView () {
      this.personalView = true
    },
    openNewView () {
      this.openNewViewVisable = true
    },
    // 自定义请求
    /* eslint-disable */
    async dataSourceRequest(current) {
      // console.log(current)
      const listMap = new Map(Object.entries(current)) // 当前页面自定义数据源
      const requestAll = {} // 需要请求的集合
      const resultList = {} // 请求成功的集合 key 请求名称 value list
      // console.log(listMap)
      for (const [key, value] of listMap) {
        // console.log(key, value)
        // if (value.custom === false) return
        // 取出需要请求的自定义数据源 | 去重
        if (value.custom) {
          const index = Object.values(requestAll).findIndex(key => key.name === value.request.name)
          if (index === -1) {
            requestAll[key] = value.request
          }
        }
      }
      // console.log(requestAll, 'requestAll')
      for (const key of Object.keys(requestAll)) {
        let resultData;
        let name;
        // function 需要调用 request()  promise 直接 await
        if (typeof current[key].request === 'function') {
          resultData = await current[key].request(current[key].params)
          name = current[key].request.name
        } else {
          resultData = await current[key].request
          name = current[key].name
        }
        // console.log(resultData, name)
        resultList[name] = resultData.data.data
      }
      // console.log(resultList)
      // 循环需要自定义的列表
      for (const [key, value] of listMap) {
        const index = this.AllColumns.findIndex((item) => item.dataIndex === key)
        // console.log(value.custom, this.AllColumns[index], this.AllColumns[index].dataIndex, key)
        if (value.custom && this.AllColumns[index] && this.AllColumns[index].dataIndex === key) {
          // console.log(this.AllColumns[index])
          const requestName = this.AllColumns[index].requestName
          // console.log(requestName)
          if (this.AllColumns[index].columnMap && this.AllColumns[index].columnMap.customList) {
            // transfrom 参数1  当前column  参数2 list
            this.AllColumns[index].columnMap.transfrom(this.AllColumns[index], resultList[requestName])
          } else {
            // console.log(resultList[requestName], 'resultList[requestName]')
            if (resultList[requestName]) {
              this.AllColumns[index].list = resultList[requestName]
            }
          }
        }
      }
      // console.log(this.AllColumns, '最新columns')
      // console.log(this.columnMap, '最新columnMap')
      this.$emit('update:AllColumns', JSON.parse(JSON.stringify(this.AllColumns)))
      this.updateTableColumnFun(this.AllColumns)
    },
    // 过滤相同的queryCode
    deWeightFun(arr) {
      const found = {};
      return arr.filter((item) => {
        const key = item.querySource.queryCode;
        if (found[key]) {
          // 如果在found对象中找到了key，则不添加到结果数组中
          return false;
        } else {
          // 否则标记为已找到，并添加到结果数组中
          found[key] = true;
          return true;
        }
      });
    },
    // querySource 请求
    getFilterQuerySource(querySourceList) {
      // console.log(querySourceList, 'querySourceList')
      // const requestList = Array.from(new Set(querySourceList))
      // 请求去重
      const requestList = this.deWeightFun(querySourceList)
      // console.log(requestList, 'requestList')
      requestList.forEach(async (row) => {
        let pageSize = 10
        const index = this.customColumnSizeList.findIndex((item) => item.code === row.code)
        if (index !== -1) {
          pageSize = this.customColumnSizeList[index].pageSize
        }
        const params = {
          param: {
            "orderColumns": [
              {
                "columnName": "",
                "isAsc": false
              }
            ],
            pageNum: 1,
            pageSize: pageSize,
            param: ''
          },
          queryCode: row.querySource.queryCode
        }
        const result = await filterQuerySource(params)
        if (result.data.code === 200 && result.data.data) {
          // const index = this.AllColumns.findIndex((item) => item.dataIndex == row.dataIndex)
          // 取出相同的queryCode的表头
          const list = this.AllColumns.filter((item) => {
            if (item.querySource && item.querySource.queryCode === row.querySource.queryCode) {
              return true
            } else {
              return false
            }
          })
          const data = result.data.data
          // console.log(list, data)
          list.forEach(element => {
            const index = this.AllColumns.findIndex((item) => item.dataIndex == element.dataIndex)
            if (index != -1) {
              if (!data.optionPage) {
                data.optionPage = {
                  list: [],
                  pageNum: 1,
                  pageSize: 50,
                  pages: 0,
                  total: 0
                }
              }
              // -------------------------------------
              this.$set(this.AllColumns[index], 'list', data.optionPage.list)
              this.$set(this.AllColumns[index], 'pageNum', data.optionPage.pageNum)
              this.$set(this.AllColumns[index], 'pageSize', data.optionPage.pageSize)
              this.$set(this.AllColumns[index], 'pages', data.optionPage.pages)
              this.$set(this.AllColumns[index], 'total', data.optionPage.total)
              this.$set(this.AllColumns[index], 'request', filterQuerySource)
              this.$set(this.AllColumns[index], 'selectName', 'label')
              this.$set(this.AllColumns[index], 'selectValue', 'code')
              // this.AllColumns[index].list = data.optionPage.list
              // console.log(data.optionPage.list, this.AllColumns[index], index, 'optionPageList')
              // this.AllColumns[index].list = data.optionPage.list
              // console.log(data.optionPage.list, this.AllColumns[index], index, 'optionPageList')
            }
          });

        }
      });
      this.$emit('update:AllColumns', JSON.parse(JSON.stringify(this.AllColumns)))
      this.updateTableColumnFun(this.AllColumns)
      // console.log(this.AllColumns, '最新columns')
      // this.$set(this.AllColumns, this.AllColumns)
      this.$emit('change', this.AllColumns)
    },
    // 树节点  是否禁用
    treeSelectable(tree) {
      for (let i = 0; i < tree.length; i++) {
        if (tree[i].children && tree[i].children.length > 0) {
          tree[i].disabled = true
          this.treeSelectable(tree[i].children)
        } else {
          tree[i].disabled = false
        }
      }
    },
    setColumnsList(column, list) {
      // console.log(column,list)
      column.list = list
    },
    async initViewData() {
      const result = await getViewList(this.currentTableCode).catch((error) => { throw new Error(error) })
      // console.log(result, this.viewConfig)
      if (result.data.code && result.data.code === 200) {
        // 将当前table的所有视图数据存储到本地
        const responseData = result.data.data
        // console.log(responseData)
        this.viewConfig = responseData.currentView
        const { viewList, topLevelList } = this.viewListFilter(responseData.viewList)
        this.ViewPageList = viewList
        this.topLevelList = topLevelList
        this.viewId = this.matchViewOptionValue(responseData.currentView.viewId)
        this.formatView(responseData.currentView)
      } else {
        this.$antmessage.error(result.data.msg)
      }
    },
    // 视图分组数据过滤 isGroup	是否分组  true 是分组  false 不是分组
    viewListFilter(list) {
      const viewList = [];
      const topLevelList = [];
      list.forEach((item) => {
        if (item.isGroup === true) {
          viewList.push(item);
        } else {
          item.viewOptionList.forEach(element => {
            topLevelList.push(element);
          });
        }
      });
      return {
        viewList,
        topLevelList,
      };
    },
    formatView(currentView) {
      const columns = currentView.columns || []
      // const columns = JSON.parse(JSON.stringify(currentView.columns))
      const arr = []
      const Alldata = []
      for (const group of columns) {
        // console.log(object[key], 'object[key]')
        group.columnList.map(it => {
          // columnTitle
          it.checked = false
          if (it.defaultIsShow == 1 && (it.applicationFlag == 0 || it.applicationFlag == 1)) {
            it.checked = true
          }
          return it
        })
        Alldata.push(group)

        const a = {
          name: group.name,
          sortNo: group.sortNo,
          list: group.columnList
        }
        arr.push(a)
      }
      // 分组数据
      //增加根据group 的sortNo进行排序
      arr.sort((a, b) => a.sortNo - b.sortNo);

      this.allColumnQuoteCopy = arr
      // console.log(arr, Alldata, 'Alldata')
      this.$emit('update:allColumnQuote', arr)
      this.AllColumns = []
      let AllColumns = this.AllColumns// 所有列的数据 包括未显示的
      let querySourceList = []
      const listAll = _.cloneDeep(Alldata)
      // ;0-->文本 ，1->字典 2-->日期 ，3-->日期时间 ，4-->数宇 5-->金额 ，6-->布尔 ，7--»自定义数据源’
      listAll.forEach(item => {
        // applicationFlag  0  用于查询列和条件 1 仅用于查询列  2  仅用于条件 3  页面传参
        // TODO 增加item.defaultIsShow 判断 &&  applicationFlag 0 1 显示
        item.columnList.forEach(col => {
          AllColumns.push(col)
        })
      })
      AllColumns.forEach(async (item) => {
        item.searchValue = ''
        // if (item.columnTitle === '报价项编码') {
        //   item.querySource = {
        //     queryCode: '5befab88-747f-407b-9915-3ab2a21a8c61'
        //   }
        //   item.interactiveType = 2
        // }
        // querySource 列信息里面包含自定义数据源编码  拿这个编码查询自定义数据源接口  获取下拉
        if (item.querySource && item.querySource.queryCode) {
          // querySourceList.push(item.querySource)
          querySourceList.push(item)
        } else {
          // 自定义请求  传参方式
          if (item.columnType === ColumnType.DataSource || item.columnType === ColumnType.TreeMode) {
            // console.log(this.columnMap, this.currentTableCode, item, this.columnMap[this.currentTableCode][item.dataIndex])
            if (!this.columnMap[this.currentTableCode] || !this.columnMap[this.currentTableCode][item.dataIndex]) {
              return
            }
            // if (item.columnTitle === '产品部门') {
            //   console.log(this.columnMap[this.currentTableCode][item.dataIndex])
            // }
            // 将自定义属性赋值当前表头
            item.columnMap = this.columnMap[this.currentTableCode][item.dataIndex]
            if (this.columnMap[this.currentTableCode][item.dataIndex].custom) {
              item.requestName = typeof item.columnMap.request === 'function' ? item.columnMap.request.name : item.columnMap.name
            } else {
              // console.log(this.columnMap[this.currentTableCode][item.dataIndex].list)
              item.list = this.columnMap[this.currentTableCode][item.dataIndex].list
            }
            // item.list = []
          }
        }
        switch (item.columnType) {
          case ColumnType.Dict:
            // 查找字典表 获取数据
            // item.list = await this.getDict(item.dictTypeId)
            if (item.viewDict) {
              item.list = item.viewDict.options // 后端直接返回了字典列表
            } else {
              item.list = [] // 后端直接返回了字典列表
            }
            break
          default: break
        }

        item.sorter = true
        if (item.dataIndex === 'action') {
          item.fixed = 'left'
        }
        if (item.dataIndex === 'serial' ||
          item.dataIndex === 'finishCount' ||
          item.dataIndex === 'allCount' ||
          item.dataIndex === 'notQuoteCount') {
          // 序号不需要排序
          item.sorter = false
        }
        if (item.search === 1) {
          item.search = true
        } else {
          item.search = false
        }
        if (item.width === undefined) {
          item.width = 200
        }
        if (item.minWidth === undefined) {
          item.minWidth = 10
        }
      })

      // 更新当前列数据
      this.updateTableColumnFun(AllColumns)

      // this.columns = tableColumns
      const codeIndex = Object.keys(this.columnMap).findIndex(code => code === this.currentTableCode)
      // console.log(codeIndex, 'codeIndex')
      if (codeIndex !== -1) {
        // console.log(this.columnMap, this.columnMap[this.currentTableCode], 'codeIndex')
        const columnMap = this.columnMap[this.currentTableCode]
        for (const key in columnMap) {
          if (Object.prototype.hasOwnProperty.call(columnMap, key)) {
            // const element = columnMap[key];
            const falg = AllColumns.findIndex((item) => item.dataIndex === key)
            // console.log(falg, key)
            if (falg == -1) {
              delete columnMap[key];
            }
          }
        }
        // console.log(this.columnMap[this.currentTableCode])
        this.dataSourceRequest(this.columnMap[this.currentTableCode])
      }
      // console.log(querySourceList, 'querySourceList')
      if (querySourceList.length) {
        this.getFilterQuerySource(querySourceList)
      }
      // console.log(this.columns, 'columns')
      this.$emit('update:AllColumns', AllColumns)
      this.emitColumnsChange(this.columns)

      //
      this.formatPageInfo(currentView)

      // 向外暴露视图基本信息
      this.$emit('updateviewConfig', currentView)
      this.$emit('refresh')
    },

    // 更新当前列数据
    updateTableColumnFun(AllColumns) {
      //auto 对动态列和本地列有问题
      const tableColumns = []// 当前列的数据
      // ;0-->文本 ，1->字典 2-->日期 ，3-->日期时间 ，4-->数宇 5-->金额 ，6-->布尔 ，7--»自定义数据源’
      AllColumns.forEach(item => {
        // applicationFlag  0  用于查询列和条件 1 仅用于查询列  2  仅用于条件 3  页面传参
        // TODO 增加item.defaultIsShow 判断 &&  applicationFlag 0 1 显示
        if (item.defaultIsShow && (item.applicationFlag == 0 || item.applicationFlag == 1)) {
          // 添加column
          tableColumns.push(item)
        }
      })
      const prevColumns = Array.isArray(this.columns) ? this.columns : []
      prevColumns.forEach(column => {
        column.slots = {
          title: column.dataIndex + 'Title'
        }
        const index = whiteColumns.findIndex(whiteColumn => {
          return whiteColumn.dataIndex === column.dataIndex
        })
        if (index !== -1) {
          tableColumns.splice(0, 0, column)
        }
      })
      tableColumns.sort((a, b) => { // 排序
        return a.sortNo - b.sortNo
      })

      this.columns = tableColumns
    },
    formatPageInfo(currentView) {
      const defaultList = defaultPageSizeList
      const list = []
      let currentPageSize = defaultPageSizeList[0]
      let currentPageNum = this.defaultPageInfo.currentPageNum
      if (currentView.pageInfo) {
        currentPageNum = currentView.pageInfo.currentPageNum
        currentView.pageInfo.pageSizeList.forEach(x => {
          if (x.isCurrent) {
            currentPageSize = x.num
          }
          list.push(x.num + '')
        })
      } else {
        currentView.pageInfo = this.defaultPageInfo
      }
      currentView.currentPageNum = currentPageNum
      currentView.currentPageSize = currentPageSize
      if (list.length > 0) {
        currentView.pageSizeOptions = list
      } else {
        currentView.pageSizeOptions = defaultList
      }
    },
    /**
    * 切换视图
    * @param val  视图id
    */
    async handleChange(val) {
      // 增加loading方法
      this.$emit('updateLoading')
      const result = await changeCurrentView(val).catch((error) => { throw new Error(error) })
      if (result.data.code && result.data.code == 200) {
        // localStorage.setItem(this.cacheIdKey, val)
        // scm项目  切换视图不要提示
        // this.$antmessage.success(result.data.msg)

        // TODO 刷新table  刷新视图
        this.initViewData()
      } else {
        this.$antmessage.error(result.data.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.modalContent {
  width: 100%;
  height: auto;
  border: 1px solid #f0f0f0;
  display: flex;
}

.leftContent {
  width: 75%;
  border-right: 1px solid #f0f0f0;
}

.rightContent {
  width: 30%;
  max-height: 600px;
  overflow-y: auto;
}

.checkGroup {
  width: 100%;
  padding: 1% 2%;
  display: flex;
  flex-wrap: wrap;
}

.phover {
  width: 100%;
  height: 30px;
  line-height: 30px;
  display: flex;
  justify-content: space-between;
}

.phover:hover {
  background: #eaf2ff;
}

.left_title {
  color: #666;
  padding-left: 2%;
  margin-bottom: 0px;
  margin-top: 10px;
}

.blue {
  color: #00508f;
}

.ant-table-view-toolbar {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  flex-shrink: 0;
}

.shitu {
  border: 1px solid #dfdfdf;
  display: inline-flex;
  align-items: center;
  padding: 0 0 0 10px;
  border-radius: 4px;
  flex-shrink: 0;
}

.shitu :deep(.ant-select-selection ){
  border: none;
}

.vheight {
  max-height: 730px;
  overflow-y: auto;
}

.vheight::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.2);
  // background-color:rgba(0,0,0,.06);
  -webkit-box-shadow: inset -2px 0 0 #fff, inset 1px 0 0 hsla(0, 0%, 100%, 0.9),
    inset 0 -1px 0 hsla(0, 0%, 100%, 0.9), inset 0 1px 0 hsla(0, 0%, 100%, 0.9);
}

// 滚动条
.vheight::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8px;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 8px;
}

.vheight::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 8px;
  height: 20px;
  -webkit-box-shadow: inset -2px 0 0 #fff, inset 1px 0 0 #fff,
    inset 0 -1px 0 hsla(0, 0%, 100%, 0.9), inset 0 1px 0 hsla(0, 0%, 100%, 0.9);
  background-color: rgba(0, 0, 0, 0.1);
}

.vheight::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  border-radius: 8px;
  -webkit-box-shadow: inset -2px 0 0 #fff, inset 1px 0 0 hsla(0, 0%, 100%, 0.9),
    inset 0 -1px 0 hsla(0, 0%, 100%, 0.9), inset 0 1px 0 hsla(0, 0%, 100%, 0.9);
  background-color: rgba(15, 15, 15, 0.09);
}

.addModel :deep(.ant-modal ){
  margin-top: -70px !important;
}

:deep(.ant-modal-content ){
  min-width: 900px;
}

/* 针对下拉框的滚动条样式 - 提高优先级和准确性 */
// :deep(.ant-select-dropdown ){
//   /* 限制下拉框最大高度 */
//   .ant-select-dropdown-menu {
//     max-height: 200px !important;
//   }

//   /* 滚动条整体样式 */
//   .ant-select-dropdown-menu::-webkit-scrollbar {
//     width: 8px !important;
//     height: 8px !important;
//   }

//   /* 滚动条轨道 */
//   .ant-select-dropdown-menu::-webkit-scrollbar-track {
//     background: #f1f1f1 !important;
//     border-radius: 4px !important;
//   }

//   /* 滚动条滑块 */
//   .ant-select-dropdown-menu::-webkit-scrollbar-thumb {
//     background: #c1d4f5 !important;
//     border-radius: 4px !important;
//   }

//   /* 滚动条滑块悬停状态 */
//   .ant-select-dropdown-menu::-webkit-scrollbar-thumb:hover {
//     background: #1E71EE !important;
//   }
// }

/* 备用方案 - 更具体的选择器 */
:deep(.ant-select-dropdown-menu::-webkit-scrollbar ){
  width: 8px !important;
  height: 8px !important;
}

:deep(.ant-select-dropdown-menu::-webkit-scrollbar-track ){
  background: #f1f1f1 !important;
  border-radius: 4px !important;
}

:deep(.ant-select-dropdown-menu::-webkit-scrollbar-thumb ){
  background: #E3E3E6 !important;
  border-radius: 4px !important;
}

:deep(.ant-select-dropdown-menu::-webkit-scrollbar-thumb:hover ){
  background: #BFC5CD !important;
}

/** 视图弹窗靠上：wrap 顶对齐 + 取消 .ant-modal 默认 top */
.ant-view-modal-align-top.ant-modal-wrap {
  display: flex !important;
  align-items: flex-start !important;
  justify-content: center;
  padding: 27px 16px 32px;
  box-sizing: border-box;
}
.ant-view-modal-align-top.ant-modal-wrap .ant-modal {
  top: 0 !important;
  margin: 0 auto 16px !important;
  max-height: calc(100vh - 48px);
}
.ant-view-modal-align-top.ant-modal-wrap .ant-modal-content {
  max-height: calc(100vh - 56px);
  overflow: auto;
}

/** 配置个人视图：wrap 垂直居中 + 相对纯居中小幅上移（原 -64px，再下移 50px → -14px） */
.ant-view-modal-config-personal.ant-modal-wrap {
  display: flex !important;
  align-items: center !important;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
}
.ant-view-modal-config-personal.ant-modal-wrap .ant-modal {
  top: 0 !important;
  margin: -14px auto 16px !important;
  max-height: calc(100vh - 48px);
}
.ant-view-modal-config-personal.ant-modal-wrap .ant-modal-content {
  max-height: calc(100vh - 56px);
  overflow: auto;
}
</style>
