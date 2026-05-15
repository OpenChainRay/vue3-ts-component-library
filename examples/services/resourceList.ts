// @ts-nocheck
/**
 * @description 资源管理
 */

import { request, METHOD } from '@/utils/request'
const BASE_URL = process.env.APP_API_BASE_URL
// const UMS_URL = process.env.APP_UMS_URL

// 资源管理-列表
export async function getResourcePage (params) {
  // const { pageNo, pageSize } = params
  return request({
    url: `${BASE_URL}/resource/page`,
    method: METHOD.POST,
    params: params
  })
}

// 资源管理-是否有效-停用
export async function changeDisable (parameter) {
  const { id, params } = parameter
  return request({
    url: `${BASE_URL}/resource/disable/${id}`,
    method: METHOD.PUT,
    params: params
  })
}

// 资源管理-是否有效-启用
export async function changeEnable (parameter) {
  const { id, params } = parameter
  return request({
    url: `${BASE_URL}/resource/enable/${id}`,
    method: METHOD.PUT,
    params: params
  })
}

// 资源管理-新增
export async function resourceAdd (params) {
  return request({
    url: `${BASE_URL}/resource`,
    method: METHOD.POST,
    params: params
  })
}

// 资源管理-修改
export async function resourceModify (params) {
  return request({
    url: `${BASE_URL}/resource`,
    method: METHOD.PUT,
    params: params
  })
}
