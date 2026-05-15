// @ts-nocheck
/**
 * @description 防抖动自定义指令, 因为项目用了lodash，试着直接用它里面的防抖函数，然后包装成vue的自定义指令
 * @param func { Function },   参考官方文档
 * @param wait { Number } 默认500  参考官方文档
 * @param options { Object } 非必填  参考官方文档
 * @param eventName { String } 事件名称 默认'click'
 * <a-button v-debounce="{func: fangdou, wait: 1500, eventName: 'click'}">测试防抖</a-button>
 *
 * 以下来自load 官方文档
 * func (Function): 要防抖动的函数。
  [wait=0] (number): 需要延迟的毫秒数。 咱们项目默认500ms，也可以自定义时间， 接口设置的超时时间？
  [options=] (Object): 选项对象。
  [options.leading=false] (boolean): 指定在延迟开始前调用。
  [options.maxWait] (number): 设置 func 允许被延迟的最大值。
  [options.trailing=true] (boolean): 指定在延迟结束后调用。

  (Function): 返回新的 debounced（防抖动）函数

  示例： 确保 `batchLog` 调用1次之后，1秒内会被触发。
  var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });  // 使用
  取消防抖
  debounced.cancel
 */

import {
  debounce
} from 'lodash'
let debounced = null

const permission = {
  // 只调用一次，指令第一次绑定到元素时调用
  // bind (el, binding) {},
  // 被绑定元素插入父节点时使用
  inserted (el, binding) {
    const {
      func = () => {}, wait = 500,
      // options = { loading: false },
      eventName = 'click'
    } = binding.value
    debounced = debounce(func, wait, {
      maxWait: 1000
    }
    })
    el.addEventListener(eventName, debounced)
  },
  // 所在组件vNode更新时调用
  // update (el, binding) {},
  unbind () {
    console.log('unbind', debounced)
    // 取消事件监听
    // el.removeEventListener(eventName, debounced)
    // 取消防抖
    // debounced.cancel
  }
}

const install = function (Vue) {
  Vue.directive('debounce', permission)
}

if (window.Vue) {
  window.debounce = permission
  // Vue.use(install)
}

permission.install = install

export default permission

// useage
// Vue.use(permission);
