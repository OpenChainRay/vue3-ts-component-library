<template>
  <div class="shell">
    <aside class="sidebar">
      <div class="user">
        <span>{{ loginUser }}</span>
        <button type="button" @click="logout">退出</button>
      </div>
      <div class="menu">
        <div v-for="item in flatMenus" :key="item.key" class="menu-item" @click="openMenu(item)">
          {{ item.name }}
        </div>
      </div>
    </aside>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { clearAuthToken, getMenusTree, type MenuNode } from "./app-api";

interface FlatMenu {
  key: string;
  name: string;
  fullPath: string;
  tableCode?: string;
}

const router = useRouter();
const loginUser = computed(() => localStorage.getItem("demo_login_user") || "-");
const flatMenus = ref<FlatMenu[]>([]);

onMounted(async () => {
  const menus = await getMenusTree();
  flatMenus.value = flattenMenus(menus);
  if (!flatMenus.value.length) {
    flatMenus.value = [
      {
        key: "table-column-demo",
        name: "表格列(示例)",
        fullPath: "/mapp/middlegroundManage/tableColumn/list",
        tableCode: "7f88d743-b411-4590-b6ca-42b68afa82bc"
      }
    ];
  }
  openMenu(flatMenus.value[0]);
});

/** 扁平化菜单 */
function flattenMenus(nodes: MenuNode[], parentName = ""): FlatMenu[] {
  const result: FlatMenu[] = [];
  nodes.forEach((node) => {
    const title = parentName ? `${parentName} / ${node.name}` : node.name;
    if (node.fullPath && (!node.children || node.children.length === 0)) {
      result.push({
        key: String(node.id || node.fullPath),
        name: title,
        fullPath: node.fullPath,
        tableCode: node.tableCode
      });
    }
    if (node.children?.length) {
      result.push(...flattenMenus(node.children, title));
    }
  });
  return result;
}

/** 点击菜单加载页面 */
function openMenu(item?: FlatMenu) {
  if (!item) return;
  const path = item.fullPath || "";
  const isTableColumn = path.includes("tableColumn");
  if (isTableColumn) {
    router.push({
      name: "tableColumn",
      query: {
        tableCode: item.tableCode || "7f88d743-b411-4590-b6ca-42b68afa82bc",
        title: item.name,
        path: item.fullPath
      }
    });
    return;
  }
  router.push({
    name: "menuPlaceholder",
    query: {
      title: item.name,
      path: item.fullPath
    }
  });
}

/** 退出 */
function logout() {
  localStorage.removeItem("demo_login_user");
  clearAuthToken();
  router.replace("/login");
}
</script>

<style scoped>
.shell {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}
.sidebar {
  border-right: 1px solid #e5e7eb;
  background: #fff;
}
.user {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
}
.menu {
  padding: 8px;
}
.menu-item {
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
}
.menu-item:hover {
  background: #f3f4f6;
}
.content {
  background: #f8fafc;
}
</style>
