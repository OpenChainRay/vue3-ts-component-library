<template>
  <div style="margin-top: 24px;">
    <UniversalContainer ref="tContainer" title="表格视图">
      <div slot="btns">
        <a-button type="primary" @click="addTable">新增</a-button>
        <a-button type="primary" @click="go2Configuate">值类型列表</a-button>
        <a-button type="primary" @click="go2Operate">操作符列表</a-button>

      </div>
      <div slot="views">
        <!-- :viewTypeValue="1" :viewTypeDisabled="false" -->
        <ant-table-view ref="tableView" :tableCode="tableCode" v-model="tableColumns" @updateviewConfig="updateviewConfig" @refresh="refreshTable"
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
        :loading="tableLoading">
        <tiny-grid-column type="selection" width="32" fixed="left"></tiny-grid-column>
        <tiny-grid-column width="60" title="序号" align="center">
          <template #default="data">
            <span>
              {{ (pageNum - 1) * pageSize + (data.rowIndex + 1) }}
            </span>
          </template>
        </tiny-grid-column>
        <tiny-grid-column width="300" title="操作" align="center">
          <template #default="data">
            <a-button type="link" @click="reviewView(data.row)">预览</a-button>
            <a-button type="link" @click="setCondiationsGroup(data.row)">条件映射</a-button>
            <a-button type="link" @click="openPersonView(data.row)">系统视图</a-button>
          </template>
        </tiny-grid-column>
        <tiny-grid-column v-for='(item) in tableColumns' :key='item.code' :field="item.dataIndex" :title="item.columnTitle" :sortable="true" :width="item.width"
          :align="item.align" show-overflow>
          <!-- 自定义表头 -->
          <template #header>
            <ant-row-search :tableColumnObj="item" @columnSearch="columnSearch" :ref="item.dataIndex" :tableCode="tableCode" />
          </template>
          <!-- 状态 -->
          <template v-if="item.dataIndex === 'status'" #default="data">
            <a-switch checked-children="是" un-checked-children="否" @change="onStatusChange($event,data.row)" :default-checked="data.row.status===1" />
          </template>
          <!-- 表格编码 -->
          <template v-else-if="item.dataIndex === 'tableCode'" #default="data">
            <a @click="toColumnSetting(data.row)">{{data.row.tableCode}}</a>
          </template>
          <!-- 表格名称 -->
          <!-- <template v-else-if="item.dataIndex === 'tableName'" #default="data">
            <editable-cell code="tableName" :index="data.columnIndex" :text="data.row.tableName" style="color:red"
              @blur="(value,changeFlag)=>handleBlur(value,changeFlag,data.row)" />
          </template> -->
          <!-- 备注 -->
          <!-- <template v-else-if="item.dataIndex === 'remark'" #default="data">
            <editable-cell code="remark" :index="data.columnIndex" :text="data.row.remark" style="color:red"
              @blur="(value,changeFlag)=>handleBlur(value,changeFlag,data.row)" />
          </template> -->
          <!-- 表格过滤条件 -->
          <template v-else-if="item.dataIndex === 'filters'" #default="data">
            <!-- <ant-default-view-range :tableCode='data.row.tableCode' :isCustomRequest="true" @customRviewRange="customRviewRange">
              <span><a-icon type="profile" style='margin-right:5px;' />表格条件</span>
            </ant-default-view-range> -->
            <ant-table-condition :tableCode='data.row.tableCode' :id="data.row.id" :isCustomRequest="true" @customTableCondition="customTableCondition"
              :filters="data.row.filters">
              <span><a-icon type="profile" style='margin-right:5px;' />表格条件</span>
            </ant-table-condition>

          </template>
          <!-- 分页 -->
          <template v-else-if="item.dataIndex === 'pageInfo'" #default="data">
            <a @click="changePageSize(data.row.pageInfo,data.row)" v-html="formatPageSize(data.row.pageInfo)" />
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
    </a-card>
    <view-table-modal ref="viewTableModal" />

    <a-modal v-if="conditionVisible" title="条件映射" :visible="conditionVisible" @cancel="conditionVisible=false" width=800px>
      <conditionList ref="condiations" :tableCode="itemTableCode" />
    </a-modal>

    <a-modal v-if="visible" title="修改默认分页下拉选" :visible="visible" @ok="addOk" @cancel="addCancel" width=400px>
      <div style="text-align: center">
        <page-size-list ref="pageSizeList" />
      </div>
    </a-modal>
    <a-modal title="配置系统视图" :visible="personalView" :footer='null' :destroy-on-close="true" :mask-closable="false" ok-text="确认" @ok="handlePersonOk"
      cancel-text="取消" @cancel="handleConfigCancel" width="1000px">
      <div>
        <AntConfigurationView ref="AntConfigurationView" :viewId='viewConfig.viewId' :tableCode='systemTablecode' :columns="tableColumns" :currentViewType="1"
          @refresh="refreshData" />
      </div>
    </a-modal>
  </div>
