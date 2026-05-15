<template>
<div >
  <a-card :bordered="false">
    <a-form   ref="insertForm">
      <a-row :gutter="20">
        <a-col :span="8">
          <a-form-item label="用户全名" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
            <a-input style="width:300px;"
              v-model:value="formModel.fullName"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
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
        </a-col>
        <a-col :span="8">
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
        </a-col>
        <a-col :span="8">
          <a-form-item label="手机号码" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
            <a-input style="width:300px;"
              v-model:value="formModel.mobile"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="登陆密码" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
            <a-input style="width:300px;"
              v-model:value="formModel.password"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="用户名" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
            <a-input style="width:300px;"
              v-model:value="formModel.userName"
            />
          </a-form-item>
        </a-col>
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
      </a-row>
    </a-form>
    <div>
      <a-button type="primary"  @click="insertOk">
        确定
      </a-button>
      <a-button type="primary" @click="resetForm">
        重置
      </a-button>
    </div>
  </a-card>
</div>
</template>

<script>
import { getEmployeeList, addUser } from '@/services/user/user'
import { AtTable } from 'at-materia'
const { eventBus } = AtTable
export default {
  name: 'ContractCompleted',
  components: {
    // ProTable
  },
  data () {
    return {
      insertForm: null,
      selectedValue: '',
      selectedEmployeeId: ''
    }
  },
  methods: {
    handleEmployeeChange (val) {
      this.selectedEmployeeId = val
      // console.log(this.selectedEmployeeId)
    },
    async initSelectEmployeeData () {
      const result = await getEmployeeList().catch((error) => { throw new Error(error) })
      const {
        pageNum, pageSize, pages, total
      } = result.data.data
      // console.log(result.data.data)
      const selectOptions = result.data.data.map((item) => {
        return {
          value: item.id,
          label: item.employeeName
        }
      })
      return {
        data: selectOptions,
        pageNo: pageNum,
        pageSize: pageSize,
        totalCount: total,
        totalPage: pages
      }
    },
    handleFlagChange (value) {
      console.log(`selected ${value}`)
    },
    handleAdminChange (value) {
      console.log(`selected ${value}`)
    },
    insertOk () {
      this.$refs.insertForm.validate().then(async (values) => {
        const result = await addUser(values).catch((error) => { throw new Error(error) })
          if (result.data.code && result.data.code == 200) {
            eventBus.emit('user')
            this.$message.success(result.data.msg)
            this.$closePage(this.$route, {
              path: 'user',
              name: '用户列表',
              fullPath: '/user'
       }
     })
          } else {
            this.$message.error(result.data.msg)
          }
        }
      })
    },
    resetForm () {
      this.$refs.insertForm?.resetFields()
    }
  }
}
</script>
