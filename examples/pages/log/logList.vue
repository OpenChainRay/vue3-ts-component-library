<template>

<div >

  <a-card :bordered="false">

    <at-table
      ref="table"
      rowKey="id"
      :columns="logListTableColumns"
      tableKey="logList"
      :showPagination="true"
      :data="initTableData"
      bordered
      :scroll="{ x: 'max-content' }"
      :search=true
      :drag=true
    >

    </at-table>

  </a-card>
</div>
</template>

<script>

import { logListTableColumns } from './utils/tableContent'
import { getLogPage } from '@/services/logList'
import { message } from '@/utils/contextApi'

const pagination = {
  pageNum: 1,
  pageSize: 10
}
export default {
  name: 'ContractCompleted',
  components: {
    // ProTable
  },
  data () {
    return {
      pagination,
      logListTableColumns

    }
  },

  async created () {

  },
  mounted () {

  },
  methods: {
    initTableData: async (parameter) => {
      // 处理日期重置后仍在查询参数中的问题
      const newParams = {
        pageNum: parameter.pageNo,
        pageSize: parameter.pageSize

      }
      if (parameter.importTime) {
        newParams.endTime = parameter.endTime
        newParams.startTime = parameter.startTime
      }
      const result = await getLogPage(newParams).catch((error) => { throw new Error(error) })

      if (result.data.code && result.data.code === 200) {
        const {
          list = [], pageNum, pageSize, pages, total
        } = result.data.data
        console.log(result.data.data)
        return {
          data: list,
          pageNo: pageNum,
          pageSize: pageSize,
          totalCount: total,
          totalPage: pages
        }
      } else {
        message({
          msg: {
            // 提示内容
            content: result.data.msg,
            // 停留时间ot
            duration: 5
          },
          type: 'error'
        })
      }
    },

    // 控制岗位名称修改弹窗
    showPostNameModify () {
      this.postNameVisible = true
    },

    // 岗位名称修改完成
    handlePostNameOk () {
      this.$refs.form.validate().then((values) => {
        console.log('岗位名称: ', values.postName)
          this.postNameVisible = false
      })
    }

  },

  showInfo (record) {
    this.$router.push({
      name: '完成合同详情',
      query: {
        id: record.id
      }
    })
  }
}

</script>
