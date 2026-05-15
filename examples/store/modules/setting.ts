// @ts-nocheck
import config from '@/config'
import { filterMenu } from '@/utils/authority-utils'
import { formatFullPath } from '@/utils/routerUtil'
import { cloneDeep } from 'lodash'

const customTitlesStr = sessionStorage.getItem(process.env.APP_TABS_TITLES_KEY)
const customTitles = (customTitlesStr && JSON.parse(customTitlesStr)) || []

export default {
  namespaced: true,
  state: {
    // 是否是移动端
    isMobile: false,
    // 左侧菜单集合, 通过routerUtil下loadRoutes方法加载路由配置
    menuData: [],
    pageMinHeight: 0,
    activatedFirst: undefined,
    customTitles,
    ...config // layout相关配置见/src/config/default/setting.config.js
  },
  getters: {
    menuData (state, getters, rootState) {
      // 是否根据权限过滤菜单
      if (state.filterMenu) {
        const { permissions, roles } = rootState.account
        return filterMenu(cloneDeep(state.menuData), permissions, roles)
      }
      return state.menuData
    },
    firstMenu (state, getters) {
      const { menuData } = getters
      if (menuData.length > 0 && !menuData[0].fullPath) {
        formatFullPath(menuData)
      }
      return menuData.map(item => {
        const menuItem = { ...item }
        delete menuItem.children
        return menuItem
  })
    },
    subMenu (state) {
      const { menuData, activatedFirst } = state
      if (menuData.length > 0 && !menuData[0].fullPath) {
        formatFullPath(menuData)
      }
      const current = menuData.find(menu => menu.fullPath === activatedFirst)
      return (current && current.children) || []
    }
  },
  mutations: {
    setDevice (state, isMobile) {
      state.isMobile = isMobile
    },
    setLayout (state, layout) {
      state.layout = layout
    },
    setFixedSideBar (state, fixedSideBar) {
      state.fixedSideBar = fixedSideBar
    },
    setMenuData (state, menuData) {
      state.menuData = menuData
    },
    setTheme (state, theme) {
      state.theme = theme
    },
    setMultiPage (state, multiPage) {
      state.multiPage = multiPage
    },
    setAnimate (state, animate) {
      state.animate = animate
    },
    setWeekMode (state, weekMode) {
      state.weekMode = weekMode
    },
    setFixedHeader (state, fixedHeader) {
      state.fixedHeader = fixedHeader
    },
    setLang (state, lang) {
      state.lang = lang
    },
    setHideSetting (state, hideSetting) {
      state.hideSetting = hideSetting
    },
    correctPageMinHeight (state, minHeight) {
      state.pageMinHeight += minHeight
    },
    setAsyncRoutes (state, asyncRoutes) {
      state.asyncRoutes = asyncRoutes
    },
    setPageWidth (state, pageWidth) {
      state.pageWidth = pageWidth
    },
    setActivatedFirst (state, activatedFirst) {
      state.activatedFirst = activatedFirst
    },
    setFixedTabs (state, fixedTabs) {
      state.fixedTabs = fixedTabs
    },
    // 设置标签名称
    setCustomTitle (state, { path, title }) {
      if (title) {
        const obj = state.customTitles.find(item => item.path === path)
        if (obj) {
          obj.title = title
        } else {
          state.customTitles.push({ path, title })
        }
        sessionStorage.setItem(process.env.APP_TABS_TITLES_KEY, JSON.stringify(state.customTitles))
      }
    }
  }
}
