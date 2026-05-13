import { describe, expect, it, vi } from "vitest";
import { createHttpViewService } from "../http-service";
import type { HttpClientPort } from "../http-service";

function mockHttpClient() {
  const get: HttpClientPort["get"] = vi.fn(async () => ({ code: 200, msg: "ok", data: { currentView: { viewId: "v1", columns: [] }, viewList: [] } })) as any;
  const post: HttpClientPort["post"] = vi.fn(async () => ({ code: 200, msg: "ok", data: {} })) as any;
  const put: HttpClientPort["put"] = vi.fn(async () => ({ code: 200, msg: "ok", data: null })) as any;
  return { get, post, put };
}

describe("http-service", () => {
  it("calls update view columns endpoint", async () => {
    const http = mockHttpClient();
    const service = createHttpViewService({ appViewUrl: "http://view", appCmsUrl: "http://cms", httpClient: http });
    await service.updateViewColumns?.({ viewId: "v1" });
    expect(http.post).toHaveBeenCalledWith("http://view/view/update", { viewId: "v1" });
  });

  it("uses save endpoint when viewId missing", async () => {
    const http = mockHttpClient();
    const service = createHttpViewService({ appViewUrl: "http://view", appCmsUrl: "http://cms", httpClient: http });
    await service.saveViewRange?.({ tableCode: "t1" });
    expect(http.post).toHaveBeenCalledWith("http://view/view/save", { tableCode: "t1" });
  });

  it("uses update endpoint when viewId exists", async () => {
    const http = mockHttpClient();
    const service = createHttpViewService({ appViewUrl: "http://view", appCmsUrl: "http://cms", httpClient: http });
    await service.saveDefaultViewRange?.({ viewId: "v1" });
    expect(http.post).toHaveBeenCalledWith("http://view/view/update", { viewId: "v1" });
  });
});
