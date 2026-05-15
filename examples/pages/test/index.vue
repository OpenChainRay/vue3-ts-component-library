<template>
    <a-form>


        <a-form-item label="未税标准单价">

            <at-statistic @change="handleStandardUntaxedQuoteBlur" style="width:116px" align="right" :min="-10"
                v-model:value="formModel.standardUntaxedQuote" />


        </a-form-item>

        <div @click="handleClick($event)">
            <button @click="btnClick">Click me</button>
        </div>



        <at-table ref="table" rowKey="id" tableKey="customerInfoTable" :data="initTableData"
            :columns="customerInfoTableColumns" :alert="false" :search="false" :showPagination="true" drag bordered
            :scroll="{ x: '100%' }">


        </at-table>
    </a-form>
</template>


<script>
import { AtStatistic } from 'at-materia'
import { getCustomerList } from '@/services/common'
export default {
    name: 'test',
    components: {
        // ProTable
        // AtModalForm
        AtStatistic
    },
    data() {
        return {
            customerInfoTableColumns: [{
                title: '序号',
                scopedSlots: { customRender: 'serial' },
                align: 'center',
                dataIndex: 'serial',
                columnTitle: '序号',
                fixed: false,
                ignoreSort: true,
                search: false,
                width: 70,
                sortNo: -2,
                id: -2,
                ellipsis: true
            }],
            form: null,
            number: 121929129
        }
    },
    methods: {
        handleClick(e) {
            console.log(e.target);        // 输出被点击的按钮元素（<button>Click me</button>）
            console.log(e.currentTarget); // 输出绑定事件的元素（<div>...</div>）
        },
        btnClick(e){
            console.log(e.target);        // 输出被点击的按钮元素（<button>Click me</button>）

        },
        handleStandardUntaxedQuoteBlur(v) {
            console.log('handleStandardUntaxedQuoteBlur', v)
        },
        initTableData: async (params) => {
            const param = {
                orderColumns: [{ columnName: params.sortField, isAsc: params.sortOrder === 'ascend' }],
                pageNum: params.pageNo,
                pageSize: params.pageSize,
                param: {}
            }
            const { data } = await getCustomerList(param).catch((error) => { throw new Error(error) })
            if (data.code && data.code == 200) {
                this.customerInfoTableColumns.forEach(item => {
                    if (item.dataIndex === params.sortField) {
                        item.sortOrder = params.sortOrder
                    } else {
                        delete item.sortOrder
                   }
                 })

                const { list = [], pageNum, pageSize, pages, total } = data.data
                return {
                    data: list,
                    pageNo: pageNum,
                    pageSize: pageSize,
                    totalCount: total,
                    totalPage: pages
                }
            } else {
                message({ msg: { content: data.msg, duration: 3 }, type: 'error' })
            }
        },
        onStatusChange: async function (checked, record) {
            console.log('record', record)
            if (checked) {
                const result = await enableSubById(record.id).catch((error) => { throw new Error(error) })
                oftenMessage(result.data.data, result.data.msg)
            } else {
                const result = await disableSubById(record.id).catch((error) => { throw new Error(error) })
                oftenMessage(result.data.data, result.data.msg)
            }
        },
        showEdit(record) {
            this.editVisible = true
            this.editFormData = record
        },
        editCancel() {
            this.editVisible = false
        },
        editOk() {
            this.$refs.editForm.validate().then(async (values) => {
                const editData = {
                        id: this.editFormData.id,
                        moduleName: values.moduleName,
                        moduleCode: values.moduleCode
                    }
                    const result = await editSubListData(editData).catch((error) => { throw new Error(error) })
                    if (result.data.code && result.data.code == 200) {
                        this.$message.success(result.data.msg)
                        this.$nextTick(() => {
                            this.$refs.editForm?.resetFields()
                            this.$refreshPage('/personnel')
             }
           })
                        this.$refs.table.refresh()
                        this.editVisible = false
                    } else {
                        this.$message.error(result.data.msg)
                    }
               }
             })
        },
        showInsert() {
            this.insertVisible = true
        },
        insertCancel() {
            this.insertVisible = false
        },
        insertOk() {
            this.$refs.insertForm.validate().then(async (values) => {
                const result = await insertSubListData(values).catch((error) => { throw new Error(error) })
                    if (result.data.code && result.data.code == 200) {
                        this.$message.success(result.data.msg)
                        this.$nextTick(() => {
                            this.$refs.insertForm?.resetFields()
                            this.$refreshPage('/personnel')
             }
           })
                        this.$refs.table.refresh()
                        this.insertVisible = false
                    } else {
                        this.$message.error(result.data.msg)
                    }
               }
             })
        },
        async deleteById(row) {
            const result = await deleteSubListData(row.id)
            if (result.data.code && result.data.code != 200) {
                this.$message.error(result.data.msg)
            } else {
                this.$refs.table.refresh()
            }
        }
    }
}


</script>