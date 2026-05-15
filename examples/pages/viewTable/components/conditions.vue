<template>
<!-- 新增 -->
<a-modal v-if="addVisible" :title="modalTitle" :visible="addVisible" :confirm-loading="confirmLoading" @ok="addOk" @cancel="addCancel" width='1500px'>
    <div>
    </div>
    <div class="conditiondes">
    <div class="des">条件</div>
    <div class="des">条件组</div>
    </div>
    <div class="condition conditiondes" v-for="(condition,index) in conditions" :key="index">
        <div class="des">
            <ant-group
              :ref="'antGroup'"
              :groupData="condition.data"
              :index="index"
              :columnMap="columnMap"
              :tableCode="tableCode"
              :selectColumnList="selectColumnList"
              :cacheColumnList="cacheColumnList"
              :columns="columns"
              @handleSearch="handleSearch"
              :hideIcon="false"
              />
        </div>
        <div class="des">
            <ant-view-tree
              ref="viewTree"
              :tableCode="tableCode"
              :relationType.sync="tableRelationType"
              :columnMap="columnMap"
              :searchList.sync="tableSearchList"
              :selectColumnList.sync="selectColumnList"
              :cacheColumnList.sync="cacheColumnList"
              @handleSearch="handleSearch"
              @addItem="addItem"
              @delItem="delItem"
            />

            <div class="addClass">
                <div class="" style="cursor: pointer;" @click="addItem" >
                    <a-icon type="plus-square" style="font-size:18px;color:#d9d9d9;margin-right:10px;" />
                    <span>添加条件</span>
                </div>
                <div class="" style="margin-left: 30px;cursor: pointer;" @click="addItemGroup">
                    <a-icon type="plus-square" style="font-size:18px;color:#d9d9d9;margin-right:10px;"  />
                    <span>添加条件组</span>
                </div>
                 </div>

        </div>
    </div>

</a-modal>
</template>

