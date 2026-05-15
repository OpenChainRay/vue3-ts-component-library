<template>
  <div>
    <div class="main">
      <div v-if="currentViewType === viewType.system.value"
        style="display: flex;justify-content: flex-end;padding: 0 15px 15px 0;">
        <a-button type="primary" @click="openNewView">新增</a-button>
      </div>
      <!-- 表格添加ref和自定义行属性用于拖拽 -->
      <a-table :key="tableKey" :columns="tableColumns" :loading="loading" ref='table' :data-source="ViewPageList"
        :pagination="false" :scroll="{ y: 320 }" :customRow="(record, index) => ({
          'data-index': index,
          class: 'draggable-row'  // 添加拖拽手柄类名
        })">
        <span slot="action" slot-scope="text, record">
          <a @click="showInfo(record, VIEW_CHANGE_TYPE.edit.value)" :disabled='isEditFun(record)'
            style='margin-right: 14px;'><a-icon type="form" /></a>
          <a @click="deleteItem(record)" :disabled="isCurrentViewId(record) || isDeleteFun(record)"
            style='margin-right: 14px;'><a-icon type="delete" /></a>
          <a @click="showInfo(record, VIEW_CHANGE_TYPE.saveAs.value)" style='margin-right: 14px;'><a-icon
              type="snippets" /></a>

        </span>
        <span slot="switch" slot-scope="text, record,index">
          <a-switch v-if="switchStatus[index]" v-model="switchStatus[index].status"
            :disabled="switchStatus[index].disable" :loading="switchStatus[index].load"
            @click="(checked, e) => onStatusChange(checked, e, record, index)" />
        </span>
        <span slot="show" slot-scope="text, record">
          <a-checkbox @change="handleChange($event, record)" :checked="record.show == 1">
            <!-- Checkbox -->
          </a-checkbox>
        </span>
        <span slot="radio" slot-scope="text, record">
          <a-radio :checked="isCurrentViewId(record)" :disabled='record.disable' @change='onChange1(record)'></a-radio>
        </span>
        <span slot="viewTypeSolt" slot-scope="text, record">
          <span>{{ record.viewTypeName }}</span>
        </span>
      </a-table>
    </div>
    <a-modal class="editModel" :title="judge === VIEW_CHANGE_TYPE.edit.value ? '编辑视图' : '另存为视图'"
      :visible="openNewViewVisable" cancel-text="取消" ok-text="确认" :footer='null' :destroy-on-close="true"
      :mask-closable="false" @ok="handleNewViewOk" @cancel="handleNewViewCancel" width="70%">
      <div class="vheight">
        <edit-view ref="editView" :judge='judge' :tableCode='currentTableCode' :columnMap="columnMap"
          :viewId='detailid.viewId' :columns="columns" :currentViewType="currentViewType"
          :viewTypeDisabled="viewTypeDisabled" @handleNewViewCancel='handleNewViewCancel'
          @handleNewViewOk='handleNewViewOk' />
      </div>
    </a-modal>
    <a-modal class="addModel" title="新建视图" :visible="addVisable" :footer='null' :destroy-on-close="true"
      :mask-closable="false" ok-text="确认" @ok="handleNewViewOk" cancel-text="取消" @cancel="handleNewViewCancel"
      width="70%">
      <div class="vheight">
        <edit-view ref="newView" :columnMap="columnMap" :viewId='detailid.viewId' :judge="VIEW_CHANGE_TYPE.add.value"
          :tableCode='currentTableCode' :columns="columns" :currentViewType="currentViewType"
          :viewTypeDisabled="viewTypeDisabled" @handleNewViewCancel='handleNewViewCancel'
          @handleNewViewOk='handleNewViewOk' />
      </div>
    </a-modal>
  </div>
</template>

