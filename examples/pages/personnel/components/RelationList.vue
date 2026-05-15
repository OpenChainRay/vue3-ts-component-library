<template>
<div >
  <a-card :bordered="false">
    <at-table
      ref="table"
      rowKey="id"
      :columns="relationListTableColumns"
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

      <span slot="employeeCode" >
        {{this.employeeCode}}
      </span>
      <span slot="operation" slot-scope="text, record">
        <a @click="showModify(record)" >修改</a>
        <a-divider type="vertical" />
        <a-popconfirm title="确定删除?" @confirm="() => deleteDept(record)">
          <a href="javascript:;" v-if="record.isDefault==1" disabled>删除</a>
          <a href="javascript:;" v-else>删除</a>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a @click="setDefault(record)" v-if="record.isDefault==1" disabled >设为默认</a>
        <a @click="setDefault(record)" v-else >设为默认</a>
      </span>
      <span slot="default" slot-scope="text, record" >
        <a-tag color="#00508f" v-if="record.isDefault==1">
          默认
        </a-tag>
      </span>
    </at-table>
    <a-modal
      title="新增信息"
      :visible="insertVisible"
      @ok="insertFormOk"
      @cancel="insertFormCancel"
      width=450px
      :destroyOnClose="true"
    >
      <a-form   ref="modifyForm">
        <a-form-item label="是否为主管：" :label-col="{ span: 6 }" :wrapper-col="{ span: 7 }">
          <a-radio-group style="width:300px" :options="plainOptions" @change="onChange1"  v-model:value="formModel.isLeader"/>
        </a-form-item>
        <a-form-item label="岗位" :label-col="{ span: 6 }" :wrapper-col="{ span: 7 }">
          <at-select style="width:300px;"
            v-model:value="formModel.positionId"
            :showSearch="true"
            :lazyOptions="this.staffOptions"
            placeholder="请选择岗位"
          />
        </a-form-item>
        <a-form-item label="部门" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
          <div class="tree-wrap">
            <!-- 刷新按钮 -->
            <span class="tree-reload">
              <a-icon type="reload" @click="refreshTree" />
            </span>
            <div class="tree-wrap-main" v-if="isFresh">
              <a-tree :show-line="true" :selected-keys="departmentTreeCheckedKeys" :default-expanded-keys="departmentTreeExpandedKeys" :tree-data="departmentTreeData" @select="onDepartmentSelect">
              </a-tree>
            </div>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      title="修改信息"
      :visible="modifyVisible"
      @ok="modifyFormOk"
      @cancel="modifyFormCancel"
      width="450px"
      :destroyOnClose="true"
    >
      <a-form   ref="insertForm">
        <a-form-item label="是否为主管：" :label-col="{ span: 6 }" :wrapper-col="{ span: 7 }">
          <a-radio-group style="width:300px" :options="plainOptions" @change="onChange1"  v-model:value="formModel.isLeader"/>
        </a-form-item>
        <a-form-item label="岗位" :label-col="{ span: 4 }" :wrapper-col="{ span: 8 }">
          <at-select style="width:300px;"
            v-model:value="formModel.positionId"
            :showSearch="true"
            :lazyOptions="this.staffOptions"
            placeholder="请选择岗位" />
        </a-form-item>
        <a-form-item label="部门" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
          <div class="tree-wrap">
            <!-- 刷新按钮 -->
            <span class="tree-reload">
              <a-icon type="reload" @click="refreshTree" />
            </span>
            <div class="tree-wrap-main" v-if="isFresh">
              <a-tree   :show-line="true" :selected-keys="departmentTreeCheckedKeys"
              :default-expanded-keys="departmentTreeExpandedKeys"
              :tree-data="departmentTreeData"
              @select="onDepartmentSelect"
              >
              </a-tree>
            </div>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</div>
</template>

