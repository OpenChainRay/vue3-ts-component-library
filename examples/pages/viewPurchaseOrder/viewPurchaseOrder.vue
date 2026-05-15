<template>
  <div>
    <UniversalContainer ref="tContainer" title="采购单管理">
      <div slot="btns">

        <a-button @click="clickConditions">条件映射</a-button>
        <a-button @click="viewChange">视图切换</a-button>
        <!-- <condiations ref="condiations" :tableCode="tableCode" :columns="tableColumns"/> -->

      </div>
      <div slot="views">
        <div>
          <div class="custonSelect" style="text-align:left;float:right">
            <a-button @click="adjust">自动调整宽度</a-button>
            <ant-table-view ref="tableView" :tableCode="tableCode" v-model="tableColumns"
              @updateviewConfig="updateviewConfig" @updateLoading="updateLoading" @refresh="refreshTable"
              :allColumnQuote.sync="allColumnQuote" :isShowSetting="false" :columnMap.sync="columnMap"
              :AllColumns.sync="AllColumns" :customColumnSizeList="customColumnSizeList">
            </ant-table-view>
            <span @click='changeSearch()' :class="searchShow ? '' : ''" class="filter" style='cursor:pointer;'>
              <a-tooltip class="header-item" title="过滤" placement="bottom">
                <a-icon type="filter" />
              </a-tooltip>
            </span>
            <!-- <span class="pagecount">(共 <strong>{{ total }}</strong>条数据)</span> -->
            <ant-column-display :viewConfig="viewConfig" v-model="tableColumns" :allColumnQuote="allColumnQuote"
              style="margin-left:0px" ref="columnDisplay" @switchColumn="switchColumn">

            </ant-column-display>
          </div>
          <div v-show='searchShow'>
            <!-- :defaultColumnsValue="defaultColumnsValue" -->
            <ant-view-search ref="viewSerch" @searchMethods="searchMethods" :tableCode='tableCode'
              :viewSearchDisabled="viewSearchDisabled" :columnMap="columnMap" :tableColumns="tableColumns"
              :AllColumns="AllColumns"></ant-view-search>
          </div>
        </div>
      </div>

    </UniversalContainer>
    <a-card :style="{ 'min-height': cardheight + 'px', }" class="roundCard">
      <tiny-grid ref="table" :fetch-data="fetchData" :height="cardheight - 120" :drop-config="dropConfig" column-key
        :key="tableKey" show-header-overflow="tooltip" @resizable-change="dragTableTh" :optimization="{
          animat: true,
          delayHover: 250,
        }" @sort-change="sortChange" remote-sort @column-drop-end="columnDropEnd" :loading="tableLoading">
        <tiny-grid-column width="60" title="序号" align="center">
          <template #default="data">
            <span>
              {{ (pageNum - 1) * pageSize + (data.rowIndex + 1) }}
            </span>
          </template>
        </tiny-grid-column>
        <tiny-grid-column v-for='(item) in tableColumns' :key='item.code' :field="item.dataIndex"
          :title="item.columnTitle" :sortable="true" :width="item.width" :align="item.align" show-overflow>
          <!-- 自定义表头 -->
          <template #header>
            <ant-row-search :tableColumnObj="item" @columnSearch="columnSearch" :ref="item.dataIndex"
              :tableCode="tableCode" :columnMap="columnMap" />
          </template>
          <!-- 编码 -->
          <template v-if="item.dataIndex === 'procureId'" #default="data">
            <span @click="toDetail(data.row)" style="color: #3874ff;cursor: pointer;">{{ data.row.procureId }}</span>
          </template>
          <!-- 计划编码 -->
          <template v-else-if="item.dataIndex === 'planId'" #default="data">
            <span @click="toPlanDetail(data.row)" style="color: #3874ff;cursor: pointer;">{{ data.row.planId }}</span>
          </template>
          <!-- 供应商 -->
          <template v-else-if="item.dataIndex === 'supplierCode'" #default="data">
            <a-tooltip>
              <template slot="title">
                {{ data.row.supplierName }}
              </template>
              {{ data.row.supplierName }}
            </a-tooltip>
          </template>
          <!-- 仓库名称 -->
          <template v-else-if="item.dataIndex === 'warehouseId'" #default="data">
            <span>{{ data.row.warehouseName }}</span>
          </template>
          <!-- 采购日期 -->
          <template v-else-if="item.dataIndex === 'applyDate'" #default="data">
            <span>{{ data.row.applyDate }}</span>
          </template>
          <!-- 产品类型 -->
          <template v-else-if="item.dataIndex === 'type'" #default="data">
            <span>{{ dictTextFun(item.list, data.row.type) }}</span>
          </template>
          <!-- 单据类型 -->
          <template v-else-if="item.dataIndex === 'orderType'" #default="data">
            <span>{{ dictTextFun(item.list, data.row.orderType) }}</span>
          </template>
          <!-- 单据状态 -->
          <template v-else-if="item.dataIndex === 'orderStatus'" #default="data">
            <span>{{ dictTextFun(item.list, data.row.orderStatus) }}</span>
          </template>
          <!-- 合同状态 -->
          <template v-else-if="item.dataIndex === 'contractStatus'" #default="data">
            <span>{{ dictTextFun(item.list, data.row.contractStatus) }}</span>
          </template>
          <!-- 明细审核状态 -->
          <template v-else-if="item.dataIndex === 'verifyStatus'" #default="data">
            <span>{{ dictTextFun(item.list, data.row.verifyStatus) }}</span>
          </template>
          <!-- 是否赠品 -->
          <template v-else-if="item.dataIndex === 'isGift'" #default="data">
            <span>{{ dictTextFun(item.list, data.row.isGift) }}</span>
          </template>
          <!-- 关闭状态 -->
          <template v-else-if="item.dataIndex === 'cancellationStatus'" #default="data">
            <span>{{ dictTextFun(item.list, data.row.cancellationStatus) }}</span>
          </template>
          <!-- 供应商发货日期 -->
          <template v-else-if="item.dataIndex === 'supplierSendDate'" #default="data">
            <span>{{ data.row.supplierSendDate }}</span>
          </template>
          <!-- 采购预计到货日期 -->
          <template v-else-if="item.dataIndex === 'maybeDate'" #default="data">
            <span>{{ data.row.maybeDate }}</span>
          </template>
          <!-- oms携带到货日期 -->
          <template v-else-if="item.dataIndex === 'omsDate'" #default="data">
            <span>{{ data.row.omsDate }}</span>
          </template>
          <!-- 二次到货日期 -->
          <template v-else-if="item.dataIndex === 'secondArrivalDate'" #default="data">
            <span>{{ data.row.secondArrivalDate }}</span>
          </template>
          <!-- 最近交易供应商 -->
          <!-- <template v-else-if="item.dataIndex === 'recentlySupplierCode'" #default="data">
            <span>{{ getSupplierName(data.row.recentlySupplierCode) }}</span>
          </template> -->
          <!-- 最低交易供应商 -->
          <!-- <template v-else-if="item.dataIndex === 'minimumSupplierCode'" #default="data">
            <span>{{ getSupplierName(data.row.minimumSupplierCode) }}</span>
          </template> -->
          <!-- 未税单价 -->
          <template v-else-if="item.dataIndex === 'price'" #default="data">
            <span>{{ data.row.price }}</span>
          </template>
          <!-- 含税单价 -->
          <template v-else-if="item.dataIndex === 'taxPrice'" #default="data">
            <span>{{ data.row.taxPrice }}</span>
          </template>
          <!-- 总金额 -->
          <template v-else-if="item.dataIndex === 'totalPrice'" #default="data">
            <span>{{ data.row.totalPrice }}</span>
          </template>
          <!-- 未税总金额 -->
          <template v-else-if="item.dataIndex === 'totalTaxPrice'" #default="data">
            <span>{{ data.row.totalTaxPrice }}</span>
          </template>
          <!-- 税率 -->
          <template v-else-if="item.dataIndex === 'taxRates'" #default="data">
            <span>{{ data.row.taxRates }}</span>
          </template>
          <!-- 参考价 -->
          <template v-else-if="item.dataIndex === 'referencePrice'" #default="data">
            <span>{{ data.row.referencePrice }}</span>
          </template>
          <!-- 铝价 -->
          <template v-else-if="item.dataIndex === 'aluminumPrice'" #default="data">
            <span>{{ data.row.aluminumPrice }}</span>
          </template>
          <!-- 加工费 -->
          <template v-else-if="item.dataIndex === 'processingPrice'" #default="data">
            <span>{{ data.row.processingPrice }}</span>
          </template>
          <!-- 最低交易交期 -->
          <template v-else-if="item.dataIndex === 'minimumDeliveryTime'" #default="data">
            <span>{{ data.row.minimumDeliveryTime }}</span>
          </template>
          <!-- 最近交易交期 -->
          <template v-else-if="item.dataIndex === 'recentlyDeliveryTime'" #default="data">
            <span>{{ data.row.recentlyDeliveryTime }}</span>
          </template>
          <!-- 最近交易采购价 -->
          <template v-else-if="item.dataIndex === 'recentlyPrice'" #default="data">
            <span>{{ data.row.recentlyPrice }}</span>
          </template>
          <!-- 最低交易采购价 -->
          <template v-else-if="item.dataIndex === 'minimumPrice'" #default="data">
            <span>{{ data.row.minimumPrice }}</span>
          </template>
          <!-- 需求组织 -->
          <template v-else-if="item.dataIndex === 'needOrg'" #default="data">
            <!-- <span>{{ data.row.needOrgName }}</span> -->
            {{ getText(item.list, data.row.needOrg, 'label', 'code', item) }}
          </template>
          <!-- 结算组织 -->
          <template v-else-if="item.dataIndex === 'settlementOrg'" #default="data">
            {{ getClosingName(data.row.settlementOrg) }}
          </template>
          <template v-else-if="item.dataIndex == 'businessStatus'" #default="data">
            {{ businessStatusObj[data.row.businessStatus] }}
          </template>
        </tiny-grid-column>
        <template #empty>
          <div class="empty-center-block block" style="height: 500px;">
            <p class="tiny-grid__empty-img"></p>
            <span class="tiny-grid__empty-text">暂无数据</span>
          </div>
        </template>
      </tiny-grid>
      <tiny-pager mode="number" :currentPage="pageNum" :pageSize="pageSize" :pageSizes="pageSizes" :total="total"
        :align="align" @current-change="currentChange" @size-change="sizeChange"></tiny-pager>
    </a-card>
  </div>
