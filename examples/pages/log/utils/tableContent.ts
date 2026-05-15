// @ts-nocheck
// 主表格表头
const logListTableColumns = [

  {
    title: '日志ID',
    dataIndex: 'logId',
    align: 'center',
    search: false,
    width: 200
  },
  {
    title: '操作者',
    dataIndex: 'operator',

    align: 'center',

    width: 200
  },
  {
    title: '操作日期',
    dataIndex: 'date',
    valueType: 'dateRange',
    transform (value) {
      return {
        startDate: value[0],
        endDate: value[1]
      }
    },
    ellipsis: true,
    align: 'center',

    width: 200
  },
  {
    title: 'IP地址',
    dataIndex: 'address',

    align: 'center',
    search: false,
    width: 200
  },
  {
    title: '操作记录',
    dataIndex: ' record',

    align: 'center',

    width: 200
  },

  {
    title: 'id',
    dataIndex: 'id',
    colSpan: 0,
    customRender: () => { return { attrs: { colSpan: 0 } } },
    search: false
  }

]

export {
  logListTableColumns

}
