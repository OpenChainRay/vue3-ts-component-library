// @ts-nocheck
/**
 * @description 员工列表管理
 */

import { request, METHOD } from '@/utils/request'
const BASE_URL = process.env.APP_API_BASE_URL

// 员工列表
export async function getDataPage (params) {
  return request({
    url: `${BASE_URL}/employee/page`,
    method: METHOD.POST,
    params: params
  })
}

// 员工列表管理-是否有效-停用
export async function changeDisable (parameter) {
  const { id, params } = parameter
  return request({
    url: `${BASE_URL}/employee/disable/${id}`,
    method: METHOD.PUT,
    params: params
  })
}

// 员工列表管理-是否有效-启用
export async function changeEnable (parameter) {
  const { id, params } = parameter
  return request({
    url: `${BASE_URL}/employee/enable/${id}`,
    method: METHOD.PUT,
    params: params
  })
}

// 员工列表管理-新增
export async function personnelAdd (params) {
  return request({
    url: `${BASE_URL}/employee/add`,
    method: METHOD.POST,
    params: params
  })
}

// 员工列表管理-修改
export async function personnelModify (params) {
  return request({
    url: `${BASE_URL}/employee/edit`,
    method: METHOD.PUT,
    params: params
  })
}

// 员工列表管理-部门下拉信息选择
export async function getDepartmentList (params) {
  return request({
    url: `${BASE_URL}/department/selector`,
    method: METHOD.GET,
    params: params
  })
}

// 员工列表管理-岗位下拉信息选择
export async function getStaffList (params) {
  return request({
    url: `${BASE_URL}/position/list`,
    method: METHOD.GET,
    params: params
  })
}

// 账号与员工关系列表
export async function getUserRelationPage (params) {
  return request({
    url: `${BASE_URL}/employee/pageInfo`,
    method: METHOD.POST,
    params: params
  })
}

// 账号与员工关系列表-删除
export async function deleteUserRelation (params) {
  const { userId } = params
  return request({
    url: `${BASE_URL}/employee/deleteInfo/${userId}`,
    method: METHOD.DELETE,
    params: params
  })
}

// 员工组织关系列表管理-是否有效-启用
export async function empDeptEnable (parameter) {
  const { id, params } = parameter
  return request({
    url: `${BASE_URL}/empDept/enable/${id}`,
    method: METHOD.PUT,
    params: params
  })
}

// 员工组织关系列表管理-是否有效-停用
export async function empDeptDisable (parameter) {
  const { id, params } = parameter
  return request({
    url: `${BASE_URL}/empDept/disable/${id}`,
    method: METHOD.PUT,
    params: params
  })
}
// 员工组织关系列表管理-根据id查询
export async function getEmployeeInfoByUserId (params) {
  return request({
    url: `${BASE_URL}/employee/getEmployeeInfoByUserId`,
    method: METHOD.GET,
    params: params
  })
}

// 员工组织关系列表管理-获取员工下拉
export async function listEmployeeOption (params) {
  return request({
    url: `${BASE_URL}/user/getUnbindEmpUserList`,
    method: METHOD.GET,
    params: params
  })
}

// 账号与员工关系新增
export async function addInfo (parameter) {
  const { userId, employeeId } = parameter
  return request({
    url: `${BASE_URL}/employee/addInfo/${userId}/${employeeId}`,
    method: METHOD.POST

  })
}

// 员工组织关系
export async function getEmpDeptPage (params) {
  return request({
    url: `${BASE_URL}/empDept/page`,
    method: METHOD.POST,
    params: params
  })
}
// 设为默认
export async function setDefault (parameter) {
  const { id } = parameter
  return request({
    url: `${BASE_URL}/empDept/set/${id}`,
    method: METHOD.GET

  })
}
// 新增任岗
export async function empDeptAdd (params) {
  return request({
    url: `${BASE_URL}/empDept/add`,
    method: METHOD.POST,
    params: params
  })
}

// 修改任岗
export async function empDeptEdit (params) {
  return request({
    url: `${BASE_URL}/empDept/edit`,
    method: METHOD.PUT,
    params: params
  })
}
// 删除任岗
export async function deleteDept (parameter) {
  const { id } = parameter
  return request({
    url: `${BASE_URL}/empDept/${id}`,
    method: METHOD.DELETE

  })
}
