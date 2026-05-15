<template>
<div >
  <a-card :bordered="false">
    <at-table
      ref="table"
      rowKey="id"
      :columns="resourceListTableColumns"
      tableKey="personnel"
      :showPagination="true"
      :data="initTableData"
      bordered
      :search=true
      :drag=true
    >
      <div slot="toolBarRender">
        <div>
          <a-button type="primary"  @click="showInsert">
            新增
          </a-button>
        </div>
      </div>
      <span slot="isValid" slot-scope="text, record">
        <a-switch  @change="onChange"  :default-checked="record.status==1?true:false"  @click="modifyOk(record)"  />
      </span>
      <span slot="operation" slot-scope="text, record">
        <a @click="showModify(record)">修改</a>
      </span>
    </at-table>
    <!-- 新增增窗-->
    <a-modal
      title="新增资源"
      :visible="insertVisible"
      @ok="insertOk"
      @cancel="insertCancel"
      width=550px
    >
      <a-form   ref="insertForm">
        <a-form-item label="排序号" :label-col="{ span: 6 }" :wrapper-col="{ span: 9 }">
          <a-input style="width:300px;"
            v-model:value="formModel.sortNum"
          />
        </a-form-item>
        <a-form-item label="资源名称" :label-col="{ span: 6 }" :wrapper-col="{ span: 9 }">
          <a-input style="width:300px;"
            v-model:value="formModel.resourceName"
          />
        </a-form-item>
        <a-form-item label="操作描述" :label-col="{ span:6 }" :wrapper-col="{ span: 9 }">
          <a-input style="width:300px;"
            v-model:value="formModel.resourceDesc"
          />
        </a-form-item>
        <a-form-item label="api请求路径" :label-col="{ span: 6 }" :wrapper-col="{ span: 9 }">
          <a-input style="width:300px;"
            v-model:value="formModel.apiUri"
          />
        </a-form-item>
        <a-form-item label="商城通用接口" :label-col="{ span: 6 }" :wrapper-col="{ span: 9 }">
          <a-input style="width:300px;"
            v-model:value="formModel.portalApi"
          />
        </a-form-item>
        <a-form-item label="后台通用接口" :label-col="{ span: 6 }" :wrapper-col="{ span: 9 }">
          <a-input style="width:300px;"
            v-model:value="formModel.adminApi"
          />
        </a-form-item>
        <a-form-item label="菜单主键" :label-col="{ span: 6 }" :wrapper-col="{ span: 9 }">
          <a-input style="width:300px;"
            v-model:value="formModel.menuId"
          />
        </a-form-item>
        <a-form-item label="请求方式" :label-col="{ span: 6 }" :wrapper-col="{ span: 9 }">
          <a-input style="width:300px;"
            v-model:value="formModel.apiMethod"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 修改增窗-->
    <a-modal
      title="修改资源"
      :visible="modifyVisible"
      @ok="modifyFormOk"
      @cancel="modifyFormCancel"
      width=450px
    >
      <a-form   ref="modifyForm">
        <a-form-item label="排序号" :label-col="{ span: 6 }" :wrapper-col="{ span: 9 }">
          <a-input style="width:300px;"
            v-model:value="formModel.sortNum"
          />
        </a-form-item>
        <a-form-item label="资源名称" :label-col="{ span: 6 }" :wrapper-col="{ span: 9 }">
          <a-input style="width:300px;"
            v-model:value="formModel.resourceName"
          />
        </a-form-item>
        <a-form-item label="操作描述" :label-col="{ span:6 }" :wrapper-col="{ span: 9 }">
          <a-input style="width:300px;"
            v-model:value="formModel.resourceDesc"
          />
        </a-form-item>
        <a-form-item label="api请求路径" :label-col="{ span: 6 }" :wrapper-col="{ span: 9 }">
          <a-input style="width:300px;"
            v-model:value="formModel.apiUri"
          />
        </a-form-item>
        <a-form-item label="商城通用接口" :label-col="{ span: 6 }" :wrapper-col="{ span: 9 }">
          <a-input style="width:300px;"
            v-model:value="formModel.portalApi"
          />
        </a-form-item>
        <a-form-item label="后台通用接口" :label-col="{ span: 6 }" :wrapper-col="{ span: 9 }">
          <a-input style="width:300px;"
            v-model:value="formModel.adminApi"
          />
        </a-form-item>

      </a-form>
    </a-modal>
  </a-card>
