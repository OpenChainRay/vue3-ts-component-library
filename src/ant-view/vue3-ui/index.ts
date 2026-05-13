import type { App } from "vue";
import AntTableView from "./AntTableView.vue";
import AntViewSearch from "./AntViewSearch.vue";
import AtRowSearch from "./AtRowSearch.vue";
import AntColumnDisplay from "./AntColumnDisplay.vue";
import AntViewRange from "./AntViewRange.vue";
import AntDefaultViewRange from "./AntDefaultViewRange.vue";
import AntTableCondition from "./AntTableCondition.vue";

export { AntTableView };
export { AntViewSearch, AtRowSearch, AntColumnDisplay, AntViewRange, AntDefaultViewRange, AntTableCondition };

/** 注册 AntView Vue3 组件 */
export function installAntViewVue3(app: App) {
  app.component("AntTableView", AntTableView);
  app.component("AntViewSearch", AntViewSearch);
  app.component("AtRowSearch", AtRowSearch);
  app.component("AntColumnDisplay", AntColumnDisplay);
  app.component("AntViewRange", AntViewRange);
  app.component("AntDefaultViewRange", AntDefaultViewRange);
  app.component("AntTableCondition", AntTableCondition);
}
