<template>
  <div class="main">
    <!-- 标题 -->
    <div class='flex'>
      <div class='block'>标题<span style='color:red'>*</span></div>
      <div style="width: calc(100% - 130px)"><a-input placeholder="请输入标题" v-model:value="title" /></div>
    </div>
    <div class='flex'>
      <div class='block'><span style='color:red'></span></div>
      <div style="width: calc(100% - 130px);color:red" v-if="title == '' && titleOpen">标题不能为空</div>
    </div>
    <!-- 表格唯一编码 true 自定义表格编码 -->
    <div v-if="configType === 'config'">
      <div class='flex'>
        <div class='block'>表格唯一编码<span style='color:red'>*</span></div>
        <div style="width: calc(100% - 205px);margin-left: 0px;"><a-input placeholder="表格唯一编码"
            v-model:value='customTableCode' /></div>
        <div style="width: 50px;margin-left: 10px;">
          <a-button @click="searchingTap">检索</a-button>
        </div>
      </div>
      <div class='flex'>
        <div class='block'><span style='color:red'></span></div>
        <div style="width: calc(100% - 130px);color:red" v-if="customTableCode == '' && tableCodeOpen">表格唯一编码不能为空</div>
      </div>
    </div>
    <!-- 视图类型信息 -->
    <div>
      <div class='flex'>
        <div>
          <div class='block'>视图类型<span style='color:red'>*</span></div>
        </div>
        <div style="display: flex;width: 100%;padding-right: 50px;">
          <!-- :disabled="viewTypeDisabled" -->
          <a-radio-group v-if="configType === 'user'" v-model:value="viewType" @change="viewTypeChange">
            <a-radio v-for="(item, index) in viewTypeList" :key="index" :style="radioStyle" :value="item.value"
              :disabled="item.disabled">
              {{ item.title }}
            </a-radio>
          </a-radio-group>
          <!-- 如果是弹窗视图 || 聚合视图显示 -->
          <a-radio-group v-else-if="configType === 'config'" v-model:value="viewType" @change="viewTypeChange">
            <a-radio v-for="(item, index) in systemViewType" :key="index" :style="radioStyle" :value="item.value">
              {{ item.title }}
            </a-radio>
          </a-radio-group>
          <div class='flex' style="margin-left: 100px;">
            <div>
              <div class='block'>分页页码配置</div>
            </div>
            <div class="flex column" style="width:100%">
              <page-size-list ref="pageInfo" />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div style="display: flex;margin: 10px 0;">
          <div class='block'>条件关系<span style='color:red'>*</span></div>
          <div v-if="(typeof aggregateData.relationType === 'number')">
            默认视图与条件视图的关联条件为
            <a-radio-group
              style="margin-left: 8px;"
              :disabled="true"
              :options="operaterList"
              :value="typeof aggregateData.relationType === 'number' ? aggregateData.relationType : 0" />
          </div>
        </div>
      </div>
      <div class='flex'>
        <div>
          <div class='block'>默认条件<span style='color:red'>*</span></div>
        </div>
        <div class="flex column" style="width:100%">
          <view-tree
            ref="tableViewTree"
            :tableCode="currentTableCode"
            v-model:relationType="tableRelationType"
            :columnMap="columnMap"
            :searchList="tableSearchList"
            :selectColumnList="selectColumnList"
            :cacheColumnList="cacheColumnList"
            :columnOperatorList="columnOperatorList"
            :disabled="true"
            :columns="columns" />
        </div>
      </div>
      <div class='flex'>
        <div>
          <div class='block'>视图条件<span style='color:red'>*</span></div>
        </div>
        <div class="flex column condition">
          <view-tree
            ref="viewTree"
            :tableCode="currentTableCode"
            v-model:relationType="viewRelationType"
            :columnMap="columnMap"
            :searchList="viewSearchList"
            :selectColumnList="selectColumnList"
            :cacheColumnList="cacheColumnList"
            :columnOperatorList="columnOperatorList"
            :columns="columns"
            @handleSearch="handleSearch"
            @addItem="addItem"
            @delItem="delItem" />
          <div class="addClass">
            <div class="" style="cursor: pointer;" @click="addItem">
              <a-icon type="plus-square" style="font-size:18px;color:#d9d9d9;margin-right:10px;" />
              <span>添加条件</span>
            </div>
            <div class="" style="margin-left: 30px;cursor: pointer;" @click="addItemGroup">
              <a-icon type="plus-square" style="font-size:18px;color:#d9d9d9;margin-right:10px;" />
              <span>添加条件组</span>
            </div>
          </div>
        </div>
      </div>
      <div class='flex'>
        <div>
          <div class='block'>视图排序</div>
        </div>
        <div class="flex column condition">
          <sort-view
            ref="sortView"
            :tableCode="currentTableCode"
            :viewSorter="viewSorter"
            :sortColumnList="sortColumnList"
            :cacheColumnList="cacheColumnList"
            @handleSortSearch="handleSortSearch"
            @addSortItem="addSortItem"
            @delSortItem="delSortItem"
            :columns="columns" />
          <div class="addClass">
            <div class="" style="cursor: pointer;display: flex;align-items: center;" @click="addSortItem">
              <a-icon type="plus-square" style="font-size:18px;color:#d9d9d9;margin-right:10px;" />
              <span>添加排序</span>
            </div>
          </div>
        </div>
      </div>
      <div class='flex'>
        <div class='block'>设置显示字段</div>
      </div>
      <div class="modalContent">
        <div class="leftContent">
          <div style='margin-left:13px;margin-top:20px;'><a-checkbox v-model:checked="checkAll"
              @change="checkAllItem"></a-checkbox><span style='margin-left:10px;'>{{ !checkAll ? '全选' : '取消全选'
              }}</span>
          </div>
          <p class="left_title">可选字段</p>
          <div class="checkGroup" v-for="(item, index) in allList" :key="index">
            <p style="width:100%;">{{ item.name }}</p>
            <p v-for="(it, int) in item.list" :key="int" style="width:16.6%;">
              <a-checkbox v-model:checked="it.checked" @change="() => onFieldToggle(it)" :disabled="it.isRequired == 1">
                <a-tooltip placement="topLeft">
                  <template #title>
                    <span>{{ it.columnTitle }}</span>
                  </template>
                  <span v-if="it.columnTitle.length > 4">{{ it.columnTitle.slice(0, 4) + '...' }}</span>
                  <span v-else>{{ it.columnTitle }}</span>
                </a-tooltip>
              </a-checkbox>
            </p>
          </div>
        </div>
        <div class="rightContent">
          <p class="left_title">已选字段</p>
          <!-- <div class="checkGroup drag">
          <div v-for="(item, index) in isSelected" v-dragging="{ item: item, list: isSelected, }" :key="index" style="height:25px;margin-bottom:0px;width:100%">
            <div class="phover" :title="item.columnTitle">
              <span><a-icon type="more" style="width:10px;" /><a-icon type="more" style="width:10px;margin-right:10px;" />{{ item.columnTitle }}</span>
              <a-icon type="close-circle" @click="delSelect(item, index)" style="margin-right:10px;line-height:30px;" v-if="item.isRequired == 0" />
            </div>
          </div>
        </div> -->
          <div class="checkGroup drag">
            <draggable
              v-model="isSelected"
              item-key="dragKey"
              animation="300"
              style="width:100%"
              @update="change">
              <template #item="{ element, index }">
                <div v-if="element.sortNo > -1" class="drag-field-item">
                  <p class="phover">
                    <span>
                      <a-icon type="more" style="width:10px;" />
                      <a-icon type="more" style="width:10px;margin-right:10px;" />
                      {{ element.columnTitle }}
                    </span>
                    <a-icon
                      v-if="element.isRequired == 0"
                      type="close-circle"
                      class="drag-field-remove"
                      @click="delSelect(element, index)" />
                  </p>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </div>
    </div>
    <div style="margin-top:20px;text-align:center">
      <a-button type='default' @click="handleCancel" style="margin-right:20px;">取消</a-button>
      <a-button type='primary' @click="handleOk" :loading="confirmLoading">确定</a-button>
    </div>
  </div>
