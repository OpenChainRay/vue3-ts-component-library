<template>
  <div class="table-column-page">
    <div class="toolbar-container">
      <div class="toolbar-view">
        <AntTableView
          :table-code="tableCode"
          :table-columns="tableColumnsForView"
          :all-column-quote="allColumnQuote"
          :service="viewService"
          :runtime="runtime"
          :is-show-setting="false"
          @update:table-columns="onTableColumnsChange"
          @update:allColumnQuote="onAllColumnQuoteChange"
          @updateviewConfig="onViewConfigChange"
        />
        <span class="filter" :class="{ blue: showSearch }" @click="showSearch = !showSearch">过滤</span>
        <span class="pagecount">(共 <strong>{{ total }}</strong> 条数据)</span>
      </div>
    </div>

    <div v-if="showSearch" class="search-panel">
      <AntViewSearch :columns="searchColumns" @confirm="onAdvancedSearch" />
    </div>
    <div class="table-card">
      <TinyGrid
        :data="tableList"
        :height="cardHeight"
        :loading="loading"
        column-key
        show-header-overflow="tooltip"
        :optimization="{ animat: true, delayHover: 250 }"
        remote-sort
        @sort-change="sortChange"
      >
        <TinyGridColumn type="selection" width="32" fixed="left" />
        <TinyGridColumn title="序号" width="60" align="center">
          <template #default="{ rowIndex }">
            <span>{{ (pageNum - 1) * pageSize + rowIndex + 1 }}</span>
          </template>
        </TinyGridColumn>
        <TinyGridColumn
          v-for="column in tableColumns"
          :key="column.code || column.dataIndex"
          :field="column.dataIndex"
          :title="column.columnTitle || column.dataIndex"
          :sortable="true"
          :width="column.width"
          :align="column.align || 'left'"
          show-overflow
        >
          <template #header>
            <AtRowSearch :table-column-obj="toRowColumn(column)" @search="onRowSearch" />
          </template>
          <template #default="{ row }">
            {{ formatCellValue(column, row) }}
          </template>
        </TinyGridColumn>

        <template #empty>
          <div class="empty-center-block">
            <p class="tiny-grid__empty-img" />
            <span class="tiny-grid__empty-text">暂无数据</span>
          </div>
        </template>
      </TinyGrid>

      <TinyPager
        mode="number"
        :current-page="pageNum"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :total="total"
        align="right"
        @current-change="changePage"
        @size-change="changePageSize"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type ComputedRef } from "vue";
import { useRoute } from "vue-router";
import { Grid as TinyGrid, GridColumn as TinyGridColumn, Pager as TinyPager } from "@opentiny/vue";
import { AntTableView, AntViewSearch, AtRowSearch } from "../ant-view/vue3-ui";
import { createHttpViewService, type RuntimePort, type ViewColumn, type ViewServicePort } from "../ant-view/core";
import { authorizedFetch } from "./app-api";

interface PageQueryPayload {
  pageNum: number;
  pageSize: number;
  orderColumns: Array<{ columnName: string; isAsc: boolean }>;
  param: Record<string, unknown>;
}

interface PageQueryResult {
  list: Record<string, unknown>[];
  total: number;
  pageSize: number;
}

const route = useRoute();
const tableCode = computed(() => String(route.query.tableCode || "7f88d743-b411-4590-b6ca-42b68afa82bc"));

const {
  tableColumns,
  tableColumnsForView,
  allColumnQuote,
  viewService,
  runtime,
  showSearch,
  pageNum,
  pageSize,
  pageSizes,
  total,
  loading,
  tableList,
  searchColumns,
  onTableColumnsChange,
  onAllColumnQuoteChange,
  onViewConfigChange,
  onAdvancedSearch,
  onRowSearch,
  changePage,
  changePageSize,
  sortChange,
  refreshTable
} = useTableViewBridge({
  tableCode,
  fetchPage: fetchPageData
});

const cardHeight = 620;

