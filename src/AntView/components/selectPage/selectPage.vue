<template>
  <!-- v-model="selectValue" -->
  <!-- allowClear showSearch   -->
  <div>
    <a-select v-bind="$attrs" :value="value || []" @popupScroll="handlePopupScroll" optionFilterProp="label"
      style="width: 100%;" :showSearch="true" @change="selectChange" @search="handleSearch" allowClear
      :class="{ 'initName': flag === true, 'updataName': flag === false }"
      :mode="mode === true ? 'multiple' : 'default'" :dropdownMatchSelectWidth="false" :disabled="disabled">
      <a-select-option v-for="(tValue, index) in list" :value="tValue[selectOptionValue]" :key="index"
        :label="tValue[selectOptionName]" :disabled="tValue.disabled" :title="tValue[selectOptionName]">
        <a-tooltip>
          <template slot="title">
            {{ tValue[selectOptionName] }}
          </template>
          {{ tValue[selectOptionName] }}
        </a-tooltip>
      </a-select-option>
    </a-select>
  </div>
</template>

<script>

import debounce from 'lodash/debounce'
let that
export default {
  name: 'selectPage',
  data () {
    return {
      list: [], // 总数据
      searchValue: '', // 输入的值
      pageSize: 10,
      pageNum: 1,
      total: 0
    }
  },
  components: {},
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    selectList: {
      type: Array,
      default: () => { return [] }
    },
    value: {
      // type: String || Array,
      required: true,
      default: ''
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
    request: {
      type: Function,
      required: true,
      default: () => { return [] }
    },
    // 搜索时需要传递的key
    searchKey: {
      type: String,
      required: true,
      default: 'searchValue'
    },
    // 初始化搜索传递的文本
    initSearchTxt: {
      type: String,
      required: false,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // disabledIds (检测禁用)  [需要禁用的id]  [1,2,3,4,5,6]   然后禁用这些选项
    disabledIds: {
      type: Array,
      required: false,
      default: () => { return [] }
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
    },
    // 搜索必传 (接口需要知道查询的是哪个下拉框)
    queryCode: {
      type: String,
      required: true,
      default: ''
    }
  },
  computed: {

  },
  watch: {
    value (value) {
      console.log(value, 'result', this.value)
    },
    selectList (newList) {
      // console.log(newList, 'newList')
      this.list = JSON.parse(JSON.stringify(newList))
    }
  },
  created () {
    that = this
    this.initFun()
  },
  beforeUnmount () {
    that = null
  },
  methods: {
    initFun () {
      this.list = JSON.parse(JSON.stringify(this.selectList))
      // console.log(this.list, this.selectList)
    },
    // 数据更新
    /* eslint-disable */
    async updateList() {
      // 回显当前的值
      let codes
      if (this.mode && typeof this.searchValue == String) {
        codes = this.searchValue.split(',')
      } else {
        codes = [this.searchValue]
      }
      // console.log(codes, 'codes')
      const params = {
        // codes,
        param: {
          "pageNum": this.pageNum,
          "pageSize": this.pageSize,
          "orderColumns": [{ "columnName": "", "isAsc": true }],
          "param": this.searchValue
        },
        queryCode: this.queryCode
      }
      // console.log(params, this.request, 'params')
      const result = await this.request(params).catch((error) => { throw new Error(error) })
      // console.log(result)
      if (result.data.code == 200) {
        const data = result.data.data
        const listData = this.list.concat(data.optionPage.list, data.optionList)
        //根据code去重
        let map = new Map();
        for (let item of listData) {
          if (!map.has(item.code)) {
            map.set(item.code, item)
          }
        }
        //把map中所有的值取出来放进数组
        let list = [...map.values()];
        // const list = this.list.concat(data.data.list)
        this.list = this.deWeightThree(list)
        this.total = data.optionPage.total
        this.$emit('update:selectList', this.list)
      } else {
        this.$antmessage.error(result.data.msg, 5)
      }
    },
    // 数组去重
    deWeightThree(list) {
      let name = this.selectOptionValue;
      const arr = []
      list.forEach(element => {
        const index = arr.findIndex((item) => { return item[name] === element[name] })
        // console.log(index)
        if (index === -1) {
          arr.push(element)
        }
      });
      return arr
    },
    handleSearch(val) {
      // console.log(val, 'handleSearch')
      this.searchValue = val
      // console.log(this.searchValue, 'this.searchValue')
      this.pageNum = 1
      this.list = []
      this.updateList()
      if (val == '') {
        this.selectChange(val)
      }
    },
    // 检测禁用
    disableFun() {
      // console.log(this.supplierLi, 'supplierLi')
      if (this.disabledIds.length === 0) return
      const disabledIds = this.disabledIds.map((item) => { return item.supplierCode })
      // console.log(disabledIds, 'disabledIds')
      this.list.forEach(element => {
        if (disabledIds.includes(element[this.selectOptionValue])) {
          element.disabled = true
        } else {
          element.disabled = false
        }
      })
    },
    handlePopupScroll: debounce((e) => {
      if (that.total === that.list.length) return
      const { target } = e
      const scrollHeight = target.scrollHeight - target.scrollTop
      const clientHeight = target.clientHeight
      // console.log(scrollHeight, clientHeight)
      // 下拉框不下拉的时候
      if (scrollHeight === 0 && clientHeight === 0) {
        // console.log(that.scrollPage)
      } else {
        // 当下拉框滚动条到达底部的时候
        if (scrollHeight < clientHeight + 20) {
          console.log('到达底部')
          that.pageNum = that.pageNum + 1
          that.updateList()
        }
      }
    }, 500),
    // 查询后重置调的方法
    searchResetNew() {
      this.searchValue = ''
    },
    selectChange(e) {
      // console.log(e, this.searchValue, this.list, 'e')
      if (e && e.length == 0) {
        this.handleSearch('')
      }
      this.$emit('change', e)
      // this.disableFun()
    }
  }
}
</script>

<style lang="less" scoped></style>