</template>
<script>
import pageSizeList from './PageSizeList.vue'
import viewTree from './viewTree.vue'
import sortView from './components/sortView.vue'
import {
  saveView,
  updateView,
  getViewInfoById,
  getDefaultViewInfo,
  getPreviewView,
  savePreviewView,
  updatePreviewView
} from '../../sevrices/configurationView'
import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'
import draggable from 'vuedraggable'
import { ColumnType, VIEW_CHANGE_TYPE, viewTypeList, systemViewType, viewType, defaultPageInfo } from '../../Constant/constant'
import { generateUUID } from '../../../utils/uuid'
import { getTableCode } from '../getTableCode'
// import { Popover as TinyPopover } from '@opentiny/vue'
export default {
  name: 'AntEditView',
  props: {
    viewId: {},
    // 是否显示自定义表格唯一编码 (新增视图)
    isCustomTableCode: {
      type: Boolean,
      default: false
    },
    tableCode: {},
    // 1修改 2另存为 3新增
    judge: {},
    columnMap: {},
    // 当前视图类型
    currentViewType: {},
    // 是否禁用视图类型  默认false
    viewTypeDisabled: {
      type: Boolean,
      default: true
    },
    // user 用户端 ||  config  配置端
    configType: {
      type: String,
      default: 'user' // 默认用户端
    },
    /** 列表当前生效视图的分页（新建时与表格默认分页一致） */
    currentViewPageInfo: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      columns: [],
      ColumnType,
      viewType: viewType.personal.value, // 默认是个人视图
      viewTypeList,
      systemViewType,
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      },
      relationType: 0, // 默认条件和视图条件的关联关系
      titleOpen: false,
      defaultColumns: [],
      title: '', // 视图名称
      aggregateData: {}, // 总数据 树结构 包含 tableFilter 和 viewFilter
      tableSearchList: [], // 默认条件
      tableRelationType: 0, // 默认关联关系
      viewSearchList: [], // 视图条件
      viewRelationType: 0, // 视图关联关系
      cacheColumnList: [], // 初始化表头数据
      columnOperatorList: [], // 操作符集合
      viewSorter: [], // 排序list
      kind: 0,
      // 已选字段
      isSelected: [],
      // 可选字段
      allList: [],
      // 日历时间错误信息
      errMessage: '',
      errMessage2: '',
      checkAll: false,
      length: 0,
      selectColumnList: [], // 条件列
      sortColumnList: [], // 排序列
      pageInfo: {},
      operaterList: [
        { label: 'AND', value: 0 },
        { label: 'OR', value: 1 }
      ],
      confirmLoading: false,
      customTableCode: '', // 表格唯一code (系统视图新增)
      tableCodeOpen: false,
      currentTableCode: '',
      normalViewTypeList: [1, 2, 3], // 正常视图的
      systemViewTypeList: [4, 5] // 系统视图
    }
  },
  watch: {
    currentViewType (newVal) {
      if (typeof newVal !== 'undefined') {
        this.viewType = newVal
      }
    }
  },
  components: {
    viewTree,
    sortView,
    pageSizeList,
    draggable
    // TinyPopover
  },
  computed: {

  },
  created () {
  },
  mounted () {
    this.currentTableCode = getTableCode(this)

    // console.log(this.currentViewType)
    if (typeof this.currentViewType !== 'undefined') {
      this.viewType = this.currentViewType
    }
    // 自定义编码   检测有没有tableCode
    // console.log(this.currentTableCode, 'currentTableCode')
    if (this.configType == 'config' && this.currentTableCode) {
      this.customTableCode = this.currentTableCode
    }
    this.initData()
  },
  /* eslint-disable */
  methods: {

    /** 兼容 code 为 number/string 及无 code 场景 */
    isApiSuccess(payload) {
      if (!payload || typeof payload !== 'object') return false
      if (payload.success === true && payload.data != null) return true
      const c = payload.code
      if (c === undefined || c === null) return payload.data != null
      return Number(c) === 200
    },
    /** 补全 filter 结构，避免接口缺字段导致中断 */
    ensureViewFilterShape(response) {
      if (!response.filter) {
        response.filter = {
          relationType: 0,
          tableFilter: { relationType: 0, filters: [] },
          viewFilter: { relationType: 0, filters: [] }
        }
        return
      }
      const f = response.filter
      if (!f.tableFilter) f.tableFilter = { relationType: 0, filters: [] }
      if (!Array.isArray(f.tableFilter.filters)) f.tableFilter.filters = []
      if (!f.viewFilter) f.viewFilter = { relationType: 0, filters: [] }
      if (!Array.isArray(f.viewFilter.filters)) f.viewFilter.filters = []
      if (typeof f.relationType !== 'number') f.relationType = 0
    },
    viewTypeChange(e) {
      /** 兼容 ant-design-vue Radio 事件与原生事件 */
      const v = e && e.target ? e.target.value : e
      this.viewType = v
    },
    handleSortSearch: debounce(function (value, item) {
      item.fetching = true
      // console.log(value, item)
      this.sortColumnList = []
      this.cacheColumnList.forEach(e => {
        if (e.columnTitle.includes(value)) {
          this.sortColumnList.push(e)
        }
      })
      item.fetching = false
      // console.log(this.sortColumnList)
    }, 300),
    handleSearch: debounce(function (value, item) {
      item.fetching = true
      // console.log(value, item)
      this.selectColumnList = []
      this.cacheColumnList.forEach(e => {
        if (e.columnTitle.includes(value)) {
          this.selectColumnList.push(e)
        }
      })
      item.fetching = false
      // console.log(this.selectColumnList)
    }, 300),
    // 点击检索
    searchingTap() {
      if (this.customTableCode === '') {
        this.$antmessage.error('请填写编码!')
        return
      }
      this.initData()
    },
    // 初始化数据
    /** 拖拽列表唯一键 */
    attachDragKey (list) {
      list.forEach((item, index) => {
        item.dragKey = item.code || item.dataIndex || `${item.columnTitle || 'col'}-${index}`
      })
    },
    async initData() {
      this.isSelected = []
      this.allList = []
      this.length = 0
      // 如果是自定义表格编码  没有列且没有自定义编码  直接return  等待校验
      if (this.isCustomTableCode && this.customTableCode === '') {
        return
      }
      let requestUrl
      let param
      let currentTableCode
      if (this.isCustomTableCode) {
        currentTableCode = this.customTableCode
      } else {
        currentTableCode = this.currentTableCode
      }
      // 获取默认过滤条件
      if (Number(this.judge) === VIEW_CHANGE_TYPE.add.value) {
        param = currentTableCode
        requestUrl = getDefaultViewInfo
      } else {
        param = this.viewId
        // console.log(this.currentViewType, viewType.system.value)
        // 检测是否是配置视图   调系统视图详情
        if (this.configType == 'config') {
          requestUrl = getPreviewView
        } else {
          requestUrl = getViewInfoById
        }
      }

      if (Number(this.judge) !== VIEW_CHANGE_TYPE.add.value && (this.viewId === undefined || this.viewId === null || this.viewId === '')) {
        this.$antmessage.error('视图ID缺失，无法加载')
        return
      }

      const { data } = await requestUrl(param).catch((error) => { throw new Error(error) })
      // console.log(data, 'data')
      if (this.isApiSuccess(data)) {
        const response = data.data
        if (!response) {
          this.$antmessage.error((data && data.msg) || '视图数据为空')
          return
        }
        const isAdd = Number(this.judge) === VIEW_CHANGE_TYPE.add.value
        if (!isAdd) {
          this.title = response.viewName || response.viewTitle || response.name || ''
        } else {
          this.title = ''
        }
        const rv = response.viewType
        if (rv !== undefined && rv !== null && rv !== '') {
          const n = Number(rv)
          if (!Number.isNaN(n)) {
            this.viewType = n
          }
        }
        this.ensureViewFilterShape(response)
        if (!response.columns || !Array.isArray(response.columns)) {
          this.$antmessage.error('视图列配置缺失')
          return
        }
        if (typeof response.filter.tableFilter.relationType !== 'number') {
          response.filter.tableFilter.relationType = 0
        }
        if (typeof response.filter.viewFilter.relationType !== 'number') {
          response.filter.viewFilter.relationType = 0
        }
        // tableFilter  默认条件 (数据不能修改)
        const tableSearchList = this.conditionalValue(response.filter.tableFilter.filters)
        // viewFilter   视图条件 (可以修改)
        const viewFilters = this.conditionalValue(response.filter.viewFilter.filters)
        //  树结构 总数据 包含 tableFilter 和 viewFilter
        this.aggregateData = response.filter
        // console.log(this.aggregateData, response.filter, viewFilters)
        // 关联关系
        this.relationType = response.filter.relationType
        this.viewRelationType = response.filter.viewFilter.relationType
        this.tableRelationType = response.filter.tableFilter.relationType
        this.columnOperatorList = response.columnOperatorList // 操作符集合
        if (response.viewSorter) {
          response.viewSorter.forEach(item => {
            item.value = JSON.stringify(item.asc)
          });
          this.viewSorter = response.viewSorter
        }
        // region 显示数据格式化 回显checked 和顺序
        // this.allList = response.columns
        // applicationFlag  0  用于查询列和条件 1 仅用于查询列  2  仅用于条件 3  页面传参
        // applicationFlag 0 1 显示  其他不显示
        this.allList = []
        response.columns.forEach(item => {
          this.allList.push({
            name: item.name,
            sortNo: item.sortNo,
            columnList: item.columnList.filter((li) => {
              return li.applicationFlag == 0 || li.applicationFlag == 1
            })
          })
        })
        this.columns = response.columns
        this.allList.forEach(item => {
          item.list = item.columnList
          item.list.forEach(it => {
            it.checked = false
            if (it.defaultIsShow) {
              it.checked = true
              this.isSelected.push(it)
            }
          })
          this.length += item.list.length
        })
        this.isSelected.sort((a, b) => { // 排序
          return a.sortNo - b.sortNo
        })
        this.attachDragKey(this.isSelected)
        console.log(this.length, this.isSelected)
        this.checkAll = this.length > 0 && this.isSelected.length === this.length
        let allColumns = [] //  平铺的所有列
        response.columns.forEach(group => {
          allColumns = allColumns.concat(group.columnList)
        })
        const allNotColumns = JSON.parse(JSON.stringify(allColumns)) // 所有列(包括需要禁用的)
        allNotColumns.forEach(column => {
          column.disabled = !this.checkColumn(column) // true 可以作为过滤条件 false 禁用  取反直接使用
        })
        // console.log(allNotColumns, 'allNotColumns')
        // 全部列数据
        this.selectColumnList = [...allNotColumns] // 条件列
        this.sortColumnList = [...allNotColumns] // 排序列
        this.cacheColumnList = [...allNotColumns] // 初始数据 
        // 格式化过滤数据
        this.viewSearchList = this.dataFilters(viewFilters, allNotColumns)
        this.tableSearchList = this.dataFilters(tableSearchList, allNotColumns)
        // console.log(this.viewSearchList, this.tableSearchList, 'viewSearchList')
        // console.log(this.viewType, viewType.system.value)
        if (this.viewType === viewType.system.value || this.viewType === viewType.modal.value) {

          // console.log(this.labelPageFilter, 'labelPageFilter')
        }
        this.pageInfo = response.pageInfo
        if (!this.pageInfo || !Array.isArray(this.pageInfo.pageSizeList) || this.pageInfo.pageSizeList.length === 0) {
          this.pageInfo = cloneDeep(defaultPageInfo)
        }
        // 新建：分页配置与当前列表正在用的视图一致（默认选中当前每页条数）
        if (
          isAdd &&
          this.currentViewPageInfo &&
          Array.isArray(this.currentViewPageInfo.pageSizeList) &&
          this.currentViewPageInfo.pageSizeList.length
        ) {
          this.pageInfo = cloneDeep(this.currentViewPageInfo)
        }
        this.$nextTick(() => {
          for (let i = 0; i < this.viewSearchList.length; i++) {
            const filter = this.viewSearchList[i]
            this.$refs.viewTree.updateColumn(filter, filter.column, filter.operator, currentTableCode, filter.value)
          }
          for (let i = 0; i < this.tableSearchList.length; i++) {
            const filter = this.tableSearchList[i]
            this.$refs.tableViewTree.updateColumn(filter, filter.column, filter.operator, currentTableCode, filter.value)
          }
          if (this.$refs.pageInfo) {
            this.$refs.pageInfo.changeValue(this.pageInfo.pageSizeList, this.pageInfo.currentPageNum)
            setTimeout(() => {
              this.$refs.pageInfo.changeValue(this.pageInfo.pageSizeList, this.pageInfo.currentPageNum)
            }, 500)
          }
        })
      } else {
        this.$antmessage.error((data && data.msg) || '加载视图失败')
      }
    },
    // 树结构数据过滤
    dataFilters(list, allColumns) {
      const filtersList = []
      if (list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          const filter = list[i]
          const filters = []
          filter.filters.forEach(element => {
            const index = allColumns.findIndex((column) => column.code === element.columnCode)
            if (index !== -1) {
              element.column = allColumns[index] // 当前条件的表头数据
              element.deleteFlag = false
              element.uuid = generateUUID()
              element.groupType = filter.groupType
              filters.push(element)
            }
          })
          filtersList[i] = {
            uuid: generateUUID(),
            ...filter,
            filters,
            deleteFlag: false
          }
        }
      }
      return [...filtersList]
    },
    // 条件取值
    conditionalValue(list) {
      if (list.length) {
        return list
      } else {
        return []
      }
    },
    // 新增排序
    addSortItem(index) {
      if (this.sortColumnList.length === 0) {
        this.$antmessage.error('没有视图条件', 3)
        return
      }
      // 条件组添加只需要子结构
      const item = {
        uuid: generateUUID(),
        value: null,
        deleteFlag: false
      }
      if (typeof index === 'number') {
        this.viewSorter.splice(index + 1, 0, item)
      } else {
        this.viewSorter.push(item)
      }
    },
    // 删除 排序 item被删除的项  index 一级索引  filterIndex二级索引
    delSortItem(item, index) {
      // console.log(item, index)
      const item1 = item
      // deleteFlag 控制隐藏 并未删除
      item1.deleteFlag = true
      // 1 条件删除 
      this.viewSorter.splice(index, 1)
    },
    // 新增视图条件
    addItem(index, filterIndex) {
      // console.log(index, filterIndex)
      if (this.selectColumnList.length === 0) {
        this.$antmessage.error('没有视图条件', 3)
        return
      }
      // 条件组添加只需要子结构
      const item = {
        uuid: generateUUID(),
        groupType: 1, // 条件
        operator: '',
        column: null,
        value: null,
        relationType: 1,
        type: '0',
        deleteFlag: false
      }
      // 单个条件必须是items结构
      const items = {
        uuid: generateUUID(),
        groupType: 1, // 条件
        relationType: 1, // 0 -> and; 1 -> or
        deleteFlag: false, // false 显示  true隐藏
        filters: [item]
      }
      // 根据索引添加条件
      if (typeof index === 'number' && typeof filterIndex === 'undefined') {
        this.viewSearchList.splice(index + 1, 0, items)
      } else if (typeof filterIndex === 'number') {
        item.groupType = 2
        // 根据一级二级索引  条件组添加条件
        this.viewSearchList[index].filters.splice(filterIndex + 1, 0, item)
      } else {
        // 直接push
        this.viewSearchList.push(items)
      }
      console.log(this.viewSearchList, items, 'items')
    },
    // 新增条件组
    addItemGroup() {
      if (this.selectColumnList.length === 0) {
        this.$antmessage.error('没有视图条件', 3)
        return
      }
      const items = {
        groupType: 2, // 条件组
        relationType: 0, // 0 -> and; 1 -> or
        deleteFlag: false, // false 显示  true隐藏
        filters: [
          {
            uuid: generateUUID(),
            groupType: 2, // 条件组
            operator: '',
            type: '0',
            column: null,
            value: null,
            relationType: 1,
            deleteFlag: false
          },
          {
            uuid: generateUUID(),
            groupType: 2, // 条件组
            operator: '',
            type: '0',
            column: '',
            value: '',
            relationType: 1,
            deleteFlag: false
          }
        ]
      }
      this.viewSearchList.push(items)
    },
    // 删除 视图条件 item被删除的项  index 一级索引  filterIndex二级索引
    delItem(item, index, filterIndex) {
      // console.log(item, index, filterIndex)
      const item1 = item
      // deleteFlag 控制隐藏 并未删除
      item1.deleteFlag = true
      // 1 条件删除  2 条件组删除
      if (item.groupType === 1) {
        this.$set(this.viewSearchList, index, item1)
      } else if (item.groupType === 2) {
        // 如果是数字 删除单个 不是数字就是整个条件组删除
        if (typeof filterIndex === 'number') {
          this.viewSearchList[index].filters.splice(filterIndex, 1)
          // 条件组被清空 就隐藏
          if (this.viewSearchList[index].filters.length === 0) {
            this.viewSearchList[index].deleteFlag = true
          }
        } else {
          item1.filters = []
          this.viewSearchList[index] = item1
        }
      }
    },
    // endregion
    /* eslint-disable */
    handleCancel() { this.$emit('handleNewViewCancel') },
    async handleOk() {
      console.log(this.viewSorter, 'viewSorter')
      let sortFlag = false
      let sortMes = ''
      this.viewSorter.forEach(item => {
        if (item.value == null || typeof item.value == 'undefined') {
          sortFlag = true
          const index = this.cacheColumnList.findIndex((column) => column.code == item.dataIndex)
          if (index != -1) {
            sortMes = `视图排序${this.cacheColumnList[index].columnTitle}配置错误`
          } else {
            sortMes = '请视图排序选择字段'
          }
        }
        item.asc = item.value === "true" ? true : item.value === "false" ? false : null; // 处理无效值

      });
      if (sortFlag) {
        this.$antmessage.error(sortMes, 3)
        return
      }
      if (this.isSelected.length > 97) {
        return this.$antmessage.error('最多只能显示97列')
      }
      let errorFlag = false
      if (this.title === '') {
        this.titleOpen = true
        return
      }
      // 如果是自定义表格编码  校验编码是否填写
      if (this.isCustomTableCode && this.customTableCode === '') {
        this.tableCodeOpen = true
        return
      }

      this.confirmLoading = true
      const filterList = []
      // 取出没有被删除的列 deleteFlag false
      const arrays = this.viewSearchList.filter((x) => {
        if (x.filters && x.filters.length) {
          // const filters = x.filters.filter((y) => y.deleteFlag === false && y.column) // 直接过滤为空的条件
          const filters = x.filters.filter((y) => y.deleteFlag === false)
          x.filters = filters
          return x.filters.length
        } else {
          return false
        }
      })
      // console.log(arrays)
      for (let i = 0; i < arrays.length; i++) {
        const filter = arrays[i]
        // const flag = this.$refs[`renderValue_${filter.uuid}`][0].checkValue()
        let flag = false
        let msg
        filter.filters.forEach(element => {
          if (this.$refs.viewTree.checkValue(element)) {
            flag = this.$refs.viewTree.checkValue(element)
            msg = element.column ? `${element.column.columnTitle}配置错误` : '请选择字段'
          }
        })
        // const flag = this.$refs.viewTree.checkValue(filter)
        console.log(flag)
        if (flag) {
          console.log(filter)
          this.$antmessage.error(msg, 3)
          errorFlag = true
          this.confirmLoading = false
          return
        }

        const filters = []
        filter.filters.forEach((element, eleIndex) => {
          const value = this.$refs.viewTree.getValue(element)
          filters[eleIndex] = {
            columnCode: element.columnCode,
            operator: element.operator,
            type: element.type || '0',
            value: value
          }
        })
        filterList[i] = {
          filters: filters,
          groupType: filter.groupType,
          relationType: filter.relationType // 条件关系
        }
      }
      if (errorFlag) {
        this.confirmLoading = false
        return
      }
      // console.log(this.$dragging)
      // this.$dragging.$on('dragged', ({ value }) => {
      //   this.isSelected = value.list
      // })
      this.isSelected.forEach((element, index) => {
        element.sortNo = index// 重新排序
      })
      this.isSelected.forEach(item => {
        this.allList.forEach(it => {
          if (item.groupName === it.name) {
            it.list.forEach(item2 => {
              if (item2.sortOrder === '') {
                delete item2.sortOrder
              }
              if (item2.columnTitle === item.columnTitle) {
                item2.sortNo = item.sortNo
              }
            })
          }
        })
      })
      console.log(filterList, this.viewRelationType)
      const viewFilter = {
        filters: filterList,
        groupType: null,
        relationType: this.viewRelationType
      }
      // TODO 修改 groups 参数
      const params = {
        columns: this.allList, // 列
        viewFilter: viewFilter, // 条件数组 视图过滤条件信息
        tableCode: this.currentTableCode,
        // judge=1 其他为修改视图  2另存为视图   3 新增
        viewId: this.judge === VIEW_CHANGE_TYPE.edit.value ? this.viewId : '', // 视图ID，若传了则进行修改，否则进行新增
        // viewId: this.viewId || '', // 视图ID，若传了则进行修改，否则进行新增
        viewName: this.title, // 视图名称
        viewType: this.viewType, // 视图类型：0 -> 默认视图；1 -> 系统视图；2 -> 个人视图 3 -> 共享视图
        pageInfo: this.$refs.pageInfo.getJsonValue(), // 视图分页信息
        viewSorter: this.viewSorter
      }
      // 如果是自定义表格编码  取自定义数据
      if (this.isCustomTableCode) {
        params.tableCode = this.customTableCode
      }
      console.log(params, this.viewId)

      let requestUrl
      if (params.viewId) {
        // 检测是否是配置视图
        if (this.configType == 'config') {
          requestUrl = updatePreviewView // 系统更新接口
        } else {
          requestUrl = updateView // 个人更新接口
        }
      } else {
        if (this.configType == 'config') {
          requestUrl = savePreviewView // 系统保存接口 (新增)
        } else {
          requestUrl = saveView // 个人保存接口 (新增)
        }
      }
      console.log(params)
      // console.log(requestUrl)
      const result = await requestUrl(params).catch((error) => { throw new Error(error) })
      if (result.data.code && result.data.code === 200) {
        this.$emit('handleNewViewOk')
        this.$antmessage.success(result.data.msg)
      } else {
        this.$antmessage.error(result.data.msg)
      }
      this.confirmLoading = false
    },
    // region 显示字段
    // 全选 显示字段
    checkAllItem() {
      // console.log(this.allList)
      const arr = []
      const arrRepet = []
      if (this.checkAll) { // 全选
        this.allList.forEach(item => {
          item.list.forEach(element => {
            element.defaultIsShow = 1
            element.checked = true
            arr.push(element)
          })
        })
        const mergeData = this.isSelected.concat(arr)
        const result = mergeData.reduce((cur, next) => { // 合并去重
          const repeat = cur.some((item) => {
            return item.code === next.code
          })
          if (!repeat) {
            return cur.concat([next])
          } else {
            return cur
          }
        }, [])
        this.isSelected = result
        this.attachDragKey(this.isSelected)
      } else { // 取消全选留下必须的字段
        this.allList.forEach(item => {
          item.list.forEach(element => {
            if (element.isRequired == 0) { // 0是页面必须要的字段
              element.defaultIsShow = 0
              element.checked = false
            } else {
              arrRepet.push(element)
            }
          })
        })
        this.isSelected = arrRepet
        this.attachDragKey(this.isSelected)
      }
      this.checkAll = this.length > 0 && this.isSelected.length === this.length
    },
    /** 可选字段单项勾选：与已选列表同步，避免受控 Checkbox 双切换错误 */
    onFieldToggle (it) {
      if (it.isRequired == 1) return
      if (it.checked) {
        it.defaultIsShow = 1
        if (!this.isSelected.some((s) => s.code === it.code)) {
          this.isSelected.push(it)
          this.attachDragKey(this.isSelected)
        }
      } else {
        it.defaultIsShow = 0
        this.isSelected = this.isSelected.filter((item) => item.code !== it.code)
      }
      this.checkAll = this.length > 0 && this.isSelected.length === this.length
    },
    // 显示字段 取消选择
    delSelect(it, index) {
      this.isSelected.splice(index, 1)
      this.allList.forEach((item, index) => {
        if (item.name === it.groupName) {
          this.allList[index].list.forEach(it2 => {
            if (it.columnTitle === it2.columnTitle) {
              it2.checked = false
              it2.defaultIsShow = 0
            }
          })
        }
      })
      this.checkAll = this.length > 0 && this.isSelected.length === this.length
    },
    // endregion
    // 判断 列是否可以作为过滤条件
    checkColumn(column) {
      return column.applicationFlag !== 3 && column.applicationFlag !== 1 &&
        column.search !== 0 && column.columnType !== 9
    }
  }

}
</script>

