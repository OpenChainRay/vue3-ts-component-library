/**
 * 生成过滤项 UUID。
 */
function generateUUID() {
  let d = new Date().getTime()
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16)
  })
}

const myMixin = {
  methods: {
    /**
     * 初始化过滤条件。
     */
    initFilter(response: any) {
      if (typeof response.filter.tableFilter.relationType !== "number") {
        response.filter.tableFilter.relationType = 0
      }
      if (typeof response.filter.viewFilter.relationType !== "number") {
        response.filter.viewFilter.relationType = 0
      }
      const tableSearchList = this.conditionalValue(response.filter.tableFilter.filters)
      const viewFilters = this.conditionalValue(response.filter.viewFilter.filters)
      this.relationType = response.filter.relationType
      this.viewRelationType = response.filter.viewFilter.relationType
      this.tableRelationType = response.filter.tableFilter.relationType
      this.allList = response.columns
      this.allList.forEach((item: any) => {
        item.list = item.columnList
        item.list.forEach((it: any) => {
          it.checked = false
          if (it.defaultIsShow) {
            it.checked = true
            this.isSelected.push(it)
          }
        })
        this.length += item.list.length
      })
      this.isSelected.sort((a: any, b: any) => a.sortNo - b.sortNo)
      let allColumns: any[] = []
      response.columns.forEach((group: any) => {
        allColumns = allColumns.concat(group.columnList)
      })
      allColumns = allColumns.filter((column: any) => this.checkColumn(column))
      this.selectColumnList = [...allColumns]
      this.cacheColumnList = [...allColumns]
      this.viewSearchList = this.dataFilters(viewFilters, allColumns)
      this.tableSearchList = this.dataFilters(tableSearchList, allColumns)
    },
    /**
     * 树结构数据过滤。
     */
    dataFilters(list: any[], allColumns: any[]) {
      const filtersList: any[] = []
      if (list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          const filter = list[i]
          const filters: any[] = []
          filter.filters.forEach((element: any) => {
            const index = allColumns.findIndex((column) => column.code === element.columnCode)
            if (index !== -1) {
              element.column = allColumns[index]
              element.deleteFlag = false
              element.uuid = generateUUID()
              element.groupType = filter.groupType
              filters.push(element)
            }
          })
          filtersList[i] = {
            uuid: generateUUID(),
            ...filter,
            filters,
            deleteFlag: false
          }
        }
      }
      return [...filtersList]
    }
  }
}

export default myMixin
