<template>
  <div>
    <!-- 刷新按钮 -->
    <div class="tree-reload" @click="refreshTree"><a-icon type="reload" /></div>
    <div class="tree-wrap">
      <div class="tree-wrap-main" v-if="isFresh">
        <div v-if="checkable==false">
          <a-tree
            v-if="loadTree"
            ref="treeRef"
            :show-line="true"
            :expanded-keys="expandedKeys"
            :default-expanded-keys="defaultExpandedKeys"
            :default-selected-keys="defaultValue"
            :load-data="onLoadData"
            :tree-data="treeData"
            @select="selectHandle"
            @expand="expandFunction"
          />
        </div>
        <div v-else>
          <a-tree
            :show-line="true"
            v-if="loadTree"
            checkable
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :default-checked-keys = "defaultValue"
            :tree-data="treeData"
            @expand="onExpand"
            @select="selectHandle"
            @check="onCheck"
            :replaceFields="replaceFields"
          />

        </div>

      </div>
    </div>
  </div>
</template>
<script>
import { getProductTreeList, getProductTreeNode, getProductFatherEnableNode, getProductFatherNode, getProductTreeEnableNode, getProductParent, getProductEnableParent } from './utils/productClassify'
import { getMallPageNode, getMallPageEnableNode, getMallFatherNode, getMallFatherEnableNode, getMallParent, getMallEnableParent } from './utils/mallClassify'
import debounce from 'lodash/debounce'
const PRODUCT_TYPE = 1
const MALL_TYPE = 2
export default {
  name: 'treeComponent',
  data () {
    return {
      isFresh: true, // 刷新
      treeData: [], // 树形数据
      expandedKeys: [], // 展开节点
      defaultExpandedKeys: [], // 默认展开节点
      loadTree: false, // 树根源数据是否加载完成
      checkedKeys: [],
      autoExpandParent: true,
      checkedTrees: [], // 包含父节点id
      allCheckedTrees: [],
      checkedOptions: [],
      replaceFields: { title: 'categoryName', key: 'categoryCode' }
    }
  },
  props: {
    // 选中节点key
    defaultValue: {
      type: Array,
      required: false
    },
    // 选中节点 id
    initTreeNodeId: {
      required: false,
      default: 1
    },
    // 选择回电
    selectCallback: {
      type: Function,
      required: false
    },
    // 树类型 PRODUCT_TYPE = 1 MALL_TYPE = 2
    treeType: {
      type: Number,
      required: true
    },
    showDisabled: {
      required: false,
      default: true
    },
    checkable: {
      required: false,
      default: false
    }

  },
  computed: {},
  components: {},
  mounted () {},
  async created () {
    await this.renderDate()
  },
  methods: {
    // 展开/收起节点时触发
    // 展开时expandedKeys为当前展开的节点和父级节点信息，收起时为当前收起节点的父级节点信息
    // e.node.dataRef.key为当前操作的节点
    // 展开操作时index为-1，收起操作时index为树的level
    expandFunction (expandedKeys, e) {
      const { node } = e
      const key = node.dataRef.key
      const index = this.expandedKeys.indexOf(key)
      // 展开树结构
      if (node.expanded == false && index == -1) {
        const parentCodes = [...node.dataRef.parentCodes, node.dataRef.key]
        this.expandedKeys = parentCodes
        // 收缩树
      } else if (node.expanded == true && index >= 0) {
        this.expandedKeys = this.expandedKeys.filter((ele) => {
          return !ele.includes(key)
        })
      }
    },
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys, e) {
      console.log(e)
      const checkedNodes = e.checkedNodes
      const checkedForthNodes = []
      checkedNodes.forEach(node => {
        const detail = node.data.props
        if (detail.level == 4) {
          checkedForthNodes.push(detail)
        }
      })

      // 在选中的key中加入父节点的key
      const set = new Set([...checkedKeys, ...e.halfCheckedKeys])
      this.checkedTrees = checkedKeys
      this.checkedOptions = [...set]
      this.allCheckedTrees = [...set]
      this.$emit('check', checkedForthNodes, this.allCheckedTrees)
    },

    selectHandle (selectedKeys, e) {
      const { node } = e
      const detail = node.dataRef.detail
      const key = node.dataRef.key
      const index = this.expandedKeys.indexOf(key)
      // 展开树结构
      if (node.expanded == false && index == -1) {
        const parentCodes = [...node.dataRef.parentCodes, node.dataRef.key]
        this.expandedKeys = parentCodes
      }
      this.$emit('select', selectedKeys, e, detail)
    },
    checkHandle (checkedKeys, e) {
      this.checkedKeys = checkedKeys
      this.$emit('check', checkedKeys, e)
    },
    // 渲染数据
    async renderDate () {
      // 清空原数据数据 判断是懒加载还是全加载
      this.treeData = []
      if (this.checkable) {
        await this.getTree()
      } else {
        if (this.initTreeNodeId == 1) {
          await this.lazyLoadTreeInitData()
          this.loadTree = true
        } else {
          await this.getTreeWithChoose(this.initTreeNodeId)
        }
      }
    },
    // 刷新树
    refreshTree: debounce(function () {
      this.treeData = []
      this.loadTree = false
      // 销毁 重新渲染
      this.isFresh = false
      this.$nextTick(() => {
        this.isFresh = true
        if (this.initTreeNodeId == 1) {
          this.lazyLoadTreeInitData()
          this.loadTree = true
        } else {
          this.getTreeWithChoose(this.initTreeNodeId)
        }
        this.lazyLoadTreeInitData()
        this.$antmessage.success('刷新')
      })
    }, 500),

    // 全加载
    // 查询父级
    async getTree () {
      this.loadTree = false
      // 判断类型 调用不同查询父级接口
      const { data } = await getProductTreeList().catch((error) => { throw new Error(error) })
      if (data.code == 200) {
        const nodeList = data.data
        const expendList = []
        if (nodeList && nodeList.length > 0) {
          this.treeData = nodeList
          nodeList.forEach((item) => {
            expendList.push(item.categoryCode)
          })
          this.defaultExpandedKeys = [...expendList]
          this.expandedKeys = [...expendList]
        }
        this.checkedTrees = []

        this.loadTree = true
      } else {
        this.$antmessage.error(data.msg, 3)

        this.loadTree = true
      }
    },

    /**
     * 查询该节点所涉及的树节点
     * @param id 所选择节点id
     * */
    async getTreeWithChoose (id) {
      let queryFunction
      // 判断类型 调用不同接口
      if (this.treeType == PRODUCT_TYPE) {
        if (this.showDisabled) {
          queryFunction = getProductParent
        } else {
          queryFunction = getProductEnableParent
        }
      } else if (this.treeType == MALL_TYPE) {
        if (this.showDisabled) {
          queryFunction = getMallParent
        } else {
          queryFunction = getMallEnableParent
        }
      }
      // 获取该节点的详情及子节点
      const { data } = await queryFunction(id).catch((error) => { throw new Error(error) })
      if (data.code == 200) {
        const list = data.data
        let node = {}
        if (list) {
          // 返回数据若大于1 则为其子节点
          if (list.length >= 1) {
            // 返回数据第一位为该节点详情
            node = this.formatDataToTreeData(list[0])
            const child = []
            for (let i = 1; i < list.length; i++) {
              const childNode = this.formatDataToTreeData(list[i], null)
              child.push(childNode)
            }
            node.children = child
            // 该节点需要的展开的节点
            const expandList = []
            if (node.detail.level < 4) {
              expandList.push(node.key)
            }
            // 如果所选择的节点不是根节点则递归查询到根节点
            if (node.detail.parentId != -1) {
              await this.findFather(node, expandList)
            }
          }
        }
      } else {
        this.$antmessage.error(data.msg, 3)
      }
    },
    /**
     * 寻找节点的父节点,并把父接节点默认展开
     * @param node 当前节点
     * @param expandList 所需要展开的节点
     * */
    async findFather (node, expandList) {
      let queryFunction
      // 判断类型 调用不同接口
      if (this.treeType == PRODUCT_TYPE) {
        if (this.showDisabled) {
          queryFunction = getProductParent
        } else {
          queryFunction = getProductEnableParent
        }
      } else if (this.treeType == MALL_TYPE) {
        if (this.showDisabled) {
          queryFunction = getMallParent
        } else {
          queryFunction = getMallEnableParent
        }
      }
      // 获取改该节点级子节点
      const { data } = await queryFunction(node.detail.parentId).catch((error) => { throw new Error(error) })
      if (data.code == 200) {
        const list = data.data
        let fatherNode = {}
        if (list && list.length >= 1) {
          fatherNode = this.formatDataToTreeData(list[0])
          const fatherKey = fatherNode.key
          if (list.length > 1) {
            const child = []
            for (let i = 1; i < list.length; i++) {
              const childNode = this.formatDataToTreeData(list[i])
              child.push(childNode)
            }
            fatherNode.children = child
            for (let i = 0; i < fatherNode.children.length; i++) {
              if (fatherNode.children[i].id == node.detail.id) {
                fatherNode.children[i] = node
              }
            }
          }

          if (list.length > 1 && fatherNode.detail.id != 1) {
            expandList.push(fatherKey)
            await this.findFather(fatherNode, expandList)
          } else {
            expandList.push(fatherKey)
            this.formatChildParentCode(fatherNode, [])
            this.treeData = [fatherNode]
            this.defaultExpandedKeys = [...expandList]
            this.expandedKeys = [...expandList]
            // 数据渲染结束 渲染树结构
            // 若先渲染则 defaultExpandedKeys 属性无效
            this.loadTree = true
          }
        }
      } else {
        this.$antmessage.error(data.msg, 3)
      }
    },
    formatChildParentCode (node, pKeys) {
      if (node.children != null && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          const keys = [...pKeys, node.key]
          node.children[i].parentCodes = keys
          if (node.children[i].children != null && node.children[i].children.length > 0) {
            this.formatChildParentCode(node.children[i], node.children[i].parentCodes)
          }
        }
      }
    },
    /**
     * 异步数据加载-父节点查询
     * */
    async lazyLoadTreeInitData () {
      const queryFunction = this.getQueryFunction()
      if (queryFunction) {
        // 调用接口，加载下级节点数据
        const { data } = await queryFunction().catch((error) => { throw new Error(error) })
        if (data.code == 200) {
          const nodeList = data.data
          const expendList = []
          const list = []
          // 格式化节点数据
          if (nodeList && nodeList.length > 0) {
            nodeList.forEach((item) => {
              const node = this.formatDataToTreeData(item)
              list.push(node)
              expendList.push(node.key)
            })
            this.defaultExpandedKeys = [...expendList]
            this.expandedKeys = [...expendList]
            this.treeData = [...list]
          }
        } else {
          this.$antmessage.error(data.msg, 3)
        }
      }
    },

    /**
     * 异步数据加载-父节点查询-下级目录-点击树节点时触发
     * @param treeNode 树节点 treeNode.dataRef 可获得自定义属性
     * */
    async onLoadData (treeNode) {
      // 获取查询接口
      const queryFunction = this.getQueryFunction(treeNode.dataRef.id)
      // 获取该节点的子节点
      const { data } = await queryFunction(treeNode.dataRef.id).catch((error) => { throw new Error(error) })
      if (data.code == 200) {
        const nodeList = data.data
        const list = []
        // 格式化对象
        if (nodeList && nodeList.length > 0) {
          nodeList.forEach((item) => {
            list.push(this.formatDataToTreeData(item, treeNode.dataRef))
          })
        }
        treeNode.dataRef.children = list
        // 如果下级无节点，则修改为树节点
        if (list.length == 0) {
          treeNode.dataRef.isLeaf = true
        }
        // 渲染
        this.treeData = [...this.treeData]
      } else {
        this.$antmessage.error(data.msg, 3)
      }
    },
    /**
     * 获取查询方法
     * */
    getQueryFunction (pid) {
      let queryFunction
      // 判断类型 调用不同接口
      if (this.treeType == PRODUCT_TYPE) {
        if (this.showDisabled) {
          if (pid) {
            // 根据id查询下级分类
            queryFunction = getProductTreeNode
          } else {
            // 查询0级菜单分类
            queryFunction = getProductFatherNode
          }
        } else {
          if (pid) {
            // 根据id查询下级分类
            queryFunction = getProductTreeEnableNode
          } else {
            // 查询0级菜单分类
            queryFunction = getProductFatherEnableNode
          }
        }
      } else if (this.treeType == MALL_TYPE) {
        if (this.showDisabled) {
          if (pid) {
            // 根据id查询下级分类
            queryFunction = getMallPageNode
          } else {
            // 查询0级菜单分类
            queryFunction = getMallFatherNode
          }
        } else {
          if (pid) {
            // 根据id查询下级分类
            queryFunction = getMallPageEnableNode
          } else {
            // 查询0级菜单分类
            queryFunction = getMallFatherEnableNode
          }
        }
      }
      return queryFunction
    },
    /**
     *获取产品分类管理下级节点
     *@param data 接口返回对象
     *@returns {id, detail: *, title: (string|*), isLeaf: boolean, key: (string|*)}
     * */
    formatDataToTreeData (data, node) {
      // 写入所有父级code
      let list = []
      if (node) {
        if (node.parentCodes != null && node.parentCodes.length > 0) {
          list = [...node.parentCodes, node.key]
        } else {
          list = [node.key]
        }
      }
      return {
        id: data.id,
        title: data.categoryName,
        key: data.categoryCode,
        isLeaf: data.childCount == 0,
        detail: data,
        parentCodes: list

      }
    }
  }
}
</script>
<style lang="css" scoped>
.tree-wrap {
  margin-top: 30px;
  position: relative;
  height: 100%;
  max-height: 700px;
  overflow-y: auto;
  /* 滚动条 */
}
.tree-wrap-main {
  width: calc(100% - 45px);
}
.tree-reload {
  position: absolute;
  right: 20px;
  top: 10px;
  cursor: pointer;
}
</style>
