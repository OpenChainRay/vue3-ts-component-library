<template>
  <div class="ant-column-display">
    <button type="button" class="trigger" @click="visible = true">
      <slot>设置</slot>
    </button>

    <div v-if="visible" class="panel">
      <div class="header">
        <label>
          <input type="checkbox" :checked="checkAll" @change="onToggleAll" />
          <span>{{ checkAll ? "取消全选" : "全选" }}</span>
        </label>
      </div>

      <div class="content">
        <div class="left">
          <div v-for="group in groupedColumns" :key="group.name" class="group">
            <p class="title">{{ group.name }}</p>
            <label v-for="column in group.list" :key="column.code || column.dataIndex" class="item">
              <input
                type="checkbox"
                :disabled="column.isRequired === 1"
                :checked="column.defaultIsShow === 1 || column.defaultIsShow === true"
                @change="onToggleColumn(column, $event)"
              />
              {{ column.columnTitle || column.dataIndex }}
            </label>
          </div>
        </div>
        <div class="right">
          <p class="title">已选字段</p>
          <div v-for="column in selectedColumns" :key="column.code || column.dataIndex" class="selected-item">
            <span>{{ column.columnTitle || column.dataIndex }}</span>
            <button type="button" :disabled="column.isRequired === 1" @click="removeColumn(column.code || column.columnCode || column.dataIndex)">
              x
            </button>
          </div>
        </div>
      </div>

      <div class="actions">
        <button type="button" @click="visible = false">取消</button>
        <button type="button" :disabled="saving" @click="onConfirm">{{ saving ? "保存中..." : "确认" }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useColumnDisplayController } from "../vue3-adapter";
import type { ColumnDisplayGroup, RuntimePort, ViewColumn, ViewServicePort } from "../core";

interface Props {
  viewConfig: { viewId: string | number };
  tableColumns: ViewColumn[];
  allColumnQuote: ColumnDisplayGroup[];
  service?: ViewServicePort;
  runtime?: RuntimePort;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "change", columns: ViewColumn[]): void;
  (e: "switchColumn", columns: ViewColumn[]): void;
  (e: "save", payload: unknown): void;
}>();

const visible = ref(false);
const saving = ref(false);

const { groupedColumns, selectedColumns, checkAll, toggleColumn, toggleAll, removeColumn, buildPayload } = useColumnDisplayController({
  viewId: props.viewConfig.viewId,
  tableColumns: props.tableColumns,
  allColumnQuote: props.allColumnQuote
});

/** 切换全选 */
function onToggleAll(event: Event) {
  toggleAll((event.target as HTMLInputElement).checked);
}

/** 切换单列 */
function onToggleColumn(column: ViewColumn, event: Event) {
  toggleColumn(column.code || column.columnCode || column.dataIndex, (event.target as HTMLInputElement).checked);
}

/** 确认 */
async function onConfirm() {
  const payload = buildPayload();
  try {
    saving.value = true;
    if (props.service?.updateViewColumns) {
      const result = await props.service.updateViewColumns(payload);
      if (result?.msg) {
        props.runtime?.notifySuccess?.(result.msg);
      }
    } else {
      emit("save", payload);
    }
    emit("switchColumn", selectedColumns.value);
    emit("change", selectedColumns.value);
    visible.value = false;
  } catch (error) {
    props.runtime?.notifyError?.(error instanceof Error ? error.message : "保存列配置失败");
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.trigger {
  border: 1px solid #d9d9d9;
  background: #f3f4f5;
  border-radius: 4px;
  height: 32px;
  padding: 0 12px;
}

.panel {
  margin-top: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #fff;
  padding: 12px;
}

.content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 12px;
  margin-top: 8px;
}

.left,
.right {
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  padding: 8px;
  max-height: 420px;
  overflow: auto;
}

.item,
.selected-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 28px;
}

.title {
  margin: 8px 0;
  font-weight: 500;
}

.actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
