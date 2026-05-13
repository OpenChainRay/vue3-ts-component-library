<template>
  <div class="ant-default-view-range">
    <span class="trigger" @click="visible = true">
      <slot>默认数据范围</slot>
    </span>
    <div v-if="visible" class="panel">
      <RangeConditionEditor v-model="draft" :columns="filterColumns" />
      <div class="actions">
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
  viewConfig?: { viewId?: string | number; viewType?: number };
  tableCode: string;
  isCustomRequest?: boolean;
  columns: ViewColumn[];
  service?: ViewServicePort;
  runtime?: RuntimePort;
}

const props = withDefaults(defineProps<Props>(), {
  viewConfig: () => ({}),
  isCustomRequest: false
});

const emit = defineEmits<{
  (e: "customRviewRange", payload: unknown): void;
  (e: "initViewData"): void;
  (e: "save", payload: unknown): void;
}>();

const visible = ref(false);
const saving = ref(false);

const { filterColumns, draft, submit } = useViewRangeController({
  tableCode: props.tableCode,
  mode: "default",
  viewId: props.viewConfig.viewId,
  viewType: props.viewConfig.viewType,
  columns: props.columns
});

/** 确认保存 */
async function onConfirm() {
  const payload = submit();
  try {
    saving.value = true;
    if (props.service?.saveDefaultViewRange) {
      const result = await props.service.saveDefaultViewRange(payload);
      if (result?.msg) {
        props.runtime?.notifySuccess?.(result.msg);
      }
    } else {
      emit("save", payload);
    }
    if (props.isCustomRequest) {
      emit("customRviewRange", payload);
    } else {
      emit("initViewData");
    }
    visible.value = false;
  } catch (error) {
    props.runtime?.notifyError?.(error instanceof Error ? error.message : "保存默认范围失败");
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
