// @ts-nocheck
import { request, METHOD } from '@/utils/request'

const BASE_URL = process.env.APP_API_BASE_URL

// 接口位置 UMS-用户管理接口-查询：获取菜单信息
export async function getMenuByPage (params) {
  return request({
    url: `${BASE_URL}/menu/page`,
    method: METHOD.POST,
    params: params
  })
}

// 新增菜单
export async function addMenu (params) {
  return request({
    url: `${BASE_URL}/menu`,
    method: METHOD.POST,
    params: params
  })
}

// 修改菜单
export async function modifyMenu (params) {
  return request({
    url: `${BASE_URL}/menu`,
    method: METHOD.PUT,
    params: params
  })
}

// 获取菜单树
export async function getMenuTree () {
  return request({
    url: `${BASE_URL}/menu/treeModule`,
    method: METHOD.GET
  })
}

// 停用用户
export async function disableMenu (params) {
  const { id } = params
  return request({
    url: `${BASE_URL}/menu/disable/${id}`,
    method: METHOD.PUT
  })
}

// 停用用户
export async function enableMenu (params) {
  const { id } = params
  return request({
    url: `${BASE_URL}/menu/enable/${id}`,
    method: METHOD.PUT
  })
}

// 获取角色功能权限列表
export async function getRoleMenuList (params) {
  const { roleId } = params
  return request({
    url: `${BASE_URL}/roleMenu/getRoleMenuList/${roleId}`,
    method: METHOD.GET
  })
}

// 获取角色数据权限列表
export async function getRoleDataScopeList (params) {
  const { roleId } = params
  return request({
    url: `${BASE_URL}/role/getRoleDataScopeList/${roleId}`,
    method: METHOD.GET
  })
}

// 修改权限
export async function editRelaDataScope (params) {
  return request({
    url: `${BASE_URL}/role/editRelaDataScope`,
    method: METHOD.POST,
    params: params
  })
}

// 新增角色
export async function addRole (params) {
  return request({
    url: `${BASE_URL}/role/add`,
    method: METHOD.POST,
    params: params
  })
}
// 修改角色
export async function editRole (params) {
  return request({
    url: `${BASE_URL}/role`,
    method: METHOD.PUT,
    params: params
  })
}
// 获取数据对象列表
export async function getEnableDataObjectList () {
  return request({
    url: `${BASE_URL}/dataObject/getEnableDataObjectList`,
    method: METHOD.GET
  })
}
// 新增角色数据权限
export async function addRelaDataScope (params) {
  return request({
    url: `${BASE_URL}/role/addRelaDataScope`,
    method: METHOD.POST,
    params: params
  })
}

// 获取菜单列表
export async function getMenuList () {
  return request({
    url: `${BASE_URL}/menu/getMenuList`,
    method: METHOD.GET
  })
}

// 新增角色功能权限
export async function addRelaRoleMenu (params) {
  return request({
    url: `${BASE_URL}/role/addRelaRoleMenu`,
    method: METHOD.POST,
    params: params
  })
}
// 删除数据权限
export async function deleteRelaDataScope (params) {
  const { relaId } = params
  return request({
    url: `${BASE_URL}/role/deleteRelaDataScope/${relaId}`,
    method: METHOD.DELETE
  })
}

// 删除角色
export async function deleteMenu (params) {
  const { id } = params
  return request({
    url: `${BASE_URL}/menu/${id}`,
    method: METHOD.DELETE
  })
}
// 根据id获取菜单详情
export async function getMenuInfoById (params) {
  const { id } = params
  return request({
    url: `${BASE_URL}/menu/${id}`,
    method: METHOD.GET
  })
}
