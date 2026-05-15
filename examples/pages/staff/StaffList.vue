<template>
<div >
  <a-card :bordered="false">
    <at-table
      ref="table"
      rowKey="id"
      :columns="staffListTableColumns"
      tableKey="staff"
      :showPagination="true"
      :data="initTableData"
      bordered
      :search=true
      :drag=true
      :dropConfig="dropConfig"

    >
      <div slot="toolBarRender">
        <div>
          <a-button type="primary"  @click="showInsert">
            新增
          </a-button>
        </div>
      </div>
      <span slot="isValid" slot-scope="text, record">
        <a-switch checked-children="是" un-checked-children="否" @change="onStatusChange($event,record)" :default-checked="record.status==1" :disabled="record.employeeNum>0?true:false" />
      </span>
      <span slot="positionName"   slot-scope="text, record">
          <a  @click="showPostNameModify(record)">{{record.positionName}}</a>
      </span>
    </at-table>
    <!-- 部门名称修改窗-->
    <a-modal
      title="修改岗位名称"
      :visible="postNameVisible"
      @ok="handlePostNameOk"
      @cancel="handlePostNameCancel"
      width=450px
    >
      <a-form   ref="modifyForm">
        <!-- <a-form-item label="岗位代码" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }" >
          <a-input disabled style="width:300px;"
            v-model:value="formModel.id"
          />
        </a-form-item> -->
        <a-form-item label="岗位名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
          <a-input style="width:300px;"
            v-model:value="formModel.positionName"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 新增窗-->
    <a-modal
      title="新增岗位"
      :visible="insertVisible"
      @ok="insertOk"
      @cancel="insertCancel"
      width=450px
      :destroyOnClose=true
    >
      <a-form   ref="insertForm">
        <a-form-item label="岗位名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
          <a-input style="width:300px;"
            v-model:value="formModel.positionName"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</div>
</template>
<script>
import { staffListTableColumns } from './utils/tableContent'
import { getStaffPage, changeDisable, changeEnable, staffAdd, staffModify } from '@/services/staffList'
// import { getStaffPage, changeDisable, changeEnable, staffAdd, staffModify, staffDelete } from '@/services/staffList'
// import { message } from '@/utils/contextApi'
import { oftenMessage } from '@/utils/contextApi'
const pagination = {
  pageNum: 1,
  pageSize: 10
}
export default {
  name: 'ContractCompleted',
  components: {
    // ProTable
  },
  data () {
    return {
      dropConfig:{
        column:true
      },
      // list: [{ slotName: 'postName', func: 'handleBlur1' }, { slotName: 'postCode', func: 'handleBlur1' }],
      pagination,
      staffListTableColumns,
      completedContractData: [],
      isChecked: true,
      // 控制修改金蝶代码弹窗
      goldVisible: false,
      goldCode: '',
      // 控制部门名称显示弹窗
      postNameVisible: false,
      modifyForm: null,
      insertForm: null,
      // 控制新增面板显示
      insertVisible: false,
      // currentIndex: '',
      // currentData: ''
      modifyFormData: '',
      id: ''
    }
  },
  methods: {
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
        param: {
          positionName: parameter.positionName
        }
      }
      const result = await getStaffPage(newParams).catch((error) => { throw new Error(error) })
      if (result.data.code && result.data.code === 200) {
        const {
          list = [], pageNum, pageSize, pages, total
        } = result.data.data
        // console.log(result.data.data)
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
    // 单个删除
    // async onDelete (record) {
    //   const result = await staffDelete({ id: record.id }).catch((error) => { throw new Error(error) })
    //   if (result.data.code && result.data.code == 200) {
    //     this.$message.success(result.data.msg)
    //     this.$refs.table.refresh()
    //   } else {
    //     this.$message.error(result.data.msg)
    //   }
    // },
    // 控制岗位名称修改弹窗
    showPostNameModify (record) {
      this.postNameVisible = true
      this.modifyFormData = record
      // console.log(this.modifyFormData.id)
    },
    // 岗位名称修改完成
    handlePostNameOk () {
      this.$refs.modifyForm.validate().then(async (values) => {
        // console.log('岗位名称: ', values.positionName)
          // console.log('岗位代码: ', values.id)
          const result = await staffModify({ id: this.modifyFormData.id, ...values }).catch((error) => { throw new Error(error) })
          if (result.data.code && result.data.code == 200) {
            this.$message.success(result.data.msg)
            this.$nextTick(() => {
              this.$refs.modifyForm?.resetFields()
              this.$refreshPage('/personnel')
     })
            this.$refs.table.refresh()
            this.postNameVisible = false
          } else {
            this.$message.error(result.data.msg)
          }
      })
    },
    // 取消岗位名称修改
    handlePostNameCancel () {
      this.$nextTick(() => {
        this.$refs.modifyForm?.resetFields()
  })
      this.postNameVisible = false
    },
    // 监控是否有效变化
    onStatusChange: async function (checked, record) {
      if (checked) {
        const result = await changeEnable({ id: record.id }).catch((error) => { throw new Error(error) })
        oftenMessage(result.data.data, result.data.msg)
      } else {
        const result = await changeDisable({ id: record.id }).catch((error) => { throw new Error(error) })
        oftenMessage(result.data.data, result.data.msg)
      }
    },
    // 新增弹窗打开
    showInsert () {
      this.insertVisible = true
    },
    // 新增保存
    insertOk () {
      this.$refs.insertForm.validate().then(async (values) => {
        const result = await staffAdd(values).catch((error) => { throw new Error(error) })
          if (result.data.code && result.data.code == 200) {
            this.$message.success(result.data.msg)
            this.$nextTick(() => {
              this.$refs.insertForm?.resetFields()
              this.$refreshPage('/personnel')
     })
            // console.log('岗位名称: ', values.positionName)
            this.insertVisible = false
            this.$refs.table.refresh()
          } else {
            this.$message.error(result.data.msg)
          }
      })
    },
    // 新增取消
    insertCancel () {
      this.insertVisible = false
    }
  }
}
</script>
<style scoped>
  .inline-block {
    display: inline-block;
}
</style>
