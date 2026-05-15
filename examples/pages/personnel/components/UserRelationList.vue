<template>
<div >
  <a-card :bordered="false">
    <server-side-table
      ref="table"
      :rowKey="generateHash"
      :columns="userRelationListTableColumns"
      tableKey="userRelation"
      :data="initTableData"
      bordered
      :search=true
      :drag=true
      :showPagination="true"
    >
      <div slot="toolBarRender">
        <div>
          <a-button type="primary"  @click="showInsert">
            新增
          </a-button>
        </div>
      </div>
      <span slot="Code">
        {{this.employeeCode}}
      </span>
      <span slot="action" slot-scope="text,record">
        <a-popconfirm title="确定删除?" @confirm="() => onDelete(record)">
          <a href="javascript:;">删除</a>
        </a-popconfirm>
      </span>
    </server-side-table>
    <a-modal
      title="新增员工关系"
      :visible="insertVisible"
      @ok="handleInsertOk"
      @cancel="handleInsertCancel"
      width=550px
      :destroyOnClose=true
    >
      <a-form   ref="insertForm">
        <a-form-item label="未关联员工用户" :label-col="{ span: 7 }" :wrapper-col="{ span: 7 }">
          <a-select style="width:300px;"
            v-model:value="formModel.employeeId"
            show-search
            option-filter-prop="children"
          >
            <a-select-option v-for="item in employeeList" :key="item.id" :value="item.id">
              {{item.userName}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</div>
</template>

<script>
import { userRelationListTableColumns } from '@/pages/personnel/utils/tableContent'
import { deleteUserRelation, empDeptEnable, empDeptDisable, listEmployeeOption, addInfo, getUserRelationPage } from '@/services/personnel'
import { message } from '@/utils/contextApi'
import { UUID } from '@/utils/util'
let that
export default {
  name: 'ContractCompleted',
  components: {
    // ProTable
  },
  data () {
    return {
      userRelationListTableColumns,
      employeeCode: '',
      isChecked: true,
      // 员工账号修改
      insertForm: null,
      modifyDefaultData: '',
      // 控制员工账号显示弹窗
      insertVisible: false,
      // 员工拉框
      employeeList: '',
      list: []
    }
  },
  async created () {
    that = this
    this.employeeCode = this.$route.query.employeeCode
    // console.log(this.$route.query.employeeCode)
  },
  methods: {
    generateHash () {
      return UUID()
    },
    // // 设置默认方法
    // setDefault (record) {
    //   console.log(record)
    // },
    // 控制员工账号修改弹窗
    showAccountModify (record) {
      this.accountVisible = true
      this.modifyDefaultData = record
    },
    // 员工账号修改完成
    handleInsertOk () {
      this.$refs.insertForm.validate().then(async (values) => {
        const newParam = {
          employeeId: that.$route.query.id,
          userId: values.employeeId
        }
        if (true) {
          const result = await addInfo(newParam).catch((error) => { throw new Error(error) })
          if (result.data.code && result.data.code == 200) {
            this.$message.success(result.data.msg)
            this.$refreshPage('/user')
            this.getEmployeeOption()
            this.$nextTick(() => {
              this.$refs.insertForm?.resetFields()
     })
            this.insertVisible = false
            this.$refs.table.refresh()
          } else {
            this.$message.error(result.data.msg)
          }
        }
      })
    },
    // 取消员工账号修改
    handleInsertCancel () {
      this.insertVisible = false
    },
    // 监控是否有效变化
    onChange (checked) {
      this.isChecked = checked
      // console.log('isChecked', this.isChecked)
    },
    // 修改是否有效
    async modifyOk (record) {
      // console.log('click', record.id, this.isChecked)
      if (this.isChecked == false) {
        const result = await empDeptDisable(
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
        const result = await empDeptEnable(
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
    // toRelation (record) {
    //   console.log(record.id)
    // },
    showInsert () {
      this.insertVisible = true
      this.getEmployeeOption()
    },
    // 单个删除
    async onDelete (record) {
      const result = await deleteUserRelation({ userId: record.userId }).catch((error) => { throw new Error(error) })
      if (result.data.code && result.data.code == 200) {
        this.$message.success(result.data.msg)
        this.$refreshPage('/user')
        this.$refs.table.refresh()
        this.getEmployeeOption()
      } else {
        this.$message.error(result.data.msg)
      }
    },
    initTableData: async (params) => {
      const newParams = {
        pageNum: params.pageNo,
        pageSize: params.pageSize,
        orderColumns: [{
          columnName: '',
          isAsc: true
        }],
        param: {
          employeeId: that.$route.query.id
        }
      }
      const result = await getUserRelationPage(newParams).catch((error) => { throw new Error(error) })
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
    },
    // 员工下拉框
    async getEmployeeOption () {
      const result = await listEmployeeOption().catch((error) => { throw new Error(error) })
      // console.log(this.result)
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
