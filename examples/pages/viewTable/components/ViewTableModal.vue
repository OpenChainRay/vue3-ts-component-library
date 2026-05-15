<template>
  <!-- 新增 -->
  <a-modal v-if="addVisible" :title="modalTitle" :visible="addVisible" :confirm-loading="confirmLoading" @ok="addOk" @cancel="addCancel" width=600px>
    <a-form ref="addForm">
      <a-row :gutter="20">
        <a-col :span="20">
          <a-form-item label="表格唯一编码" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-input v-model:value="formModel.tableCode" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="20">
        <a-col :span="20">
          <a-form-item label="表格名称" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-input v-model:value="formModel.tableName" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="20">
        <a-col :span="20">
          <a-form-item label="备注" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-input v-model:value="formModel.remark" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="20">
        <a-col :span="20">
          <a-form-item label="默认分页下拉选" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <page-size-list ref="pageSizeList" v-model="this.detail.pageSizeList" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script>
import pageSizeList from './PageSizeList.vue'
import { AtTable } from 'at-materia'
import { saveTable } from '@/services/view/viewTable'
const { eventBus } = AtTable
export default {
  name: 'addViewTable',
  components: { pageSizeList },
  data () {
    return {
      addVisible: false,
      confirmLoading: false,
      addForm: null,
      modalTitle: '新增视图表格',
      editId: null,
      detail: {}
    }
  },
  computed: {},
  created () { },
  mounted () { },
  methods: {
    // 打开弹窗
    open (rec) {
      this.addVisible = true
      if (rec) {
        this.detail = rec
        this.editId = rec.id
        this.modalTitle = '修改视图表格'
      } else {
        this.detail = {}
        this.editId = null
        this.modalTitle = '新增视图表格'
      }
    },
    // 保存
    addOk () {
      this.$refs.addForm.validate().then(async (values) => {
        const param = values
          param.pageInfo = this.$refs.pageSizeList.getJsonValue()
          console.log(param)
          const { data } = await saveTable(param).catch((error) => { throw new Error(error) })
          if (data.code && data.code === 200) {
            this.$message.success(data.msg)
            this.$nextTick(() => {
              this.$refs.addForm?.resetFields()
              this.addCancel()
              eventBus.emit('viewTableList')
     })
          } else {
            this.$message.error(data.msg)
          }
      })
    },
    // 关闭弹窗
    addCancel () {
      this.addVisible = false
      this.detail = {}
      this.editId = null
    }

  }
}
</script>

<style lang="less" scoped>
</style>
