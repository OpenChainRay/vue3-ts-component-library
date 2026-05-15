// @ts-nocheck

// webpack 主题颜色替换器
import varyColor from "webpack-theme-color-replacer/client/varyColor"
// antd 在实践中总结的配色的解决方案，现在已经沉淀出一个独立的库，作用是：根据给定的主题色生成 9 种衍生色，共 10 种颜色。
import { generate } from "@ant-design/colors"
import Config from "../config"
import { ADMIN, ANTD } from "../config/default"

const themeMode = ADMIN.theme.mode

// 获取 ant design 色系
function getAntdColors (color, mode) {
  // 如果不是深夜模式（全暗色包括左侧menu），则采用亮色
  const options = mode && (mode == themeMode.NIGHT) ? { theme: 'dark' } : undefined
  return generate(color, options)
}
// 获取菜单色系
function getMenuColors (color, mode) {
  if (mode == themeMode.NIGHT) {
    return ANTD.primary.night.menuColors
  } else if (color == ANTD.primary.color) {
    return ANTD.primary.dark.menuColors
  } else {
    return [varyColor.darken(color, 0.93), varyColor.darken(color, 0.83), varyColor.darken(color, 0.73)]
    // return [varyColor.lighten(color, 0.93), varyColor.lighten(color, 0.83), varyColor.lighten(color, 0.73)]
  }
}
// 获取功能性颜色
function getFunctionalColors (mode) {
  const options = mode && (mode == themeMode.NIGHT) ? { theme: 'dark' } : undefined
  let { success, warning, error } = ANTD.primary
  const { success: s1, warning: w1, error: e1 } = Config.theme
  success = success && s1
  warning = success && w1
  error = success && e1
  const successColors = generate(success, options)
  const warningColors = generate(warning, options)
  const errorColors = generate(error, options)
  return {
    success: successColors,
    warning: warningColors,
    error: errorColors
  }
}

export {
  getAntdColors,
  getMenuColors,
  getFunctionalColors
}