</template>

<script>
import myMixin from '@/layouts/mix/mymixin'
// import { EDIT_TYPE } from './utils/tableContent'
import { disableTable, saveTable, tableUpdate, enableTable, getTablePage, reviewView } from '@/services/view/viewTable'
import viewTableModal from './components/ViewTableModal.vue'
import pageSizeList from './components/PageSizeList.vue'
import conditionList from './components/conditionList.vue'
import { Grid, GridColumn, Pager } from '@opentiny/vue'
import debounce from 'lodash/debounce'
import Sortable from 'sortablejs'
import { upDateVwView } from '@/services/common'
// import editableCell from '@/components/editableCell/EditableCell.vue'

let that
export default {
  name: 'viewTableList',
  computed: {
    // EDIT_TYPE () {
    //   return EDIT_TYPE
    // }
  },
  mixins: [myMixin],
  components: {
    // editableCell,
    TinyGrid: Grid,
    TinyGridColumn: GridColumn,
    TinyPager: Pager,
    viewTableModal,
    pageSizeList,
    conditionList
  },

  data () {
    return {
      itemTableCode: '',
      systemTablecode: '',
      visible: false,
      editRecord: {},
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
      tableCode: '119a0f9e-0d68-47dd-9c8e-6c1e360d8ec9',
      tableColumns: [],
      clearId: -1,
      searchObj: {},
      loading: false, // button按钮loading状态
      // 表头 // button按钮loading状态
      searchShow: false,
      personalView: false
    }
  },
  created () {
    that = this
    // this.getReviewView()
  },
  methods: {
    // 视图预览: 根据表格信息预览视图
    // async getReviewView () {
    //   const result = await reviewView(this.tableCode).catch((error) => { throw new Error(error) })
    //   if (result.data.code && result.data.code === 200) {
    //     console.log(result)
    //   } else {
    //     this.$antmessage.error(result.data.msg)
    //   }
    // },
    openPersonView (row) {
      this.systemTablecode = row.tableCode
      this.personalView = true
    },
    handlePersonOk () {
      console.log('刷新视图')
      this.personalView = false
      this.$refs.tableView.initViewData()
    },
    refreshData () {
      console.log('刷新视图')
      this.personalView = false
      this.$refs.tableView.initViewData()
    },
    handleConfigCancel () {
      this.personalView = false
      // this.initViewData()
      this.$refreshPage(this.$route.path)
    },
    refreshTable () {
      this.initTableData()
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

    updateviewConfig (v) {
      console.log(v, this.tableColumns, 'shitututut')
      this.viewConfig = v
      this.pageNum = v.currentPageNum * 1
      this.pageSize = v.currentPageSize * 1
      this.pageSizes = v.pageSizeOptions.map((item) => item * 1)
      this.tableKey++
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
    async updata (params) {
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
    setCondiationsGroup (item) {
      console.log(item)
      this.itemTableCode = item.tableCode
      this.conditionVisible = true
    },
    go2Operate () {
      this.$router.push({
        path: 'logicOperateList',
        query: {
          title: '操作符列表'
        }
      })
    },
    go2Configuate () {
      this.$router.push({
        path: 'configuate',
        query: {
          title: '值类型列表'
        }
      })
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
          viewId: that.viewConfig.viewId
        }
      }
      if (params) {
        param.orderColumns = [{ columnName: params.field, isAsc: params.order === 'asc' }] // asc 升序 desc 降序
      } else {
        //  applyDate
        param.orderColumns = []
      }
      const result = await getTablePage(param).catch((error) => { throw new Error(error) })
      if (result.data.code && result.data.code === 200) {
        const {
          list = [], pageSize, total
        } = result.data.data
        that.pageSize = pageSize
        that.total = total
        that.tableList = list
        that.$refs.table.loadData(that.tableList)
      } else {
        this.$antmessage.error(result.data.msg)
      }
    },
    // 默认数据范围保存
    async customRviewRange (params) {
      console.log(params)
      const param = {
        tableFilter: params.tableFilter,
        tableCode: params.tableCode
      }
      console.log(param)
      const { data } = await saveTable(param).catch((error) => {
        throw new Error(error)
  })
      if (data.code && data.code === 200) {
        this.$antmessage.success(data.msg)
        this.initTableData()
      } else {
        this.$antmessage.error(data.msg)
      }
    },
    // 表格条件保存
    async customTableCondition (params) {
      console.log(params)
      const param = {
        tableFilter: params.tableFilter,
        tableCode: params.tableCode,
        id: params.id
      }
      console.log(param)
      const { data } = await tableUpdate(param).catch((error) => {
        throw new Error(error)
  })
      if (data.code && data.code === 200) {
        this.$antmessage.success(data.msg)
        this.initTableData()
      } else {
        this.$antmessage.error(data.msg)
      }
    },
    // 监控是否有效变化
    onStatusChange: async function (checked, record) {
      if (checked) {
        const result = await enableTable(record.tableCode).catch((error) => { throw new Error(error) })
        this.$antmessage.success(result.data.msg)
        this.initTableData()
      } else {
        const result = await disableTable(record.tableCode).catch((error) => { throw new Error(error) })
        this.$antmessage.success(result.data.msg)
        this.initTableData()
      }
    },
    // 双击修改
    async handleBlur (param, changeFlag, record) {
      if (changeFlag) {
        param.tableCode = record.tableCode
        param.id = record.id
        console.log(param)
        const { data } = await tableUpdate(param).catch((error) => {
          throw new Error(error)
   })
        if (data.code && data.code === 200) {
          this.$antmessage.success(data.msg)
          this.initTableData()
        } else {
          this.$antmessage.error(data.msg)
        }
      }
    },
    toColumnSetting (record) {
      this.$router.push({
        path: 'tableColumn',
        query: {
          tableCode: record.tableCode
        }
      })
    },
    addTable () {
      this.$refs.viewTableModal.open()
    },
    formatPageSize (text) {
      if (text) {
        // const obj = JSON.parse(text)
        const obj = text
        // console.log(obj, 'obj')
        const pageSizeList = obj.pageSizeList
        const pageSizeStr = []
        let defaultPage = ''
        pageSizeList.forEach(x => {
          pageSizeStr.push(x.num)
          if (x.isCurrent) {
            defaultPage = x.num
          }
        })

        return '<span style="">' +
          '<span>分页列表:' + pageSizeStr.join(',') + '</span>' +
          '<br/>' +
          '<span>默认分页:' + defaultPage + '</span>' +
          '</span>'
      } else {
        return '<span> 修改 </span>'
      }
    },
    changePageSize (text, record) {
      this.editRecord = record
      this.visible = true
      this.$nextTick(() => {
        if (text) {
          // const obj = JSON.parse(text)
          const obj = text
          this.$refs.pageSizeList.changeValue(obj.pageSizeList)
        }
      })
    },
    addOk () {
      this.handleBlur({ pageInfo: this.$refs.pageSizeList.getJsonValue() }, true, this.editRecord)
      this.visible = false
      this.editRecord = {}
    },
    addCancel () {
      this.visible = false
      this.editRecord = {}
    },
    reviewView (record) {
      this.$router.push({
        path: 'view-review',
        query: {
          tableCode: record.tableCode
        }
      })
    }
  }
}
</script>
