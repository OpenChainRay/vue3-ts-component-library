<template>
  <div>
    <div class="main">
      <div v-if="currentViewType === viewType.system.value"
        style="display: flex;justify-content: flex-end;padding: 0 15px 15px 0;">
        <a-button type="primary" @click="openNewView">新增</a-button>
      </div>
      <!-- 表格添加ref和自定义行属性用于拖拽 -->
      <a-table
        ref="table"
        row-key="viewId"
        :columns="resolvedTableColumns"
        :loading="loading"
        :data-source="ViewPageList"
        :pagination="false"
        :scroll="{ y: 320 }"
        :custom-row="customTableRow">
        <template #currentView="{ record }">
          <a-checkbox
            :checked="isCurrentViewId(record)"
            :disabled="!!record.disable"
            @change="(e) => onCurrentViewCheck(e, record)" />
        </template>
        <template #viewTypeSolt="{ record }">
          <span>{{ record.viewTypeName }}</span>
        </template>
        <template #action="{ record }">
          <span class="view-action-icons">
            <a-tooltip title="编辑">
              <a-button
                type="text"
                size="small"
                class="view-action-btn"
                :disabled="isEditFun(record)"
                @click="showInfo(record, VIEW_CHANGE_TYPE.edit.value)">
                <FormOutlined />
              </a-button>
            </a-tooltip>
            <a-tooltip title="删除">
              <a-button
                type="text"
                size="small"
                class="view-action-btn view-action-btn-danger"
                :disabled="isCurrentViewId(record) || isDeleteFun(record)"
                @click="deleteItem(record)">
                <DeleteOutlined />
              </a-button>
            </a-tooltip>
            <a-tooltip title="复制">
              <a-button
                type="text"
                size="small"
                class="view-action-btn"
                @click="showInfo(record, VIEW_CHANGE_TYPE.saveAs.value)">
                <CopyOutlined />
              </a-button>
            </a-tooltip>
          </span>
        </template>
        <template #show="{ record }">
          <a-checkbox :checked="record.show == 1" @change="(e) => handleChange(e, record)" />
        </template>
        <template #switch="{ record, index }">
          <a-switch
            v-if="switchStatus[index]"
            v-model:checked="switchStatus[index].status"
            :disabled="switchStatus[index].disable"
            :loading="switchStatus[index].load"
            @change="(checked) => onStatusChange(checked, null, record, index)" />
        </template>
      </a-table>
    </div>
    <a-modal class="editModel ant-view-modal-align-top" wrap-class-name="ant-view-modal-align-top"
      :title="judge === VIEW_CHANGE_TYPE.edit.value ? '编辑视图' : '另存为视图'"
      :visible="openNewViewVisable" cancel-text="取消" ok-text="确认" :footer='null' :destroy-on-close="true"
      :centered="false"
      :mask-closable="false" @ok="handleNewViewOk" @cancel="handleNewViewCancel" width="70%">
      <div class="vheight">
        <edit-view ref="editView" :judge='judge' :tableCode='currentTableCode' :columnMap="columnMap"
          :viewId='detailid.viewId' :columns="columns" :currentViewType="currentViewType"
          :viewTypeDisabled="viewTypeDisabled" :current-view-page-info="currentViewPageInfo"
          @handleNewViewCancel='handleNewViewCancel'
          @handleNewViewOk='handleNewViewOk' />
      </div>
    </a-modal>
    <a-modal class="addModel ant-view-modal-align-top" wrap-class-name="ant-view-modal-align-top" title="新建视图"
      :visible="addVisable" :footer='null' :destroy-on-close="true" :centered="false"
      :mask-closable="false" ok-text="确认" @ok="handleNewViewOk" cancel-text="取消" @cancel="handleNewViewCancel"
      width="70%">
      <div class="vheight">
        <edit-view ref="newView" :columnMap="columnMap" :viewId='detailid.viewId' :judge="VIEW_CHANGE_TYPE.add.value"
          :tableCode='currentTableCode' :columns="columns" :currentViewType="currentViewType"
          :viewTypeDisabled="viewTypeDisabled" :current-view-page-info="currentViewPageInfo"
          @handleNewViewCancel='handleNewViewCancel'
          @handleNewViewOk='handleNewViewOk' />
      </div>
    </a-modal>
  </div>
</template>

<style>
.ant-view-modal-align-top.ant-modal-wrap {
  display: flex !important;
  align-items: flex-start !important;
  justify-content: center;
  padding: 27px 16px 32px;
  box-sizing: border-box;
}
.ant-view-modal-align-top.ant-modal-wrap .ant-modal {
  top: 0 !important;
  margin: 0 auto 16px !important;
  max-height: calc(100vh - 48px);
}
.ant-view-modal-align-top.ant-modal-wrap .ant-modal-content {
  max-height: calc(100vh - 56px);
  overflow: auto;
}
</style>

