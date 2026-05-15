import { createStore } from "vuex"
import modules from "./modules"

/**
 * 创建全局状态容器。
 */
const store = createStore({
  modules
})

export default store
