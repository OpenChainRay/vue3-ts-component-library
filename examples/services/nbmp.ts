// @ts-nocheck
import { request, METHOD } from '@/utils/request'

const WORKFLOW_URL = process.env.APP_WORKFLOW_URL

// 查询：返回流程节点信息(审核流程xml)
export function processInstanceInfo (params) {
  return request({
    url: `${WORKFLOW_URL}/task/processInstanceInfo`,
    method: METHOD.POST,
    params: params
  })
}

// 查询：返回历史节点(审核流程表格)
export function history (params) {
  return request({
    url: `${WORKFLOW_URL}/task/history`,
    method: METHOD.POST,
    params: params
  })
}
