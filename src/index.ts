import type { App, Plugin } from "vue"
import AtViewer from "./AtViewer"
import AtSelect from "./AtSelect"
import AtStatistic from "./at-statistic/index.vue"
import AtEllipsis from "./AtEllipsis"
import AtBpmn from "./AtBpmn/index.vue"
import vueDraggable from "vue-draggable-resizable"
import AntTableView from "./AntView/AntTableView/index.vue"
import AntRowSearch from "./AntView/AtRowSearch/AtRowSearch.vue"
import AntViewSearch from "./AntView/AntViewSearch/viewSearch.vue"
import AntColumnDisplay from "./AntView/AntColumnDisplay/index.vue"
import AntViewRange from "./AntView/AntViewRange/AntViewRange.vue"
import AntDefaultViewRange from "./AntView/AntDefaultViewRange/AntDefaultViewRange.vue"
import AntTableCondition from "./AntView/AntTableCondition/AntTableCondition.vue"
import AntViewTree from "./AntView/AntTableView/views/viewTree.vue"
import antGroup from "./AntView/AntTableView/views/group.vue"
import AntConfigurationView from "./AntView/AntTableView/views/configurationView.vue"
import AntEditView from "./AntView/AntTableView/views/edit-view.vue"
import { message, notification, Modal } from "ant-design-vue"
import { setBaseUrl } from "./AntView/sevrices/configurationView"
import { setPmsBaseUrl } from "./AntView/components/Tree/utils/productClassify"
import packageInfo from "../package.json"
import { eventBus } from "./eventBus"

type InstallOptions = {
  pageSize?: number
  textFill?: string
  APP_VIEW_URL?: string
  APP_CMS_URL?: string
  APP_API_BASE_URL?: string
  APP_PMS_URL?: string
}

const components = [
  AtViewer,
  AtEllipsis,
  AtSelect,
  AtStatistic,
  AtBpmn,
  AntTableView,
  AntRowSearch,
  AntViewSearch,
  AntColumnDisplay,
  AntViewRange,
  AntDefaultViewRange,
  AntTableCondition,
  AntViewTree,
  antGroup,
  AntConfigurationView,
  AntEditView
]

/**
 * 注册组件库。
 */
const install: Plugin["install"] = (app: App, options?: InstallOptions) => {
  setBaseUrl(options)
  setPmsBaseUrl(options)

  const { pageSize = 10, textFill = "--" } = options || {}
  const globals = app.config.globalProperties
  globals.$antmessage = message
  globals.$antnotification = notification
  globals.$antinfo = Modal.info
  globals.$antsuccess = Modal.success
  globals.$anterror = Modal.error
  globals.$antwarning = Modal.warning
  globals.$antconfirm = Modal.confirm
  // 兼容 Vue2 this.$set / this.$delete 旧写法
  globals.$set = (target: Record<string, any>, key: string, value: any) => {
    target[key] = value
    return value
  }
  globals.$delete = (target: Record<string, any>, key: string) => {
    delete target[key]
  }
  globals.$AtMaterial = { pageSize, textFill }
  globals.$textFill = textFill

  app.component("vue-draggable", vueDraggable as any)
  components.forEach((component: any) => {
    if (component?.name) {
      app.component(component.name, component)
    }
  })
}

export {
  eventBus,
  AtViewer,
  AtEllipsis,
  AtSelect,
  AtStatistic,
  AtBpmn,
  AntTableView,
  AntRowSearch,
  AntViewSearch,
  AntColumnDisplay,
  AntViewRange,
  AntDefaultViewRange,
  AntTableCondition,
  AntViewTree,
  antGroup,
  AntConfigurationView,
  AntEditView
}

export default {
  version: (packageInfo as { version: string }).version,
  install,
  eventBus,
  AtViewer,
  AtEllipsis,
  AtSelect,
  AtStatistic,
  AtBpmn,
  AntTableView,
  AntRowSearch,
  AntViewSearch,
  AntColumnDisplay,
  AntViewRange,
  AntDefaultViewRange,
  AntTableCondition,
  AntViewTree,
  antGroup,
  AntConfigurationView,
  AntEditView
}
