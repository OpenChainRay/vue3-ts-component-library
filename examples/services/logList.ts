// @ts-nocheck
/**
 * @description 操作日志管理
 */

import { request, METHOD } from '@/utils/request'
const BASE_URL = process.env.APP_API_BASE_URL
// const UMS_URL = process.env.APP_UMS_URL

// 操作日志-列表
export async function getLogPage (params) {
  // const { pageNo, pageSize } = params
  return request({
    url: `${BASE_URL}/loginTrace`,
    method: METHOD.POST,
    params: params
  }
  })
}
