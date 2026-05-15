// @ts-nocheck
import { mergeI18nFromRoutes } from '@/utils/i18n'
import basicOptions from '@/router/async/config.async'
import routerMap from '@/router/async/router.map'
import deepMerge from 'deepmerge'

// 应用配置
const appOptions = {
  router: undefined,
  i18n: undefined,
  store: undefined
}

/**
 * 设置应用配置
 * @param options
 */
function setAppOptions (options) {
  const { router, store, i18n } = options
  appOptions.router = router
  appOptions.store = store
  appOptions.i18n = i18n
}

/**
 * 根据 异步路由配置 匹配 路由组件注册 并 解析路由
 * @param { array }routesConfig 异步路由配置
 * @param { object } routerMap 本地路由组件注册配置
 */
function parseRoutes (routesConfig, routerMap) {
  const routes = []
  routesConfig.forEach(item => {
    // 获取注册在 routerMap 中的 router，初始化 routeCfg
    let router; let routeCfg = {}
    if (typeof item === 'string') {
      router = routerMap[item]
      routeCfg = { path: (router && router.path) || item, router: item }
    } else if (typeof item === 'object') {
      router = routerMap[item.router]
      routeCfg = item
    }
    if (!router) {
      console.warn(`can't find register for router ${routeCfg.router}, please register it in advance.`)
      router = typeof item === 'string' ? { path: item, name: item } : item
    }
    // 从 router 和 routeCfg 解析路由
    const meta = {
      authority: router.authority,
      icon: router.icon,
      page: router.page,
      link: router.link,
      params: router.params,
      query: router.query,
      ...router.meta
    }
    const cfgMeta = {
      authority: routeCfg.authority,
      icon: routeCfg.icon,
      page: routeCfg.page,
      link: routeCfg.link,
      params: routeCfg.params,
      query: routeCfg.query,
      ...routeCfg.meta
    }
    Object.keys(cfgMeta).forEach(key => {
      if (cfgMeta[key] === undefined || cfgMeta[key] === null || cfgMeta[key] === '') {
        delete cfgMeta[key]
      }
    })
    Object.assign(meta, cfgMeta)
    const route = {
      path: routeCfg.path || router.path || routeCfg.router, // '/'
      name: routeCfg.name || router.name, // '首页'
      component: router.component, // TabsView
      redirect: routeCfg.redirect || router.redirect, // login
      meta: { ...meta, authority: meta.authority || '*' }
    }
    if (routeCfg.invisible || router.invisible) {
      route.meta.invisible = true
    }
    // 如果有子路由，递归子路由
    if (routeCfg.children && routeCfg.children.length > 0) {
      route.children = parseRoutes(routeCfg.children, routerMap)
    }
    routes.push(route)
  })
  return routes
}

/**
 * 合并路由
 * @param target {Route[]}
 * @param source {Route[]}
 * @returns {Route[]}
 */
function mergeRoutes (target, source) {
  const routesMap = {}
  target.forEach(item => (routesMap[item.path] = item))
  source.forEach(item => (routesMap[item.path] = item))
  return Object.values(routesMap)
}

/**
 * 深度合并路由
 * @param target {Route[]}
 * @param source {Route[]}
 * @returns {Route[]}
 */
function deepMergeRoutes (target, source) {
  // 映射路由数组
  const mapRoutes = routes => {
    const routesMap = {}
    routes.forEach(item => {
      routesMap[item.path] = {
        ...item,
        children: item.children ? mapRoutes(item.children) : undefined
      }
    })
    return routesMap
  }
  const tarMap = mapRoutes(target)
  const srcMap = mapRoutes(source)

  // 合并路由
  const merge = deepMerge(tarMap, srcMap)

  // 转换为 routes 数组
  const parseRoutesMap = routesMap => {
    return Object.values(routesMap).map(item => {
      if (item.children) {
        item.children = parseRoutesMap(item.children)
      } else {
        delete item.children
      }
      return item
    })
  }
  return parseRoutesMap(merge)
}

// 格式化后端路由数据
function formatAtTree (menuList) {
  return menuList.map(route => {
    const currentRouter = {
      router: route.path
    }
    if (route.children && route.children.length > 0) {
      currentRouter.children = formatAtTree(route.children)
    }
    return currentRouter
  })
}
/**
 * 加载路由
 * @param routesConfig {RouteConfig[]} 路由配置
 */
