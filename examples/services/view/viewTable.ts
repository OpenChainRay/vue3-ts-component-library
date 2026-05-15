// @ts-nocheck
import { request, METHOD } from '@/utils/request'

const BASE_URL = process.env.APP_UMS_URL
const AMS_URL = process.env.APP_AMS_URL
// 表格视图列表
export async function getTablePage (params) {
  const ajaxFun = await request({
    url: `${AMS_URL}/table/page`,
    method: METHOD.POST,
    params: params
  }).catch((error) => { throw new Error(error) })
  return ajaxFun
}

// 启用视图
export function enableTable (tableCode) {
  return request({
    url: `${AMS_URL}/table/enable/${tableCode}`,
    method: METHOD.PUT

  }
  })
}
// 停用视图
export function disableTable (tableCode) {
  return request({
    url: `${AMS_URL}/table/disable/${tableCode}`,
    method: METHOD.PUT
  }
  })
}
// 视图保存
export function saveTable (params) {
  return request({
    url: `${AMS_URL}/table/save`,
    method: METHOD.POST,
    params: params
  }
  })
}

// 表格条件修改
export function tableUpdate (params) {
  return request({
    url: `${AMS_URL}/table/update`,
    method: METHOD.POST,
    params: params
  }
  })
}

export function columnTypePage (params) {
  return request({
    url: `${BASE_URL}/component/columnType/page`,
    method: METHOD.POST,
    params: params
  }
  })
}

export function columnTypeConfiguate (params) {
  return request({
    url: `${BASE_URL}/columnType/getOperator`,
    method: METHOD.POST,
    params: params
  }
  })
}

export function operatorPage (params) {
  return request({
    url: `${BASE_URL}/component/operator/page`,
    method: METHOD.POST,
    params: params
  }
  })
}

export function columnTypeEdit (params) {
  return request({
    url: `${BASE_URL}/component/columnType/edit`,
    method: METHOD.POST,
    params: params
  }
  })
}

export function columnTypeAdd (params) {
  return request({
    url: `${BASE_URL}/component/columnType/add`,
    method: METHOD.POST,
    params: params
  }
  })
}

// 视图预览: 根据表格信息预览视图
export function reviewView (tableCode) {
  return request({
    url: `${AMS_URL}/view/reviewView/${tableCode}`,
    method: METHOD.GET
  }
  })
}
