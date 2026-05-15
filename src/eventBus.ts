/** 全局事件总线（原挂载在 AtTable，现独立导出） */
type Listener = ((...args: unknown[]) => void) & { _countdown?: number }
type ListenerMap = Record<string, Listener[]>

class EventBusClass {
  private listeners: ListenerMap = {}

  /** 注册监听 */
  addListener(key: string, callback: Listener, countdown: number) {
    if (countdown === 0) return false
    const listeners = this.listeners[key] || (this.listeners[key] = [])
    callback._countdown = countdown
    if (listeners.indexOf(callback) === -1) {
      listeners.push(callback)
    }
    return true
  }

  /** 持续监听 */
  on(key: string, callback: Listener) {
    return this.addListener(key, callback, -1)
  }

  /** 单次监听 */
  once(key: string, callback: Listener) {
    return this.addListener(key, callback, 1)
  }

  /** 触发 */
  emit(key: string, ...args: unknown[]) {
    const listeners = this.listeners[key]
    if (listeners && listeners.length) {
      for (let i = 0; i < listeners.length; ) {
        const listener = listeners[i]
        const countdown = listener._countdown ?? -1
        if (countdown > 0 && --listener._countdown! === 0) {
          listeners.splice(i, 1)
        } else {
          i++
        }
        listener(...args)
      }
    }
  }

  /** 移除 */
  removeListener(key?: string, callback?: Listener) {
    if (key == null) {
      const listeners = this.listeners
      this.listeners = {}
      return listeners
    }
    const listeners = this.listeners[key]
    if (!listeners) return null
    if (callback) {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        return { [key]: listeners.splice(index, 1) }
      }
      return { [key]: [] }
    }
    delete this.listeners[key]
    return { [key]: listeners }
  }

  off(key: string, callback?: Listener) {
    if (!key) return null
    return this.removeListener(key, callback)
  }

  offAll() {
    return this.removeListener()
  }
}

export const eventBus = (() => {
  const bus = new EventBusClass()
  if (typeof window !== "undefined") {
    ;(window as Window & { eventBus?: EventBusClass }).eventBus = bus
  }
  return bus
})()
