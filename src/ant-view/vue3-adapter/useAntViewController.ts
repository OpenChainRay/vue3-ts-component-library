import { computed, reactive, toRefs } from "vue";
import {
  createAntViewController,
  type ColumnMapByTableCode,
  type RuntimePort,
  type ViewColumn,
  type ViewServicePort
} from "../core";

export interface UseAntViewControllerOptions {
  tableCode: string;
  columnMap?: ColumnMapByTableCode;
  prependColumns?: ViewColumn[];
  service: ViewServicePort;
  runtime: RuntimePort;
}

/** 在 Vue3 中接入 AntView 控制器 */
export function useAntViewController(options: UseAntViewControllerOptions) {
  const controller = createAntViewController(
    options.tableCode,
    options.service,
    options.runtime,
    options.columnMap || {},
    options.prependColumns || []
  );

  const state = reactive({ ...controller.state });

  /** 同步 controller 原始状态到 Vue 响应式状态 */
  function syncState() {
    Object.assign(state, controller.state);
  }

  /** 初始化数据 */
  async function init() {
    await controller.initViewData();
    syncState();
  }

  /** 切换视图 */
  async function changeView(viewId: string | number) {
    await controller.changeCurrentView(viewId);
    syncState();
  }

  /** 刷新 tableCode 并重新加载 */
  async function refresh() {
    controller.refreshTableCode();
    await controller.initViewData();
    syncState();
  }

  const isReady = computed(() => !!state.currentView);

  return {
    ...toRefs(state),
    isReady,
    init,
    refresh,
    changeView
  };
}
