<template>
  <div style="margin-top: 24px;">
    <UniversalContainer ref="tContainer" title="表格列">
      <div slot="btns">
        <a-button type="primary" @click="exportExcel">导出</a-button>
        <a-button type="primary" @click="rowMerge">行合并</a-button>
      </div>
      <div slot="views">
        <ant-table-view :tableCode="tableCode" v-model="tableColumns" @updateviewConfig="updateviewConfig" @refresh="refreshTable"
          :allColumnQuote.sync="allColumnQuote" :isShowSetting="false">
        </ant-table-view>
        <span @click='changeSearch()' :class="searchShow ? 'blue' : ''" class="filter"><a-icon type="filter" />过滤</span>
        <span class="pagecount">(共 <strong>{{ total }}</strong>条数据)</span>
      </div>
      <div v-show='searchShow' class="pageSearch">
        <ant-view-search ref="customSearch" @searchMethods="searchMethods" :tableCode='tableCode' :tableColumns="tableColumns"></ant-view-search>
      </div>
    </UniversalContainer>
    <a-card :bordered="false" :style="{ 'min-height': cardheight + 'px', }">
      <tiny-grid ref="table" :fetch-data="fetchData" :height="cardheight - 120" :drop-config="dropConfig" column-key :key="tableKey"
        show-header-overflow="tooltip" @resizable-change="dragTableTh" :optimization="{  animat: true, delayHover: 250, }" @sort-change="sortChange" remote-sort
        :loading="tableLoading" :edit-config="{ trigger: 'dblclick', mode: 'row', showStatus: true ,activeMethod, markInsert: true}" @edit-closed="editClosed"
        :edit-rules="validRules">
        <tiny-grid-column type="selection" width="32" fixed="left"></tiny-grid-column>
        <tiny-grid-column width="60" title="序号" align="center">
          <template #default="data">
            <span>
              {{ (pageNum - 1) * pageSize + (data.rowIndex + 1) }}
            </span>
          </template>
        </tiny-grid-column>
        <tiny-grid-column v-for='(item) in tableColumns' :key='item.code' :field="item.dataIndex" :title="item.columnTitle" :sortable="true" :width="item.width"
          :align="item.align" show-overflow :editor="editorFilter" :show-icon="false">
          <!-- 自定义表头 -->
          <template #header>
            <ant-row-search :tableColumnObj="item" @columnSearch="columnSearch" :ref="item.dataIndex" :tableCode="tableCode" />
          </template>
          <template #default="data">
            <div v-if="item.dataIndex === 'columnType'">
              {{ getText(COLUMN_TYPE_LIST,data.row.columnType,'dictId','dictText') }}
            </div>
            <div v-else-if="item.dataIndex === 'isRequired'">
              {{ getText(isRequiredList,data.row.isRequired,'value','label') }}
            </div>
            <div v-else-if="item.dataIndex === 'applicationFlag'">
              {{ getText(APPLICATION_FLAG_LIST,data.row.applicationFlag,'dictId','dictText') }}
            </div>
            <div v-else-if="item.dataIndex === 'defaultIsShow'">
              {{ getText(defaultIsShowList,data.row.defaultIsShow,'value','label') }}
            </div>
            <div v-else-if="item.dataIndex === 'search'">
              {{ getText(searchArr,data.row.search,'value','label') }}
            </div>
            <div v-else-if="item.dataIndex === 'ellipsis'">
              {{ getText(ellipsisList,data.row.ellipsis,'value','label') }}
            </div>
            <div v-else-if="item.dataIndex === 'isGaugeOutfit'">
              {{ getText(isGaugeOutfitList,data.row.isGaugeOutfit,'value','label') }}
            </div>
            <div v-else-if="item.dataIndex === 'align'">
              {{ getText(alignList,data.row.align,'value','label') }}
            </div>
            <div v-else-if="item.dataIndex === 'paramType'">
              {{ getText(paramTypeList,data.row.paramType,'value','label') }}
            </div>
            <div v-else>
              {{ data.row[item.dataIndex] }}
            </div>
          </template>
          <template v-if="item.dataIndex === 'columnType'" #edit="data">
            <tiny-select placeholder="请选择" v-model="data.row.columnType">
              <tiny-option v-for="item in COLUMN_TYPE_LIST" :key="item.dictId" :label="item.dictText" :value="item.dictId">
              </tiny-option>
            </tiny-select>
          </template>
          <template v-else-if="item.dataIndex === 'isRequired'" #edit="data">
            <tiny-select placeholder="请选择" v-model="data.row.isRequired">
              <tiny-option v-for="(item) in isRequiredList" :key="item.value" :value="item.value" :label="item.label"> </tiny-option>
            </tiny-select>
          </template>
          <template v-else-if="item.dataIndex === 'applicationFlag'" #edit="data">
            <tiny-select placeholder="请选择" v-model="data.row.applicationFlag">
              <tiny-option v-for="(item) in APPLICATION_FLAG_LIST" :key="item.dictId" :value="item.dictId" :label="item.dictText"> </tiny-option>
            </tiny-select>
          </template>
          <template v-else-if="item.dataIndex === 'defaultIsShow'" #edit="data">
            <tiny-select placeholder="请选择" v-model="data.row.defaultIsShow">
              <tiny-option v-for="(item) in defaultIsShowList" :key="item.value" :value="item.value" :label="item.label"> </tiny-option>
            </tiny-select>
          </template>
          <template v-else-if="item.dataIndex === 'search'" #edit="data">
            <tiny-select placeholder="请选择" v-model="data.row.search">
              <tiny-option v-for="(item) in searchArr" :key="item.value" :value="item.value" :label="item.label"> </tiny-option>
            </tiny-select>
          </template>
          <template v-else-if="item.dataIndex === 'ellipsis'" #edit="data">
            <tiny-select placeholder="请选择" v-model="data.row.ellipsis">
              <tiny-option v-for="(item) in ellipsisList" :key="item.value" :value="item.value" :label="item.label"> </tiny-option>
            </tiny-select>
          </template>
          <template v-else-if="item.dataIndex === 'isGaugeOutfit'" #edit="data">
            <tiny-select placeholder="请选择" v-model="data.row.isGaugeOutfit">
              <tiny-option v-for="(item) in isGaugeOutfitList" :key="item.value" :value="item.value" :label="item.label"></tiny-option>
            </tiny-select>
          </template>
          <template v-else-if="item.dataIndex === 'align'" #edit="data">
            <tiny-select placeholder="请选择" v-model="data.row.align">
              <tiny-option v-for="(item) in alignList" :key="item.value" :value="item.value" :label="item.label"></tiny-option>
            </tiny-select>
          </template>
          <!-- 参数类型 -->
          <template v-else-if="item.dataIndex === 'paramType'" #edit="data">
            <tiny-select placeholder="请选择" v-model="data.row.paramType">
              <tiny-option v-for="(item) in paramTypeList" :key="item.value" :value="item.value" :label="item.label"></tiny-option>
            </tiny-select>
          </template>
          <template v-else-if="item.dataIndex === 'tableCode'" #edit="data">
            {{ data.row[item.dataIndex] }}
          </template>
        </tiny-grid-column>
        <template #empty>
          <div class="empty-center-block block" style="height: 500px;">
            <p class="tiny-grid__empty-img"></p>
            <span class="tiny-grid__empty-text">暂无数据</span>
          </div>
        </template>
      </tiny-grid>
      <tiny-pager mode="number" :currentPage="pageNum" :pageSize="pageSize" :pageSizes="pageSizes" :total="total" :align="align" @current-change="currentChange"
        @size-change="sizeChange"></tiny-pager>
      <a-modal title="行合并" :visible="mergeVisible" @ok="mergeOk" @cancel="mergeCancel" width=550px :footer="null">
        <a-form ref="mergeForm">
          <a-form-item label="合并基准列" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-select allowClear style="width:300px;" v-model:value="formModel.mergeKeyColumn" show-search
              optionFilterProp="children">
              <a-select-option v-for="(item,index) in columnList" :key='index' :value='item.code'>
                {{item.columnTitle}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="需要合并的列编码" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-select allowClear style="width:300px;" v-model:value="formModel.mergeColumns" show-search
              optionFilterProp="children" mode="multiple">
              <a-select-option v-for="(item,index) in columnList" :key='index' :value='item.code'>
                {{item.columnTitle}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<script>
import { oftenMessage } from '@/utils/contextApi'
import myMixin from '@/layouts/mix/mymixin'
import { APPLICATION_FLAG_LIST, COLUMN_TYPE_LIST } from './utils/tableContent'
import { disableColumn, enableColumn, exportTableColumn, getColumnPage, getRowMerge, updateColumn } from '@/services/view/viewColumn'
import { debounce } from 'lodash'
import { exportExcel } from '@/utils/util'
import moment from 'moment'
import Sortable from 'sortablejs'
import { Grid, GridColumn, Pager, Select, Option } from '@opentiny/vue'
import { upDateVwView } from '@/services/common'
// import { numberToCurrencyNo } from '@/utils/util'

let that
let theGridRef
export default {
  name: 'tableColumnList',
  mixins: [myMixin],
  components: {
    TinyGrid: Grid,
    TinyGridColumn: GridColumn,
    TinyPager: Pager,
    TinySelect: Select,
    TinyOption: Option
  },
  data () {
    return {
      mergeVisible: false,
      COLUMN_TYPE_LIST,
      APPLICATION_FLAG_LIST,
      mergeForm: null,
      searchList: [],
      conditionVisible: false,
      dropConfig: {
        plugin: Sortable,
        column: true,
        row: false // 取消行拖拽
      },
      isDraging: false,
      tableLoading: false,
      allColumnQuote: [],
      viewConfig: {},
      total: 0,
      pageNum: 1,
      pageSize: 100,
      pageSizes: [50, 100, 150, 200],
      tableList: [],
      tableKey: -1,
      align: 'right', // 可选值：['left', 'center', 'right']
      fetchData: {
        api: this.initTableData
      },
      tableCode: '7f88d743-b411-4590-b6ca-42b68afa82bc',
      tableColumns: [],
      clearId: -1,
      searchObj: {},
      loading: false, // button按钮loading状态
      // 表头 // button按钮loading状态
      searchShow: false,
      columnList: [],
      paramTypeList: [
        {
          label: '基础',
          value: 1
        },
        {
          label: '扩展',
          value: 2
        }
      ],
      validRules: {
        // tableCode: [
        //   { required: true, message: '表格编码必填' }
        // ],
        sortNo: [
          { required: true, message: '排序号必填' }
        ],
        columnTitle: [
          { required: true, message: '列标题必填' }
        ],
        dataIndex: [
          { required: true, message: '数据接口字段名必填' }
        ],
        groupName: [
          { required: true, message: '分组名称必填' }
        ],
        groupSortNo: [
          { required: true, message: '分组排序号必填' }
        ],
        columnType: [
          { required: true, message: '查询列类型必填' }
        ],
        applicationFlag: [
          { required: true, message: '用途标记必填' }
        ]
      },
      isRequiredList: [
        {
          label: '否',
          value: 0
        },
        {
          label: '是',
          value: 1
        }
      ],
      defaultIsShowList: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ],
      searchArr: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ],
      ellipsisList: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ],
      isGaugeOutfitList: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ],
      alignList: [{ label: '居中', value: 'center' }, { label: '靠左对齐', value: 'left' }, { label: '靠右对齐', value: 'right' }],
      includesList: ['tableCode'] // 不可编辑的dataIndex
    }
  },
  watch: {
    '$route' (to, from) {
      // 处理路由参数或 query 的变化
      console.log(to.query, '$routes')
      if (to.query && to.query.tableCode) {
        this.tableCode = to.query.tableCode
        const params = {
          fieldName: 'tableCode',
          operator: 1,
          relationType: 0,
          value: to.query.tableCode
        }
        const filters = [params]
        this.searchObj = {
          filters
        }
        this.initTableData()
      } else {
        this.searchObj = {}
        this.initTableData()
      }
    }
  },
  created () {
    that = this
  },
  updated () {
    theGridRef = this.$refs.table
  },
  /* eslint-disable */
  methods: {
    getText (list, value, type, label) {
      const index = list.findIndex((item) => item[type] == value)
      if (index !== -1) {
        return list[index][label]
      } else {
        return value
      }
    },
    // 可编辑的单元格
    editorFilter (h, { row, column }) {
      // console.log(h, row, column, row[column.property])
      // 可编辑的列表 dataIndex
      const editList = this.tableColumns.filter((item) => this.includesList.includes(item.dataIndex) === false).map((item) => item.dataIndex)
      // 可编辑的数字类型数组 4 数字类型的 dataIndex
      const numList = this.tableColumns.filter((item) => item.columnType == 4).map((item) => item.dataIndex)
      const editNumList = editList.filter((item) => numList.includes(item))
      // 视图的select类型
      const viewSelectList = this.tableColumns.filter((item) => item.columnType == 1 || item.columnType == 7).map((item) => item.dataIndex)
      const editViewSelectList = editList.filter((item) => viewSelectList.includes(item))
      if (editList.includes(column.property)) {
        // 视图下拉框
        if (editViewSelectList.includes(column.property)) {
          const index = this.tableColumns.findIndex((item) => item.dataIndex === column.property)
          // index ！== -1 说明不是字典就是自定义请求  有下拉list
          if (index !== -1) {
            const list = this.tableColumns[index].list
            console.log(list, this.dictTextFun(list, row[column.property], index))
            return (
              h('tiny-select', {
                props: {
                  placeholder: '请选择',
                  value: row[column.property]
                },
                on: {
                  input: (value) => {
                    row[column.property] = value
                  }
                }
              }, (list || []).map((item, itemIndex) => {
                return h('tiny-option', {
                  key: item.dictId ?? itemIndex,
                  props: {
                    value: item.dictId,
                    label: item.dictText
                  }
                })
              }))
            )
          }
        } else {
          // 输入框
          let type
          if (editNumList.includes(column.property)) {
            type = 'number'
          } else {
            type = 'text'
          }
          return (
            h('a-input', {
              props: {
                type: type,
                value: row[column.property]
              },
              on: {
                change: (event) => {
                  row[column.property] = event?.target?.value
                }
              }
            })
          )
        }
      }
    },
    // 单元格编辑完成触发该事件。 blur
    editClosed (args, event) {
      // console.log(args, event, 'args')
      theGridRef.validate((valid) => {
        if (valid) {
          console.log('校验成功！')
          const params = { ...args.row }
          this.updateColums(params)
        } else {
          console.log('校验不通过')
        }
      })
    },
    async updateColums (params) {
      that.tableLoading = true
      const { data } = await updateColumn(params).catch((error) => { throw new Error(error) })
      console.log(data, 'data')
      if (data.code && data.code === 200) {
        this.$antmessage.success(data.msg)
        this.$nextTick(() => {
          this.initTableData()
        })
      } else {
        this.$antmessage.error(data.msg)
      }
    },
    // 自定义编辑规则，返回true可以编辑返回false则禁止编辑
    activeMethod ({ row, column }) {
      console.log(row, column)
      // return !row.id
      return true
    },
    // 字典回显名称
    dictTextFun (list, value) {
      // console.log(list, value)
      if (list && list.length && (typeof value !== 'undefined' || value !== 'null' || value !== '')) {
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
    dragTableTh (data) {
      console.log(data)
      this.isDraging = true
      this.tableLoading = true
      this.tableColumns.forEach(item => {
        if (item.dataIndex == data.column.property) {
          console.log(item)
          item.width = data.column.resizeWidth
        }
      })
      //
      const requestGroups = []
      this.allColumnQuote.forEach(group => {
        // 分组下的所有列数据
        /** list:Array[16]
      name:"销售出库字段 */
        if (group) {
          group.list.forEach(item => {
            if (item.dataIndex == data.column.property) {
              console.log(item)
              item.width = data.column.resizeWidth
            }
          })
          const obj = {
            name: group.name,
            columnList: group.list
          }

          requestGroups.push(obj)
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
    sortChange (field) {
      // console.log(field)
      this.initTableData(field)
    },
    currentChange: debounce((pageNum) => {
      that.pageNum = pageNum
      that.initTableData()
    }, 500),
    sizeChange (pageSize) {
      const pageInfo = this.viewConfig.pageInfo
      const index = pageInfo.pageSizeList.findIndex(item => item.num == pageSize)
      if (index !== -1) {
        pageInfo.pageSizeList.forEach((item) => {
          item.isCurrent = false
        })
        pageInfo.pageSizeList[index].isCurrent = true
      }

      const params = {
        viewId: this.viewConfig.viewId,
        pageInfo: pageInfo
      }
      this.updata(params)
      this.pageSize = pageSize
      this.initTableData()
    },
    async updata (params) {
      const updateResult = await upDateVwView(params).catch((error) => { throw new Error(error) }).finally(() => {
        this.isDraging = false
      })
      if (updateResult.data.code && updateResult.data.code == 200) {
        this.tableLoading = false
      } else {
        this.tableLoading = false
        this.$antmessage.error(updateResult.data.msg)
      }
    },
    // columnSearch (obj, isexcelRefresh = true) {
    //   this.searchObj[obj.columnTitle] = {
    //     ...obj
    //   }
    //   delete this.searchObj[obj.columnTitle].columnTitle
    //   if (this.searchObj[obj.columnTitle].value === '' || this.searchObj[obj.columnTitle].value === undefined) {
    //     delete this.searchObj[obj.columnTitle]
    //   }
    //   if (isexcelRefresh) { this.initTableData() }
    // },
    updateviewConfig (v) {
      console.log(v, this.tableColumns, 'shitututut')
      this.viewConfig = v
      this.pageNum = v.currentPageNum * 1
      this.pageSize = v.currentPageSize * 1
      this.pageSizes = v.pageSizeOptions.map((item) => item * 1)
      this.tableKey++
    },
    changeSearch () { // 打开过滤组件
      this.searchShow = !this.searchShow
    },
    refreshTable () {
      this.initTableData()
    },
    initTableData: async (params) => {
      if (that.isDraging || that.viewConfig.viewId === undefined || params?.sort) {
        return
      }
      const param = {
        pageNum: that.pageNum,
        pageSize: that.pageSize,
        param: {
          ...that.searchObj,
          viewId: that.viewConfig.viewId,
        }
      }
      if (params) {
        param.orderColumns = [{ columnName: params.field, isAsc: params.order === 'asc' }] // asc 升序 desc 降序
      } else {
        //  applyDate
        param.orderColumns = []
      }
      that.tableLoading = true
      const result = await getColumnPage(param).catch((error) => { throw new Error(error) })
      that.tableLoading = false
      if (result.data.code && result.data.code === 200) {
        const {
          list = [], pageSize, total
        } = result.data.data
        that.pageSize = pageSize
        that.total = total
        that.tableList = list
        that.$refs.table.loadData(that.tableList)
      } else {
        that.$antmessage.error(result.data.msg)
      }
    },
    // 监控是否有效变化
    onStatusChange: async function (checked, record) {
      if (checked) {
        const result = await enableColumn({ code: record.code }).catch((error) => { throw new Error(error) })
        oftenMessage(result.data.data, result.data.msg)
        this.$refs.table.refresh()
      } else {
        const result = await disableColumn({ code: record.code }).catch((error) => { throw new Error(error) })
        oftenMessage(result.data.data, result.data.msg)
        this.$refs.table.refresh()
      }
    },
    addDefaultFilterColumns () {
      this.$router.push({
        path: 'view-column-filter',
        query: {
          tableCode: this.$route.query.tableCode
        }
      })
    },
    exportExcel: debounce(async function () {
      const nowStr = moment(new Date()).format('YYYYMMDDHHmmss')
      const fileName = '视图表格_' + this.$route.query.tableCode + '_视图列信息' + nowStr + '.xlsx'
      const param = {
        ...that.searchObj,
        viewId: this.viewConfig.viewId
      }
      const { data } = await exportTableColumn(param).catch((error) => { throw new Error(error) })
      if (data.type === 'application/json') {
        // 创建一个FileReader实例
        const reader = new FileReader()
        const _this = this
        // 读取文件,结果用字符串形式表示
        reader.readAsText(data, 'utf-8')
        // 读取完成后,
        reader.onload = function () {
          // 弹出错误提示
          const res = JSON.parse(reader.result)
          if (res.code === 200) {
            _this.$message.success('上传成功')
          } else {
            _this.$message.error(res.msg)
            _this.dddConfirm = false
          }
        }
      } else if (data.type === 'application/vnd.ms-excel') {
        exportExcel({ data: data, fileName: fileName })
      }
    }, 500),
    // 获取行合并
    async rowMerge () {
      this.mergeVisible = true
      const result = await getRowMerge(this.$route.query.tableCode).catch((error) => { throw new Error(error) })
      console.log(result)
      if (result.data.code && result.data.code == 200) {
        const data = result.data.data
        let mergeColumns
        if (data.mergeColumns) {
          mergeColumns = data.mergeColumns.split(',')
        } else {
          mergeColumns = []
        }
        if (data) {
          this.formModel = { ...this.formModel,
            mergeColumns: mergeColumns, // 需要合并的列编码
            // mergeColumns: ['b34444ab-6644-4e18-baac-f18e3093ec76'], // 需要合并的列编码
            mergeKeyColumn: data.mergeKeyColumn // 合并基准列编码
          }
        }
      } else {
        this.$message.error(result.data.msg)
      }
    },
    mergeOk () {
      this.$refs.mergeForm.validate().then((values) => {
        if (!err) {
          const params = {
            ...values,
            tableCode: this.$route.query.tableCode
          }
          console.log(params)
          // const result = await personnelAdd(newParams).catch((error) => { throw new Error(error) })
          // if (result.data.code && result.data.code == 200) {
          //   this.$message.success(result.data.msg)
          //   this.$nextTick(() => {
          //     this.$refs.mergeForm?.resetFields()
          //   })
          //   this.mergeVisible = false
          //   this.$refs.table.refresh()
          // } else {
          //   this.$message.error(result.data.msg)
          // }
        }
      })
    },
    mergeCancel () {
      this.mergeVisible = false
    },
    reviewView () {
      this.$router.push({
        path: 'view-review',
        query: {
          tableCode: this.$route.query.tableCode
        }
      })
    }
  }
}
</script>