/** 分页接口 */
async function fetchPageData(payload: PageQueryPayload): Promise<PageQueryResult> {
  const amsUrl = import.meta.env.VITE_APP_AMS_URL || "/api/at-ams-api";
  const response = await authorizedFetch(`${amsUrl}/column/page`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
  const result = (await response.json()) as {
    code: number;
    msg: string;
    data?: { list?: Record<string, unknown>[]; total?: number; pageSize?: number };
  };
  if (result.code !== 200) {
    throw new Error(result.msg || "分页接口请求失败");
  }
  return {
    list: result.data?.list || [],
    total: Number(result.data?.total || 0),
    pageSize: Number(result.data?.pageSize || payload.pageSize)
  };
}

/** 构造行搜索列 */
function toRowColumn(column: ViewColumn) {
  return {
    ...column,
    columnTitle: column.columnTitle || column.dataIndex,
    columnType: Number(column.columnType || 0),
    paramType: 1 as const
  };
}

/** 单元格显示文本 */
function formatCellValue(column: ViewColumn, row: Record<string, unknown>) {
  const value = row[column.dataIndex];
  if (column.dataIndex === "columnType") return getText(COLUMN_TYPE_LIST, value);
  if (column.dataIndex === "applicationFlag") return getText(APPLICATION_FLAG_LIST, value);
  if (column.dataIndex === "isRequired") return getText(YES_NO_LIST, value);
  if (column.dataIndex === "defaultIsShow") return getText(YES_NO_LIST, value);
  if (column.dataIndex === "search") return getText(YES_NO_LIST, value);
  if (column.dataIndex === "ellipsis") return getText(YES_NO_LIST, value);
  if (column.dataIndex === "isGaugeOutfit") return getText(YES_NO_LIST, value);
  if (column.dataIndex === "paramType") return getText(PARAM_TYPE_LIST, value);
  return value ?? "";
}

/** 字典回显 */
function getText(list: Array<{ value: number | string; label: string }>, value: unknown) {
  const target = list.find((item) => String(item.value) === String(value));
  return target?.label ?? value ?? "";
}

/** 封装视图联动，仅暴露页面最小接入 */
function useTableViewBridge(options: {
  tableCode: ComputedRef<string>;
  fetchPage: (payload: PageQueryPayload) => Promise<PageQueryResult>;
}) {
  const pageSizes = ref([50, 100, 150, 200]);
  const pageNum = ref(1);
  const pageSize = ref(100);
  const total = ref(0);
  const loading = ref(false);
  const showSearch = ref(false);
  const tableList = ref<Record<string, unknown>[]>([]);
  const tableColumns = ref<ViewColumn[]>([]);
  const allColumnQuote = ref<Array<{ name: string; sortNo?: number; list: ViewColumn[] }>>([]);
  const viewConfig = ref<Record<string, unknown>>({});
  const advancedSearchPayload = ref<Record<string, unknown>>({});
  const rowSearchMap = ref<Record<string, { operator: number; relationType: 0 | 1; value: unknown; paramType?: 1 | 2 }>>({});

  const runtime: RuntimePort = {
    /** 成功提示 */
    notifySuccess(message) {
      console.info(message);
    },
    /** 错误提示 */
    notifyError(message) {
      console.error(message);
    }
  };

  const httpClient = {
    /** GET 请求 */
    async get<T>(url: string): Promise<T> {
      const response = await authorizedFetch(url, { method: "GET" });
      return (await response.json()) as T;
    },
    /** POST 请求 */
    async post<T>(url: string, body?: unknown): Promise<T> {
      const response = await authorizedFetch(url, {
        method: "POST",
        body: JSON.stringify(body || {})
      });
      return (await response.json()) as T;
    },
    /** PUT 请求 */
    async put<T>(url: string, body?: unknown): Promise<T> {
      const response = await authorizedFetch(url, {
        method: "PUT",
        body: JSON.stringify(body || {})
      });
      return (await response.json()) as T;
    }
  };

  const viewService: ViewServicePort = createHttpViewService({
    appViewUrl: import.meta.env.VITE_APP_VIEW_URL || "/api/at-ams-api",
    appCmsUrl: import.meta.env.VITE_APP_CMS_URL || "/api/at-cms-api",
    httpClient
  });

  const searchColumns = computed(() => {
    return tableColumns.value
      .filter((item) => item.search !== false)
      .map((item) => ({
        dataIndex: item.dataIndex,
        columnTitle: item.columnTitle || item.dataIndex,
        columnType: Number(item.columnType || 0),
        paramType: 1 as const
      }));
  });

  const tableColumnsForView = computed(() => tableColumns.value as unknown as Record<string, unknown>[]);

  /** 表格列变更 */
  function onTableColumnsChange(columns: Record<string, unknown>[]) {
    tableColumns.value = normalizeIncomingColumns(columns);
  }

  /** 全量列分组变更 */
  function onAllColumnQuoteChange(value: Record<string, unknown>[]) {
    allColumnQuote.value = value as Array<{ name: string; sortNo?: number; list: ViewColumn[] }>;
    if (!tableColumns.value.length) {
      tableColumns.value = flattenColumns(allColumnQuote.value);
    }
  }

  /** 视图配置更新 */
  function onViewConfigChange(value: Record<string, unknown>) {
    viewConfig.value = value;
    const currentColumns = ((value as Record<string, unknown>).columns || []) as Record<string, unknown>[];
    if (!allColumnQuote.value.length && currentColumns.length) {
      allColumnQuote.value = normalizeGroupColumns(currentColumns);
    }
    if (!tableColumns.value.length) {
      tableColumns.value = flattenColumns(allColumnQuote.value);
    }
    pageNum.value = Number(value.currentPageNum || 1);
    pageSize.value = Number(value.currentPageSize || 100);
    const nextPageSizes = Array.isArray(value.pageSizeOptions) ? value.pageSizeOptions.map((item) => Number(item)) : [];
    if (nextPageSizes.length) {
      pageSizes.value = nextPageSizes;
    }
    initTableData();
  }

  /** 高级筛选提交 */
  function onAdvancedSearch(payload: unknown) {
    advancedSearchPayload.value = (payload as Record<string, unknown>) || {};
    pageNum.value = 1;
    initTableData();
  }

  /** 行内筛选提交 */
  function onRowSearch(payload: unknown) {
    const data = payload as { columnTitle: string; operator: number; relationType: 0 | 1; value: unknown; paramType?: 1 | 2 };
    if (!data?.columnTitle) return;
    if (data.value === "" || data.value === undefined || data.value === null) {
      delete rowSearchMap.value[data.columnTitle];
    } else {
      rowSearchMap.value[data.columnTitle] = {
        operator: data.operator,
        relationType: data.relationType,
        value: data.value,
        paramType: data.paramType
      };
    }
    pageNum.value = 1;
    initTableData();
  }

  /** 切页 */
  function changePage(nextPage: number) {
    pageNum.value = Number(nextPage || 1);
    initTableData();
  }

  /** 切换分页大小 */
  function changePageSize(nextPageSize: number) {
    pageSize.value = Number(nextPageSize || 100);
    pageNum.value = 1;
    initTableData();
  }

  /** 列排序 */
  function sortChange(params: { field?: string; order?: string }) {
    initTableData(params);
  }

  /** 视图刷新 */
  function refreshTable() {
    initTableData();
  }

  /** 拉取分页数据 */
  async function initTableData(sorter?: { field?: string; order?: string }) {
    const viewId = viewConfig.value.viewId as string | undefined;
    if (!viewId) {
      return;
    }
    loading.value = true;
    try {
      const payload: PageQueryPayload = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        orderColumns: [],
        param: buildSearchParam(viewId, advancedSearchPayload.value, rowSearchMap.value)
      };
      if (sorter?.field && sorter?.order) {
        payload.orderColumns = [{ columnName: sorter.field, isAsc: sorter.order === "asc" }];
      }
      const pageResult = await options.fetchPage(payload);
      tableList.value = pageResult.list || [];
      total.value = Number(pageResult.total || 0);
      pageSize.value = Number(pageResult.pageSize || pageSize.value);
    } catch (error) {
      runtime.notifyError?.(error instanceof Error ? error.message : "分页接口异常");
    } finally {
      loading.value = false;
    }
  }

  return {
    tableColumns,
    tableColumnsForView,
    allColumnQuote,
    viewService,
    runtime,
    showSearch,
    pageNum,
    pageSize,
    pageSizes,
    total,
    loading,
    tableList,
    searchColumns,
    onTableColumnsChange,
    onAllColumnQuoteChange,
    onViewConfigChange,
    onAdvancedSearch,
    onRowSearch,
    changePage,
    changePageSize,
    sortChange,
    refreshTable
  };
}

