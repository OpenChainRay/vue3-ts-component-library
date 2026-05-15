// @ts-nocheck
/**
 * @description 部门管理
 */

import { request, METHOD } from '@/utils/request'
// import { method } from 'lodash'
const BASE_URL = process.env.APP_API_BASE_URL

// 部门树查询
export async function getDepartmentTree (params) {
  return request({
    url: `${BASE_URL}/department/getDepartmentTree`,
    method: METHOD.GET,
    params: params
  }
  })
}
// 根据部门树结构父级ID查询部门信息
export async function getDepartmentInfo (params) {
  return request({
    url: `${BASE_URL}/department/page`,
    method: 'POST',
    params: params
  }
  })
}
// 根据Id启用部门
export async function enableDepartment (id) {
  return request({
    url: `${BASE_URL}/department/enable/${id}`,
    method: 'PUT'
  }
  })
}
// 根据Id停用部门
export async function disableDepartment (id) {
  return request({
    url: `${BASE_URL}/department/disable/${id}`,
    method: 'PUT'
  }
  })
}

// 查询所有员工
export async function listEmployeeOption () {
  return request({
    url: `${BASE_URL}/employee/listEmployeeOption`,
    method: 'GET'
  }
  })
}

// 新增部门
export async function addDepartment (params) {
  return request({
    url: `${BASE_URL}/department`,
    method: 'POST',
    params
  }
  })
}
// 更新部门
export async function updateDepartment (params) {
  return request({
    url: `${BASE_URL}/department`,
    method: 'PUT',
    params
  }
  })
}
// 根据部门id查询部门信息
export async function getDepartmentInfoByDeptId (id) {
  return request({
    url: `${BASE_URL}/department/${id}`,
    method: 'GET'
  }
  })
}
