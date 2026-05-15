// @ts-nocheck
import { request, METHOD, removeAuthorization } from '@/utils/request'
const umsBaseUrl = process.env.APP_UMS_URL
const APP_AMS_URL = process.env.APP_AMS_URL
/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export function useLogin(name, password) {
  return request({
    url: `${APP_AMS_URL}/security/login`,
    method: METHOD.POST,
    params: {
      clientId: 'admin-app',
      loginType: 1,
      username: name,
      password: password
    }
  })
}

/**
 * 退出登录
 */
export function logout() {
  localStorage.removeItem(process.env.APP_ROUTES_KEY)
  localStorage.removeItem(process.env.APP_PERMISSIONS_KEY)
  localStorage.removeItem(process.env.APP_ROLES_KEY)
  localStorage.removeItem(process.env.APP_USER_KEY)
  localStorage.removeItem(process.env.APP_USER_DEPARTMENT)
  removeAuthorization()
}

// 修改初始密码
export function updatePasswordInfo(data) {
  return request({
    url: `${umsBaseUrl}/user/updateUser`,
    method: METHOD.PUT,
    data: data
  })
}
export default {
  logout
}
