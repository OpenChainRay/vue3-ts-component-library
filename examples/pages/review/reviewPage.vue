<template>
  <div style="margin-top: 24px;">
    <UniversalContainer ref="tContainer" title="系统视图">
      <div slot="btns">
        <a-button type="primary" @click="newShowInfo()">新增</a-button>
      </div>
      <div slot="views">
        <ant-table-view :tableCode="tableCode" v-model="tableColumns" @updateviewConfig="updateviewConfig" @refresh="refreshTable"
          :allColumnQuote.sync="allColumnQuote" :isShowSetting="false">
        </ant-table-view>
        <span @click='changeSearch()' :class="searchShow ? 'blue' : ''" class="filter"><a-icon type="filter" />过滤</span>
        <span class="pagecount">(共 <strong>{{ total }}</strong>条数据)</span>
        <ant-column-display @switchColumn="switchColumn" :viewConfig="viewConfig" v-model="tableColumns" :allColumnQuote="allColumnQuote"
          style="margin-left:40px" ref="columnDisplay">设置</ant-column-display>
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
            <a-button type="link" @click="showInfo(data.row)">修改</a-button>
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
          <!-- <template v-else-if="item.dataIndex === 'tableCode'" #default="data">
            <a @click="toColumnSetting(data.row)">{{data.row.tableCode}}</a>
          </template> -->
          <!-- 表格名称 -->
          <template v-else-if="item.dataIndex === 'tableName'" #default="data">
            <editable-cell code="tableName" :index="data.columnIndex" :text="data.row.tableName" style="color:red"
              @blur="(value,changeFlag)=>handleBlur(value,changeFlag,data.row)" />
          </template>
          <!-- 备注 -->
          <template v-else-if="item.dataIndex === 'remark'" #default="data">
            <editable-cell code="remark" :index="data.columnIndex" :text="data.row.remark" style="color:red"
              @blur="(value,changeFlag)=>handleBlur(value,changeFlag,data.row)" />
          </template>
          <!-- 列表sql -->
          <template v-else-if="item.dataIndex === 'sql'" #default="data">
            <a-button type="link" @click="openSql(data.row)">sql条件</a-button>
          </template>
          <!-- 视图过滤条件 -->
          <template v-else-if="item.dataIndex === 'viewFilters'" #default="">
            <!-- <ant-table-condition :tableCode='data.row.tableCode' :id="data.row.id" :isCustomRequest="true" @customTableCondition="customTableCondition"
              :filters="data.row.filters">
              <span><a-icon type="profile" style='margin-right:5px;' />视图条件</span>
            </ant-table-condition> -->
            <span><a-icon type="profile" style='margin-right:5px;' />视图条件</span>
          </template>
          <!-- 视图列配置 -->
          <template v-else-if="item.dataIndex === 'viewColumns'" #default="">
            <span><a-icon type="profile" style='margin-right:5px;' />列配置</span>
          </template>
          <!-- 视图类型 -->
          <template v-else-if="item.dataIndex === 'viewType'" #default="data">
            <span>{{ getTextFun(data.row.viewType) }}</span>
          </template>
          <!-- 分页 -->
          <template v-else-if="item.dataIndex === 'viewPage'" #default="">
            <!-- <a @click="changePageSize(data.row.pageInfo,data.row)" v-html="formatPageSize(data.row.pageInfo)" /> -->
            <span><a-icon type="profile" style='margin-right:5px;' />分页配置</span>
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

    <a-modal title="条件映射" :visible="conditionVisible" @cancel="conditionVisible=false" width=1200px>
      <conditionList ref="condiations" :tableCode="itemTableCode" />
    </a-modal>
    <a-modal class="sqlModal" title="sql条件" :visible="sqlVisible" @cancel="sqlVisible=false" width=1400px>
      <sqlComponent :sqlValue="currentRow.sql"></sqlComponent>
    </a-modal>

    <a-modal title="修改默认分页下拉选" :visible="visible" @ok="addOk" @cancel="addCancel" width=400px>
      <div style="text-align: center">
        <page-size-list ref="pageSizeList" />
      </div>
    </a-modal>
    <a-modal class="editModel" title="编辑视图" :visible="openModifViewVisable" cancel-text="取消" ok-text="确认" :footer='null' :destroy-on-close="true"
      :mask-closable="false" @ok="handleNewViewOk" @cancel="handleNewViewCancel" width="70%">
      <div class="vheight">
        <AntEditView ref="editView" :judge='judge' :tableCode='tableCode' :viewId='detailid.viewId' :columns="tableColumns"
          :currentViewType="Number(detailid.viewType)" :viewTypeDisabled="viewTypeDisabled" @handleNewViewCancel='handleNewViewCancel'
          @handleNewViewOk='handleNewViewOk' configType='config' />
      </div>
    </a-modal>

    <!--新建视图弹框-->
    <a-modal class="addModel" title="新建视图" :visible="openNewViewVisable" :footer='null' :destroy-on-close="true" :mask-closable="false" ok-text="确认"
      @ok="handleNewViewOk" cancel-text="取消" @cancel="newHandleNewViewCancel" width="70%">
      <div class="vheight">
        <AntEditView ref="newView" :viewId='detailid.viewId' :judge="newJudge" tableCode='e44bf221-b366-4d20-ba1d-bb8decd727c2' :columns="tableColumns"
          :currentViewType="newCurrentViewType" :viewTypeDisabled="newViewTypeDisabled" @handleNewViewCancel='newHandleNewViewCancel'
          @handleNewViewOk='newHandleNewViewOk' :isCustomTableCode="true" configType='config' />
        <!-- <AntEditView ref="newView" :viewId='detailid.viewId' :judge="newJudge" :tableCode='$route.query.tableCode' :columns="tableColumns"
          :currentViewType="newCurrentViewType" :viewTypeDisabled="newViewTypeDisabled" @handleNewViewCancel='newHandleNewViewCancel'
          @handleNewViewOk='newHandleNewViewOk' :isCustomTableCode="true" /> -->
      </div>
    </a-modal>
  </div>
