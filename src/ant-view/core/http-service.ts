import type { ViewListResponse } from "./types";
import type { ViewServicePort } from "./ports";

export interface HttpClientPort {
  get: <T>(url: string) => Promise<T>;
  post: <T>(url: string, body?: unknown) => Promise<T>;
  put: <T>(url: string, body?: unknown) => Promise<T>;
}

export interface CreateHttpViewServiceOptions {
  appViewUrl: string;
  appCmsUrl?: string;
  httpClient: HttpClientPort;
}

interface HttpResult<T> {
  code: number;
  msg: string;
  data: T;
}

/** 创建基于 HTTP 的视图服务 */
export function createHttpViewService(options: CreateHttpViewServiceOptions): ViewServicePort {
  const { appViewUrl, appCmsUrl, httpClient } = options;
  return {
    async getViewList(tableCode: string) {
      const result = await httpClient.get<HttpResult<ViewListResponse>>(`${appViewUrl}/view/getViewList/${tableCode}`);
      if (result.code !== 200) {
        throw new Error(result.msg || "getViewList failed");
      }
      return result.data;
    },
    async changeCurrentView(viewId: string | number) {
      const result = await httpClient.put<HttpResult<null>>(`${appViewUrl}/view/changeCurrentView/${viewId}`);
      if (result.code !== 200) {
        throw new Error(result.msg || "changeCurrentView failed");
      }
    },
    async getDictByTypeId(typeId: string) {
      if (!appCmsUrl) {
        return [];
      }
      const result = await httpClient.post<HttpResult<{ dictList?: unknown[] }>>(`${appCmsUrl}/dict/getDict`, {
        typeId,
        dictIds: [],
        dictKeys: [],
        dictTexts: []
      });
      if (result.code !== 200) {
        throw new Error(result.msg || "getDictByTypeId failed");
      }
      return result.data?.dictList || [];
    },
    async filterQuerySource(queryCode: string, pageSize: number) {
      const result = await httpClient.post<HttpResult<{ optionPage?: { list?: unknown[] } }>>(
        `${appViewUrl}/filterQuerySource/querySource`,
        {
          queryCode,
          param: {
            orderColumns: [{ columnName: "", isAsc: false }],
            pageNum: 1,
            pageSize,
            param: ""
          }
        }
      );
      if (result.code !== 200) {
        throw new Error(result.msg || "filterQuerySource failed");
      }
      return result.data?.optionPage?.list || [];
    },
    async updateViewColumns(payload: unknown) {
      const result = await httpClient.post<HttpResult<null>>(`${appViewUrl}/view/update`, payload);
      if (result.code !== 200) {
        throw new Error(result.msg || "updateViewColumns failed");
      }
      return { msg: result.msg };
    },
    async saveViewRange(payload: any) {
      const url = payload?.viewId ? `${appViewUrl}/view/update` : `${appViewUrl}/view/save`;
      const result = await httpClient.post<HttpResult<null>>(url, payload);
      if (result.code !== 200) {
        throw new Error(result.msg || "saveViewRange failed");
      }
      return { msg: result.msg };
    },
    async saveDefaultViewRange(payload: any) {
      const url = payload?.viewId ? `${appViewUrl}/view/update` : `${appViewUrl}/view/save`;
      const result = await httpClient.post<HttpResult<null>>(url, payload);
      if (result.code !== 200) {
        throw new Error(result.msg || "saveDefaultViewRange failed");
      }
      return { msg: result.msg };
    },
    async saveTableCondition(payload: unknown) {
      const result = await httpClient.post<HttpResult<null>>(`${appViewUrl}/view/save`, payload);
      if (result.code !== 200) {
        throw new Error(result.msg || "saveTableCondition failed");
      }
      return { msg: result.msg };
    }
  };
}
