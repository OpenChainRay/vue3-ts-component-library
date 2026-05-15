// @ts-nocheck
/**
 * 给对象注入属性
 * @param keys 属性key数组， 如 keys = ['config', 'path'] , 则会给对象注入 object.config.path 的属性
 * @param value 属性值
 * @returns {Object}
 */
Object.defineProperty(Object.prototype, 'assignProps', {
  writable: false, // 新增的assignProps属性不可被赋值运算符赋值
  enumerable: false, // 新增的assignProps属性不会出现在对象的枚举属性中
  configurable: true, // 新增的assignProps属性可以被修改或删除
  value: function (keys, value) {
    let props = this
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (i == keys.length - 1) {
        props[key] = value
      } else {
        props[key] = props[key] == undefined ? {} : props[key]
        props = props[key]
      }
    }
    return this
  }
})
