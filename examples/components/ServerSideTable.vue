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
      /** 保持引用稳定，避免 antd Table 因 pagination 对象替换反复触发 @change 导致连环请求 */
      innerPagination: {
        current: this.pageNum,
        pageSize: this.pageSize,
        total: 0,
        showSizeChanger: this.showSizeChanger,
        showTotal: (t) => `共 ${t} 条`
      },
      filterState: {},
      sorterState: {},
      /** 上次已成功发起的列表查询签名，用于去重 */
      lastLoadSignature: "",
      /** 进行中的请求签名（用于拦截并发重复请求） */
      pendingLoadSignature: "",
      /** 进行中的请求 Promise（同签名复用） */
      pendingLoadPromise: null
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
    refresh(resetFirstPage = false, filterObj, options = {}) {
      const { force = true } = options
      if (force) {
        this.lastLoadSignature = ""
      }
      if (resetFirstPage) {
        this.innerPagination.current = 1
        this.innerPagination.pageSize = this.pageSize
      }
      if (filterObj) {
        this.filterState = { ...filterObj }
        this.innerPagination.current = 1
        this.innerPagination.pageSize = this.pageSize
      }
      this.loadData(this.innerPagination, this.filterState, this.sorterState, {
        bypassDedupe: force
      })
    },
    buildParameter(pagination, filters, sorter) {
      const sortField = sorter?.field ?? sorter?.columnKey
      const sortOrder = sorter?.order
      const parameter = Object.assign(
        {
          pageNo: pagination?.current ?? this.innerPagination.current,
          pageSize: pagination?.pageSize ?? this.innerPagination.pageSize
        },
        sortField ? { sortField } : {},
        sortOrder ? { sortOrder } : {},
        filters || {}
      )
      return this.normalizeParameter(parameter)
    },
    /** 归一化请求参数，去掉 Table 初始化时注入的空过滤项。 */
    normalizeParameter(parameter) {
      const normalized = {}
      Object.keys(parameter || {}).forEach((key) => {
        const value = parameter[key]
        if (value === null || typeof value === "undefined") return
        if (Array.isArray(value)) {
          const compact = value.filter((item) => item !== null && typeof item !== "undefined")
          if (compact.length === 0) return
          normalized[key] = compact
          return
        }
        normalized[key] = value
      })
      return normalized
    },
    /** 生成列表请求去重键（与业务 data 函数入参一致） */
    loadSignature(parameter) {
      const keys = Object.keys(parameter).sort()
      const stable = {}
      keys.forEach((k) => {
        stable[k] = parameter[k]
      })
      return JSON.stringify(stable)
    },
    /**
     * 同步分页展示（原地改属性，不替换 innerPagination 引用）。
     */
    assignPaginationFromResult(parameter, r) {
      this.innerPagination.current = r.pageNo ?? parameter.pageNo
      this.innerPagination.total = r.totalCount ?? 0
      this.innerPagination.pageSize = r.pageSize ?? parameter.pageSize
      this.innerPagination.showSizeChanger = this.showSizeChanger
    },
    async loadData(pagination, filters, sorter, options = {}) {
      const { bypassDedupe = false } = options
      const parameter = this.buildParameter(pagination, filters, sorter)
      const sig = this.loadSignature(parameter)
      if (!bypassDedupe && sig === this.lastLoadSignature) {
        return
      }
      if (!bypassDedupe && sig === this.pendingLoadSignature && this.pendingLoadPromise) {
        await this.pendingLoadPromise
        return
      }
      const result = this.data(parameter)
      if (!result || typeof result.then !== "function") {
        this.loading = false
        return
      }
      this.loading = true
      this.pendingLoadSignature = sig
      this.pendingLoadPromise = result
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
          await this.loadData(this.innerPagination, filters, sorter, { bypassDedupe: true })
          return
        }
        this.tableData = list
        this.assignPaginationFromResult(parameter, r)
        this.lastLoadSignature = sig
      } catch {
        /* 请求失败由页面自行提示 */
      } finally {
        this.loading = false
        if (this.pendingLoadSignature === sig) {
          this.pendingLoadSignature = ""
          this.pendingLoadPromise = null
        }
      }
    },
    handleTableChange(pag, filters, sorter) {
      this.filterState = { ...filters }
      this.sorterState = sorter || {}
      if (pag) {
        this.innerPagination.current = pag.current
        this.innerPagination.pageSize = pag.pageSize
      }
      const normalized = this.buildParameter(this.innerPagination, filters, sorter)
      const hasSorter = Boolean(normalized.sortField && normalized.sortOrder)
      const hasFilter = Object.keys(normalized).some((k) => !["pageNo", "pageSize", "sortField", "sortOrder"].includes(k))
      if (this.loading && !hasSorter && !hasFilter) {
        return
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