/** 构建筛选参数 */
function buildSearchParam(
  viewId: string,
  advancedSearchPayload: Record<string, unknown>,
  rowSearchMap: Record<string, { operator: number; relationType: 0 | 1; value: unknown; paramType?: 1 | 2 }>
) {
  const merged: Record<string, unknown> = { ...advancedSearchPayload, viewId };
  const rowFilters = Object.entries(rowSearchMap);
  if (!rowFilters.length) {
    return merged;
  }
  const currentFilters = Array.isArray(merged.filters) ? [...(merged.filters as Array<Record<string, unknown>>)] : [];
  rowFilters.forEach(([fieldName, item]) => {
    const filterItem = { fieldName, operator: item.operator, relationType: item.relationType, value: item.value };
    if (item.paramType === 2) {
      merged[fieldName] = filterItem;
    } else {
      currentFilters.push(filterItem);
    }
  });
  if (currentFilters.length) {
    merged.filters = currentFilters;
  }
  return merged;
}

/** 兼容分组列与扁平列两种结构 */
function normalizeIncomingColumns(columns: Record<string, unknown>[]) {
  if (!Array.isArray(columns) || columns.length === 0) {
    return [] as ViewColumn[];
  }
  const first = columns[0] as Record<string, unknown>;
  if (!Array.isArray(first.columnList) && !Array.isArray(first.columnlist)) {
    return columns as unknown as ViewColumn[];
  }
  const visible: ViewColumn[] = [];
  const all: ViewColumn[] = [];
  columns.forEach((group) => {
    const list = (
      ((group as Record<string, unknown>).columnList || (group as Record<string, unknown>).columnlist || []) as Array<Record<string, unknown>>
    ).map((item) => normalizeColumn(item as unknown as ViewColumn));
    list.forEach((column) => {
      all.push(column);
      const shown = [1, "1", true, "true"].includes((column.defaultIsShow ?? column.checked) as never);
      const appFlag = Number(column.applicationFlag);
      if (shown && (Number.isNaN(appFlag) || appFlag === 0 || appFlag === 1)) {
        visible.push(column);
      }
    });
  });
  const target = visible.length ? visible : all;
  return target.sort((a, b) => Number(a.sortNo || 0) - Number(b.sortNo || 0));
}

