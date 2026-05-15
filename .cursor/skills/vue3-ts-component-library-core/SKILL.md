---
name: vue3-ts-component-library-core
description: Vue3 + TypeScript 组件库企业开发规范。覆盖 core 领域类型、接口边界、过滤/视图模型、测试与提交要求。目标是减少 unknown/any，优先可维护的显式类型。
---

# vue3-ts-component-library 企业规范

## 技术栈与范围
- 项目：`vue3-ts-component-library`
- 技术栈：`Vue 3 + TypeScript + Vite + Vitest`
- 重点目录：`src/ant-view/core`
- 目标：核心域模型强类型化，减少 `unknown`、禁止新增 `any`

## UI 组件默认规范（openTiny）
1. 默认优先使用 `@opentiny/vue` 组件实现界面能力。
2. 表格默认使用 openTiny 表格组件（如 `TinyGrid`），按钮默认使用 openTiny 按钮组件（如 `TinyButton`）。
3. 表单、弹窗、下拉、分页等基础交互优先使用 openTiny 同类组件，保持交互与主题一致。
4. 非必要不引入原生 HTML 控件替代（如直接 `<button>`、裸 `<table>`）。
5. 如 openTiny 无等价能力，再补充其他组件方案，并在代码中说明原因。

## 强制类型规则（核心）
1. 禁止新增 `any`；如确有动态输入，先定义领域联合类型再接入。
2. `unknown` 仅允许出现在不可控边界（极少数入参守卫），业务层与 core 层禁止直接透传 `unknown`。
3. 过滤值必须使用显式类型（如 `FilterInputValue`、`NormalizedFilterValue`、`DateRangeValue`），不得用宽泛对象兜底。
4. 对外 `port` 的 payload/返回值必须有命名接口，不允许匿名 `Record<string, any>`。

## core 目录约束
1. `types.ts` 是核心类型单一事实来源（SSOT），新增结构先补类型再写逻辑。
2. `ports.ts` 仅保留接口契约，不写业务逻辑；契约类型要可被 adapter 直接实现。
3. `http-service.ts` 只做传输编排与错误抛出，不拼接业务字段。
4. `filter-*` 文件中，值类型必须贯通：输入 -> 归一化 -> payload 输出。
5. `column-pipeline.ts` 中后端兼容逻辑必须通过 type guard 处理，不允许直接双重断言绕过检查。

## 代码实现要求
1. 方法上方必须有简短注释，说明职责，不写冗长解释。
2. 复杂分支优先拆小函数，函数签名体现输入/输出类型。
3. 优先纯函数与不可变写法，避免在多处共享可变状态。
4. 错误处理统一返回可读消息，避免吞异常。

## 自测要求（修改后直接执行）
在仓库根目录运行：

```bash
npm run typecheck
npm run test
npm run build
```

如只改动 `core`，至少执行 `npm run typecheck` 与 `npm run test`。
