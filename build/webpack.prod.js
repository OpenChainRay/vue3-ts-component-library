const { resolve } = require('path')
const glob = require('glob-all')
const webpackCommonConfig = require("./webpack.common.js")
const { merge } = require('webpack-merge')
const { readEnv, assetsPath } = require('./utils.js')
const { DefinePlugin, IgnorePlugin } = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require("compression-webpack-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const zlib = require("zlib")
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin")
const PurgeCssPlugin = require('purgecss-webpack-plugin')


const config = readEnv(resolve('.env.production'))
module.exports = merge(webpackCommonConfig, {
  mode: 'production',
  devtool: false,
  target: ['web', 'es5'],
  // https://webpack.docschina.org/configuration/optimization/
  optimization: {
    moduleIds: "deterministic",
    removeEmptyChunks: true,
    // 压缩输出结果，usedExports开启后会移除未被使用的成员
    minimize: false,
    minimizer: [
    //   // 压缩 css
    //   new CssMinimizerPlugin({
    //     test: /\.foo\.css$/i,
    //     parallel: 4, // 启用/禁用多进程并发执行
    //     minimizerOptions: {
    //       preset: require.resolve("cssnano-preset-simple")
    //     }
    //   }),
    //   // 使用terser来压缩JavaScript https://github.com/terser/terser
      new TerserPlugin({
        test: /\.js$/,
        parallel: 4, // 多线程
        terserOptions: {
          toplevel: true, // 是否启用顶级变量和函数名的 mangle，丢弃未使用的变量和函数
          mangle: true, // 混淆，默认也是开的，mangle也是可以配置很多选项的，具体看后面的链接
          compress: {
            drop_console: true,//传true就是干掉所有的console.*这些函数的调用.
            drop_debugger: true, //干掉那些debugger;
            pure_funcs: ['console.log', 'debugger'] // 如果你要干掉特定的函数比如console.info ，又想删掉后保留其参数中的副作用，那用pure_funcs来处理
          }
        },
        // 评论是否应被提取到一个单独的文件。
        extractComments: false
      }),
    //   // 压缩图片
    //   new ImageMinimizerPlugin({
    //     minimizer: {
    //       implementation: ImageMinimizerPlugin.squooshMinify,
    //       options: {
    //         encodeOptions: {
    //           mozjpeg: {
    //             // That setting might be close to lossless, but it’s not guaranteed
    //             // https://github.com/GoogleChromeLabs/squoosh/issues/85
    //             quality: 100,
    //           },
    //           webp: {
    //             lossless: 1,
    //           },
    //           avif: {
    //             // https://github.com/GoogleChromeLabs/squoosh/blob/dev/codecs/avif/enc/README.md
    //             cqLevel: 0,
    //           }
    //         }
    //       }
    //     }
    //   }),
    ],
    // 模块只导出被使用的成员
    usedExports: false,
    // 尽可能合并每一个模块到一个函数中（Scop Hosting）
    concatenateModules: false,

    splitChunks: {
      // chunks: 表示显示块的范围，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为all;
      chunks: 'async',
      minSize: 0, // 表示在压缩前的最小模块大小，默认是30000 (30kb)；
      minChunks: 1, // 表示被引用次数，默认为1；
      maxAsyncRequests: 9, //所有异步请求不得超过6个
      maxInitialRequests: 9, //初始话并行请求不得超过4个

    },

  },
  externals:[
    'ant-design-vue',
    '@ant-design/colors',
    '@opentiny/vue'
  ],
  plugins: [
    // Ignore all locale files of moment.js
    new IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    }),

    new DefinePlugin({
      // BASE_URL: JSON.stringify("./"),
      'process.env': config
    })

  ]
})
