<template>
  <base-layout>
    <contextmenu :itemList="menuItemList" @select="onMenuSelect" v-model:visible="menuVisible" />
    <tabs-header
      v-if="multiPage"
      :active="activePage"
      :page-list="pageList"
      @change="changePage"
      @close="remove"
      @refresh="refresh"
      @contextmenu="onContextmenu"
    />
    <div :class="['tabs-view-content', layout, pageWidth]" :style="`margin-top: ${multiPage ? -24 : 0}px`">
      <page-toggle-transition :disabled="animate.disabled" :animate="animate.name" :direction="animate.direction">
        <router-view v-slot="{ Component }">
          <keep-alive v-if="multiPage && cachePage">
            <component
              v-if="!refreshing && Component"
              :is="Component"
              ref="tabContent"
              :key="routeViewKey"
            />
          </keep-alive>
          <component
            v-else-if="!refreshing && Component"
            :is="Component"
            ref="tabContent"
            :key="routeViewKey"
          />
        </router-view>
      </page-toggle-transition>
  </div>
  </base-layout>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import BaseLayout from '../BaseLayout.vue'
import Contextmenu from './Contextmenu.vue'
import TabsHeader from './TabsHeader.vue'
import PageToggleTransition from '@/components/transition/PageToggleTransition'
import { getI18nKey } from '@/utils/routerUtil'
import i18n from './i18n'
export default {
  name: 'TabsView',
  i18n,
  components: { TabsHeader, PageToggleTransition, Contextmenu, BaseLayout },
  data () {
    return {
      clearCaches: [],
      pageList: [],
      activePage: '',
      menuVisible: false,
      refreshing: false,
      excludeKeys: []
    }
  },
  computed: {
    ...mapState('setting', ['multiPage', 'cachePage', 'animate', 'layout', 'pageWidth']),
    menuItemList () {
      return [
        { key: '1', icon: 'vertical-right', text: this.$t('closeLeft') },
        { key: '2', icon: 'vertical-left', text: this.$t('closeRight') },
        { key: '3', icon: 'close', text: this.$t('closeOthers') },
        { key: '4', icon: 'sync', text: this.$t('refresh') }
      ]
    },
    /** 用 path 不用 fullPath：避免 query/hash 二次归一化导致 key 连续变化、子页重复 mounted */
    routeViewKey () {
      return this.$route.path
    },
    tabsOffset () {
      return this.multiPage ? 24 : 0
    }
  },
  created () {
    this.loadCacheConfig(this.$router?.options?.routes)
    this.loadCachedTabs()
    const route = this.$route
    if (this.pageList.findIndex(item => item.path === route.path) === -1) {
      this.pageList.push(this.createPage(route))
    }
    this.activePage = route.fullPath
    if (this.multiPage) {
      this.$nextTick(() => {
        this.setCachedKey(route)
  })
      this.addListener()
    }
  },
  mounted () {
    this.correctPageMinHeight(-this.tabsOffset)
  },
  beforeUnmount () {
    this.removeListener()
    this.correctPageMinHeight(this.tabsOffset)
  },
  watch: {
    '$router.options.routes': function (val) {
      this.excludeKeys = []
      this.loadCacheConfig(val)
    },
    $route: function (newRoute) {
      this.activePage = newRoute.fullPath
      const page = this.pageList.find(item => item.path === newRoute.path)
      if (!this.multiPage) {
        this.pageList = [this.createPage(newRoute)]
      } else if (page) {
        if (page.fullPath != newRoute.fullPath) {
          page.fullPath = newRoute.fullPath
          // 默认不因 fullPath 变化强制重载组件，避免 mounted 二次触发。
          // 如确需 query 变化时重载，可在路由上配置 meta.page.refreshOnFullPathChange = true。
          const needRefresh = Boolean(newRoute?.meta?.page?.refreshOnFullPathChange)
          if (needRefresh) {
            this.refresh(page.path, page)
          }
        } else {
          page.fullPath = newRoute.fullPath
        }
      } else if (!page) {
        this.pageList.push(this.createPage(newRoute))
      }
      if (this.multiPage) {
        this.$nextTick(() => {
          this.setCachedKey(newRoute)
   })
      }
    },
    multiPage: function (newVal) {
      if (!newVal) {
        this.pageList = [this.createPage(this.$route)]
        this.removeListener()
      } else {
        this.addListener()
      }
    },
    tabsOffset (newVal, oldVal) {
      this.correctPageMinHeight(oldVal - newVal)
    }
  },
  methods: {
    changePage (key) {
      this.activePage = key
      const page = this.pageList.find(item => item.fullPath === key)
      this.$router.push(page.fullPath)
    },
    remove (key, nextRoute) {
      // 进行深拷贝，防止数组处理的过程中改变原数组。
      const currentPageList = [...this.pageList]
      if (this.pageList.length === 1) {
        return this.$message.warning(this.$t('warn'))
      }
      // 清除缓存
      let index = this.pageList.findIndex(item => item.fullPath === key)
      this.clearCaches = this.pageList.splice(index, 1).map(page => page.cachedKey)
      if (nextRoute) {
        this.$router.push(nextRoute)
      } else if (key === this.activePage) {
        index = index >= this.pageList.length ? this.pageList.length - 1 : index
        this.activePage = currentPageList[index].fullPath
        this.$router.push(this.activePage)
      }
    },
    refresh (key, page) {
      page = page || this.pageList.find(item => item.path === key)
      page.loading = true
      this.clearCache(page)
      if (key === this.activePage) {
        this.reloadContent(() => (page.loading = false))
      } else {
        // 其实刷新很快，加这个延迟纯粹为了 loading 状态多展示一会儿，让用户感知刷新这一过程
        // setTimeout(() => (page.loading = false), 500)
        page.loading = false
      }
    },
    onContextmenu (pageKey, e) {
      if (!pageKey) return
      e?.preventDefault?.()
      if (e) e.meta = pageKey
      this.menuVisible = true
    },
    onMenuSelect (key, target, pageKey) {
      this.menuVisible = false
      switch (key) {
        case '1': this.closeLeft(pageKey); break
        case '2': this.closeRight(pageKey); break
        case '3': this.closeOthers(pageKey); break
        case '4': this.refresh(pageKey); break
        default: break
      }
    },
    closeOthers (pageKey) {
      // 清除缓存
      const clearPages = this.pageList.filter(item => item.path !== pageKey && !item.unclose)
      this.clearCaches = clearPages.map(item => item.cachedKey)
      this.pageList = this.pageList.filter(item => !clearPages.includes(item))
      // 判断跳转
      if (this.activePage != pageKey) {
        this.activePage = pageKey
        this.$router.push(this.activePage)
      }
    },
    closeLeft (pageKey) {
      const index = this.pageList.findIndex(item => item.path === pageKey)
      // 清除缓存
      const clearPages = this.pageList.filter((item, i) => i < index && !item.unclose)
      this.clearCaches = clearPages.map(item => item.cachedKey)
      this.pageList = this.pageList.filter(item => !clearPages.includes(item))
      // 判断跳转
      if (!this.pageList.find(item => item.path === this.activePage)) {
        this.activePage = pageKey
        this.$router.push(this.activePage)
      }
    },
    closeRight (pageKey) {
      // 清除缓存
      const index = this.pageList.findIndex(item => item.path === pageKey)
      const clearPages = this.pageList.filter((item, i) => i > index && !item.unclose)
      this.clearCaches = clearPages.map(item => item.cachedKey)
      this.pageList = this.pageList.filter(item => !clearPages.includes(item))
      // 判断跳转
      if (!this.pageList.find(item => item.path === this.activePage)) {
        this.activePage = pageKey
        this.$router.push(this.activePage)
      }
    },
    clearCache (page) {
      page._init_ = false
      this.clearCaches = [page.cachedKey]
    },
    reloadContent (onLoaded) {
      this.refreshing = true
      setTimeout(() => {
        this.refreshing = false
        this.$nextTick(() => {
          this.setCachedKey(this.$route)
          if (typeof onLoaded === 'function') {
            onLoaded.apply(this, [])
          }
        })
      }, 200)
    },
    pageName (page) {
      return this.$t(getI18nKey(page.keyPath))
    },
    /**
     * 添加监听器
     */
    addListener () {
      window.addEventListener('page:close', this.closePageListener)
      window.addEventListener('page:refresh', this.refreshPageListener)
      window.addEventListener('unload', this.unloadListener)
    },
    /**
     * 移出监听器
     */
    removeListener () {
      window.removeEventListener('page:close', this.closePageListener)
      window.removeEventListener('page:refresh', this.refreshPageListener)
      window.removeEventListener('unload', this.unloadListener)
    },
    /**
     * 页签关闭事件监听
     * @param event 页签关闭事件
     */
    closePageListener (event) {
      const { closeRoute, nextRoute } = event.detail
      const closePath = typeof closeRoute === 'string' ? closeRoute : closeRoute.fullPath
      // const path = closePath && closePath.split('?')[0]
      this.remove(closePath, nextRoute)
    },
    /**
     * 页面刷新事件监听
     * @param event 页签关闭事件
     */
    refreshPageListener (event) {
      const { pageKey } = event.detail
      const path = pageKey && pageKey.split('?')[0]
      this.refresh(path)
    },
    /**
     * 页面 unload 事件监听器，添加页签到 session 缓存，用于刷新时保留页签
     */
    unloadListener () {
      const tabs = this.pageList.map(item => ({ ...item, _init_: false }))
      sessionStorage.setItem(process.env.APP_TABS_KEY, JSON.stringify(tabs))
    },
    createPage (route) {
      const lastMatch = route.matched && route.matched.length > 0 ? route.matched[route.matched.length - 1] : null
      const routeMeta = route.meta || {}
      const pageMeta = routeMeta.page || {}
      return {
        keyPath: (lastMatch && lastMatch.path) || route.path,
        fullPath: route.fullPath,
        loading: false,
        path: route.path,
        title: pageMeta.title || routeMeta.title || route.name || '',
        unclose: pageMeta.closable === false
      }
    },
    /**
     * 设置页面缓存的key
     * @param route 页面对应的路由
     */
    setCachedKey (route) {
      const page = this.pageList.find(item => item.path === route.path)
      if (!page) return
      page.unclose = route.meta && route.meta.page && (route.meta.page.closable === false)
      if (!page._init_) {
        /** ref 指向 router-view 渲染的页面根组件（插槽 :is），用于稳定 cachedKey */
        const tabContentRef = this.$refs.tabContent
        const vnode = tabContentRef && (tabContentRef.$vnode || tabContentRef.$?.vnode)
        const uid = tabContentRef && (tabContentRef._uid || tabContentRef.$?.uid || 0)
        const vnodeKey = (vnode && vnode.key) || route.fullPath || route.path
        page.cachedKey = `${String(vnodeKey)}::${uid}`
        page._init_ = true
      }
    },
    /**
     * 加载缓存的 tabs
     */
    loadCachedTabs () {
      const cachedTabsStr = sessionStorage.getItem(process.env.APP_TABS_KEY)
      if (cachedTabsStr) {
        try {
          const cachedTabs = JSON.parse(cachedTabsStr)
          if (cachedTabs.length > 0) {
            this.pageList = cachedTabs
          }
        } catch (e) {
          console.warn('failed to load cached tabs, got exception:', e)
        } finally {
          sessionStorage.removeItem(process.env.APP_TABS_KEY)
        }
      }
    },
    loadCacheConfig (routes, pCache = true) {
      routes.forEach(item => {
        const cacheAble = item.meta?.page?.cacheAble ?? pCache ?? true
        if (!cacheAble) {
          this.excludeKeys.push(new RegExp(`${item.path}\\d+$`))
        }
        if (item.children) {
          this.loadCacheConfig(item.children, cacheAble)
        }
      })
    },
    ...mapMutations('setting', ['correctPageMinHeight'])
  }
}
</script>
<style lang="less" scoped >
</style>
