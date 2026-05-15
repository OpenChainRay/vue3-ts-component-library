import { createWebHashHistory, createRouter, type RouteRecordRaw } from "vue-router"
import { formatRoutes } from "@/utils/routerUtil"
import asyncRouterConfig from "./async/config.async"
import routerConfig from "./config"

type RouterConfig = { routes: RouteRecordRaw[] }

const loginIgnore = {
  names: ["登录页", "exp404", "exp403", "exp500"],
  paths: ["/login", "/404", "/403", "/500"],
  includes(route: { name?: string | symbol | null; path: string }) {
    return this.names.includes(String(route.name ?? "")) || this.paths.includes(route.path)
  }
}

/**
 * 初始化路由实例，兼容旧调用。
 */
function initRouter(isAsync: boolean) {
  const options = (isAsync ? asyncRouterConfig : routerConfig) as RouterConfig
  formatRoutes(options.routes)

  const router = createRouter({
    history: createWebHashHistory(),
    routes: options.routes
  })

  ;(router as any).options = options
  return router
}

export { initRouter, loginIgnore }
