// @ts-nocheck
import { request, METHOD } from '@/utils/request'

const BASE_URL = process.env.APP_API_BASE_URL

// 获取用户信息（其中包含该用户所属销售部门）
// 接口位置 UMS-用户管理接口-查询：获取用户信息
export async function getUserByPage (params) {
  return request({
    url: `${BASE_URL}/user/page`,
    method: METHOD.POST,
    params: params
  })
}
// 启用用户
export async function enableUser (params) {
  const { id } = params
  return request({
    url: `${BASE_URL}/user/enable/${id}`,
    method: METHOD.PUT
  })
}
// 停用用户
export async function disableUser (params) {
  const { id } = params
  return request({
    url: `${BASE_URL}/user/disable/${id}`,
    method: METHOD.PUT
  })
}
// 重置密码
export async function initPassword (params) {
  const { id } = params
  return request({
    url: `${BASE_URL}/user/initPassword/${id}`,
    method: METHOD.GET
  })
}
// 修改用户
export async function editUser (params) {
  return request({
    url: `${BASE_URL}/user`,
    method: METHOD.PUT,
    params: params
  })
}

// 新增用户
export async function addUser (params) {
  return request({
    url: `${BASE_URL}/user`,
    method: METHOD.POST,
    params: params
  })
}
// 获取下拉员工信息
export async function getEmployeeList () {
  return request({
    url: `${BASE_URL}/employee/listEmployeeOption`,
    method: METHOD.GET
  })
}

// 获取用户表格
export async function getRelaUser (params) {
  const { userId } = params
  return request({
    url: `${BASE_URL}/user/getRelaUserRoleListByUserId/${userId}`,
    method: METHOD.GET
  })
}

// 关联用户角色
export async function addRelaUserRole (params) {
  return request({
    url: `${BASE_URL}/user/addRelaUserRole`,
    method: METHOD.POST,
    params: params
  })
}

//  获取所有生效角色
export async function getRoleList (params) {
  return request({
    url: `${BASE_URL}/role/getRoleList`,
    method: METHOD.POST,
    params: params
  })
}

//  删除关联角色
export async function deleteRelaUserRole (params) {
  const { relaId } = params
  return request({
    url: `${BASE_URL}/user/deleteRelaUserRole/${relaId}`,
    method: METHOD.DELETE
  })
}
