<template>
<div >
  <a-card :bordered="false">
    <!-- {{ userListTableColumns }}{{ userListTableColumns.length }} -->
    <at-table
      ref="table"
      rowKey="id"
      :columns="userListTableColumns"
      tableKey="user"
      :showPagination="true"
      :data="initTableData"
      bordered
      :search=true
      :drag=true
      :dropConfig="{
        column:true,
        row:true
      }"
      @column-drop-start="columnDropStart"
      @column-drop-end = "columnDropEnd"
    >
      <div slot="toolBarRender">
        <div>
          <a-button type="primary"  @click="showInsert">
            新增
          </a-button>
        </div>
      </div>
      <span slot="status" slot-scope="text, record">
        <a-switch checked-children="是" un-checked-children="否" @change="onStatusChange($event,record)" :default-checked="record.status==1"/>

      </span>
      <!-- <span slot="role" slot-scope="text, record">
          <a @click="toRoleList(record)">{{record.role}}</a>
      </span> -->
      <span slot="operation" slot-scope="text, record">
        <a  v-if="record.status==0 || isAdmin!=1" disabled>重置密码</a>
        <a v-else-if="record.status==1&&isAdmin==1" @click="resetPassword(record)">重置密码</a>
        <a-divider type="vertical"/>
        <a @click="showModifyForm(record)">修改</a>
        <a-divider type="vertical" />
        <a @click="toRoleList2(record)">查看角色</a>
      </span>
    </at-table>
    <a-modal
      title="修改用户信息"
      :visible="modifyVisible"
      @ok="modifyFormOk"
      @cancel="modifyFormCancel"
      width=450px
    >
      <a-form   ref="modifyForm">
        <a-form-item label="用户全名" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
          <a-input style="width:300px;"
            v-model:value="formModel.fullName"
          />
        </a-form-item>
        <a-form-item label="标记" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
          <a-select  @change="handleFlagChange" style="width:300px;"
            v-model:value="formModel.initPwdFlag">
            <a-select-option :value=1>
              是
            </a-select-option>
            <a-select-option :value=0>
              否
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="是否管理员" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
          <a-select  @change="handleAdminChange" style="width:300px;"
            v-model:value="formModel.isAdmin">
            <a-select-option :value=1>
              是
            </a-select-option>
            <a-select-option :value=0>
              否
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="手机号码" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
          <a-input style="width:300px;"
            v-model:value="formModel.mobile"
          />
        </a-form-item>
        <a-form-item label="登陆密码" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
          <a-input style="width:300px;"
            v-model:value="formModel.password"
          />
        </a-form-item>
        <a-form-item label="用户名" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
          <a-input style="width:300px;"
            v-model:value="formModel.userName"
          />
        </a-form-item>

        <a-form-item label="id" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }" style="margin-left:2000px">
          <a-input style="width:300px;"
            v-model:value="formModel.id"
          />
        </a-form-item>
        <!-- <a-form-item label="员工账号" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
          <a-input style="width:300px;"
            v-model:value="formModel.account"
          />
        </a-form-item>
        <a-form-item label="角色" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
          <at-pro-select
            style="width:300px;"
            :show-search="true"
            allow-clear
            :request="initSelectRoleData"
            :value="selectedValue"
            placeholder="请选择角色"
            v-model:value="formModel.role"
            @change="handleRoleChange"
          />
        </a-form-item> -->
      </a-form>
    </a-modal>

    <a-modal
      title="新增用户信息"
      :visible="insertVisible"
      @ok="insertFormOk"
      @cancel="insertFormCancel"
      width=450px
    >
    <a-form   ref="insertForm">

          <a-form-item label="用户全名" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
            <a-input style="width:300px;"
              v-model:value="formModel.fullName"
            />
          </a-form-item>

          <a-form-item label="标记" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
            <a-select  @change="handleFlagChange" style="width:300px;"
            v-model:value="formModel.initPwdFlag">
              <a-select-option :value=1>
                是
              </a-select-option>
              <a-select-option :value=0>
                否
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="是否管理员" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
            <a-select  @change="handleAdminChange" style="width:300px;"
            v-model:value="formModel.isAdmin">
              <a-select-option :value=1>
                是
              </a-select-option>
              <a-select-option :value=0>
                否
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="手机号码" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
            <a-input style="width:300px;"
              v-model:value="formModel.mobile"
            />
          </a-form-item>

          <a-form-item label="登陆密码" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
            <a-input style="width:300px;"
              v-model:value="formModel.password"
            />
          </a-form-item>

          <a-form-item label="用户名" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
            <a-input style="width:300px;"
              v-model:value="formModel.userName"
            />
          </a-form-item>

        <!-- <a-col :span="8">
          <a-form-item label="角色" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
            <at-pro-select
              style="width:300px;"
              :show-search="true"
              allow-clear
              :request="initSelectRoleData"
              :value="selectedValue"
              placeholder="请选择角色"
              v-model:value="formModel.role"
              @change="handleRoleChange"
          />
          </a-form-item>
        </a-col> -->

    </a-form>
    </a-modal>
    <a-modal
      title="查看用户角色"
      :visible="roleVisible"
      @ok="roleOk"
      @cancel="roleCancel"
      width=450px
    >
      <a-form   ref="formRef3">
        <a-form-item label="角色名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
          <a-input style="width:300px;"
            v-model:value="formModel.roleName" disabled
          />
        </a-form-item>
        <a-form-item label="角色描述" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
          <a-input style="width:300px;"
            v-model:value="formModel.roleDesc" disabled
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</div>
</template>