</template>

<script>

// 接口
// message
import { message } from '@/utils/contextApi'
import { editProcureOrder, purchasePage, updateView } from '@/services/viewPurchaseOrder'
// 防抖
import debounce from 'lodash/debounce'
// throttle
import { Grid, GridColumn, Pager } from '@opentiny/vue'
import Sortable from 'sortablejs'
import myMixin from '@/layouts/mix/mymixin'
// import { columnMap } from './constant'
// import _ from 'lodash'
import condiations from './conditionList.vue'

let that
export default {
  mixins: [myMixin],
  name: 'PurchasingOrderManagement',
  data() {
    return {
      // tableCode: '6d853dae-85a5-4a8f-8df0-3950da704e4b',// 供应商
      // tableCode: '7f88d743-b411-4590-b6ca-42b68afa82bc',// 表格列
      // tableCode: '119a0f9e-0d68-47dd-9c8e-6c1e360d8ec9',// 视图表格
      // tableCode: 'f18047a0-3013-11ee-84ee-0242ac110022', // 报价管理
      // tableCode: '1d558811-3665-11ee-84ee-0242ac110022', // 确认报价
      // tableCode: '7f88d743-b411-4590-b6ca-42b68afa82bc', // 表格列 自定义数据后端接口
      // tableCode: 'ef735270-598d-4a6d-aa7d-e096abc56eb5', // 采购计划
      // tableCode: '1384ad08-5156-42bc-b1ee-efe25ac09b28', // 供应商联系人
      // tableCode: 'a6d399aa-4545-11ee-84ee-0242ac110022', // 完成合同
      // tableCode: '60cc45a9-ba60-11ee-a172-0242ac111e27', // 完成合同详情
      tableCode: '400034f9-1b91-4594-802d-767f2a88d903', // 出库单
      // tableCode: '8540c805-5c0f-48c8-9dd7-5442ca3cb690', // 退货单
      // tableCode: '526ad8cc-fada-11ed-b6cc-0242ac110007', // 采购单
      // tableCode: '4DD3E0E8-206A-11ee-a1f6-0242ac11000a', // 采购单
      // tableCode: 'ad17d7d4-3cdb-11ee-a1f6-0242ac11000a', // 采购单详情
      // tableCode: '76119466-a9bd-4946-a5d8-85fb62d80380', // 生产计划
      // tableCode: '46b96c6a-faf6-4980-8b4d-bd40e8baf97a', // 出库计划
      // tableCode: 'e13c785b-b127-11ee-84ca-0242ac111e27', // 客诉管理
      // tableCode: '973093d3-6765-11ef-8f4b-0242ac111e35', // 应收单管理
      // tableCode: '8a8462f6-6218-40a6-8c36-cd46a6712ee3', // 出库计划详情
      // tableCode: 'f163da9c-fb8d-11ed-9cb0-0242ac110007', // sku管理
      // tableCode: '0172513d-4630-462f-9cb4-9849e8c0e655', // 项次周期
      // tableCode: '64f81c43-536d-11ee-94dd-0242ac11002a', // 确认报价
      // tableCode: '5a1571e8-ae00-11ee-8ecf-0242ac111e27', // 询价管理
      clearId: -1,
      // 业务状态
      businessStatusObj: {
        0: '关闭',
        1: '正常'
      },
      organizationsList: [],
      supplierNameList: [],
      selectStockList: [],
      columnMap: {},
      checkedVal: 1,
      customColumnSizeList: [{ code: '9a8d3994-6f68-4a54-a0f9-fd970fb26b03', pageSize: 100000 }],
      viewSearchDisabled: ['procureId',],
      defaultColumnsValue: {
        procureId: 123,
        applyOrgId: '1',
        processingPrice: 0
      }
    }
  },
  components: {
    condiations,
    TinyGrid: Grid,
    TinyGridColumn: GridColumn,
    TinyPager: Pager
  },
  // 监听,当路由发生变化的时候执行
  watch: {
    $route: {
      handler: function () {
        // console.log(to, from, this.$route.params)
        // if (this.$route.params) {
        //   this.initTableData()
        // }
      },
      // 深度观察监听
      deep: true
    }
  },
  created() {
    that = this
    // this.getSupplierList()
    // this.getSelectStockList()
    // this.organizationsList = JSON.parse(localStorage.getItem(process.env.APP_ORGANIZATIONS_KEY))
    // this.$parentStore.dispatch('account/updateMessageNum')
  },
  methods: {
    updateLoading() {
      this.tableLoading = true
    },
    // 视图切换
    viewChange() {
      if (this.checkedVal == 1) {
        this.checkedVal = 2
      } else {
        this.checkedVal = 1
      }
      console.log(this.checkedVal, 'this.checkedVal')
      this.tableCode = this.checkedVal == 1 ? 'ef735270-598d-4a6d-aa7d-e096abc56eb5' : '46b96c6a-faf6-4980-8b4d-bd40e8baf97a'
      console.log(this.tableCode, 'this.tableCode')
      this.$refs.tableView.refreshData()
      this.$refs.viewSerch.refreshData()
    },
    /**统计英文数量 */
    countChineseAndEnglish(str) {
      // console.log(str)
      const stringV = new String(str)
      // 匹配英文字符的正则表达式
      const englishRegex = /[a-zA-Z]/g;

      // 使用正则表达式匹配英文字符
      const englishMatches = stringV.match(englishRegex);

      // 计算匹配到的中文和英文字符的数量
      const englishCount = englishMatches ? englishMatches.length : 0;
      const chineseCount = stringV.length - englishCount;
      // console.log(englishCount,chineseCount)
      return {
        chineseCount,
        englishCount
      };
    },
    adjust() {
      let that = this
      // 计算每列最大长度
      function setMaxLength(e, item, columnMaxLengthMap) {
        let key = item.dataIndex
        // console.log(e[key])
        if (!columnMaxLengthMap.get(key)) {
          columnMaxLengthMap.set(key, 0)
        }
        if (!e[key]) return
        let obj = that.countChineseAndEnglish(e[key])
        let length = Math.floor(obj.chineseCount + obj.englishCount / 2)
        if (columnMaxLengthMap.get(key) < length)
          columnMaxLengthMap.set(key, length)
      }
      function setMaxLengthBySelect(e, item, columnMaxLengthMap, element) {
        let key = item.dataIndex
        // console.log(e[key])
        if (!columnMaxLengthMap.get(key)) {
          columnMaxLengthMap.set(key, 0)
        }
        if (!element[item.columnMap.selectName]) return
        let obj = that.countChineseAndEnglish(element[item.columnMap.selectName])
        let length = Math.floor(obj.chineseCount + obj.englishCount / 2)
        if (columnMaxLengthMap.get(key) < length)
          columnMaxLengthMap.set(key, length)
      }
      const columnMaxLengthMap = new Map()
      this.tableList.forEach(e => {
        this.tableColumns.forEach(item => {
          if (item.columnType == 7) {
            //TODO 选择框要显示的名称
            if (item.list.length) {
              // 最多循环100次 减少迭代
              const maxLength = item.list.length > 100 ? 100 : item.list.length
              for (let i = 0; i < maxLength; i++) {
                const element = item.list[i];

                setMaxLengthBySelect(e, item, columnMaxLengthMap, element)
              }

            }
          } else
            setMaxLength(e, item, columnMaxLengthMap)
   })
  })
      console.log(columnMaxLengthMap)


      // //TODO 保存宽度

      // //TODO 刷新table 重新渲染


      // //调整某个列的宽度

      // 刷新页面数据
      this.tableColumns.forEach(item => {
        const columnTitleLength = item.columnTitle.length * 25

        if (columnMaxLengthMap.get(item.dataIndex)) {

          item.width = Number(columnMaxLengthMap.get(item.dataIndex)) * 15
        } else if (!item.width || item.width < columnTitleLength) {
          item.width = columnTitleLength
        }
      })
      console.log('tableColumns', this.tableColumns)
      this.tableKey++

      const requestGroups = []
      console.log(this.allColumnQuote)
      //保存数据
      this.allColumnQuote.forEach(group => {
        // 分组下的所有列数据
        /** list:Array[16]
      name:"销售出库字段 */
        if (group) {
          group.list.forEach(item => {
            const columnTitleLength = item.columnTitle.length * 25
            if (columnMaxLengthMap.get(item.dataIndex)) {

              item.width = Number(columnMaxLengthMap.get(item.dataIndex)) * 15
            } else if (!item.width || item.width < columnTitleLength) {
              item.width = columnTitleLength
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
        tableCode: this.viewConfig.tableCode,
        viewId: this.viewConfig.viewId
      }
      // console.log(params, 'params')
      clearInterval(this.clearId)
      this.clearId = setTimeout(() => {
        this.updata(params)
      }, 1000)
    },
    clickConditions() {
      this.$refs.condiations.open()
    },
    // 返回结算组织名称
    getClosingName(text) {
      const currentIndex = this.organizationsList.findIndex((item) => item.erpId === Number(text))
      if (currentIndex !== -1) {
        return this.organizationsList[currentIndex].orgName
      } else {
        return '-'
      }
    },
    sortChange(field) {
      // console.log(field)
      this.initTableData(field)
    },
    currentChange: debounce((pageNum) => {
      that.pageNum = pageNum
      that.initTableData()
    }, 500),
    sizeChange(pageSize) {
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
    // 字典回显名称
    dictTextFun(list, value) {
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
    findText(item, text) {
      // if (!text) return text
      if (typeof text === 'undefined' || text === 'null' || text === '') return text

      if (!item.list) { return text }
      const result = item.list.find(item => {
        return item.dictId === text
  })
      if (result) {
        return result.dictText || result.dictKey
      } else {
        return text
      }
    },
    stopClick(event) {
      event.stopPropagation()
    },

    // 获取table数据
    initTableData: async function (params) {
      if (this.isDraging || that.viewConfig.viewId === undefined || params?.sort) {
        return
      }
      this.tableLoading = true
      this.setDefaultSearchFun()
      const param = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        param: {
          ...that.searchObj,
          viewId: that.viewConfig.viewId,
          ...this.$route.params
        }
      }
      if (params) {
        param.orderColumns = { columnName: params.field, isAsc: params.order === 'asc' } // asc 升序 desc 降序
      } else {
        //  applyDate
        param.orderColumns = { columnName: 'procureId', isAsc: false }
      }
      // console.log(param, this.$route.params)
      const { data } = await purchasePage(param).catch((error) => { throw new Error(error) })
      // console.log(data, 'getCustomerList')
      if (data.code && data.code == 200) {
        const { list = [], pageNum, pageSize, total } = data.data
        that.pageNum = pageNum
        that.pageSize = pageSize
        that.total = total
        list.forEach(item => {
          item.saleOrgId = Number(item.saleOrgId)
   })
        // console.log(list)
        this.tableList = list
        that.$refs.table.loadData(this.tableList)
        // const hideKey = ['procureId', 'planId', 'orderType', 'applyDate']
        // this.tableList = filtrationData(list, 'procureId', hideKey)
        this.tableLoading = false

        return new Promise((resolve) => {

          resolve({ result: list, page: { total } })
   })
      } else {
        this.tableLoading = false

        message({ msg: { content: data.msg, duration: 3 }, type: 'error' })
      }
    },
    // 跳转详情 1新增 2修改
    toDetail(row) {
      this.loading = true
      this.$router.push({
        path: 'purchase-order-info',
        query: {
          id: row.procureId,
          // title: '采购单详情'
          title: row.procureId + '采购单详情'
        }
      })
      this.loading = false
    },
    // 采购计划详情 1新增 2修改
    toPlanDetail(row) {
      this.loading = true
      this.$router.push({
        path: 'purchase-plan-info',
        query: {
          id: row.planId,
          title: row.planId + '采购计划详情'
        }
      })
      this.loading = false
    }

  }
}
</script>

<style lang="less" scoped>
.topContainer {
  background: white;
  padding: 15px;
  padding-bottom: 0px;
  margin-bottom: 10px;

  .top {
    display: flex;
    align-items: center;

    .title {
      font-size: 20px;
      font-weight: 600;
      color: black;
    }

    .btns {
      flex: 1;
      text-align: left;
    }
  }

  .line {
    margin: 10px 0;
    height: 1px;
    background: rgba(30, 31, 32, 0.08);
  }

  .views {
    padding-bottom: 12px;
    min-height: 40px;

    .custonSelect {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    .pageSearch {
      margin-top: 8px;
    }

    .filter {

      cursor: pointer;
      width: 40px;
      height: 32px;
      border-radius: 4px;
      background: #F3F4F5;
      display: inline-block;
      line-height: 32px;
      text-align: center;
      margin-left: 16px;

      &:hover {
        background: #E6F2FF;

      }


      .anticon {
        margin-right: 5px;
      }
    }
  }
}

.maxHeight :deep(.ant-table-body ){
  max-height: 450px !important;
}

// .minHeight :deep(.ant-table-body ){
//   max-height: 520px !important;
// }</style>
