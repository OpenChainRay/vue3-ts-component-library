<template>
  <div class="inquiry-info">
    <a-card :bordered="false" v-bind:class="{ hidden: isHidden }">
      <pro-table
        ref="table"
        rowKey="id"
        :data="initInfoTableData"
        :columns="entryInspectionMainTableColumns"
        :alert="false"
        :rowSelection="rowSelection"
        :showPagination="true"
        :scroll="{ x: 'calc(1400px )', y: 240 }"
        bordered
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <div slot="toolBarRender">
          <a-input style="width:250px;" :value="scanNum" placeholder="扫描sku二维码">
            <template #prefix>
            </template>
            <template #suffix>
              <a-icon type="scan" />
            </template>
          </a-input>
        </div>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)"><a-icon type="edit" theme="filled" />&nbsp;重新质检
            </a>
          </template>
        </span>
      </pro-table>
    </a-card>

    <a-card :bordered="false" v-bind:class="{ hidden: !isHidden }">
    <a-row>
      <a-col :span=12>
        <a-carousel :after-change="onChange" arrows>
        <div slot="prevArrow" class="custom-slick-arrow" style="left: 10px;zIndex: 1">
          <a-icon type="left-circle" />
        </div>
        <div slot="nextArrow" class="custom-slick-arrow" style="right: 10px">
          <a-icon type="right-circle" />
        </div>
          <div><h3>1</h3></div>
          <div><h3>2</h3></div>
          <div><h3>3</h3></div>
          <div><h3>4</h3></div>
        </a-carousel>
      </a-col>
      <a-col :span=12 :style="{position:'relative',height:'700px'}">
        <a-card>
          <a-row v-for="row of skuData" :key="row.rowName">
            <a-col :span=12 class="card-text-left">{{row.rowName}}</a-col>
            <a-col :span=12 class="card-text-right">{{row.rowData}}</a-col>
          </a-row>
        </a-card>
        <template>
          <a-row>
            <a-col :span=6 :offset=1>不合格数量</a-col>
            <a-col :span=6>合格数量</a-col>
            <a-col :span=6>质检员</a-col>
          </a-row>
          <a-row :style="{ marginTop: '10px'}">
            <a-col :span=6 :offset=1>
              <a-input-number style="width: 90%"/>
            </a-col>
            <a-col :span=6>
              <a-input-number style="width: 90%"/>
            </a-col>
            <a-col :span=6>
              <a-input placeholder="请输入质检员" style="width: 90%"></a-input>
            </a-col>
            <a-col :span=4 :offset=1>
              <a-button type="danger" @click="errHandle">异常上报</a-button>
            </a-col>
          </a-row>
        </template>
        <template>
          <a-row :style="{marginTop:'10px'}">
            <a-col :span=24>
              <a-page-header title="异常描述">
                <template slot="extra">
                  <a-button key=1 type="link">
                    查看详情>>
                  </a-button>
                </template>
              </a-page-header>
            </a-col>
            <a-col :span=11 :offset=1>异常类型</a-col>
            <a-col :span=11>异常数量</a-col>
            <a-col :span=11 :offset=1 style="margin-top: 10px">
              <a-select style="width: 90%">
                <a-select-option v-for="row in errOption" :key="row.value" :value="row.value">
                  {{ row.text }}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :span=11 style="margin-top: 10px">
              <a-input-number style="width: 90%"/>
            </a-col>
            <a-col :span=11 :offset=1 style="margin-top: 10px">
              异常问题描述
            </a-col>
            <a-col :span=11 style="margin-top: 10px">
              异常图片
            </a-col>
            <a-col :span=11 :offset=1 style="margin-top: 10px">
              <a-textarea placeholder="异常问题描述" :auto-size="{ minRows: 3, maxRows: 5 }"></a-textarea>
            </a-col>
            <a-col :span=11 style="margin-top: 10px">
              <a-upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                list-type="picture-card"
                :file-list="fileList"
                @preview="handlePreview"
                @change="handleChange"
              >
              </a-upload>
              <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                <img alt="example" style="width: 100%" :src="previewImage" />
              </a-modal>
            </a-col>
          </a-row>
        </template>
        <a-row :style="{position:'absolute',bottom:'0',width:'100%'}">
          <a-col :span=3 :offset=17><a-button type="default">取消</a-button></a-col>
          <a-col :span=4><a-button type="primary">提交质检</a-button></a-col>
        </a-row>
      </a-col>
    </a-row>
    </a-card>

    <a-modal
      title="异常上报"
      :visible="errIsVisible"
      :confirm-loading="confirmLoading"
      @ok="handleErrOk"
      @cancel="handleErrCancel"
      :width="700"
    >
      <a-row :gutter="16">
        <a-col :span=8 class="card-text-left">规格型号</a-col>
        <a-col :span=8 class="card-text-left">物料名称</a-col>
        <a-col :span=8 class="card-text-left">抽检数量</a-col>
        <a-col :span=8><a-input placeholder="规格型号"></a-input></a-col>
        <a-col :span=8><a-input placeholder="物料名称"></a-input></a-col>
        <a-col :span=8><a-input placeholder="抽检数量"></a-input></a-col>
        <a-col :span=8 class="card-text-left">异常类型</a-col>
        <a-col :span=16 class="card-text-left">异常数量</a-col>
        <a-col :span=8>
          <a-select
            mode="multiple"
            style="width: 100%"
            placeholder="请选择异常类型"
            @change="handleChange"
          >
            <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
              {{ (i + 9).toString(36) + i }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :span=8>
          <a-input-number style="width:100%"/>
        </a-col>
        <a-col :span=24 class="card-text-left">添加图片</a-col>
        <a-col :span=24>
          <a-upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            list-type="picture-card"
            :file-list="fileList"
            @preview="handlePreview"
            @change="handleChange"
          >
            <div v-if="fileList.length < 8">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                Upload
              </div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </a-col>
        <a-col :span=24 class="card-text-left">异常问题描述</a-col>
        <a-col :span=24>
          <a-textarea placeholder="异常问题描述" :auto-size="{ minRows: 3, maxRows: 5 }"></a-textarea>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import ProTable from 'at-pro-table'
import { entryInspectionMainTableColumns } from '@/pages/Inspection/utils/tableContent'
// import AtModalForm from '@/components/AtModalForm'
import {
// getPageList,
} from '@/services/basicInfo/customer'
function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
export default {
  name: 'entryInspection',
  components: {
    ProTable
    // AtModalForm
  },
  data () {
    return {
      //  开始询价详情的表头数据及测试数据
      entryInspectionMainTableColumns,

      // 表格中多选框数据的记录
      selectedRowKeys: [],
      selectedRows: [],
      customerMatterCode: '1111',
      rankList: [],
      erpForm: null,
      erpVisible: false,
      groupList: [],
      currentId: '',
      isHidden: true,
      scanNum: '',
      skuData: [
        {
          rowName: '入库单号',
          rowData: '1'
        },
        {
          rowName: '序号',
          rowData: '2'
        },
        {
          rowName: 'sku编码',
          rowData: '3'
        },
        {
          rowName: '分组(中品类)',
          rowData: '4'
        },
        {
          rowName: '物料名称',
          rowData: '5'
        },
        {
          rowName: '所属入库单',
          rowData: '6'
        },
        {
          rowName: '单位',
          rowData: '7'
        },
        {
          rowName: '待检数量',
          rowData: '8'
        },
        {
          rowName: '供应商编码',
          rowData: '9'
        },
        {
          rowName: 'MTO',
          rowData: '10'
        },
        {
          rowName: '物料级别',
          rowData: '11'
        }
      ],
      errOption: [
        {
          text: '少货',
          value: 1
        },
        {
          text: '质量问题',
          value: 22
        },
        {
          text: '外观',
          value: 3
        }
      ],
      errIsVisible: false,
      previewImage: '',
      visible: false,
      fileList: [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        },
        {
          uid: '-2',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        }
      ]
    }
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        fixed: true
      }
    }
  },
  methods: {
    initInfoTableData: async (params) => {
      console.log('params', params)
      // const result = await getPageList(params).catch((error) => { throw new Error(error) })
      // const {
      //   list = [], pageNum, pageSize, pages, total
      // } = result.data.data
      // return {
      //   data: list,
      //   pageNo: pageNum,
      //   pageSize: pageSize,
      //   totalCount: total,
      //   totalPage: pages
      // }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // handleAdd () {
    //   this.$router.push({
    //     path: '/basic-info/customer-info-detail',
    //     query: {
    //       status: 'add'
    //     }
    //   })
    // }
    handleCancel () {
      this.previewVisible = false
    },
    async handlePreview (file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange ({ fileList }) {
      this.fileList = fileList
    },
    errHandle () {
      this.errIsVisible = true
    },
    handleErrCancel () {
      this.errIsVisible = false
    },
    handleErrOk () {
      this.errIsVisible = false
    }

  },
  created () {
  }
}
</script>

<style scoped>
.modal-main {
  height: 400px;
  overflow: hidden;
  overflow-y: scroll;
}
.hidden {
  display: none;
}
.card-text-left{
  text-align: left;
}
.card-text-right{
  text-align: right;
}
.ant-carousel :deep(.slick-slide ){
  text-align: center;
  height: 700px;
  line-height: 700px;
  background: #364d79;
  overflow: hidden;
}
.ant-carousel :deep(.custom-slick-arrow ){
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  opacity: 0.3;
}
.ant-carousel :deep(.custom-slick-arrow:before ){
  display: none;
}
.ant-carousel :deep(.custom-slick-arrow:hover ){
  opacity: 0.5;
}
.ant-carousel :deep(.slick-slide h3 ){
  color: #fff;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

</style>