<script>
import { userListTableColumns, roleListTableColumns } from './utils/tableContent'
import { getUserByPage, enableUser, disableUser, initPassword, editUser, getEmployeeList, getRelaUser, addUser } from '@/services/user/user'
import { oftenMessage } from '@/utils/contextApi'
let that
export default {
  name: 'ContractCompleted',
  components: {
  },
  data () {
    return {
      userListTableColumns,
      roleListTableColumns,
      isChecked: true,
      connectVisible: false,
      modifyVisible: false,
      modifyForm: null,
      insertForm: null,
      // 角色下拉选择值
      selectedValue: '',
      key: '',
      // 记录record的行数据
      defaultModifyData: '',
      selectedEmployeeId: '',
      employeeList: '',
      roleVisible: false,
      userId: '',
      roleList: '',
      roleDefaultList: {
        roleName: '',
        roleDesc: ''
      },
      insertVisible: false,
      isAdmin: ''
    }
  },
  async created () {
    that = this

    this.isAdmin = this.$store.state.account.user.isAdmin
  },
  methods: {
    columnDropStart () {
      console.log('开始拖拽')
    },
    columnDropEnd () {
      console.log('结束拖拽')
    },
    handleEmployeeChange (val) {
      this.selectedEmployeeId = val
      // console.log(this.selectedEmployeeId)
    },
    // async initSelectEmployeeData () {
    //   const result = await getEmployeeList().catch((error) => { throw new Error(error) })
    //   const {
    //     pageNum, pageSize, pages, total
    //   } = result.data.data
    //   console.log(result.data.data)
    //   const selectOptions = result.data.data.map((item) => {
    //     return {
    //       value: item.id,
    //       label: item.employeeName
    //     }
    //   })
    //   return {
    //     data: selectOptions,
    //     pageNo: pageNum,
    //     pageSize: pageSize,
    //     totalCount: total,
    //     totalPage: pages
    //   }
    // },
    insertFormOk () {
      this.$refs.insertForm.validate().then(async (values) => {
        const result = await addUser(values).catch((error) => { throw new Error(error) })
          if (result.data.code && result.data.code == 200) {
            this.$refs.table.refresh()
            this.insertVisible = false
            this.$message.success(result.data.msg)
          } else {
            this.$message.error(result.data.msg)
          }
      })
    },
    insertFormCancel () {
      this.insertVisible = false
    },
    handleFlagChange (value) {
      console.log(`selected ${value}`)
    },
    handleAdminChange (value) {
      console.log(`selected ${value}`)
    },
    // 重置密码
    async resetPassword (record) {
      const result = await initPassword({
        id: record.id
      }).catch((error) => {
        throw new Error(error)
  })
      // this.$refs.table.refresh()
      // oftenMessage(result.data.code, result.data.msg)
      if (result.data.code == 200) {
        // message({
        //   msg: {
        //     // 提示内容
        //     content: result.data.msg,
        //     // 停留时间
        //     duration: 5
        //   },
        //   type: 'success'
        // })
        this.$message.success(result.data.msg)
        this.$refs.table.refresh()
      } else {
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
    },
    async showModifyForm (record) {
      this.modifyVisible = true
      this.defaultModifyData = record
      const result = await getEmployeeList().catch((error) => { throw new Error(error) })
      if (result.data.code && result.data.code === 200) {
        const {
          pageNum, pageSize, pages, total
        } = result.data.data
        this.employeeList = result.data.data
        return {
          data: result.data.data,
          pageNo: pageNum,
          pageSize: pageSize,
          totalCount: total,
          totalPage: pages
        }
      } else {
        this.$message.error(result.data.msg)
      }
    },
    modifyFormOk () {
      this.$refs.modifyForm.validate().then(async (values) => {
        const result = await editUser(values).catch((error) => { throw new Error(error) })
          if (result.data.code && result.data.code == 200) {
            this.$message.success(result.data.msg)
            this.modifyVisible = false
            this.$refs.modifyForm?.resetFields()
            this.selectedValue = ''
            this.selectedEmployeeId = ''
            this.$refs.table.refresh()
          } else {
            this.$message.error(result.data.msg)
          }
      })
    },
    modifyFormCancel () {
      this.modifyVisible = false
      this.$refs.modifyForm?.resetFields()
      this.selectedValue = ''
      this.selectedEmployeeId = ''
    },
    // 监控角色变化
    handleRoleChange (val) {
      this.selectedValue = val
      // console.log('角色值', this.selectedValue)
    },
    // 监控是否有效变化
    onStatusChange: async function (checked, record) {
      if (checked) {
        const result = await enableUser({ id: record.id }).catch((error) => { throw new Error(error) })
        oftenMessage(result.data.data, result.data.msg)
        this.$refs.table.refresh()
      } else {
        const result = await disableUser({ id: record.id }).catch((error) => { throw new Error(error) })
        oftenMessage(result.data.data, result.data.msg)
        this.$refs.table.refresh()
      }
    },
    roleCancel () {
      this.roleList = ''
      this.roleVisible = false
    },
    roleOk () {
      this.roleList = ''
      this.roleVisible = false
    },
    async toRoleList (record) {
      this.roleVisible = true
      this.roleList = ''
      const newParams = {
        userId: record.id
      }
      const result = await getRelaUser(newParams).catch((error) => { throw new Error(error) })
      if (result.data.code && result.data.code === 200) {
        const {
          pageNum, pageSize, pages, total
        } = result.data.data
        this.roleList = result.data.data[0] || this.roleDefaultList
        // console.log(this.roleList)
        return {
          data: result.data.data,
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
    },
    async toRoleList2 (record) {
      this.$router.push({
        name: '用户的角色列表',
        query: {
          id: record.id,
          userName: record.userName
        }
      })
    },
    showInsert () {
      this.insertVisible = true
    },
    initTableData: async (params) => {
      // 处理日期重置后仍在查询参数中的问题
      const newParams = {
        pageNum: params.pageNo,
        pageSize: params.pageSize,
        orderColumns: [{
          columnName: '',
          isAsc: false
        }],
        param: {
          mobile: params.mobile,
          userName: params.userName,
          fullName: params.fullName,
          employeeName: params.employeeName,
          deptName: params.deptName
        }
      }
      const result = await getUserByPage(newParams).catch((error) => { throw new Error(error) })
      console.log('result.data', result.data)
      if (result.data.code && result.data.code === 200) {
        const {
          list = null, pageNum, pageSize, pages, total
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
  }
}
</script>
