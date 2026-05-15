<template>
<div >
  <a-card :bordered="false">
    <server-side-table
      ref="table"
      rowKey="id"
      :columns="roleDataListTableColumns"
      tableKey="dataOption"
      :data="initTableData"
      bordered
      :scroll="{ x: 'max-content' }"
      :search=true
      :drag=true
    >
      <div slot="toolBarRender" >
        <div>
          <a-button type="primary"  @click="showInsert">
            新增
          </a-button>
        </div>
      </div>
      <span slot="operation"  slot-scope="text, record">
        <a @click="showAccessModify(record)">
          修改权限
        </a>
        <a-divider type="vertical" />
        <a @click="deleteAccessModify(record)">
          删除权限
        </a>
      </span>
      <span slot="dataScope" slot-scope="text, record">
          <a v-if="record.dataScope==1" style="color:rgba(0, 0, 0, 0.65)">仅本人</a>
          <a v-else-if="record.dataScope==2" style="color:rgba(0, 0, 0, 0.65)">仅本部门</a>
          <a v-else-if="record.dataScope==3" style="color:rgba(0, 0, 0, 0.65)">本部门及直属部门</a>
          <a v-else-if="record.dataScope==4" style="color:rgba(0, 0, 0, 0.65)">本部门及所有下级部门</a>
          <a v-else-if="record.dataScope==5" style="color:rgba(0, 0, 0, 0.65)">自定义部门</a>
          <a v-else-if="record.dataScope==6" style="color:rgba(0, 0, 0, 0.65)">所有部门</a>
      </span>
    </server-side-table>
    <a-modal
      title="修改权限"
      :visible="accessVisible"
      @ok="handleAccessOk"
      @cancel="handleAccessCancel"
      width=550px
    >
      <a-form   ref="accessForm">
        <a-form-item label="权限：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-radio-group   :options="accessOptions"  @change="onChange"
            v-model:value="formModel.dataScope"/>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      title="新增数据对象"
      :visible="insertVisible"
      @ok="handleInsertOk"
      @cancel="handleInsertCancel"
      width=480px
      :destroyOnClose=true
    >
      <a-form   ref="insertForm">
        <a-form-item   label="数据对象" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
          <a-select style="width: 300px"
            v-model:value="formModel.dataObjectId"
            show-search
            option-filter-prop="children"
          >
            <a-select-option v-for="item in dataObjectList" :key="item.id" :value="item.id">
              {{item.dataName}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="权限：" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
          <a-radio-group   :options="accessOptions"  @change="onChange"
            v-model:value="formModel.dataScope"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</div>
</template>

<script>
import { roleDataListTableColumns } from '@/pages/role/utils/tableContent'
import { getRoleDataScopeList, editRelaDataScope, getEnableDataObjectList, addRelaDataScope, deleteRelaDataScope } from '@/services/roleList/roleList'
import { message } from '@/utils/contextApi'
let that
const accessOptions = [
  { label: '仅本人', value: 1 },
  { label: '仅本部门', value: 2 },
  { label: '本部门及直属部门', value: 3 },
  { label: '本部门及所有下级部门', value: 4 },
  { label: '自定义部门', value: 5 },
  { label: '所有部门', value: 6 }
]
export default {
  name: 'RoleDataOption',
  components: {
    // ProTable
  },
  data () {
    return {
      roleDataListTableColumns,
      value1: 'Apple',
      isChecked: true,
      accessOptions,
      accessVisible: false,
      accessForm: null,
      insertForm: null,
      checkedValue: '',
      defaultValue: 1,
      id: '',
      insertVisible: false,
      dataObjectList: '',
      insertId: ''
    }
  },
  async created () {
    that = this
  },
  methods: {
    async deleteAccessModify (record) {
      const result = await deleteRelaDataScope({
        relaId: record.id
      }).catch((error) => { throw new Error(error) })
      if (result.data.code && result.data.code == 200) {
        this.$message.success(result.data.msg)
        this.$refreshPage('/dataObject')
        this.$refs.insertForm?.resetFields()
        this.$refs.table.refresh()
        this.insertVisible = false
      } else {
        this.$message.error(result.data.msg)
      }
    },
    handleInsertOk () {
      this.$refs.insertForm.validate().then(async (values) => {
        const newParams = {
          dataObjectId: values.dataObjectId,
          dataScope: values.dataScope,
          roleId: that.$route.query.id
        }
        if (true) {
          const result = await addRelaDataScope(newParams).catch((error) => { throw new Error(error) })
          if (result.data.code && result.data.code == 200) {
            this.$message.success(result.data.msg)
            this.$refs.insertForm?.resetFields()
            this.$refs.table.refresh()
            this.$refreshPage('/dataObject')
            this.insertVisible = false
          } else {
            this.$message.error(result.data.msg)
          }
        }
      })
    },
    handleInsertCancel () {
      this.insertVisible = false
    },
    // 监控单选按钮组变化
    onChange (e) {
      // console.log('radio1 checked', e.target.value)
      this.checkedValue = e.target.value
    },
    async showInsert () {
      this.insertVisible = true
      const result = await getEnableDataObjectList().catch((error) => { throw new Error(error) })
      if (result.data.code && result.data.code === 200) {
        const {
          pageNum, pageSize, pages, total
        } = result.data.data
        this.dataObjectList = result.data.data
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
    },
    handleAccessOk () {
      this.$refs.accessForm.validate().then(async (values) => {
        const newParams = {
          id: this.id,
          dataScope: values.dataScope
        }
        if (true) {
          const result = await editRelaDataScope(newParams).catch((error) => { throw new Error(error) })
          if (result.data.code && result.data.code === 200) {
            this.$refreshPage('/dataObject')
            this.$refs.accessForm?.resetFields()
            this.accessVisible = false
            message({
              msg: {
                // 提示内容
                content: result.data.msg,
                // 停留时间
                duration: 5
              },
              type: 'success'
     })
            this.$refs.table.refresh()
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
      })
    },
    handleAccessCancel () {
      this.accessVisible = false
    },
    showAccessModify (record) {
      this.accessVisible = true
      this.id = record.id
      // console.log(this.id)
    },
    initTableData: async () => {
      const newParams = {
        roleId: that.$route.query.id
      }
      const result = await getRoleDataScopeList(newParams).catch((error) => { throw new Error(error) })
      if (result.data.code && result.data.code === 200) {
        const {
          pageNum, pageSize, pages, total
        } = result.data.data
        that.pagination = {
          pageNum,
          pageSize
        }
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
  },
  showInfo (record) {
    this.$router.push({
      name: '完成合同详情',
      query: {
        id: record.id
      }
    })
  }
}
</script>
