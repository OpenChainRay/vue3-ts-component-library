<template>
  <div class="ant-view-search">
    <div v-for="group in draft.groups" :key="group.id" class="group">
      <div v-for="node in group.children" :key="node.id" class="row">
        <select :disabled="disabled" :value="node.fieldName" @change="onFieldChange(group.id, node.id, $event)">
          <option v-for="column in columns" :key="column.dataIndex" :value="column.dataIndex">
            {{ column.columnTitle }}
          </option>
        </select>

        <select :disabled="disabled" :value="node.operator" @change="onOperatorChange(group.id, node.id, $event)">
          <option v-for="operator in getNodeOperators(node)" :key="operator.value" :value="operator.value">
            {{ operator.label }}
          </option>
        </select>

        <input
          v-if="!isBooleanNode(node)"
          :disabled="disabled"
          :value="String(node.value ?? '')"
          :placeholder="`请输入${node.columnTitle}`"
          @input="onValueChange(group.id, node.id, $event)"
        />
        <select v-else :disabled="disabled" :value="String(node.value ?? '')" @change="onValueChange(group.id, node.id, $event)">
          <option value="">全部</option>
          <option value="1">是</option>
          <option value="0">否</option>
        </select>

        <button type="button" :disabled="disabled" @click="dropCondition(group.id, node.id)">删除</button>
      </div>

      <div class="group-actions">
        <button type="button" :disabled="disabled" @click="appendCondition(group.id, columns[0])">新增条件</button>
        <button type="button" :disabled="disabled" @click="dropGroup(group.id)">删除分组</button>
      </div>
    </div>

    <div class="actions">
      <button type="button" :disabled="disabled" @click="appendGroup">新增分组</button>
      <button type="button" :disabled="disabled" @click="onConfirm">搜索</button>
      <button type="button" :disabled="disabled" @click="onReset">重置</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { ColumnType, type FilterColumnMeta, type FilterNode } from "../core";
import { useViewSearchController } from "../vue3-adapter";

interface Props {
  columns: FilterColumnMeta[];
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
});

const emit = defineEmits<{
  (e: "change", payload: unknown): void;
  (e: "confirm", payload: unknown, searchType: "搜索" | "重置"): void;
  (e: "reset", payload: unknown): void;
}>();

const { draft, appendGroup, dropGroup, appendCondition, dropCondition, patchCondition, getNodeOperators, submit, reset } =
  useViewSearchController({
    columns: props.columns
  });

const columnMap = computed(() => {
  return Object.fromEntries(props.columns.map((item) => [item.dataIndex, item]));
});

/** 字段变更 */
function onFieldChange(groupId: string, nodeId: string, event: Event) {
  const value = (event.target as HTMLSelectElement).value;
  const selected = columnMap.value[value];
  if (!selected) return;
  patchCondition(groupId, nodeId, {
    fieldName: selected.dataIndex,
    columnTitle: selected.columnTitle,
    columnType: selected.columnType,
    paramType: selected.paramType,
    value: ""
  });
  emit("change", draft.value);
}

/** 操作符变更 */
function onOperatorChange(groupId: string, nodeId: string, event: Event) {
  const value = Number((event.target as HTMLSelectElement).value);
  patchCondition(groupId, nodeId, { operator: value });
  emit("change", draft.value);
}

/** 值变更 */
function onValueChange(groupId: string, nodeId: string, event: Event) {
  const value = (event.target as HTMLInputElement).value;
  patchCondition(groupId, nodeId, { value });
  emit("change", draft.value);
}

/** 触发搜索 */
function onConfirm() {
  const result = submit("搜索");
  emit("confirm", result.payload, result.searchType);
}

/** 重置 */
function onReset() {
  reset();
  const result = submit("重置");
  emit("reset", result.payload);
  emit("confirm", result.payload, result.searchType);
}

/** 是否 boolean 节点 */
function isBooleanNode(node: FilterNode): boolean {
  return Number(node.columnType) === ColumnType.Boolean;
}

watch(
  () => props.columns,
  () => {
    reset();
  }
);
</script>

<style scoped>
.ant-view-search {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.group {
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 8px;
}

.row {
  display: grid;
  grid-template-columns: 160px 120px 1fr 64px;
  gap: 8px;
  margin-bottom: 8px;
}

.group-actions {
  display: flex;
  gap: 8px;
}

.actions {
  display: flex;
  gap: 8px;
}
</style>
