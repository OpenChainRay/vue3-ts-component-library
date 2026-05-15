import throttle from 'lodash/throttle'

/** 判断是否是滚动容器 */
function isScroller (el: any) {
  const style = window.getComputedStyle(el, null)
  const scrollValues = ['auto', 'scroll']
  return scrollValues.includes(style.overflow) || scrollValues.includes(style['overflow-y'])
}

/** 获取父层滚动容器 */
function getParentScroller (el: any) {
  let parent = el
  while (parent) {
    if ([window, document, document.documentElement].includes(parent)) {
      return window
    }
    if (isScroller(parent)) {
      return parent
    }
    parent = parent.parentNode
  }

  return parent || window
}

/** 获取容器滚动位置 */
function getScrollTop (el: any) {
  return el === window ? window.pageYOffset : el.scrollTop
}

/** 获取容器高度 */
function getOffsetHeight (el: any) {
  return el === window ? window.innerHeight : el.offsetHeight
}

/** 滚动到某个位置 */
function scrollToY (el: any, y: number) {
  if (el === window) {
    window.scroll(0, y)
  } else {
    el.scrollTop = y
  }
}

const TableBodyClassNames = ['.ant-table-scroll .ant-table-body', '.ant-table-fixed-left .ant-table-body-inner', '.ant-table-fixed-right .ant-table-body-inner']

