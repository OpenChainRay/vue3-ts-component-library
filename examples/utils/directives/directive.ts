// @ts-nocheck
/**
 * @description 控制按钮的权限的自定义指令
 * 目前先做三种权限判断。新增，编辑和删除
 * 1. 只要有edit这个权限的, 全部开发增加, 删除, 编辑
 * 2. 新增 'add', 删除 'delete', 编辑 'edit'
 * 3. 目前是 先根据store/modules/account,中 permissions[0].operation， 来判断页面上的按钮是否disabled，
 * 用法
 * <a-button v-permission="'add'">新增</a-button>
 */

import store from '@/store'

// 校验用户权限
function doCheck (el, binding) {
  const { value } = binding
  const operation = store.state?.account?.permissions[0]?.operation || []
  // store.account && store.account.getters && store.account.getters.permissions && store.account.getters.permissions[0].operation || []
  // console.log('operation====', operation)
  if (operation.includes(value) || value === 'edit') {
    // 按钮可用
  } else {
    // 按钮不可用 置灰
    el.setAttribute('disabled', 'disabled') // 按钮
    el.setAttribute('color', 'rgba(0,0,0,0.25)') // a链接
  }
}

const permission = {
  inserted (el, binding) {
    doCheck(el, binding)
  }
}

// 安装
const install = function (Vue) {
  Vue.directive('permission', permission)
}

permission.install = install

export default permission
