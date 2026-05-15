type Listener = ((...args: unknown[]) => void) & { _countdown?: number }
type ListenerMap = Record<string, Listener[]>

class EventBusClass {
  private listeners: ListenerMap = {}

  /**
   * 注册监听。
   */
  addListener(key: string, callback: Listener, countdown: number) {
    if (countdown === 0) return false
    const listeners = this.listeners[key] || (this.listeners[key] = [])
    callback._countdown = countdown
    if (listeners.indexOf(callback) === -1) {
      listeners.push(callback)
    }
    return true
  }

  /**
   * 注册持续监听。
   */
  on(key: string, callback: Listener) {
    return this.addListener(key, callback, -1)
  }

  /**
   * 注册一次监听。
   */
  once(key: string, callback: Listener) {
    return this.addListener(key, callback, 1)
  }

  /**
   * 触发事件。
   */
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

  /**
   * 移除监听。
   */
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

  /**
   * 按 key 移除。
   */
  off(key: string, callback?: Listener) {
    if (!key) return null
    return this.removeListener(key, callback)
  }

  /**
   * 清空全部监听。
   */
  offAll() {
    return this.removeListener()
  }
}

export const eventBus = (() => {
  const bus = new EventBusClass()
  ;(window as Window & { eventBus?: EventBusClass }).eventBus = bus
  return bus
})()
