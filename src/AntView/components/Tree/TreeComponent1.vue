<template>
  <div>
    <div style="padding: 0px 10px;margin-bottom: 5px; display: inline-flex; align-content: center;" v-if="!searchKind">
      <div>
        <a-input-search v-model="searchStr" enter-button  @search="onSearch" />
      </div>
      <div style="height: 32px;width: 32px"  @click="refreshTree"><a-icon style="cursor:pointer;ont-size: 16px; line-height: 32px; margin-left: 10px;" type="reload" /></div>
    </div>
    <div style="padding: 0px 10px; margin-bottom: 5px;" v-if="searchKind">
      <div style="margin-bottom: 5px">
        <a-input v-model="searchStr" style="width: 60%"></a-input>
      </div>
      <a-select v-model="selectType" style="width: 60%">
        <a-select-option v-for="item in productKindOptions" :key="item.value" :value="item.value">{{item.name}}</a-select-option>
      </a-select>
      <a-button type="primary" @click="getTree">搜索</a-button>
    </div>
    <!-- 刷新按钮 -->
    <div class="tree-wrap">
      <div class="tree-wrap-main" v-if="isFresh">
        <div v-if="checkable==false">
          <a-tree
            :v-if="loadTree"
            :show-line="true"
            :expanded-keys="expandedKeys"
            :selectedKeys= "selectKey"
            :tree-data="treeData"
            :replaceFields="replaceFields"
            @expand="expandFunction"
            @select="selectHandle">
            <template slot="title" slot-scope="{ categoryName }">
            <span v-if="categoryName.indexOf(searchStr) > -1">
              {{ categoryName.substr(0, categoryName.indexOf(searchStr)) }}
            <span style="color: #f50">{{ searchStr }}</span>
              {{ categoryName.substr(categoryName.indexOf(searchStr) + searchStr.length) }}
            </span>
              <span v-else>{{ categoryName }}</span>
            </template>
          </a-tree>
        </div>
        <div v-else>
          <a-tree
            :v-if="loadTree"
            :show-line="true"
            checkable
            v-model="checkedTrees"
            :auto-expand-parent="autoExpandParent"
            :expanded-keys="expandedKeys"
            :default-checked-keys = "selectKey"
            :tree-data="treeData"
            :replaceFields="replaceFields"
            @expand="onExpand"
            @check="onCheck"
            @select="selectHandle">
            <template slot="title" slot-scope="{ categoryName }">
            <span v-if="categoryName.indexOf(searchStr) > -1">
              {{ categoryName.substr(0, categoryName.indexOf(searchStr)) }}
            <span style="color: #f50">{{ searchStr }}</span>
              {{ categoryName.substr(categoryName.indexOf(searchStr) + searchStr.length) }}
            </span>
              <span v-else>{{ categoryName }}</span>
            </template>
          </a-tree>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import { getProductTreeByCondition } from './utils/productClassify'
import { getCommodityByCondition } from './utils/mallClassify'
// 表头
// import { productKindOptions } from '@/pages/product/ProductClassifyManagement/utils/tableContent.js'
import { productKindOptions } from './utils/tableContent'

