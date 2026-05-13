<template>
  <div v-if="isShow" class="ant-table-view">
    <div class="toolbar">
      <label class="label">视图</label>
      <select :value="String(viewId || '')" @change="onViewChange">
        <option v-for="item in topLevelList" :key="item.viewId" :value="String(item.viewId)">
          {{ item.viewName }}
        </option>
        <optgroup v-for="group in groupList" :key="group.groupName" :label="group.groupName">
          <option v-for="item in group.viewOptionList" :key="item.viewId" :value="String(item.viewId)">
            {{ item.viewName }}
          </option>
        </optgroup>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import type { ColumnMapByTableCode, RuntimePort, ViewServicePort } from "../core";
import { useAntViewController } from "../vue3-adapter";

interface Props {
  tableCode: string;
  tableColumns?: Array<Record<string, unknown>>;
  allColumnQuote?: Array<Record<string, unknown>>;
  columnMap?: ColumnMapByTableCode;
  isShow?: boolean;
  service: ViewServicePort;
  runtime: RuntimePort;
}

const props = withDefaults(defineProps<Props>(), {
  tableColumns: () => [],
  allColumnQuote: () => [],
  columnMap: () => ({}),
  isShow: true
});

const emit = defineEmits<{
  (e: "change", columns: Array<Record<string, unknown>>): void;
  (e: "update:tableColumns", columns: Array<Record<string, unknown>>): void;
  (e: "update:allColumnQuote", payload: Array<Record<string, unknown>>): void;
  (e: "updateviewConfig", payload: Record<string, unknown>): void;
  (e: "refresh"): void;
  (e: "updateLoading"): void;
}>();

const { viewId, topLevelList, groupList, visibleColumns, allColumnQuote, currentView, init, changeView } = useAntViewController({
  tableCode: props.tableCode,
  columnMap: props.columnMap,
  service: props.service,
  runtime: props.runtime
});

/** 处理视图切换 */
async function onViewChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value;
  emit("updateLoading");
  await changeView(value);
}

watch(visibleColumns, (value) => {
  emit("change", value as Array<Record<string, unknown>>);
  emit("update:tableColumns", value as Array<Record<string, unknown>>);
});

watch(allColumnQuote, (value) => {
  emit("update:allColumnQuote", value as Array<Record<string, unknown>>);
});

watch(currentView, (value) => {
  if (!value) {
    return;
  }
  emit("updateviewConfig", value as unknown as Record<string, unknown>);
  emit("refresh");
});

onMounted(async () => {
  await init();
});
</script>

<style scoped>
.ant-table-view {
  display: inline-flex;
}

.toolbar {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 4px 8px;
}

.label {
  color: #666;
  font-size: 12px;
}
</style>
