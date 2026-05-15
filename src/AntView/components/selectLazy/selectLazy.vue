<template>
  <!-- v-model="selectValue" -->
  <!-- allowClear showSearch  multiple  default  -->
  <a-select v-bind="$attrs" :value="value || []" @popupScroll="handlePopupScroll" optionFilterProp="label" style="width: 100%;" :showSearch="true"
    @change="selectChange" @search="handleSearch" :disabled="disabled" allowClear :mode="mode === true ? 'multiple' :'default'"
    :class="{'initName' : flag === true,'updataName':flag === false}" :dropdownMatchSelectWidth="false">
    <!-- :class="flag ? 'initName':'updataName'" -->
    <a-select-option v-for="(tValue, index) in frontBatchCode" :value="tValue[selectOptionValue]" :key="index" :label="tValue[selectOptionName]"
      :disabled="tValue.disabled" :title="tValue[selectOptionName]">
      <a-tooltip>
        <template slot="title">
          {{ tValue[selectOptionName] }}
        </template>
        {{ tValue[selectOptionName] }}
      </a-tooltip>
    </a-select-option>
  </a-select>
</template>

<script>
export default {
  name: 'selectLazy',
  data () {
    return {
      listBatchCode: [], // batchCode的总数据（不会改变）
      frontBatchCode: [], // 存放前100的数据
      allData: [],
      valueData: '', // batchCode输入或选择的值
      treePageSize: 50,
      scrollPage: 1,
      title: '' // 为了鼠标悬浮下拉框  隐藏文字  title不能为空 所以随便写了个123
    }
  },
  components: {},
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      // type: String || Array,
      required: true,
      default: ''
    },
    selectList: {
      type: Array,
      required: true,
      default: () => { return [] }
    },
    selectOptionName: {
      type: String,
      required: true,
      default: 'name'
    },
    selectOptionValue: {
      type: String,
      required: true,
      default: 'value'
    },
    // supplierLi (检测禁用)  [需要禁用的id]  [1,2,3,4,5,6]   然后禁用这些选项
    supplierLi: {
      type: Array,
      required: false,
      default: () => { return [] }
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    //  true 未修改 红色  false 已修改 绿色
    flag: {
      // type: Boolean,
      default: () => {
        return ''
      }
    },
    // 是否是多选  true 多选 false 单选
    mode: {
      type: Boolean,
      default: false
    }

  },
  watch: {
    value () {
      // console.log(result, 'result', this.value)
      this.getBatchCode(this.selectList)
      // this.$emit('change', this.value)
    },
    selectList (result) {
      // console.log(result, 'result', this.value)
      this.getBatchCode(result)
      // this.$emit('change', this.value)
    }
  },
  created () {
    // console.log(this.selectList, 'selectList')
    this.getBatchCode(this.selectList)
    // this.$emit('change', this.value)
  },
  methods: {
    // 数据更新
    getBatchCode (result) {
      // console.log(this.frontBatchCode, this.selectOptionValue)
      // 把当前选中的放到第一位 会调用watch  判断第一个 阻止重复调用
      if (this.listBatchCode.length !== 0 && this.frontBatchCode.length && this.value === this.frontBatchCode[0][this.selectOptionValue]) {
        return
      }
      // console.log(result)
      if (result) {
        this.listBatchCode = result
        const frontBatchCode = result.slice(0, this.treePageSize)
        const currentindex = frontBatchCode.findIndex((item) => item[this.selectOptionValue] === this.value)
        // console.log(currentindex, this.value, 'currentindex')
        if (currentindex === -1) {
          const index = result.findIndex((item) => item[this.selectOptionValue] === this.value)
          // console.log(index, 'index', this.value)
          if (index !== -1) {
            // result[index].disabled = true
            result.unshift(result.splice(index, 1)[0])
          }
          this.frontBatchCode = result.slice(0, this.treePageSize)
          this.disableFun()
        } else {
          this.frontBatchCode = result.slice(0, this.treePageSize)
          this.disableFun()
        }
      }

      // this.listBatchCode = result
      // this.frontBatchCode = result.slice(0, this.treePageSize)
    },
    handleSearch (val) {
      // console.log(val, 'handleSearch')
      this.valueData = val
      if (!val) {
        this.getBatchCode(this.selectList)
      } else {
        console.log(this.listBatchCode, val, 'listBatchCode')
        if (this.listBatchCode) {
          this.scrollPage = 1
          const frontBatchCode = this.listBatchCode.filter((item) => item[this.selectOptionName].indexOf(val) >= 0)
          this.frontBatchCode = frontBatchCode.slice(0, 100)
          this.allData = [...frontBatchCode]
          console.log(this.frontBatchCode, frontBatchCode, 'frontBatchCode')
          this.disableFun()
        }
      }
    },
    // 检测禁用
    disableFun () {
      // console.log(this.supplierLi, 'supplierLi')
      if (this.supplierLi.length === 0) return
      const supplierLi = this.supplierLi.map((item) => { return item.supplierCode })
      console.log(supplierLi, 'supplierLi')
      this.frontBatchCode.forEach(element => {
        if (supplierLi.includes(element[this.selectOptionValue])) {
          element.disabled = true
        } else {
          element.disabled = false
        }
      })
    },
    // 下拉框下滑事件
    handlePopupScroll (e) {
      const { target } = e
      const scrollHeight = target.scrollHeight - target.scrollTop
      const clientHeight = target.clientHeight
      // console.log(scrollHeight, clientHeight)
      // 下拉框不下拉的时候
      if (scrollHeight === 0 && clientHeight === 0) {
        this.scrollPage = 1
        console.log(this.scrollPage)
      } else {
        // 当下拉框滚动条到达底部的时候
        if (scrollHeight < clientHeight + 20) {
          this.scrollPage = this.scrollPage + 1
          const scrollPage = this.scrollPage// 获取当前页
          const treePageSize = this.treePageSize * (scrollPage || 1)// 新增数据量
          const newData = [] // 存储新增数据
          let max = '' // max 为能展示的数据的最大条数
          if (this.listBatchCode.length > treePageSize) {
            // 如果总数据的条数大于需要展示的数据
            max = treePageSize
          } else {
            // 否则
            max = this.listBatchCode.length
          }
          // 判断是否有搜索
          if (this.valueData) {
            console.log(this.allData, 'allData')
            this.allData.forEach((item, index) => {
              if (index < max) { // 当data数组的下标小于max时
                newData.push(item)
              }
            })
          } else {
            this.listBatchCode.forEach((item, index) => {
              if (index < max) { // 当data数组的下标小于max时
                newData.push(item)
              }
            })
          }
          // 当所有数据加载完成 就不再更新
          if (this.frontBatchCode.length === this.listBatchCode.length) {
            return
          }
          this.frontBatchCode = [...newData] // 将新增的数据赋值到要显示的数组中
        }
      }
    },
    // 查询后重置调的方法
    searchResetNew () {
      this.getBatchCode(this.selectList)
      this.valueData = ''
    },
    selectChange (e) {
      console.log(e, 'e')
      this.$emit('change', e)
      this.disableFun()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