import debounce from 'lodash/debounce'
const PRODUCT_TYPE = 1
const MALL_TYPE = 2
export default {
  name: 'treeComponent',
  data () {
    return {
      isFresh: true, // 刷新
      treeData: [], // 树形数据
      expandedKeys: [1], // 展开节点
      defaultExpandedKeys: [1], // 展开节点
      selectKey: [1],
      autoExpandParent: true,
      replaceFields: { title: 'categoryName', key: 'id' },
      loadTree: false,
      searchStr: '',
      backupsExpandedKeys: [],
      checkedTrees: [], // 包含父节点id
      allCheckedTrees: [],
      checkedOptions: [],
      productKindOptions,
      selectType: null
    }
  },
  props: {
    // 所选择的节点id
    selectValue: {
      required: false
    },
    // 展开的id列表 默认[1]
    defaultValue: {
      type: Array,
      // default: [1],
      default: () => {
        return [1]
      },
      required: false
    },
    // 树类型 PRODUCT_TYPE = 1 MALL_TYPE = 2
    treeType: {
      type: Number,
      required: true
    },
    // 是否展示未启用的树结构
    showDisabled: {
      required: false,
      default: true
    },
    // 是否可选择的树 默认不可选择
    checkable: {
      required: false,
      default: false
    },
    // 是否显示树的分类
    searchKind: {
      required: false,
      default: false
    },
    // 传参 树的分类
    productType: {
      required: false,
      default: null
    }
  },
  computed: {},
  components: {},
  mounted () {},
  async created () {
    await this.getTree()
  },
  methods: {
    // 展开/收起节点时触发
    // 展开时expandedKeys为当前展开的节点和父级节点信息，收起时为当前收起节点的父级节点信息
    // e.node.dataRef.key为当前操作的节点
    // 展开操作时index为-1，收起操作时index为树的level
    expandFunction (expandedKeys, e) {
      const { node } = e
      const key = node.dataRef.id
      const index = this.expandedKeys.indexOf(key)
      // 展开树结构
      if (!node.expanded && index == -1) {
        this.expandedKeys = expandedKeys
        // 收缩树
      } else if (node.expanded && index >= 0) {
        const list = []
        this.expandedKeys.forEach(x => {
          if (x != key) {
            list.push(x)
          }
        })
        this.expandedKeys = list
      }
    },
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    selectHandle (selectedKeys, e) {
      const { node } = e
      const key = node.dataRef.id
      const index = this.expandedKeys.indexOf(key)
      // 展开树结构
      if (!node.expanded && index == -1) {
        const ids = node.dataRef.ancestor.split(',')
        const parentCodes = []
        ids.forEach(x => {
          parentCodes.push(Number(x))
        })
        this.expandedKeys = parentCodes
      }
      const list = []
      list.push(key)
      this.selectKey = list
      this.$emit('select', selectedKeys, e.selectedNodes[0].data.props)
    },
    onCheck (checkedKeys, e) {
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
    // 刷新树
    refreshTree: debounce(function () {
      this.treeData = []
      this.loadTree = false
      // 销毁 重新渲染
      this.isFresh = false
      this.$nextTick(() => {
        this.isFresh = true
        this.getTree()
        this.$nextTick(() => {
          this.expandedKeys = [1]
          this.selectKey = [1]
        })
      })
    }, 500),
    async getTree () {
      this.loadTree = false
      this.treeData = []
      // 判断类型 调用不同查询父级接口
      let queryFun
      const param = {
        isGetAll: this.showDisabled
      }
      if (this.productType >= 1) {
        param.productKind = this.productType
      }
      if (this.searchKind) {
        param.productKind = this.selectType
      }
      if (this.treeType == PRODUCT_TYPE) {
        queryFun = getProductTreeByCondition
      } else if (this.treeType == MALL_TYPE) {
        queryFun = getCommodityByCondition
      }
      // 判断类型 调用不同查询父级接口
      const { data } = await queryFun(param).catch((error) => { throw new Error(error) })
      if (data.code == 200) {
        this.treeData = data.data
        this.expandedKeys = this.defaultValue
        this.selectKey = this.selectValue
        if (this.checkable) {
          this.checkedTrees = this.selectValue
        }
        this.loadTree = true
        if (this.searchKind) {
          this.onSearch()
        }
      } else {
        this.$antmessage.error(data.msg, 3)
        this.loadTree = true
      }
    },
    onSearch () {
      const vm = this
      vm.searchValue = vm.searchStr
      if (vm.searchValue === '') {
        vm.expandedKeys = [1]
      } else {
        const listNodes = vm.getKeyList(vm.searchValue, vm.treeData, [])
        if (listNodes.length == 0) {
          vm.expandedKeys = [1]
        } else {
          const searchExpandedKeys = []
          listNodes.forEach(x => {
            const ids = x.ancestor.split(',')
            ids.forEach(id => {
              if (searchExpandedKeys.indexOf(Number(id)) < 0) {
                searchExpandedKeys.push(Number(id))
              }
            })
          })
          vm.expandedKeys = searchExpandedKeys
        }
      }
    },
    // 获取节点中含有value的所有key集合
    getKeyList (value, tree, keyList) {
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (node.categoryName.indexOf(value) > -1) {
          keyList.push(node)
        }
        if (node.children) {
          this.getKeyList(value, node.children, keyList)
        }
      }
      return keyList
    }
  }
}
</script>
<style lang="css" scoped>
.tree-wrap {
  position: relative;
  height: 100%;
  max-height: 700px;
  overflow-y: auto;
  /* 滚动条 */
}
.tree-wrap-main {
  width: calc(100% - 45px);
}
</style>
