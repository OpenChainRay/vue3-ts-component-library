/**
 * 获取字符串长度，英文字符长度 1，中文字符长度 2。
 */
export const getStrFullLength = (str = "") =>
  str.split("").reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0)
    if (charCode >= 0 && charCode <= 128) {
      return pre + 1
    }
    return pre + 2
  }, 0)

/**
 * 截取字符串，根据 maxLength 截取后返回。
 */
export const cutStrByFullLength = (str = "", maxLength = 0) => {
  let showLength = 0
  return str.split("").reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0)
    if (charCode >= 0 && charCode <= 128) {
      showLength += 1
    } else {
      showLength += 2
    }
    if (showLength <= maxLength) {
      return pre + cur
    }
    return pre
  }, "")
}

/**
 * 判断一个值是否是数组。
 */
export function isArray(value: unknown): value is unknown[] {
  return Object.prototype.toString.call(value) === "[object Array]"
}

/**
 * 判断一个值是否是对象。
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === "[object Object]"
}

/**
 * 判断一个值是否是函数。
 */
export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return Object.prototype.toString.call(value) === "[object Function]"
}

/**
 * 判断一个值是否是字符串。
 */
export function isString(value: unknown): value is string {
  return Object.prototype.toString.call(value) === "[object String]"
}

const chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678"

/**
 * 生成随机字符串。
 */
export function createId(len = 16): string {
  let str = ""
  for (let a = 0; a < len; a += 1) {
    str += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return str
}
