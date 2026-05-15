type TableCodeContext = {
  tableCode?: string
  $route: { path: string }
}

/**
 * 根据路由和缓存菜单解析 tableCode。
 */
export function getTableCode(that: TableCodeContext): string | undefined {
  let currentTableCode: string | undefined
  const treeFlatten = localStorage.getItem("treeFlatten")
  if (treeFlatten) {
    const tree = JSON.parse(treeFlatten) as Array<{ fullPath?: string; tableCode?: string }>
    const currentPath = that.$route.path
    const index = tree.findIndex((item) => item.fullPath === currentPath)
    if (index !== -1 && tree[index].tableCode) {
      currentTableCode = tree[index].tableCode
    } else {
      currentTableCode = that.tableCode
    }
  } else {
    currentTableCode = that.tableCode
  }
  return currentTableCode
}
