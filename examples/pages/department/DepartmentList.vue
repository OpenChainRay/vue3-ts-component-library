<template>
  <div>
    <a-card :bordered="false">
      <a-row>
        <a-col :span="4">
          <div class="tree-wrap">
            <!-- 刷新按钮 -->
            <span class="tree-reload">
              <a-icon type="reload" @click="refreshTree" />
            </span>
            <div class="tree-wrap-main" v-if="isFresh">
              <a-tree
                :show-line="true"
                :selected-keys="departmentTreeCheckedKeys"
                :default-expanded-keys="departmentTreeExpandedKeys"
                :tree-data="departmentTreeData"
                @select="onDepartmentSelect">
              </a-tree>
            </div>
          </div>
        </a-col>
        <a-col :span="20">
          <at-table ref="departmentTable" rowKey="id" :columns="departmentListTableColumns"
            tableKey="departmentTableKey" :showPagination="true" :data="initTableData" bordered
            :search="true" :drag="true">
            <div slot="toolBarRender">
              <div>
                <a-button type="primary" @click="showAddForm">
                  新增
                </a-button>
              </div>
            </div>
            <span slot="status" slot-scope="text, record">
              <a-switch checked-children="是" un-checked-children="否" @change="(check,event)=>onStatusChange(check,record,event)"  :default-checked="record.status==1" v-if="record.employeeNum<=0" />
              <a-switch checked-children="是" un-checked-children="否" @change="(check,event)=>onStatusChange(check,record,event)" :default-checked="record.status==1" v-else disabled/>
            </span>
            <span slot="operation" slot-scope="text, record">
              <a @click="showEditForm(record)">修改</a>
            </span>
          </at-table>
        </a-col>
      </a-row>
      <!-- 新增窗-->
      <department-edit v-if="insertVisible" :current-department-id="currentDepartmentId" @refreshTree="refreshTree" :is-edit="isEdit" :title="this.isEdit==true?'修改部门':'新增部门'" @resetVisible="resetEditFormVisible" :visible="insertVisible" width="500px" v-model="parentDepartment" >  </department-edit>
    </a-card>
  </div>
</template>

<script>
// import { AtTable } from 'at-materia'
import { getDepartmentTree, getDepartmentInfo, enableDepartment, disableDepartment } from '@/services/departmentList'
import { departmentListTableColumns } from './utils/tableContent'
import debounce from 'lodash/debounce'
import { oftenMessage } from '@/utils/contextApi'
import DepartmentEdit from './components/DepartmentEdit'
// const { eventBus } = AtTable
export default {
  name: 'DepartmentList',
  components: {
    DepartmentEdit
  },
  data () {
    return {

      departmentTreeData: [],
      departmentTreeCheckedKeys: [],
      departmentTreeExpandedKeys: [],
      departmentListTableColumns,
      statusSwitchChecked: false,
      modifyForm: null,
      insertForm: null,
      // 控制新增面板显示
      insertVisible: false,
      modifyVisible: false,
      isFresh: true,
      parentDepartment: null,
      isEdit: false,
      currentDepartmentId: null,
      onSelectKeys: '',
      onExpandedKeys: '',
      selectedNodeProps: ''
    }
  },
  methods: {

    initTreeSelectData ({ selectKeys = [], expandedKeys = [], parentDepartment = {} }) {
      this.departmentTreeCheckedKeys = selectKeys
      this.departmentTreeExpandedKeys = expandedKeys
      this.parentDepartment = parentDepartment
    },
    // 初始化部门树数据
    getDepartmentTreeData: async function (isFresh = false) {
      const newParams = {
        showInvalid: true
      }
      const result = await getDepartmentTree(newParams).catch((error) => { throw new Error(error) })
      const departmentTreeList = this.formatTreeData(result.data.data)
      const rootTreeDate = {
        key: -1,
        id: -1,
        title: '所有部门',
        ancestor: '-1',
        children: departmentTreeList
      }
      this.departmentTreeData = [rootTreeDate]
      const initDefaultSelectNode = rootTreeDate
      // this.departmentTreeData = departmentTreeList
      if (this.onSelectKeys == 0) {
        this.initTreeSelectData({
          selectKeys: [initDefaultSelectNode.key],
          expandedKeys: [initDefaultSelectNode.key],
          parentDepartment: {
            departmentName: initDefaultSelectNode.departmentName,
            id: initDefaultSelectNode.id
          }
        })
      } else {
        this.initTreeSelectData({
          selectKeys: this.onSelectKeys,
          expandedKeys: this.onExpandedKeys,
          parentDepartment: {
            departmentName: this.selectedNodeProps.departmentName,
            id: this.selectedNodeProps.id
          }
        })
      }
      if (isFresh) {
        this.$refs.departmentTable.refresh(false, {
          parentId: departmentTreeList[0].key
     }
   })
      }
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
    }
  })
    },
    // 刷新分类树
    refreshTree: debounce(function () {
      // 销毁 重新渲染
      this.isFresh = false
      this.$nextTick(async () => {
        this.isFresh = true
        await this.getDepartmentTreeData(true).catch((error) => { throw new Error(error) })
        this.$message.success('部门树已刷新')
    }
  })
    }, 1000),
    // 部门树节点被选事件
    onDepartmentSelect (selectKeys, e) {
      if (e.selected) {
        const selectedNodeProps = e.selectedNodes[0].data.props
        // this.selectedNodes = e.selectedNodes[0].data.props
        // const selectedNodeProps = e.selectedNodes[0]._props.dataRef

        const expandedKeys = [...selectedNodeProps.ancestor.split(',')].map(Number)

        // expandedKeys.splice(0, 1)
        this.onSelectKeys = selectKeys
        this.onExpandedKeys = expandedKeys
        this.selectedNodeProps = selectedNodeProps
        this.initTreeSelectData({
          selectKeys,
          expandedKeys,
          parentDepartment: {
            departmentName: selectedNodeProps.departmentName,
            id: selectedNodeProps.id
          }
        })
        this.$refs.departmentTable.refresh(false, {
          parentId: selectKeys[0]
     }
   })
      }
    },
    // 表格内部门是否有效 switch change
    onStatusChange: async function (checked, record) {
      if (checked) {
        const result = await enableDepartment(record.id).catch((error) => { throw new Error(error) })
        oftenMessage(result.data.data, result.data.msg)
      } else {
        const result = await disableDepartment(record.id).catch((error) => { throw new Error(error) })
        oftenMessage(result.data.data, result.data.msg)
      }
    },
    showEditForm (record) {
      this.currentDepartmentId = record.id
      this.isEdit = true
      this.insertVisible = true
    },
    showAddForm () {
      this.isEdit = false
      this.insertVisible = true
    },
    resetEditFormVisible () {
      this.insertVisible = false
    },
    initTableData: async function (params) {
      if (this.departmentTreeData.length == 0) await this.getDepartmentTreeData().catch((error) => { throw new Error(error) })
      const result = await getDepartmentInfo({
        orderColumns: [],
        pageNum: params.pageNo,
        pageSize: params.pageSize,
        param: {
          parentId: params.id || this.departmentTreeCheckedKeys[0],
          departmentName: params.departmentName
              }).catch((error) => { throw new Error(error) })
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