</div>
</template>

<script>
import { resourceListTableColumns } from './utils/tableContent'
import { getResourcePage, resourceAdd, resourceModify, changeDisable, changeEnable } from '@/services/resourceList'
import { message } from '@/utils/contextApi'
export default {
  name: 'ResourceList',
  components: {
    // ProTable
  },
  data () {
    return {
      resourceListTableColumns,
      isChecked: true,
      // 是否显示变量
      isVisibleChecked: true,
      // 菜单树显示变量
      isMenuChecked: true,
      // 新增
      // 新增控制表单
      insertForm: null,
      // 新增弹窗控制
      insertVisible: false,
      // 修改
      // 修改控制表单
      modifyForm: null,
      // 修改弹窗控制
      modifyVisible: false,
      modifyDefaultData: ''
    }
  },
  methods: {
    // 监控是否有效变化
    onChange (checked) {
      this.isChecked = checked
      console.log('isChecked', this.isChecked)
    },
    // 修改是否有效
    async modifyOk (record) {
      console.log('click', record.id, this.isChecked)
      if (this.isChecked == false) {
        const result = await changeDisable(
          {
            id: record.id
          }
        ).catch((error) => { throw new Error(error) })
        if (result.data.code && result.data.code == 200) {
          this.$message.success(result.data.msg)
          this.$refs.table.refresh()
        } else {
          this.$message.error(result.data.msg)
        }
      } else if (this.isChecked == true) {
        const result = await changeEnable(
          {
            id: record.id
          }
        ).catch((error) => { throw new Error(error) })
        if (result.data.code && result.data.code == 200) {
          this.$message.success(result.data.msg)
          this.$refs.table.refresh()
        } else {
          this.$message.error(result.data.msg)
        }
      }
    },
    // 新增弹窗打开
    showInsert () {
      this.insertVisible = true
    },
    // 新增保存
    insertOk () {
      this.$refs.insertForm.validate().then(async (values) => {
        const result = await resourceAdd(values).catch((error) => { throw new Error(error) })
          if (result.data.code && result.data.code == 200) {
            this.$message.success(result.data.msg)
            this.$nextTick(() => {
              this.$refs.insertForm?.resetFields()
       }
     })
            console.log('岗位名称: ', values.positionName)
            this.insertVisible = false
            this.$refs.table.refresh()
          } else {
            this.$message.error(result.data.msg)
          }
        }
      })
    },
    // 新增弹窗取消
    insertCancel () {
      this.insertVisible = false
    },
    // 控制员工列表修改弹窗
    showModify (record) {
      this.modifyVisible = true
      this.modifyDefaultData = record
      console.log(this.modifyForm)
    },
    // 员工列表修改完成，弹窗关闭，数据保存至列表
    modifyFormOk () {
      this.$refs.modifyForm.validate().then(async (values) => {
        const result = await resourceModify(values).catch((error) => { throw new Error(error) })
          if (result.data.code && result.data.code == 200) {
            this.$message.success(result.data.msg)
            this.$nextTick(() => {
              this.$refs.modifyForm?.resetFields()
       }
     })
            this.$refs.table.refresh()
          } else {
            this.$message.error(result.data.msg)
          }
          this.modifyVisible = false
        }
      })
    },
    // 修改弹窗取消
    modifyFormCancel () {
      this.$refs.modifyForm?.resetFields()
      this.modifyVisible = false
    },
    initTableData: async (parameter) => {
      const newParams = {
        pageNum: parameter.pageNo,
        pageSize: parameter.pageSize,
        orderColumns: [
          {
            columnName: '',
            isAsc: true
          }
        ],
        param: {}
      }
      const result = await getResourcePage(newParams).catch((error) => { throw new Error(error) })
      if (result.data.code && result.data.code === 200) {
        const {
          list = [], pageNum, pageSize, pages, total
        } = result.data.data
        console.log(result.data.data)
        return {
          data: list,
          pageNo: pageNum,
          pageSize: pageSize,
          totalCount: total,
          totalPage: pages
        }
      } else {
        message({
          msg: {
            // 提示内容
            content: result.data.msg,
            // 停留时间ot
            duration: 5
          },
          type: 'error'
     }
   })
      }
    }
  }
}
</script>
