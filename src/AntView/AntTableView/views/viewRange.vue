<template>
  <div class="main">
    <div class='flex'>
      <div>
        <div class='block'>默认条件<span style='color:red'>*</span></div>
      </div>
      <div class="flex column condition" style="width:100%">
        <view-tree ref="tableViewTree" :tableCode="currentTableCode" :relationType.sync="tableRelationType"
          :columnMap="columnMap" :searchList.sync="tableSearchList" :selectColumnList.sync="selectColumnList"
          :cacheColumnList.sync="cacheColumnList" :columns="columns" :disabled="true"></view-tree>
      </div>
    </div>
    <div class='flex' v-if="viewConfig.viewType !== viewType.default.value">
      <div>
        <div class='block'>视图条件<span style='color:red'>*</span></div>
      </div>
      <div class="flex column condition">
        <view-tree ref="viewTree" :tableCode="currentTableCode" :relationType.sync="viewRelationType"
          :columnMap="columnMap" :searchList.sync="viewSearchList" :selectColumnList.sync="selectColumnList"
          :cacheColumnList.sync="cacheColumnList" @handleSearch="handleSearch" @addItem="addItem" @delItem="delItem"
          :columns="columns" :disabled="viewConfig.viewType != 2"></view-tree>
        <div v-if="viewConfig.viewType == 2" class="addClass">
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
    <div v-if="viewConfig.viewType == 2" style="margin-top:20px;text-align:center">
      <a-button type='default' @click="handleCancel" style="margin-right:20px;">取消</a-button>
      <a-button type='primary' @click="handleOk" :loading="confirmLoading">确定</a-button>
    </div>
  </div>
</template>
<script>
import viewTree from './viewTree.vue'
import {
  saveView,
  updateView,
  getDefaultViewInfo
} from '../../sevrices/configurationView'
import debounce from 'lodash/debounce'