<script>
import {
  getEmpDeptPage, setDefault, getStaffList, empDeptAdd, empDeptEdit, deleteDept
} from '@/services/personnel'
import { relationListTableColumns } from '@/pages/personnel/utils/tableContent'
import { oftenMessage } from '@/utils/contextApi'
// import { getDepartmentTree } from '@/services/departmentList'
import debounce from 'lodash/debounce'
import { mapActions, mapState } from 'vuex'
const plainOptions = [
  { label: '是', value: true },
  { label: '否', value: false }
]
// let that
export default {
  name: 'ContractCompleted',
  components: {
  },
  data () {
    return {
      plainOptions,
      departmentTreeData: [],
      departmentTreeCheckedKeys: [],
      departmentTreeExpandedKeys: [],
      relationListTableColumns,
      staffList: null,
      isChecked: true,
      insertVisible: false,
      modifyVisible: false,
      modifyForm: null,
      insertForm: null,
      parentDepartment: null,
      currentDepartmentId: null,
      isFresh: true,
      departmentId: '',
      editPositionId: '',
      editDepartmentId: '',
      checkedOptions: [],
      editId: '',
      employeeCode: '',
      isMain: '',
      isLeader: '',
      isModify: false,
      selectedKey: '',
      selectedKeys: [],
      changeKey: ''
    }
  },
  async created () {
    // that = this
    this.employeeCode = this.$route.query.employeeCode

    // 通过相关vuex action初始化部门树
    await this.getAvailableDepartmentTree().catch((error) => { throw new Error(error) })
  },
  computed: {
    staffOptions () {
      return this.staffList?.map((item) => {
        return {
          value: item.id,
          label: `${item.positionName}`
        }
      })
    },
    ...mapState('department', ['allDepartmentTree', 'availableDepartmentTree'])
  },
  methods: {
    ...mapActions('department', ['getAllDepartmentTree', 'getAvailableDepartmentTree']),
    onChange1 (e) {
      this.isMain = e.target.value
    },
    async deleteDept (record) {
      const result = await deleteDept({ id: record.id }).catch((error) => { throw new Error(error) })
      if (result.data.code && result.data.code == 200) {
        this.$nextTick(() => {
          this.$refreshPage('/personnel')
          this.$refs.table.refresh()
          this.$message.success(result.data.msg)
   })
      } else {
        this.$message.error(result.data.msg)
      }
    },
    initTreeSelectData ({ selectKeys = [], expandedKeys = [], parentDepartment = {} }) {
      this.departmentTreeCheckedKeys = selectKeys
      this.departmentTreeExpandedKeys = expandedKeys
      this.parentDepartment = parentDepartment
    },
    // 初始化部门树数据
    getDepartmentTreeData: async function () {
      const departmentTreeList = this.formatTreeData(this.availableDepartmentTree)
      const rootTreeDate = {
        key: 0,
        id: 0,
        title: '所有菜单',
        ancestor: '0',
        children: departmentTreeList
      }

      this.departmentTreeData = [rootTreeDate]
      const initDefaultSelectNode = rootTreeDate
      await this.initTreeSelectData({
        selectKeys: this.isModify == true ? [this.selectedKey] : [initDefaultSelectNode.key],
        expandedKeys: this.isModify == true ? [this.selectedKey] : [initDefaultSelectNode.key],
        parentDepartment: {
          departmentName: initDefaultSelectNode.departmentName,
          id: initDefaultSelectNode.id
        }
      })
      console.log(initDefaultSelectNode.departmentName)
    },
    // 格式化树组件的数据
    formatTreeData (treeData) {
      return treeData.map((item) => {
        item.title = item.departmentName
        item.key = item.id
        if (item.children && item.children.length > 0) {
          this.formatTreeData(item.children)
        } else {
          item.isLeaf = true
        }
        return item
  })
    },
    // 刷新分类树
    refreshTree: debounce(function () {
      // 销毁 重新渲染
      this.isFresh = false
      this.$nextTick(async () => {
        this.isFresh = true
        await this.getDepartmentTreeData(true).catch((error) => { throw new Error(error) })
        this.$message.success('刷新成功')
  })
    }, 1000),
    // 部门树节点被选事件
    onDepartmentSelect (selectKeys, e) {
      if (selectKeys != '') {
        this.changeKey = selectKeys
      }
      if (selectKeys == '') {
        selectKeys = this.changeKey || this.selectedKey
      }
      console.log(selectKeys)

      this.departmentId = selectKeys[0]
      if (e.selected) {
        const selectedNodeProps = e.selectedNodes[0].data.props
        const expandedKeys = [...selectedNodeProps.ancestor.split(',')].map(Number)
        this.initTreeSelectData({
          selectKeys,
          expandedKeys,
          parentDepartment: {
            departmentName: selectedNodeProps.departmentName,
            id: selectedNodeProps.id
          }
        })
      }
    },
    insertFormOk () {
      this.$refs.insertForm.validate().then(async (values) => {
        const newParams = {
          ...values,
          employeeId: this.$route.query.id,
          departmentId: this.departmentId
        }
        if (true) {
          const result = await empDeptAdd(newParams).catch((error) => { throw new Error(error) })
          if (result.data.code && result.data.code == 200) {
            this.$nextTick(() => {
              this.$refreshPage('/personnel')
              this.departmentId = ''
              this.$refs.table.refresh()
              this.$message.success(result.data.msg)
              this.insertVisible = false
              this.$refs.insertForm?.resetFields()
     })
          } else {
            this.$message.error(result.data.msg)
          }
        }
      })
    },
    insertFormCancel () {
      this.insertVisible = false
      this.departmentId = ''
    },
    async getStaff () {
      const result = await getStaffList().catch((error) => { throw new Error(error) })

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

    async setDefault (record) {
      const result = await setDefault({
        id: record.id
      }).catch((error) => { throw new Error(error) })
      this.$refs.table.refresh()
      oftenMessage(true, result.data.msg)
    },
    // 修改
    async showModify (record) {
      this.isModify = true
      this.isLeader = record.isLeader
      await this.getAvailableDepartmentTree().catch((error) => { throw new Error(error) })
      this.selectedKey = record.departmentId
      this.getDepartmentTreeData()
      this.getStaff()
      this.editPositionId = record.positionId
      this.editDepartmentId = record.departmentId
      this.editId = record.id
      this.modifyVisible = true
    },
    modifyFormOk () {
      this.$refs.modifyForm.validate().then(async (values) => {
        const newParams = {
          ...values,
          employeeId: this.$route.query.id,
          departmentId: this.departmentId || this.selectedKey,
          id: this.editId
        }
        if (true) {
          const result = await empDeptEdit(newParams).catch((error) => { throw new Error(error) })
          if (result.data.code && result.data.code == 200) {
            this.$nextTick(() => {
              this.$refreshPage('/personnel')
              this.$refs.table.refresh()
              this.departmentId = ''
              this.modifyVisible = false
              this.$message.success(result.data.msg)
              this.$refs.modifyForm?.resetFields()
              this.isModify = false
     })
          } else {
            this.$message.error(result.data.msg)
          }
        }
      })
    },
    modifyFormCancel () {
      this.modifyVisible = false
      this.$refs.modifyForm?.resetFields()
      this.departmentId = ''
      this.isModify = false
      this.selectedKey = ''
    },
    // 监控是否有效变化
    onChange (checked) {
      this.isChecked = checked
      // console.log('isChecked', this.isChecked)
    },
    // 修改是否有效
    modifyOk (record) {
      console.log('click', record.id, this.isChecked)
    },
    toRelation (record) {
      console.log(record.id)
    },
    // 新增
    async showInsert () {
      await this.getAvailableDepartmentTree().catch((error) => { throw new Error(error) })
      this.getDepartmentTreeData()
      this.getStaff()
      this.insertVisible = true
    },
    initTableData: async function (params) {
      // 请求接口
      const newParam = {
        pageNum: params.pageNo,
        pageSize: params.pageSize,
        orderColumns: [{
          columnName: '',
          isAsc: true
        }],
        param: {
          employeeId: this.$route.query.id,
          departmentName: params.departmentName,
          positionName: params.positionName
        }
      }
      const result = await getEmpDeptPage(newParam).catch((error) => { throw new Error(error) })
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
    }
  }
}
</script>
<style scoped>
  .tree-wrap {
    padding: 50px 0;
    box-sizing: border-box;
    position: relative;
    height: 100%;
    width: 100%;
    max-height: 800px;
    overflow: auto;
    /* 滚动条 */
  }
  .tree-reload {
    position: absolute;
    right: 20px;
    top: 10px;
    cursor: pointer;
  }
  .inline-block {
    display: inline-block;
  }
</style>
