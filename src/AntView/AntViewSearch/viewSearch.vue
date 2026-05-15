<template>
  <div>
    <div class="main mainoms">
      <div class="main-left">
        <div class="main-item" v-for="(item, index) in searchList" :key='index' @mouseover="mouseOver(item)"
          @mouseleave="mouseLeave(item)">
          <span class="title">{{ item.columnTitle }}</span>
          <div style="width: 80px;" class="Fclass">
            <a-select placeholder="符号" v-model="item.operator" @change="(val) => changeOperate(val, item)"
              :disabled="isDisabledFun(item)">
              <!-- operateMap[item.columnType] -->
              <a-select-option v-for="(item1, index1) in item.operators" :key="index1" :value="item1.operatorId">
                <a-tooltip>
                  <template slot="title">
                    {{ item1.operatorName }}
                    <!-- {{ item1.key }} -->
                  </template>
                  {{ item1.operatorName }}
                  <!-- {{ item1.key }} -->
                </a-tooltip>
              </a-select-option>
            </a-select>
          </div>
          <!-- 为空 || 不为空 不显示后面的 -->
          <div v-if="item.operator != logicOperate.IS_NULL.state && item.operator != logicOperate.IS_NOT_NULL.state">
            <!--日期时间-->
            <div class="" v-if="item.columnType == ColumnType.DateTime || item.columnType == ColumnType.Date">
              <div v-if="filterFlag(item)"> </div>
              <div v-if="filterFlag(item) == false" class="viewContent contentTime">
                <!-- 等于 大于 小于 大于等于 小于等于 不等于 选择日期 普通时间 || 指定日期 -->
                <a-date-picker :disabled="isDisabledFun(item)"
                  v-if="singleDataLogicOperateType.indexOf(item.operator) !== -1 || item.operator === logicOperate.APPOINT_DATE.state"
                  v-model="item.searchValue" style="width: 100%" placeholder="选择日期" />
                <!-- 之间 -->
                <tiny-date-picker v-if="item.operator == logicOperate.BETWEEN.state" v-model="item.searchValue"
                  type="daterange" :picker-options="pickerOptionsDateRange" start-placeholder="请选择"
                  :disabled="isDisabledFun(item)" end-placeholder="请选择" unlink-panels size="mini">
                </tiny-date-picker>
                <!-- 今天之后N天之前 -->
                <div v-if="item.operator === logicOperate.AFTER_TODAY_BEFORE_ONE_DAY.state">
                  <a-input-number v-model="item.searchValue" :min="0" :disabled="isDisabledFun(item)" />
                </div>
              </div>
            </div>
            <!--文本-->
            <div class="viewContent" v-if="item.columnType == ColumnType.Input">
              <div>
                <!-- 操作符为  IN NOT-IN 显示单项弹窗 -->
                <a-popover v-if="item.operator == logicOperate.IN.state || item.operator == logicOperate.NOT_IN.state"
                  v-model="item.searchVisible" placement="bottomLeft" trigger="click">
                  <template slot="content">
                    <div style="width: 300px;">
                      <a-textarea v-model="item.itemTextareaValue" placeholder="精确搜索，一行一项，最多支持1000行"
                        :auto-size="{ minRows: 5, maxRows: 12 }" @change="handleInputChange($event, item)" />
                      <div style="text-align: right;">总行数:{{ item.itemSearchlinesCount }}</div>
                      <div style="display: flex;justify-content: space-between;margin-top: 8px;">
                        <a-button @click="clearItemSearchValue(item)">清空</a-button>
                        <div style="">
                          <a-button @click="closeItemSearchModal(item)">关闭</a-button>
                          <a-button type="primary" @click="ItemSearchSearch(item)">确认</a-button>
                        </div>
                      </div>
                    </div>
                  </template>
                  <a-input :placeholder="'请输入' + item.columnTitle" v-model="item.searchValue"
                    :disabled="isDisabledFun(item)" @focus="openItemSearchModal(item)"
                    @keyup.enter.native="searchFun()" />
                </a-popover>
                <!-- 正常的 -->
                <a-input v-else :placeholder="'请输入' + item.columnTitle" v-model="item.searchValue"
                  :disabled="isDisabledFun(item)" @keyup.enter.native="searchFun()" />
              </div>
            </div>
            <!--自定义数据源-->
            <div class="viewContent" v-if="item.columnType == ColumnType.DataSource">
              <!--   interactiveType  TEXT_INPUT(1, "文本输入"),OPTION(2, "下拉选择"), -->
              <!-- <a-input v-if="item.interactiveType == null || item.interactiveType == 1" :placeholder="'请输入' + item.columnTitle" v-model="item.searchValue" /> -->
              <div v-if="item.interactiveType == null || item.interactiveType == 1">
                <!-- 操作符为  IN NOT-IN 显示单项弹窗 -->
                <a-popover v-if="item.operator == logicOperate.IN.state || item.operator == logicOperate.NOT_IN.state"
                  v-model="item.searchVisible" placement="bottomLeft" trigger="click">
                  <template slot="content">
                    <div style="width: 300px;">
                      <a-textarea v-model="item.itemTextareaValue" placeholder="精确搜索，一行一项，最多支持200行"
                        :auto-size="{ minRows: 5, maxRows: 12 }" @change="handleInputChange($event, item)" />
                      <div style="text-align: right;">总行数:{{ item.itemSearchlinesCount }}</div>
                      <div style="display: flex;justify-content: space-between;margin-top: 8px;">
                        <a-button @click="clearItemSearchValue(item)">清空</a-button>
                        <div style="">
                          <a-button @click="closeItemSearchModal(item)">关闭</a-button>
                          <a-button type="primary" @click="ItemSearchSearch(item)">搜索</a-button>
                        </div>
                      </div>
                    </div>
                  </template>
                  <a-input :placeholder="'请输入' + item.columnTitle" v-model="item.searchValue"
                    :disabled="isDisabledFun(item)" @focus="openItemSearchModal(item)"
                    @keyup.enter.native="searchFun()" />
                </a-popover>
                <!-- 正常的 -->
                <a-input v-else :placeholder="'请输入' + item.columnTitle" v-model="item.searchValue"
                  :disabled="isDisabledFun(item)" @keyup.enter.native="searchFun()" />
              </div>
              <!--  防止数据过多  使用懒加载组件    @change="saveSelect($event)" :disabled="supplierDisable" -->
              <div v-else-if="item.querySource && item.querySource.queryCode" style="width: 100%;">
                <!-- {{ item.searchValue }} -->
                <selectPage :placeholder="'请选择' + item.columnTitle" v-model="item.searchValue"
                  :disabled="isDisabledFun(item)" :selectList.sync="item.list" :selectOptionName="item.selectName"
                  :selectOptionValue="item.selectValue"
                  :mode="item.querySource ? item.querySource.allowMultiple : false" :searchKey="item.selectValue"
                  :request="item.request" :key="item.columnTitle" :queryCode="item.querySource.queryCode"
                  style="width:100%;">
                </selectPage>
              </div>
              <div v-else style="width: 100%;">
                <!-- isMultiple  1 多选 0 单选  :mode="item.isMultiple == 1 ? true : false" -->
                <selectLazy v-if="item.columnMap && item.columnMap.custom" :placeholder="'请选择' + item.columnTitle"
                  :disabled="isDisabledFun(item)" v-model="item.searchValue" :selectList="item.list"
                  :selectOptionName="item.columnMap.selectName" :selectOptionValue="item.columnMap.selectValue"
                  :mode="false" style="width:100%;">
                </selectLazy>
                <a-select v-else v-model="item.searchValue" style="width: 100%" :placeholder="'请选择' + item.columnTitle"
                  :style="{ width: item.width + 'px' || '150px' }" :dropdownMatchSelectWidth="false"
                  :disabled="isDisabledFun(item)" :filter-option="filterOption"
                  :mode="item.columnMap ? item.columnMap.allowMultiple : 'default'">
                  <a-select-option v-for="(item, index) in item.list" :key="index" :value="item.dictId">
                    {{ item.dictText }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
            <!--树型下拉框-->
            <div class="viewContent" v-if="item.columnType == ColumnType.TreeMode">
              <div v-if="item.querySource && item.querySource.queryCode" style="width: 100%;">
                <a-tree-select v-if="item.list && item.list.length" :key="item.keyCode" show-search
                  v-model="item.searchValue" :disabled="isDisabledFun(item)"
                  :replaceFields="{ children: 'children', title: item.selectName, key: item.selectValue, value: item.selectValue }"
                  style="width: 100%" placeholder="请选择" allowClear
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" :tree-data="item.list" />
              </div>
              <div v-else style="width: 100%;">
                <a-tree-select v-if="item.list && item.list.length" :key="item.keyCode" show-search
                  :disabled="isDisabledFun(item)" v-model="item.searchValue" tree-data-simple-mode
                  :replaceFields="item.columnMap.replaceFields" style="width: 100%" tree-node-filter-prop='title'
                  placeholder="请选择" allowClear :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  :tree-data="item.list" />
              </div>
            </div>
            <!--数字-->
            <div class="viewContent" v-if="item.columnType == ColumnType.NUMBER">
              <a-input-number id="inputNumber" v-model="item.searchValue" :disabled="isDisabledFun(item)"
                :placeholder="'请输入' + item.columnTitle" @change="numOnChange" style="width:90%;"
                @keyup.enter.native="searchFun()" />
            </div>
            <!--字典-->
            <div class="viewContent" v-if="item.columnType == ColumnType.Dict">
              <!-- :mode="item.isMultiple == 1 ? 'multiple' : 'default'" -->
              <a-select :placeholder="'请选择' + item.columnTitle" mode="multiple" :default-value="item.searchValue"
                :style="{ width: '100%' }" v-model="item.searchValue" :dropdownMatchSelectWidth="false"
                :disabled="isDisabledFun(item)" :filter-option="filterOption">
                <a-select-option v-for="(item, index) in item.list" :key="index" :value="item.dictId">
                  {{ item.dictText }}
                </a-select-option>
              </a-select>
            </div>
            <!--BOOLEAN-->
            <div class="viewContent" v-if="item.columnType == ColumnType.BOOLEAN">
              <a-select v-model="item.searchValue" style="width: 100%" :placeholder="'请选择' + item.columnTitle"
                :filter-option="filterOption" :disabled="isDisabledFun(item)">
                <a-select-option v-for="(item, index) in YesOrNo" :key="index" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </div>
            <!-- 金额 -->
            <div class="viewContent" v-if="item.columnType == ColumnType.JE">
              <!-- :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')" -->
              <a-input-number v-model="item.searchValue" style="width: 100%;text-align: right;"
                :disabled="isDisabledFun(item)" :placeholder="'请输入' + item.columnTitle"
                @keyup.enter.native="searchFun()" />
            </div>

            <div v-if="item.columnType == ColumnType.CustomType">
              <div v-if="item.columnTitle === '品牌'">
                <at-select :show-search="true" style="width:200px" v-model="item.searchValue" :request="initBrandData"
                  mode="multiple" placeholder="请选择" />
              </div>
              <div v-else-if="item.columnTitle === '品类'">
                <multiple-tree-select-modal v-model="item.searchValue" ref="mtreeSelect"></multiple-tree-select-modal>
              </div>
              <div class="viewContent" v-else-if="item.columnTitle === '起止时间'">
                <a-date-picker v-model="item.startTime" format="YYYY-MM-DD" placeholder="开始日期" class="pickerWidth"
                  :key='index' :allowClear='true' :disabled="isDisabledFun(item)"></a-date-picker>
                <span style="margin-left:10px;margin-right:10px;">-</span>
                <a-date-picker v-model="item.endTime" format="YYYY-MM-DD" placeholder="结束日期" class="pickerWidth"
                  :key='index + 1' :allowClear='true' :disabled="isDisabledFun(item)"></a-date-picker>
              </div>
            </div>
          </div>

          <div class="content-delete" v-if="item.show" @click="deleteFilter(item)"><a-icon type="close-circle"
              style="cursor:pointer;color:#d9d9d9" v-if="showDelButn" />
          </div>

        </div>

        <div v-if="searchListInfo.length != 0" style="display: flex;">
          <div class="antmask" v-if="popoverValue" @click="popoverValue = false">
          </div>
          <tiny-popover class="tinyPopover" id="tinyPopover" v-model="popoverValue" placement="right-start" title="新增条件"
            content="" width="220" trigger="manual">
            <template #reference>
              <!-- <tiny-button>点击我提示</tiny-button> -->
              <!-- <a-icon @click="popoverOpen" type="plus-square" style="font-size:26px;color:#d9d9d9;" /> -->
               <!-- <img src="@/assets/img/addNew.png" @click="popoverOpen" style="cursor:pointer;margin-top:5px;" /> -->
                <a-icon @click="popoverOpen" type="plus-circle" style="font-size:18px;color:#d9d9d9;margin-top:9px;" />
            </template>
            <div>
              <a-icon type="close-circle" class="close" @click="popoverValue = false" />

              <a-input-search v-model="searchValue" placeholder="请输入内容进行筛选" style="width: 180px" @input="onSearch" />
              <div class="ul">
                <div class="li" v-for="(item, index) in filteredItems" :key="index" @click="addItem(item)">
                  <span>{{ item.columnTitle }}</span>
                </div>
              </div>
            </div>

          </tiny-popover>
        </div>
      </div>
      <div class="main-right">
        <a-button type="primary" @click="searchFun()" style="margin-right:16px;">搜索</a-button>
        <a-button type="primary" @click="resetParam()">重置</a-button>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import multipleTreeSelectModal from '../components/Tree/MultipleTreeSelectModal.vue'
import {
  getDictByTypeId,
  addColumn,
  delColumn,
  getSearchList,
  getsearchInfo
} from '../sevrices/configurationView'
import {
  getBrandList // 品牌列表
} from '../components/Tree/utils/productClassify'
import selectLazy from '../components/selectLazy/selectLazy.vue'
import selectPage from '../components/selectPage/selectPage.vue'

import { YesOrNo, ColumnType, logicOperate, operateMap, pickerOptionsDateRange, dateExcludeOperate, singleDataLogicOperateType } from '../Constant/constant'
import DatePicker from '@opentiny/vue-date-picker'
import { getTableCode } from '../AntTableView/getTableCode'
// ToggleMenu as TinyToggleMenu,
import { Popover as TinyPopover } from '@opentiny/vue'

export default {
  components: {
    multipleTreeSelectModal,
    // AtStatistic,
    TinyDatePicker: DatePicker,
    // TinyToggleMenu,
    TinyPopover,
    // TinyTooltip,
    selectLazy,
    selectPage
  },
  name: 'AntViewSearch',
  props: {
    tableCode: {
      type: String
    },

    value: {
      type: [Array]
    },
    // 自定义请求
    columnMap: {
      type: Object,
      default: () => {
        return {}
      }
    },
    AllColumns: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableColumns: {
      type: Array,
      default: () => {
        return []
      }
    },
    showDelButn: {
      type: Boolean,
      default: true
    },
    defaultColumnsValue: {
      type: Object,
      default: () => {
        return {}
      }
    },
    viewSearchDisabled: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    AllColumns: {
      handler (AllColumns) {
        // console.log(AllColumns, 'watch:AllColumns')
        this.getList(AllColumns)
      },
      deep: true // 开启深度监听
    },
    // tableColumns: {
    //   handler () {
    //     console.log(this.tableColumns, this.AllColumns, 'watch:tableColumns')
    //     this.getList(this.AllColumns)
    //   },
    //   deep: true // 开启深度监听
    // },
    popoverValue: {
      handler () {
        // if (val === true) {
        //   const tinyInputPopover = document.querySelector('.tiny-toggle-menu__filter .tiny-input__inner')
        //   console.log(tinyInputPopover, 'tinyInputPopover')
        //   tinyInputPopover.value = ''
        // }
      }
    }
  },
  data () {
    return {
      singleDataLogicOperateType,
      dateExcludeOperate,
      operateMap,
      pickerOptionsDateRange,
      YesOrNo,
      // 所有筛选列
      filterColumns: [],
      ColumnType,
      logicOperate,
      show: false,
      searchList: [],
      searchListInfo: [],
      filteredItems: [],
      searchShow: true,
      list: [],
      array: [],
      deptList: [],
      typeTreeList: [],
      currentTableCode: '',
      popoverValue: false,
      searchValue: ''

    }
  },
  computed: {
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  mounted () {
    this.currentTableCode = getTableCode(this)
    // console.log(this.value)
    if (this.value) {
      this.searchList = this.value
      this.initData(this.searchList)
    } else this.getsearchInfo()

    // 添加事件监听
    // document.addEventListener('click', this.globalClickHandler)
  },
  beforeUnmount () {
    // document.removeEventListener('click', this.globalClickHandler)
  },
  methods: {
    isDisabledFun (column) {
      return this.viewSearchDisabled.includes(column.dataIndex)
    },
    /** 刷新筛选条件数据 */
    refreshData () {
      this.currentTableCode = getTableCode(this)
      // console.log(this.value)
      if (this.value) {
        this.searchList = this.value
        this.initData(this.searchList)
      } else this.getsearchInfo()
    },
    // 检测是否显示过滤条件 及 对比值 包含不显示  不包含 显示
    // 返回值 true 包含 false 不包含
    filterFlag (item) {
      if (!item.operator) return true // 为空  默认不显示后面的
      const operateIds = this.dateExcludeOperate.map((operate) => operate.value)
      const flag = operateIds.includes(item.operator) // 当前项是否是今天、明天等操作符
      // console.log(flag, flag == false, operateIds, item.operator)
      return flag
    },
    // 修改操作符 更新列类型
    /* eslint-disabled */
    changeOperate (value, item) {
      console.log(value, item, item.searchValue)
      // 如果是日期 || 时间 类型检测筛选框默认值
      if (item.columnType == ColumnType.DateTime || item.columnType == ColumnType.Date) {
        // 检测是否是"之间"操作符
        if (item.operator == logicOperate.BETWEEN.state && Array.isArray(item.searchValue) == false) {
          this.$set(item, 'searchValue', [])
          // 不是"之间"操作符
        } else if (item.operator != logicOperate.BETWEEN.state) {
          //  却是数组  转字符串  默认空
          if (Array.isArray(item.searchValue)) {
            this.$set(item, 'searchValue', '')
          }
        }
      }

      if (value == logicOperate.IS_NULL.state ||
        value == logicOperate.IS_NOT_NULL.state) {
        item.value = null
      }

      this.$forceUpdate()
      // })
      // console.log(this.searchList, item, 'item')
    },
    async initBrandData (params) {
      const result = await getBrandList(
        {
          orderColumns: [
            {
              columnName: '',
              isAsc: false
            }
          ],
          pageNum: params.pageNo,
          pageSize: params.pageSize,
          param: {
            brandCname: params.searchValue,
            brandType: 0
          }
        }
      ).catch((error) => {
        throw new Error(error)
      })
      const { list = [], pageNum, pageSize, pages, total } = result.data.data
      const selectOptions = list.map((item) => {
        return {
          value: item.id,
          label: item.brandCname,
          aName: item.brandNumber,
          brandId: item.id
        }
      })
      return {
        data: selectOptions,
        pageNo: pageNum,
        pageSize: pageSize,
        totalCount: total,
        totalPage: pages
      }
    },
    // 重置
    resetParam () {
      console.log(this.array, this.searchList, this.viewSearchDisabled, 'resetParam')
      this.array = []
      const keys = Object.keys(this.defaultColumnsValue)

      this.searchList.forEach(item => {
        const index = keys.findIndex((key) => key == item.dataIndex)
        const key = keys[index]
        // console.log(index, key, this.viewSearchDisabled, this.viewSearchDisabled.includes(key), 'index')
        // console.log(index == -1 || this.viewSearchDisabled.includes(key) == false, 'index2')
        if (index == -1 || this.viewSearchDisabled.includes(key) == false) {
          item.searchValue = undefined // 值清空
          item.itemTextareaValue = undefined // 单项弹窗清空
          // item.operator = undefined // 操作符清空
          item.startTime = ''
          item.endTime = ''
          if (item.columnType === ColumnType.Dict) { // 多选删除searchValue
            delete item.searchValue
          }
        }
      })
      this.$forceUpdate()
      console.log(this.searchList, '组件值')
      // if (this.$refs.mtreeSelect !== undefined) {
      //   this.$refs.mtreeSelect[0].resetValue()
      // }
      // const params = {
      //   filters: []
      // }
      // this.$emit('searchMethods', params)
      this.searchFun('重置')
    },
    // 点击搜索
    searchFun (searchType = '搜索') {
      this.array = []
      // console.log(this.searchList, 'this.searchList')
      // eslint-disable-next-line complexity
      this.searchList.forEach(item => {
        const columnType = item.columnType
        const defaultParam = {
          paramType: item.paramType, // "过滤条件类型:1.基础;2.扩展"
          columnTitle: item.dataIndex,
          operator: item.operator,
          relationType: 0
        }
        // 时间
        if (columnType === ColumnType.DateTime || columnType === ColumnType.Date) {
          // 没有日期
          if (this.filterFlag(item) || !item.searchValue) {
            if (!item.operator) return
            this.array.push({
              ...defaultParam,
              value: { first: null, last: null } // 后端说传两个 都是null
            })
          } else if (item.operator == logicOperate.BETWEEN.state) {
            if (!item.searchValue) return
            // 之间
            const startTime = item.searchValue[0]
            const endTime = item.searchValue[1]
            const first = startTime ? moment(startTime).format('YYYY-MM-DD 00:00:00') : null
            const last = endTime ? moment(endTime).format('YYYY-MM-DD 23:59:59') : null
            // 时间筛选接口参数变更
            if (first && last) {
              this.array.push({
                ...defaultParam,
                value: {
                  first: first,
                  last: last
                }
              })
            }
          } else if (item.operator == logicOperate.AFTER_TODAY_BEFORE_ONE_DAY.state) {
            if (!item.searchValue) return
            // 今天之后N天之前
            // const currentTime = moment().format('YYYY-MM-DD 00:00:00')
            // const last = moment().add(item.searchValue, 'days').format('YYYY-MM-DD 23:59:59')
            this.array.push({
              ...defaultParam,
              // value: {
              //   first: currentTime,
              //   last: last
              // }
              value: item.searchValue
            })
          } else {
            if (!item.searchValue) return
            // const searchValue = moment(item.searchValue).format('YYYY-MM-DD')
            const first = moment(item.searchValue).format('YYYY-MM-DD 00:00:00')
            const last = moment(item.searchValue).format('YYYY-MM-DD 23:59:59')
            // 正常单个日期
            this.array.push({
              ...defaultParam,
              value: { first: first, last: last }
              // value: searchValue
            })
          }
        } else if (columnType === ColumnType.CustomType && item.startTime && item.endTime) {
          const first = item.startTime ? moment(item.startTime).format('YYYY-MM-DD 00:00:00') : null
          const last = item.endTime ? moment(item.endTime).format('YYYY-MM-DD 23:59:59') : null
          this.array.push({
            paramType: item.paramType, // "过滤条件类型:1.基础;2.扩展"
            columnTitle: 'startTime',
            operator: item.operator,
            relationType: 0,
            value: first
          })
          this.array.push({
            paramType: item.paramType, // "过滤条件类型:1.基础;2.扩展"
            columnTitle: 'endTime',
            operator: item.operator,
            relationType: 0,
            value: last
          })
        } else if (columnType === ColumnType.BOOLEAN) {
          if (item.searchValue === 0 || item.searchValue === 1 || item.searchValue === '0' || item.searchValue === '1') {
            this.array.push({
              ...defaultParam,
              value: Number(item.searchValue)
            })
          }
        } else if (typeof item.searchValue != 'undefined') {
          // console.log(columnType, item.operator)
          let value
          // console.log(value, item.searchValue, ColumnType.NUMBER)
          if (columnType === ColumnType.NUMBER) {
            value = item.searchValue
          } else if (columnType === ColumnType.Dict || columnType === ColumnType.CustomType) {
            value = String(item.searchValue)
          } else if (columnType === ColumnType.JE) {
            // else if (item.searchValue === '0.00') {
            //   value = ''
            // }
            // 为空||不为空  null
            if (item.operator === logicOperate.IS_NULL.state || item.operator === logicOperate.IS_NOT_NULL.state) {
              value = null
            } else {
              // console.log(123)
              if ((typeof item.searchValue === 'undefined') || item.searchValue === null) {
                value = ''
              } else {
                value = item.searchValue
              }
            }
          } else if (item.itemTextareaValue) {
            // 检测单项文本弹窗是否有值  有的话取单项弹窗的值
            value = item.itemTextareaValue
          } else {
            // 数组转字符串
            value = String(item.searchValue).trim()
          }
          this.array.push({
            ...defaultParam,
            value: value
          })
        } else if (item.operator === logicOperate.IS_NULL.state || item.operator === logicOperate.IS_NOT_NULL.state) {
          this.array.push({
            ...defaultParam,
            value: null
          })
        }
      })
      // console.log(this.array, this.searchList, 'this.array')
      let params
      if (this.array.length) {
        const search = {}
        const filters = []
        this.array.forEach(item => {
          this.columnSearch(item, search, filters)
        })
        params = {
          filters,
          ...search
        }
      } else {
        params = {}
      }
      console.log(params)
      this.$emit('searchMethods', params, searchType)
    },
    // 搜索数据过滤  paramType // "过滤条件类型:1.基础 (在filter里面);2.扩展(在search里面)"
    // 由于 paramType 是新增的  某些项目页面没有传 paramType 就默认是基础过滤
    columnSearch (obj, search, filters) {
      // console.log(obj, 'obj')
      if (obj.paramType == 1 || typeof obj.paramType === 'undefined') {
        filters.push({
          ...obj,
          fieldName: obj.columnTitle
        })
        const index = filters.length - 1
        // console.log(index, 'index')
        delete filters[index].columnTitle
        delete filters[index].paramType
        if (filters[index].value === '' || filters[index].value === undefined) {
          // console.log(filters[index].value, 'filters[index].value')
          // 日期 || 日期时间不用清空  因为有传null的
          if (obj.operator !== logicOperate.IS_NULL.state &&
            obj.operator !== logicOperate.IS_NOT_NULL.state &&
            obj.columnType != ColumnType.DateTime && obj.columnType != ColumnType.Date) {
            filters.splice(index, 1)
            // console.log(filters, index, '清空')
          }
        }
      } else if (obj.paramType == 2) {
        search[obj.columnTitle] = {
          ...obj
        }
        delete search[obj.columnTitle].columnTitle
        delete search[obj.columnTitle].paramType
        if (search[obj.columnTitle].value === '' || search[obj.columnTitle].value === undefined) {
          // 日期 || 日期时间不用清空  因为有传null的
          if (obj.operator !== logicOperate.IS_NULL.state &&
            obj.operator !== logicOperate.IS_NOT_NULL.state &&
            obj.columnType != ColumnType.DateTime && obj.columnType != ColumnType.Date) {
            delete search[obj.columnTitle]
          }
        }
      }
    },
    // 删除条件
    async deleteFilter (item) {
      if (this.searchList.length < 2) {
        this.$antmessage.error('无法删除全部筛选条件')
        return
      }
      this.searchShow = false
      // 删除多条筛选列
      let deletArray = []
      deletArray.push(item.code)

      const filterColumns = this.filterColumns
      // 角标大于10的都要删除
      if (filterColumns.length > 10) {
        const will2del = filterColumns.slice(10, filterColumns.length)
        const transArray = will2del.map(item => {
          return item.code
        })
        deletArray = transArray.concat(deletArray)
      }

      const result = await delColumn(deletArray).catch((error) => { throw new Error(error) })
      if (result.data.code && result.data.code == 200) {
        this.getSearchList()
        const delIndex = this.searchList.findIndex(el => { return el.code === item.code })
        this.searchList.splice(delIndex, 1)
        this.searchShow = true
        this.$antmessage.success(result.data.msg)
      } else {
        await this.getsearchInfo()
        this.searchShow = true
        this.$antmessage.error(result.data.msg)
      }
    },
    setDataSourceAndTreeModeList (item) {
      // console.log(item, this.columnMap, this.currentTableCode, this.columnMap[this.currentTableCode])
      if (!this.columnMap || !this.columnMap[this.currentTableCode]) return
      // 自定义数据源对象
      let dataobj = this.columnMap[this.currentTableCode][item.code]
      if (!dataobj) {
        dataobj = this.columnMap[this.currentTableCode][item.dataIndex]
      }
      item.columnMap = dataobj
      // eslint-disable-next-line promise/catch-or-return
      // console.log(item, dataobj)
      if (dataobj && dataobj.custom) {
        const current = dataobj
        let list = []
        const index = this.AllColumns.findIndex(element => { return item.dataIndex === element.dataIndex })
        if (index !== -1) {
          list = this.AllColumns[index].list
        }
        // 自定义过滤数据  customList true
        if (current.customList) {
          // 自定义数据 数据需要做转换
          item.columnMap.transfrom(item, list)
        } else {
          // item.list = resultData.data.data
          item.list = list
          item.keyCode = item.code
          // console.log('getrequest data', item)
        }
        return item
      } else {
        if (item.interactiveType == null || item.interactiveType == 1) return item
        item.list = dataobj.list
        return item
      }
    },
    // 初始化获取list
    getList (AllColumns) {
      // console.log(this.searchList, AllColumns)
      this.searchList.forEach((element, eleIndex) => {
        const index = AllColumns.findIndex(el => { return el.dataIndex === element.dataIndex })
        // console.log(index)
        if (index !== -1) {
          this.updateOperators(this.searchList[eleIndex])
          // console.log(this.searchList[eleIndex], AllColumns[index])
          this.filterItem(this.searchList[eleIndex], AllColumns[index])
        } else {
          this.searchList[eleIndex].list = []
        }
      })
      this.$forceUpdate()
    },
    // 新增条件
    async addItem (item) {
      // console.log(item)
      this.searchShow = false
      this.popoverValue = false
      if (this.searchList.length >= 10) {
        this.$antmessage.info('过滤条件不能超过10个')
        return
      }
      const params = {
        columnList: [item.code],
        tableCode: this.currentTableCode
      }
      // console.log(params)
      // console.log(this.AllColumns, item, 'this.AllColumns')
      const result = await addColumn(params).catch((error) => { throw new Error(error) })
      if (result.data.code && result.data.code == 200) {
        if (item.columnType === ColumnType.DataSource || item.columnType === ColumnType.TreeMode) {
          const index = this.AllColumns.findIndex(el => { return item.dataIndex === el.dataIndex })
          // if (index !== -1 && this.AllColumns[index].querySource && this.AllColumns[index].querySource.queryCode) {
          if (index !== -1) {
            // console.log(index, this.AllColumns[index])
            this.filterItem(item, this.AllColumns[index])
          } else {
            // 将自定义属性赋值当前属性
            await this.setDataSourceAndTreeModeList(item)
          }
          item.width = '100%'
        } else if (item.columnType === ColumnType.Dict) {
          item.width = '100%'
          // eslint-disable-next-line promise/catch-or-return
          this.getDict(item.dictTypeId).then((res) => {
            item.list = res.data.data.dictList
            // console.log(item.list)
            return item.list
          })
        }
        const columnsIndex = this.AllColumns.findIndex(el => { return item.dataIndex === el.dataIndex })
        if (columnsIndex > -1) {
          // 0 配置视图信息   1 页面过滤
          item.operators = this.AllColumns[columnsIndex].operators.filter((item) => item.showPosition.includes('1'))
          // 读取默认值  没有的话默认显示第一个操作符
          const index = item.operators.findIndex((operator) => operator.isDefaultShow)
          if (index > -1) {
            item.operator = item.operators[index].operatorId
          } else {
            item.operator = item.operators[0].operatorId
          }
        }
        // console.log(item)
        this.searchList.push(item)
        this.searchShow = true
        this.getSearchList()
      } else {
        this.searchShow = true
        this.$antmessage.error(result.data.msg)
      }
    },
    filterItem (item, column) {
      // item.columnType = 8
      item.columnMap = column.columnMap
      if (column.request) {
        item.request = column.request
      }
      if (column.columnMap && column.columnMap.custom === false) {
        item.list = column.columnMap.list
      } else {
        item.list = column.list
      }
      item.interactiveType = column.interactiveType
      item.querySource = column.querySource
      item.selectName = column.selectName
      item.selectValue = column.selectValue
    },
    // 查所有查询的条件
    async getSearchList () {
      const { data } = await getSearchList(this.currentTableCode).catch((error) => { throw new Error(error) })
      if (data.code == 200) {
        this.searchListInfo = data.data.filter(itemA => {
          return this.searchList.every(itemB => {
            return itemB.code !== itemA.code
          })
        })
        // console.log(this.searchListInfo)
        this.filteredItems = JSON.parse(JSON.stringify(this.searchListInfo))
        // console.log(this.filteredItems)
      } else {
        this.$antmessage.error(data.msg)
      }
    },
    // 更新操作符列表
    updateOperators (item) {
      const columnsIndex = this.AllColumns.findIndex(el => { return item.dataIndex === el.dataIndex })
      // console.log(this.AllColumns, columnsIndex, 'columnsIndex')
      if (columnsIndex > -1 && !item.operators) {
        // console.log(this.AllColumns[columnsIndex], 'AllColumns')
        item.operators = this.AllColumns[columnsIndex].operators.filter((item) => item.showPosition.includes('1'))
        // console.log(item.operators, 'item.operators')
        // 读取默认值  没有的话默认显示第一个操作符
        const index = item.operators.findIndex((operator) => operator.isDefaultShow)
        if (index > -1 && !item.operator) {
          item.operator = item.operators[index].operatorId
        } else {
          item.operator = item.operators[0].operatorId
        }
      }
    },
    async getsearchInfo () { // 已选择
      const result = await getsearchInfo(this.currentTableCode).catch((error) => { throw new Error(error) })
      if (result.data.code && result.data.code == 200) {
        result.data.data.forEach(async (item) => {
          item.searchVisible = false // 单项弹窗
          this.updateOperators(item)
          // 双向绑定
          // 获取字典数据
          if (item.columnType === ColumnType.Dict) {
            // eslint-disable-next-line promise/catch-or-return
            this.getDict(item.dictTypeId).then((res) => {
              if (res.data.code == 200) {
                item.list = res.data.data.dictList
                return item.list
              } else {
                item.list = []
                return item.list
              }
            })
          } else if (item.columnType === ColumnType.DataSource || item.columnType === ColumnType.TreeMode) {
            // console.log(item, 'item')
            const index = this.AllColumns.findIndex(el => { return item.dataIndex === el.dataIndex })
            if (index !== -1 && this.AllColumns[index].querySource && this.AllColumns[index].querySource.queryCode) {
              this.filterItem(item, this.AllColumns[index])
            } else {
              // 将自定义属性赋值当前属性
              await this.setDataSourceAndTreeModeList(item)
            }
          } else if (item.columnType === ColumnType.Input) {
            this.$set(item, 'searchValue', '')
          } else if (item.columnType === ColumnType.DateTime || item.columnType === ColumnType.Date) {
            // this.$set(item, 'searchValue', [])
            // 检测是否是之间操作符
            if (item.operator == logicOperate.BETWEEN.state) {
              this.$set(item, 'searchValue', [])
            } else {
              this.$set(item, 'searchValue', '')
            }
          }
          this.setDefaultFun(item)
        })

        const filterColumns = result.data.data
        this.filterColumns = filterColumns
        this.searchList = filterColumns.filter((el, i) => {
          return i < 10
        })
        // console.log(this.searchList, 'item.list')
        this.getSearchList()
      } else {
        this.$antmessage.error(result.data.msg)
      }
    },
    setColumnsList (column, list) {
      // console.log(column, list)
      column.list = list
    },
    mouseOver (item) {
      item.show = true
      this.$forceUpdate()
    },
    mouseLeave (item) {
      item.show = false
      this.$forceUpdate()
    },
    numOnChange (value) {
      console.log(value)
    },
    async getDict (typeID) {
      const params = {
        dictIds: [],
        dictKeys: [],
        dictTexts: [],
        typeId: typeID
      }
      return await getDictByTypeId(params).catch((error) => {
        throw new Error(error)
      })
    },

    initData (list) {
      // console.log(list, 'initData')
      list.forEach(async (item) => {
        // 双向绑定
        if (item.columnType === ColumnType.Dict) {
          // eslint-disable-next-line promise/catch-or-return
          this.getDict(item.dictTypeId).then((res) => {
            item.list = res.data.data.dictList
            return item.list
          })
        } else if (item.columnType === ColumnType.DataSource) {
          // console.log(item, 'item')
          const index = this.AllColumns.findIndex(el => { return item.dataIndex === el.dataIndex })
          if (index !== -1 && this.AllColumns[index].querySource.queryCode) {
            this.filterItem(item, this.AllColumns[index])
          } else {
            // 将自定义属性赋值当前属性
            await this.setDataSourceAndTreeModeList(item)
          }
        } else if (item.columnType === ColumnType.TreeMode) {
          // console.log(item)
          if (item.getList) item.getList(item)
          else {
            // TODO
          }
        } else if (item.columnType === ColumnType.Input) {
          this.$set(item, 'searchValue', '')
        } else if (item.columnType === ColumnType.DateTime || item.columnType === ColumnType.Date) {
          // 检测是否是之间操作符
          if (item.operator == logicOperate.BETWEEN.state) {
            this.$set(item, 'searchValue', [])
          } else {
            this.$set(item, 'searchValue', '')
          }
        }
        this.setDefaultFun(item)
      })
    },
    setDefaultFun (item) {
      const keys = Object.keys(this.defaultColumnsValue)
      const index = keys.findIndex((key) => key == item.dataIndex)
      // console.log(index, 'index')
      if (index != -1) {
        const keyName = keys[index]
        this.$set(item, 'searchValue', this.defaultColumnsValue[keyName])
      }
    },
    popoverOpen () {
      this.popoverValue = true
      this.searchValue = ''
      this.filteredItems = this.searchListInfo
    },
    onSearch () {
      // console.log(event)
      const value = this.searchValue
      const filter = value.toLowerCase() // 获取输入框的当前值并转换为小写
      const filteredItems = this.searchListInfo.filter(function (item) {
        return item.columnTitle.toLowerCase().includes(filter) // 返回包含输入内容的项目
      })
      this.filteredItems = filteredItems
    },
    // 监听单项文本行数
    handleInputChange (e, item) {
      const value = e.target.value
      const linesCount = value.split('\n').length
      item.itemSearchlinesCount = linesCount
    },
    // 监听单项文本聚焦
    openItemSearchModal (item) {
      console.log(item)
    },
    // 单项弹窗清空
    clearItemSearchValue (item) {
      item.itemTextareaValue = ''
      item.searchValue = ''
    },
    // 单项弹窗关闭
    closeItemSearchModal (item) {
      item.searchVisible = false
    },
    // 单项弹窗搜索
    ItemSearchSearch (item) {
      if (item.itemSearchlinesCount > 1000) {
        return this.$antmessage.warning('搜索内容不能超过1000行')
      }
      if (item.itemTextareaValue) {
        item.searchValue = `${item.itemTextareaValue.split('\n')[0]}等${item.itemSearchlinesCount}项`
      } else {
        item.searchValue = item.itemTextareaValue
      }
      item.searchVisible = false
    },
    globalClickHandler (event) {
      // console.log(event, 'event')
      const target = event.target
      const tinyPopover = document.getElementById('tinyPopover')
      // console.log(this.isNodeInside(tinyPopover, target), 'isNodeInside')
      if (this.isNodeInside(tinyPopover, target) === false) {
        this.popoverValue = false
      }
    },
    // 检测nodeB是否在nodeA内部
    isNodeInside (nodeA, nodeB) {
      // console.log(nodeA, nodeB, 'nodeB')
      if (nodeA && nodeA.contains) {
        return nodeA.contains(nodeB)
      }
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
    }

  }

}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  margin-bottom: 20px;
  display: flex;
}

.mainoms {
  width: 100%;
  margin-bottom: 10px;
  display: flex;

  .main-left {
    width: 90%;
    display: flex;
    flex-wrap: wrap;
  }

  .main-right {
    width: 10%;
    display: flex;
    justify-content: flex-end;
  }

  .main-item {
    display: flex;
    align-items: center;
    margin-right: 12px;
    margin-bottom: 8px;
    flex-wrap: nowrap;
    position: relative;
    border: 1px solid #d9d9d9;
    padding: 0 0 0 6px;
    border-radius: 4px 4px 4px 4px;

    .title {
      flex: none;
      margin-right: 8px;
    }

    .viewContent {
      min-width: 150px;
      // max-width: 150px;
      display: flex;
      margin-left: 5px;
    }

    .contentTime {
      :deep(.tiny-input__inner ){
        border: none;
      }
    }
  }

  .pickerWidth {
    width: 134px;
  }

  :deep(.ant-calendar-picker-input.ant-input ){
    width: 126px !important;
  }

  .content-delete {
    position: absolute;
    top: 0;
    right: 0;
  }

  :deep(.content-delete ){
    top: -11px;
    right: -8px;
  }

  :deep(.ant-input),
  :deep(.ant-input-number-input),
  :deep(.ant-input-number ){
    width: 150px;
    width: fit-content;
    border: none;

    &:focus {
      outline: none;
      // box-shadow:none
    }
  }

  :deep(.ant-select ){
    width: 100% !important;
  }

  :deep(.ant-select-selection ){
    border: none;
  }

  :deep(.tiny-date-editor--daterange.tiny-input),
  .tiny-date-editor--daterange.tiny-input__inner {
    width: 250px;
  }

  .addcls {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
}

:deep(.tiny-toggle-menu__toggle ){
  display: none;
}

:deep(.tree-node-icon ){
  display: none;
}

:deep(#tinyPopover .tiny-tree-node__content-box ){
  background-color: #fff;
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
// .ant-select-selection--single{
//   background: #F3F4F5;
// }

</style>
<style>
.ant-select-focused .ant-select-selection{
  box-shadow:0 0 2px grey
}
.ant-select-dropdown-menu-item-active:not(.ant-select-dropdown-menu-item-disabled){
  background:#F3F4F5
}
.ant-select-dropdown-menu-item .ant-select-dropdown-menu-item-active{
  background: rgba(0,0,0,0.04);
}
.ant-select-focused .ant-select-selection, .ant-select-selection:focus, .ant-select-selection:active{
  background: #F3F4F5;
  box-shadow: 2px 2px 6px 0px rgba(87,93,108,0.1);
  border-radius:0px;
  height:32px;

}
.ant-select-dropdown-menu-item .ant-select-dropdown-menu-item-active{
  background: rgba(0,0,0,0.04);

}
.ant-select-dropdown-menu-item-selected{
    background: rgba(0,0,0,0.04);

}
.ant-select-dropdown-menu-item:hover:not(.ant-select-dropdown-menu-item-disabled){
background: rgba(0,0,0,0.04);
}
.Fclass{
  width: 80px;
    height: 24px;
    display: flex;
    align-items: center;
    background: #F3F4F5;
    border-radius: 4px;
}
</style>
