<template>
  <div style="width: 100%;">
    <!-- 为空  -->
    <span v-if="operator === logicOperate.IS_NULL.state" style="width: 100%"></span>
    <!-- 不为空  -->
    <span v-else-if="operator === logicOperate.IS_NOT_NULL.state" style="width: 100%"></span>
    <!-- 输入框  -->
    <div v-if="columnType === ColumnType.Input">
      <a-input style="width: 100%" placeholder="请输入值" :disabled="disabled" v-model='itemValue' @change="changeValue" />
    </div>
    <!--字典  && 不为空   :mode="column.isMultiple == 1 ? 'multiple' : 'default'"  -->
    <div v-else-if="columnType === ColumnType.Dict && operator !== logicOperate.IS_NOT_NULL.state" class='flex between'>
      <a-select mode="multiple" v-model="itemValue" style="width:100%;" placeholder="请选择值" :disabled="disabled" @change="changeValue"
        :filter-option="filterOption" :dropdownMatchSelectWidth="false">
        <a-select-option v-for="(item, index) in dictList" :key="index" :value="item.dictId">
          {{ item.dictText }}
        </a-select-option>
      </a-select>
    </div>
    <!--布尔-->
    <div v-else-if="columnType === ColumnType.BOOLEAN" class="content">
      <a-select v-model="itemValue" :placeholder="'请选择值'" style="width:100%;" :disabled="disabled" @change="changeValue">
        <template v-for="(item, index) in YesOrNo">
          <a-select-option v-if="item.value==='0'||item.value==='1'" :key="index+'_'+item.value" :value="item.value">
            {{ item.label }}
          </a-select-option>
        </template>
      </a-select>
    </div>
    <!--自定义数据源 && 不为空 -->
    <div v-else-if="columnType === ColumnType.DataSource && operator !== logicOperate.IS_NOT_NULL.state" class='flex between'>
      <!--   interactiveType  TEXT_INPUT(1, "文本输入"),OPTION(2, "下拉选择"), -->
      <a-input v-if="column.interactiveType == null || column.interactiveType == 1" style="width: 100%" placeholder="请输入值" :disabled="disabled"
        v-model='itemValue' @change="changeValue" />
      <div v-else-if="column.querySource && column.querySource.queryCode" style="width: 100%;">
        <!-- 不能使用传值 pageNums 等值   因为他们增加条件  它们共用的是一个表头   修改一个其他的都会改变   需要组件自身的pageNum 闭包 -->
        <selectPage :placeholder="'请选择'+column.columnTitle" v-model="itemValue" :selectList.sync="dateSourceList" :selectOptionName="column.selectName"
          :selectOptionValue="column.selectValue" :mode="column.querySource ? column.querySource.allowMultiple : false" :searchKey="column.selectValue"
          :request="column.request" :key="column.columnTitle" :queryCode="column.querySource.queryCode" style="width:100%;"></selectPage>
      </div>
      <div v-else style="width: 100%;">
        <!-- :mode="column.isMultiple == 1 ? true : false" -->
        <selectLazy v-if="column.columnMap && column.columnMap.custom" :placeholder="'请选择'+column.columnTitle" v-model="itemValue" :selectList="dateSourceList"
          :selectOptionName="column.columnMap.selectName" :selectOptionValue="column.columnMap.selectValue" :mode="false" style="width:100%;">
        </selectLazy>
        <a-select v-else v-model="itemValue" style="width:100%;" :disabled="disabled" @change="changeValue" :filter-option="filterOption"
          :dropdownMatchSelectWidth="false" :mode="column.columnMap ? column.columnMap.allowMultiple : 'default'">
          <a-select-option v-for=" (item, index) in dateSourceList" :key="index" :value="item.dictId">
            {{ item.dictText }}
          </a-select-option>
        </a-select>
      </div>
    </div>
    <!--树结构-->
    <div v-else-if="columnType === ColumnType.TreeMode" class='flex between'>
      <div v-if="column.querySource && column.querySource.queryCode" style="width: 100%;">
        <a-tree-select v-if="dateSourceList && dateSourceList.length" show-search v-model="itemValue" tree-data-simple-mode
          :replaceFields="{children:'children', title:column.selectName, key:column.selectValue,value:column.selectValue }" style="width: 100%"
          tree-node-filter-prop='title' :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" :tree-data="dateSourceList" />
      </div>
      <div v-else style="width: 100%;">
        <a-tree-select v-if="dateSourceList && dateSourceList.length" show-search v-model="itemValue" tree-data-simple-mode
          :replaceFields="column.columnMap.replaceFields" style="width: 100%" tree-node-filter-prop='title'
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" :tree-data="dateSourceList" />
      </div>
    </div>

    <!--时间-->
    <div v-else-if="columnType === ColumnType.DateTime || columnType === ColumnType.Date" class='flex between' style="position:relative;width: 100%;">
      <!-- 等于 大于 小于 大于等于 小于等于 不等于 选择日期 -->
      <div v-if="singleDataLogicOperateType.indexOf(operator) !== -1">
        <div style="display: flex;align-items: center;">
          <a-date-picker v-model="itemValue" format="YYYY-MM-DD" :disabled="disabled" style="width: 100%" placeholder="选择日期" @change="changeValue" />
        </div>
      </div>
      <!-- 指定日期 -->
      <div v-if="operator === logicOperate.APPOINT_DATE.state">
        <a-date-picker v-model="itemValue" format="YYYY-MM-DD" :disabled="disabled" style="width: 100%" placeholder="选择日期" @change="changeValue" />
      </div>
      <!-- 今天之后N天之前 -->
      <div v-if="operator === logicOperate.AFTER_TODAY_BEFORE_ONE_DAY.state">
        <a-input-number :disabled="disabled" v-model="itemValue" :min="0" @change="changeValue" />
      </div>
      <!--两个日期 BETWEEN 之间  -->
      <div v-if="operator === logicOperate.BETWEEN.state" style="width: 100%">
        <a-date-picker :disabled="disabled" style="width: calc( 49% - 14px)" v-model="itemValue.startTime" :disabledDate="disabledDateStart" format="YYYY-MM-DD"
          placeholder="日期开始时间" @change="onChangeStartTwo" @openChange="openChange" />
        <span style="padding:6px;">到</span>
        <a-date-picker :disabled="disabled" style="width: calc( 49% - 14px)" v-model="itemValue.endTime" :disabledDate="disabledDateEnd" format="YYYY-MM-DD"
          placeholder="日期结束时间" @change="onChangeEndTwo" @openChange="openChange" />
      </div>
      <!--为空 不为空，无日期-->
      <a-input :disabled="disabled" v-if="operator === logicOperate.IS_NULL.state || operator === logicOperate.IS_NOT_NULL.state" placeholder="请输入标题"
        v-model='itemValue' style="width:100%;visibility: hidden" @change="changeValue" />
      <!--动态时间-->
      <template v-if="operator === logicOperate.D_DATE.state">
        <!--输入框第一个值-->
        <a-input-number id="inputNumber" :disabled="disabled" v-model="itemValue.preValue" :min="0" @change="(val) => { onChangeNumber(itemValue) }"
          style="width:20%;margin-right:1%" />
        <!--下来框框第二个值-->
        <a-select v-model="itemValue.preType" :disabled="disabled" style="width: calc( 32% - 35px);margin-right:1%" @change='onChangeNumber(itemValue)'
          :dropdownMatchSelectWidth="false">
          <a-select-option v-for="(item, index) in timeList" :key="index" :value="item.value">
            {{ item.key }}
          </a-select-option>
        </a-select>
        <span style="padding:3px;color:#d9d9d9">—</span>
        <a-input-number :disabled="disabled" id="inputNumber" v-model="itemValue.sufValue" :min="0" @change="(val) => { onChangeNumber(itemValue) }"
          style="width:20%;margin-right:1%" />
        <a-select :disabled="disabled" v-model="itemValue.sufType" @change="onChangeNumber(itemValue)" style="width:calc( 30% - 35px)"
          :dropdownMatchSelectWidth="false">
          <a-select-option v-for="(item, index) in timeList" :key="index" :value="item.value">
            {{ item.key }}
          </a-select-option>
        </a-select>
        <div style='text-align:right;color: rgb(255, 175, 33);'> {{ errMessage }}</div>
      </template>
      <!--日历时间-->
      <div v-if="operator === logicOperate.C_DATE.state" style="width: 100%">
        <a-select :disabled="disabled" style="width:32.3333%;" @change="onChangeNumberCalendar(itemValue)" v-model="itemValue.preType"
          :dropdownMatchSelectWidth="false">
          <a-select-option v-for="(item, index) in calendarTimeOption" :key="index" :value="item.value"> {{ item.key }} </a-select-option>
        </a-select>
        <a-input-number id="inputNumber" :min="0" style="width:32.3333%;" :disabled='disabled?disabled:itemValue.preType === 2' v-model="itemValue.value"
          @change="onChangeNumberCalendar(itemValue)" />
        <a-select v-model="itemValue.sufType" style="width:32.3333%;" @change="onChangeNumberCalendar(itemValue)" :dropdownMatchSelectWidth="false">
          <a-select-option v-for="(item, index) in calendarDateType" :key="index" :value="item.value">
            {{ item.key }}
          </a-select-option>
        </a-select>
        <div style='text-align:right;color: rgb(255, 175, 33);'>
          {{ calendarMessage }}
        </div>
      </div>

    </div>
    <!--数字-->
    <div v-else-if="columnType === ColumnType.NUMBER" class="content">
      <a-input-number id="inputNumber" style="width:100%" :disabled="disabled" @change="changeValue" v-model="itemValue" :min="0" />
    </div>
    <!-- 金额 -->
    <div v-else-if="columnType === ColumnType.JE">
      <!-- <at-statistic :disabled="disabled" style="width:100%" align="right" :min="0" v-model="itemValue" @change="changeValue" /> -->
      <a-input-number id="inputNumber" style="width:100%" :disabled="disabled" @change="changeValue" v-model="itemValue" :min="0" />
    </div>
  </div>
