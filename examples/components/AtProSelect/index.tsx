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
  name: 'AtProSelect',
  data () {
    return {
      selectPageNo: 1,
      selectPageSize: 50,
      selectSearchFlag: false,
      selectOptionsLoading: false,
      customerList: [],
      allOptionsList: [],
      searchOptions: [],
      seOptionsList: [],
      selectSearchName: null,
      // 查询下拉项的其他条件
      otherParams: {},
      totalPage: null
    }
  },
  props: {
    pagination: {
      type: [Object],
      default: () => {
        return {
          pageNo: 1,
          pageSize: 50
        }
      }
    },
    request: {
      type: [Function]
    },
    lazyOptions: {
      type: [Array]
    }
  },
  async created () {
    if (this.request) {
      await this.getRequestSelectOptions({ selectNum: this.selectPageNo, selectSize: this.selectPageSize }).catch((error) => { throw new Error(error) })
    } else if (this.lazyOptions) {
      this.getLocalSelectOptions(this.lazyOptions)
    }
  },
  methods: {
    /**
     * 兼容 Vue2/3 监听器透传。
     */
    getCompatListeners () {
      const attrs = this.$attrs || {}
      return Object.keys(attrs).reduce((eventMap, key) => {
        const val = attrs[key]
        if (/^on[A-Z]/.test(key) && (typeof val === 'function' || Array.isArray(val))) {
          const eventName = key.slice(2, 3).toLowerCase() + key.slice(3)
          eventMap[eventName] = val
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
        this.allOptionsList = allList // 根据实际--获取数据源
      }
      if (allList.length < 30) {
        this.customerList = allList
      } else {
        this.customerList = allList.slice(0, 30)
      }
    },
    /**
     * 下拉options重新加载方法
     * 如果参数为 true, 则强制刷新到第一页
     * @param Boolean bool
     */
    refresh ({ otherParams }) {
      this.selectPageNo = 1
      this.selectPageSize = 50
      this.otherParams = otherParams
      this.customerList = []
      this.getRequestSelectOptions({ otherParams })
    },
    fixSelectScroll (triggerNode) {
      if (!triggerNode || !triggerNode.parentNode) {
        return document.body
      }
      return triggerNode.parentNode
    },
    requestPopupScroll: debounce(async function () {
      // 总页数大于当前页数则请求下一页；如果总页数未设置，则一直请求下一页
      if (this.totalPage > this.selectPageNo || this.totalPage == null) {
        // 每次下拉加载下一页
        const currentPageNo = this.selectPageNo + 1
        await this.getRequestSelectOptions({ searchValue: this.selectSearchName, selectNum: currentPageNo, selectSize: this.selectPageSize })
        this.selectPageNo = currentPageNo
      }
    }, 500),
    requestSearchStaff: debounce(async function (val) {
      this.selectSearchName = val
      this.getRequestSelectOptions({ searchValue: val, selectNum: 1, selectSize: this.selectPageSize })
      // 进行搜索的时候重置当前页为1
      this.selectPageNo = 1
    }, 500),
    // 下拉列表滚动时回调 -- 滚动下拉框，加载更多也就展示更多
    // 实现思路：当前下拉的展示列表+10小于全部数据的长度，newArr为新加载的10条数据，当前展示列表拼上新加载的10条；否则， newArr为全部列表中剩余的数据，当前展示列表拼上剩余的数据。
    handlePopupScroll: debounce(async function () {
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
    }, 500),
    // 下拉文本框搜索值变化时回调 -- this.searchName为用户输入的内容，并据此重新发送请求获取过滤后的数据。
    handleSearchStaff: debounce(async function (val) {
      this.selectSearchName = val
      const resultList = this.allOptionsList.filter((item) => {
        return item.label.indexOf(val) != -1
  })
      this.getLocalSelectOptions(resultList)
    }, 500)
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
          {...{ props: this.$attrs, on: compatListeners }}
          filterOption={false}
          onSearch={this.requestSearchStaff}
          onPopupScroll={this.requestPopupScroll}
          loading={this.selectOptionsLoading}
          getPopupContainer={this.fixSelectScroll}
        >
          {renderOptions()}
        </a-select>
      )
    } else if (this.lazyOptions) {
      return (
        <a-select
          {...{ props: this.$attrs, on: compatListeners }}
          onSearch={this.handleSearchStaff}
          onPopupScroll={this.handlePopupScroll}
          filterOption={false}
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
