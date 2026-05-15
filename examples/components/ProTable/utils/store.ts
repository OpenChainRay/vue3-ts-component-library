// @ts-nocheck
/**
 * 对ProTable的Ref和Params数据实现代理存储
 */

const proTableBus = {
  install (Vue) {
    /* 全局事件总线 */
    Vue.prototype.$proTableBus = new Vue()
  }
}
// const $store = {}

// const privateHandler = ['set', 'delete']

// const handler = {
//   set () {
//     throw new Error('不允许直接修改store数据,请使用`store.set`')
//   }
// }

// const ProxyStore = new Proxy($store, handler)

// const saveToStorage = () => {
//   sessionStorage.setItem('$scTableStore', JSON.stringify($store))
// }

// $store.set = (tableKey, value) => {
//   if (privateHandler.includes(tableKey)) {
//     throw new Error("请勿使用保留字段`set`或'delete'")
//   }
//   if (typeof value !== 'object') {
//     throw new Error('属性方法需要设置为`object`')
//   }
//   $store[tableKey] = {
//     ...$store[tableKey],
//     ...value
//   }
//   saveToStorage()
// }

// $store.delete = (tableKey) => {
//   delete $store[tableKey]
//   saveToStorage()
// }

export default proTableBus
