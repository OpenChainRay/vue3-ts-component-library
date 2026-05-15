// @ts-nocheck
import { checkAuthorization } from '@/utils/request'
import NProgress from 'nprogress'
import { loginIgnore } from '@/router/index'
import { hasAuthority, hasToRoute } from '@/utils/authority-utils'
NProgress.configure({ showSpinner: false })

/**
 * 进度条开始
 * @param to
 * @param form
 * @param next
 */
const progressStart = (to, from, next) => {
  // start progress bar
  if (!NProgress.isStarted()) {
    NProgress.start()
  }
  next()
}

/**
 * 登录守卫,检查token是否过去
 * @param to
 * @param form
 * @param next
 * @param options
 */
const loginGuard = (to, from, next, options) => {
  const { message } = options
  if (!loginIgnore.includes(to) && !checkAuthorization()) {
    message.warning('登录已失效，请重新登录')
    next({ path: '/login' })
  } else {
    next()
  }
}

/**
 * 权限守卫
 * @param to
 * @param form
 * @param next
 * @param options
 */
export const authorityGuard = (to, from, next, options) => {
  const { store, message } = options
  const permissions = store.getters['account/permissions']
  const roles = store.getters['account/roles']
  if (!hasAuthority(to, permissions, roles)) {
    message.warning(`对不起，您无权访问页面: ${to.fullPath}，请联系管理员`)
    next({ path: '/403' })
    // NProgress.done()
  } else {
    next()
  }
}

/**
 * 权限守卫-根据动态菜单判断
 * @param to
 * @param form
 * @param next
 * @param options
 */
export const authorityGuardByRoute = (to, from, next, options) => {
  const { message } = options
  if (to.matched.length === 0) {
    message.warning(`对不起，您无权访问页面: ${to.fullPath}，请联系管理员`)
    next({ path: '/403' })
    // NProgress.done()
  } else {
    next()
  }
}

/**
 * 混合导航模式下一级菜单跳转重定向
 * @param to
 * @param from
 * @param next
 * @param options
 * @returns {*}
 */
const redirectGuard = (to, from, next, options) => {
  const { store } = options
  const getFirstChild = (routes) => {
    const route = routes[0]
    if (!route.children || route.children.length === 0) {
      return route
    }
    return getFirstChild(route.children)
  }
  if (store.state.setting.layout === 'mix') {
    const firstMenu = store.getters['setting/firstMenu']
    if (firstMenu.find(item => item.fullPath === to.fullPath)) {
      store.commit('setting/setActivatedFirst', to.fullPath)
      const subMenu = store.getters['setting/subMenu']
      if (subMenu.length > 0) {
        const redirect = getFirstChild(subMenu)
        return next({ path: redirect.fullPath })
      }
    }
  }
  next()
}

/**
 * 检测将要访问的页面是否存在于异步获取的路由配置中
 *
 * @param {*} to
 * @param {*} from
 * @param {*} next
 * @param {*} options
 */
const checkRoute = (to, from, next, options) => {
  const { message } = options
  if (hasToRoute(to, options.router.options.routes) < 0) {
    message.warning(`对不起，您无权访问页面: ${to.name}，请联系管理员`)
    next({ path: '/403' })
  } else {
    next()
  }
}

/**
 * 进度条结束
 * @param to
 * @param form
 * @param options
 */
const progressDone = () => {
  // finish progress bar
  NProgress.done()
}

export default {
  beforeEach: [progressStart, loginGuard, checkRoute, authorityGuardByRoute, redirectGuard],
  afterEach: [progressDone]
}
