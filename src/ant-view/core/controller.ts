import { defaultPageInfo } from "./constants";
import { attachPageInfo, dedupeQuerySourceColumns, normalizeViewColumns, pickVisibleColumns } from "./column-pipeline";
import type { RuntimePort, ViewServicePort } from "./ports";
import { resolveTableCode } from "./table-code";
import { splitViewList } from "./view-list";
import type { ColumnMapByTableCode, ViewConfig, ViewColumn } from "./types";

export interface AntViewControllerState {
  tableCode: string;
  viewId: string | number | "";
  currentView: ViewConfig | null;
  allColumns: ViewColumn[];
  visibleColumns: ViewColumn[];
  allColumnQuote: Array<{ name: string; sortNo?: number; list: ViewColumn[] }>;
  groupList: Array<{ isGroup: boolean; groupName: string; viewOptionList: Array<{ viewId: string | number; viewName: string }> }>;
  topLevelList: Array<{ viewId: string | number; viewName: string }>;
  pageConfig: { currentPageNum: number; currentPageSize: string; pageSizeOptions: string[] };
  loading: boolean;
}

/** 创建 AntView 控制器 */
export function createAntViewController(
  defaultTableCode: string,
  service: ViewServicePort,
  runtime: RuntimePort,
  columnMap: ColumnMapByTableCode = {},
  prependColumns: ViewColumn[] = []
) {
  const state: AntViewControllerState = {
    tableCode: resolveTableCode(defaultTableCode, runtime),
    viewId: "",
    currentView: null,
    allColumns: [],
    visibleColumns: [],
    allColumnQuote: [],
    groupList: [],
    topLevelList: [],
    pageConfig: {
      currentPageNum: defaultPageInfo.currentPageNum,
      currentPageSize: "50",
      pageSizeOptions: ["50", "100", "150", "200"]
    },
    loading: false
  };

  return {
    state,
    refreshTableCode,
    initViewData,
    changeCurrentView
  };

  /** 刷新 tableCode */
  function refreshTableCode() {
    state.tableCode = resolveTableCode(defaultTableCode, runtime);
  }

  /** 初始化视图 */
  async function initViewData() {
    state.loading = true;
    try {
      const payload = await service.getViewList(state.tableCode);
      state.currentView = payload.currentView;
      state.viewId = payload.currentView.viewId;
      const listResult = splitViewList(payload.viewList);
      state.groupList = listResult.groupList;
      state.topLevelList = listResult.topLevelList;

      const normalized = normalizeViewColumns(payload.currentView.columns, state.tableCode, columnMap);
      state.allColumns = normalized.allColumns;
      state.visibleColumns = pickVisibleColumns(normalized.allColumns, prependColumns);
      console.log(payload.currentView.columns, "currentView.columns");
      console.log(state.allColumns, "allColumns-normalized");
      console.log(state.visibleColumns, "visibleColumns-picked");
      state.allColumnQuote = normalized.allColumnQuote;
      state.pageConfig = attachPageInfo(payload.currentView);

      await hydrateQuerySourceList(normalized.querySourceColumns);
    } catch (error) {
      runtime.notifyError?.(normalizeError(error));
    } finally {
      state.loading = false;
    }
  }

  /** 切换当前视图 */
  async function changeCurrentView(viewId: string | number) {
    state.loading = true;
    try {
      await service.changeCurrentView(viewId);
      await initViewData();
    } catch (error) {
      runtime.notifyError?.(normalizeError(error));
      state.loading = false;
    }
  }

  /** 查询 querySource 列下拉 */
  async function hydrateQuerySourceList(columns: ViewColumn[]) {
    if (!service.filterQuerySource) {
      return;
    }
    const dedupedColumns = dedupeQuerySourceColumns(columns);
    for (const column of dedupedColumns) {
      const queryCode = column.querySource?.queryCode;
      if (!queryCode) {
        continue;
      }
      const list = await service.filterQuerySource(queryCode, 50);
      state.allColumns
        .filter((item) => item.querySource?.queryCode === queryCode)
        .forEach((item) => {
          item.list = list;
        });
    }
    state.visibleColumns = pickVisibleColumns(state.allColumns, prependColumns);
  }
}

/** 格式化异常文本 */
function normalizeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "视图服务请求失败";
}
