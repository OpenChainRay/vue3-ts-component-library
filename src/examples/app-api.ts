export interface LoginResult {
  code: number;
  msg: string;
  success?: boolean;
  data?: LoginTokenPayload;
}

export interface MenuNode {
  id?: string | number;
  name: string;
  fullPath?: string;
  tableCode?: string;
  children?: MenuNode[];
}

export interface LoginTokenPayload {
  access_token?: string;
  token?: string;
  tokenHead?: string;
  code?: number;
  msg?: string;
  errmsg?: string;
  success?: boolean;
  data?: {
    access_token?: string;
    token?: string;
    tokenHead?: string;
    code?: number;
    msg?: string;
    errmsg?: string;
    success?: boolean;
  };
}

const TOKEN_KEY = "demo_auth_token";

/** 登录接口 */
export async function loginByAms(username: string, password: string): Promise<LoginResult> {
  const response = await fetch("/api/at-ams-api/security/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
      loginType: 1,
      clientId: "admin-app"
    })
  });
  return (await response.json()) as LoginResult;
}

/** 保存登录 token */
export function persistLoginToken(result: LoginResult): string {
  const payload = result.data;
  const token =
    payload?.token ||
    payload?.access_token ||
    payload?.data?.token ||
    payload?.data?.access_token ||
    "";
  const tokenHead = payload?.tokenHead || payload?.data?.tokenHead || "Bearer";
  const authToken = normalizeAuthToken(tokenHead, token);
  if (!authToken) {
    return "";
  }
  localStorage.setItem(TOKEN_KEY, authToken);
  return authToken;
}

/** 获取 token */
export function getAuthToken(): string {
  return localStorage.getItem(TOKEN_KEY) || "";
}

/** 清除 token */
export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/** 通用鉴权 fetch */
export async function authorizedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = getAuthToken();
  const headers = new Headers(init.headers || {});
  if (token) {
    headers.set("Authorization", token);
  }
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(input, {
    credentials: "include",
    ...init,
    headers
  });
}

/** 菜单树接口 */
export async function getMenusTree(): Promise<MenuNode[]> {
  const response = await authorizedFetch("/api/at-ams-api/userMenu/tree/v2", {
    method: "POST",
    body: JSON.stringify({})
  });
  const result = (await response.json()) as { code: number; data?: MenuNode[]; msg?: string };
  if (result.code !== 200 || !Array.isArray(result.data)) {
    return [];
  }
  return result.data;
}

/** 规范化 Authorization */
function normalizeAuthToken(tokenHead: string, token: string): string {
  const pureToken = String(token || "").trim();
  if (!pureToken) {
    return "";
  }
  if (/^Bearer\s+/i.test(pureToken)) {
    return pureToken;
  }
  const head = String(tokenHead || "Bearer").trim() || "Bearer";
  return `${head} ${pureToken}`;
}