<style lang="less" scoped>
.popoverUl {
  display: flex;

  .popoverLi {
    margin-right: 5px;
  }
}

.flex {
  display: flex;
  margin-bottom: 10px;
}

.condition {
  width: 89%;
  background-color: #f9f9fa;
  padding: 20px 0;
}

.addClass {
  margin-left: 80px;
  display: flex;
  align-items: center;
}

.relativeClass {
  position: relative;
  display: flex;
  align-items: center;
}

.selectAndOr {
  position: relative;
  width: 64px;
  height: 100%;
  align-items: center;
}

.flexRight {
  width: 89%;
  margin-left: 1%;
}

:deep(.selectClass .ant-select-selection ){
  border: none;
  background-color: #f3f4f6;
}

.line-operate {
  border-top: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
  border-left: 1px solid #d9d9d9;
  width: 20px;
  position: absolute;
  height: calc(100% - 48px);
  left: 20px;
}

.between {
  justify-content: space-between;
}

.column {
  flex-direction: column;
}

.wrap {
  flex-wrap: wrap;
}

.block {
  display: inline-block;
  width: 100px;
  text-align: right;
  margin-right: 20px;
}

.modalContent {
  height: auto;
  border: 1px solid #f0f0f0;
  display: flex;
}

.leftContent {
  width: 75%;
  border-right: 1px solid #f0f0f0;
  max-height: 500px;
  overflow-y: auto;
}

