<template>
  <div style="display:inline-block">
    <span @click="openColumnsChoose" style="cursor:pointer" class="blockClass">

      <a-tooltip class="header-item" title="设置" placement="bottom" >
         <a-icon type="setting" style="cursor:pointer"/>
      </a-tooltip>

      <slot></slot>

    </span>
    <!-- 设置 弹窗 -->
    <a-modal title="设置显示字段" :visible="showColumnsVisable" cancel-text="取消" ok-text="确认" :destroy-on-close="true" :mask-closable="true" @ok="handleViewOk"
      @cancel="handleViewCancel" width="1000px">
      <at-modal-form>
        <div class="modalContent">
          <div class="leftContent">
            <div style='margin-left:13px;margin-top:20px;'><a-checkbox v-model='checkAll' @change="checkAllItem()"></a-checkbox>
              <span style='margin-left:10px;'>{{ !checkAll ? '全选' :
                          '取消全选'
                      }}</span>
            </div>
            <p class="left_title">可选字段</p>
            <div class="checkGroup" v-for="(item, index) in filterTableColumns" :key="index">
              <p style="width:100%;">{{ item.name }}</p>
              <p v-for="(it, int) in item.list" :key="int" style="width:25%;">
                <a-checkbox :checked="it.checked" @change="onCheckAllChange(it)" :disabled="it.isRequired == 1">
                  <a-tooltip placement="topLeft">
                    <template slot="title">
                      <span>{{ it.columnTitle }}</span>
                    </template>
                    <span v-if="it.titcolumnTitlele && it.columnTitle.length > 8">{{ it.columnTitle.slice(0,
                                      8) + '...' }}</span>
                    <span v-else>{{ it.columnTitle }}</span>
                  </a-tooltip>
                </a-checkbox>
              </p>
            </div>
          </div>
          <div class="rightContent">
            <p class="left_title">已选字段</p>
            <div class="checkGroup drag">
              <draggable v-model="columns" @update="change" animation="300" style="width:100%">

                <template v-for="(item, index) in columns">

                  <div :key="index" v-if="item.sortNo >= -1" style="height:25px;margin-bottom:0px;width:100%">
                    <p class="phover">
                      <span><a-icon type="more" style="width:10px;" /><a-icon type="more" style="width:10px;margin-right:10px;" />{{ item.columnTitle }}</span>
                      <a-icon type="close-circle" @click="delselect(item, index)" style="margin-right:10px;line-height:30px;" v-if="item.isRequired == 0" />
                    </p>
                  </div>

                </template>
              </draggable>
            </div>
          </div>
        </div>

      </at-modal-form>
    </a-modal>
  </div>
</template>

<script>
// 控制列显隐的控件
import {
  updateView
} from '../sevrices/configurationView'
import { whiteColumns } from '../Constant/constant'
import AtModalForm from '../AntTableView/AtModalForm'
import _ from 'lodash'
import draggable from 'vuedraggable'

