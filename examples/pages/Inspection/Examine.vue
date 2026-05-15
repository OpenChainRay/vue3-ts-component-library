<template>
  <div class="inquiry-info">
    <a-card :bordered="false" :class="{ hidden: isHidden }">
      <a-page-header title="异常描述">
        <template slot="extra">
          <span key="3">未提交项次:</span>
          <span key="2">待审核数量:</span>
          <a-button key=1 type="primary">
            审核选择单据
          </a-button>
        </template>
      </a-page-header>
      <pro-table
        ref="table"
        rowKey="id"
        :data="initInfoTableData"
        :columns="examineTableColumns"
        :alert="false"
        :rowSelection="rowSelection"
        :showPagination="true"
        :scroll="{ x: 'calc(1400px )', y: 240 }"
        bordered
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <div slot="toolBarRender">
          <a-button type="primary" @click="handleBatchDelete">
          审核勾选单据
          </a-button>
        </div>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)"><a-icon type="edit" theme="filled" />&nbsp;质检详情
            </a>
            <a-divider type="vertical" />
            <a @click="handleEdit(record)"><a-icon type="edit" theme="filled" />&nbsp;判定详情
            </a>
            <a-divider type="vertical" />
            <a @click="handleView(record)"><a-icon type="edit" theme="filled"/>&nbsp;完成审核

            </a>
          </template>
        </span>
      </pro-table>
    </a-card>

    <a-card :bordered="false" v-bind:class="{ hidden: inspectionIsHidden }">
      <pro-table
        ref="table"
        rowKey="id"
        :data="initInfoTableData"
        :columns="examineTableColumns"
        :alert="false"
        :rowSelection="rowSelection"
        :showPagination="true"
        :scroll="{ x: 'calc(1400px )', y: 240 }"
        bordered
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <div slot="toolBarRender">
          <a-button type="primary" @click="handleBatchDelete">
          审核勾选单据
          </a-button>
        </div>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)"><a-icon type="edit" theme="filled" />&nbsp;质检详情
            </a>
            <a-divider type="vertical" />
            <a @click="handleEdit(record)"><a-icon type="edit" theme="filled" />&nbsp;判定详情
            </a>
            <a-divider type="vertical" />
            <a @click="handleView(record)"><a-icon type="edit" theme="filled"/>&nbsp;完成审核

            </a>
          </template>
        </span>
      </pro-table>
    </a-card>

    <a-card :bordered="false" v-bind:class="{ hidden: examineIsHidden }">
      <pro-table
        ref="table"
        rowKey="id"
        :data="initInfoTableData"
        :columns="examineTableColumns"
        :alert="false"
        :rowSelection="rowSelection"
        :showPagination="true"
        :scroll="{ x: 'calc(1400px )', y: 240 }"
        bordered
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <div slot="toolBarRender">
          <a-button type="primary" @click="handleBatchDelete">
          审核勾选单据
          </a-button>
        </div>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)"><a-icon type="edit" theme="filled" />&nbsp;质检详情
            </a>
            <a-divider type="vertical" />
            <a @click="handleEdit(record)"><a-icon type="edit" theme="filled" />&nbsp;判定详情
            </a>
            <a-divider type="vertical" />
            <a @click="handleView(record)"><a-icon type="edit" theme="filled"/>&nbsp;完成审核
            </a>
          </template>
        </span>
      </pro-table>
    </a-card>
  </div>
</template>

<script>
import ProTable from 'at-pro-table'
import { examineTableColumns } from '@/pages/Inspection/utils/tableContent'
// import AtModalForm from '@/components/AtModalForm'
import {
  getPageList,
  batchDelete,
  del,
  pullErp,
  getCustomerRankList,
  getGroups,
  distribution
} from '@/services/basicInfo/customer'
export default {
  name: 'examine',
  components: {
    ProTable
    // AtModalForm
  },
  data () {
    return {
      //  开始询价详情的表头数据及测试数据
      examineTableColumns,

      // 表格中多选框数据的记录
      selectedRowKeys: [],
      selectedRows: [],
      customerMatterCode: '1111',
      rankList: [],
      erpForm: null,
      erpVisible: false,
      groupList: [],
      currentId: '',
      isHidden: false,
      inspectionIsHidden: true,
      examineIsHidden: true
    }
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        fixed: true
      }
    }
  },
  methods: {
    initInfoTableData: async (params) => {
      console.log('params', params)
      const result = await getPageList(params).catch((error) => { throw new Error(error) })
      const {
        list = [], pageNum, pageSize, pages, total
      } = result.data.data
      return {
        data: list,
        pageNo: pageNum,
        pageSize: pageSize,
        totalCount: total,
        totalPage: pages
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleAdd () {
      this.$router.push({
        path: '/basic-info/customer-info-detail',
        query: {
          status: 'add'
        }
      })
    },
    handleView (record) {
      this.$router.push({
        path: '/basic-info/customer-info-detail',
        query: {
          status: 'view',
          id: record.id
        }
      })
    },
    handleEdit (record) {
      this.$router.push({
        path: '/basic-info/customer-info-detail',
        query: {
          status: 'edit',
          id: record.id
        }
      })
    },

    // 批量删除
    async handleBatchDelete () {
      if (!this.selectedRowKeys.length) {
        this.$message.warning('请至少选中一项')
        return
      }
      const ids = this.selectedRows.map(item => item.id)
      const result = await batchDelete({ ids }).catch((error) => { throw new Error(error) })
      this.$message.success(result?.data?.msg || '删除成功')
      this.initInfoTableData()
      this.selectedRowKeys = []
    },
    async handleDeleteConfirm (record) {
      const result = await del({ id: record.id }).catch((error) => { throw new Error(error) })
      this.$message.success(result.data.msg)
      this.initInfoTableData()
    },
    handleDeleteCancel () {
      console.log('取消删除')
    },
    // 拉取ERP客户
    async pullCustomerERP () {
      const result = await pullErp().catch((error) => { throw new Error(error) })
      this.$message.success(result.data.msg)
    },
    async getRankList () {
      const result = await getCustomerRankList().catch((error) => { throw new Error(error) })
      this.rankList = result.data.data || []
    },
    // 客户分组
    async getCustomerGroups () {
      const result = await getGroups().catch((error) => { throw new Error(error) })
      this.groupList = result.data.data || []
    },
    distributeERP (record) {
      this.erpVisible = true
      this.currentId = record.id
    },
    handleERPOk () {
      this.$refs.erpForm.validate().then(async (values) => {
        const params = {
            id: this.currentId,
            ids: values.typeId
          }
          const result = await distribution(params).catch((error) => { throw new Error(error) })
          this.$message.success(result.data.msg)
          this.formModel = { ...this.formModel, typeId: ''  }
          this.erpVisible = false
        }
      })
    },
    handleERPCancel () {
      this.formModel = { ...this.formModel, typeId: ''  }
      this.erpVisible = false
    },
    // 协作人
    showCollaborator (record) {
      this.$router.push({
        path: '/basic-info/customer-collaborator',
        query: {
          customerId: record.id
        }
      })
    }
  },
  created () {
    this.getRankList()
    this.getCustomerGroups()
  }
}
</script>

<style scoped>
.modal-main {
  height: 400px;
  overflow: hidden;
  overflow-y: scroll;
}
.hidden {
  display: none;
}
</style>
