<template>
  <div>
    <a-card :bordered="false">

      <STable  
        :drop-config="dropConfig"
        @column-drop-end="columnDropEnd"
        column-key
        :columns="personnelListTableColumns"
        :fetch-data="fetchData"
        >
        

        </STable>

      <at-table ref="table" rowKey="generateHash"
      :columns="personnelListTableColumns"
      tableKey="personnel"
      :showPagination="true"
      :data="initTableData"
      bordered
      :search="true"
      :drag="true"

      >
        <div slot="toolBarRender">
          <div>
            <a-button type="primary" @click="showInsert">
              新增
            </a-button>
          </div>
        </div>
      <span slot="partTimeNum" slot-scope="text, record">
          <a v-if="record.status==0" disabled>{{record.partTimeNum}}</a>
          <a v-else @click="toRelation(record)" >{{record.partTimeNum}}</a>
      </span>
        <span slot="isValid" slot-scope="text, record">
          <a-switch
            checked-children="是" un-checked-children="否"
            :key="record.status==1"  :default-checked="record.status==1"
            :disabled="record.userNum>0||record.isLeader==true"
          />
        </span>
        <span slot="operation" slot-scope="text, record">
          <a @click="showModifyForm(record)">修改</a>
          <a-divider type="vertical" />
          <a @click="toPersonRelation(record)" v-if="record.status==0" disabled> 关联用户</a>
          <a @click="toPersonRelation(record)" v-else>关联用户</a>
        </span>
      </at-table>
      <!-- 修改弹窗-->
      <a-modal title="修改员工信息" :visible="modifyVisible" @ok="modifyFormOk" @cancel="modifyFormCancel" width=950px>
        <a-form ref="modifyForm">
          <a-row :gutter="20">
            <a-col :span="12">
              <a-form-item label="员工编码" :label-col="{ span: 5 }" :wrapper-col="{ span: 7 }">
                <a-input style="width:300px;" v-model:value="formModel.employeeCode" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="姓名" :label-col="{ span: 5 }" :wrapper-col="{ span: 7 }">
                <a-input style="width:300px;" v-model:value="formModel.employeeName" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="电子邮箱" :label-col="{ span: 5 }" :wrapper-col="{ span: 7 }">
                <a-input style="width:300px;" v-model:value="formModel.email" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="手机" :label-col="{ span: 5 }" :wrapper-col="{ span: 7 }">
                <a-input style="width:300px;" v-model:value="formModel.mobile" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="其他联系方式" :label-col="{ span: 5 }" :wrapper-col="{ span: 7 }">
                <a-input style="width:300px;" v-model:value="formModel.telephone" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="性别" :label-col="{ span: 5 }" :wrapper-col="{ span:9 }">
                <a-radio-group style="width:300px;" :options="accessOptions" v-model:value="formModel.gender" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="年龄" :label-col="{ span: 5 }" :wrapper-col="{ span: 7 }">
                <a-input-number style="width:300px;" :min=0  v-model:value="formModel.age" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
            </a-col>
            <a-col :span="12">
              <a-form-item label="出生年月" :label-col="{ span: 5 }" :wrapper-col="{ span: 7 }">
                <a-date-picker  style="width:300px;" v-model:value="formModel.birthday" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="入离职日期" :label-col="{ span: 5 }" :wrapper-col="{ span: 7 }">
                <a-range-picker @change="onTimeChange" style="width:300px;" :placeholder="['入职日期', '离职日期']" v-model:value="formModel.date">
                </a-range-picker>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>
      <!-- 新增弹窗-->
      <a-modal title="新增员工信息" :visible="insertVisible" @ok="insertOk" @cancel="insertCancel" width=950px :destroyOnClose=true>
        <a-form ref="insertForm">
          <a-row :gutter="20">
            <a-col :span="12">
              <a-form-item label="员工编码" :label-col="{ span: 5 }" :wrapper-col="{ span: 7 }">
                <a-input style="width:300px;" v-model:value="formModel.employeeCode" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="姓名" :label-col="{ span: 5 }" :wrapper-col="{ span: 7 }">
                <a-input style="width:300px;" v-model:value="formModel.employeeName" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="电子邮箱" :label-col="{ span: 5 }" :wrapper-col="{ span: 7 }">
                <a-input style="width:300px;" v-model:value="formModel.email" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="手机" :label-col="{ span: 5 }" :wrapper-col="{ span: 7 }">
                <a-input style="width:300px;" v-model:value="formModel.mobile" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="其他联系方式" :label-col="{ span: 5 }" :wrapper-col="{ span: 7 }">
                <a-input style="width:300px;" v-model:value="formModel.telephone" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="性别" :label-col="{ span: 5 }" :wrapper-col="{ span:9 }">
                <a-radio-group style="width:300px;" :options="accessOptions" v-model:value="formModel.gender" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="年龄" :label-col="{ span: 5 }" :wrapper-col="{ span: 7 }">

                <a-input-number style="width:300px;" :min="1" v-model:value="formModel.age" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="出生年月" :label-col="{ span: 5 }" :wrapper-col="{ span: 7 }">

                <a-date-picker :allowClear="false" style="width:300px;" v-model:value="formModel.birthday" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="入离职日期" :label-col="{ span: 5 }" :wrapper-col="{ span: 7}">
                <a-range-picker @change="onTimeChange" style="width:300px;" :placeholder="['入职日期', '离职日期']" v-model:value="formModel.date">
                </a-range-picker>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>
