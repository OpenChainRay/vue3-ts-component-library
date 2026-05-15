// @ts-nocheck
/**
 * @description 数据对象管理
 */

import { request, METHOD } from '@/utils/request'
const BASE_URL = process.env.APP_API_BASE_URL
// const UMS_URL = process.env.APP_UMS_URL

// 数据对象管理-列表
export async function getDataPage (params) {
  // const { pageNo, pageSize } = params
  return request({
    url: `${BASE_URL}/dataObject/page`,
    method: METHOD.POST,
    params: params
  })
}

// 数据对象管理-是否启用-停用
export async function changeDisable (parameter) {
  const { id, params } = parameter
  return request({
    url: `${BASE_URL}/dataObject/disable/${id}`,
    method: METHOD.PUT,
    params: params
  })
}

// 数据对象管理-是否启用-启用
export async function changeEnable (parameter) {
  const { id, params } = parameter
  return request({
    url: `${BASE_URL}/dataObject/enable/${id}`,
    method: METHOD.PUT,
    params: params
  })
}

// 数据对象管理-新增
export async function dataObjectAdd (params) {
  return request({
    url: `${BASE_URL}/dataObject`,
    method: METHOD.POST,
    params: params
  })
}

// 数据对象管理-修改
export async function dataObjectModify (params) {
  return request({
    url: `${BASE_URL}/dataObject`,
    method: METHOD.PUT,
    params: params
  })
}
// 初始化数据对象
export async function initDataObj (params) {
  return request({
    url: `${BASE_URL}/dataObject/init`,
    method: METHOD.GET,
    params: params
  })
}
