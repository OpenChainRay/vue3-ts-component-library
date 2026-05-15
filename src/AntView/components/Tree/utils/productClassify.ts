import { request, METHOD } from "@/utils/request"

let BASE_URL = ""

/**
 * 设置产品分类服务地址。
 */
export function setPmsBaseUrl(options: { APP_API_BASE_URL?: string } = {}) {
  BASE_URL = options.APP_API_BASE_URL || ""
}

async function req(url: string, method: string, params?: unknown, extra?: Record<string, unknown>) {
  return await request({
    url,
    method,
    ...(params !== undefined ? { params } : {}),
    ...(extra || {})
  }).catch((error) => {
    throw new Error(error as string)
  })
}

export const getProductFatherNode = () => req(`${BASE_URL}/categoryProduct/child/-1`, METHOD.GET)
export const getProductFatherEnableNode = () => req(`${BASE_URL}/categoryProduct/enableChild/-1`, METHOD.GET)
export const getProductTreeNode = (id: string | number) => req(`${BASE_URL}/categoryProduct/child/${id}`, METHOD.GET)
export const getProductTreeEnableNode = (id: string | number) => req(`${BASE_URL}/categoryProduct/enableChild/${id}`, METHOD.GET)
export const getProductParent = (pid: string | number) => req(`${BASE_URL}/categoryProduct/parent/${pid}`, METHOD.GET)
export const getProductEnableParent = (pid: string | number) => req(`${BASE_URL}/categoryProduct/enableParent/${pid}`, METHOD.GET)
export const addProduct = (params: unknown) => req(`${BASE_URL}/categoryProduct/add`, METHOD.POST, params)
export const editProduct = (params: unknown) => req(`${BASE_URL}/categoryProduct/edit`, METHOD.PUT, params)
export const disableProduct = (id: string | number) => req(`${BASE_URL}/categoryProduct/disable/${id}`, METHOD.PUT)
export const enableProduct = (id: string | number) => req(`${BASE_URL}/categoryProduct/enable/${id}`, METHOD.PUT)
export const delProduct = (id: string | number) => req(`${BASE_URL}/categoryProduct/delete/${id}`, METHOD.PUT)
export const listProduct = (params: unknown) => req(`${BASE_URL}/categoryProduct/pageByType`, METHOD.POST, params)
export const deleteProductList = (id: string | number) => req(`${BASE_URL}/categoryProduct/delete/${id}`, METHOD.DELETE)
export const getProductTreeList = () => request({ url: `${BASE_URL}/categoryProduct/getTree`, method: METHOD.GET })
export const getProductAllTreeList = () =>
  request({
    url: `${BASE_URL}/categoryProduct/getTree`,
    method: METHOD.GET,
    contentType: "application/x-www-form-urlencoded",
    data: { isGetAll: true }
  })
export const getProductTreeByCondition = (param: unknown) =>
  request({
    url: `${BASE_URL}/categoryProduct/getTree`,
    method: METHOD.GET,
    contentType: "application/x-www-form-urlencoded",
    data: param
  })
export const getTaxCodeList = () => request({ url: `${BASE_URL}/prodTaxSortCode/queryList`, method: METHOD.GET })
export const getBrandList = (params: unknown) => request({ url: `${BASE_URL}/brand/brandListByBrandName`, method: METHOD.POST, params })
