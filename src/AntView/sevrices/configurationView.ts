import { request, METHOD } from '@/utils/request'
import axios from 'axios'

type BaseUrlOptions = {
  APP_VIEW_URL?: string
  APP_CMS_URL?: string
  xsrfHeaderName?: string
}

const UMS_URL = process.env.APP_UMS_URL
let APP_VIEW_URL = ''
let APP_CMS_URL = ''
const headers = { 'content-type': 'application/x-www-form-urlencoded' }

/** 设置视图服务基础地址 */
export function setBaseUrl (options: BaseUrlOptions = {}) {
  APP_VIEW_URL = options.APP_VIEW_URL || ''
  APP_CMS_URL = options.APP_CMS_URL || ''
  if (options.xsrfHeaderName) {
    axios.defaults.xsrfHeaderName = options.xsrfHeaderName
  }
}

/** 查询所有视图列表 */
export function getViewList (tableCode: string) {
  return request({
    url: `${APP_VIEW_URL}/view/getViewList/${tableCode}`,
    method: METHOD.GET
  })
}

/** 查询系统视图选项列表 */
export function getOptionList (tableCode: string) {
  return request({
    url: `${APP_VIEW_URL}/preview/optionList/${tableCode}`,
    method: METHOD.GET
  })
}

/** 获取默认视图信息 */
export function getDefaultViewInfo (tableCode: string) {
  return request({
    url: `${APP_VIEW_URL}/view/reviewView/${tableCode}`,
    method: METHOD.GET
  })
}

/** 根据预配置视图ID查询视图信息 */
export function getPreviewView (tableCode: string) {
  return request({
    url: `${APP_VIEW_URL}/preview/getPreviewView/${tableCode}`,
    method: METHOD.GET
  })
}

/** 根据tableCode查询表头信息 */
export function getColumnList (tableCode: string) {
  return request({
    url: `${APP_VIEW_URL}/column/option/${tableCode}`,
    method: METHOD.GET
  })
}

/** 保存个人视图 */
export function saveView (params: unknown) {
  return request({
    url: `${APP_VIEW_URL}/view/save`,
    method: METHOD.POST,
    params
  })
}

/** 更新个人视图 */
export function updateView (params: unknown) {
  return request({
    url: `${APP_VIEW_URL}/view/update`,
    method: METHOD.POST,
    params
  })
}

/** 保存系统视图 */
export function savePreviewView (params: unknown) {
  return request({
    url: `${APP_VIEW_URL}/preview/save`,
    method: METHOD.POST,
    params
  })
}

/** 更新系统视图 */
export function updatePreviewView (params: unknown) {
  return request({
    url: `${APP_VIEW_URL}/preview/update`,
    method: METHOD.POST,
    params
  })
}

/** 视图切换-切换默认视图 */
export function changeCurrentView (viewId: string) {
  return request({
    url: `${APP_VIEW_URL}/view/changeCurrentView/${viewId}`,
    method: METHOD.PUT
  })
}

/** 删除个人视图信息 */
export function deleteUserView (viewId: string) {
  return request({
    url: `${APP_VIEW_URL}/view/remove/${viewId}`,
    method: METHOD.DELETE
  })
}

/** 删除系统视图信息 */
export function deletePreviewView (viewId: string) {
  return request({
    url: `${APP_VIEW_URL}/preview/remove/${viewId}`,
    method: METHOD.DELETE
  })
}

/** 获取用户过滤条件 */
export function getsearchInfo (tableCode: string) {
  return request({
    url: `${APP_VIEW_URL}/filter/getFilters/${tableCode}`,
    method: METHOD.GET,
    headers
  })
}

/** 获取全部过滤条件 */
export function getSearchList (tableCode: string) {
  return request({
    url: `${APP_VIEW_URL}/filter/listFilters/${tableCode}`,
    method: METHOD.GET,
    headers
  })
}

/** 添加用户过滤条件 */
export function addColumn (params: unknown) {
  return request({
    url: `${APP_VIEW_URL}/filter/addFilters`,
    method: METHOD.POST,
    params
  })
}

/** 删除一个查询条件 */
export function delColumn (params: unknown) {
  return request({
    url: `${APP_VIEW_URL}/filter/removeFilters`,
    method: METHOD.POST,
    params
  })
}

/** 动态时间计算 */
export function dynamic (params: unknown) {
  return request({
    url: `${APP_VIEW_URL}/filter/dynamicDateCompute`,
    method: METHOD.POST,
    params
  })
}

/** 日历时间计算 */
export function calendar (params: unknown) {
  return request({
    url: `${APP_VIEW_URL}/filter/calendarDateCompute`,
    method: METHOD.POST,
    params
  })
}

/** 自定义数据源查询 */
export function filterQuerySource (params: unknown) {
  return request({
    url: `${APP_VIEW_URL}/filterQuerySource/querySource`,
    method: METHOD.POST,
    params
  })
}

/** 测试下拉触底 */
export function employeePage (params: unknown) {
  return request({
    url: `${UMS_URL}/employee/page`,
    method: METHOD.POST,
    params
  })
}

/** 测试树结构 */
export function menuTree () {
  return request({
    url: `${UMS_URL}/menuCollect/menuTree`,
    method: METHOD.GET
  })
}

/** 停用视图 */
export function disable (viewId: string) {
  return request({
    url: `${APP_VIEW_URL}/view/data/disableBatchView`,
    method: METHOD.POST,
    params: [viewId]
  })
}

/** 启用视图 */
export function enable (viewId: string) {
  return request({
    url: `${APP_VIEW_URL}/view/data/enableBatchView`,
    method: METHOD.POST,
    params: [viewId]
  })
}

/** 根据视图id获取查询条件 */
export function getQueryColumns (viewId: string) {
  return request({
    url: `${APP_VIEW_URL}/vwView/get/filters/${viewId}`,
    method: METHOD.GET
  })
}

/** 根据视图id获取查询详情 */
export function getQueryDetail (viewId: string, tableCode: string) {
  return request({
    url: `${APP_VIEW_URL}/view/info/getViewShowInfo`,
    method: METHOD.GET,
    params: {
      viewId,
      tableCode
    }
  })
}

/** 查询可添加条件列信息 */
export function getViewInfoById (viewId: string) {
  return request({
    url: `${APP_VIEW_URL}/view/getView/${viewId}`,
    method: METHOD.GET
  })
}

/** 获取所有可过滤列 */
export async function getAllFilterColumns (tableCode: string) {
  return await request({
    url: `${APP_VIEW_URL}/table/info/getAllFilterColumns/${tableCode}`,
    method: METHOD.GET
  }).catch((error) => { throw new Error(error) })
}

/** 批量获取字典 */
export async function getDictList (param: unknown) {
  return await request({
    url: `${APP_CMS_URL}/dict/getDictList`,
    method: METHOD.POST,
    params: param
  }).catch((error) => { throw new Error(error) })
}

/** 根据类型批量获取字典 */
export async function getDictByTypeId (param: unknown) {
  return await request({
    url: `${APP_CMS_URL}/dict/getDict`,
    method: METHOD.POST,
    params: param
  }).catch((error) => { throw new Error(error) })
}

/** 获取列类型操作符配置 */
export function columnTypeConfiguate (params: unknown) {
  return request({
    url: `${APP_VIEW_URL}/columnType/getOperator`,
    method: METHOD.POST,
    params
  })
}

/** 根据视图更新 */
export function updateByView (params: unknown) {
  return request({
    url: `${APP_VIEW_URL}/view/updateByView`,
    method: METHOD.POST,
    params
  })
}
