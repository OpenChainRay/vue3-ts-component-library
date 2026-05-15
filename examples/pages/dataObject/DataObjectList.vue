<template>
<div >
  <a-card :bordered="false">
    <at-table
      ref="table"
      rowKey="id"
      :columns="dataObjectListTableColumns"
      tableKey="dataObject"
      :showPagination="true"
      :data="initTableData"
      bordered
      :search=true
      :drag=true
    >
      <div slot="toolBarRender">
        <div>
          <a-button type="primary"  @click="showInsert">
            新增
          </a-button>
          <a-button type="primary"  @click="initObj">
            初始化数据对象
          </a-button>
        </div>
      </div>
      <span slot="isValid" slot-scope="text, record">
        <a-switch checked-children="是" un-checked-children="否" @change="onStatusChange($event,record)" :default-checked="record.status==1" v-if="record.roleNum>0" disabled/>
        <a-switch checked-children="是" un-checked-children="否" @change="onStatusChange($event,record)" :default-checked="record.status==1" v-else/>
      </span>
      <span slot="operation" slot-scope="text, record">
        <a @click="showModify(record)">修改</a>
        <!-- <a-divider type="vertical" />
        <a-popconfirm title="Sure to delete?" @confirm="() => onDelete(record)">
          <a href="javascript:;">删除</a>
        </a-popconfirm> -->
      </span>
      <span slot="dataType" slot-scope="text, record">
          <a v-if="record.dataType==0" style="color:rgba(0, 0, 0, 0.65)">组织架构</a>
          <a v-else-if="record.dataType==1" style="color:rgba(0, 0, 0, 0.65)">关联表</a>
      </span>
    </at-table>
  </a-card>
</div>
</template>

<script>
import { dataObjectListTableColumns } from './utils/tableContent'
import { getDataPage, changeDisable, changeEnable, initDataObj } from '@/services/dataObject'
// import { message } from '@/utils/contextApi'
import { oftenMessage } from '@/utils/contextApi'

export default {
  name: 'PersonnelList',
  components: {
    // ProTable
  },
  data () {
    return {
      dataObjectListTableColumns,
      modifyForm: null,
      isChecked: true,
      modifyVisible: false,
      modifyId: '',
      modifyDefaultData: ''
    }
  },
  methods: {
    async initObj () {
      const result = await initDataObj().catch((error) => { throw new Error(error) })

      if (result.data.code && result.data.code === 200) {
        oftenMessage('success', result.data.msg)
      } else {
        oftenMessage(result.data.data, result.data.msg)
      }
    },
    showModify (record) {
      this.$router.push({
        name: '修改数据对象',
        query: {
          id: record.id,
          record: record
        }
      })
    },
    initTableData: async (parameter) => {
      // 处理日期重置后仍在查询参数中的问题
      const newParams = {
        pageNum: parameter.pageNo,
        pageSize: parameter.pageSize,
        orderColumns: [
          {
            columnName: '',
            isAsc: true
          }
        ],
        param: {}
      }
      if (parameter.importTime) {
        newParams.endTime = parameter.endTime
        newParams.startTime = parameter.startTime
      }
      const result = await getDataPage(newParams).catch((error) => { throw new Error(error) })

      if (result.data.code && result.data.code === 200) {
        const {
          list = [], pageNum, pageSize, pages, total
        } = result.data.data
        // console.log(result.data.data)
        return {
          data: list,
          pageNo: pageNum,
          pageSize: pageSize,
          totalCount: total,
          totalPage: pages
        }
      } else {
        oftenMessage(result.data.data, result.data.msg)
      }
    },
    // 监控是否有效变化
    onStatusChange: async function (checked, record) {
      if (checked) {
        const result = await changeEnable({ id: record.id }).catch((error) => { throw new Error(error) })
        oftenMessage(result.data.data, result.data.msg)
      } else {
        const result = await changeDisable({ id: record.id }).catch((error) => { throw new Error(error) })
        oftenMessage(result.data.data, result.data.msg)
      }
    },
    showInsert () {
      this.$router.push({
        name: '新增数据对象'
  })
    }
  }
}

</script>
