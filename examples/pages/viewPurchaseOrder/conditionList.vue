<template>
<div>
    <UniversalContainer ref="tContainer" title="条件映射列表">
        <div slot="btns">
            <a-button type="primary" @click="add">新增</a-button>

        </div>
        <div slot="views">
            <span @click='changeSearch()' :class="searchShow ? 'blue' : ''" class="filter">
                <a-icon type="filter" />过滤</span>
            <span class="pagecount">(共 <strong>{{ total }}</strong>条数据)</span>
        </div>
        <div v-show='searchShow' class="pageSearch">
            <ant-view-search ref="customSearch" @searchMethods="doSearch" v-model="searchList" :showDelButn="false"></ant-view-search>
        </div>
    </UniversalContainer>

    <a-card :bordered="false" :style="{ 'min-height': cardheight + 'px', }">
        <at-table ref="table" rowKey="tableCode" :columns="tableColumns" :showPagination="true" :data="initTableData" bordered :search="true">
            <span slot="serial" slot-scope="text, record, index">
                {{ index + 1 }}
            </span>
            <span slot="operation" slot-scope="text, record">

                <a-button type="link" @click="del(record)">删除</a-button>
                <a-button type="link" @click="update(record)">修改</a-button>

            </span>
            <span slot="filter" slot-scope="text, record,index">
                <!-- <condiations ref="condiations" :tableCode="this.tableCode"/> -->

                <!-- 回显数据 -->
                {{record.filter}}
                <ant-group :ref="'antGroup'+index" :data="record.filter" :tableCode="tableCode" :selectColumnList="selectColumnList" :hideIcon="true" :disabled="true" />
            </span>

        </at-table>
    </a-card>

    <conditions ref="conditions" :tableCode="tableCode" @refresh="refresh" @setselectColumnList="setselectColumnList" />

</div>
</template>

<script>
import myMixin from '@/layouts/mix/mymixin'
import {
    generateUUID
} from '../../utils/uuid'

import {
    mappingpage
} from './api'
// import { ColumnType } from '@/components/AntView/Constant/constant'
import conditions from './conditions'
export default {
    mixins: [myMixin],
    props: ['tableCode'],
    components: {
        conditions: conditions
    },
    data() {
        return {
            selectColumnList: [],
            searchList: [

            ],
            searchShow: true,
            tableColumns: [{
                    title: '序号',
                    scopedSlots: {
                        customRender: 'serial'
                    },
                    align: 'center',
                    search: false,
                    width: 80,
                    ellipsis: true
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    scopedSlots: {
                        customRender: 'operation'
                    },
                    align: 'center',
                    width: 100,
                    search: false
                },
                {
                    title: '条件',
                    dataIndex: 'filter',
                    scopedSlots: {
                        customRender: 'filter'
                    },
                    align: 'center',
                    width: 400,
                    search: false
                }

            ]

        }
    },
    methods: {
        refresh() {
            this.initTableData()
        },
        update(record) {
            this.$refs.conditions.open(record)
        },
        add() {
            this.$refs.conditions.open()
        },
        go2Operate(item) {
            this.$router.push({
                path: '/logicOperate',
                query: {
                    title: '操作符',
                    typeId: item.typeId
               }
             })
        },
        setselectColumnList(list) {
            console.log('setselectColumnList')
            this.selectColumnList = list
            this.tableData.forEach((e, i) => {
                const index = this.selectColumnList.findIndex((items) => items.code === e.filter.columnCode)
                const filter = e.filter
                filter.column = this.selectColumnList[index]
                setTimeout(() => {
                    debugger
                    if (this.$refs['antGroup' + i])
                        this.$refs['antGroup' + i].updateColumn(filter.column, filter.operator, this.tableCode, filter.value)
                }, 50)
       }
     })
        },
        initTableData: async function (params) {
            const param = {
                pageNum: params.pageNo,
                pageSize: params.pageSize,
                orderColumns: [{
                    columnName: '',
                    isAsc: false
                }],
                param: {
                    tableCode: this.tableCode,
                    ...this.searchObj
                }
            }
            const result = await mappingpage(param).catch((error) => {
                throw new Error(error)
       }
     })
            if (result.data.code && result.data.code === 200) {
                const {
                    list = [], pageNum, pageSize, pages, total
                } = result.data.data
                this.total = total
                this.pagination = {
                    pageNum,
                    pageSize
                }
                this.tableData = list.map(e => {
                    e.filter.deleteFlag = false
                    e.filter.uuid = generateUUID()
                    return e
         }
       })
                return {
                    data: this.tableData,
                    pageNo: pageNum,
                    pageSize: pageSize,
                    totalCount: total,
                    totalPage: pages
                }
            } else {
                this.$message.error(result.data.msg)
            }
        }
    }
}
</script>
