<template>
  <div >
    <a-card :bordered="false">
      <!-- {{ userListTableColumns }}{{ userListTableColumns.length }} -->
      <at-table
        ref="table"
        rowKey="id"
        :columns="userListTableColumns"
        tableKey="user"
        :showPagination="true"
        :data="initTableData"
        bordered
        :search=true
        :drag=true
        :dropConfig="{
          column:true,
          row:true
        }"
        :pageSize="pageSize"
        @column-drop-start="columnDropStart"
        @column-drop-end = "columnDropEnd"
        :scroll="{ y: 600 }"
        :virtualized="true"
      >
        <span slot="status" slot-scope="text, record">
          <a-switch checked-children="是" un-checked-children="否" @change="onStatusChange($event,record)" :default-checked="record.status==1"/>
        </span>
      </at-table>
    </a-card>
  </div>
  </template>

<script>
import { userListTableColumns, roleListTableColumns } from './utils/tableContent'
import { getUserByPage } from '@/services/user/user'
let that
export default {
  name: 'ContractCompleted',
  components: {
  },
  data () {
    return {
      pageSize: 1000,
      userListTableColumns,
      roleListTableColumns
    }
  },
  async created () {
    that = this
  },
  methods: {
    columnDropStart () {
      console.log('开始拖拽')
    },
    columnDropEnd () {
      console.log('结束拖拽')
    },
    initTableData: async (params) => {
      // 处理日期重置后仍在查询参数中的问题
      const newParams = {
        pageNum: params.pageNo,
        pageSize: params.pageSize,
        orderColumns: [{
          columnName: '',
          isAsc: false
        }],
        param: {
          mobile: params.mobile,
          userName: params.userName,
          fullName: params.fullName,
          employeeName: params.employeeName,
          deptName: params.deptName
        }
      }
      const result = await getUserByPage(newParams).catch((error) => { throw new Error(error) })
      console.log('result.data', result.data)
      if (result.data.code && result.data.code === 200) {
        const {
          list = null, pageNum, pageSize, pages, total
        } = result.data.data
        that.pagination = {
          pageNum,
          pageSize
        }
        return {
          data: list,
          pageNo: pageNum,
          pageSize: pageSize,
          totalCount: total,
          totalPage: pages
        }
      } else {
        // return {}
        // message({
        //   msg: {
        //     // 提示内容
        //     content: result.data.msg,
        //     // 停留时间
        //     duration: 5
        //   },
        //   type: 'error'
        // })
        this.$message.error(result.data.msg)
      }
    }
  }
}
</script>