export default {
  name: 'AntColumnDisplay',
  props: {
    // 当前视图的参数
    viewConfig: {
      type: [Object],
      required: true
    },
    //  table的列数组
    tableColumns: {
      type: [Array],
      required: true
    },
    // 所有列
    allColumnQuote: {
      type: [Array],
      required: true
    }
  },
  model: {
    prop: 'tableColumns',
    event: 'change'
  },
  components: {
    AtModalForm,
    draggable

  },
  data () {
    return {
      checkAll: false,
      // 已显示列
      columns: [],
      showColumnsVisable: false
    }
  },
  computed: {
    filterTableColumns () {
      // applicationFlag  0  用于查询列和条件 1 仅用于查询列  2  仅用于条件 3  页面传参
      // applicationFlag 0 1 显示  其他不显示
      const filterTableColumns = []
      this.allColumnQuote.forEach(item => {
        filterTableColumns.push({
          name: item.name,
          sortNo: item.sortNo,
          list: item.list.filter((li) => {
            return li.applicationFlag == 0 || li.applicationFlag == 1
          })
        })
      })
      // console.log(filterTableColumns, 'filterTableColumns')
      return filterTableColumns
    }
  },
  watch: {
    tableColumns: {
      handler (v) {
        // console.log('列显隐', v)
        // 深copy 防止为确定时页面外围页面重绘制
        this.columns = _.cloneDeep(v)
      }

    }
  },

  mounted () {

  },
  methods: {
    /**
     * @param {*} oldIndex 元素原来的索引。
     * @param {*} newIndex 元素新的索引。
     */
    change () {
      this.$emit('change', this.columns)
    },
    // 检测是否全选
    checkAllFun () {
      let allLength = 0 // 全部列
      let selectLength = 0 // 选中的
      this.filterTableColumns.forEach(item => {
        allLength += item.list.length
        // console.log(item)
        const filters = item.list.filter((li) => li.checked)
        selectLength += filters.length
      })
      console.log(allLength, selectLength)
      return allLength === selectLength
    },
    onCheckAllChange (e) {
      e.checked = !e.checked
      if (e.checked) { // 已选择的
        e.defaultIsShow = 1
        this.columns.push(e)
      } else {
        e.defaultIsShow = 0
        const index = this.columns.findIndex(item => {
          return item.code === e.code
        })
        console.log(index)
        this.columns.splice(index, 1)
      }
      // const length =
      this.checkAll = this.checkAllFun()
    },

    delselect (it, index) {
      this.columns.splice(index, 1)
      // console.log(it)
      this.filterTableColumns.forEach((item, index) => {
        if (item.name == it.groupName) {
          this.filterTableColumns[index].list.forEach(it2 => {
            if (it.columnTitle == it2.columnTitle) {
              it2.checked = false
              it2.defaultIsShow = 0
            }
          })
        }
      })
      this.checkAll = this.checkAllFun()
    },

    checkAllItem () {
      const fixedArray = []
      this.columns.forEach(column => {
        const index = whiteColumns.findIndex(whiteColumn => {
          return whiteColumn.dataIndex === column.dataIndex
        })
        if (index != -1) {
          fixedArray.push(column)
        }
      })

      // 全选
      const arr = []
      const arrRepet = []
      if (this.checkAll) { // 全选
        this.filterTableColumns.forEach(item => {
          item.list.forEach(element => {
            element.defaultIsShow = 1
            element.checked = true
            arr.push(element)
          })
        })
        const mergeData = this.columns.concat(arr)
        const result = mergeData.reduce((cur, next) => { // 合并去重
          const repeat = cur.some((item) => {
            return item.code === next.code
          })
          if (!repeat) {
            return cur.concat([next])
          } else {
            return cur
          }
        }, [])

        // fixedArray.forEach(item => {
        //   result.push(item)
        // })
        this.columns = result
      } else { // 取消全选留下必须的字段
        fixedArray.forEach(item => {
          arrRepet.push(item)
        })
        this.filterTableColumns.forEach(item => {
          item.list.forEach(element => {
            if (element.isRequired == 0) { // 0是页面必须要的字段
              element.defaultIsShow = 0
              element.checked = false
            } else {
              arrRepet.push(element)
            }
          })
        })
        this.columns = arrRepet
      }
      console.log(this.columns)
      // this.$emit('change', this.columns)
    },
    handleViewCancel () {
      this.showColumnsVisable = false
    },
    openColumnsChoose () {
      this.showColumnsVisable = true
    },
    /**
                     * 确认显示的列
                     */
    async handleViewOk () {
      if (this.columns.length > 97) {
        return this.$antmessage.error('最多只能显示97列')
      }
      this.columns.forEach((element, index) => {
        if (element.sortNo > -1) { element.sortNo = index }// 重新排序
      })
      this.columns.forEach(item => {
        this.allColumnQuote.forEach(it => {
          if (item.groupName == it.name) {
            it.list.forEach(item2 => {
              if (item2.columnTitle == item.columnTitle) {
                item2.sortNo = item.sortNo
                item2.sorter = true
                if (item2.dataIndex == 'serial') {
                  delete item2.sorter
                }
              }
            })
          }
        })
      })
      const groups = []

      this.allColumnQuote.map((item, index) => {
        const obj = {
          name: item.name,
          sortNo: index,
          columnList: item.list
        }
        groups.push(obj)
        return obj
      })

      const params = {
        columns: groups,
        viewId: this.viewConfig.viewId
      }
      console.log(params, 'params')
      const updateResult = await updateView(params).catch((error) => { throw new Error(error) })
      if (updateResult.data.code && updateResult.data.code == 200) {
        this.$antmessage.success(updateResult.data.msg)
        this.showColumnsVisable = false
        // 更换column
        this.$emit('switchColumn', this.columns)
        this.$emit('change', this.columns)
      } else {
        this.$antmessage.error(updateResult.data.msg)
      }
    }

  }
}

</script>

<style lang="scss" scoped>
.modalContent {
  width: 100%;
  height: auto;
  border: 1px solid #f0f0f0;
  display: flex;
}
.rightContent ::-webkit-scrollbar-thumb:hover,
.leftContent::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.2);
  // background-color:rgba(0,0,0,.06);
  -webkit-box-shadow: inset -2px 0 0 #fff, inset 1px 0 0 hsla(0, 0%, 100%, 0.9),
    inset 0 -1px 0 hsla(0, 0%, 100%, 0.9), inset 0 1px 0 hsla(0, 0%, 100%, 0.9);
}
// 滚动条
.rightContent::-webkit-scrollbar,
.leftContent::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 8px;
}

.rightContent::-webkit-scrollbar-thumb,
.leftContent::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 8px;
  height: 20px;
  -webkit-box-shadow: inset -2px 0 0 #fff, inset 1px 0 0 #fff,
    inset 0 -1px 0 hsla(0, 0%, 100%, 0.9), inset 0 1px 0 hsla(0, 0%, 100%, 0.9);
  background-color: rgba(0, 0, 0, 0.1);
}
.rightContent::-webkit-scrollbar-track,
.leftContent::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  border-radius: 8px;
  -webkit-box-shadow: inset -2px 0 0 #fff, inset 1px 0 0 hsla(0, 0%, 100%, 0.9),
    inset 0 -1px 0 hsla(0, 0%, 100%, 0.9), inset 0 1px 0 hsla(0, 0%, 100%, 0.9);
  background-color: rgba(15, 15, 15, 0.09);
}
.leftContent {
  width: 75%;
  height: 550px;
  overflow-y: auto;
  border-right: 1px solid #f0f0f0;
}

.rightContent {
  height: 550px;
  overflow-y: auto;
  width: 30%;
}

.checkGroup {
  width: 100%;
  padding: 1% 2%;
  display: flex;
  flex-wrap: wrap;
}

.phover {
  width: 100%;
  height: 30px;
  line-height: 30px;
  display: flex;
  justify-content: space-between;
}

.phover:hover {
  background: #eaf2ff;
}

.left_title {
  color: #666;
  padding-left: 2%;
  margin-bottom: 0px;
  margin-top: 10px;
}

.blue {
  color: #00508f;
}
.blockClass{
  width: 40px;
  height: 32px;
  border-radius: 4px;
  background: #F3F4F5;
  display: inline-block;
  line-height: 32px;
  text-align: center;
  margin-left:12px;
  &:hover{
    background: #E6F2FF;

  }
}
</style>
