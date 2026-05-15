<template>
  <div style="display:inline-block">
    <span style='margin-right:15px;cursor: pointer;color:#3874ff' @click='openViewRange'>
      <slot></slot>
    </span>
    <!-- 视图数据范围 -->
    <a-modal title="默认数据范围" :visible="viewRangeVisable" cancel-text="取消" ok-text="确认" :footer='null' :destroy-on-close="true" :mask-closable="false"
      @ok="handleviewRangeViewOk" @cancel="handleviewRangeViewCancel" width="1200px">
      <div>
        <defaultViewRange ref="viewRange" :viewConfig="viewConfig" :tableCode='tableCode' :isCustomRequest="isCustomRequest"
          @handleviewRangeViewCancel='handleviewRangeViewCancel' @handleviewRangeViewOk='handleviewRangeViewOk' />
      </div>
    </a-modal>
  </div>
</template>
<script>

import defaultViewRange from '../AntTableView/views/defaultViewRange.vue'
export default {
  name: 'AntDefaultViewRange',
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
    }
  },
  data () {
    return {
      viewRangeVisable: false
    }
  },
  components: {
    defaultViewRange
  },
  computed: {

  },
  created () {
  },
  mounted () {
    // this.initData()
  },
  methods: {
    openViewRange () {
      this.viewRangeVisable = true
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
::v-deep .selectClass .ant-select-selection {
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
</style>
