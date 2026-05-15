<template>
  <a-card :bordered="false">
    <server-side-table
      ref="table"
      rowKey="id"
      :columns="SubListTableColumns"
      tableKey="dataObject"
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
      <span slot="status" slot-scope="text, record">
        <a-switch :disabled="record.menuCount>0" checked-children="启用" un-checked-children="停用" @change="(checked,event)=>onStatusChange(checked,record,event)"  :default-checked="record.status==1" />
      </span>
      <span slot="operation" slot-scope="text, record">
        <a @click="showEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除?" @confirm="() => deleteById(record)" >
          <a href="javascript:;" :disabled='record.menuCount>0' >删除</a>
          </a-popconfirm>
      </span>
    </server-side-table>
    <a-modal
    title="修改子系统条目"
    :visible="editVisible"
    @ok="editOk"
    @cancel="editCancel"
    width=450px
    :destroyOnClose=true
  >
    <a-form   ref="editForm">
      <a-form-item label="系统名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
        <a-input style="width:300px;"
          v-model:value="formModel.moduleName"
        />
      </a-form-item>
      <a-form-item label="系统编号" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
        <a-input style="width:300px;"
          v-model:value="formModel.moduleCode"
        />
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal
    title="新增子系统条目"
    :visible="insertVisible"
    @ok="insertOk"
    @cancel="insertCancel"
    width=450px
    :destroyOnClose=true
  >
    <a-form   ref="insertForm">
      <a-form-item label="系统名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
        <a-input style="width:300px;"
          v-model:value="formModel.moduleName"
        />
      </a-form-item>
      <a-form-item label="系统编号" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
        <a-input style="width:300px;"
          v-model:value="formModel.moduleCode"
        />
      </a-form-item>
    </a-form>
  </a-modal>
  </a-card>
</template>
<script>
import { SubListTableColumns } from './utils/tableContent'
import { getSubList, disableSubById, enableSubById, editSubListData, deleteSubListData, insertSubListData } from '@/services/subList'
import { oftenMessage } from '@/utils/contextApi'
export default {
  name: 'SubList',
  components: {
    // ProTable
    // AtModalForm
  },
  data () {
    return {
      SubListTableColumns,
      // 新增弹窗是否显示flag
      insertVisible: false,
      // 编辑窗口
      editVisible: false,
      // 编辑窗口表单
      editForm: null,
      // 编辑窗口默认值
      editFormData: {},
      // 新增窗口表单
      insertForm: null
    }
  },
  methods: {
    initTableData: async function (params) {
      const newParams = {
        pageNum: params.pageNo,
        pageSize: params.pageSize,
        orderColumns: [
          {
            columnName: '',
            isAsc: true
          }
        ],
        param: {
          createBy: 0,
          endTime: '',
          moduleCode: '',
          moduleName: '',
          startTime: '',
          updateBy: 0
        }
      }
      const result = await getSubList(newParams).catch((error) => { throw new Error(error) })
      if (result.data.code && result.data.code === 200) {
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
      } else {
        oftenMessage(result.data.data, result.data.msg)
      }
    },
    onStatusChange: async function (checked, record) {
      console.log('record', record)
      if (checked) {
        const result = await enableSubById(record.id).catch((error) => { throw new Error(error) })
        oftenMessage(result.data.data, result.data.msg)
      } else {
        const result = await disableSubById(record.id).catch((error) => { throw new Error(error) })
        oftenMessage(result.data.data, result.data.msg)
      }
    },
    showEdit (record) {
      this.editVisible = true
      this.editFormData = record
    },
    editCancel () {
      this.editVisible = false
    },
    editOk () {
      this.$refs.editForm.validate().then(async (values) => {
        const editData = {
            id: this.editFormData.id,
            moduleName: values.moduleName,
            moduleCode: values.moduleCode
          }
          const result = await editSubListData(editData).catch((error) => { throw new Error(error) })
          if (result.data.code && result.data.code == 200) {
            this.$message.success(result.data.msg)
            this.$nextTick(() => {
              this.$refs.editForm?.resetFields()
              this.$refreshPage('/personnel')
     })
            this.$refs.table.refresh()
            this.editVisible = false
          } else {
            this.$message.error(result.data.msg)
          }
      })
    },
    showInsert () {
      this.insertVisible = true
    },
    insertCancel () {
      this.insertVisible = false
    },
    insertOk () {
      this.$refs.insertForm.validate().then(async (values) => {
        const result = await insertSubListData(values).catch((error) => { throw new Error(error) })
          if (result.data.code && result.data.code == 200) {
            this.$message.success(result.data.msg)
            this.$nextTick(() => {
              this.$refs.insertForm?.resetFields()
              this.$refreshPage('/personnel')
     })
            this.$refs.table.refresh()
            this.insertVisible = false
          } else {
            this.$message.error(result.data.msg)
          }
      })
    },
    async deleteById (row) {
      const result = await deleteSubListData(row.id)
      if (result.data.code && result.data.code != 200) {
        this.$message.error(result.data.msg)
      } else {
        this.$refs.table.refresh()
      }
    }
  }
}
</script>
<style lang="less" scoped>

</style>