import { viewTypeList, viewType } from '../../Constant/constant'
import { generateUUID } from '../../../utils/uuid'
// import myMixin from '../../mix/mymixin.js'
import { getTableCode } from '../getTableCode'
export default {
  // mixins: [myMixin],
  name: 'viewRange',
  props: [
    'tableCode',
    'columnMap',
    'viewConfig',
    'isCustomRequest',
    'columns'
  ],
  data () {
    return {
      viewType: viewType,
      viewTypeList,
      relationType: 0, // 默认条件和视图条件的关联关系
      tableSearchList: [], // 默认条件
      tableRelationType: 0, // 默认关联关系
      viewSearchList: [], // 视图条件
      viewRelationType: 0, // 视图关联关系
      cacheColumnList: [], // 初始化表头数据
      // 已选字段
      isSelected: [],
      // 可选字段
      allList: [],
      length: 0,
      selectColumnList: [],
      pageInfo: {},
      operaterList: [
        { label: 'AND', value: 0 },
        { label: 'OR', value: 1 }
      ],
      confirmLoading: false,
      currentTableCode: ''
    }
  },
  components: {
    viewTree
  },
  computed: {

  },
  created () {
  },
  mounted () {
    this.currentTableCode = getTableCode(this)
    this.initData()
  },
  methods: {
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
    // 初始化数据
    async initData () {
      console.log(this.viewConfig, 'data')
      let response
      if (this.viewConfig.viewId) {
        response = this.viewConfig
      } else {
        const { data } = await getDefaultViewInfo(this.currentTableCode).catch((error) => { throw new Error(error) })
        // console.log(data, 'data')
        if (data.code && data.code === 200) {
          response = data.data
        } else {
          this.$antmessage.error(data.msg)
        }
      }
      console.log(response)
      if (response.viewId) {
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
        // 关联关系
        this.relationType = response.filter.relationType
        this.viewRelationType = response.filter.viewFilter.relationType
        this.tableRelationType = response.filter.tableFilter.relationType
        // region 显示数据格式化 回显checked 和顺序
        this.allList = response.columns
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
        // endregion
        // region 过滤条件
        let allColumns = []
        response.columns.forEach(group => {
          allColumns = allColumns.concat(group.columnList)
        })
        allColumns = allColumns.filter(column => {
          return this.checkColumn(column)
        })
        // 全部列数据
        this.selectColumnList = [...allColumns]
        this.cacheColumnList = [...allColumns]
        // 格式化过滤数据
        this.viewSearchList = this.dataFilters(viewFilters, allColumns)
        this.tableSearchList = this.dataFilters(tableSearchList, allColumns)
        console.log(this.viewSearchList, this.tableSearchList, 'viewSearchList')
        this.$nextTick(() => {
          for (let i = 0; i < this.viewSearchList.length; i++) {
            const filter = this.viewSearchList[i]
            this.$refs.viewTree.updateColumn(filter, filter.column, filter.operator, this.currentTableCode, filter.value)
          }
          for (let i = 0; i < this.tableSearchList.length; i++) {
            const filter = this.tableSearchList[i]
            this.$refs.tableViewTree.updateColumn(filter, filter.column, filter.operator, this.currentTableCode, filter.value)
          }
        })
      }
      // endregion
    },
    // 树结构数据过滤
    dataFilters (list, allColumns) {
      const filtersList = []
      if (list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          const filter = list[i]
          const filters = []
          filter.filters.forEach(element => {
            const index = allColumns.findIndex((column) => column.code === element.columnCode)
            if (index !== -1) {
              element.column = allColumns[index]
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
    conditionalValue (list) {
      if (list.length) {
        return list
      } else {
        return []
      }
    },
    // 新增视图条件
    addItem (index, filterIndex) {
      if (this.selectColumnList.length === 0) {
        this.$antmessage.error('没有视图条件', 3)
        return
      }
      // 条件组添加只需要子结构
      const item = {
        // uuid: generateUUID(),
        // groupType: 1, // 条件
        // operator: 1,
        // column: null,
        // value: null,
        // relationType: 1,
        // deleteFlag: false
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
        // uuid: generateUUID(),
        // groupType: 1, // 条件
        // relationType: 1, // 0 -> and; 1 -> or
        // deleteFlag: false, // false 显示  true隐藏
        // filters: [item]
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
    addItemGroup () {
      // console.log(this.selectColumnList, 'selectColumnList')
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
            // uuid: generateUUID(),
            // groupType: 2, // 条件组
            // operator: 1,
            // column: null,
            // value: null,
            // relationType: 1,
            // deleteFlag: false
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
            // uuid: generateUUID(),
            // groupType: 2, // 条件组
            // operator: 1,
            // column: '',
            // value: '',
            // relationType: 1,
            // deleteFlag: false
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
    delItem (item, index, filterIndex) {
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
    handleCancel () { this.$emit('handleviewRangeViewCancel') },
    async handleOk () {
      console.log(this.viewSearchList)
      let errorFlag = false
      this.confirmLoading = true
      const filterList = []
      // const arrays = this.viewSearchList.filter(x => x.deleteFlag === false)
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
        // console.log(flag, filter)
        if (flag) {
          // console.log(filter)
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
        viewId: this.viewConfig.viewId || '', // 视图ID，若传了则进行修改，否则进行新增
        viewType: this.viewConfig.viewType // 视图类型：0 -> 默认视图；1 -> 系统视图；2 -> 个人视图
      }
      console.log(params, this.viewConfig)
      if (this.isCustomRequest === true) {
        this.$emit('handleviewRangeViewOk', params)
      } else {
        let saveRequest
        if (params.viewId) {
          saveRequest = updateView // 更新接口
        } else {
          saveRequest = saveView // 保存接口 (新增)
        }
        // console.log(saveRequest)
        const result = await saveRequest(params).catch((error) => { throw new Error(error) })
        if (result.data.code && result.data.code === 200) {
          this.$emit('handleviewRangeViewOk')
          this.$antmessage.success(result.data.msg)
        } else {
          this.$antmessage.error(result.data.msg)
        }
        this.confirmLoading = false
      }
    },
    // endregion
    // 判断 列是否可以作为过滤条件
    checkColumn (column) {
      return column.applicationFlag !== 3 && column.applicationFlag !== 1 && column.search !== 0 && column.columnType !== 9
    }
  }

}
</script>

<style lang="less" scoped>
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
  width: 91px;
  text-align: right;
  margin-right: 20px;
}

.modalContent {
  height: auto;
  border: 1px solid #f0f0f0;
  display: flex;
}
</style>