function loadRoutes (routesConfig) {
  // 应用配置
  const { router, store, i18n } = appOptions

  // 如果 routesConfig 有值，则更新到本地，否则从本地获取
  if (routesConfig) {
    store.commit('account/setRoutesConfig', routesConfig)
  } else {
    routesConfig = store.getters['account/routesConfig']
  }
  // 如果开启了异步路由，则加载异步路由配置
  const asyncRoutes = store.state.setting.asyncRoutes

  if (asyncRoutes && routesConfig) {
    const routes = parseRoutes(routesConfig, routerMap)
    const finalRoutes = deepMergeRoutes(basicOptions.routes, routes)
    finalRoutes.sort((a) => a.path === '/' ? -1 : 0)
    finalRoutes[0]?.children?.sort((a) => a.path === 'dashboard' ? -1 : 0)
    formatRoutes(finalRoutes)
    router.options = { ...router.options, routes: finalRoutes }
    if (router.removeRoute && router.getRoutes) {
      router.getRoutes().forEach((route) => {
        if (route.name && route.name !== 'root') {
          try {
            router.removeRoute(route.name)
          } catch (e) {}
        }
      })
      finalRoutes.forEach((route) => {
        router.addRoute(route)
      })
    } else if (router.addRoutes) {
      router.addRoutes(finalRoutes)
    }
  }
  // 提取路由国际化数据
  mergeI18nFromRoutes(i18n, router.options.routes)
  // 初始化Admin后台菜单数据
  const rootRoute = router.options.routes.find(item => item.path === '/')
  // 不需要登录就能访问的路由对象没有子路由
  const menuRoutes = rootRoute && rootRoute.children
  if (menuRoutes) {
    store.commit('setting/setMenuData', menuRoutes)
  }
}

/**
 * 格式化 router.options.routes，生成 fullPath
 * @param routes
 * @param parentPath
 */
function formatFullPath (routes, parentPath = '') {
  routes.forEach(route => {
    const isFullPath = route.path.substring(0, 1) === '/'
    route.fullPath = isFullPath ? route.path : (parentPath === '/' ? parentPath + route.path : parentPath + '/' + route.path)
    if (route.children) {
      formatFullPath(route.children, route.fullPath)
    }
  })
}

/**
 * 从路由 path 解析 i18n key
 * @param path
 * @returns {*}
 */
function getI18nKey (path) {
  const keys = path.split('/').filter(item => !item.startsWith(':') && item != '')
  keys.push('name')
  return keys.join('.')
}

/**
 * 加载导航守卫
 * @param guards
 * @param options
 */
function loadGuards (guards, options) {
  const { beforeEach, afterEach } = guards
  const { router } = options
  beforeEach.forEach(guard => {
    if (guard && typeof guard === 'function') {
      router.beforeEach((to, from, next) => guard(to, from, next, options))
    }
  })
  afterEach.forEach(guard => {
    if (guard && typeof guard === 'function') {
      router.afterEach((to, from) => guard(to, from, options))
    }
  })
}

/**
 * 格式化路由
 * @param routes 路由配置
 */
function formatRoutes (routes) {
  routes.map(route => {
    const { path } = route
    if (!path.startsWith('/') && path !== '*') {
      route.path = '/' + path
    }
    return route
  })
  formatAuthority(routes)
}

/**
 * 格式化路由的权限配置
 * @param routes 路由
 * @param pAuthorities 父级路由权限配置集合
 */
function formatAuthority (routes, pAuthorities = []) {
  routes.forEach(route => {
    const meta = route.meta
    const defaultAuthority = pAuthorities[pAuthorities.length - 1] || { permission: '*' }
    if (meta) {
      let authority = {}
      if (!meta.authority) {
        authority = defaultAuthority
      } else if (typeof meta.authority === 'string') {
        authority.permission = meta.authority
      } else if (typeof meta.authority === 'object') {
        authority = meta.authority
        const { role } = authority
        if (typeof role === 'string') {
          authority.role = [role]
        }
        if (!authority.permission && !authority.role) {
          authority = defaultAuthority
        }
      }
      meta.authority = authority
    } else {
      const authority = defaultAuthority
      route.meta = { authority }
    }
    route.meta.pAuthorities = pAuthorities
    if (route.children) {
      formatAuthority(route.children, [...pAuthorities, route.meta.authority])
    }
  })
}

export {
  getI18nKey,
  loadRoutes,
  formatFullPath,
  loadGuards,
  formatRoutes,
  setAppOptions,
  formatAuthority,
  parseRoutes,
  mergeRoutes,
  deepMergeRoutes,
  formatAtTree
}
