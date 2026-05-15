<template>
  <div style="display:inline-block">
    <span style='cursor: pointer;' @click='openViewRange'>
      <slot></slot>
    </span>
    <!-- 视图数据范围 -->
    <a-modal title="视图数据范围" :visible="viewRangeVisable" cancel-text="取消" ok-text="确认" :footer='null'
      :destroy-on-close="true" :mask-closable="false" @ok="handleviewRangeViewOk" @cancel="handleviewRangeViewCancel"
      width="1300px">
      <div class="vheight">
        <viewRange ref="viewRange" :viewConfig="viewConfigCopy" :tableCode='currentTableCode' :columnMap="columnMap"
          :isCustomRequest="isCustomRequest" :columns="columns" @handleviewRangeViewCancel='handleviewRangeViewCancel'
          @handleviewRangeViewOk='handleviewRangeViewOk' />
      </div>
    </a-modal>
  </div>
</template>
<script>

import viewRange from '../AntTableView/views/viewRange.vue'
import {
  getViewInfoById
} from '../sevrices/configurationView'
import { getTableCode } from '../AntTableView/getTableCode'
export default {
  name: 'AntViewRange',
  props: {
    // 当前视图
    viewConfig: {
      type: [Object],
      default: () => {
        return {}
      },
      required: false
    },
    tableCode: {
      type: String,
      default: '',
      required: true
    },
    // true  点击保存会调用 customRviewRange 函数并传参
    isCustomRequest: {
      type: Boolean,
      default: false
    },
    customRviewRange: {
      type: Function,
      default: () => { },
      required: false
    },
    // 自定义请求
    columnMap: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 表头
    columns: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      viewConfigCopy: this.viewConfig,
      viewRangeVisable: false,
      currentTableCode: ''
    }
  },
  components: {
    viewRange
  },
  computed: {

  },
  created () {
  },
  mounted () {
    this.currentTableCode = getTableCode(this)
  },
  methods: {
    openViewRange () {
      this.viewRangeVisable = true
      this.viewConfigCopy = this.viewConfig
      getViewInfoById(this.viewConfig.viewId).then(res => {
        console.log(res.data.data)
        this.viewConfigCopy.filter = res.data.data.filter
      })
    },
    handleviewRangeViewOk (params) {
      this.viewRangeVisable = false
      if (this.isCustomRequest === true) {
        this.$emit('customRviewRange', params)
      } else {
        this.$emit('initViewData')
      }
    },
    handleviewRangeViewCancel () {
      this.viewRangeVisable = false
    }
  }

}
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  margin-bottom: 10px;
}

.condition {
  width: 89%;
  background-color: #f9f9fa;
  padding: 20px 0;
}

.addClass {
  margin-left: 80px;
  display: flex;
  align-items: center;
}

.relativeClass {
  position: relative;
  display: flex;
  align-items: center;
}

.selectAndOr {
  position: relative;
  width: 64px;
  height: 100%;
  align-items: center;
}

.flexRight {
  width: 89%;
  margin-left: 1%;
}

:deep(.selectClass .ant-select-selection ){
  border: none;
  background-color: #f3f4f6;
}

.line-operate {
  border-top: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
  border-left: 1px solid #d9d9d9;
  width: 20px;
  position: absolute;
  height: calc(100% - 48px);
  left: 20px;
}

.between {
  justify-content: space-between;
}

.column {
  flex-direction: column;
}

.wrap {
  flex-wrap: wrap;
}

.block {
  display: inline-block;
  width: 91px;
  text-align: right;
  margin-right: 20px;
}

.modalContent {
  height: auto;
  border: 1px solid #f0f0f0;
  display: flex;
}

.vheight {
  max-height: 600px;
  overflow-y: auto;
}

.vheight::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.2);
  // background-color:rgba(0,0,0,.06);
  -webkit-box-shadow: inset -2px 0 0 #fff, inset 1px 0 0 hsla(0, 0%, 100%, 0.9),
    inset 0 -1px 0 hsla(0, 0%, 100%, 0.9), inset 0 1px 0 hsla(0, 0%, 100%, 0.9);
}

// 滚动条
.vheight::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8px;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 8px;
}

.vheight::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 8px;
  height: 20px;
  -webkit-box-shadow: inset -2px 0 0 #fff, inset 1px 0 0 #fff,
    inset 0 -1px 0 hsla(0, 0%, 100%, 0.9), inset 0 1px 0 hsla(0, 0%, 100%, 0.9);
  background-color: rgba(0, 0, 0, 0.1);
}

.vheight::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  border-radius: 8px;
  -webkit-box-shadow: inset -2px 0 0 #fff, inset 1px 0 0 hsla(0, 0%, 100%, 0.9),
    inset 0 -1px 0 hsla(0, 0%, 100%, 0.9), inset 0 1px 0 hsla(0, 0%, 100%, 0.9);
  background-color: rgba(15, 15, 15, 0.09);
}
</style>