<script>
import editView from './edit-view.vue'
import { getViewList, changeCurrentView, deleteUserView, disable, enable, getOptionList, deletePreviewView } from '../../sevrices/configurationView'
import { configurationViewPage } from './utils/tableContent'
import debounce from 'lodash/debounce'
import { VIEW_CHANGE_TYPE, viewType } from '../../Constant/constant'
import { getTableCode } from '../getTableCode'
import Sortable from 'sortablejs' // 引入拖拽库

export default {
  name: 'AntConfigurationView',
  props: {
    viewId: {},
    tableCode: {},
    columnMap: {},
    allColumn: {},
    columns: {},
    // 当前视图类型
    currentViewType: {},
    // 是否禁用视图类型  默认false
    viewTypeDisabled: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      configData: {},
      viewType,
      VIEW_CHANGE_TYPE,
      loading: false,
      ViewPageList: [],
      switchStatus: [],
      openNewViewVisable: false,
      detailid: {},
      isShowMin: false,
      judge: 0, // 1编辑，2另存为
      currentViewId: 0,
      addVisable: false,
      currentTableCode: '',
      sortableInstance: null, // 拖拽实例
      originalData: [], // 拖拽前的数据快照，用于还原
      sourceViewType: null, // 拖拽源的viewType
      tableKey: 1 // 用于强制刷新表格的key
    }
  },
  computed: {
    tableColumns () {
      //
      const index = configurationViewPage.findIndex((item) => item.title == '是否平铺视图')
      if (this.configData.scmShow == 1 && index == -1) {
        // 新列配置
        const newColumn = {
          title: '是否平铺视图',
          scopedSlots: { customRender: 'show' },
          align: 'center',
          search: false
        }
        // 计算插入位置：倒数第二个 = 数组长度 - 1（因为最后一个元素索引是 length-1，插入到它前面）
        const insertIndex = configurationViewPage.length - 1
        // 使用 splice 插入到指定位置（不会删除原有元素）
        configurationViewPage.splice(insertIndex, 0, newColumn)
      } else if (this.configData.scmShow != 1 && index != -1) {
        // 不符合条件且列存在时，移除该列
        configurationViewPage.splice(index, 1) // 从index位置删除1个元素
      }
      // 系统视图不需要设置默认视图，因此移除“当前视图”列
      if (this.currentViewType === viewType.system.value) {
        return configurationViewPage.slice(1)
      } else {
        return configurationViewPage
      }
    }
  },
  components: {
    editView
  },
  mounted () {
    this.currentTableCode = getTableCode(this)
    this.getViewList().then(() => {
      // 数据加载完成后初始化拖拽
      this.initDrag()
    })
  },
  methods: {
    handleChange (event, record) {
      // console.log(event, record)
      record.show = event.target.checked ? 1 : 0 // 根据选中状态更新 show
    },
    initDrag () {
      // 先销毁旧实例
      if (this.sortableInstance) {
        this.sortableInstance.destroy()
        this.sortableInstance = null
      }

      this.$nextTick(() => {
        const tableEl = this.$refs.table?.$el
        if (!tableEl) return

        const tableBody = tableEl.querySelector('.ant-table-body tbody') || tableEl.querySelector('tbody')
        if (!tableBody) return

        this.sortableInstance = new Sortable(tableBody, {
          animation: 150,
          handle: '.draggable-row',
          ghostClass: 'sortable-ghost',
          delay: 0,
          forceFallback: true,

          onStart: (evt) => {
            this.originalData = JSON.parse(JSON.stringify(this.ViewPageList)) // 深拷贝确保原始数据不被污染
            const sourceRow = this.originalData[evt.oldIndex]
            this.sourceViewType = sourceRow?.viewType
          },

          onEnd: (evt) => {
            const { oldIndex, newIndex } = evt
            if (oldIndex === newIndex) return

            const targetRow = this.originalData[newIndex]
            if (targetRow?.viewType !== this.sourceViewType) {
              this.$antmessage.warning('非同类型视图不能拖拽！')
              // 2. 还原数据 + 强制表格刷新
              this.ViewPageList = JSON.parse(JSON.stringify(this.originalData))
              this.dataFingerprint++ // 数据变化，更新指纹
              this.tableKey = this.dataFingerprint // 同步更新表格key，触发重建
              this.$nextTick(() => this.initDrag()) // 延迟初始化拖拽（等待新表格渲染）
              return
            }

            // 3. 正常排序：新数组替换 + 刷新表格
            const newData = JSON.parse(JSON.stringify(this.originalData))
            const [movedItem] = newData.splice(oldIndex, 1)
            newData.splice(newIndex, 0, movedItem)
            this.ViewPageList = newData // 新数组替换，触发响应式
            console.log(this.ViewPageList, 'ViewPageList')
            this.dataFingerprint++
            this.tableKey = this.dataFingerprint // 强制表格重建
            this.$nextTick(() => this.initDrag())
          }
        })
      })
    },

    openNewView () {
      this.addVisable = true
    },

    // 检测是否可编辑   默认视图 | 系统视图不允许编辑
    isEditFun (record) {
      return record.viewType === viewType.default.value || record.viewType === viewType.system.value
    },
    // 检测是否可删除   默认视图 |
    isDeleteFun (record) {
      return record.viewType === viewType.default.value || record.viewType === viewType.system.value
    },
    // 检测当前项是否是当前视图  true 是 false 不是
    isCurrentViewId (record) {
      return record.viewId === this.currentViewId
    },

    showInfo (record, i) {
      this.detailid = record
      this.judge = i
      this.openNewViewVisable = true
    },

    handleNewViewOk () {
      this.openNewViewVisable = false
      this.addVisable = false
      this.getViewList().then(() => {
        this.initDrag() // 数据更新后重新初始化拖拽
      })
    },

    handleNewViewCancel () {
      this.openNewViewVisable = false
      this.addVisable = false
      this.getViewList().then(() => {
        this.initDrag() // 数据更新后重新初始化拖拽
      })
    },

    onStatusChange: debounce(async function (checked, e, record, index) {
      this.switchStatus[index].load = true
      const url = checked ? enable : disable
      try {
        const { data } = await url(record.viewId)
        if (data.code && data.code === 200) {
          this.switchStatus[index].load = false
          this.$antmessage.success(data.msg)
          this.getViewList().then(() => {
            this.initDrag() // 数据更新后重新初始化拖拽
          })
        } else {
          this.$antmessage.error(data.msg)
          this.switchStatus[index].status = !this.switchStatus[index].status
          this.switchStatus[index].load = false
        }
      } catch (error) {
        console.error('状态切换失败:', error)
        this.switchStatus[index].status = !this.switchStatus[index].status
        this.switchStatus[index].load = false
        this.$antmessage.error('操作失败，请重试')
      }
    }, 500),

    async getViewList () {
      this.loading = true
      // 检测是否是系统视图   调系统视图列表
      const requestUrl = this.currentViewType === viewType.system.value ? getOptionList : getViewList
      try {
        const result = await requestUrl(this.currentTableCode)
        this.loading = false

        if (result.data.code && result.data.code === 200) {
          const data = result.data.data
          this.configData = data
          let viewList = []
          if (this.currentViewType !== viewType.system.value) {
            this.currentViewId = data.currentView.viewId
            viewList = this.filterViewList(data.viewList)
          } else {
            viewList = data
          }

          if (viewList.length > 0) {
            const status = []
            viewList.forEach((item) => {
              switch (item.viewType) {
                case 0:
                  item.viewTypeName = viewType.default.title
                  break
                case 1:
                  item.viewTypeName = viewType.system.title
                  break
                case 2:
                  item.viewTypeName = viewType.personal.title
                  break
                case 3:
                  item.viewTypeName = viewType.share.title
              }
              item.value1 = true
              status.push({
                load: false,
                status: item.viewEnabled === 1,
                disable: item.viewType !== viewType.personal.value || this.isCurrentViewId(item)
              })
            })
            // 关键：用新数组替换，而非修改原数组
            this.ViewPageList = [...viewList] // 确保用新数组引用
            this.switchStatus = [...status]
          } else {
            this.ViewPageList = []
            this.switchStatus = []
          }
          return Promise.resolve()
        } else {
          this.$antmessage.error(result.data.msg)
          // 修复：使用 Error 对象进行 reject
          return Promise.reject(new Error(result.data.msg))
        }
      } catch (error) {
        console.error('获取视图列表失败:', error)
        this.loading = false
        this.$antmessage.error('获取数据失败，请重试')
        // 修复：确保 reject 的是 Error 对象
        return Promise.reject(error instanceof Error ? error : new Error(error))
      }
    },

    filterViewList (viewList) {
      const list = []
      viewList.forEach(item => {
        item.viewOptionList.forEach(element => {
          list.push(element)
        })
      })
      return list
    },

    async onChange1 (e) {
      try {
        const result = await changeCurrentView(e.viewId)
        if (result.data.code && result.data.code === 200) {
          this.$antmessage.success(result.data.msg)
          this.getViewList().then(() => {
            this.initDrag() // 数据更新后重新初始化拖拽
          })
        } else {
          this.$antmessage.error(result.data.msg)
        }
      } catch (error) {
        console.error('切换视图失败:', error)
        this.$antmessage.error('操作失败，请重试')
      }
    },

    deleteItem (record) {
      if (record.viewType === viewType.default.value) {
        this.$antmessage.error('默认视图不能删除')
        return
      }
      this.$antconfirm({
        title: '提示',
        content: '确认删除视图?',
        centered: true,
        onOk: async () => {
          const requestUrl = this.currentViewType === viewType.system.value ? deletePreviewView : deleteUserView
          try {
            const result = await requestUrl(record.viewId)
            if (result.data.code && result.data.code === 200) {
              this.$antmessage.success(result.data.msg)
              this.getViewList().then(() => {
                this.initDrag() // 数据更新后重新初始化拖拽
              })
            } else {
              this.$antmessage.error(result.data.msg)
            }
          } catch (error) {
            console.error('删除视图失败:', error)
            this.$antmessage.error('操作失败，请重试')
          }
        },
        onCancel () { }
      })
    }
  },
  beforeDestroy () {
    // 组件销毁时清理拖拽实例
    if (this.sortableInstance) {
      this.sortableInstance.destroy()
    }
  }
}
</script>

