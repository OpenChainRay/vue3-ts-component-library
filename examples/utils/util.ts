// @ts-nocheck

export function isDef (v) {
  return v !== undefined && v !== null
}

/**
 * Remove an item from an array.
 */
export function remove (arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

const _toString = Object.prototype.toString
export function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

export function enquireScreen (call) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    call && call(false)
    return
  }
  const mediaQuery = window.matchMedia('only screen and (max-width: 767.99px)')
  const handleChange = (event) => {
    call && call(event.matches)
  }
  handleChange(mediaQuery)
  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', handleChange)
    return
  }
  if (typeof mediaQuery.addListener === 'function') {
    mediaQuery.addListener(handleChange)
  }
}

/**
 * UUID生成
 */
export const UUID = () => {
  let d = new Date().getTime()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    // eslint-disable-next-line no-bitwise
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    // eslint-disable-next-line no-bitwise
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  }
  })
}

export const getUrlKey = function (name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null
}

/**
 * 接口Blob文件流转文档, 默认转成excel
 * @param data Blob文档流
 * @param fileName 转成文件的文件名
 */
export const exportExcel = ({ data, fileName = '模版.xlsx', blobConfig = { type: 'application/vnd.ms-excel;charset=utf-8' } }) => {
  const blob = new Blob([data], blobConfig)
  // 判断浏览器
  let brower = ''
  if (navigator.userAgent.indexOf('Edge') > -1) {
    brower = 'Edge'
  }
  if ('download' in document.createElement('a')) {
    // 非IE下载
    if (brower == 'Edge') {
      navigator.msSaveBlob(blob, fileName)
      return
    }
    const eLink = document.createElement('a')
    eLink.download = fileName
    eLink.style.display = 'none'
    eLink.href = URL.createObjectURL(blob)
    document.body.appendChild(eLink)
    eLink.click()
    URL.revokeObjectURL(eLink.href)
    // 释放URL 对象
    document.body.removeChild(eLink)
  } else {
    // IE10+下载
    navigator.msSaveBlob(blob, fileName)
  }
}
// 如果传入对象中包含的属性值为undefined,null,'' 则返回一个不包含这些属性的新对象
export const filterPropertyByFalse = (currentObj) => {
  const newObj = {}
  for (const p in currentObj) {
    if (currentObj[p]) newObj[p] = currentObj[p]
  }
  return newObj
}
