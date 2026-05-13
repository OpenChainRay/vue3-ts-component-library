<template>
  <div class="login-page">
    <form class="card" @submit.prevent="submit">
      <h2>系统登录</h2>
      <input v-model.trim="username" placeholder="用户名" />
      <input v-model.trim="password" type="password" placeholder="密码" />
      <button type="submit" :disabled="loading">{{ loading ? "登录中..." : "登录" }}</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { loginByAms, persistLoginToken } from "./app-api";

const router = useRouter();
const username = ref("admin");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

/** 登录提交 */
async function submit() {
  if (!username.value || !password.value) {
    errorMessage.value = "请输入用户名和密码";
    return;
  }
  loading.value = true;
  errorMessage.value = "";
  try {
    const result = await loginByAms(username.value, password.value);
    const loginError = resolveLoginError(result);
    if (loginError) {
      errorMessage.value = loginError;
      return;
    }
    const token = persistLoginToken(result);
    if (!token) {
      errorMessage.value = "登录成功但未返回 token";
      return;
    }
    localStorage.setItem("demo_login_user", username.value);
    await router.replace("/app");
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "登录异常";
  } finally {
    loading.value = false;
  }
}

/** 解析登录错误信息 */
function resolveLoginError(result: {
  code?: number;
  msg?: string;
  success?: boolean;
  data?: { code?: number; msg?: string; errmsg?: string; success?: boolean } | null;
}): string {
  const data = result.data || {};
  const businessCode = typeof data.code === "number" ? data.code : undefined;
  const businessSuccess = typeof data.success === "boolean" ? data.success : undefined;
  const topSuccess = typeof result.success === "boolean" ? result.success : undefined;

  if (businessCode && businessCode !== 200) {
    return data.msg || data.errmsg || "用户名或密码错误";
  }
  if (businessSuccess === false || topSuccess === false) {
    return data.msg || data.errmsg || result.msg || "用户名或密码错误";
  }
  if ((result.code || 0) !== 200) {
    return result.msg || "登录失败";
  }
  return "";
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}
.card {
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #fff;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}
.error {
  color: #ef4444;
  margin: 0;
}
</style>
