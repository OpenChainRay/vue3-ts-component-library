// @ts-nocheck
// 主表格表头
const dataObjectListTableColumns = [

  {
    title: '数据对象名称',
    dataIndex: 'dataName',
    align: 'center',
    search: false,
    width: 250

  },
  {
    title: '排序号',
    dataIndex: 'sortNum',
    scopedSlots: { customRender: 'sortNum' },
    align: 'center',
    search: false,
    width: 150

  },
  {
    title: '数据主表名称',
    dataIndex: 'tableName',
    scopedSlots: { customRender: 'tableName' },
    align: 'center',
    search: false,
    width: 250

  },
  {
    title: '主表主键字段',
    dataIndex: 'primaryFieldName',
    scopedSlots: { customRender: 'primaryFieldName' },
    align: 'center',
    search: false,
    width: 150

  },
  {
    title: '数据对象类型',
    dataIndex: 'dataType',
    scopedSlots: { customRender: 'dataType' },
    align: 'center',
    search: false,
    width: 150

  },
  {
    title: '组织架构类型的用户字段名称',
    dataIndex: 'userFieldName',
    align: 'center',
    search: false,
    width: 300

  },
  {
    title: '组织架构类型的部门字段名称',
    dataIndex: 'deptFieldName',
    align: 'center',
    search: false,
    width: 300

  },
  {
    title: '关联表类型对应的关联表名',
    dataIndex: 'assignedTableName',
    align: 'center',
    search: false,
    width: 300

  },
  {
    title: '关联表类型对应关联表的用户字段名称',
    dataIndex: 'assignedUserFieldName',
    align: 'center',
    search: false,
    width: 300

  },
  {
    title: '关联表类型对应关联表的部门字段名称',
    dataIndex: 'assignedDeptFieldName',
    align: 'center',
    search: false,
    width: 300

  },
  {
    title: '关联表类型对应关联主表的字段名称',
    dataIndex: 'assignedPrimaryFieldName',
    align: 'center',
    search: false,
    width: 300

  },
  {
    title: '创建时间',
    dataIndex: 'createOn',
    align: 'center',
    search: false,
    width: 250,
    fieldProps: {
      allowClear: true
    },
    transform (value) {
      return {
        startTime: value[0],
        endTime: value[1]
      }
    }

  },
  {
    title: '修改时间',
    dataIndex: 'updateOn',
    align: 'center',
    search: false,
    fieldProps: {
      allowClear: true
    },
    transform (value) {
      return {
        startTime: value[0],
        endTime: value[1]
      }
    }

  },
  {
    title: '是否启用',
    dataIndex: 'isValid',
    scopedSlots: { customRender: 'isValid' },
    align: 'center',
    search: false,
    fixed: 'right',
    width: 150
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
    align: 'center',
    search: false,
    fixed: 'right',
    width: 150

  },
  {
    title: '数据对象主键',
    dataIndex: 'id',
    colSpan: 0,
    customRender: () => { return { attrs: { colSpan: 0 } } },
    search: false,
    width: 0
  },
  {
    title: 'serial',
    dataIndex: 'serial',
    colSpan: 0,
    customRender: () => { return { attrs: { colSpan: 0 } } },
    search: false,
    width: 0
  }
]

export {
  dataObjectListTableColumns

}