.leftContent::-webkit-scrollbar,
.rightContent::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.2);
  // background-color:rgba(0,0,0,.06);
  -webkit-box-shadow: inset -2px 0 0 #fff, inset 1px 0 0 hsla(0, 0%, 100%, 0.9),
    inset 0 -1px 0 hsla(0, 0%, 100%, 0.9), inset 0 1px 0 hsla(0, 0%, 100%, 0.9);
}

// 滚动条
.leftContent::-webkit-scrollbar,
.rightContent::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8px;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 8px;
}

.leftContent::-webkit-scrollbar,
.rightContent::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 8px;
  height: 20px;
  -webkit-box-shadow: inset -2px 0 0 #fff, inset 1px 0 0 #fff,
    inset 0 -1px 0 hsla(0, 0%, 100%, 0.9), inset 0 1px 0 hsla(0, 0%, 100%, 0.9);
  background-color: rgba(0, 0, 0, 0.1);
}

.leftContent::-webkit-scrollbar,
.rightContent::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  border-radius: 8px;
  -webkit-box-shadow: inset -2px 0 0 #fff, inset 1px 0 0 hsla(0, 0%, 100%, 0.9),
    inset 0 -1px 0 hsla(0, 0%, 100%, 0.9), inset 0 1px 0 hsla(0, 0%, 100%, 0.9);
  background-color: rgba(15, 15, 15, 0.09);
}

.rightContent {
  width: 30%;
  max-height: 500px;
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
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
  height: 30px;
  line-height: 30px;

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

.stopPoint {
  pointer-events: none;
}

.del-item-icon {
  margin-top: 10px;
  margin-left: 10px;
}

.ul {
  max-height: 55vh;
  overflow: scroll;
  width: 100%;
  padding: 10px;

  .li {
    padding: 5px 0px;
    cursor: pointer;
  }

  .li:hover {
    background-color: #f2f5fc;
  }
}

.antmask {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  // background:red;
}

.close {
  font-size: 22px;
  color: #b4aeae;
  position: absolute;
  top: 5px;
  right: 20px;
}
</style>
