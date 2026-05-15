module.exports = {
  extends: [
      '@commitlint/config-conventional'
  ],
  // https://commitlint.js.org/#/reference-rules
  rules: {
    // type 可选值 例如: [ 'feat', 'fix' ]
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test','chore', 'revert'
    ]],
    // type 单词格式
    'type-case': [0],
    // type是否为空 不能为空使用never反响匹配
    'type-empty':  [2, 'never'],
    // type最大内容长度
    'type-max-length': [2, "always", 20],
    // type最小内容长度
    'type-min-length': [0],
    // scope 可选值, 例如 [ 'components', 'utils', 'cli' ]
    'scope-enum': [0],
    'scope-case': [0],
    'scope-empty':  [2, 'never'],
    'scope-max-length': [0],
    'scope-min-length': [0],
    'subject-case': [0],
    'subject-empty': [2, 'never'],
    // subject 中止符
    'subject-full-stop': [0],
    'subject-max-length': [0],
    'subject-min-length': [0],
    // 分割符
    'subject-exclamation-mark': [0]
  }
}
