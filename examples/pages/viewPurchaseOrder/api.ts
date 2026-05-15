// @ts-nocheck
import { request, METHOD } from '@/utils/request'

const umsBaseUrl = process.env.APP_UMS_URL

export function mappingAdd (params) {
  return request({
    url: `${umsBaseUrl}/component/filter/mapping/add`,
    method: METHOD.POST,
    params: params
  }
  })
}

export function mappingEdit (params) {
  return request({
    url: `${umsBaseUrl}/component/filter/mapping/edit`,
    method: METHOD.POST,
    params: params
  }
  })
}

// 获取默认视图信息 (视图预览-根据表格信息预览视图)
export function getDefaultViewInfo (tableCode) {
  return request({
    url: `${umsBaseUrl}/component/view/reviewView/${tableCode}`,
    method: METHOD.GET
  }
  })
}

export function mappingpage (params) {
  return request({
    url: `${umsBaseUrl}/component/filter/mapping/page`,
    method: METHOD.POST,
    params: params
  }
  })
}