<script>
import editView from './edit-view.vue'
import { getViewList, changeCurrentView, deleteUserView, disable, enable, getOptionList, deletePreviewView } from '../../sevrices/configurationView'
import { configurationViewPage } from './utils/tableContent'
import debounce from 'lodash/debounce'
import { VIEW_CHANGE_TYPE, viewType } from '../../Constant/constant'
import { getTableCode } from '../getTableCode'
import Sortable from 'sortablejs' // 引入拖拽库
import { CopyOutlined, DeleteOutlined, FormOutlined } from '@ant-design/icons-vue'

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
    },
    /** 当前列表生效视图分页，新建视图时带入 */
    currentViewPageInfo: {
      type: Object,
      default: null
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
      sortableInstance: null,
      dragSnapshot: []
    }
  },
  computed: {
    /** 解析表头，兼容 Vue3 ant-design-vue Table */
    resolvedTableColumns () {
      const cols = configurationViewPage.map((col) => {
        const item = { ...col }
        delete item.scopedSlots
        delete item.search
        return item
      })
      const showIndex = cols.findIndex((item) => item.key === 'show')
      if (this.configData.scmShow == 1 && showIndex === -1) {
        const insertIndex = cols.length - 1
        cols.splice(insertIndex, 0, {
          title: '是否平铺视图',
          key: 'show',
          align: 'center',
          width: 110,
          slots: { customRender: 'show' }
        })
      } else if (this.configData.scmShow != 1 && showIndex !== -1) {
        cols.splice(showIndex, 1)
      }
      if (this.currentViewType === viewType.system.value) {
        return cols.filter((item) => item.key !== 'currentView')
      }
      return cols
    }
  },
  components: {
    editView,
    FormOutlined,
    DeleteOutlined,
    CopyOutlined
  },
  mounted () {
    this.currentTableCode = getTableCode(this)
    this.getViewList().then(() => {
      // 数据加载完成后初始化拖拽
      this.initDrag()
    })
  },
  methods: {
    /** 行属性：绑定拖拽索引 */
    /** 行拖拽：整行可拖，不单独占排序列 */
    customTableRow (_record, index) {
      return {
        'data-drag-index': String(index),
        class: 'view-config-draggable-row'
      }
    },
    handleChange (event, record) {
      record.show = event.target.checked ? 1 : 0
    },
    /** 当前视图复选（单选语义） */
    onCurrentViewCheck (event, record) {
      if (event.target.checked) {
        this.onChange1(record)
      }
    },
    /** 同步拖拽后的开关状态数组顺序 */
    reorderSwitchStatus (oldIndex, newIndex) {
      const next = [...this.switchStatus]
      const [moved] = next.splice(oldIndex, 1)
      next.splice(newIndex, 0, moved)
      this.switchStatus = next
    },
    initDrag () {
      if (this.sortableInstance) {
        this.sortableInstance.destroy()
        this.sortableInstance = null
      }

      this.$nextTick(() => {
        const tableEl = this.$refs.table?.$el
        if (!tableEl) return

        const tableBody = tableEl.querySelector('.ant-table-tbody') || tableEl.querySelector('tbody')
        if (!tableBody) return

        this.sortableInstance = Sortable.create(tableBody, {
          animation: 150,
          ghostClass: 'sortable-ghost',
          draggable: 'tr.ant-table-row',

          onStart: () => {
            this.dragSnapshot = this.ViewPageList.map((item) => ({ ...item }))
          },

          onMove: (evt) => {
            const from = Number(evt.dragged.dataset.dragIndex)
            const to = Number(evt.related.dataset.dragIndex)
            if (Number.isNaN(from) || Number.isNaN(to)) return true
            return this.dragSnapshot[from]?.viewType === this.dragSnapshot[to]?.viewType
          },

          onEnd: (evt) => {
            const { oldIndex, newIndex } = evt
            if (oldIndex === newIndex || oldIndex == null || newIndex == null) return

            const source = this.dragSnapshot[oldIndex]
            const target = this.dragSnapshot[newIndex]
            if (!source || !target || source.viewType !== target.viewType) {
              this.$antmessage.warning('非同类型视图不能拖拽！')
              this.ViewPageList = [...this.dragSnapshot]
              this.$nextTick(() => this.initDrag())
              return
            }

            const list = [...this.ViewPageList]
            const [moved] = list.splice(oldIndex, 1)
            list.splice(newIndex, 0, moved)
            this.ViewPageList = list
            this.reorderSwitchStatus(oldIndex, newIndex)
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
      return record.viewId == this.currentViewId
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
  beforeUnmount () {
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
:deep(.sortable-ghost) {
  background-color: #f5f5f5 !important;
  opacity: 0.6;
  border: 1px dashed #ccc;
}

:deep(.view-config-draggable-row) {
  cursor: move;
}

.view-action-icons {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.view-action-btn {
  color: #3874ff;
}

.view-action-btn-danger:not(:disabled) {
  color: #ff4d4f;
}
</style>
