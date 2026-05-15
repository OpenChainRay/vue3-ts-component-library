<template>
  <div>
    <a-input :value="inputValue" @click="open"/>
    <a-modal
      v-if="addVisible"
      title="产品分类"
      :visible="addVisible"
      :confirm-loading="confirmLoading"
      @ok="addOk"
      @cancel="addCancel"
      width=400px
    >
      <div v-if="this.isSingleMode== false">
        <tree-component
                        style="height: 400px;"
                        ref="treeMode1"
                        :selectValue="productCheckedKeys"
                        :defaultValue = "productExpandKeys"
                        :treeType = 1
                        :showDisabled="false"
                        :checkable=true
                        @check="(checkedForthNodes,allCheckedTrees)=>handleCheckProduct(checkedForthNodes,allCheckedTrees)"
        />
      </div>

      <div v-else>
        <tree-component
                        style="height: 400px;"
                        ref="treeMode1"
                        :selectValue="productCheckedKeys"
                        :defaultValue = "productExpandKeys"
                        :treeType = 1
                        :showDisabled="false"
                        @select="(selectedKeys,e,detail)=>handleSelect(selectedKeys,e,detail)"
        />
      </div>

<!--      <tree-component
        style="height: 400px;"
        ref="treeMode1"
        :defaultValue="productCheckedKeys"
        :treeType=1
        :initTreeNodeId="selectProduct.id"
        :showDisabled="false"
        :checkable=true
        @check="(checkedForthNodes,allCheckedTrees)=>handleCheckProduct(checkedForthNodes,allCheckedTrees)"
      />-->
    </a-modal>
  </div>
</template>
<script>
import treeComponent from './TreeComponent1'

export default {
  name: 'treeFormModal',
  components: {
    'tree-component': treeComponent
  },
  data () {
    return {
      inputValue: '',
      inputValueList: [],
      productCheckedNames: '',
      productCheckedList: [],
      productCheckedKeys: [],
      productExpandKeys: [],
      selectProduct: {},
      addVisible: false,
      confirmLoading: false

    }
  },
  computed: {},
  model: {
    prop: 'defaultValue',
    event: 'update'
  },
  created () {
    this.initValue(this.defaultValue)
  },
  props: {
    // 选中节点key
    defaultValue: {
      type: Array,
      required: false
    },
    isSingleMode: {
      required: false,
      default: false
    }
  },
  mounted () {},
  methods: {

    initValue (list) {
      if (list && list.length > 0) {
        const valueList = []
        list.forEach(x => {
          valueList.push(x.categoryName)
        })
        this.inputValue = valueList.join(',')
        this.inputValueList = list
        this.productCheckedNames = valueList.join(',')
        this.productCheckedList = list
      }
    },
    // 打开弹窗
    open () {
      const valueList = []
      const expandKeys = []
      this.inputValueList.forEach(x => {
        valueList.push(Number(x.id))
        const ids = x.ancestor.split(',')
        ids.forEach(id => {
          if (expandKeys.indexOf(id) < 0) {
            expandKeys.push(Number(id))
          }
        })
      })
      this.productCheckedKeys = valueList
      if (expandKeys.length == 0) {
        this.productExpandKeys = [1]
      } else {
        this.productExpandKeys = expandKeys
      }
      this.addVisible = true
    },

    // 新增保存
    addOk () {
      console.log(this.productCheckedNames)
      console.log(this.productCheckedList)
      this.addVisible = false
      this.inputValue = this.productCheckedNames
      this.inputValueList = this.productCheckedList
      const searchList = this.inputValueList.map(item => {
        return item.id
      })
      this.$emit('update', searchList)
    },
    // 关闭弹窗
    addCancel () {
      this.addVisible = false
    },
    handleCheckProduct (checkedForthNodes) {
      const valueList = []
      checkedForthNodes.forEach(x => {
        valueList.push(x.categoryName)
      })
      this.productCheckedNames = valueList.join(',')
      this.productCheckedList = checkedForthNodes
    },
    handleSelect (selectedKeys, detail) {
      if (detail.level == 4) {
        this.productCheckedNames = detail.categoryName
        this.productCheckedList = [detail]
      }
    },
    resetValue () {
      // debugger
      this.inputValueList = []
      this.inputValue = ''
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.tree-reload {
  position: absolute;
  left: 95px;
  top: 16px;
  cursor: pointer;
}
</style>
t