export default {
  /** 初始化数据 */
  initData () {
    this.isInnerScroll = false
    this.scroller = this.getScroller()
    this.setToTop()
    this.handleScroll()
    this.$nextTick(() => {
      this.handleScroll()
    })
    this.onScroll = throttle(this.handleScroll, this.throttleTime)
    this.scroller.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.onScroll)
  },

  /** 设置表格到滚动容器距离 */
  setToTop () {
    if (this.isInnerScroll) {
      this.toTop = 0
    } else {
      this.toTop = this.$el.getBoundingClientRect().top - (this.scroller === window ? 0 : this.scroller.getBoundingClientRect().top) + getScrollTop(this.scroller)
    }
  },

  /** 获取滚动元素 */
  getScroller () {
    let el
    if (this.scrollBox) {
      if (this.scrollBox === 'window' || this.scrollBox === window) return window
      el = document.querySelector(this.scrollBox)
      if (!el) throw new Error(` scrollBox prop: '${this.scrollBox}' is not a valid selector`)
      if (!isScroller(el)) console.warn(`Warning! scrollBox prop: '${this.scrollBox}' is not a scroll element`)
      return el
    }
    if (this.$refs.antTable.scroll && this.$refs.antTable.scroll.y) {
      this.isInnerScroll = true
      return this.$el.querySelector('.ant-table-body')
    }
    return getParentScroller(this.$el)
  },

  /** 处理滚动事件 */
  handleScroll () {
    if (!this.virtualized) return
    this.updateSizes()
    this.calcRenderData()
    this.calcPosition()
  },

  /** 更新尺寸 */
  updateSizes () {
    if (!this.dynamic) return

    let rows: any = []
    if (this.isTree) {
      rows = this.$el.querySelectorAll('.ant-table-body .ant-table-row-level-0')
    } else {
      rows = this.$el.querySelectorAll('.ant-table-body .ant-table-tbody .ant-table-row')
    }

    Array.from(rows).forEach((row: any, index) => {
      const item = this.renderData[index]
      if (!item) return

      let offsetHeight = row.offsetHeight
      const nextEl = row.nextSibling as any
      if (nextEl && nextEl.classList && nextEl.classList.contains('ant-table-expanded-row')) {
        offsetHeight += row.nextSibling.offsetHeight
      }

      if (this.isTree) {
        let next = row.nextSibling as any
        while (next && next.tagName === 'TR' && !next.classList.contains('ant-table-row-level-0')) {
          offsetHeight += next.offsetHeight
          next = next.nextSibling
        }
      }

      const key = item[this.rowKey]
      if (this.sizes[key] !== offsetHeight) {
        this.$set(this.sizes, key, offsetHeight)
        row._offsetHeight = offsetHeight
      }
    })
  },

  /** 计算视图渲染数据 */
  calcRenderData () {
    const { scroller, buffer, localDataSource } = this
    const top = getScrollTop(scroller) - buffer - this.toTop
    const scrollerHeight = this.isInnerScroll ? this.$refs.antTable.scroll.y : getOffsetHeight(scroller)
    const bottom = getScrollTop(scroller) + scrollerHeight + buffer - this.toTop

    let start
    let end
    if (!this.dynamic) {
      start = top <= 0 ? 0 : Math.floor(top / this.itemSize)
      end = bottom <= 0 ? 0 : Math.ceil(bottom / this.itemSize)
    } else {
      let l = 0
      let r = localDataSource.length - 1
      let mid = 0
      while (l <= r) {
        mid = Math.floor((l + r) / 2)
        const midVal = this.getItemOffsetTop(mid)
        if (midVal < top) {
          const midNextVal = this.getItemOffsetTop(mid + 1)
          if (midNextVal > top) break
          l = mid + 1
        } else {
          r = mid - 1
        }
      }

      start = mid
      end = localDataSource.length - 1
      for (let i = start + 1; i < localDataSource.length; i++) {
        const offsetTop = this.getItemOffsetTop(i)
        if (offsetTop >= bottom) {
          end = i
          break
        }
      }
    }

    if (start % 2) {
      start = start - 1
    }
    this.top = top
    this.bottom = bottom
    this.start = start
    this.end = end
    this.renderData = localDataSource.slice(start, end + 1)
  },

  /** 计算位置并撑开高度 */
  calcPosition () {
    const last = this.localDataSource.length - 1
    const wrapHeight = this.getItemOffsetTop(last) + this.getItemSize(last)
    const offsetTop = this.getItemOffsetTop(this.start)

    TableBodyClassNames.forEach(className => {
      const el: any = this.$el.querySelector(className)
      if (!el) return

      if (!el.wrapEl) {
        const wrapEl = document.createElement('div')
        const innerEl = document.createElement('div')
        wrapEl.style.display = 'inline-block'
        innerEl.style.display = 'inline-block'
        wrapEl.appendChild(innerEl)
        innerEl.appendChild(el.children[0])
        el.insertBefore(wrapEl, el.firstChild)
        el.wrapEl = wrapEl
        el.innerEl = innerEl
      }

      if (el.wrapEl) {
        el.wrapEl.style.height = wrapHeight + 'px'
        el.innerEl.style.transform = `translateY(${offsetTop}px)`
      }
    })
  },

  /** 获取某条数据offsetTop */
  getItemOffsetTop (index: number) {
    if (!this.dynamic) {
      return this.itemSize * index
    }
    const item = this.localDataSource[index]
    if (item) {
      return this.offsetMap[item[this.rowKey]] || 0
    }
    return 0
  },

  /** 获取某条数据尺寸 */
  getItemSize (index: number) {
    if (index <= -1) return 0
    const item = this.localDataSource[index]
    if (item) {
      const key = item[this.rowKey]
      return this.sizes[key] || this.itemSize
    }
    return this.itemSize
  },

  /** 外部触发更新 */
  update () {
    this.setToTop()
    this.handleScroll()
  },

  /** 外部滚动到指定行 */
  scrollTo (index: number, stop = false) {
    const item = this.localDataSource[index]
    if (item && this.scroller) {
      this.updateSizes()
      this.calcRenderData()
      this.$nextTick(() => {
        const offsetTop = this.getItemOffsetTop(index)
        scrollToY(this.scroller, offsetTop)
        if (!stop) {
          setTimeout(() => {
            this.scrollTo(index, true)
          }, 50)
        }
      })
    }
  },

  /** 关闭虚拟滚动渲染全部数据 */
  renderAllData () {
    this.renderData = this.localDataSource
    this.$nextTick(() => {
      TableBodyClassNames.forEach(className => {
        const el: any = this.$el.querySelector(className)
        if (!el) return
        if (el.wrapEl) {
          el.wrapEl.style.height = 'auto'
          el.innerEl.style.transform = `translateY(${0}px)`
        }
      })
    })
  },

  /** nextTick 内仅执行一次 update */
  doUpdate () {
    if (this.hasDoUpdate) return
    if (!this.scroller) return

    this.isHideAppend = true
    this.update()
    this.hasDoUpdate = true
    this.$nextTick(() => {
      this.hasDoUpdate = false
      this.isHideAppend = false
    })
  }
}
