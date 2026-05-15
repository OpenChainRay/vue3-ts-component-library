<template>
  <div style="width: 100%;">
    <!-- 不需要搜索显示列名 -->

    <div v-if="!tableColumnObj.search||tableColumnObj.isGaugeOutfit===0">
      {{ tableColumnObj.columnTitle }}
    </div>

    <div v-else-if="tableColumnObj.search">
      <!-- 搜索字段为输入框类型 -->

      <div v-if='columnTypeObj[tableColumnObj.columnType].type === "input"'>
        <a-input style='text-align:center;width:100%;' v-model="searchValue" @keyup.enter="inputSearchChange()" :placeholder="tableColumnObj.columnTitle" />
      </div>

      <!-- 搜索字段为下拉框类型 字典  :mode="tableColumnObj.isMultiple == 1 ? 'multiple' : 'default'" -->
      <a-select v-if="columnTypeObj[tableColumnObj.columnType].type === 'select'" :style="{
        'width':tableColumnObj.width-40+'px','min-width':'50px'}" class='selectClass' :placeholder="tableColumnObj.columnTitle" v-model="searchValue"
        :allowClear='true' @change='inputSearchChange()' :dropdownMatchSelectWidth="false">
        <a-select-option v-for="(item, index) in selectList" :key="index" :value="item.value">
          {{ item.label }}
        </a-select-option>
      </a-select>
      <!-- 自定义请求 -->
      <div v-if="columnTypeObj[tableColumnObj.columnType].type === 'customSelect'">
        <!--   interactiveType  TEXT_INPUT(1, "文本输入"),OPTION(2, "下拉选择"), -->
        <a-input v-if="tableColumnObj.interactiveType == null || tableColumnObj.interactiveType == 1" :placeholder=" tableColumnObj.columnTitle"
          v-model="searchValue" @keyup.enter="inputSearchChange()" />
        <!-- 后端接口 -->
        <div v-else-if="tableColumnObj.querySource && tableColumnObj.querySource.queryCode">
          <selectPage :placeholder="tableColumnObj.columnTitle" v-model="searchValue" :selectList.sync="selectList"
            :selectOptionName="tableColumnObj.selectName" :selectOptionValue="tableColumnObj.selectValue" :mode="tableColumnObj.querySource.allowMultiple"
            :searchKey="tableColumnObj.selectValue" :request="tableColumnObj.request" :key="tableColumnObj.columnTitle"
            :queryCode="tableColumnObj.querySource.queryCode" @change='inputSearchChange()' style="width: 100%;">
          </selectPage>
        </div>
        <div v-else>
          <!-- :mode="tableColumnObj.isMultiple == 1 ? true : false" -->
          <!-- 前端自定义接口 -->
          <selectLazy v-if="currentColumnMap && currentColumnMap.custom" :placeholder="tableColumnObj.columnTitle" v-model="searchValue"
            :selectList="selectList" style="width: 100%;" :selectOptionName="currentColumnMap.selectName" :selectOptionValue="currentColumnMap.selectValue"
            @change='inputSearchChange()'>
          </selectLazy>
          <!-- (自定义静态)下拉框类型 -->
          <!-- :mode="currentColumnMap ? currentColumnMap.allowMultiple : 'default'" -->
          <a-select v-else :style="{
            'width':tableColumnObj.width-40+'px', 'min-width':'50px' }" class='selectClass' :placeholder="tableColumnObj.columnTitle" v-model="searchValue"
            :allowClear='true' @change='inputSearchChange()' :dropdownMatchSelectWidth="false" :mode="'default'">
            <a-select-option v-for="(item, index) in selectList" :key="index" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
      </div>

      <!--树型下拉框-->
      <div class="content" v-if="columnTypeObj[tableColumnObj.columnType].type === 'treeMode'">
        <div v-if="tableColumnObj.querySource && tableColumnObj.querySource.queryCode" style="width: 100%;">
          <a-tree-select v-if="selectList && selectList.length" :key="tableColumnObj.selectValue" show-search v-model="searchValue"
            :replaceFields="{children:'children', title:tableColumnObj.selectName, key:tableColumnObj.selectValue,value:tableColumnObj.selectValue }"
            style="width: 100%" :placeholder="tableColumnObj.columnTitle" allowClear :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="selectList" />
        </div>
        <div v-else style="width: 100%;">
          <a-tree-select v-if="selectList && selectList.length" :key="tableColumnObj.selectValue" show-search v-model="searchValue" tree-data-simple-mode
            :replaceFields="currentColumnMap.replaceFields" style="width: 100%" tree-node-filter-prop='title' :placeholder="tableColumnObj.columnTitle"
            allowClear :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" :tree-data="selectList" />
        </div>
      </div>

      <a-select v-if="columnTypeObj[tableColumnObj.columnType].type=== 'selectBoolean'" :style="{
        'width':tableColumnObj.width-40+'px',
        'min-width':'50px'
      }" class='selectClass' :placeholder="tableColumnObj.columnTitle" v-model="searchValue" :allowClear='true' @change='inputSearchChange()'
        :dropdownMatchSelectWidth="false">
        <a-select-option v-for="(item,index) in YesOrNo" :key="index" :value="item.value">
          {{ item.label }}
        </a-select-option>
      </a-select>

      <tiny-date-picker v-if="columnTypeObj[tableColumnObj.columnType].type === 'date'" :default-time="['00:00:00', '23:59:59']"
        :style="{width: (tableColumnObj.width - 30) + 'px'}" type="daterange" v-model="searchValue" :picker-options="pickerOptionsDateRange"
        :placeholder="`${tableColumnObj.columnTitle}`" :start-placeholder="`${tableColumnObj.columnTitle}`" :end-placeholder="`${tableColumnObj.columnTitle}`"
        unlink-panels @change="inputSearchChange" format="yyyy 年 MM 月 dd 日" time-format="HH 时 mm 分 ss 秒" size="mini">
      </tiny-date-picker>
    </div>
  </div>
