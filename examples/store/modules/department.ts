// @ts-nocheck
// 部门相关状态
import { getDepartmentTree } from '@/services/departmentList'
// import { getStaffList } from '@/services/personnel'
export default {
  namespaced: true,
  state: {
    // 岗位列表
    staffList: [],
    // 所有部门树
    allDepartmentTree: [],
    // 只有显示有效的部门树
    availableDepartmentTree: []
  },
  getters: {

  },
  mutations: {
    setAllDepartmentTree (state, allDepartmentTree) {
      state.allDepartmentTree = allDepartmentTree
    },
    setAvailableDepartmentTree (state, availableDepartmentTree) {
      state.availableDepartmentTree = availableDepartmentTree
    }
  },
  actions: {
    async getAllDepartmentTree ({ commit }) {
      const result = await getDepartmentTree({ showInvalid: true }).catch((error) => { throw new Error(error) })
      commit('setAllDepartmentTree', result.data.data)
      return result
    },
    async getAvailableDepartmentTree ({ commit }) {
      const result = await getDepartmentTree({ showInvalid: false }).catch((error) => { throw new Error(error) })
      commit('setAvailableDepartmentTree', result.data.data)
      return result
    }
  }
}
