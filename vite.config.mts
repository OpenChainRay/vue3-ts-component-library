import path from "node:path"
import { transformAsync } from "@babel/core"
import vue from "@vitejs/plugin-vue"
import postcssFlexValue from "postcss-flex-value"
import { defineConfig, loadEnv } from "vite"
import type { ProxyOptions } from "vite"

/**
 * 兼容旧 JSX 写法，保持原组件行为。
 */
function vue2JsxCompatPlugin() {
  return {
    name: "vue2-jsx-compat",
    enforce: "pre" as const,
    async transform(code: string, id: string) {
      if (!/\.(js|jsx|tsx)$/.test(id)) return null
      if (!/(src|examples)/.test(id)) return null
      if (!code.includes("<")) return null

      const result = await transformAsync(code, {
        filename: id,
        babelrc: false,
        configFile: false,
        presets: [["@vue/babel-preset-jsx", { compositionAPI: false }]],
        sourceMaps: true
      })

      if (!result?.code) return null
      return {
        code: result.code,
        map: result.map ?? null
      }
    }
  }
}

/**
 * 解析 env 中的 PROXY_URLS 并转换为 Vite proxy。
 */
function parseProxyConfig(proxyUrlsRaw: string | undefined) {
  const proxy: Record<string, ProxyOptions> = {}
  if (!proxyUrlsRaw) {
    return proxy
  }
  try {
    const list = JSON.parse(proxyUrlsRaw) as Array<[string, string]>
    list.forEach(([prefix, target]) => {
      if (!prefix || !target) {
        return
      }
      const cleanPrefix = prefix.startsWith("/") ? prefix : `/${prefix}`
      const cleanTarget = target.endsWith("/") ? target.slice(0, -1) : target
      proxy[cleanPrefix] = {
        target: cleanTarget,
        changeOrigin: true,
        rewrite: (p) => p.replace(new RegExp(`^${cleanPrefix}`), "")
      }
      // 兼容 /api/at-xxx-api 调用路径
      if (!cleanPrefix.startsWith("/api/")) {
        const apiPrefix = `/api${cleanPrefix}`
        proxy[apiPrefix] = {
          target: cleanTarget,
          changeOrigin: true,
          rewrite: (p) => p.replace(new RegExp(`^${apiPrefix}`), "")
        }
      }
    })
  } catch (e) {
    // env 配置异常时回退为空，避免 dev 启动失败
  }
  return proxy
}

export default defineConfig(({ mode }) => {
  /**
   * 注入全局 less 变量，兼容旧项目样式写法。
   */
  const globalLessVarsPath = path.resolve(__dirname, "examples/theme/default/color.less").replace(/\\/g, "/")
  const env = loadEnv(mode, process.cwd(), "")
  const proxy = parseProxyConfig(env.PROXY_URLS)
  const envDefines = Object.keys(env).reduce<Record<string, string>>((acc, key) => {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
      return acc
    }
    acc[`process.env.${key}`] = JSON.stringify(env[key])
    return acc
  }, {})

  return {
    plugins: [
      vue(),
      vue2JsxCompatPlugin()
    ],
    resolve: {
      extensions: [".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json", ".vue"],
      alias: {
        "@": path.resolve(__dirname, "examples"),
        "at-materia": path.resolve(__dirname, "src"),
        "at-pro-table": path.resolve(__dirname, "examples/components/ProTable/index.ts")
      }
    },
    define: {
      ...envDefines,
      "process.env.NODE_ENV": JSON.stringify(mode)
    },
    css: {
      postcss: {
        plugins: [postcssFlexValue()]
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: `@import (reference) "${globalLessVarsPath}";`
        }
      }
    },
    build: {
      lib: {
        entry: path.resolve(__dirname, "src/index.ts"),
        name: "AtMateria",
        formats: ["umd", "es"],
        fileName: (format) => (format === "es" ? "at-materia.es.js" : "at-materia.min.js")
      },
      rollupOptions: {
        external: ["vue"],
        output: {
          globals: {
            vue: "Vue"
          },
          exports: "named"
        }
      }
    },
    server: {
      port: 5700,
      proxy
    }
  }
})