</template>

<script>
import myMixin from '@/layouts/mix/mymixin'
import { disableTable, enableTable, saveTable, tableUpdate, previewPage } from '@/services/middlegroundManage/systemView'
import { Grid, GridColumn, Pager } from '@opentiny/vue'
import debounce from 'lodash/debounce'
import Sortable from 'sortablejs'
// import editableCell from '@/components/editableCell/EditableCell.vue'
// import sqlComponent from '@/pages/middlegroundManage/viewTable/components/sqlComponent.vue'
// import viewTableModal from '@/pages/middlegroundManage/viewTable/components/ViewTableModal.vue'
// import pageSizeList from '@/pages/middlegroundManage/viewTable/components/PageSizeList.vue'
// import conditionList from '@/pages/middlegroundManage/viewTable/components/conditionList.vue'
let that
export default {
  name: 'systemView',
  computed: {

  },
  mixins: [myMixin],
  components: {
    TinyGrid: Grid,
    TinyGridColumn: GridColumn,
    TinyPager: Pager,
    // editableCell,
    // viewTableModal,
    // pageSizeList,
    // conditionList,
    // sqlComponent
  },

  data () {
    return {
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
      tableCode: 'e44bf221-b366-4d20-ba1d-bb8decd727c2',
      tableColumns: [],
      clearId: -1,
      searchObj: {},
      loading: false, // button按钮loading状态
      // 表头
      searchShow: false,
      itemTableCode: '',
      visible: false,
      editRecord: {},
      conditionVisible: false,
      personalView: false,
      systemTablecode: '',
      currentRow: {},
      sqlVisible: false,
      sqlValue: '',
      openModifViewVisable: false,
      detailid: {},
      judge: 1, // 1修改 2另存为 3新增
      currentViewType: 1, //  当前视图类型   1 系统视图
      viewTypeDisabled: true, // 是否禁用视图类型  默认false
      viewTypeList: [
        { title: '默认视图', value: 0 },
        { title: '系统视图', value: 1 },
        { title: '个人视图', value: 2 },
        { title: '共享视图', value: 3 },
        { title: '弹窗视图', value: 4 },
        { title: '聚合视图', value: 5 },
        { title: '固定视图', value: 6 }
      ],
      openNewViewVisable: true,
      newJudge: 3, // 1修改 2另存为 3新增
      newCurrentViewType: 1, //  当前视图类型   1 系统视图
      newViewTypeDisabled: false // 是否禁用视图类型  默认false
    }
  },
  created () {
    that = this
  },
  activated () {
    // console.log(this.$route.query, 'activated')
    if (this.$route.query.tableCode) {
      // this.tableCode = this.$route.query.tableCode
      const params = {
        fieldName: 'tableCode',
        operator: 1,
        relationType: 0,
        value: this.$route.query.tableCode
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
  },
  methods: {
    getTextFun (viewType) {
      const index = this.viewTypeList.findIndex((item) => item.value == viewType)
      if (index !== -1) {
        return this.viewTypeList[index].title
      } else {
        return ''
      }
    },
    // 视图新增
    newHandleNewViewOk () {
      this.openNewViewVisable = false
      this.initTableData()
    },
    newHandleNewViewCancel () {
      this.openNewViewVisable = false
      this.initTableData()
    },
    newShowInfo () {
      this.openNewViewVisable = true
    },
    // 视图修改
    handleNewViewOk () {
      this.openModifViewVisable = false
      this.initTableData()
    },
    handleNewViewCancel () {
      this.openModifViewVisable = false
      this.initTableData()
    },
    showInfo (record) {
      this.detailid = record
      this.openModifViewVisable = true
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
     }
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
      const result = await previewPage(param).catch((error) => { throw new Error(error) })
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
    reviewView (record) {
      this.$router.push({
        path: 'systemViewPreview',
        query: {
          tableCode: record.tableCode,
          viewId: record.viewId
        }
      })
    },
    openSql (row) {
      this.currentRow = row
      this.sqlVisible = true
    },
    handleConfigCancel () {
      this.personalView = false
      // this.initViewData()
      this.$refreshPage(this.$route.path)
    },
    changeSearch () { // 打开过滤组件
      this.searchShow = !this.searchShow
    },
    refreshTable () {
      this.initTableData()
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
    }
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
    }
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
        const result = await enableTable(this.$route.query.viewId).catch((error) => { throw new Error(error) })
        this.$antmessage.success(result.data.msg)
        this.initTableData()
      } else {
        const result = await disableTable(this.$route.query.viewId).catch((error) => { throw new Error(error) })
        this.$antmessage.success(result.data.msg)
        this.initTableData()
      }
    },
    // 双击修改
    async handleBlur (param, changeFlag, record) {
      if (changeFlag) {
        param.tableCode = record.tableCode
        param.viewId = this.$route.query.viewId
        console.log(param)
        const { data } = await tableUpdate(param).catch((error) => {
          throw new Error(error)
     }
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
      // console.log(text, 'text')
      if (text) {
        const obj = JSON.parse(text)
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
        return '<span> 分页配置 </span>'
      }
    },
    changePageSize (text, record) {
      this.editRecord = record
      this.visible = true
      this.$nextTick(() => {
        if (text) {
          // const obj = JSON.parse(text)
          this.$refs.pageSizeList.changeValue(text.pageSizeList)
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
    }
  }
}
</script>
<style lang="scss" scoped>
.sqlModal ::v-deep .ant-modal-body {
  background-color: #2f3130 !important;
}
#codeView {
  display: flex;
}
</style>
