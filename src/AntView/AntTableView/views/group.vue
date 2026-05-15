<template>
  <div>
    <div class='flex conditionList' v-show="item.deleteFlag === false">
      <!-- 列表字段 -->
      <a-select showSearch @search="handleSearch($event, item)" @blur="handleblurs($event, item)" :filter-option="false"
        style="width: 24%;margin-right:1%" v-model="item.columnCode" :disabled="disabled" placeholder="请选择字段"
        @change="(val, option) => changeColumn(val, option, item)">
        <a-spin v-if="item.fetching" slot="notFoundContent" size="small" />
        <a-select-option v-for="(item1, index1) in selectColumnList" :key="index1" :value="item1.code" :data="item1"
          :title="item1.columnTitle" :disabled="item1.disabled">
          {{ item1.columnTitle }}
        </a-select-option>
      </a-select>
      <!-- (第二列)操作符 -->
      <!-- operateMap[item.column?item.column.columnType:ColumnType.Input] -->
      <a-select style="width: 150px;margin-right:1%" placeholder="请选择规则" v-model="item.operator" :disabled="disabled"
        @change="(val) => changeOperate(val, item)">
        <a-select-option v-for="(item1, index1) in item.operators" :key="index1" :value="item1.operatorId">
          {{ item1.operatorName }}
        </a-select-option>
      </a-select>
      <!-- (第三列)过滤条件类型  -->
      <!-- {{ filterFlag() }} -->
      <a-select v-if="filterFlag()" v-model="item.type" style="width:100px" :disabled="disabled">
        <a-select-option v-for="(item1, index1) in optionsType" :key="index1" :value="item1.value" :title="item1.label">
          {{ item1.label }}
        </a-select-option>
      </a-select>
      <div v-if="filterFlag()" style="display: flex;align-items: center;width: 300px;">
        <!-- (第四列)数值 0 对比值 &&type=='0' style="width: calc(100% - 50% - 3%)" -->
        <render-column-type-value v-show="item.uuid && item.type == '0'" :columnMap="columnMap"
          :disabled="disabled || !item.columnCode" :columns="columns" @change="(value) => changeColumnValue3(value, item)"
          :ref="'renderValue_' + item.uuid" />

        <!-- 数据列 1  -->
        <!--第四列 增加列比较  style="width: calc(100% - 50% - 3%)" -->
        <a-select style="width: 100%;" v-if="item.type == '1'" showSearch @search="handleSearchL($event, item)"
          @blur="handleblursL($event, item)" :filter-option="false" v-model="item.columnCompareValue"
          :disabled="disabled" placeholder="请选择比较字段" @change="(val, option) => changeColumn4(val, option, item)">
          <a-spin v-if="item.fetching" slot="notFoundContent" size="small" />

          <a-select-option v-for="(item1, index1) in selectColumnCompareList" :key="index1" :value="item1.code"
            :data="item1" :title="item1.columnTitle">
            {{ item1.columnTitle }}
          </a-select-option>
        </a-select>
      </div>

      <div v-if="disabled === false && hideIcon === false" style="display: flex; align-items: center;">
        <a-icon @click="addItem(item)" class="add-item-icon" type="plus-circle" />
        <a-icon @click="delItem(item)" class="del-item-icon" type="close-circle" />
      </div>
    </div>
  </div>
</template>
<script>
// import debounce from 'lodash/debounce'
import renderColumnTypeValue from './RenderColumnTypeValue.vue'
import { ColumnType, operateMap, dateExcludeOperate, logicOperate } from '../../Constant/constant'
import debounce from 'lodash/debounce'
import { getTableCode } from '../getTableCode'

