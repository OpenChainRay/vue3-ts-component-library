/** 是否已定义 */
export function isDef (v: unknown) {
  return v !== undefined && v !== null
}

/** 移除数组元素 */
export function remove<T> (arr: T[], item: T) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

const _toString = Object.prototype.toString

/** 是否正则 */
export function isRegExp (v: unknown) {
  return _toString.call(v) === '[object RegExp]'
}

/** 屏幕宽度监听 */
export function enquireScreen (call?: (matched: boolean) => void) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    call && call(false)
    return
  }
  const mediaQuery = window.matchMedia('only screen and (max-width: 767.99px)')
  const handleChange = (event: MediaQueryList | MediaQueryListEvent) => {
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

/** UUID 生成 */
export const UUID = () => {
  let d = new Date().getTime()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

/** 读取 URL 参数 */
export const getUrlKey = function (name: string) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null
}

type ExportExcelOptions = {
  data: BlobPart
  fileName?: string
  blobConfig?: BlobPropertyBag
}

/** Blob 文件导出 */
export const exportExcel = ({ data, fileName = '模版.xlsx', blobConfig = { type: 'application/vnd.ms-excel;charset=utf-8' } }: ExportExcelOptions) => {
  const blob = new Blob([data], blobConfig)
  let brower = ''
  if (navigator.userAgent.indexOf('Edge') > -1) {
    brower = 'Edge'
  }
  if ('download' in document.createElement('a')) {
    if (brower === 'Edge') {
      ;(navigator as any).msSaveBlob(blob, fileName)
      return
    }
    const eLink = document.createElement('a')
    eLink.download = fileName
    eLink.style.display = 'none'
    eLink.href = URL.createObjectURL(blob)
    document.body.appendChild(eLink)
    eLink.click()
    URL.revokeObjectURL(eLink.href)
    document.body.removeChild(eLink)
  } else {
    ;(navigator as any).msSaveBlob(blob, fileName)
  }
}
