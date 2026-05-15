// @ts-nocheck
import { getUserInfo, getAllOrganizations } from '@/services/common'
import { message } from '@/utils/contextApi'
import userAvatar from '@/assets/icons/avatar.png'
const formatterOptions = (list, rObj) => {
  return list?.map((item) => {
    return rObj(item)
  }
  })
}
const getDefaultState = () => {
  return {
    user: null,
    // 当前用户所属部门
    currentDepartment: null,
    // 当前用户所属部门列表options
    departmentsOptions: null,
    // 当前用户所属公司（组织）
    currentOrganization: null,
    // 当前用户所属公司（组织）options
    organizationsOptions: null,
    // 当前用户所属公司（组织）
    organizationsList: null,
    permissions: [
      {
        id: 'queryForm',
        operation: [
          'add',
          'edit'
        ]
      }
    ],
    roles: [
      {
        id: 'admin',
        operation: [
          'add',
          'edit',
          'delete'
        ]
      }
    ],
    routesConfig: null
  }
}
const userInitObj = {
  departmentDtoList: [],
  fullName: '',
  menuTreeList: [],
  mobile: '',
  roleList: [],
  userName: ''
}
export default {
  namespaced: true,
  state: {
    ...getDefaultState(),
    userToken: null
  },
  getters: {
    user: state => {
      if (!state.user) {
        try {
          const user = localStorage.getItem(process.env.APP_USER_KEY)
          if (user) {
            state.user = JSON.parse(user)
          } else {
            state.user = userInitObj
          }
        } catch (e) {
          console.error(e)
        }
      }
      return state.user
    },
    // 当前选中组织
    currentOrganization: state => {
      const currentOrganization = JSON.parse(localStorage.getItem(process.env.APP_USER_ORGANIZATION))
      if (currentOrganization) {
        state.currentOrganization = currentOrganization
      } else if (!state.currentOrganization) {
        state.currentOrganization = {
          value: 2,
          label: '爱安特（常州）精密机械有限公司',
          orgCode: '100.07'
        }
      }
      return state.currentOrganization
    },
    organizationsList: state => {
      if (!state.organizationsList) {
        try {
          state.organizationsList = JSON.parse(localStorage.getItem(process.env.APP_ORGANIZATIONS_KEY))
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.organizationsList
    },
    organizationsOptions: state => {
      if (!state.organizationsOptions) {
        try {
          const organizationsList = JSON.parse(localStorage.getItem(process.env.APP_ORGANIZATIONS_KEY))
          state.organizationsOptions = formatterOptions(organizationsList, (item) => {
            return {
              value: item.id,
              label: item.orgName,
              orgCode: item.orgCode
            }
          })
        } catch (e) {
          console.error(e)
        }
      }
      return state.organizationsOptions
    },
    // 当前选中部门
    currentDepartment: state => {
      const currentDepartment = JSON.parse(localStorage.getItem(process.env.APP_USER_DEPARTMENT))
      const user = JSON.parse(localStorage.getItem(process.env.APP_USER_KEY))
      if (currentDepartment) {
        try {
          state.currentDepartment = currentDepartment
        } catch (e) {
          console.error(e)
        }
      } else if (state.departmentsOptions?.length > 0) {
        const sortList = user.departmentDtoList
        sortList?.sort((a, b) => {
          return a.ancestor.length - b.ancestor.length
     }
   })
        // state.currentDepartment = state.departmentsOptions[0]
        state.currentDepartment = {
          label: sortList[0].departmentName,
          value: sortList[0].id
        }
      }
      return state.currentDepartment
    },
    departmentsOptions: state => {
      const user = JSON.parse(localStorage.getItem(process.env.APP_USER_KEY))
      const departmentDtoList = user?.departmentDtoList
      if (departmentDtoList) {
        const departmentsOptions = formatterOptions(departmentDtoList, (item) => {
          return {
            value: item.id,
            label: item.departmentName
          }
        })
        state.departmentsOptions = departmentsOptions
      } else {
        message({
          msg: {
          // 提示内容
            content: '无法获取部门信息，请退出登陆以后重新登陆！',
            // 停留时间
            duration: 5
          },
          type: 'error'
     }
   })
      }
      return state.departmentsOptions
    },
    routesConfig: state => {
      if (!state.routesConfig) {
        try {
          const routesConfig = localStorage.getItem(process.env.APP_ROUTES_KEY)
          state.routesConfig = JSON.parse(routesConfig)
          state.routesConfig = state.routesConfig ? state.routesConfig : []
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.routesConfig
    },
    permissions: state => {
      if (!state.permissions) {
        try {
          const permissions = localStorage.getItem(process.env.APP_PERMISSIONS_KEY)
          state.permissions = JSON.parse(permissions)
          state.permissions = state.permissions ? state.permissions : []
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.permissions
    },
    roles: state => {
      if (!state.roles) {
        try {
          const roles = localStorage.getItem(process.env.APP_ROLES_KEY)
          state.roles = JSON.parse(roles)
          state.roles = state.roles ? state.roles : []
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.roles
    }
  },
  mutations: {
    resetAllState (state) {
      const initState = getDefaultState()
      Object.keys(initState).forEach(key => {
        state[key] = initState[key]
    }
  })
    },
    setUserToken (state, token) {
      state.userToken = token
    },
    setUser (state, user) {
      state.user = user
      localStorage.setItem(process.env.APP_USER_KEY, JSON.stringify(user))
    },
    setCurrentDepartment (state, currentDepartment) {
      state.currentDepartment = currentDepartment
      localStorage.setItem(process.env.APP_USER_DEPARTMENT, JSON.stringify(currentDepartment))
    },
    setDepartmentsOptions (state, departmentDtoList) {
      const departmentsOptions = formatterOptions(departmentDtoList, (item) => {
        return {
          value: item.id,
          label: item.departmentName
        }
      })
      state.organizationsList = departmentsOptions
    },
    setCurrentOrganization (state, currentOrganization) {
      state.currentOrganization = currentOrganization
      localStorage.setItem(process.env.APP_USER_ORGANIZATION, JSON.stringify(currentOrganization))
    },
    setOrganizationsList (state, organizationsList) {
      state.organizationsList = organizationsList
      localStorage.setItem(process.env.APP_ORGANIZATIONS_KEY, JSON.stringify(organizationsList))
    },
    setOrganizationsOptions (state, organizationsList) {
      state.organizationsOptions = formatterOptions(organizationsList, (item) => {
        return {
          value: item.id,
          label: item.orgName,
          orgCode: item.orgCode
        }
      })
    },
    setPermissions (state, permissions) {
      state.permissions = permissions
      localStorage.setItem(process.env.APP_PERMISSIONS_KEY, JSON.stringify(permissions))
    },
    setRoles (state, roles) {
      state.roles = roles
      localStorage.setItem(process.env.APP_ROLES_KEY, JSON.stringify(roles))
    },
    setRoutesConfig (state, routesConfig) {
      state.routesConfig = routesConfig
      localStorage.setItem(process.env.APP_ROUTES_KEY, JSON.stringify(routesConfig))
    }
  },
  actions: {
    async getUserInfo (
      {
        commit
        // state
      }
    ) {
      const { data } = await getUserInfo({ moduleName: 'ums' }).catch((error) => { throw new Error(error) })
      if (data.code == 200) {
        const userObj = data.data
        commit('resetAllState')
        commit('setUser', {
          // 部门列表
          departmentDtoList: userObj.departmentDtoList,
          // 用户名
          name: userObj.userName,
          avatar: userObj.avatar || userAvatar,
          // 用户主键
          id: userObj.id,
          // 是否管理员：0-->否；1-->是
          isAdmin: userObj.isAdmin,
          // 最后登录时间
          lastLoginTime: userObj.lastLoginTime,
          // DetailMenuTreeDTO 菜单列表
          menuTreeList: userObj.menuTreeList,
          // 手机号
          mobile: userObj.mobile,
          // DetailRoleDTO对象 角色列表
          roleList: userObj.roleList,
          // 状态：-1-->删除；0-->停用；1-->启用
          status: userObj.status,
          // 用户全名
          fullName: userObj.fullName,
          // 是否第一次登录
          passwordOnce: userObj.passwordOnce

     }
   })
        commit('setDepartmentsOptions', userObj.departmentDtoList)
      } else {
        message({
          msg: {
            // 提示内容
            content: '获取用户信息失败，请退出登陆以后重新登陆！',
            // 停留时间
            duration: 5
          },
          type: 'error'
     }
   })
      }
    },
    async getAllOrganizations (
      {
        commit
      }
    ) {
      const organizationsList = JSON.parse(localStorage.getItem(process.env.APP_ORGANIZATIONS_KEY))
      if (organizationsList) {
        try {
          commit('setOrganizationsList', organizationsList)
          commit('setOrganizationsOptions', organizationsList)
        } catch (e) {
          console.error(e)
        }
      } else {
        const { data } = await getAllOrganizations().catch((error) => { throw new Error(error) })
        if (data.code == 200) {
          commit('setOrganizationsList', data.data)
          commit('setOrganizationsOptions', data.data)
        } else {
          message({
            msg: {
            // 提示内容
              content: '获取组织信息失败，请退出登陆以后重新登陆！',
              // 停留时间
              duration: 5
            },
            type: 'error'
      }
    })
        }
      }
    }
  }
}
