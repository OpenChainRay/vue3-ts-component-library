import type { App } from "vue"

type BusHandler = (...args: unknown[]) => void

function createCompatBus() {
  const listeners: Record<string, BusHandler[]> = {}
  return {
    $on(event: string, handler: BusHandler) {
      listeners[event] = listeners[event] || []
      listeners[event].push(handler)
    },
    $off(event?: string, handler?: BusHandler) {
      if (!event) {
        Object.keys(listeners).forEach((key) => delete listeners[key])
        return
      }
      if (!handler) {
        delete listeners[event]
        return
      }
      listeners[event] = (listeners[event] || []).filter((item) => item !== handler)
    },
    $emit(event: string, ...args: unknown[]) {
      ;(listeners[event] || []).forEach((handler) => handler(...args))
    }
  }
}

const proTableBus = {
  /**
   * 注入全局表格事件总线。
   */
  install(app: App) {
    app.config.globalProperties.$proTableBus = createCompatBus()
  }
}

export default proTableBus
