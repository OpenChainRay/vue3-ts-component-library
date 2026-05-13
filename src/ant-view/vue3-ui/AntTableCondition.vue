<template>
  <div class="ant-table-condition">
    <span class="trigger" @click="visible = true">
      <slot>默认数据范围</slot>
    </span>
    <div v-if="visible" class="panel">
      <RangeConditionEditor v-model="draft" :columns="filterColumns" :disabled="disabled" />
      <div v-if="!disabled" class="actions">
        <button type="button" @click="visible = false">取消</button>
        <button type="button" :disabled="saving" @click="onConfirm">{{ saving ? "保存中..." : "确认" }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import RangeConditionEditor from "./RangeConditionEditor.vue";
import { useViewRangeController } from "../vue3-adapter";
import type { RuntimePort, ViewColumn, ViewServicePort } from "../core";

interface Props {
  tableCode: string;
  id: string | number;
  filters?: unknown;
  columns: ViewColumn[];
  isCustomRequest?: boolean;
  disabled?: boolean;
  service?: ViewServicePort;
  runtime?: RuntimePort;
}

const props = withDefaults(defineProps<Props>(), {
  isCustomRequest: false,
  disabled: false,
  filters: undefined
});

const emit = defineEmits<{
  (e: "customTableCondition", payload: unknown): void;
  (e: "initViewData"): void;
  (e: "save", payload: unknown): void;
}>();

const visible = ref(false);
const saving = ref(false);

const { filterColumns, draft, submit } = useViewRangeController({
  tableCode: props.tableCode,
  mode: "table-condition",
  id: props.id,
  columns: props.columns
});

/** 确认保存 */
async function onConfirm() {
  const payload = submit();
  try {
    saving.value = true;
    if (props.service?.saveTableCondition) {
      const result = await props.service.saveTableCondition(payload);
      if (result?.msg) {
        props.runtime?.notifySuccess?.(result.msg);
      }
    } else {
      emit("save", payload);
    }
    if (props.isCustomRequest) {
      emit("customTableCondition", payload);
    } else {
      emit("initViewData");
    }
    visible.value = false;
  } catch (error) {
    props.runtime?.notifyError?.(error instanceof Error ? error.message : "保存默认条件失败");
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.trigger {
  cursor: pointer;
  color: #3874ff;
}

.panel {
  margin-top: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #fff;
  padding: 12px;
}

.actions {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  gap: 8px;
}
</style>
