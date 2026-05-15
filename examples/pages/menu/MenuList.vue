<template>
<div >
  <a-card :bordered="false">
    <a-row>
      <a-col :span="4">
        <div class="tree-wrap">
          <!-- 刷新按钮 -->
          <span class="tree-reload" >
            <a-icon type="reload" @click="refreshTree"/>
          </span>
          <div class="tree-wrap-main" v-if="isFresh">
            <a-tree
              :show-line="true"
              :selected-keys="menuTreeCheckedKeys"
              :default-expanded-keys="menuTreeExpandedKeys"
              :tree-data="menuTreeData"
              @select="onMenuSelect"
            >
            </a-tree>
              <!-- <a  @click="showRootModify"   >
            修改菜单
          </a>   <a-divider type="vertical" />
          <a-popconfirm title="确定删除?" @confirm="() => deleteRootById()" >
          <a href="javascript:;"  >删除菜单</a>
          </a-popconfirm>

            <a-divider type="vertical" />
            <a  @click="insertRootById"  >
            新增菜单
          </a> -->
            <!-- <a-switch checked-children="是" un-checked-children="否" @change="onStatusRootChange($event)" :default-checked="this.rootStatus==1" v-show="this.rootId!=''"/> -->
          </div>
        </div>
      </a-col>
      <a-col :span="20">
        <at-table
          ref="menuTable"
          rowKey="id"
          :columns="menuListTableColumns"
          tableKey="personnel"
          :showPagination="true"
          :data="initTableData"
          bordered
          :search=true
          :drag=true
        >
          <div slot="toolBarRender">
            <div>
              <a-button :loading="menuAddBtnLoading" :disabled="menuAddDisable" type="primary"  @click="showInsert">
                新增
              </a-button>
              <small class="menu_add_tip" v-show="menuAddDisable">注：系统名称仅用于分类，不可直接在系统名称下创建子菜单，如需根据系统分类创建菜单，请直接选中“所有菜单”进行创建。</small>
            </div>
          </div>
          <span slot="resource" slot-scope="text, record">
              <a @click="toResource(record)">{{record.resource}}</a>
          </span>
          <span slot="isValid" slot-scope="text, record">
              <a-switch checked-children="是" un-checked-children="否" @change="onStatusChange($event,record)" :default-checked="record.status==1" v-if="record.count>0" disabled/>
              <a-switch checked-children="是" un-checked-children="否" @change="onStatusChange($event,record)" :default-checked="record.status==1" v-else/>
          </span>
          <span slot="operation" slot-scope="text, record">
            <a @click="showModify(record)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定删除?" @confirm="() => deleteById(record)" >
              <a href="javascript:;" :disabled="record.count>0" >删除</a>
              </a-popconfirm>
          </span>
        </at-table>
      </a-col>
    </a-row>
    <!-- <menu-edit :visible="modalVisible"
      width="70%"
      :title="modalTitle"
      @resetVisible="resetEditFormVisible"
    /> -->
    <a-modal
      title="新增菜单"
      :visible="insertVisible"
      @ok="insertFormOk"
      @cancel="insertFormCancel"
      width=1450px
      :destroyOnClose=true
    >
    <a-form   ref="modifyForm">
    <a-row :gutter="20">
      <a-col :span="8">
        <a-form-item label="是否始终显示" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-select style="width: 300px"  v-model:value="formModel.alwaysShow" disabled>
            <a-select-option :value=1>
              是
            </a-select-option>
            <a-select-option :value=0>
              否
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="是否不在菜单树显示" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-select style="width: 300px"  v-model:value="formModel.hidden" disabled>
            <a-select-option :value=1>
              是
            </a-select-option>
            <a-select-option :value=0>
              否
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="菜单图标" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-input style="width:300px;"
            v-model:value="formModel.icon"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="排序号" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-input-number  :min=1  style="width:300px;"
          v-model:value="formModel.sortNum"/>
        </a-form-item>
      </a-col>
      <a-col :span="8" v-if="this.isMenuInsert==false">
        <a-form-item   label="父级菜单" :label-col="{ span: 8 }" :wrapper-col="{ span:12 }" >
          <a-select style="width:300px;"
            v-model:value="formModel.parentId"
            show-search
            option-filter-prop="children"
            disabled
          >
            <a-select-option :value=-1 >
              所有菜单
            </a-select-option>
            <a-select-option v-for="item in menuList" :key="item.id" :value="item.id">
              {{item.menuName}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="菜单名称" :label-col="{ span:8 }" :wrapper-col="{ span: 12 }">
          <a-input style="width:300px;"
            v-model:value="formModel.menuName"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="标题" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-input style="width:300px;"
            v-model:value="formModel.title"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="页面路径" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-input style="width:300px;"
            v-model:value="formModel.path"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="组件路径" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-input style="width:300px;"
            v-model:value="formModel.component"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="重定向路径" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-input style="width:300px;"
            v-model:value="formModel.redirect"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8" v-if="this.isMenuInsert==false">
        <a-form-item label="模块名称" :label-col="{ span: 8 }" :wrapper-col="{ span:12 }" >
          <a-select style="width:300px;"
            v-model:value="formModel.moduleId"
            show-search
            option-filter-prop="children"
            :disabled="Boolean(treeSelectedModuleId)"
          >
            <a-select-option v-for="item in moduleList" :key="item.id" :value="item.id.toString()">
              {{item.moduleName}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>

    </a-row>

    </a-form>
    </a-modal>
    <a-modal
      title="修改菜单"
      :visible="modifyVisible"
      @ok="modifyFormOk"
      @cancel="modifyFormCancel"
      width=1450px
    >
    <a-form   ref="insertForm">
    <a-row :gutter="20">
      <a-col :span="8">
        <a-form-item label="是否始终显示" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-select style="width: 300px"  v-model:value="formModel.alwaysShow">
            <a-select-option :value=1>
              是
            </a-select-option>
            <a-select-option :value=0>
              否
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="是否不在菜单树显示" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-select style="width: 300px"  v-model:value="formModel.hidden">
            <a-select-option :value=1>
              是
            </a-select-option>
            <a-select-option :value=0>
              否
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="菜单图标" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-input style="width:300px;"
            v-model:value="formModel.icon"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="排序号" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-input-number  style="width:300px;" :min=1
            v-model:value="formModel.sortNum"/>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="菜单名称" :label-col="{ span:8 }" :wrapper-col="{ span: 12 }">
          <a-input style="width:300px;"
            v-model:value="formModel.menuName"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="标题" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-input style="width:300px;"
            v-model:value="formModel.title"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="页面路径" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-input style="width:300px;"
            v-model:value="formModel.path"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="组件路径" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-input style="width:300px;"
            v-model:value="formModel.component"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="重定向路径" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-input style="width:300px;"
            v-model:value="formModel.redirect"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8" v-if="this.isMenuInsert==false">
        <a-form-item label="模块名称" :label-col="{ span: 8 }" :wrapper-col="{ span:12 }" >
          <a-select style="width:300px;"
            v-model:value="formModel.moduleId"
            show-search
            option-filter-prop="children"
            disabled
          >
            <a-select-option v-for="item in moduleList" :key="item.id" :value="item.id">
              {{item.moduleName}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    </a-form>
    </a-modal>
  </a-card>
</div>
</template>

<script>
import {
  getMenuByPage,
  getMenuTree,
  disableMenu, enableMenu, addMenu, modifyMenu, deleteMenu
} from '@/services/menu/menuList'
import { getMenuList, getModuleList } from '@/services/roleList/roleList'
import { menuListTableColumns } from './utils/tableContent'
import { oftenMessage } from '@/utils/contextApi'
import debounce from 'lodash/debounce'
export default {
  name: 'ContractCompleted',
  components: {
  },
  data () {
    return {
      menuTreeCheckedKeys: [],
      menuTreeData: [],
      menuTreeExpandedKeys: [],
      menuListTableColumns,
      modifyForm: null,
      isChecked: true,
      insertForm: null,
      modifyVisible: false,
      isFresh: true,
      menuList: '',
      insertVisible: false,
      // 修改表单的默认值
      defaultData: '',
      // 记录 菜单树中选择的菜单的id
      rootId: '',
      // 记录 根据菜单树选中菜单的id查询该菜单详情
      rootData: '',
      // 判断是否是菜单树中的新增
      isMenuInsert: '',
      parentMenu: null,
      parentId: -1,
      onCheckedKey: -1,
      onExpandedKeys: '',
      selectedNodeProps: '',
      moduleList: [],
      menuAddDisable: false,

      modalVisible: false,
      modalTitle: '新增菜单',
      // 选中树节点所属系统模块
      treeSelectedModuleId: null,
      menuAddBtnLoading: false
    }
  },
  async created () {
    const result = await getMenuList().catch((error) => { throw new Error(error) })
    if (result.data.code && result.data.code === 200) {
      this.menuList = result.data.data
    } else {
      this.$message.error(result.data.msg)
    }
    await this.initModuleList().catch((error) => { throw new Error(error) })
  },
  methods: {
    initTreeSelectData ({ selectKeys = [], expandedKeys = [], parentMenu = {} }) {
      this.menuTreeCheckedKeys = selectKeys
      this.menuTreeExpandedKeys = expandedKeys
      this.parentMenu = parentMenu
    },
    // 菜单树中的删除方法
    async deleteRootById () {
      const result = await deleteMenu({ id: this.rootData.id }).catch((error) => { throw new Error(error) })
      if (result.data.code && result.data.code == 200) {
        this.$message.success(result.data.msg)
        this.refreshTree()
        this.$refs.menuTable.refresh()
      } else {
        this.$message.error(result.data.msg)
      }
    },
    // 列表操作列中的删除方法
    async deleteById (record) {
      const result = await deleteMenu({ id: record.id }).catch((error) => { throw new Error(error) })
      if (result.data.code && result.data.code == 200) {
        this.$message.success(result.data.msg)
        this.refreshTree()
        this.$refs.menuTable.refresh()
      } else {
        this.$message.error(result.data.msg)
      }
    },
    async initModuleList () {
      const moduleResult = await getModuleList().catch((error) => { throw new Error(error) })
      if (moduleResult.data.code && moduleResult.data.code === 200) {
        this.moduleList = moduleResult.data.data
      } else {
        this.$message.error(moduleResult.data.msg)
      }
    },
    async showInsert () {
      this.menuAddBtnLoading = true
      await this.initModuleList().catch((error) => { throw new Error(error) })
      this.menuAddBtnLoading = false
      this.insertVisible = true
    },
    resetEditFormVisible () {
      this.modalVisible = false
    },
    insertFormOk () {
      this.$refs.insertForm.validate().then(async (values) => {
        // 判断是否是菜单树上的新增
          const result = await addMenu({ parentId: this.rootId, ...values } || values).catch((error) => { throw new Error(error) })
          if (result.data.code && result.data.code == 200) {
            this.$message.success(result.data.msg)
            this.$nextTick(() => {
              this.$refs.insertForm?.resetFields()
              this.refreshTree()
              this.$refs.menuTable.refresh()
              this.insertVisible = false
              this.isMenuInsert = ''
       }
     })
          } else {
            this.$message.error(result.data.msg)
          }
        }
      })
    },
    insertFormCancel () {
      this.insertVisible = false
      this.isMenuInsert = ''
    },
    insertRootById () {
      this.insertVisible = true
      this.isMenuInsert = true
    },
    modifyFormOk () {
      this.$refs.modifyForm.validate().then(async (values) => {
        // 判断是否是菜单树上的修改
          const result = await modifyMenu({ id: this.defaultData.id || this.rootData.id, ...values }).catch((error) => { throw new Error(error) })
          if (result.data.code && result.data.code == 200) {
            this.$message.success(result.data.msg)
            this.$nextTick(() => {
              this.rootId = ''
              this.$refs.modifyForm?.resetFields()
              this.$refs.menuTable.refresh()
              this.refreshTree()
              this.modifyVisible = false
       }
     })
          } else {
            this.$message.error(result.data.msg)
          }
        }
      })
    },
    modifyFormCancel () {
      this.$refs.modifyForm?.resetFields()
      this.modifyVisible = false
    },
    // 初始化菜单树数据
    getMenuTreeData: async function () {
      const result = await getMenuTree().catch((error) => { throw new Error(error) })
      const menuTreeList = this.formatTreeData(result.data.data)
      const rootTreeDate = {
        key: -1,
        id: -1,
        title: '所有菜单',
        ancestor: '-1',
        children: menuTreeList
      }
      this.menuTreeData = [rootTreeDate]
      const initDefaultSelectNode = rootTreeDate
      // this.parentId = -1
      if (this.onCheckedKey == -1) {
        this.initTreeSelectData({
          selectKeys: [initDefaultSelectNode.key],
          expandedKeys: [initDefaultSelectNode.key],
          parentMenu: {
            menuName: initDefaultSelectNode.menuName,
            id: initDefaultSelectNode.id
          }
        })
      } else {
        this.initTreeSelectData({
          selectKeys: this.onCheckedKey,
          expandedKeys: this.onExpandedKeys,
          parentDepartment: {
            departmentName: this.selectedNodeProps.menuName,
            id: this.selectedNodeProps.id
          }
        })
      }
      // if (isFresh) {
      //   this.$refs.menuTable.refresh(false, {
      //     parentId: this.onCheckedKey[0]
      //   })
      // }
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
        this.$message.success('菜单树刷新成功')
    }
  })
    }, 1000),
    // 菜单树节点被选事件
    onMenuSelect (selectKeys, e) {
      if (e.selected) {
        const selectedNodeProps = e.selectedNodes[0]?.data.props
        this.treeSelectedModuleId = selectedNodeProps.moduleId ? selectedNodeProps.moduleId : null
        const tableParams = {}
        if (selectedNodeProps.ancestor === '') {
          tableParams.moduleId = selectedNodeProps.moduleId
          this.menuAddDisable = true
        } else {
          tableParams.parentId = selectKeys[0]
          this.menuAddDisable = false
        }
        const expandedKeys = [...selectedNodeProps.ancestor.split(',')].map(Number)
        this.onCheckedKey = selectKeys
        this.onExpandedKeys = expandedKeys
        this.selectedNodeProps = selectedNodeProps
        this.parentId = selectedNodeProps.id
        this.initTreeSelectData({
          selectKeys,
          expandedKeys,
          parentMenu: {
            menuName: selectedNodeProps.menuName,
            id: selectedNodeProps.id
          }
        })
        this.$refs.menuTable.refresh(false, {
          ...tableParams
          // moduleId: this.getModuleKey(e.node)
     }
   })
      }
    },
    // 检测节点是否为第二层
    checkPos (pos) {
      let count, i
      count = 0
      for (i = 0; i < pos?.length; i++) {
        if (pos.substring(i, i + 1) == '-') {
          count = count + 1
        }
      }
      return count == 2
    },
    // 获取系统id
    getModuleKey (node) {
      if (this.checkPos(node.pos)) {
        return node.dataRef.key
      } else {
        return this.getModuleKey(node.$parent)
      }
    },
    showModify (record) {
      this.modifyVisible = true
      this.defaultData = record
    },
    showRootModify () {
      this.modifyVisible = true
    },
    // 监控是否有效变化
    onStatusChange: async function (checked, record) {
      if (checked) {
        const result = await enableMenu({ id: record.id || this.rootId }).catch((error) => { throw new Error(error) })
        oftenMessage(result.data.data, result.data.msg)
        this.$refreshPage('/functionOption')
      } else {
        const result = await disableMenu({ id: record.id || this.rootId }).catch((error) => { throw new Error(error) })
        oftenMessage(result.data.data, result.data.msg)
        this.$refreshPage('/functionOption')
      }
    },
    toResource (record) {
      this.$router.push({
        name: '资源列表',
        query: {
          id: record.id
        }
      })
    },
    initTableData: async function (params) {
      if (this.menuTreeData.length == 0) await this.getMenuTreeData().catch((error) => { throw new Error(error) })
      const result = await getMenuByPage({
        orderColumns: [],
        pageNum: params.pageNo,
        pageSize: params.pageSize,
        param: {
          parentId: params.parentId,
          menuName: params.menuName,
          moduleId: params.moduleId
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
<style lang="less" scoped>
.menu_add_tip{
  vertical-align: bottom;
  margin: 0 0 0 5px;
  color: @primary-color;
}
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