<script>
import { getDefaultViewInfo, mappingAdd, mappingEdit } from './api'
import { generateUUID } from '../../../utils/uuid'
import debounce from 'lodash/debounce'
export default {
  name: 'conditions',
  components: {},
  props: [
    // 视图code
    'tableCode',
    // 列数据
    'columns',
    // 自定义数据源
    'columnMap'
  ],
  data () {
    return {
      addVisible: false,
      confirmLoading: false,
      tableRelationType: '', // 条件间关系：1 -> and; 2 -> or
      selectColumnList: [],
      tableSearchList: [], // 添加条件
      cacheColumnList: [], // 初始化表头数据
      id: -1,
      conditions: [{
        // 左侧条件 数据源
        data: {}
      }],
      modalTitle: '条件映射'

    }
  },
  computed: {},
  created () {},
  mounted () {
    this.initData()
  },
  methods: {
    // TODO reset data
    // 初始化数据
    async initData () {
      const { data } = await getDefaultViewInfo(this.tableCode).catch((error) => { throw new Error(error) })
      console.log(data, 'data')
      if (data.code && data.code === 200) {
        const response = data.data
        if (typeof response.filter.tableFilter.relationType !== 'number') {
          response.filter.tableFilter.relationType = 0
        }
        // tableFilter  默认条件
        const tableSearchList = this.conditionalValue(response.filter.tableFilter.filters)
        // 关联关系
        this.relationType = response.filter.relationType
        this.tableRelationType = response.filter.tableFilter.relationType
        // region 显示数据格式化 回显checked 和顺序
        this.allList = response.columns
        this.allList.forEach(item => {
          item.list = item.columnList
          item.list.forEach(it => {
            it.checked = false
            if (it.defaultIsShow) {
              it.checked = true
              // this.isSelected.push(it)
            }
          })
          this.length += item.list.length
   })
        // this.isSelected.sort((a, b) => { // 排序
        //   return a.sortNo - b.sortNo
        // })
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
        this.$emit('setselectColumnList', this.selectColumnList)
        this.cacheColumnList = [...allColumns]
        this.tableSearchList = this.dataFilters(tableSearchList, allColumns)
        // console.log(this.tableSearchList, 'tableSearchList')
        this.$nextTick(() => {
          for (let i = 0; i < this.tableSearchList.length; i++) {
            const filter = this.tableSearchList[i]
            this.$refs.viewTree.updateColumn(filter, filter.column, filter.operator, this.tableCode, filter.value)
          }
        })
      } else {
        this.$antmessage.error(data.msg)
      }
      // endregion
    },
    // 条件取值
    conditionalValue (list) {
      if (list.length) {
        return list
      } else {
        return []
      }
    },
    checkColumn (column) {
      return column.applicationFlag !== 3 && column.applicationFlag !== 1 && column.search !== 0 && column.columnType !== 9
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

    // 新增视图条件
    addItem (index, filterIndex) {
      // console.log(index, filterIndex)
      // const tableSearchList = []
      // console.log(this.selectColumnList, 'selectColumnList')
      if (this.selectColumnList.length === 0) {
        this.$antmessage.error('没有视图条件', 3)
        return
      }
      // 条件组添加只需要子结构
      const item = {
        uuid: generateUUID(),
        groupType: 1, // 条件
        operator: 1,
        column: null,
        value: null,
        relationType: 1,
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
        this.tableSearchList.splice(index + 1, 0, items)
      } else if (typeof filterIndex === 'number') {
        item.groupType = 2
        // 根据一级二级索引  条件组添加条件
        this.tableSearchList[index].filters.splice(filterIndex + 1, 0, item)
      } else {
        // 直接push
        this.tableSearchList.push(items)
      }
      console.log(this.tableSearchList, items, 'items')
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
            uuid: generateUUID(),
            groupType: 2, // 条件组
            operator: 1,
            column: null,
            value: null,
            relationType: 1,
            deleteFlag: false
          },
          {
            uuid: generateUUID(),
            groupType: 2, // 条件组
            operator: 1,
            column: '',
            value: '',
            relationType: 1,
            deleteFlag: false
          }
        ]
      }
      this.tableSearchList.push(items)
    },
    // 删除 视图条件 item被删除的项  index 一级索引  filterIndex二级索引
    delItem (item, index, filterIndex) {
      // console.log(item, index, filterIndex)
      const item1 = item
      // deleteFlag 控制隐藏 并未删除
      item1.deleteFlag = true
      // 1 条件删除  2 条件组删除
      if (item.groupType === 1) {
        this.$set(this.tableSearchList, index, item1)
      } else if (item.groupType === 2) {
        // 如果是数字 删除单个 不是数字就是整个条件组删除
        if (typeof filterIndex === 'number') {
          this.tableSearchList[index].filters.splice(filterIndex, 1)
          // 条件组被清空 就隐藏
          if (this.tableSearchList[index].filters.length === 0) {
            this.tableSearchList[index].deleteFlag = true
          }
        } else {
          item1.filters = []
          this.tableSearchList[index] = item1
        }
      }
    },
    resetData (item) {
      this.id = item.id
      // 左侧
      const filter = {
        uuid: generateUUID(),
        groupType: 1, // 条件
        relationType: 1, // 0 -> and; 1 -> or
        deleteFlag: false, // false 显示  true隐藏
        filters: [],
        ...item.filter
      }
      const index = this.cacheColumnList.findIndex((items) => items.code === item.filter.columnCode)
      filter.column = this.cacheColumnList[index]
      this.conditions = [
        {
          data: filter
        }
      ]
      // 右侧
      const filters = item.filterMapping.filters
      const tableSearchList = this.dataFilters(filters, this.cacheColumnList)
      this.tableSearchList = tableSearchList
      setTimeout(() => {
        this.$refs.antGroup[0].updateColumn(filter.column, filter.operator, this.tableCode, filter.value)
        for (let i = 0; i < this.tableSearchList.length; i++) {
          const filter = this.tableSearchList[i]
          if (this.$refs.viewTree && this.$refs.viewTree[0]) {
            this.$refs.viewTree[0].updateColumn(filter, filter.column, filter.operator, this.tableCode, filter.value)
          }
        }
      }, 200)
    },
    // 打开弹窗
    open (item) {
      console.log(item)
      if (item && item.id) {
        // TODO 修改 回显
        this.resetData(item)
      } else {
        this.conditions = [{
          data: {
            uuid: generateUUID(),
            groupType: 1, // 条件
            relationType: 1, // 0 -> and; 1 -> or
            deleteFlag: false, // false 显示  true隐藏
            filters: []
          }
        }]
      }
      console.log(this.conditions,this.columns,'this.conditions')
      this.$nextTick(()=>{
        this.addVisible = true
  })
    },
    // 保存
    async addOk () {
      console.log(this.tableSearchList, this.conditions, this.tableRelationType)
      const tableSearchList = this.filterTableSearchList()
      // this.filterTableSearchList()
      const filterMapping = {
        filters: tableSearchList, //  条件组
        groupType: null, // 组类型: 1 -> 条件；2 -> 条件组
        relationType: this.tableRelationType // 条件间关系：0 -> and; 1 -> or
      }
      const params = {
        filter: {
          // 默认是数值类型
          type: '0',
          ...this.conditions[0].data

        }, // 左侧条件
        filterMapping, // 右侧条件组
        tableCode: this.tableCode
      }
      let response
      if (this.id) {
        params.id = this.id
        response = await mappingEdit(params)
      } else {
        response = await mappingAdd(params)
      }
      const data = response.data
      if (data.code && data.code === 200) {
        console.log(data)
        this.$antmessage.success(data.msg)
        this.addVisible = false
        this.$emit('refresh')
        // 数据置空
        this.conditions = [{ data: {} }]
        this.tableSearchList = []
      } else {
        this.$antmessage.error(data.msg)
      }
    },
    // 数据过滤
    filterTableSearchList () {
      const tableSearchList = []
      this.tableSearchList.forEach(element => {
        const filters = []
        element.filters.forEach(item => {
          filters.push({
            columnCode: item.columnCode,
            operator: item.operator,
            type: item.type,
            value: item.value
          })
        })
        tableSearchList.push({
          filters: filters,
          groupType: element.groupType,
          relationType: element.relationType
        })
      })
      console.log(tableSearchList, 'tableSearchList')
      return tableSearchList
    },
    // 关闭弹窗
    addCancel () {
      this.addVisible = false
    }

  }
}
</script>

<style lang="scss" scoped>

.conditiondes{
    display:flex;
    padding:4px 0;
    width:100%;
    .des{
        flex:1;
        padding:4px;
        font-size:16px;
        // border:solid #666 1px;
        text-align:left;
    }
    .addClass{
      margin-left: 20px;
      display: flex;
      align-items: center;
    }

}
  </style>
