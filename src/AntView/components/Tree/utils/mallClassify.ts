import { request, METHOD } from "@/utils/request"

const BASE_URL = process.env.APP_API_BASE_URL

/**
 * 商城分类请求封装。
 */
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

export const addMallClassify = (params: unknown) => req(`${BASE_URL}/categoryCommodity`, METHOD.POST, params)
export const disableMallShow = (id: string | number) => req(`${BASE_URL}/categoryCommodity/deactivate/${id}`, METHOD.PUT)
export const deleteMallClassify = (id: string | number) => req(`${BASE_URL}/categoryCommodity/delete/${id}`, METHOD.DELETE)
export const disableMallClassify = (id: string | number) => req(`${BASE_URL}/categoryCommodity/disableCategoryCommodity/${id}`, METHOD.PUT)
export const updateMallClassify = (params: unknown) => req(`${BASE_URL}/categoryCommodity/edit`, METHOD.PUT, params)
export const enableMallShow = (id: string | number) => req(`${BASE_URL}/categoryCommodity/enable/${id}`, METHOD.PUT)
export const enableMallClassify = (id: string | number) => req(`${BASE_URL}/categoryCommodity/enableCategoryCommodity/${id}`, METHOD.PUT)
export const getMallPage = (params: unknown) => req(`${BASE_URL}/categoryCommodity/pageByType`, METHOD.POST, params)
export const getMallPageNode = (id: string | number) => req(`${BASE_URL}/categoryCommodity/child/${id}`, METHOD.GET)
export const getMallPageEnableNode = (id: string | number) => req(`${BASE_URL}/categoryCommodity/enableChild/${id}`, METHOD.GET)
export const getMallFatherNode = () => req(`${BASE_URL}/categoryCommodity/child/-1`, METHOD.GET)
export const getMallFatherEnableNode = () => req(`${BASE_URL}/categoryCommodity/enableChild/-1`, METHOD.GET)
export const getMallParent = (pid: string | number) => req(`${BASE_URL}/categoryCommodity/parent/${pid}`, METHOD.GET)
export const getMallEnableParent = (pid: string | number) => req(`${BASE_URL}/categoryCommodity/enableParent/${pid}`, METHOD.GET)
export const updateCategoryPic = (params: unknown) => req(`${BASE_URL}/categoryCommodity/uploadCategoryPic`, METHOD.PUT, params)
export const updateListPic = (params: unknown) => req(`${BASE_URL}/categoryCommodity/uploadListPic`, METHOD.PUT, params)
export const getCommodityTreeList = () => request({ url: `${BASE_URL}/categoryCommodity/getTree`, method: METHOD.GET })
export const uploadLargePic = (params: unknown) => req(`${BASE_URL}/categoryCommodity/uploadLargePic`, METHOD.PUT, params)
export const getCommodityAllTreeList = () =>
  request({
    url: `${BASE_URL}/categoryCommodity/getTree`,
    method: METHOD.GET,
    contentType: "application/x-www-form-urlencoded",
    data: { isGetAll: true }
  })
export const getCommodityByCondition = (param: unknown) =>
  request({
    url: `${BASE_URL}/categoryCommodity/getTree`,
    method: METHOD.GET,
    contentType: "application/x-www-form-urlencoded",
    data: param
  })