// import {
//   columnTypeConfiguate
// } from '../../sevrices/configurationView'
export default {
  name: 'ant-group',
  props: {
    // 当前组数据
    groupData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 当前组索引
    index: {
      type: Number,
      default: 0
    },
    // 二级索引  只有条件组才会有
    filterIndex: {
      type: Number,
      default: 0
    },
    // 条件
    searchList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 第一列 下拉列表
    selectColumnList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 初始化表头数据
    cacheColumnList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 操作符集合
    columnOperatorList: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableCode: {
      type: String,
      default: ''
    },
    // 自定义请求
    columnMap: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 表头
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 隐藏+ -  true隐藏 默认false
    hideIcon: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    groupData (val) {
      val.type = String(val.type)
      this.item = val
      if (String(this.item.type) === '1') {
        // this.filterTypeArray = ['1']
        // 列比较的值
        this.item.columnCompareValue = this.item.value
      }
      // 更新过滤类型列表
      this.updateFilterType(this.item.operator)
    }
  },
  data () {
    return {
      dateExcludeOperate, // 不需要展示过滤类型和value的操作符
      optionsAllType: [
        { label: '数值', value: '0' },
        { label: '数据列', value: '1' }
      ],
      // 当前显示的过滤条件类型集合
      optionsType: [{ label: '数值', value: '0' }],
      // 第四列 列比较的数据源
      selectColumnCompareList: [],
      item: {},
      operateMap,
      ColumnType,
      relationType: 0,
      title: '', // 视图名称
      operaterList: [
        { label: 'AND', value: 0 },
        { label: 'OR', value: 1 }
      ],
      // 接口给的过滤条件类型集合
      filterTypeArray: [],
      logicOperate
    }
  },
  // searchList (val) {
  //   console.log(val)
  // },
  computed: {

  },
  components: {
    renderColumnTypeValue
  },
  created () {
  },
  mounted () {
    this.currentTableCode = getTableCode(this)
    this.init()
  },
  methods: {
    // 初始化数据
    init () {
      console.log('watch', this.groupData)
      this.item = this.groupData
      this.item.type = String(this.item.type)
      const val = this.item
      if (String(val.type) === '1') {
        this.item.columnCompareValue = val.value
        val.value = ''
        // 设置类型选择框数据
        this.item.type = '1'
      }
      // // 更新过滤类型列表
      this.updateFilterType(this.item.operator)
      // 回显数据
      const item = this.item
      if (item && item.column) {
        // 设置列类型数据源
        this.selectColumnCompareList = this.selectColumnList.filter(e => {
          return e.columnType === item.column.columnType && e.code != item.column.code
        })
      }
    },
    // 检测是否显示过滤条件 及 对比值 包含不显示  不包含 显示
    // 返回值 true 显示 false 不显示
    filterFlag () {
      if (!this.item.column) return false
      // console.log('this.item.column', this.item)
      // 为空 || 不为空 不显示后面的
      if (this.item.operator == logicOperate.IS_NULL.state || this.item.operator == logicOperate.IS_NOT_NULL.state) {
        return false
      }
      const operateIds = this.dateExcludeOperate.map((operate) => operate.value)
      const flag = operateIds.includes(this.item.operator)
      // console.log(flag, operateIds, this.item.operator)
      return flag == false
    },
    // 列比较搜索
    handleSearchL (value, item) {
      const cacheColumnList = []
      const selectColumnCompareList = this.selectColumnList.filter(e => {
        return e.columnType === item.column.columnType && e.code != item.column.code
      })
      selectColumnCompareList.forEach(e => {
        if (e.columnTitle.includes(value)) {
          cacheColumnList.push(e)
        }
      })
      this.selectColumnCompareList = cacheColumnList
    },
    // 列比较失去焦点
    handleblursL: debounce(function (value, item) {
      this.selectColumnCompareList = this.selectColumnList.filter(e => {
        return e.columnType === item.column.columnType && e.code != item.column.code
      })
    }, 300),
    handleSearch (value, item) {
      this.$emit('handleSearch', value, item)
    },
    // 初始化一级下拉列表
    handleblurs (value, item) {
      // console.log(value, item)
      this.$emit('handleSearch', '', item)
    },
    // region 视图条件
    // 修改视图条件 第一个下拉框 修改条件
    changeColumn (val, option, item) {
      // console.log(val, option, item)
      item.column = option.data.attrs.data
      item.value = null

      // this.$emit('setSelectColumnList', this.cacheColumnList)
      // 设置第二列数据源
      this.querySecondData(item)

      // 设置列比较数据源
      this.selectColumnCompareList = this.selectColumnList.filter(e => {
        return e.columnType === item.column.columnType && e.code != item.column.code
      })
    },
    changeColumnValue3 (value, item) {
      item.value = value
      item.type = '0'
    },
    changeColumn4 (val, option, item) {
      // console.log(val, option, item)
      item.type = '1'
      item.value = val
    },
    /**
     * 选择下拉列表 更新查询第二列(操作符下拉)数据 和设置第三列(过滤条件)显示值
     * @params item 当前条件数据
     */
    querySecondData (item) {
      console.log(item, 'querySecondData')
      // 0 配置视图信息   1 页面过滤
      const operators = item.column.operators.filter((item) => item.showPosition.includes('0')) // 操作符集合
      // 读取默认值  没有的话默认显示第一个操作符
      const index = operators.findIndex((operator) => operator.isDefaultShow)
      if (index > -1) {
        item.operator = operators[index].operatorId
      } else {
        item.operator = operators[0].operatorId
      }
      // 更新过滤类型列表
      this.updateFilterType(item.operator)
      this.$nextTick(() => {
        if (this.$refs[`renderValue_${item.uuid}`]) {
          this.$refs[`renderValue_${item.uuid}`].initRender(item.column, item.operator, this.currentTableCode, this.item.value)
        }
      })
    },
    // 修改操作符 更新列类型
    changeOperate (value, item) {
      // console.log(value, item, this.groupData)
      // 更新过滤类型列表
      this.updateFilterType(value)
      // 设置当前条件是否 展示 值选择 列选择
      // this.filterTypeArray = operateObj.filterTypeArray
      item.operator = value
      item.value = null
      // console.log(item.operator, 'item.operator')
      this.$nextTick(() => {
        this.$refs[`renderValue_${item.uuid}`]?.initRender(this.groupData.column, this.groupData.operator, this.currentTableCode, this.item.value)
      })
    },
    // 更新过滤类型列表
    updateFilterType (value) {
      // console.log(this.columns, this.groupData)
      if (this.groupData.column && this.groupData.column.operators) {
        const index = this.groupData.column.operators.findIndex((operatorObj) => value == operatorObj.operatorId)
        // const index = this.columnOperatorList.findIndex((operatorObj) => value == operatorObj.operatorId)
        if (index > -1) {
          // 0 配置视图信息   1 页面过滤
          this.item.operators = this.groupData.column.operators.filter((item) => item.showPosition.includes('0'))
          const filterType = this.item.operators[index].filterType
          // const filterType = this.columnOperatorList[index].filterType
          let filterTypeArray = []
          // console.log('filterType', filterType, filterTypeArray, this.columnOperatorList[index])
          if (filterType && filterType.indexOf(',') == -1) {
            filterTypeArray = [filterType]
          } else {
            filterTypeArray = filterType.split(',')
          }
          this.filterTypeArray = filterTypeArray
          this.setOptionsType()
        }
      }
    },
    // 更新过滤类型列表
    setOptionsType () {
      // console.log(this.filterTypeArray, 'filterTypeArray')
      if (this.filterTypeArray) {
        // 过滤条件列表
        this.optionsType = []
        this.filterTypeArray.forEach(e => {
          if (e == '0') {
            this.optionsType.push({ label: '数值', value: '0' })
          } else if (e == '1') {
            this.optionsType.push({ label: '数据列', value: '1' })
          }
        })

        if (this.filterTypeArray.indexOf(this.item.type) == -1) {
          this.item.type = this.filterTypeArray[0]
        }
      }
    },
    // 添加 视图条件
    addItem (item) {
      // console.log(item, this.index, this.filterIndex)
      // 1 条件添加  2 条件组添加
      if (item.groupType === 1) {
        this.$emit('addItem', item, this.index)
      } else if (item.groupType === 2) {
        this.$emit('addItem', item, this.index, this.filterIndex)
      }
    },
    // 删除 视图条件
    delItem (item) {
      // console.log(item, this.index, this.filterIndex)
      // 1 条件删除  2 条件组删除
      if (item.groupType === 1) {
        this.$emit('delItem', item, this.index)
      } else if (item.groupType === 2) {
        this.$emit('delItem', item, this.index, this.filterIndex)
      }
    },
    // 第一个形参必须是当前item  groupType组类型: 1 -> 条件；2 -> 条件组
    updateColumn () {
      // console.log(123, '123')
      const list = [...arguments]
      list.splice(0, 1)
      this.$nextTick(() => {
        this.$refs[`renderValue_${this.groupData.uuid}`]?.initRender(this.groupData.column, this.groupData.operator, this.currentTableCode, this.groupData.value)
      })
    },
    checkValue (filter) {
      // console.log(this.$refs, filter)
      if (this.item.columnCompareValue) {
        return false
      }
      return this.$refs[`renderValue_${filter.uuid}`]?.checkValue()
    },
    getValue (filter) {
      console.log(this.$refs, filter)
      if (this.item.type == '1') {
        return this.item.columnCompareValue
      }
      return this.$refs[`renderValue_${filter.uuid}`]?.getValue()
    }
  }
}
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  margin-bottom: 10px;
}

.relativeClass {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
}

.selectAndOr {
  position: relative;
  width: 64px;
  height: 100%;
  align-items: center;
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

.del-item-icon {
  display: flex;
  align-items: center;
}

.add-item-icon {
  width: 14px;
  height: 14px;
  margin: 0 8px 0 15px;
  cursor: pointer;
}
</style>
