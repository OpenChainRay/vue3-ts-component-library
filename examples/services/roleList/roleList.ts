// @ts-nocheck
import { request, METHOD } from '@/utils/request'

const BASE_URL = process.env.APP_API_BASE_URL

// 接口位置 UMS-用户管理接口-查询：获取角色信息
export async function getRoleByPage (params) {
  const ajaxFun = await request({
    url: `${BASE_URL}/role/page`,
    method: METHOD.POST,
    params: params
  }).catch((error) => { throw new Error(error) })
  return ajaxFun
}
// 启用用户
export async function enableRole (params) {
  const { id } = params
  const ajaxFun = await request({
    url: `${BASE_URL}/role/enable/${id}`,
    method: METHOD.PUT
  }).catch((error) => { throw new Error(error) })
  return ajaxFun
}
// 停用用户
export async function disableRole (params) {
  const { id } = params
  const ajaxFun = await request({
    url: `${BASE_URL}/role/disable/${id}`,
    method: METHOD.PUT
  }).catch((error) => { throw new Error(error) })
  return ajaxFun
}
// 获取菜单树(全部)
export async function getRoleMenuList (params) {
  const { roleId } = params
  const ajaxFun = await request({
    url: `${BASE_URL}/roleMenu/getRoleMenuList/${roleId}`,
    method: METHOD.GET
  }).catch((error) => { throw new Error(error) })
  return ajaxFun
}
// 获取菜单树(全部)模块版
export async function getRoleMenuListWithModule (roleId) {
  const ajaxFun = await request({
    url: `${BASE_URL}/roleMenu/getRoleMenuListWithModule/${roleId}`,
    method: METHOD.GET
  }).catch((error) => { throw new Error(error) })
  return ajaxFun
}
// 获取角色当前菜单权限树
export async function getCurrentRoleMenuList (params) {
  const { roleId } = params
  const ajaxFun = await request({
    url: `${BASE_URL}/roleMenu/getCurrentRoleMenuList/${roleId}`,
    method: METHOD.GET
  }).catch((error) => { throw new Error(error) })
  return ajaxFun
}
// 获取角色当前菜单权限树(模块版)
export async function getCurrentRoleMenuListWithModule (roleId) {
  const ajaxFun = await request({
    url: `${BASE_URL}/roleMenu/getCurrentRoleMenuListWithModule/${roleId}`,
    method: METHOD.GET
  }).catch((error) => { throw new Error(error) })
  return ajaxFun
}

// 获取角色数据权限列表
export async function getRoleDataScopeList (params) {
  const { roleId } = params
  const ajaxFun = await request({
    url: `${BASE_URL}/role/getRoleDataScopeList/${roleId}`,
    method: METHOD.GET
  }).catch((error) => { throw new Error(error) })
  return ajaxFun
}

// 修改权限
export async function editRelaDataScope (params) {
  const ajaxFun = await request({
    url: `${BASE_URL}/role/editRelaDataScope`,
    method: METHOD.POST,
    params: params
  }).catch((error) => { throw new Error(error) })
  return ajaxFun
}

// 新增角色
export async function addRole (params) {
  const ajaxFun = await request({
    url: `${BASE_URL}/role/add`,
    method: METHOD.POST,
    params: params
  }).catch((error) => { throw new Error(error) })
  return ajaxFun
}
// 修改角色
export async function editRole (params) {
  const ajaxFun = await request({
    url: `${BASE_URL}/role`,
    method: METHOD.PUT,
    params: params
  }).catch((error) => { throw new Error(error) })
  return ajaxFun
}
// 获取数据对象列表
export async function getEnableDataObjectList () {
  const ajaxFun = await request({
    url: `${BASE_URL}/dataObject/getEnableDataObjectList`,
    method: METHOD.GET
  }).catch((error) => { throw new Error(error) })
  return ajaxFun
}
// 新增角色数据权限
export async function addRelaDataScope (params) {
  const ajaxFun = await request({
    url: `${BASE_URL}/role/addRelaDataScope`,
    method: METHOD.POST,
    params: params
  }).catch((error) => { throw new Error(error) })
  return ajaxFun
}

// 获取菜单列表
export async function getMenuList () {
  const ajaxFun = await request({
    url: `${BASE_URL}/menu/getMenuList`,
    method: METHOD.GET
  }).catch((error) => { throw new Error(error) })
  return ajaxFun
}

// 获取菜单列表
export async function getModuleList () {
  const ajaxFun = await request({
    url: `${BASE_URL}/module/query`,
    method: METHOD.GET
  }).catch((error) => { throw new Error(error) })
  return ajaxFun
}

// 新增角色功能权限
export async function addRelaRoleMenu (params) {
  const ajaxFun = await request({
    url: `${BASE_URL}/roleMenu/addRelaRoleMenu`,
    method: METHOD.POST,
    params: params
  }).catch((error) => { throw new Error(error) })
  return ajaxFun
}
// 删除数据权限
export async function deleteRelaDataScope (params) {
  const { relaId } = params
  const ajaxFun = await request({
    url: `${BASE_URL}/role/deleteRelaDataScope/${relaId}`,
    method: METHOD.DELETE
  }).catch((error) => { throw new Error(error) })
  return ajaxFun
}

// 删除角色
export async function deleteRole (params) {
  const { id } = params
  const ajaxFun = await request({
    url: `${BASE_URL}/role/${id}`,
    method: METHOD.DELETE
  }).catch((error) => { throw new Error(error) })
  return ajaxFun
}
