import * as Vue from "vue"

export * from "vue"

/**
 * 兼容 Vue2 composition-api 的 set 行为。
 */
export function set<T extends Record<string, unknown>, K extends string>(
  target: T,
  key: K,
  value: unknown
) {
  ;(target as Record<string, unknown>)[key] = value
  return value
}

/**
 * 兼容 Vue2 composition-api 的 del 行为。
 */
export function del<T extends Record<string, unknown>, K extends string>(target: T, key: K) {
  delete (target as Record<string, unknown>)[key]
}

/**
 * 兼容 Vue2 composition-api 插件安装调用。
 */
export function install() {}

export default {
  ...Vue,
  install,
  set,
  del
}
