import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "./examples/LoginPage.vue";
import AppShell from "./examples/AppShell.vue";
import TableColumnLikePage from "./examples/TableColumnLikePage.vue";
import MenuPlaceholderPage from "./examples/MenuPlaceholderPage.vue";
import { getAuthToken } from "./examples/app-api";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", component: LoginPage },
    {
      path: "/app",
      component: AppShell,
      children: [
        { path: "", redirect: { name: "tableColumn" } },
        { path: "table-column", name: "tableColumn", component: TableColumnLikePage },
        { path: "menu-page", name: "menuPlaceholder", component: MenuPlaceholderPage }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  const isLogin = Boolean(localStorage.getItem("demo_login_user")) && Boolean(getAuthToken());
  if (to.path.startsWith("/app") && !isLogin) {
    next("/login");
    return;
  }
  if (to.path === "/login" && isLogin) {
    next("/app");
    return;
  }
  next();
});

export default router;