</template>
<script>
import {
  ColumnType, operateMap, logicOperate, YesOrNo, singleDataLogicOperateType, timeList, calendarTimeOption,
  calendarDateType, dateExcludeOperate
} from '../../Constant/constant'
// filterQuerySource employeePage menuTree
import { dynamic, calendar, getDictByTypeId, filterQuerySource } from '../../sevrices/configurationView'
// import AtStatistic from '../at-statistic/index.vue'
import moment from 'moment/moment'
import selectLazy from '../../components/selectLazy/selectLazy.vue'
import selectPage from '../../components/selectPage/selectPage.vue'

export default {
  name: 'addViewTable',
  components: {
    // AtStatistic,
    selectLazy,
    selectPage
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    // 自定义请求
    columnMap: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 表头
    columns: {
      type: Array,
      default: () => {
        return []
      }
    }

  },
  data () {
    return {
      ColumnType,
      operateMap,
      logicOperate, // 操作符
      YesOrNo,
      dateExcludeOperate, // 不需要展示过滤类型和value的操作符
      singleDataLogicOperateType, // [ 等于 大于 小于 大于等于 小于等于 不等于 ]
      timeList,
      calendarTimeOption,
      calendarDateType,
      itemValue: null,
      errMessage: '',
      calendarMessage: '',
      dictList: [],
      dateSourceList: [],
      columnType: ColumnType.Input,
      operator: operateMap[ColumnType.Input][0].value,
      column: {},
      startTime: '',
      endTime: ''
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {

  },
  /* eslint-disable */
  methods: {
    /* eslint-disable */
    openChange () {
      setTimeout(() => {
        const monthSelect = document.querySelector('.ant-calendar-month-select')
        console.log(monthSelect, 'monthSelect')
        if (monthSelect) {
          monthSelect.onclick = null
          // monthSelect.removeEventListener('click');
          // 为mouseenter事件添加事件监听器
          monthSelect.addEventListener('mouseenter', function () {
            this.style.color = '#000'; // 鼠标悬停时改变颜色
          });
          monthSelect.addEventListener('click', () => {
            console.log('click')
          })
        }
      }, 100)

    },
    // 树节点  是否禁用
    treeSelectable (tree) {
      for (let i = 0; i < tree.length; i++) {
        if (tree[i].children && tree[i].children.length > 0) {
          tree[i].disabled = true
          this.treeSelectable(tree[i].children)
        } else {
          tree[i].disabled = false
        }
      }
    },
    async initRender (column, operate, tableCode, value, dateSourceList, dictList) {
      console.log(column, column.columnType, this.columnMap, operate, tableCode, value, dateSourceList, dictList)
      if (!column) return
      // if (column.columnTitle === '报价项编码') {
      //   column.querySource = {
      //     queryCode: '5befab88-747f-407b-9915-3ab2a21a8c61'
      //   }
      //   column.interactiveType = 2
      // }
      let hasInit = false
      this.itemValue = undefined
      this.columnType = column.columnType
      this.operator = operate
      this.column = column
      // debugger
      if (column.columnType === ColumnType.DataSource || column.columnType === ColumnType.TreeMode) {
        if (dateSourceList) {
          this.dateSourceList = [dateSourceList]
        } else {
          if (column.querySource && column.querySource.queryCode) {
            // 回显当前的值
            // const codes = value.split(',')
            let codes;
            if (value) {
              codes = value.split(',')
            } else {
              codes = []
            }
            const params = {
              codes,
              param: {
                "orderColumns": [
                  {
                    "columnName": "",
                    "isAsc": false
                  }
                ],
                pageNum: 1,
                pageSize: 10,
                param: ''
              },
              queryCode: column.querySource.queryCode
            }
            const result = await filterQuerySource(params)
            // console.log(result)
            if (result.data.code === 200 && result.data.data) {
              const data = result.data.data
              // this.dateSourceList = data.optionPage.list
              const list = this.deWeightThree([...data.optionPage.list, ...data.optionList])
              this.dateSourceList = list
              this.$set(this.column, 'list', list)
              this.$set(this.column, 'pageNum', data.optionPage.pageNum)
              this.$set(this.column, 'pageSize', data.optionPage.pageSize)
              this.$set(this.column, 'pages', data.optionPage.pages)
              this.$set(this.column, 'total', data.optionPage.total)
              this.$set(this.column, 'selectName', 'label')
              this.$set(this.column, 'selectValue', 'code')
              this.$set(this.column, 'request', filterQuerySource)
              // 根据单选或者多选过滤数据回显 多选 []  单选字符串
              if (this.column.querySource.allowMultiple) {
                // if (true) {
                hasInit = true
                if (typeof value === 'string') {
                  this.itemValue = value.split(',')
                }
              }

              console.log(this.column, column)
            }
          } else {
            // console.log(this.columnMap, tableCode, this.columnMap[tableCode])
            if (!this.columnMap[tableCode]) return
            let dataobj = this.columnMap[tableCode][column.code]
            if (!dataobj) {
              dataobj = this.columnMap[tableCode][column.dataIndex]
            }
            column.columnMap = dataobj
            // 根据单选或者多选过滤数据回显 多选 []  单选字符串
            // if (column.columnMap && column.columnMap.allowMultiple && value) {
            //   value = value.split(',')
            // }
            // <!--   interactiveType  TEXT_INPUT(1, "文本输入"),OPTION(2, "下拉选择"), -->
            if (column.interactiveType == 2) {
              if (value && typeof value === 'string') {
                value = value.split(',')
              }
            }
            // console.log(value, column, column.columnMap)
            if (dataobj && dataobj.custom) {
              // column.columnMap = dataobj
              let resultData
              // function 需要调用 request()  promise 直接 await
              if (typeof column.columnMap.request === 'function') {
                resultData = await column.columnMap.request(column.columnMap.params)
              } else {
                resultData = await column.columnMap.request
              }

              // 自定义过滤数据  customList true
              if (column.columnMap.customList) {
                column.columnMap.transfrom(column, resultData.data.data)
                this.dateSourceList = column.list
              } else {
                this.dateSourceList = resultData.data.data
              }

              // 由于一些数据列表value是number  接口的value却是string  导致数据不回显  所以统一改为string
              this.dateSourceList.forEach(element => {
                element[column.columnMap.selectValue] = String(element[column.columnMap.selectValue])
              });
              // console.log(resultData, column)
            } else {
              this.dateSourceList = this.columnMap[tableCode][column.dataIndex].list
            }
            // console.log(this.dateSourceList)
          }
        }
      }
      if (column.columnType === ColumnType.Dict) {
        if (dictList) {
          this.dictList = [...dictList]
        } else {
          const { data } = await getDictByTypeId({ dictIds: [], dictKeys: [], dictTexts: [], typeId: column.dictTypeId }).catch((error) => { throw new Error(error) })
          if (data.code && data.code === 200) {
            const list = data.data
            this.dictList = [...list.dictList]
          } else {
            this.dictList = []
          }
        }
        if (value) {
          const values = []
          value.split(',').forEach(x => values.push(Number(x)))
          this.itemValue = values
          hasInit = true
        }
      }
      if (column.columnType === ColumnType.DateTime || column.columnType === ColumnType.Date) {
        // timeCompareType
        // console.log(this.singleDataLogicOperateType, operate)
        // if (this.singleDataLogicOperateType.indexOf(operate) !== -1) {
        //   // 等于 大于 小于 大于等于 小于等于 不等于
        //   if (value) {
        //     hasInit = true
        //     this.itemValue = {
        //       timeCompareType: JSON.parse(value).timeCompareType,
        //       namedDate: JSON.parse(value).namedDate
        //     }
        //   } else {
        //     this.itemValue = {
        //       timeCompareType: null,
        //       namedDate: null
        //     }
        //   }
        // } else 
        if (operate === logicOperate.BETWEEN.state) {
          // 之间
          if (value) {
            hasInit = true
            this.itemValue = {
              startTime: JSON.parse(value).first,
              endTime: JSON.parse(value).last
            }
            this.startTime = JSON.parse(value).first
            this.endTime = JSON.parse(value).last
          } else {
            this.itemValue = {
              startTime: null,
              endTime: null
            }
          }
        } else if (operate === logicOperate.D_DATE.state) {
          // 动态时间
          // debugger
          if (value) {
            hasInit = true
            this.itemValue = JSON.parse(value)
          } else {
            this.itemValue = {
              preType: 1,
              preValue: null,
              sufType: 1,
              sufValue: null
            }
          }
        } else if (operate === logicOperate.C_DATE.state) {
          // 日历时间
          if (value) {
            hasInit = true
            this.itemValue = JSON.parse(value)
          } else {
            this.itemValue = {
              preType: 1,
              value: null,
              sufType: 1
            }
          }
        } else if (operate === logicOperate.AFTER_TODAY_BEFORE_ONE_DAY.state) {
          // 今天之后N天之前
          if (value) {
            hasInit = true
            // const itemValue = JSON.parse(value)
            // const startDate = itemValue.first // 开始时间
            // const endDate = itemValue.last // 结束时间
            // const days = endDate.diff(startDate, 'days');
            // this.itemValue = days
            this.itemValue = value
          } else {
            this.itemValue = ''
          }
        } else {
          // 正常单个日期
          hasInit = true
          const itemValue = JSON.parse(value)
          // console.log(itemValue, 'itemValue')
          this.itemValue = itemValue.first
        }
      }
      // console.log(value, !hasInit)
      if (value && !hasInit) {
        this.itemValue = value
      }
    },
    // 数组去重
    deWeightThree (list) {
      let name = 'code';
      const arr = []
      list.forEach(element => {
        const index = arr.findIndex((item) => { return item[name] === element[name] })
        // console.log(index)
        if (index === -1) {
          arr.push(element)
        }
      });
      return arr
    },
    // 之间  修改开始时间
    onChangeStartTwo (value, dateString) {
      // eslint-disable-next-line sonarjs/no-duplicate-string
      console.log('Selected Time: ', value)
      // eslint-disable-next-line sonarjs/no-duplicate-string
      console.log('Formatted Selected Time: ', dateString)
      this.startTime = dateString
      this.$emit('change', this.getValue())
    },
    // 之间  修改结束时间
    onChangeEndTwo (value, dateString) {
      console.log('Selected Time: ', value)
      console.log('Formatted Selected Time: ', dateString)
      this.endTime = dateString
      this.$emit('change', this.getValue())
    },

    disabledDateStart (current) {
      // current为当前日期选择页的全部日期
      const endTime = moment(this.endTime).valueOf()// valueOf()将moment(this.startTime)转化为毫秒数值
      const currentTime = current.valueOf()
      return currentTime > endTime// 禁用小于开始时间的日期

    },
    disabledDateEnd (current) {
      // current为当前日期选择页的全部日期
      const endTime = moment(this.startTime).valueOf()// valueOf()将moment(this.startTime)转化为毫秒数值
      const currentTime = current.valueOf()
      return currentTime < endTime// 禁用小于开始时间的日期
    },
    async onChangeNumber (param) { // 动态时间
      this.errMessage = '' // 比较2个时间
      if (param.preValue && param.sufValue) {
        const result = await dynamic(param).catch((error) => { throw new Error(error) })
        if (result.data.code && result.data.code === 200) {
          const beginTime = result.data.data.first
          const endTime = result.data.data.last
          if (beginTime > endTime) {
            this.errMessage = '条件配置有误'
          } else {
            this.errMessage = beginTime + '~' + endTime
          }
        } else {
          this.errMessage = ''
          this.$antmessage.error(result.data.msg)
        }
      }
      this.changeValue()
    },
    async onChangeNumberCalendar (param) { // 日历时间
      const result = await calendar(param).catch((error) => { throw new Error(error) })
      if (result.data.code && result.data.code === 200) {
        const beginTime = result.data.data.first
        const endTime = result.data.data.last
        if (beginTime > endTime) {
          this.calendarMessage = '条件配置有误'
        } else {
          this.calendarMessage = beginTime + '~' + endTime
        }
      } else {
        this.calendarMessage = ''
        this.$antmessage.error(result.data.msg)
      }
      this.changeValue()
    },
    /**
     * 兼容 Vue2/3 提取下拉项文本。
     */
    getOptionText (option) {
      const text =
        option?.componentOptions?.children?.[0]?.text ||
        option?.children?.[0]?.children ||
        option?.label ||
        option?.value
      return String(text || '')
    },
    filterOption (input, option) {
      return this.getOptionText(option).toLowerCase().indexOf(String(input).toLowerCase()) >= 0
    },
    changeValue (val) {
      console.log(this.getValue())
      this.$emit('change', this.getValue())
    },
    checkValue () {
      // 为空  不为空
      if (this.operator === logicOperate.IS_NULL.state || this.operator === logicOperate.IS_NOT_NULL.state) {
        return false
      }
      let errorFlag = false
      if (this.itemValue === null || this.itemValue === undefined || this.itemValue === '') {
        return true
      }
      switch (this.columnType) {
        // 日历时间格式化
        case ColumnType.Date:
        case ColumnType.DateTime:
          if (this.operator === logicOperate.BETWEEN.state) {
            // debugger
            // 之间
            if (!this.itemValue.startTime || !this.itemValue.endTime) {
              errorFlag = true
            }
          } else if (this.operator === logicOperate.D_DATE.state) {
            // 动态时间
            if (this.errMessage === '条件配置有误') {
              errorFlag = true
            }
            if (!this.itemValue ||
              this.itemValue.sufValue === null || this.itemValue.sufValue === undefined ||
              this.itemValue.sufType === null || this.itemValue.sufType === undefined ||
              this.itemValue.preType === null || this.itemValue.preType === undefined ||
              this.itemValue.preValue === null || this.itemValue.preValue === undefined) {
              errorFlag = true
            }
          } else if (this.operator === logicOperate.C_DATE.state) {
            // 日历时间
            if (this.errMessage === '条件配置有误') {
              errorFlag = true
            }
            if (!this.itemValue ||
              this.itemValue.sufType === null || this.itemValue.sufType === undefined ||
              this.itemValue.preType === null || this.itemValue.preType === undefined ||
              this.itemValue.value === null || this.itemValue.value === undefined) {
              errorFlag = true
            }
          }
          break
        // 字典格式化
        case ColumnType.Dict:
          if (!this.itemValue || this.itemValue.length === 0) {
            errorFlag = true
          }
          break
      }
      return errorFlag
    },
    getValue () {
      // 为空  不为空   若是 是null或者不是null
      if (this.operator === logicOperate.IS_NULL.state || this.operator === logicOperate.IS_NOT_NULL.state) {
        return null
      }
      let value
      switch (this.columnType) {
        // 日历时间格式化
        case ColumnType.Date:
        case ColumnType.DateTime:
          // 等于 大于 小于 大于等于 小于等于 不等于
          // if (this.singleDataLogicOperateType.indexOf(this.operator) !== -1) {
          //   // 比较值
          //   value = {
          //     timeCompareType: this.itemValue.timeCompareType,
          //   }
          //   if (this.itemValue.timeCompareType == 10) {
          //     value.namedDate = moment(this.itemValue.namedDate).format('YYYY-MM-DD')
          //   }
          // } else 
          // 没有日期
          if (this.filterFlag()) {
            value = { first: null, last: null }
          } else if (this.operator === logicOperate.BETWEEN.state) {
            // 之间
            value = {
              first: moment(this.itemValue.startTime).format('YYYY-MM-DD 00:00:00'),
              last: moment(this.itemValue.endTime).format('YYYY-MM-DD 23:59:59')
            }
          } else if (this.operator === logicOperate.C_DATE.state) {
            // 动态时间
            value = this.itemValue
          } else if (this.operator === logicOperate.D_DATE.state) {
            // 日历时间
            value = this.itemValue
          } else if (this.operator === logicOperate.AFTER_TODAY_BEFORE_ONE_DAY.state) {
            // 今天之后N天之前
            // const currentTime = moment().format('YYYY-MM-DD 00:00:00')
            // const last = moment().add(this.itemValue, 'days').format('YYYY-MM-DD 23:59:59')
            // value = {
            //   first: currentTime,
            //   last: last
            // }
            value = this.itemValue
          } else {
            // value = moment(this.itemValue).format('YYYY-MM-DD')
            const first = moment(this.itemValue).format('YYYY-MM-DD 00:00:00')
            const last = moment(this.itemValue).format('YYYY-MM-DD 23:59:59')
            value = {
              first,
              last
            }
          }
          break
        // 字典格式化
        case ColumnType.Dict:
          // value = this.itemValue.join(',')
          value = String(this.itemValue).trim()
          break
        // 自定义数据格式化 (根据单选或者多选是否格式化)
        case ColumnType.DataSource:
          // console.log(this.column.allowMultiple, 'allowMultiple')
          // if (this.column.querySource.allowMultiple || this.column.columnMap.allowMultiple) {
          //   value = this.itemValue.join(',')
          // } else {
          //   value = this.itemValue
          // }
          value = String(this.itemValue).trim()
          // console.log(this.itemValue)
          break
        default:
          value = this.itemValue
      }
      return value
    },
    // 检测是否显示过滤条件 及 对比值 包含不显示  不包含 显示
    // 返回值 true 包含 false 不包含
    filterFlag () {
      if (!this.operator) return true // 为空  默认不显示后面的
      const operateIds = this.dateExcludeOperate.map((operate) => operate.value)
      const flag = operateIds.includes(this.operator) // 当前项是否是今天、明天等操作符
      // console.log(flag, flag == false, operateIds, this.operator)
      return flag
    },
  }
}
</script>
