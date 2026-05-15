<template>
<div >
  <a-card :bordered="false">
    <at-table
      ref="table"
      rowKey="id"
      :columns="roleFunctionListTableColumns"
      tableKey="roleFunction"
      :data="initTableData"
      bordered
      :search="true"
      :drag="true"
    >
      <div slot="toolBarRender" >
        <div>
          <a-button type="primary"  @click="showInsert">
            配置权限
          </a-button>
        </div>
      </div>
      <span slot="authorize" slot-scope="text, record">
        <a-switch  @change="onChange"  default-checked  @click="modifyOk(record)"  />
      </span>
    </at-table>
    <a-modal
      title="配置功能权限"
      :visible="insertVisible"
      @ok="handleInsertOk"
      @cancel="handleInsertCancel"
      width=450px
      :destroyOnClose=true
    >
      <a-form   ref="insertForm">
          <a-form-item   label="数据对象" :label-col="{ span: 6 }" :wrapper-col="{ span:15 }">
          <div class="tree-wrap">
          <!-- 刷新按钮 -->
          <span class="tree-reload" >
            <a-icon type="reload" @click="refreshTree"/>
          </span>
          <div class="tree-wrap-main" v-if="isFresh">
            <a-tree
              checkable
              v-model:value="formModel.menuId"
              :show-line="true"
              :selected-keys="menuTreeCheckedKeys"
              :default-expanded-keys="menuTreeExpandedKeys"
              :tree-data="menuTreeData"
              @select="onMenuSelect"
              @check="onCheck"
              :default-checked-keys="this.checkedOptions"
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
import { roleFunctionListTableColumns } from '@/pages/role/utils/tableContent'
import { getRoleMenuListWithModule, getMenuList, getCurrentRoleMenuListWithModule, addRelaRoleMenu } from '@/services/roleList/roleList'
import { message } from '@/utils/contextApi'
import debounce from 'lodash/debounce'
let that
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
      pagination,
      roleFunctionListTableColumns,
      insertForm: null,
      isChecked: true,
      value: 'Apple',
      insertVisible: false,
      menuList: '',
      menuTreeCheckedKeys: [],
      menuTreeData: [],
      isFresh: true,
      menuTreeExpandedKeys: [],
      checkedTrees: [],
      // 包含父节点id
      allCheckedTrees: [],
      checkedOptions: [],
      menuTreeList: []
    }
  },
  async created () {
    that = this
    this.getMenuTreeData()
    const result = await getMenuList().catch((error) => { throw new Error(error) })
    if (result.data.code && result.data.code === 200) {
      const {
        pageNum, pageSize, pages, total
      } = result.data.data
      this.menuList = result.data.data
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
    }
  })
    }
  },
  methods: {
    onCheck (checkedKeys, e) {
      // 在选中的key中加入父节点的key
      const set = new Set([...checkedKeys, ...e.halfCheckedKeys])
      this.checkedTrees = checkedKeys
      this.checkedOptions = [...set].map(Number)
      this.allCheckedTrees = [...set].map(Number)
      // this.checkedOptions = info.halfCheckedKeys.concat(checkedKeys).filter(item => item > 0)
      // console.log(this.allCheckedTrees)
    },
    initTreeSelectData ({ selectKeys = [], expandedKeys = [], parentMenu = {} }) {
      this.menuTreeCheckedKeys = selectKeys
      this.menuTreeExpandedKeys = expandedKeys
      this.parentMenu = parentMenu
    },
    traverse (obj, needChecked) {
      for (const i in obj) {
        if (obj[i].children) {
          this.traverse(obj[i].children, true)
          // 如果有子级 即为某个子级的父级 遍历其子级 如果所有子级的isRoleMenu均为true 才将该父级加入checkedOptions数组
          if (obj[i].isRoleMenu == true && obj[i].children.map.isRoleMenu == true && needChecked == true) {
            // 在没有任何操作的情况下保留从服务器同步到的状态，包括父节点，提交给服务器的节点需要包含父节点
            const allSet = new Set([...this.allCheckedTrees, obj[i].id, ...obj[i].ancestor.split(',').map(Number), obj[i].moduleId])
            // 在没有任何操作的情况下保留从服务器同步到的状态，不包括父节点，如果包含父节点，父节点下所有节点都会被选中，所以不能包含父节点
            const checkedSet = new Set([...this.checkedOptions, obj[i].id])
            this.allCheckedTrees = [...allSet].map(Number)
            this.checkedOptions = [...checkedSet].map(Number)
          }
        }
        if (obj[i].children == '') {
          delete obj[i].children
          if (obj[i].isRoleMenu == true && needChecked == true) {
            // 在没有任何操作的情况下保留从服务器同步到的状态，包括父节点，提交给服务器的节点需要包含父节点
            const allSet = new Set([...this.allCheckedTrees, obj[i].id, ...obj[i].ancestor.split(',').map(Number), obj[i].moduleId])
            // 在没有任何操作的情况下保留从服务器同步到的状态，不包括父节点，如果包含父节点，父节点下所有节点都会被选中，所以不能包含父节点
            const checkedSet = new Set([...this.checkedOptions, obj[i].id])
            this.allCheckedTrees = [...allSet].map(Number)
            this.checkedOptions = [...checkedSet].map(Number)
          }
        }
      }
    },

    // 初始化菜单树数据
    getMenuTreeData: async function (isFresh = false) {
      const result = await getRoleMenuListWithModule(that.$route.query.id).catch((error) => { throw new Error(error) })
      this.menuTreeList = this.formatTreeData(result.data.data)
      const rootTreeDate = {
        key: -1,
        id: -1,
        title: '所有菜单',
        ancestor: '-1',
        children: this.menuTreeList
      }
      this.menuTreeData = [rootTreeDate]
      const initDefaultSelectNode = rootTreeDate
      this.parentId = -1
      this.initTreeSelectData({
        selectKeys: [initDefaultSelectNode.key],
        expandedKeys: [initDefaultSelectNode.key],
        parentMenu: {
          menuName: initDefaultSelectNode.menuName,
          id: initDefaultSelectNode.id
        }
      })
      if (isFresh) {
        this.$refs.table.refresh(false, {
          parentId: -1
     }
   })
      }
    },
    // 格式化树组件的数据
    formatTreeData (treeData) {
      return treeData.map((item) => {
        item.title = item.menuName
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
      this.rootId = ''
      this.$nextTick(async () => {
        this.isFresh = true
        await this.getMenuTreeData(true).catch((error) => { throw new Error(error) })
        this.$message.success('刷新成功')
    }
  })
    }, 1000),
    // 菜单树节点被选事件
    onMenuSelect (selectKeys, e) {
      if (e.selected) {
        const selectedNodeProps = e.selectedNodes[0].data.props
        const expandedKeys = [...selectedNodeProps.ancestor.split(',')].map(Number)
        // expandedKeys.splice(0, 1)
        // console.log(selectedNodeProps.id)
        this.parentId = selectedNodeProps.id
        this.initTreeSelectData({
          selectKeys,
          expandedKeys,
          parentMenu: {
            menuName: selectedNodeProps.menuName,
            id: selectedNodeProps.id
          }
        })
      }
    },
    handleInsertOk () {
      this.$refs.insertForm.validate().then(async () => {
        const newParams = {
          menuIds: this.allCheckedTrees,
          roleId: that.$route.query.id
        }
        if (true) {
          const result = await addRelaRoleMenu(newParams).catch((error) => { throw new Error(error) })
          if (result.data.code && result.data.code == 200) {
            this.$message.success(result.data.msg)
            this.$refs.insertForm?.resetFields()
            this.$refs.table.refresh()
            this.menuTreeList = []
            this.checkedOptions = []
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
    async showInsert () {
      await this.getMenuTreeData().catch((error) => { throw new Error(error) })
      this.traverse(this.menuTreeData, true)
      this.insertVisible = true
    },
    // 修改是否有效
    modifyOk () {
      // console.log('click', record.id, this.isChecked)
    },
    // 监控是否有效变化
    onChange (checked) {
      this.isChecked = checked
      // console.log('isChecked', this.isChecked)
    },
    initTableData: async function () {
      const result = await getCurrentRoleMenuListWithModule(that.$route.query.id).catch((error) => { throw new Error(error) })
      if (result.data.code && result.data.code === 200) {
        const {
          pageNum, pageSize, pages, total
        } = result.data.data
        that.pagination = {
          pageNum,
          pageSize
        }
        this.traverse(result.data.data, false)
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
     }
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
