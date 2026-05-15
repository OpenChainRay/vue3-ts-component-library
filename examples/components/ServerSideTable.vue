<template>
  <div class="server-side-table">
    <div v-if="$slots.toolBarRender" class="server-side-table-toolbar">
      <slot name="toolBarRender" />
    </div>
    <a-table
      :row-key="rowKey"
      :columns="resolvedColumns"
      :data-source="tableData"
      :loading="loading"
      :bordered="bordered"
      :scroll="scroll"
      :row-selection="rowSelection"
      :pagination="paginationConfig"
      :size="size"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, text, record, index }">
        <slot
          v-if="slotName(column) && $slots[slotName(column)]"
          :name="slotName(column)"
          v-bind="{ text, record, index, column }"
        />
        <template v-else>{{ text }}</template>
      </template>
    </a-table>
  </div>
</template>

<script>
/**
 * 示例用远端分页表格（antd Table），替代已移除的 AtTable。
 */
function resolveColumns(raw) {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((c) => c && c.colSpan !== 0 && c.width !== 0)
    .map((c) => {
      const col = { ...c }
      const slot =
        col.scopedSlots?.customRender ||
        (typeof col.slots?.customRender === "string" ? col.slots.customRender : null)
      delete col.scopedSlots
      delete col.search
      delete col.fieldProps
      delete col.transform
      if (typeof slot === "string") {
        col.key = col.key || col.dataIndex || slot
        col.slots = { customRender: slot }
      }
      return col
    })
}

export default {
  name: "ServerSideTable",
  props: {
    rowKey: { type: [String, Function], default: "id" },
    columns: { type: Array, default: () => [] },
    data: { type: Function, required: true },
    showPagination: { type: [Boolean, String], default: true },
    bordered: { type: Boolean, default: false },
    search: { type: [Boolean, String, Object], default: false },
    drag: { type: Boolean, default: false },
    scroll: { type: Object, default: null },
    rowSelection: { type: Object, default: null },
    alert: { type: [Object, Boolean], default: null },
    pageNum: { type: Number, default: 1 },
    pageSize: { type: Number, default: 10 },
    size: { type: String, default: "small" },
    showSizeChanger: { type: Boolean, default: true },
    tableKey: { type: String, default: undefined }
  },
  data() {
    return {
      loading: false,
      tableData: [],
      innerPagination: {
        current: this.pageNum,
        pageSize: this.pageSize,
        total: 0,
        showSizeChanger: this.showSizeChanger,
        showTotal: (t) => `共 ${t} 条`
      },
      filterState: {},
      sorterState: {}
    }
  },
  computed: {
    resolvedColumns() {
      return resolveColumns(this.columns)
    },
    paginationConfig() {
      const sp = this.showPagination
      if (sp === false || sp === "auto") return false
      return this.innerPagination
    }
  },
  mounted() {
    this.loadData(this.innerPagination, this.filterState, this.sorterState)
  },
  methods: {
    slotName(column) {
      const s = column?.slots?.customRender
      return typeof s === "string" ? s : null
    },
    /**
     * 与旧 AtTable.refresh 对齐：bool true 时回到第一页。
     */
    refresh(resetFirstPage = false, filterObj) {
      if (resetFirstPage) {
        this.innerPagination = {
          ...this.innerPagination,
          current: 1,
          pageSize: this.pageSize
        }
      }
      if (filterObj) {
        this.filterState = { ...filterObj }
        this.innerPagination = { ...this.innerPagination, current: 1, pageSize: this.pageSize }
      }
      this.loadData(this.innerPagination, this.filterState, this.sorterState)
    },
    buildParameter(pagination, filters, sorter) {
      const sortField = sorter?.field ?? sorter?.columnKey
      const sortOrder = sorter?.order
      return Object.assign(
        {
          pageNo: pagination?.current ?? this.innerPagination.current,
          pageSize: pagination?.pageSize ?? this.innerPagination.pageSize
        },
        sortField ? { sortField } : {},
        sortOrder ? { sortOrder } : {},
        filters || {}
      )
    },
    async loadData(pagination, filters, sorter) {
      const parameter = this.buildParameter(pagination, filters, sorter)
      const result = this.data(parameter)
      if (!result || typeof result.then !== "function") {
        this.loading = false
        return
      }
      this.loading = true
      try {
        const r = await result
        if (!r) return
        const list = r.data || []
        if (
          list.length === 0 &&
          this.paginationConfig &&
          this.innerPagination.current > 1
        ) {
          this.innerPagination.current -= 1
          await this.loadData(this.innerPagination, filters, sorter)
          return
        }
        this.tableData = list
        this.innerPagination = {
          ...this.innerPagination,
          current: r.pageNo ?? parameter.pageNo,
          total: r.totalCount ?? 0,
          pageSize: r.pageSize ?? parameter.pageSize,
          showSizeChanger: this.showSizeChanger,
          showTotal: (t) => `共 ${t} 条`
        }
      } catch {
        /* 请求失败由页面自行提示 */
      } finally {
        this.loading = false
      }
    },
    handleTableChange(pag, filters, sorter) {
      this.filterState = { ...filters }
      this.sorterState = sorter || {}
      if (pag) {
        this.innerPagination = {
          ...this.innerPagination,
          current: pag.current,
          pageSize: pag.pageSize
        }
      }
      this.loadData(this.innerPagination, filters, sorter)
    }
  }
}
</script>

<style scoped>
.server-side-table-toolbar {
  margin-bottom: 16px;
}
</style>
