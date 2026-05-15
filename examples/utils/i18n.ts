import { createI18n } from "vue-i18n"
import routesI18n from "@/router/i18n"
import "./Objects"
import { getI18nKey } from "@/utils/routerUtil"

/**
 * 创建 i18n 实例。
 */
function initI18n(locale: string, fallback: string) {
  return createI18n({
    legacy: true,
    locale,
    fallbackLocale: fallback,
    messages: {}
  })
}

/**
 * 递归生成路由国际化文案。
 */
function generateI18n(lang: Record<string, unknown>, routes: Array<Record<string, any>>, valueKey: string) {
  routes.forEach((route) => {
    const keys = getI18nKey(route.fullPath).split(".")
    const value =
      valueKey === "path"
        ? route[valueKey]
            .split("/")
            .filter((item: string) => !item.startsWith(":") && item !== "")
            .join(".")
        : route[valueKey]
    ;(lang as any).assignProps(keys, value)
    if (route.children) {
      generateI18n(lang, route.children, valueKey)
    }
  })
  return lang
}

/**
 * 补全 fullPath 字段。
 */
function formatFullPath(routes: Array<Record<string, any>>, parentPath = "") {
  routes.forEach((route) => {
    const isFullPath = route.path.substring(0, 1) === "/"
    route.fullPath = isFullPath ? route.path : parentPath === "/" ? parentPath + route.path : `${parentPath}/${route.path}`
    if (route.children) {
      formatFullPath(route.children, route.fullPath)
    }
  })
}

/**
 * 从路由合并国际化数据。
 */
function mergeI18nFromRoutes(i18n: ReturnType<typeof createI18n>, routes: Array<Record<string, any>>) {
  formatFullPath(routes)
  const cn = generateI18n({}, routes, "name")
  const us = generateI18n({}, routes, "path")
  ;(i18n.global as any).mergeLocaleMessage("CN", cn)
  ;(i18n.global as any).mergeLocaleMessage("US", us)
  const messages = (routesI18n as any).messages
  Object.keys(messages).forEach((lang) => {
    ;(i18n.global as any).mergeLocaleMessage(lang, messages[lang])
  })
}

export { initI18n, mergeI18nFromRoutes, formatFullPath }
