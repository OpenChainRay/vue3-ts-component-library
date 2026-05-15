<template>
<div >
  <a-card :bordered="false">
   <a-form   ref="modifyForm">
    <a-row :gutter="20">
      <a-col :span="8">
        <a-form-item label="是否始终显示" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
          <a-select style="width: 300px"  v-model:value="formModel.alwaysShow">
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
          <a-form-item label="是否不在菜单树显示" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
          <a-select style="width: 300px"  v-model:value="formModel.hidden">
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
        <a-form-item label="菜单图标" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
          <a-input style="width:300px;"
            v-model:value="formModel.icon"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="排序号" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
          <a-input-number  style="width:300px;"
            v-model:value="formModel.sortNum"/>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="菜单名称" :label-col="{ span:6 }" :wrapper-col="{ span: 12 }">
          <a-input style="width:300px;"
            v-model:value="formModel.menuName"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="标题" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
          <a-input style="width:300px;"
            v-model:value="formModel.title"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="页面路径" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
          <a-input style="width:300px;"
            v-model:value="formModel.path"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="组件路径" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
          <a-input style="width:300px;"
            v-model:value="formModel.component"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="重定向路径" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
          <a-input style="width:300px;"
            v-model:value="formModel.redirect"
          />
        </a-form-item>
      </a-col>
      </a-row>
      </a-form>
      <div>
        <a-button type="primary"  @click="modifyOk">
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
import {
  modifyMenu
} from '@/services/menu/menuList'
export default {
  name: 'ContractCompleted',
  components: {
    // ProTable
  },
  data () {
    return {
      modifyForm: null,
      defaultData: ''
    }
  },
  async created () {
    this.defaultData = this.$route.query.defaultData
    // console.log(this.defaultData)
  },
  methods: {
    modifyOk () {
      this.$refs.modifyForm.validate().then(async (values) => {
        const result = await modifyMenu({ id: this.defaultData.id, ...values }).catch((error) => { throw new Error(error) })
          if (result.data.code && result.data.code == 200) {
            this.$message.success(result.data.msg)
            this.$nextTick(() => {
              this.$refs.modifyForm?.resetFields()
              this.$closePage(this.$route, {
                fullPath: '/menu/MenuList.vue',
                path: 'menuList',
                name: '菜单列表'
              })
            })
          } else {
            this.$message.error(result.data.msg)
          }
      })
    },
    resetForm () {
      this.$refs.modifyForm?.resetFields()
    }
  }
}
</script>
