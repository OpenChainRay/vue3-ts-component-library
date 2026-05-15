import { loadRoutes, loadGuards, setAppOptions } from "@/utils/routerUtil"
import { loadInterceptors } from "@/utils/request"
import guards from "@/router/guards"
import interceptors from "@/utils/request/axios-interceptors"

type BootstrapOptions = {
  router: any
  store: any
  i18n: any
  message: any
}

/**
 * 启动引导方法。
 */
function bootstrap({ router, store, i18n, message }: BootstrapOptions) {
  setAppOptions({ router, store, i18n })
  loadInterceptors(interceptors, { router, store, i18n, message })
  loadRoutes(undefined)
  loadGuards(guards, { router, store, i18n, message })
}

export default bootstrap
