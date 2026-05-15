<template>
  <a-cascader
    v-if="loadTree"
    :options="treeData"
    :value="expandedKeys"
    :allowClear="allowClear"
    :fieldNames="{ label: 'categoryName', value: 'id', children: 'children' }"
    placeholder="请选择"
    @change="changeFunction"
    :display-render="renderSelect"
    :size="size"
    :show-search="true"
    :getPopupContainer="bindCascader ? (triggerNode => (triggerNode.parentElement || document.body)) : null"
  />
  <a-spin v-else />
</template>
<script>
import { getProductAllTreeList, getProductTreeList } from './utils/productClassify'
import { getCommodityAllTreeList, getCommodityTreeList } from './utils/mallClassify'
const PRODUCT_TYPE = 1
const MALL_TYPE = 2
export default {
  data () {
    return {
      treeData: [], // 树 数据
      loadTree: false,
      expandedKeys: [],
      replaceFields: { label: 'categoryName', value: 'id' }
    }
  },
  props: {
    // 树类型 1产品分类 2商城分类
    treeType: {
      type: Number,
      required: true
    },
    // 是否显示启用
    showDisabled: {
      required: false,
      default: false
    },
    // 选中节点key
    defaultValue: {
      type: Array,
      required: false
    },
    // size small large default
    size: {
      type: String,
      default: 'default'
    },
    // 显示类型 name显示名称 不填显示code
    displayType: {
      type: String,
      required: false
    },
    // 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。
    bindCascader: {
      required: false
    },
    allowClear: {
      required: false,
      default: false
    }
  },
  created () {
    // 页面创建时渲染树 数据
    this.getTree()
  },
  methods: {
    filter (inputValue, path) {
      // debugger
      return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
    },
    async getTree () {
      this.loadTree = false
      this.treeData = []
      // 判断类型 调用不同查询父级接口
      let queryFun
      if (this.treeType == PRODUCT_TYPE) {
        if (this.showDisabled) {
          queryFun = getProductAllTreeList
        } else {
          queryFun = getProductTreeList
        }
      } else if (this.treeType == MALL_TYPE) {
        if (this.showDisabled) {
          queryFun = getCommodityAllTreeList
        } else {
          queryFun = getCommodityTreeList
        }
      }
      // 判断类型 调用不同查询父级接口
      const { data } = await queryFun().catch((error) => { throw new Error(error) })
      if (data.code == 200) {
        this.treeData = this.formatData(data.data)

        this.expandedKeys = this.defaultValue
        // this.selectKey = this.selectValue
        this.loadTree = true
      } else {
        this.$antmessage.error(data.msg, 3)
        this.loadTree = true
      }
    },
    changeFunction (value, selectedOptions) {
      this.expandedKeys = value
      let choose = null
      if (selectedOptions) {
        choose = selectedOptions[selectedOptions.length - 1]
        if (choose.level == 4) {
          this.$emit('change', value, selectedOptions, choose)
        }
      }
    },

    // 渲染选择框中的数据
    // 判断displayType是否等于name，若是返回四级分类名称，否则返回四级分类编码
    renderSelect (e) {
      const { selectedOptions } = e
      if (selectedOptions.length > 1) {
        const select = selectedOptions[selectedOptions.length - 1]
        if (select && select.level == 4 && this.displayType == 'name') {
          return selectedOptions[selectedOptions.length - 1].categoryName
        } else if (select && select.level == 4) {
          return selectedOptions[selectedOptions.length - 1].categoryCode
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    // 把children = [] 改成undefined 解决多显示一层的数据
    formatData (data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          data[i].children = undefined
        } else {
          this.formatData(data[i].children)
        }
      }
      return data
    }
  }
}
</script>

<style lang="scss">
// 目前此样式影响全局a-cascader
// .ant-cascader-menus-content .ant-cascader-menu{
//   height: 300px !important;
// }
</style>
