// @ts-nocheck
// tree扁平化
export function treeToArray (tree) {
  return tree.reduce((res, item) => {
    const { children, ...i } = item
    return res.concat(i, children && children.length ? treeToArray(children) : [])
  }, [])
}
// 扁平化数组转tree
export function arrayToTree (items) {
  const res = [] // 存放结果集
  const map = {}
  // 判断对象是否有某个属性
  const getHasOwnProperty = (obj, property) => Object.prototype.hasOwnProperty.call(obj, property)

  // 边做map存储，边找对应关系
  for (const i of items) {
    map[i.id] = {
      ...i,
      children: getHasOwnProperty(map, i.id) ? map[i.id].children : []
    }
    const newItem = map[i.id]
    if (i.pid === 0) {
      res.push(newItem)
    } else {
      if (!getHasOwnProperty(map, i.pid)) {
        map[i.pid] = {
          children: []
        }
      }
      map[i.pid].children.push(newItem)
    }
  }
  return res
}