/** 分组转扁平列 */
function flattenColumns(groups: Array<{ name: string; sortNo?: number; list: ViewColumn[] } | Record<string, unknown>>) {
  const all: ViewColumn[] = [];
  groups.forEach((group) => {
    const raw = group as Record<string, unknown>;
    const list = (raw.list || raw.columnList || raw.columnlist || []) as Array<Record<string, unknown>>;
    list.forEach((item) => all.push(normalizeColumn(item as unknown as ViewColumn)));
  });
  return all.sort((a, b) => Number(a.sortNo || 0) - Number(b.sortNo || 0));
}

/** 规范化 currentView.columns 分组 */
function normalizeGroupColumns(groups: Record<string, unknown>[]) {
  return groups.map((group) => {
    const raw = group as Record<string, unknown>;
    const list = ((raw.columnList || raw.columnlist || raw.list || []) as ViewColumn[]).map(normalizeColumn);
    return {
      name: String(raw.name || raw.groupName || ""),
      sortNo: Number(raw.sortNo || 0),
      list
    };
  });
}

/** 规范化列字段 */
function normalizeColumn(column: ViewColumn) {
  return {
    ...column,
    dataIndex: column.dataIndex || column.dataField || column.columnCode || "",
    columnTitle: column.columnTitle || column.dataIndex || column.dataField || ""
  } as ViewColumn;
}

const YES_NO_LIST = [
  { label: "否", value: 0 },
  { label: "是", value: 1 }
];

const PARAM_TYPE_LIST = [
  { label: "基础", value: 1 },
  { label: "扩展", value: 2 }
];

const COLUMN_TYPE_LIST = [
  { label: "文本", value: 0 },
  { label: "字典", value: 1 },
  { label: "日期", value: 2 },
  { label: "日期时间", value: 3 },
  { label: "数字", value: 4 },
  { label: "金额", value: 5 },
  { label: "布尔", value: 6 },
  { label: "自定义数据源", value: 7 },
  { label: "树", value: 8 }
];

const APPLICATION_FLAG_LIST = [
  { label: "查询列和条件", value: 0 },
  { label: "仅查询列", value: 1 },
  { label: "仅条件", value: 2 },
  { label: "页面传参", value: 3 }
];
</script>

<style scoped>
.table-column-page {
  padding: 16px;
}

.toolbar-container {
  margin-bottom: 12px;
}

.toolbar-view {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-panel {
  margin-bottom: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 10px;
  background: #fff;
}

.filter {
  cursor: pointer;
  color: #666;
}

.filter.blue {
  color: #1d4ed8;
}

.pagecount {
  color: #666;
}

.table-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 10px;
}

.empty-center-block {
  height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
