# vue3-ts-component-library

使用 Vue3 + TS 重构组件库。

## ant-view 分层

- `src/ant-view/core`：无框架逻辑层（Vue/React 可复用）
- `src/ant-view/vue3-adapter`：Vue3 组合式适配层
- `src/ant-view/vue3-ui`：Vue3 UI 组件层

## 旧新契约迁移映射

- `AntColumnDisplay`
  - 旧：`@change`、`@switchColumn`、组件内直接调用接口
  - 新：保留 `@change`、`@switchColumn`、`@save`；可传 `service.updateViewColumns` 走内置保存
- `AntViewRange`
  - 旧：`@customRviewRange` / `@initViewData`
  - 新：保留两事件；新增可选 `service.saveViewRange`（优先内置保存）与 `runtime.notifyError/notifySuccess`
- `AntDefaultViewRange`
  - 旧：`@customRviewRange` / `@initViewData`
  - 新：保留两事件；新增可选 `service.saveDefaultViewRange`
- `AntTableCondition`
  - 旧：`@customTableCondition` / `@initViewData`
  - 新：保留两事件；新增可选 `service.saveTableCondition`

## Service Port 能力

在 `ViewServicePort` 中新增可选能力，按需注入：

- `updateViewColumns(payload)`
- `saveViewRange(payload)`
- `saveDefaultViewRange(payload)`
- `saveTableCondition(payload)`

> 若未注入上述方法，组件会回退到原有事件驱动模式（`save/custom*/initViewData`）。

## 宿主接入示例

```ts
import { createHttpViewService, type RuntimePort } from "vue3-ts-component-library";

/** 创建 ant-view 服务实例 */
export function createAntViewService(httpClient: {
  get: <T>(url: string) => Promise<T>;
  post: <T>(url: string, body?: unknown) => Promise<T>;
  put: <T>(url: string, body?: unknown) => Promise<T>;
}) {
  return createHttpViewService({
    appViewUrl: import.meta.env.VITE_APP_VIEW_URL,
    appCmsUrl: import.meta.env.VITE_APP_CMS_URL,
    httpClient
  });
}

/** 创建运行时提示能力 */
export function createAntViewRuntime(message: {
  success: (text: string) => void;
  error: (text: string) => void;
}): RuntimePort {
  return {
    notifySuccess(text) {
      message.success(text);
    },
    notifyError(text) {
      message.error(text);
    }
  };
}
```

```vue
<template>
  <AntColumnDisplay
    :view-config="{ viewId: currentViewId }"
    :table-columns="tableColumns"
    :all-column-quote="allColumnQuote"
    :service="antViewService"
    :runtime="antViewRuntime"
    @change="onColumnsChange"
  />

  <AntViewRange
    :table-code="tableCode"
    :view-config="{ viewId: currentViewId, viewType: currentViewType }"
    :columns="allColumns"
    :service="antViewService"
    :runtime="antViewRuntime"
    @initViewData="reloadViewData"
  />
</template>
```
