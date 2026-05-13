import type { ViewListResponse } from "./types";

export interface ViewServicePort {
  /** 获取视图列表与当前视图 */
  getViewList: (tableCode: string) => Promise<ViewListResponse>;
  /** 切换当前视图 */
  changeCurrentView: (viewId: string | number) => Promise<void>;
  /** 查询字典列表 */
  getDictByTypeId?: (typeId: string) => Promise<unknown[]>;
  /** 查询 querySource 下拉数据 */
  filterQuerySource?: (queryCode: string, pageSize: number) => Promise<unknown[]>;
  /** 保存列配置 */
  updateViewColumns?: (payload: unknown) => Promise<{ msg?: string } | void>;
  /** 保存视图范围配置 */
  saveViewRange?: (payload: unknown) => Promise<{ msg?: string } | void>;
  /** 保存默认范围配置 */
  saveDefaultViewRange?: (payload: unknown) => Promise<{ msg?: string } | void>;
  /** 保存表条件配置 */
  saveTableCondition?: (payload: unknown) => Promise<{ msg?: string } | void>;
}

export interface RuntimePort {
  /** 统一消息提示 */
  notifyError?: (message: string) => void;
  /** 成功提示 */
  notifySuccess?: (message: string) => void;
  /** 路由路径 */
  currentPath?: string;
  /** 本地缓存 */
  treeFlatten?: Array<{ fullPath: string; tableCode?: string }>;
}
