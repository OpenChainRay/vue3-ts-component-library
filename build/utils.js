'use strict'
const fs = require('fs')
const path = require('path')
const { resolve } = require('path')
// const config = require('../config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const packageConfig = require('../package.json')

const antConfig = require(resolve('ant.config.js'))

const readEnv = () => {
  const envConfigPath = {
    development: resolve('.env.development') || '', // 开发环境配置
    test: resolve('.env.test') || '', // 测试环境配置
    production: resolve('.env.production') // 正式环境配置
  }
  // 加载通用配置.env
  const commonEnv = require('dotenv').config({
    path: resolve('.env')
  })
  const { parsed } = require('dotenv').config({
    path: envConfigPath[process.env.NODE_ENV]
  })
  Object.assign(parsed,commonEnv.parsed)
  Object.keys(parsed).forEach(key => parsed[key] = JSON.stringify(parsed[key]))
  return parsed;
}

// 指定url-loader输出静态资源到dist中的目录
const assetsPath = (_path) => {
  const assetsSubDirectory = 'static'
  return path.posix.join(assetsSubDirectory, _path)
}

// css相关的各种loader的配置解析
const cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  /**
   * 生成需要使用的css相关的loader
   * @param { string } loader 需要使用的loader名称
   * @param { object } loader 相关配置
   * @return { object } 完整的loader配置
   */
  function generateLoaders (loader, loaderOptions) {
    // 通过usePostCSS属性判断是否使用 postcss-loader
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, antConfig.css.loaderOptions[loader]|| {}, {
          sourceMap: options.sourceMap
        })
      })
    }
    // 添加style-resources-loader
    if(antConfig.pluginOptions[loader]) loaders.push(antConfig.pluginOptions[loader])

    // 通过 extract 属性来判断是否需要单独提取分离css为css文件
    // 一般开发环境设置 extract为false，生产环境设置为true，
    // 因为mini-css-extract-plugin不支持HMR，或者添加css-hot-loader来支持
    // if (options.extract) {
    //   loaders.unshift(MiniCssExtractPlugin.loader)
    // } else {
    //   // 如果需要支持服务端渲染的 vue 项目，就需要用 vue-style-loader
    //   // loaders.unshift('vue-style-loader')
    //   loaders.unshift('style-loader')
    // }
    loaders.unshift('style-loader')
    // loaders.unshift('vue-style-loader')

    // if (options.hotReload) {
    //   return ['css-hot-loader'].concat(loaders)
    // } else {
    //   return loaders
    // }
    return loaders
  }
  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  const configCssLoader = {
    css: generateLoaders(),
    postcss: generateLoaders(),
    // 为antd配置定制主题
    less: generateLoaders('less'),
    sass: generateLoaders('sass', {
      indentedSyntax: true
    }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
  return configCssLoader
}

// 将loader配置封装进rules数组
const styleLoaders = function (options) {
  const output = []
  const loaders = cssLoaders(options)
  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}

const createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

/**
 * 自动将srcPath的子目录添加为alias便捷路径，格式，例如：@store
 *
 * @param { string } 目录路径
 * @return {*}
 */
const mapAlias = function (srcPath) {
  // fs.readdirSync(srcPath) 异步返回指定目录子级所有的目录以及文件名
  return fs.readdirSync(srcPath).reduce((alias, dir) => {
    const fullDir = path.join(srcPath, dir)
    if (fs.statSync(fullDir).isDirectory()) alias['@' + dir] = fullDir
    return alias
  }, {})
}

const createProxy = (list) => {
  if(list){
    const urls = JSON.parse(list)
    const httpsRE = /^https:\/\//
    const ret = {}
    for (const [prefix, target] of urls) {
      const isHttps = httpsRE.test(target)
      // https://github.com/http-party/node-http-proxy#options
      ret[prefix] = {
        target: target,
        changeOrigin: true,
        // ws: true,
        pathRewrite: (path) => {
          return path.replace(new RegExp(`^${prefix}`), '')
        },
        // https is require secure=false
        ...(isHttps ? { secure: false } : {})
      }
    }
    return ret
  }else{
    return {}
  }
}


module.exports = {
  resolve,
  readEnv,
  assetsPath,
  styleLoaders,
  mapAlias,
  createProxy
}
