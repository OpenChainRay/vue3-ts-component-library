<template>
<div >
  <a-card :bordered="false">
    <a-form   ref="insertForm">
      <a-row :gutter="20">
        <a-col :span="8">
        <a-form-item label="登录账号" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-input style="width:300px;"
            v-model:value="formModel.account"
          />
        </a-form-item>
        </a-col>
        <a-col :span="8">
        <a-form-item label="登录姓名" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-input style="width:300px;"
            v-model:value="formModel.name"
          />
        </a-form-item>
        </a-col>
        <a-col :span="8">
        <a-form-item label="手机号码" :label-col="{ span:8 }" :wrapper-col="{ span: 12 }">
          <a-input style="width:300px;"
            v-model:value="formModel.phone"
          />
        </a-form-item>
        </a-col>
        <a-col :span="8">
        <a-form-item label="邮件地址" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-input style="width:300px;"
            v-model:value="formModel.email"
          />
        </a-form-item>
        </a-col>
        <a-col :span="8">
        <a-form-item label="员工编码" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-input style="width:300px;"
            v-model:value="formModel.pAccount"
          />
        </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="员工姓名" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
            <a-input style="width:300px;"
              v-model:value="formModel.pName"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
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
        </a-col>
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
export default {
  name: 'ContractCompleted',
  components: {
    // ProTable
  },
  data () {
    return {
      insertForm: null,
      selectedValue: ''
    }
  },
  methods: {
    insertOk () {
      this.$refs.insertForm.validate().then((values) => {
        console.log('新增用户: ', values)
      })
    },
    resetForm () {
      this.$refs.insertForm?.resetFields()
    },
    initSelectRoleData: async () => {
      // 测试角色下拉数据
      const list = [
        {
          key: '1',
          name: 'Jim Green',
          id: '1',
          postCode: 33333,
          postName: '董事长',
          num: 32,
          phone: '1111111',
          email: '222@qq.com',
          account: 'dsasaddsa',
          role: 'ddd2',
          otherPerson: 44
        },
        {
          key: '2',
          id: '2',
          name: 'Jim Green',
          deptName: 'IT部',
          staff: '总监',
          age: 42,
          address: 'London No. 1 Lake Park',
          tags: ['loser'],
          role: 'ddd3',
          partDept: 15
        },
        {
          key: '3',
          id: '3',
          num: 1,
          name: 'Joe Black',
          age: 32,
          address: 'Sidney No. 1 Lake Park',
          tags: ['cool', 'teacher'],
          role: 'dd4d'
        }
      ]
      const selectOptions = list.map((item) => {
        return {
          value: item.role,
          label: item.role,
          code: item.key
        }
      })
      return {
        data: selectOptions,
        pageNo: 1,
        pageSize: 10,
        totalCount: 3,
        totalPage: 1
      }
    },
    // 监控角色变化
    handleRoleChange (val, vNode) {
      this.selectedValue = val
      this.key = vNode.data.props.code
      // console.log('角色值', this.selectedValue, vNode.data.props)
    }
  }
}
</script>