<style lang="less" scoped>
.editModel :deep(.ant-modal ){
  margin-top: -70px !important;
}

.vheight {
  max-height: 730px;
  overflow-y: auto;
}

.vheight::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: inset -2px 0 0 #fff, inset 1px 0 0 hsla(0, 0%, 100%, 0.9),
    inset 0 -1px 0 hsla(0, 0%, 100%, 0.9), inset 0 1px 0 hsla(0, 0%, 100%, 0.9);
}

.vheight::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.vheight::-webkit-scrollbar-thumb {
  border-radius: 8px;
  height: 20px;
  -webkit-box-shadow: inset -2px 0 0 #fff, inset 1px 0 0 #fff,
    inset 0 -1px 0 hsla(0, 0%, 100%, 0.9), inset 0 1px 0 hsla(0, 0%, 100%, 0.9);
  background-color: rgba(0, 0, 0, 0.1);
}

.vheight::-webkit-scrollbar-track {
  border-radius: 8px;
  -webkit-box-shadow: inset -2px 0 0 #fff, inset 1px 0 0 hsla(0, 0%, 100%, 0.9),
    inset 0 -1px 0 hsla(0, 0%, 100%, 0.9), inset 0 1px 0 hsla(0, 0%, 100%, 0.9);
  background-color: rgba(15, 15, 15, 0.09);
}

/* 拖拽占位样式 */
:deep(.sortable-ghost ){
  background-color: #f5f5f5 !important;
  opacity: 0.6;
  border: 1px dashed #ccc;
}
</style>
