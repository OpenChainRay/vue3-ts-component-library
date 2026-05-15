<template>
  <div class="inquiry-info">
    <a-card :bordered="false">
      <pro-table
        ref="table"
        rowKey="id"
        :data="initInfoTableData"
        :columns="customerInfoTableColumns"
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
          批量删除
          </a-button>
          <a-button type="primary" @click="handleAdd">
            新增
          </a-button>
          <a-button type="primary" @click="pullCustomerERP">
          拉取ERP客户
          </a-button>
        </div>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleView(record)"><a-icon type="edit" theme="filled"/>&nbsp;详情

            </a>
            <a-divider type="vertical" />
            <a @click="handleEdit(record)"><a-icon type="edit" theme="filled" />&nbsp;修改
            </a>
            <a-divider type="vertical" />
            <a-popconfirm
              title="确认删除?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleDeleteConfirm(record)"
              @cancel="handleDeleteCancel"
            >
              <a><a-icon type="delete" theme="filled" />&nbsp;删除</a>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a-dropdown>
            <a class="ant-dropdown-link">
              更多&nbsp;<a-icon type="down" />
            </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="distributeERP(record)">
                  <a href="javascript:;"><a-icon type="arrow-up" />&nbsp;分配ERP</a>
                  </a-menu-item>
                  <a-menu-item @click="showCollaborator(record)">
                  <a href="javascript:;"><a-icon type="reload" />&nbsp;协作人</a>
                  </a-menu-item>
                  <a-menu-item>
                  <a href="javascript:;"><a-icon type="reload" />&nbsp;联系人</a>
                  </a-menu-item>
                  <a-menu-item>
                  <a href="javascript:;"><a-icon type="reload" />&nbsp;同步erp</a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </span>
      </pro-table>
    </a-card>
    <!-- 分配客户组织  分配ERP -->
    <a-modal v-model="erpVisible" title="详情" @ok="handleERPOk" @cancel="handleERPCancel" okText="确定" cancelText="取消">
      <AtModalForm>
        <a-form-item label="分配客户使用组织">
          <a-select placeholder="请选择"
            v-model:value="formModel.typeId"
          >
            <a-select-option v-for="item in groupList" :key="item.id" :value="item.id">
              {{ item.typeName }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </AtModalForm>
    </a-modal>
    <!-- 协作人 弹窗 -->
    <a-modal title=""></a-modal>
  </div>
</template>

<script>
import ProTable from 'at-pro-table'
import { customerInfoTableColumns } from '@/pages/basicInfo/utils/tableContent'
import AtModalForm from '@/components/AtModalForm'
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
  name: 'CustomerList',
  components: {
    ProTable,
    AtModalForm
  },
  data () {
    return {
      //  开始询价详情的表头数据及测试数据
      customerInfoTableColumns,

      // 表格中多选框数据的记录
      selectedRowKeys: [],
      selectedRows: [],
      customerMatterCode: '1111',
      rankList: [],
      erpForm: null,
      erpVisible: false,
      groupList: [],
      currentId: ''
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
</style>
