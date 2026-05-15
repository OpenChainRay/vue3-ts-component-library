// @ts-nocheck
import { request, METHOD } from '@/utils/request'

const umsBaseUrl = process.env.APP_UMS_URL
const APP_crm_URL = process.env.APP_crm_URL
const AMS_URL = process.env.APP_AMS_URL


// 获取用户信息（其中包含该用户所属销售部门）
// 接口位置 UMS-用户管理接口-查询：获取用户信息
export async function getUserInfo (params) {
  return request({
    url: `${umsBaseUrl}/user/getUserInfo`,
    method: METHOD.GET,
    params: params
  })
}
// 获取集团所有组织（公司）
export async function getAllOrganizations () {
  return request({
    url: `${umsBaseUrl}/organization/listOption`,
    method: METHOD.GET
  })
}


export async function getCustomerList (params) {
  return await request({
    url: `${APP_crm_URL}/customerCompany/page`,
    method: METHOD.POST,
    params: params
  }).catch((error) => { throw new Error(error) })
}

// 修改列展示 视图保存接口
export function upDateVwView (params) {
  return request({
    url: `${AMS_URL}/view/update`,
    method: METHOD.POST,
    params: params
  })
}
