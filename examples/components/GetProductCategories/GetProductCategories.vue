<template>
  <a-modal
    title="设定小品类"
    okText="确定"
    width="400px"
    cancelText="取消"
    :visible="typeVisible"
    :maskClosable="false"
    :destroyOnClose="!memory"
    @cancel="handleCModalCancel"
    @ok="handleCModalOk"
  >
    <a-spin :spinning="loading">
      <div class="checkDiv" v-show="currentCheckNode && currentCheckNode.key">
        选中的小品类是: {{ currentCheckNode.label }}
      </div>
      <div class="search-wrap">
        <a-input placeholder="请输入查询条件" :maxLength="20" v-model.trim="searchStr" />
        <a-button @click="handleTreeSearch"><a-icon type="search" /></a-button>
      </div>
      <div class="tree-wrap">
        <!-- :default-expand-all="defaultExpandAll" -->
        <a-tree
          :tree-data="typeOptions"
          show-icon
          @select="handleSelect"
        >
          <!-- :replaceFields="{children:'children', title:'typeName', key:'id', value: 'id' }" -->
          <template slot="title" slot-scope="{ title }">
            <a-icon slot="icon" type="file" />
            <span v-if="title.indexOf(searchValue) > -1">
              {{ title.substr(0, title.indexOf(searchValue)) }}
              <span style="color: #f50">{{ searchValue }}</span>
              {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
            </span>
            <span v-else>{{ title }}</span>
          </template>
        </a-tree>
      </div>
      <slot name="default"></slot>
    </a-spin>
  </a-modal>
</template>

<script>
/**
 * @description 这是一个用于选择小分类的组件
 * @useage
 * 在 父组件
 * <parentComp>
 *   <GetProductCategories ref="refName" @close="handleCompClose">
 * </parentComp>
 *  this.$refs.refName.open(); 打开弹窗
 *  handleCompClose(val: string) { // val 小分类的id }; 接收子组件传回来的值
 */
import { mapGetters } from 'vuex'
// 产品类别 查询：树状结构
import { getTypeTreeList } from '@/services/quote/productCategory'
// 查询：按父类别ID /oms/product/type/queryChild
// const productTypeQueryChild = `${BASE_URL}/oms/product/type/queryChild`
export default {
  props: {
    treeData: {
      type: Array,
      default: () => ([])
    },
    // 【用户内测+分类界面+优化需求】https://www.tapd.cn/53479878/bugtrace/bugs/view?bug_id=1153479878001000232
    // 保留上一次的选中项
    memory: {
      require: false,
      type: Boolean,
      default: false //
    },
    // 是否是第四层级，
    // 产品设定分类 不一定有小分类 fix 【新增产品——产品分类无小品类的不能添加】
    // 人工报价 -- 转其他品类  必须要选到最小分类
    needfour: {
      require: false,
      type: Boolean,
      default: true
    }
  },
  watch: {
    treeData (data) {
      if (data.length > 0) return data
    }
  },
  computed: {
    ...mapGetters('common', ['productTypeList'])
  },
  data () {
    return {
      loading: true,
      typeVisible: false,
      searchStr: '',
      searchValue: '',
      currentCheckNode: {},
      typeOptions: [],
      defaultExpandAll: false,
      parentId: ''
    }
  },
  methods: {
    // 初始化页面
    async init () {
      this.typeVisible = true
      this.loading = true
      if (!this.productTypeList) {
        const data = await this.handleGetParentTree()
        this.formatData(data)
        this.typeOptions = data
        this.$store.commit('common/setProductTypeList', data)
      } else {
        this.typeOptions = [...this.productTypeList]
      }
      this.loading = false
    },
    // 格式化接口返回的数据
    formatData (data) {
      data.forEach(item => {
        item.key = item.ancestors.split(',').reverse().join('-')
        item.title = item.typeName
        // item.selectable = item.ancestors.length !== 4
        if (Array.isArray(item.children) && item.children.length) {
          this.formatData(item.children)
        }
      })
    },
    // 处理选中事件
    handleSelect (selectKeys, e) {
      const { node, selected } = e
      if (!selected) {
        this.currentCheckNode = {
          label: '',
          key: ''
        }
        return
      }
      // console.log('node.$children.length======', node.isLeaf2())
      // fix 【新增产品——产品分类无小品类的不能添加】https://www.tapd.cn/53479878/bugtrace/bugs/view?bug_id=1153479878001000246
      const temp = selectKeys[0].split('-')
      const isFourLevel = temp.length === 4 // 小分类下的产品
      if (node.isLeaf2() && (this.needfour ? isFourLevel : true)) {
        // 设定分类时 只要这个节点没有子节点就可以选了， 不一定非得是第四层级
        // 人工报价  转其他品类时 要选到第四层 （和佐文超确认了， 这里的逻辑只需要选到没有子节点即可，不一定非得到第四层级）
        this.currentCheckNode = {
          label: e.node.$el.innerText,
          key: temp[temp.length - 1]
        }
      } else {
        node.onExpand()
      }
    },
    // 处理搜索事件
    handleTreeSearch () {
      if (this.searchStr !== '') {
        this.searchValue = this.searchStr
      }
    },
    // 关闭弹窗处理函数
    handleCModalCancel () {
      this.handleBeforeClose()
    },
    // 关闭弹窗处理函数
    handleCModalOk () {
      if (this.currentCheckNode && this.currentCheckNode.key) {
        // 子组件返回分类id
        this.$emit('ok', this.currentCheckNode)
        this.handleBeforeClose()
      } else {
        this.$message.warning('请选择小分类!')
      }
    },
    async handleGetParentTree () {
      const result = await getTypeTreeList({ parentId: this.parentId }).catch((error) => { throw new Error(error) })
      if (result.data.code == 200) {
        return result.data.data
      } else {
        this.$message.error(result.data.msg)
        return []
      }
    },
    // 打开弹窗处理函数
    open (parentId) {
      this.parentId = parentId
      // 每次打开都重新请求接口
      this.init()
    },
    // 弹窗关闭前清除数据（不清除了， 保留上次的结果）
    handleBeforeClose () {
      this.typeVisible = false
      if (!this.memory) {
        this.currentCheckNode = { label: '', key: '' }
        this.searchValue = ''
        this.searchStr = ''
      }
    }
  }
}
</script>

<style scoped>
.search-wrap {
  display: flex;
}
.tree-wrap {
  max-height: 400px;
  overflow-y: scroll;
}
</style>