</template>

<script>
import selectLazy from '../components/selectLazy/selectLazy.vue'

// import T from 'ant-design-vue/es/form'
/**
 * @description
 *
 */
import moment from 'moment'
import debounce from 'lodash/debounce'
import { ColumnType, logicOperate, YesOrNo } from '../Constant/constant'
import DatePicker from '@opentiny/vue-date-picker'
import selectPage from '../components/selectPage/selectPage.vue'
import { getTableCode } from '../AntTableView/getTableCode'
export default {
  components: {
    selectLazy,
    selectPage,
    TinyDatePicker: DatePicker
  },
  name: 'AntRowSearch',
  props: {
    tableCode: {
      type: String
    },
    tableColumnObj: {
      type: Object,
      default: function () {
        return {}
      }
    },
    // 自定义请求
    columnMap: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    searchValue: debounce(function () {
      if (this.columnTypeObj[this.tableColumnObj.columnType].type === 'input') { this.inputSearchChange() }
      // console.log(this.columnTypeObj, this.tableColumnObj)
    }, 1000),
    // 监听list变化及更新
    tableColumnObj: {
      handler: function (newValue) {
        // console.log(newValue)
        // 拉伸表格宽度会重新push  所以加个判断  有值就不push
        if (this.selectList.length === 0 && newValue.list) {
          if (newValue.querySource && newValue.querySource.queryCode) {
            newValue.list.forEach(item => {
              this.selectList.push({
                [newValue.selectName]: item[newValue.selectName],
                [newValue.selectValue]: item[newValue.selectValue]
              })
            })
          } else if (newValue.columnType === 7 && newValue.list) {
            newValue.list.forEach(item => {
              this.selectList.push({
                [this.currentColumnMap.selectName]: item[this.currentColumnMap.selectName],
                [this.currentColumnMap.selectValue]: item[this.currentColumnMap.selectValue]
              })
            })
          } else if (newValue.columnType === 1 && newValue.list) {
            newValue.list.forEach(item => {
              this.selectList.push({
                label: item.dictText,
                value: item.dictId
              })
            })
          }
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  data () {
    return {
      pickerOptionsDateRange: {
        firstDayOfWeek: 7,
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      YesOrNo,
      ColumnType,
      searchValue: undefined,
      timeValue: ['', ''],
      selectList: [],
      dateFormatList: 'YYYY-MM-DD',
      currentColumnMap: '',
      columnTypeObj:
      {
        //  0
        [ColumnType.Input]: {
          type: 'input',
          mode: 'text',
          operator: logicOperate.LIKE.state
        },
        // 1
        [ColumnType.Dict]: {
          type: 'select',
          mode: 'default',
          operator: logicOperate.IN.state
        },
        // 2
        [ColumnType.Date]: {
          type: 'date',
          mode: 'default',
          operator: logicOperate.BETWEEN.state
        },
        // 3
        [ColumnType.DateTime]: {
          type: 'date',
          mode: 'default',
          operator: logicOperate.BETWEEN.state
        },
        //  4
        [ColumnType.NUMBER]: {
          type: 'input',
          mode: 'number',
          operator: logicOperate.EQ.state
        },
        // 5
        [ColumnType.JE]: {
          type: 'input',
          mode: 'number',
          operator: logicOperate.EQ.state
        },
        // 6
        [ColumnType.BOOLEAN]: {
          type: 'selectBoolean',
          mode: 'default',
          operator: logicOperate.EQ.state
        },
        // 7
        [ColumnType.DataSource]: {
          type: 'customSelect',
          mode: 'default',
          operator: logicOperate.IN.state
        },
        // 8
        [ColumnType.TreeMode]: {
          type: 'treeMode',
          mode: 'default',
          operator: logicOperate.IN.state
        }

      },
      dataSourceList: {},
      currentTableCode: ''
    }
  },
  created () {
  },
  mounted () {
    this.currentTableCode = getTableCode(this)
    if (this.columnTypeObj[this.tableColumnObj.columnType]) {
      if (this.columnTypeObj[this.tableColumnObj.columnType].type === 'select') { this.getDict() }
      if (this.columnTypeObj[this.tableColumnObj.columnType].type === 'customSelect') { this.customSelect() }
      if (this.columnTypeObj[this.tableColumnObj.columnType].type === 'treeMode') { this.customSelect() }
    }
  },
  methods: {
    blur () {
      this.inputSearchChange()
    },
    getDict: function () {
      // console.log(this.tableColumnObj, 'tableColumnObj')
      if (this.tableColumnObj.list) {
        this.tableColumnObj.list.forEach(item => {
          this.selectList.push({
            label: item.dictText,
            value: item.dictId
          })
        })
      }
    },
    customSelect () {
      if (this.tableColumnObj.querySource && this.tableColumnObj.querySource.queryCode) {
        // console.log(this.tableColumnObj.list)
        if (this.tableColumnObj.list && this.tableColumnObj.list.length) {
          this.tableColumnObj.list.forEach(item => {
            this.selectList.push({
              [this.tableColumnObj.selectName]: item[this.tableColumnObj.selectName],
              [this.tableColumnObj.selectValue]: item[this.tableColumnObj.selectValue]
            })
          })
        }
        // console.log(this.selectList)
      } else {
        if (this.columnMap && this.columnMap[this.currentTableCode]) {
          // console.log(this.tableColumnObj, 'tableColumnObj')
          // debugger
          const current = this.columnMap[this.currentTableCode][this.tableColumnObj.dataIndex]
          this.currentColumnMap = this.columnMap[this.currentTableCode][this.tableColumnObj.dataIndex]
          // console.log(this.currentColumnMap, 'currentColumnMap')
          if (current && current.custom) {
            if (this.tableColumnObj.list && this.tableColumnObj.list.length) {
              this.tableColumnObj.list.forEach(item => {
                this.selectList.push({
                  [this.currentColumnMap.selectName]: item[this.currentColumnMap.selectName],
                  [this.currentColumnMap.selectValue]: item[this.currentColumnMap.selectValue]
                })
              })
              return this.tableColumnObj.list
            }
          } else {
            // console.log(current, 'current')
            if (!current) {
              return
            }
            const list = current.list
            list.forEach(item => {
              this.selectList.push({
                label: item.dictText,
                value: item.dictId
              })
            })
            return list
          }
        }
      }
    },
    clear () {
      // 清空
      this.searchValue = undefined
    },
    inputSearchChange (event) {
      // console.log(this.columnTypeObj, this.tableColumnObj.columnType, this.searchValue, 'inputSearchChange')
      let searchValue
      if ((this.tableColumnObj.columnType == 8 || this.tableColumnObj.columnType == 7) && this.searchValue) {
        searchValue = String(this.searchValue).trim()
      } else {
        searchValue = this.searchValue
      }
      const params = {
        operator: this.columnTypeObj[this.tableColumnObj.columnType].operator,
        relationType: 0,
        value: searchValue,
        // value: this.searchValue,
        columnTitle: this.tableColumnObj.dataIndex,
        paramType: this.tableColumnObj.paramType // "过滤条件类型:1.基础;2.扩展"
      }
      if (this.columnTypeObj[this.tableColumnObj.columnType].type === 'date') {
        // this.searchValue = moment(this.searchValue).format(this.dateFormatList)
        if (event) {
          const startTime = event[0]
          const endTime = event[1]
          const date = {
            first: startTime ? moment(startTime).format('YYYY-MM-DD 00:00:00') : null,
            last: endTime ? moment(endTime).format('YYYY-MM-DD 23:59:59') : null
          }
          params.value = date
        } else {
          params.value = ''
        }
      }
      console.log(params)
      this.$emit('columnSearch', params)
    }
  }
}
</script>

<style scoped>
:deep(.ant-input ){
  border: none;
  background: none;
}

:deep(.ant-select-selection ){
  border: none !important;
  background-color: #fafafa !important;
}
:deep(.ant-select-selection__placeholder ){
  text-align: center;
}
:deep(.tiny-range-input ){
  text-align: left;
  padding-left: 15px;
}
input[type='text']::placeholder {
  color: #000000;
}
input[type='number']::placeholder {
  color: #000000;
}
</style>
