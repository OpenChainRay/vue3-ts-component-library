<template>
  <div>
    <a-card :bordered="false">
      <pro-table
        ref="table"
        rowKey="id"
        :data="initTableData"
        :columns="customerCollaboratorTableColumns"
        :alert="false"
        :showPagination="false"
        :scroll="{ y: 240 }"
        :search="false"
        bordered
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <div slot="toolBarRender">
          <a-button type="primary" @click="handleAdd">
            新增
          </a-button>
        </div>
        <div slot="action" slot-scope="text, record">
          <template>
            <a-popconfirm
              title="确认移除?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleRemove(record)"
            >
              <a><a-icon type="edit" theme="filled"/>&nbsp;移除</a>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a-popconfirm
              title="移交客户后本人无法使用客户信息!"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleTranslate(record)"
            >
              <a><a-icon type="edit" theme="filled"/>&nbsp;移交客户</a>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a-popconfirm
              title="移交负责人后，本人还可以使用客户信息!"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleResponse(record)"
            >
              <a><a-icon type="edit" theme="filled"/>&nbsp;移交负责人</a>
            </a-popconfirm>
          </template>
        </div>
      </pro-table>
    </a-card>
    <!-- 新增协作人-弹窗 -->
    <a-modal
      title="新增协作人"
      okText="确定"
      cancelText="取消"
      :visible="addVisible"
      @ok="handleSave"
      @cancel="handleCancel"
    >
      <AtModalForm>
        <a-form-item label="姓名">
          <a-select
            style="width: 100%"
            placeholder="请选择"
            v-model:value="formModel.customerId"
            @change="handleUserChange"
          >
            <a-select-option v-for="item in saleList" :key="item.id" :value="item.id">{{ item.userName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="编码">
          <a-input disabled v-model:value="formModel.userCode" />
        </a-form-item>
        <a-input hidden disabled v-model:value="formModel.customerId" />
      </AtModalForm>
    </a-modal>
  </div>
</template>

<script>
import ProTable from 'at-pro-table'
import { customerCollaboratorTableColumns } from '@/pages/basicInfo/utils/tableContent'
import AtModalForm from '@/components/AtModalForm'
import {
  customerSaleLists,
  customerRemoveUser,
  customerChangeUser,
  customerSendUser,
  customerAuth,
  customerSale
} from '@/services/basicInfo/customer'
let customerId = ''

export default {
  name: 'CustomerCollaborator',
  components: {
    ProTable,
    AtModalForm
  },
  data () {
    return {
      customerCollaboratorTableColumns,
      customerId: '',
      form: null,
      addVisible: false,
      saleList: []
    }
  },
  methods: {
    initTableData: async (params) => {
      console.log('params', params)
      console.log('customerId', customerId)
      params.customerId = customerId
      const result = await customerSaleLists(params).catch((error) => { throw new Error(error) })
      return {
        data: result.data.data || []
      }
    },
    // 新增
    handleAdd () {
      this.addVisible = true
    },
    handleSave () {
      this.$refs.form.validate().then(async (values) => {
        const result = await customerAuth(values).catch((error) => { throw new Error(error) })
          this.$message.success(result.data.msg)
          this.formModel = { ...this.formModel, userCode: '', customerId: ''  }
          this.addVisible = false
          // 刷新页面
        }
      })
    },
    handleCancel () {
      this.formModel = { ...this.formModel, userCode: '', customerId: ''  }
      this.addVisible = false
    },
    // 移除
    async handleRemove (record) {
      // /oms/customer/sale/{customerId}/remove/{userId}
      const params = {
        customerId,
        userId: record.id
      }
      const result = await customerRemoveUser(params).catch((error) => { throw new Error(error) })
      this.$message.success(result.data.msg)
    },
    // 移交客户
    async handleTranslate (record) {
      const params = {
        customerId,
        userId: record.id
      }
      const result = await customerChangeUser(params).catch((error) => { throw new Error(error) })
      this.$message.success(result.data.msg)
    },
    // 移交负责人
    async handleResponse (record) {
      const params = {
        customerId,
        userId: record.id
      }
      const result = await customerSendUser(params).catch((error) => { throw new Error(error) })
      this.$message.success(result.data.msg)
    },
    async getSaleList () {
      const result = await customerSale({ customerId }).catch((error) => { throw new Error(error) })
      this.saleList = result.data.data
    },
    handleUserChange (val) {
      console.log('val', val)
      if (!val) {
        this.formModel = { ...this.formModel, userCode: ''  }
        return
      }
      const userCode = this.saleList.filter(item => item.id == val)[0].userCode || ''
      this.formModel = { ...this.formModel, userCode: userCode  }
    }
  },
  created () {
    customerId = this.$route.query.customerId
    this.getSaleList()
  }
}
</script>
