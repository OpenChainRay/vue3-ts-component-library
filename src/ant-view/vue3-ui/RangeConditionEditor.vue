<template>
  <div class="range-editor">
    <div v-for="group in draft.groups" :key="group.id" class="group">
      <div v-for="node in group.children" :key="node.id" class="row">
        <select :value="node.fieldName" :disabled="disabled" @change="onFieldChange(group.id, node.id, $event)">
          <option v-for="column in columns" :key="column.dataIndex" :value="column.dataIndex">
            {{ column.columnTitle }}
          </option>
        </select>
        <select :value="node.operator" :disabled="disabled" @change="onOperatorChange(group.id, node.id, $event)">
          <option v-for="operator in getOperatorsByColumnType(Number(node.columnType))" :key="operator.value" :value="operator.value">
            {{ operator.label }}
          </option>
        </select>
        <input
          :disabled="disabled || !isValueRequired(node.operator)"
          :value="String(node.value ?? '')"
          :placeholder="`请输入${node.columnTitle}`"
          @input="onValueChange(group.id, node.id, $event)"
        />
        <button type="button" :disabled="disabled" @click="removeNode(group.id, node.id)">删除</button>
      </div>
      <button type="button" :disabled="disabled" @click="appendNode(group.id)">新增条件</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { addCondition, getOperatorsByColumnType, isValueRequired, removeCondition, updateCondition, type FilterColumnMeta, type FilterDraftState } from "../core";

interface Props {
  modelValue: FilterDraftState;
  columns: FilterColumnMeta[];
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
});

const emit = defineEmits<{
  (e: "update:modelValue", value: FilterDraftState): void;
}>();

const draft = computed(() => props.modelValue);
const columnMap = computed(() => Object.fromEntries(props.columns.map((item) => [item.dataIndex, item])));

/** 字段变更 */
function onFieldChange(groupId: string, nodeId: string, event: Event) {
  const fieldName = (event.target as HTMLSelectElement).value;
  const column = columnMap.value[fieldName];
  if (!column) {
    return;
  }
  const next = updateCondition(draft.value, groupId, nodeId, {
    fieldName: column.dataIndex,
    columnTitle: column.columnTitle,
    columnType: column.columnType,
    paramType: column.paramType,
    value: ""
  });
  emit("update:modelValue", next);
}

/** 操作符变更 */
function onOperatorChange(groupId: string, nodeId: string, event: Event) {
  const operator = Number((event.target as HTMLSelectElement).value);
  const next = updateCondition(draft.value, groupId, nodeId, { operator });
  emit("update:modelValue", next);
}

/** 值变更 */
function onValueChange(groupId: string, nodeId: string, event: Event) {
  const value = (event.target as HTMLInputElement).value;
  const next = updateCondition(draft.value, groupId, nodeId, { value });
  emit("update:modelValue", next);
}

/** 新增条件 */
function appendNode(groupId: string) {
  const first = props.columns[0];
  if (!first) return;
  const next = addCondition(draft.value, groupId, first);
  emit("update:modelValue", next);
}

/** 删除条件 */
function removeNode(groupId: string, nodeId: string) {
  const next = removeCondition(draft.value, groupId, nodeId);
  emit("update:modelValue", next);
}
</script>

<style scoped>
.range-editor {
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
  grid-template-columns: 180px 130px 1fr 64px;
  gap: 8px;
  margin-bottom: 8px;
}
</style>
