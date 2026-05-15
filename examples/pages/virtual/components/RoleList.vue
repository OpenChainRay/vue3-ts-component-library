<template>
<div >
  <a-card :bordered="false">
    <a>用户名{{this.userName}}的角色</a><br/>
    <at-table
      ref="table"
      rowKey="id"
      :columns="roleListTableColumns"
      tableKey="roleList"
      :data="initTableData"
      bordered
      :search=true
      :drag=true
    >
      <div slot="toolBarRender">
        <div>
          <a-button type="primary"  @click="connectRole">
            新增
          </a-button>
        </div>
      </div>
        <span slot="operation" slot-scope="text, record">
          <a-popconfirm title="确定删除?" @confirm="() => deleteRole(record)">
          <a href="javascript:;">删除角色</a>
        </a-popconfirm>
      </span>
    </at-table>
    <a-modal
      title="关联角色"
      :visible="connectVisible"
      @ok="handleConnectOk"
      @cancel="handleConnectCancel"
      width=350px
      :destroyOnClose=true
    >
      <a-form   ref="connectForm">
        <a-form-item   label="角色" :label-col="{ span: 6 }" :wrapper-col="{ span:10 }">
          <a-select style="width: 140%"
            v-model:value="formModel.roleId"
            show-search
            option-filter-prop="children"
          >
            <a-select-option v-for="item in roleList" :key="item.id" :value="item.id">
              {{item.roleName}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</div>
</template>

<script>
import { roleListTableColumns } from '@/pages/user/utils/tableContent'
import { getRelaUser, addRelaUserRole, getRoleList, deleteRelaUserRole } from '@/services/user/user'
import { message } from '@/utils/contextApi'
let that
export default {
  name: 'roleList',
  components: {
    // ProTable
  },
  data () {
    return {
      roleListTableColumns,
      userName: '',
      connectVisible: false,
      roleList: '',
      connectForm: null,
      roleIdList: []
    }
  },
  async created () {
    that = this
    this.userName = that.$route.query.userName
  },
  methods: {
    async deleteRole (record) {
      const result2 = await deleteRelaUserRole({ relaId: record.id }).catch((error) => { throw new Error(error) })
      if (result2.data.code && result2.data.code === 200) {
        this.roleList = result2.data.data
        that.roleIdList = []
        this.initTableData()
        this.$message.success(result2.data.msg)
        this.refreshDelete()
        this.$refs.table.refresh()
      } else {
        this.$message.error(result2.data.msg)
      }
    },
    async connectRole () {
      this.connectVisible = true
      const result2 = await getRoleList(this.roleIdList).catch((error) => { throw new Error(error) })
      if (result2.data.code && result2.data.code === 200) {
        this.roleList = result2.data.data
      } else {
        this.$message.error(result2.data.msg)
      }
      // console.log(this.userId)
    },
    async refreshDelete () {
      const result2 = await getRoleList(this.roleIdList).catch((error) => { throw new Error(error) })
      if (result2.data.code && result2.data.code === 200) {
        this.roleList = result2.data.data
      } else {
        this.$message.error(result2.data.msg)
      }
    },
    handleConnectOk () {
      this.$refs.connectForm.validate().then(async (values) => {
        const result = await addRelaUserRole({ userId: that.$route.query.id, ...values }).catch((error) => { throw new Error(error) })
          if (result.data.code && result.data.code == 200) {
            this.$message.success(result.data.msg)
            this.connectVisible = false
            this.$refs.connectForm?.resetFields()
            this.$refs.table.refresh()
          } else {
            this.$message.error(result.data.msg)
          }
      })
    },
    handleConnectCancel () {
      this.connectVisible = false
    },
    initTableData: async () => {
      // 处理日期重置后仍在查询参数中的问题
      const newParams = {
        userId: that.$route.query.id
      }
      const result = await getRelaUser(newParams).catch((error) => { throw new Error(error) })
      if (result.data.code && result.data.code === 200) {
        const {
          pageNum, pageSize, pages, total
        } = result.data.data
        result.data.data?.forEach((item) => {
          that.roleIdList.push(item.roleId)
        })
        return {
          data: result.data.data,
          pageNo: pageNum,
          pageSize: pageSize,
          totalCount: total,
          totalPage: pages
        }
      } else {
        // return {}
        message({
          msg: {
            // 提示内容
            content: result.data.msg,
            // 停留时间
            duration: 5
          },
          type: 'error'
        })
      }
    }
  }
}
</script>
