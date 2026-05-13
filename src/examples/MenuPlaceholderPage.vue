<template>
  <div class="placeholder">
    <h3>{{ title || "页面占位" }}</h3>
    <p>当前菜单路径：{{ path || "-" }}</p>
    <p>该菜单尚未映射到本地 Vue3 页面。</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const title = computed(() => String(route.query.title || ""));
const path = computed(() => String(route.query.path || ""));
</script>

<style scoped>
.placeholder {
  padding: 16px;
}
</style>
