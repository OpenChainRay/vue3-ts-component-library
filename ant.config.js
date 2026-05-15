'use strict'
const path = require('path')
const { resolve } = require('path')

const { modifyVars } = require('./examples/utils/themeUtils.js')

module.exports = {
  // 自定义webpack入口
  entries: {
    // libs - 库和工具
    // libs:['vue']
    // shared - 定制 UI 库和工具
    // shared:['vue', 'ant-design-vue']
  },
  // 自动将该目录下的的子目录添加为alias便捷路径
  // autoAliasRoot: resolve('examples'),
  // webpack配置
  configureWebpack: {
    // externals: {
    //   'vue': 'Vue',
    //   'vue-router': 'VueRouter',
    //   'vuex': 'Vuex',
    //   'axios': 'axios'
    // },
    resolve: {
      // 只采用 main 字段作为入口文件描述字段，以减少搜索步骤
      mainFields: ['main'],
      symlinks: false,
      // 手动设置alias便捷路径
      alias: {
        '@': resolve('examples'),
        // '@root': resolve(__dirname)
        'at-materia': resolve('src')
        // 'at-antd-material': path.join(__dirname, '..', 'components')
      },
      // 自动补全文件后缀名,意味着require模块的时候可以省略不写后缀名。列表值尽量少以提升构建速度,频率高的文件类型的后缀写在前面
      extensions: ['.js', '.vue', 'less', '.json']
    }
  },

  pluginOptions: {
    less: {
      loader: 'style-resources-loader',
      options: {
        patterns: [resolve(__dirname, './examples/theme/theme.less')],
        injector: 'append',
      }
    }
  },

  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: modifyVars(),
          javascriptEnabled: true
        }
      }
    }
  }
}
