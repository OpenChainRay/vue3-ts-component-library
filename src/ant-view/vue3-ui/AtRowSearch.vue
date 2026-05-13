<template>
  <div class="at-row-search">
    <input
      v-if="renderType === 'input'"
      :value="String(searchValue ?? '')"
      :placeholder="tableColumnObj.columnTitle"
      @input="onInput"
      @keyup.enter="onSearch"
    />

    <select v-else-if="renderType === 'select'" :value="String(searchValue ?? '')" @change="onInput">
      <option value="">全部</option>
      <option v-for="item in selectList" :key="item.value" :value="String(item.value)">
        {{ item.label }}
      </option>
    </select>

    <select v-else-if="renderType === 'boolean'" :value="String(searchValue ?? '')" @change="onInput">
      <option value="">全部</option>
      <option value="1">是</option>
      <option value="0">否</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ColumnType, type ColumnMapByTableCode, type FilterColumnMeta, type ViewColumn } from "../core";
import { useRowSearchController } from "../vue3-adapter";

type RowColumn = ViewColumn & FilterColumnMeta;

interface Props {
  tableColumnObj: RowColumn;
  modelValue?: unknown;
  tableCode?: string;
  columnMap?: ColumnMapByTableCode;
}

const props = withDefaults(defineProps<Props>(), {
  tableCode: "",
  modelValue: undefined,
  columnMap: () => ({})
});

const emit = defineEmits<{
  (e: "update:modelValue", value: unknown): void;
  (e: "search", payload: unknown): void;
}>();

const { searchValue, selectList, setSearchValue, buildPayload } = useRowSearchController({
  tableColumnObj: props.tableColumnObj,
  modelValue: props.modelValue,
  columnMap: props.columnMap,
  currentTableCode: props.tableCode
});

const renderType = computed(() => {
  const type = Number(props.tableColumnObj.columnType);
  if (type === ColumnType.Input || type === ColumnType.Number || type === ColumnType.Amount) return "input";
  if (type === ColumnType.Boolean) return "boolean";
  return "select";
});

/** 输入更新 */
function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  setSearchValue(value);
  emit("update:modelValue", value);
}

/** 触发搜索 */
function onSearch() {
  emit("search", buildPayload(searchValue.value));
}
</script>

<style scoped>
.at-row-search {
  width: 100%;
}

.at-row-search input,
.at-row-search select {
  width: 100%;
  border: none;
  background: transparent;
}
</style>
