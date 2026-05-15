module.exports = {
  globals: {
    process: true
  },
  // 默认情况下，ESLint会在所有父级组件中寻找配置文件，一直到根目录。ESLint一旦发现配置文件中有 "root": true，它就会停止在父级目录中寻找。
  root: true,
  // 对Babel解析器的包装使其与 ESLint 兼容。
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 'latest', //ES的版本，默认为5
    // "parser": "@typescript-eslint/parser",
    // 代码是 ECMAScript 模块
    sourceType: 'module'
  },
  env: {
    // 预定义的全局变量，这里是浏览器环境
    "browser": true,
    "node": true,
    "commonjs": true,
    "es6": true,
    "mocha": true
  },
  // 指定的规范，去检查指定类型的文件。extends 多个模块，如果规则冲突，位置靠后的包将覆盖前面的。
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/vue3-essential',
    // 'plugin:vue/base',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // 可以使用 plugin 定义自己的规则 eslint-plugin-react, eslint-plugin-vue
  // 引入 plugin 可以理解为引入了额外的 rules，需要在 rules、extends 中定义后才会生效
  plugins: [
    // 此插件用来识别.html 和 .vue文件中的js代码
    // 'html',
    'vue',
    // standard风格的依赖包
    // "standard",
    //"promise"
    // "@typescript-eslint"
  ],
  // add your custom rules here
  //  0 = off, 1 = warn, 2 = error
  'rules': {
    // https://cn.eslint.org/docs/rules/no-sparse-arrays
    "no-sparse-arrays": 0,
    // 结尾分号设置与否 https://cn.eslint.org/docs/rules/semi
    "semi": [2, 'never'],
    // 限制圈复杂度 (complexity) https://cn.eslint.org/docs/rules/complexity
    "complexity": ["error", { "max": 20 }],
    "vue/no-template-key": 0,
    // https://eslint.bootcss.com/docs/rules/prefer-const
    "prefer-const": ["error", {
      "destructuring": "any",
      "ignoreReadBeforeAssign": false
    }],
    // https://eslint.org/docs/rules/no-unused-vars
    "no-unused-vars": ["error", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
    // 关闭项目eslint中对于”==“和”===“的校验
    "eqeqeq": 0,
    // 解除限制组件name只能是做个单词的限制
    'vue/multi-word-component-names': 0,
    // "vue/max-attributes-per-line": [2, {
    //   "singleline": 10,
    //   "multiline": {
    //     "max": 1,
    //     "allowFirstLine": false
    //   }
    // }],
    // "vue/singleline-html-element-content-newline": "off",
    // "vue/multiline-html-element-content-newline":"off",
    // "vue/name-property-casing": ["error", "PascalCase"],
    // "vue/no-v-html": "off",
    "vue/require-component-is": 0,

    "vue/no-v-for-template-key": 0,
    "vue/no-v-for-template-key-on-child": 0,
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
