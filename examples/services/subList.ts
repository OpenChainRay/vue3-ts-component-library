// @ts-nocheck
/**
 * @description 子系统列表
 */
import { request, METHOD } from '@/utils/request'
const BASE_URL = process.env.APP_API_BASE_URL

// 子系统列表-分页查询
export async function getSubList (params) {
  const requestFunc = await request({
    url: `${BASE_URL}/module/page`,
    method: METHOD.POST,
    params: params
  }
  })
  return requestFunc
}

// 修改：根据Id停用模块
export async function disableSubById (id) {
  const requestFunc = await request({
    url: `${BASE_URL}/module/disable/${id}`,
    method: METHOD.PUT
  }
  })
  return requestFunc
}

// 修改：根据Id启用模块
export async function enableSubById (id) {
  const requestFunc = await request({
    url: `${BASE_URL}/module/enable/${id}`,
    method: METHOD.PUT
  }
  })
  return requestFunc
}

// 修改:修改条目明细
export async function editSubListData (data) {
  const requestFunc = await request({
    url: `${BASE_URL}/module`,
    data: data,
    method: METHOD.PUT
  }
  })
  return requestFunc
}

// 删除条目明细
export async function deleteSubListData (id) {
  const requestFunc = await request({
    url: `${BASE_URL}/module/${id}`,
    method: METHOD.DELETE
  }
  })
  return requestFunc
}

// 新增条目明细
export async function insertSubListData (data) {
  const requestFunc = await request({
    url: `${BASE_URL}/module`,
    data: data,
    method: METHOD.POST
  }
  })
  return requestFunc
}
