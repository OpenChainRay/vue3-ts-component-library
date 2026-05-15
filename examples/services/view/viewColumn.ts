// @ts-nocheck
import { request, METHOD } from '@/utils/request'

// const BASE_URL = process.env.APP_UMS_URL
const AMS_URL = process.env.APP_AMS_URL
const PREFIX = '/column'
// 接口位置 UMS-用户管理接口-查询：获取角色信息
export async function getColumnPage (params) {
  const ajaxFun = await request({
    url: `${AMS_URL}${PREFIX}/page`,
    method: METHOD.POST,
    params: params
  }).catch((error) => {
    throw new Error(error)
  }
  })
  return ajaxFun
}

// 启用列
export function enableColumn (params) {
  const { id } = params
  return request({
    url: `${AMS_URL}${PREFIX}/enable/${id}`,
    method: METHOD.PUT
  }
  })
}
// 停用列
export function disableColumn (params) {
  const { id } = params
  return request({
    url: `${AMS_URL}${PREFIX}/disable/${id}`,
    method: METHOD.PUT
  }
  })
}

// 新增列
export function saveColumn (params) {
  return request({
    url: `${AMS_URL}${PREFIX}/save`,
    method: METHOD.POST,
    params: params
  }
  })
}
// 修改列
export function updateColumn (params) {
  return request({
    url: `${AMS_URL}${PREFIX}/update`,
    method: METHOD.POST,
    params: params
  }
  })
}
// 导出
export function exportTableColumn (param) {
  return request({
    url: `${AMS_URL}${PREFIX}/export`,
    method: METHOD.POST,
    params: param,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
      }).catch((error) => {
    throw new Error(error)
  }
  })
}
// 导入
export function importColumn (data) {
  return request({
    url: `${AMS_URL}${PREFIX}/import`,
    method: METHOD.POST,
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'multipart/form-data;application/json;charset=UTF-8'
      }).catch((error) => {
    throw new Error(error)
  }
  })
}

export async function getColumnListWithEnable (tableId) {
  const ajaxFun = await request({
    url: `${AMS_URL}${PREFIX}/getColumnListWithEnable/${tableId}`,
    method: METHOD.POST
  }).catch((error) => {
    throw new Error(error)
  }
  })
  return ajaxFun
}

export async function getColumnById (id) {
  const ajaxFun = await request({
    url: `${AMS_URL}${PREFIX}/getColumnDetailById/${id}`,
    method: METHOD.POST
  }).catch((error) => {
    throw new Error(error)
  }
  })
  return ajaxFun
}

// 视图列行合并
export function getRowMerge (tableCode) {
  return request({
    url: `${AMS_URL}/rowMerge/getRowMerge/${tableCode}`,
    method: METHOD.GET
  }
  })
}
