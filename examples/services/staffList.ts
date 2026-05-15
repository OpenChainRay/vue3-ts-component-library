// @ts-nocheck
/**
 * @description 岗位管理
 */

import { request, METHOD } from '@/utils/request'
const BASE_URL = process.env.APP_API_BASE_URL
// const UMS_URL = process.env.APP_UMS_URL

// 岗位管理-列表
export async function getStaffPage (params) {
  // const { pageNo, pageSize } = params
  return request({
    url: `${BASE_URL}/position/pageByType`,
    method: METHOD.POST,
    params: params
  })
}

// 岗位管理-是否有效-停用
export async function changeDisable (parameter) {
  const { id, params } = parameter
  return request({
    url: `${BASE_URL}/position/disable/${id}`,
    method: METHOD.PUT,
    params: params
  })
}

// 岗位管理-是否有效-启用
export async function changeEnable (parameter) {
  const { id, params } = parameter
  return request({
    url: `${BASE_URL}/position/enable/${id}`,
    method: METHOD.PUT,
    params: params
  })
}

// 岗位管理-新增
export async function staffAdd (params) {
  return request({
    url: `${BASE_URL}/position/add`,
    method: METHOD.POST,
    params: params
  })
}

// 岗位管理-修改
export async function staffModify (params) {
  return request({
    url: `${BASE_URL}/position/edit`,
    method: METHOD.PUT,
    params: params
  })
}

// 岗位管理-删除
// export async function staffDelete (params) {
//   const { id } = params
//   return request({
//     url: `${BASE_URL}/position/delete/${id}`,
//     method: METHOD.DELETE,
//     params: params
//   })
// }
