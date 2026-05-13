<template>
  <div class="page">
    <h2>AntView Usage Demo</h2>

    <section class="block">
      <h3>AntColumnDisplay</h3>
      <AntColumnDisplay
        :view-config="viewConfig"
        :table-columns="tableColumns"
        :all-column-quote="allColumnQuote"
        :service="service"
        :runtime="runtime"
        @change="onColumnsChange"
      >
        列设置
      </AntColumnDisplay>
    </section>

    <section class="block">
      <h3>AntViewRange</h3>
      <AntViewRange
        :view-config="viewConfig"
        :table-code="tableCode"
        :columns="allColumnsFlat"
        :service="service"
        :runtime="runtime"
        @initViewData="onReload"
      >
        视图数据范围
      </AntViewRange>
    </section>

    <section class="block">
      <h3>AntDefaultViewRange</h3>
      <AntDefaultViewRange
        :view-config="viewConfig"
        :table-code="tableCode"
        :columns="allColumnsFlat"
        :service="service"
        :runtime="runtime"
      >
        默认数据范围
      </AntDefaultViewRange>
    </section>

    <section class="block">
      <h3>AntTableCondition</h3>
      <AntTableCondition
        :table-code="tableCode"
        :id="bizId"
        :columns="allColumnsFlat"
        :service="service"
        :runtime="runtime"
      >
        默认条件
      </AntTableCondition>
    </section>

    <section class="block">
      <h3>AntViewSearch</h3>
      <AntViewSearch :columns="searchColumns" @confirm="onSearchConfirm" />
    </section>

    <section class="block">
      <h3>AtRowSearch</h3>
      <AtRowSearch :table-column-obj="rowSearchColumn" @search="onRowSearch" />
    </section>

    <section class="block">
      <h3>Event Log</h3>
      <pre class="log">{{ logText }}</pre>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { RuntimePort, ViewColumn, ViewServicePort } from "../ant-view/core";
import {
  AntColumnDisplay,
  AntDefaultViewRange,
  AntTableCondition,
  AntViewRange,
  AntViewSearch,
  AtRowSearch
} from "../ant-view/vue3-ui";

const tableCode = "demo-table-code";
const bizId = "demo-biz-id";
const viewConfig = ref({ viewId: "view-demo-1", viewType: 2 });
const logs = ref<string[]>([]);

const allColumnQuote = ref([
  {
    name: "基础字段",
    sortNo: 0,
    list: [
      { code: "code", columnCode: "code", dataIndex: "code", columnTitle: "编码", columnType: 0, search: 1, applicationFlag: 0, defaultIsShow: 1, sortNo: 0, isRequired: 1 },
      { code: "name", columnCode: "name", dataIndex: "name", columnTitle: "名称", columnType: 0, search: 1, applicationFlag: 0, defaultIsShow: 1, sortNo: 1, isRequired: 0 },
      { code: "status", columnCode: "status", dataIndex: "status", columnTitle: "状态", columnType: 1, search: 1, applicationFlag: 0, defaultIsShow: 1, sortNo: 2, isRequired: 0 }
    ]
  }
]);

const tableColumns = ref<ViewColumn[]>([
  allColumnQuote.value[0].list[0],
  allColumnQuote.value[0].list[1],
  allColumnQuote.value[0].list[2]
]);

const searchColumns = ref([
  { dataIndex: "code", columnTitle: "编码", columnType: 0, paramType: 1 as const },
  { dataIndex: "status", columnTitle: "状态", columnType: 1, paramType: 1 as const },
  { dataIndex: "enableFlag", columnTitle: "启用", columnType: 6, paramType: 2 as const }
]);

const rowSearchColumn = ref({
  code: "status",
  dataIndex: "status",
  columnTitle: "状态",
  columnType: 1,
  paramType: 1 as const,
  list: [
    { dictText: "启用", dictId: "1" },
    { dictText: "禁用", dictId: "0" }
  ]
});

const allColumnsFlat = computed(() => allColumnQuote.value.flatMap((group) => group.list));
const logText = computed(() => logs.value.join("\n"));

/** mock service */
const service: ViewServicePort = {
  async getViewList() {
    return { currentView: { viewId: "view-demo-1", columns: [] }, viewList: [] } as any;
  },
  async changeCurrentView() {},
  async updateViewColumns(payload) {
    pushLog(`updateViewColumns: ${JSON.stringify(payload)}`);
    return { msg: "列配置保存成功(mock)" };
  },
  async saveViewRange(payload) {
    pushLog(`saveViewRange: ${JSON.stringify(payload)}`);
    return { msg: "视图范围保存成功(mock)" };
  },
  async saveDefaultViewRange(payload) {
    pushLog(`saveDefaultViewRange: ${JSON.stringify(payload)}`);
    return { msg: "默认范围保存成功(mock)" };
  },
  async saveTableCondition(payload) {
    pushLog(`saveTableCondition: ${JSON.stringify(payload)}`);
    return { msg: "表条件保存成功(mock)" };
  }
};

/** runtime 提示 */
const runtime: RuntimePort = {
  notifySuccess(message) {
    pushLog(`SUCCESS: ${message}`);
  },
  notifyError(message) {
    pushLog(`ERROR: ${message}`);
  }
};

/** 更新列 */
function onColumnsChange(columns: ViewColumn[]) {
  tableColumns.value = [...columns];
  pushLog(`change columns: ${columns.length}`);
}

/** 刷新 */
function onReload() {
  pushLog("initViewData triggered");
}

/** 高级筛选回调 */
function onSearchConfirm(payload: unknown, type: "搜索" | "重置") {
  pushLog(`search confirm(${type}): ${JSON.stringify(payload)}`);
}

/** 行内搜索回调 */
function onRowSearch(payload: unknown) {
  pushLog(`row search: ${JSON.stringify(payload)}`);
}

/** 记录日志 */
function pushLog(line: string) {
  logs.value = [`${new Date().toISOString()} ${line}`, ...logs.value].slice(0, 30);
}
</script>

<style scoped>
.page {
  padding: 16px;
}

.block {
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.log {
  min-height: 120px;
  white-space: pre-wrap;
  background: #f8fafc;
  padding: 8px;
}
</style>
