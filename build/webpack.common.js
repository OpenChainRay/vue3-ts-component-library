const path = require('path')
const { resolve } = require('path')

const { merge } = require("webpack-merge")

// 让命令行的信息有颜色
const chalk = require('chalk')
const { VueLoaderPlugin } = require('vue-loader')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { DefinePlugin } = require("webpack")

const { readEnv, styleLoaders, assetsPath, mapAlias } = require('./utils.js')
const antConfig = require(resolve('ant.config.js'))

const { GLOBE_APP_TITLE, PUBLIC_PATH } = process.env

// 是否是生产环境
const devModeProduction = process.env.NODE_ENV === 'production'
const CustomizedAlias = antConfig.alias || []
const ProjectAlias = mapAlias(antConfig.autoAliasRoot || resolve('src'))
const AllAlias = Object.assign({}, ProjectAlias, CustomizedAlias)
const CustomizedEntries = antConfig.entries || []
const devAllEntries = Object.assign({}, { app: resolve('examples/main.js') }, CustomizedEntries)
const prodAllEntries = Object.assign({}, { 'at-materia': resolve('src/index.js') }, CustomizedEntries)

const webpackCommonConfig = {
  stats: {
    errorDetails: true,
    children: true
  },
  // stats: 'errors-warnings',
  entry: devModeProduction ? prodAllEntries : devAllEntries,
  output: {
    clean: true, // 在生成文件之前清空 output 目录
    path: resolve('dist'), // 打包出口
    // filename: 'js/[name].[contenthash:16].js', // 打包完的静态资源文件名
    // chunkFilename: 'js/[name].[contenthash:16].chunk.js',
    // publicPath: PUBLIC_PATH
    filename: '[name].min.js', // 打包完的静态资源文件名
    libraryTarget: 'umd', // 这个选项会尝试把库暴露给前使用的模块定义系统，这使其和CommonJS、AMD兼容或者暴露为全局变量
    libraryExport: 'default',
    library: 'ATMATERIA',
    umdNamedDefine: true
  },
  // 缓存生成的 webpack 模块和 chunk，来改善构建速度。
  cache: {
    type: 'filesystem'
  },

  // resolve: {
  // 只采用 main 字段作为入口文件描述字段，以减少搜索步骤
  // mainFields: ['main'],
  // 自动补全文件后缀名,意味着require模块的时候可以省略不写后缀名。列表值尽量少以提升构建速度,频率高的文件类型的后缀写在前面
  // extensions: antConfig.extensions,
  // alias: AllAlias
  // },
  module: {
    rules: [
      // css-loader
      ...styleLoaders({
        sourceMap: !devModeProduction,
        usePostCSS: devModeProduction,
        // 开发模式不分离，mini-css-extract-plugin不支持HMR，或者配置hotReload: true
        extract: devModeProduction // 是否分离CSS
      }),

      {
        test: /\.m?js/,
        type: "javascript/auto",
      }, 
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.json$/i,
        type: 'asset/resource',
      },

      {
        test: /\.vue$/,
        use: [
          'thread-loader',
          {
            loader: 'vue-loader'
          }
        ]
      },
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        use: [
          'thread-loader', // 其后loader开启独立worker池
          {
            loader: 'babel-loader'
          }
        ],
        // include: path.resolve("src")
        // include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]

      },

      {
        test: /\.m?js/,
        type: "javascript/auto",
      }, 
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.json$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(png|gif|jpe?g|svg)$/,
        // https://webpack.docschina.org/guides/asset-modules/
        type: 'asset/resource', // webpack5使用内置静态资源模块，且不指定具体，根据以下规则使用
        generator: {
          // filename: 'img/[name].[hash:6][ext]' // ext本身会附带点，放入img目录下
          filename: assetsPath('image/[name].[hash:7][ext]') // ext本身会附带点，放入img目录下
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 超过10kb的进行复制，不超过则直接使用base64
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset/resource',
        generator: {
          filename: assetsPath('fonts/[name].[hash:7][ext]') // 放入font目录下
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 超过10kb的进行复制，不超过则直接使用base64
          }
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: 'asset/resource',
        generator: {
          filename: assetsPath('fonts/[name].[hash:7][ext]') // 放入font目录下
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 超过10kb的进行复制，不超过则直接使用base64
          }
        }
      }
    ]
  },
  plugins: [

    // 添加 VueLoaderPlugin 插件
    new VueLoaderPlugin(),

    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve("public"),
    //       to: path.resolve("dist"),
    //       globOptions: {
    //         dot: true,
    //         gitignore: true,
    //         ignore: ["**/index.html"]
    //       }
    //     }
    //   ]
    // })

  ]
}

module.exports = merge(webpackCommonConfig, antConfig.configureWebpack)
