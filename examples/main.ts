import { createApp } from "vue"
import Antd, { message, Modal } from "ant-design-vue"
import "ant-design-vue/dist/reset.css"
import "./theme/index.less"
import "animate.css/source/animate.css"
import App from "./App.vue"
import store from "./store"
import bootstrap from "@/bootstrap"
import { initI18n } from "@/utils/i18n"
import { initRouter } from "./router"
import { contextHolderApi } from "@/utils/contextApi"
import Plugins from "@/plugins"
import AtMateria from "at-materia"
import ServerSideTable from "./components/ServerSideTable.vue"

const app = createApp(App)
const i18n = initI18n("CN", "US")
const router = initRouter((store.state as { setting: { asyncRoutes: boolean } }).setting.asyncRoutes)

app.use(Antd as any)
app.use(Plugins)
app.use(store)
app.use(router)
app.use(i18n)
app.use(AtMateria, {
  APP_VIEW_URL: process.env.APP_AMS_URL,
  APP_CMS_URL: process.env.APP_CMS_URL
})
app.component("ServerSideTable", ServerSideTable)
app.component("server-side-table", ServerSideTable)
app.component("ProTable", ServerSideTable)
app.component("pro-table", ServerSideTable)

bootstrap({ router, store, i18n, message })
;(contextHolderApi as any).message = message
;(contextHolderApi as any).modal = Modal.confirm

app.config.globalProperties.$message = message
app.config.globalProperties.$confirm = Modal.confirm
// 兼容 examples 中遗留的 Vue2 this.$set / this.$delete
app.config.globalProperties.$set = (target: Record<string, any>, key: string, value: any) => {
  target[key] = value
  return value
}
app.config.globalProperties.$delete = (target: Record<string, any>, key: string) => {
  delete target[key]
}
app.mount("#app")
