// @ts-nocheck
import debounce from 'lodash/debounce'

const formatArr = (list) => {
  const map = new Map()
  for (const item of list) {
    if (!map.has(item.value)) {
      map.set(item.value, item)
    }
  }
  return [...map.values()]
}

export default {
  name: 'AtSelect',
  data () {
    return {
      selectPageNo: 1,
      selectPageSize: 10,
      selectSearchFlag: false,
      selectOptionsLoading: false,
      customerList: [],
      allOptionsList: [],
      searchOptions: [],
      seOptionsList: [],
      selectSearchName: null,
      otherParams: {},
      totalPage: null,
      localLazyOptions: null,
      localValue: null
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {},
    pagination: {
      type: [Object],
      default: () => {
        return {
          pageNo: 1,
          pageSize: 10
        }
      }
    },
    request: {
      type: [Function]
    },
    lazyOptions: {
      type: [Array]
    },
    fixedParent: {
      type: [Boolean],
      default: true
    }
  },
  async created () {
    if (this.request) {
      await this.getRequestSelectOptions({ selectNum: this.selectPageNo, selectSize: this.selectPageSize }).catch((error) => { throw new Error(error) })
    } else if (this.lazyOptions) {
      this.localLazyOptions = this.lazyOptions
      this.getLocalSelectOptions(this.lazyOptions)
    }
    this.localValue = this.value
  },
  computed: {
    localSelectObj () {
      const { lazyOptions, value } = this
      return {
        lazyOptions,
        value
      }
    }
  },
  watch: {
    localSelectObj (val) {
      if (val.value && val.lazyOptions) {
        this.localLazyOptions = val.lazyOptions
        this.getLocalSelectOptions(val.lazyOptions)
        const currentValue = val.lazyOptions.filter(item => {
          return item.value == val.value
        })
        this.localValue = currentValue[0].label
      } else if (!val.value && val.lazyOptions) {
        this.localLazyOptions = val.lazyOptions
        this.getLocalSelectOptions(val.lazyOptions)
        this.localValue = val.value
      } else if (!val.lazyOptions && this.$props.request) {
        this.localValue = val.value
      }
    }
  },
  methods: {
    getCompatListeners () {
      if (this.$listeners) {
        return this.$listeners
      }
      const attrs = this.$attrs || {}
      return Object.keys(attrs).reduce((eventMap, key) => {
        if (/^on[A-Z]/.test(key) && typeof attrs[key] === 'function') {
          const eventName = key.slice(2, 3).toLowerCase() + key.slice(3)
          eventMap[eventName] = attrs[key]
        }
        return eventMap
      }, {})
    },
    async getRequestSelectOptions ({ selectNum = this.selectPageNo, selectSize = this.selectPageSize, searchValue = this.selectSearchName, otherParams = this.otherParams }) {
      this.selectOptionsLoading = true
      const resData = await this.request({ searchValue, pageNo: selectNum, pageSize: selectSize, ...otherParams }).catch((error) => { throw new Error(error) })
      const { data, totalPage } = resData
      if (data) {
        this.totalPage = totalPage
        this.selectOptionsLoading = false
        if (selectNum > 1) {
          const customerList = this.customerList
          const allData = customerList.concat(data)
          this.customerList = formatArr(allData)
        } else {
          this.customerList = data
        }
      } else {
        console.error('ProSelect:请返回data参数！')
      }
    },
    getLocalSelectOptions (allList) {
      if (this.selectSearchName) {
        this.searchOptions = allList
      } else {
        this.allOptionsList = allList
      }
      if (allList.length < 30) {
        this.customerList = allList
      } else {
        this.customerList = allList.slice(0, 30)
      }
    },
    refresh ({ otherParams }) {
      this.selectPageNo = 1
      this.selectPageSize = 10
      this.otherParams = otherParams
      this.customerList = []
      this.getRequestSelectOptions({ otherParams })
    },
    fixSelectScroll (triggerNode) {
      if (!this.fixedParent) {
        return document.body
      }
      if (!triggerNode || !triggerNode.parentNode) {
        return document.body
      }
      return triggerNode.parentNode
    },
    requestPopupScroll: debounce(async function () {
      if (this.totalPage > this.selectPageNo || this.totalPage == null) {
        const currentPageNo = this.selectPageNo + 1
        await this.getRequestSelectOptions({ searchValue: this.selectSearchName, selectNum: currentPageNo, selectSize: this.selectPageSize })
        this.selectPageNo = currentPageNo
      }
    }, 500),
    requestSearchStaff: debounce(function (val) {
      this.selectSearchName = val
      this.getRequestSelectOptions({ searchValue: val, selectNum: 1, selectSize: this.selectPageSize })
      this.selectPageNo = 1
    }, 500),
    handlePopupScroll: debounce(function () {
      let allLen = null
      if (this.selectSearchName) {
        allLen = this.searchOptions.length
      } else {
        allLen = this.allOptionsList.length
      }
      const curLen = this.customerList.length
      if (curLen + 30 < allLen) {
        const newArr = this.allOptionsList.slice(curLen, curLen + 30)
        this.customerList = this.customerList.concat(newArr)
      } else {
        const newArr = this.allOptionsList.slice(curLen, allLen)
        this.customerList = this.customerList.concat(newArr)
      }
    }, 200),
    handleSearchStaff: debounce(function (val) {
      this.selectSearchName = val
      const resultList = this.allOptionsList.filter((item) => {
        return item.label.indexOf(val) != -1
      })
      this.getLocalSelectOptions(resultList)
    }, 500),
    onLazyOptionsChange (value, options) {
      this.localValue = value
      this.$emit('change', value, options)
    }
  },
  render () {
    const compatListeners = this.getCompatListeners()
    const renderOptions = () => this.customerList.map((item, index) => (
      <a-select-option key={item.value ?? index} value={item.value}>
        {item.label}
      </a-select-option>
    ))
    if (this.$props.request) {
      return (
        <a-select
          {...{ props: Object.assign(this.$attrs), on: compatListeners }}
          value={this.localValue}
          filterOption={false}
          onSearch={this.requestSearchStaff}
          onPopupScroll={this.requestPopupScroll}
          loading={this.selectOptionsLoading}
          getPopupContainer={this.fixSelectScroll}
        >
          {renderOptions()}
        </a-select>
      )
    } else if (this.localLazyOptions) {
      return (
        <a-select
          {...{ props: this.$attrs, on: compatListeners }}
          filterOption={false}
          value={this.localValue}
          onChange={this.onLazyOptionsChange}
          onSearch={this.handleSearchStaff}
          onPopupScroll={this.handlePopupScroll}
          getPopupContainer={this.fixSelectScroll}
        >
          {renderOptions()}
        </a-select>
      )
    } else {
      return (
        <a-select getPopupContainer={this.fixSelectScroll}
          {...{ props: this.$attrs, on: compatListeners }}
        />
      )
    }
  }
}
