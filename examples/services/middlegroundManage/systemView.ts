// @ts-nocheck
/**
 * @description 系统视图
 */

import { request, METHOD } from '@/utils/request'
const AMS_URL = process.env.APP_AMS_URL

// 分页：系统视图分页查询
export function previewPage (params) {
  return request({
    url: `${AMS_URL}/preview/page`,
    method: METHOD.POST,
    params: params
  })
}

// 系统视图 预览 表头
export function getPreviewView (viewId) {
  return request({
    url: `${AMS_URL}/preview/getPreviewView/${viewId}`,
    method: METHOD.GET
  })
}

// 系统视图 预览 列表
export function viewQueryPage (params) {
  return request({
    url: `${AMS_URL}/viewQuery/page`,
    method: METHOD.POST,
    params: params
  })
}

// 启用视图
export function enableTable (id) {
  return request({
    url: `${AMS_URL}/preview/enable/${id}`,
    method: METHOD.PUT

  })
}
// 停用视图
export function disableTable (id) {
  return request({
    url: `${AMS_URL}/preview/disable/${id}`,
    method: METHOD.PUT
  })
}
// 视图保存
export function saveTable (params) {
  return request({
    url: `${AMS_URL}/preview/save`,
    method: METHOD.POST,
    params: params
  })
}

// 表格条件修改
export function tableUpdate (params) {
  return request({
    url: `${AMS_URL}/preview/update`,
    method: METHOD.POST,
    params: params
  })
}