<script>
import { personnelListTableColumns } from './utils/tableContent'
import { UUID } from '@/utils/util'
import {
  getDataPage,
  changeDisable,
  changeEnable,
  personnelModify,
  personnelAdd,
  getDepartmentList,
  getStaffList
} from '@/services/personnel'
import { oftenMessage } from '@/utils/contextApi'
const accessOptions = [
  { label: '女', value: 0 },
  { label: '男', value: 1 },
  { label: '未知', value: 2 }
]
export default {
  name: 'PersonnelList',
  data () {
    return {
      fetchData: {
        api: this.getData
      },
      // 监控是否有效变化
      onStatusChange: async function (checked, record) {
        if (checked) {
          const result = await changeEnable({
            id: record.id
          }).catch((error) => { throw new Error(error) })
          this.$refs.table.refresh()
          oftenMessage(result.data.data, result.data.msg)
        } else {
          const result = await changeDisable({
            id: record.id
          }).catch((error) => { throw new Error(error) })
          this.$refs.table.refresh()
          oftenMessage(result.data.data, result.data.msg)
        }
      },
      personnelListTableColumns,
      // 是否有效
      isChecked: true,
      // 修改
      modifyForm: null,
      // 控制员工列表修改弹窗
      modifyVisible: false,
      modifyDefaultData: '',
      // 新增
      insertForm: null,
      accessOptions,
      // 控制新增面板显示
      insertVisible: false,
      // 部门下拉框
      departmentList: null,
      // 岗位下拉框
      staffList: null,
      // age: 1,
      startDate: '',
      birthday: '',
      endDate: ''
    }
  },
  computed: {
    departmentOptions () {
      return this.departmentList?.map((item) => {
        return {
          value: item.departmentId,
          label: `${item.departmentName}`
        }
      })
    },
    staffOptions () {
      return this.staffList?.map((item) => {
        return {
          value: item.id,
          label: `${item.positionName}`
        }
      })
    }
  },
  methods: {
    generateHash () {
      return UUID()
    },
    onTimeChange (value, dateString) {
      // console.log('Selected Time: ', value)
      // console.log('Formatted Selected Time: ', dateString[0])
      this.startDate = dateString[0]
      this.endDate = dateString[1]
    },
    onChange (value, dateString) {
      const date = new Date()
      const year = date.getFullYear()
      this.age = year - dateString.substring(0, 4)
      if (this.age == 0) {
        this.age = 1
      }
      // console.log(this.age)
    },
    toPersonRelation (record) {
      this.$router.push({
        name: '账号与员工关系',
        query: {
          id: record.id,
          employeeCode: record.employeeCode
        }
      })
    },
    // 控制员工列表修改弹窗
    showModifyForm (record) {
      this.getStaff()
      this.getDepartment()
      this.modifyVisible = true
      this.modifyDefaultData = record

      if (this.birthday == 'Invalid date') {
        this.birthday = null
      }
      // console.log(this.modifyForm)
    },
    // 员工列表修改完成，弹窗关闭，数据保存至列表
    modifyFormOk () {
      this.$refs.modifyForm.validate().then(async (values) => {
        const newParams = {
          id: this.modifyDefaultData.id,
          startDate: values.date[0],
          endDate: values.date[1],
          ...values
        }
        if (true) {
          const result = await personnelModify(newParams).catch((error) => { throw new Error(error) })
          if (result.data.code && result.data.code == 200) {
            this.$nextTick(() => {
              this.$message.success(result.data.msg)
              this.$refs.modifyForm?.resetFields()
              // this.age = ''
       }
     })
            this.$refs.table.refresh()
          } else {
            this.$refs.modifyForm?.resetFields()
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
      // this.age = ''
    },
    // 控制员工列表新增弹窗
    showInsert () {
      this.insertVisible = true
      this.getStaff()
      this.getDepartment()
    },
    // 新增保存
    insertOk () {
      this.$refs.insertForm.validate().then(async (values) => {
        const newParams = {
            startDate: values.date[0],
            endDate: values.date[1],
            ...values
          }
          const result = await personnelAdd(newParams).catch((error) => { throw new Error(error) })
          if (result.data.code && result.data.code == 200) {
            this.$message.success(result.data.msg)
            this.$nextTick(() => {
              this.$refs.insertForm?.resetFields()
       }
     })
            this.insertVisible = false
            this.$refs.table.refresh()
          } else {
            // this.$refs.insertForm?.resetFields()
            this.$message.error(result.data.msg)
          }
        }
      })
    },
    // 新增取消
    insertCancel () {
      this.insertVisible = false
      // this.age = 1
    },
    toRelation (record) {
      this.$router.push({
        name: '组织关系',
        query: {
          id: record.id,
          employeeCode: record.employeeCode
        }
      })
    },
    getData({ page, filterArgs, sortBy}){

      return new Promise(async (resolve) => {
        const newParam = {
        pageNum: page.currentPage,
        pageSize:  page.pageSize,
        orderColumns: [{
          columnName: '',
          isAsc: true
        }],
        param: {
          // departmentName: params.departmentName,
          // employeeName: params.employeeName,
          // positionName: params.positionName,
          // employeeCode: params.employeeCode
        }
      }
      const result = await getDataPage(newParam).catch((error) => { throw new Error(error) })
      if (result.data.code && result.data.code === 200) {
        const {
          list = [], pageNum, pageSize, pages, total
        } = result.data.data

          resolve({ result:list, page: { total } })
        }
      })
    },
    initTableData: async (params) => {
      // 请求接口
      const newParam = {
        pageNum: params.pageNo,
        pageSize: params.pageSize,
        orderColumns: [{
          columnName: '',
          isAsc: true
        }],
        param: {
          departmentName: params.departmentName,
          employeeName: params.employeeName,
          positionName: params.positionName,
          employeeCode: params.employeeCode
        }
      }
      const result = await getDataPage(newParam).catch((error) => { throw new Error(error) })
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
    // 岗位下拉框
    async getStaff () {
      const result = await getStaffList().catch((error) => { throw new Error(error) })
      // console.log(this.result)
      if (result.data.code && result.data.code === 200) {
        const {
          pageNum,
          pageSize,
          pages,
          total
        } = result.data.data
        this.staffList = result.data.data
        return {
          data: result.data.data,
          pageNo: pageNum,
          pageSize: pageSize,
          totalCount: total,
          totalPage: pages
        }
      } else {
        oftenMessage(result.data.data, result.data.msg)
      }
    },
    // 部门下拉框
    async getDepartment () {
      const result = await getDepartmentList().catch((error) => { throw new Error(error) })
      // console.log(this.result)
      if (result.data.code && result.data.code === 200) {
        const {
          pageNum,
          pageSize,
          pages,
          total
        } = result.data.data
        this.departmentList = result.data.data
        return {
          data: result.data.data,
          pageNo: pageNum,
          pageSize: pageSize,
          totalCount: total,
          totalPage: pages
        }
      } else {
        oftenMessage(result.data.data, result.data.msg)
      }
    }
  }
}
</script>
