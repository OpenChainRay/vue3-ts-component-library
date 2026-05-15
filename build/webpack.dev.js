const path = require('path')
const { resolve } = require('path')
const { merge } = require("webpack-merge")
const webpackCommonConfig = require("./webpack.common.js")
const ESLintPlugin = require('eslint-webpack-plugin')
const { DefinePlugin } = require("webpack")
const { readEnv, createProxy, assetsPath } = require('./utils')
const antConfig = require('../ant.config.js')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require("html-webpack-plugin")
//读取环境变量
const config = readEnv(resolve('.env.development'))

const { SERVE_PORT, PROXY_URLS } = process.env

module.exports = merge(webpackCommonConfig, {
  mode: "development",
  devtool: "eval-source-map",
  plugins: [
    new DefinePlugin({
      // BASE_URL: JSON.stringify("./"),
      'process.env': config
    }),
    new ESLintPlugin({
      fix: true, // 自动帮助修复
      extensions: ['vue', 'js', 'json', 'jsx', 'ts'],
      files: ['src', 'components'],
      threads: true
      // exclude: ['node_modules', 'package.json']
    }),
    new MiniCssExtractPlugin({
      filename: assetsPath('css/[name].[contenthash:16].css'),
      chunkFilename: assetsPath('css/[name].[contenthash:16].css')
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolve('public/index.ejs'),
      inject: true,
      favicon: resolve('public/favicon.ico')
      // title: GLOBE_APP_TITLE
    })
  ],
  devServer: {
    proxy: createProxy(PROXY_URLS),
    // proxy: {
    //   '/at-ums-api': {
    //     target: 'http://192.168.3.2:9006',
    //     pathRewrite: {'^/at-ums-api' : '/at-ums-api'},
    //     changeOrigin: true,     // target是域名的话，需要这个参数，
    //     secure: false,          // 设置支持https协议的代理
    //   },
    //   '/at-oms-api': {
    //     target: 'http://192.168.3.2:9006',
    //     pathRewrite: {'^/at-oms-api' : '/at-oms-api'},
    //     changeOrigin: true,     // target是域名的话，需要这个参数，
    //     secure: false,          // 设置支持https协议的代理
    //   }
    // },
    port: SERVE_PORT || 'auto',
    host: '0.0.0.0',
    hot: true,
    open: false,
    compress: true, // 为每个静态文件开启 gzip compression
    static: {
      directory: path.join(__dirname, '..', 'dist')
    },
    // static: false,
    client: {
      logging: 'warn',
      progress: true,
      overlay: {
        errors: true,
        warnings: false
      }
    },
    historyApiFallback: {
      rewrites: [{ from: /.*/, to: '/public/index.ejs' }]
    }
  }
})
