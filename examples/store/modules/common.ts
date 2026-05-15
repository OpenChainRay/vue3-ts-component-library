// @ts-nocheck
// 公共组件状态
export default {
  namespaced: true,
  state: {
    productTypeList: null // 产品品类
  },
  getters: {
    productTypeList: state => {
      return state.productTypeList
    }
  },
  mutations: {
    setProductTypeList (state, productTypeList) {
      state.productTypeList = productTypeList
    }
  },
  actions: {
  }
}
