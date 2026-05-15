<template>
<div >
  <a-card :bordered="false">
    <at-table
      ref="table"
      rowKey="id"
      :columns="roleListTableColumns"
      tableKey="user"
      :showPagination="true"
      :data="initTableData"
      bordered
      :search="true"
      :drag="true"
    >
      <div slot="toolBarRender">
        <div>
          <a-button type="primary"  @click="showInsert">
            新增
          </a-button>
        </div>
      </div>
      <!-- <span slot="userNum" slot-scope="text, record">
          <a @click="toUser(record)">{{record.userNum}}</a>
      </span> -->
      <span slot="isValid" slot-scope="text, record">
        <a-switch checked-children="是" un-checked-children="否" @change="onStatusChange($event,record)" :default-checked="record.status==1" :disabled="record.userNum>0?true:false" />
      </span>
      <span slot="operation" slot-scope="text, record">
        <a @click="toFunctionOperation(record)" >功能权限</a>
        <a-divider type="vertical" />
        <a @click="toDataOperation(record)" >数据权限</a>
        <a-divider type="vertical" />
        <a @click="modifyRole(record)" >修改角色</a>
        <a-divider type="vertical" />
        <a-popconfirm title="确定删除?" @confirm="() => deleteRoleById(record)" v-if='record.userNum<=0&&record.menuNum<=0'>
          <a href="javascript:;">删除角色</a>
        </a-popconfirm>
        <a-popconfirm title="确定删除?" @confirm="() => deleteRoleById(record)" v-else disabled>
          <a href="javascript:;" disabled>删除角色</a>
        </a-popconfirm>
      </span>
    </at-table>
    <a-modal
      title="新增角色"
      :visible="roleVisible"
      @ok="roleOk"
      @cancel="roleCancel"
      width=450px
      :destroyOnClose=true
    >
      <a-form   ref="insertForm">
        <a-form-item label="角色名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
          <a-input style="width:300px;"
            v-model:value="formModel.roleName"
          />
        </a-form-item>
        <a-form-item label="角色描述" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
          <a-input style="width:300px;"
          v-model:value="formModel.roleDesc"
        />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      title="修改角色"
      :visible="editVisible"
      @ok="editOk"
      @cancel="editCancel"
      width=450px
    >
      <a-form   ref="editForm">
        <a-form-item label="角色名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
          <a-input style="width:300px;"
            v-model:value="formModel.roleName"
          />
        </a-form-item>
        <a-form-item label="角色描述" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
          <a-input style="width:300px;"
            v-model:value="formModel.roleDesc"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</div>
</template>

<script>
import { roleListTableColumns } from './utils/tableContent'
import { getRoleByPage, enableRole, disableRole, addRole, editRole, deleteRole } from '@/services/roleList/roleList'
// import { message } from '@/utils/contextApi'
import { oftenMessage } from '@/utils/contextApi'
let that
export default {
  name: 'RoleList',
  components: {
    // ProTable
  },
  data () {
    return {
      roleListTableColumns,
      isChecked: true,
      roleVisible: false,
      insertForm: null,
      editForm: null,
      defaultEditData: '',
      editVisible: false
    }
  },
  async created () {
    that = this
  },
  methods: {
    async  deleteRoleById (record) {
      const result = await deleteRole({
        id: record.id
      }).catch((error) => { throw new Error(error) })
      if (result.data.code && result.data.code == 200) {
        this.$message.success(result.data.msg)
        this.$refs.table.refresh()
        this.$refreshPage('/personnel')
      } else {
        this.$message.error(result.data.msg)
      }
    },
    modifyRole (record) {
      this.editVisible = true
      this.defaultEditData = record
    },
    roleOk () {
      this.$refs.insertForm.validate().then(async (values) => {
        const result = await addRole(values).catch((error) => { throw new Error(error) })
          if (result.data.code && result.data.code == 200) {
            this.$message.success(result.data.msg)
            this.$refreshPage('/personnel')
            this.$refs.insertForm?.resetFields()
            this.$refs.table.refresh()
            this.roleVisible = false
          } else {
            this.$message.error(result.data.msg)
          }
        }
      })
    },
    roleCancel () {
      this.roleVisible = false
    },
    editOk () {
      this.$refs.editForm.validate().then(async (values) => {
        const newParams = {
          roleName: values.roleName,
          roleDesc: values.roleDesc,
          id: this.defaultEditData.id
        }
        if (true) {
          const result = await editRole(newParams).catch((error) => { throw new Error(error) })
          if (result.data.code && result.data.code == 200) {
            this.$message.success(result.data.msg)
            this.$refreshPage('/personnel')
            this.$refs.editForm?.resetFields()
            this.$refs.table.refresh()
            this.editVisible = false
          } else {
            this.$message.error(result.data.msg)
          }
        }
      })
    },
    editCancel () {
      this.editVisible = false
    },
    // 监控是否有效变化
    onStatusChange: async function (checked, record) {
      if (checked) {
        const result = await enableRole({ id: record.id }).catch((error) => { throw new Error(error) })
        oftenMessage(result.data.data, result.data.msg)
      } else {
        const result = await disableRole({ id: record.id }).catch((error) => { throw new Error(error) })
        oftenMessage(result.data.data, result.data.msg)
      }
    },
    toUser (record) {
      this.$router.push({
        name: '用户列表',
        query: {
          id: record.id
        }
      })
    },
    showInsert () {
      this.roleVisible = true
    },
    toFunctionOperation (record) {
      this.$router.push({
        name: '功能权限',
        query: {
          id: record.id
        }
      })
    },
    toDataOperation (record) {
      this.$router.push({
        name: '数据权限',
        query: {
          id: record.id
        }
      })
    },
    initTableData: async (params) => {
      const newParams = {
        pageNum: params.pageNo,
        pageSize: params.pageSize,
        orderColumns: [{
          columnName: '',
          isAsc: false
        }],
        param: {
          roleName: params.roleName,
          roleDesc: params.roleDesc
        }
      }
      const result = await getRoleByPage(newParams).catch((error) => { throw new Error(error) })
      if (result.data.code && result.data.code === 200) {
        const {
          list = [], pageNum, pageSize, pages, total
        } = result.data.data
        that.pagination = {
          pageNum,
          pageSize
        }
        return {
          data: list,
          pageNo: pageNum,
          pageSize: pageSize,
          totalCount: total,
          totalPage: pages
        }
      } else {
        // return {}
        // message({
        //   msg: {
        //     // 提示内容
        //     content: result.data.msg,
        //     // 停留时间
        //     duration: 5
        //   },
        //   type: 'error'
        // })
        this.$message.error(result.data.msg)
      }
    }
  },
  showInfo (record) {
    this.$router.push({
      name: '完成合同详情',
      query: {
        id: record.id
      }
    })
  }
}
</script>
