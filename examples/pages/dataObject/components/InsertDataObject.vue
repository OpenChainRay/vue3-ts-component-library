<template>
<div >
  <a-card :bordered="false">
  <a-form   ref="insertForm">
    <a-row :gutter="20">
        <a-col :span="12">
        <a-form-item label="数据对象名称" :label-col="{ span: 10 }" :wrapper-col="{ span: 12 }">
          <a-input style="width:300px;"
            v-model:value="formModel.dataName"
          />
        </a-form-item>
        </a-col>
        <a-col :span="12">
        <a-form-item label="排序号" :label-col="{ span: 10 }" :wrapper-col="{ span: 12 }">
          <a-input-number  :min=1  style="width:300px;"
            v-model:value="formModel.sortNum"/>
        </a-form-item>
        </a-col>
        <a-col :span="12">
        <a-form-item label="数据主表名称" :label-col="{ span:10 }" :wrapper-col="{ span: 12 }">
          <a-input style="width:300px;"
            v-model:value="formModel.tableName"
          />
        </a-form-item>
        </a-col>
        <a-col :span="12">
        <a-form-item label="主表主键字段" :label-col="{ span: 10 }" :wrapper-col="{ span: 12 }">
          <a-input style="width:300px;"
            v-model:value="formModel.primaryFieldName"
          />
        </a-form-item>
        </a-col>
        <a-col :span="12">
        <a-form-item label="数据对象类型" :label-col="{ span: 10 }" :wrapper-col="{ span: 12 }">
          <a-radio-group  style="width:300px;"  :options="dataTypeOptions" @change="onChange" :defaultValue='0'
            v-model:value="formModel.dataType"/>
        </a-form-item>
        </a-col>
        <a-col :span="12">
        <a-form-item label="组织架构类型的用户字段名称" :label-col="{ span: 10 }" :wrapper-col="{ span: 12 }" v-show="relationVisible">
          <a-input style="width:300px;"
            v-model:value="formModel.userFieldName"
          />
        </a-form-item>
        </a-col>
        <a-col :span="12">
        <a-form-item label="组织架构类型的部门字段名称" :label-col="{ span: 10 }" :wrapper-col="{ span: 12 }" v-show="relationVisible">
          <a-input style="width:300px;"
            v-model:value="formModel.deptFieldName"
          />
        </a-form-item>
        </a-col>
        <a-col :span="12">
        <a-form-item label="关联表类型对应的关联表名" :label-col="{ span: 10 }" :wrapper-col="{ span: 12 }" v-show="connectVisible">
          <a-input style="width:300px;"
            v-model:value="formModel.assignedTableName"
          />
        </a-form-item>
        </a-col>
        <a-col :span="12">
        <a-form-item label="关联表类型对应关联表的用户字段名称" :label-col="{ span: 10 }" :wrapper-col="{ span: 12 }" v-show="connectVisible">
          <a-input style="width:300px;"
            v-model:value="formModel.assignedUserFieldName"
          />
        </a-form-item>
        </a-col>
        <a-col :span="12">
        <a-form-item label="关联表类型对应关联表的部门字段名称" :label-col="{ span: 10 }" :wrapper-col="{ span: 12 }" v-show="connectVisible">
          <a-input style="width:300px;"
            v-model:value="formModel.assignedDeptFieldName"
          />
        </a-form-item>
        </a-col>
        <a-col :span="12">
        <a-form-item label="关联表类型对应的关联主表的字段名称" :label-col="{ span: 10 }" :wrapper-col="{ span: 12 }" v-show="connectVisible">
          <a-input style="width:300px;"
            v-model:value="formModel.assignedPrimaryFieldName"
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
import { AtTable } from 'at-materia'
import {
  dataObjectAdd
} from '@/services/dataObject'
const { eventBus } = AtTable
const dataTypeOptions = [
  { label: '组织架构', value: 0 },
  { label: '关联表', value: 1 }
]
export default {
  name: 'ContractCompleted',
  components: {
    // ProTable
  },
  data () {
    return {
      insertForm: null,
      dataTypeOptions,
      connectVisible: false,
      relationVisible: true

    }
  },
  methods: {
    onChange (e) {
      console.log(e.target.value)
      if (e.target.value == 0) {
        this.connectVisible = false
        this.relationVisible = true
        this.formModel = { ...this.formModel, assignedTableName: null  }
        this.formModel = { ...this.formModel, assignedUserFieldName: null  }
        this.formModel = { ...this.formModel, assignedDeptFieldName: null  }
        this.formModel = { ...this.formModel, assignedPrimaryFieldName: null  }
      } else if (e.target.value == 1) {
        this.relationVisible = false
        this.connectVisible = true
        this.formModel = { ...this.formModel, userFieldName: null  }
        this.formModel = { ...this.formModel, deptFieldName: null  }
      }
    },
    insertOk () {
      this.$refs.insertForm.validate().then(async (values) => {
        // postCode 改为 postId
          // console.log('岗位名称: ', values)
          const result = await dataObjectAdd(values).catch((error) => { throw new Error(error) })
          if (result.data.code && result.data.code == 200) {
            this.$message.success(result.data.msg)
            this.$refs.insertForm?.resetFields()
            eventBus.emit('dataObject')
            this.$closePage(this.$route, {
              fullPath: '/dataObject/DataObjectList.vue',
              path: 'dataObject',
              name: '数据对象列表'
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
