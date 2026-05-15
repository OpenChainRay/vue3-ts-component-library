// @ts-nocheck
// 全局方法挂载点
export const contextHolderApi = {
  message: null,
  modal: null
}

/**
 * esm方式导出挂载全局context的方法
 * @param {*} funcName 方法名称
 * @returns
 */
export const getContextApi = (funcName) => {
  return new Promise((resolve) => {
    if (contextHolderApi[funcName]) {
      resolve(contextHolderApi[funcName])
    } else {
      throw new Error(`Can't find '${funcName}'!`)
    }
  })
}

/**
 * esm方式导出挂载全局mesasge
 * @param {string} msg 发送信息
 * @param {string} type 方法名称默认为success
 * @returns
 */
export const message = ({ msg, type = 'success' }) => {
  const localMessage = { ...msg }
  let duration = 3
  switch (type) {
    case 'success':
      duration = 1
      break
    case 'error':
      duration = 5
      break
    default:
      break
  }
  Object.assign(localMessage, { duration })
  getContextApi('message').then(($message) => $message[type](localMessage))
}
// 经常会使用的两种信息提示，成功/失败
export const oftenMessage = (flag, msg) => {
  if (flag) {
    message({
      msg: {
        content: msg
      },
      type: 'success'
    })
  } else {
    message({
      msg: {
        content: msg
      },
      type: 'error'
    })
  }
}

/**
 * esm方式导出挂载全局Modal
 * @param {object} config modal的config
 * @param {string} type 方法名称默认为info
 * @returns
 */
export const modal = (config) => {
  console.log('config', config)
  getContextApi('modal').then(($modal) => $modal(config))
}
