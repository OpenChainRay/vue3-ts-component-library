<template>
  <div>
    <div class="relativeClass">
      <div class='flex selectAndOr' v-if='searchListLength>1'>
        <div class="line-operate"></div>
        <a-select class='selectClass' v-model:value="currentRelationType" @change="relationTypeChange" :disabled="disabled">
          <a-select-option v-for="(item, index) in operaterList" :key="index" :value="item.value">
            {{ item.label }}
          </a-select-option>
        </a-select>
      </div>
      <!-- 占位元素 ------------------ -->
      <div v-if="searchListLength === 1" style="width: 64px;"></div>
      <!-- -------------- -->
      <div class='flex  column treeBox' :class="searchListLength>1?'flexRight':''">
        <div v-for="(item, index) in searchList" :key='item.uuid' :class="item.deleteFlag === false ? 'searchLi':''">
          <!-- 1 groupType 条件 -->
          <div v-if="item.groupType === 1">
            <div v-for="(items,i) in item.filters" :key='items.uuid'>
              <group ref="group" :groupData="items" :index="index" :filterIndex="i" :columnMap="columnMap" :tableCode="currentTableCode"
                :selectColumnList="selectColumnList" :cacheColumnList="cacheColumnList" :columnOperatorList="columnOperatorList" :columns="columns"
                @handleSearch="handleSearch" @addItem="addItem" @delItem="delItem" :disabled="disabled"></group>
            </div>
          </div>
          <!-- 2 groupType 条件组 -->
          <div v-if="item.groupType === 2 && filtersLength(item.filters)">
            <div class="relativeClass setConditions">
              <div v-if="disabled === false" class="delItemClass">
                <a-icon class="del-item-icon" type="close-circle" @click="delItem(item,index)" />
              </div>
              <div class='flex selectAndOr' v-if='filtersLength(item.filters)>1' style="padding-left: 10px;">
                <div class="line-operate"></div>
                <a-select class='selectClass' v-model:value="item.relationType" :disabled="disabled">
                  <a-select-option v-for="(item, index) in operaterList" :key="index" :value="item.value">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </div>
              <div style="margin-left: 2%;" class='flex  column treeBox' :class="filtersLength(item.filters)>1?'flexRight':''">
                <div v-for="(items,i) in item.filters" :key='items.uuid'>
                  <group ref="group" :groupData="items" :index="index" :filterIndex="i" :columnMap="columnMap" :tableCode="currentTableCode"
                    :selectColumnList="selectColumnList" :cacheColumnList="cacheColumnList" :columnOperatorList="columnOperatorList" :columns="columns"
                    @handleSearch="handleSearch" @addItem="addItem" @delItem="delItem" :disabled="disabled"></group>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import group from './group.vue'
import { ColumnType } from '../../Constant/constant'
import { getTableCode } from '../getTableCode'
export default {
  name: 'ant-view-tree',
  props: {
    // 关联关系
    relationType: {
      type: Number,
      default: 0
    },
    // 条件
    searchList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 第一列 下拉列表
    selectColumnList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 初始化表头数据
    cacheColumnList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 操作符集合
    columnOperatorList: {
      type: Array,
      default: () => {
        return []
      }
    },

    tableCode: {
      type: String,
      default: ''
    },
    // 自定义请求
    columnMap: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 表头
    columns: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    relationType (val) {
      // console.log(val)
      this.currentRelationType = val
    },
    tableCode () {
      // console.log(this.currentTableCode, this.tableCode, 'currentTableCode')
      this.currentTableCode = getTableCode(this)
    }
  },
  data () {
    return {
      ColumnType,
      currentRelationType: 0,
      operaterList: [
        { label: 'AND', value: 0 },
        { label: 'OR', value: 1 }
      ],
      currentTableCode: ''
    }
  },
  computed: {
    searchListLength () {
      const arr = this.searchList.filter((item) => item.deleteFlag === false)
      return arr.length
    }
  },
  components: {
    group
  },
  created () {
    // console.log(this.cacheColumnList, 'cacheColumnList')
    this.currentRelationType = this.relationType
  },
  mounted () {
    console.log(this.currentTableCode, this.tableCode, 'currentTableCode')
    this.currentTableCode = getTableCode(this)
  },
  methods: {
    filtersLength (filters) {
      const arr = filters.filter((item) => item.deleteFlag === false)
      return arr.length
    },
    handleSearch (value, item) {
      console.log(value, item, ' value, item')
      this.$emit('handleSearch', value, item)
    },
    // 添加 视图条件
    addItem (item, index, filterIndex) {
      // console.log(item, index, filterIndex)
      // 1 条件添加  2 条件组添加
      if (item.groupType === 1) {
        this.$emit('addItem', index)
      } else if (item.groupType === 2) {
        this.$emit('addItem', index, filterIndex)
      }
    },
    // 删除 视图条件
    delItem (item, index, filterIndex) {
      // console.log(item, index, filterIndex)
      // this.$emit('delItem', item, index)
      // 1 条件删除  2 条件组删除
      if (item.groupType === 1) {
        this.$emit('delItem', item, index)
      } else if (item.groupType === 2) {
        // 如果是数字是删除单个 不是数字就是整个条件组删除
        if (typeof filterIndex === 'number') {
          this.$emit('delItem', item, index, filterIndex)
        } else {
          this.$emit('delItem', item, index)
        }
      }
    },
    //  groupType组类型: 1 -> 条件；2 -> 条件组
    updateColumn (item) {
      // const index = group.findIndex((items) => items.item.uuid === item.uuid)
      if (item.filters.length) {
        item.filters.forEach(element => {
          const index = this.getIndex(element)
          // console.log(index)
          if (index !== -1) {
            this.getGroupRefs()[index].updateColumn(element.column, element.operator, this.currentTableCode, element.value)
          }
        })
      }
    },
    /** v-for ref 在 Vue3 多为数组，单条件时也可能为单实例 */
    getGroupRefs () {
      const r = this.$refs.group
      if (!r) return []
      return Array.isArray(r) ? r : [r]
    },
    checkValue (filter) {
      const index = this.getIndex(filter)
      if (index !== -1) {
        // console.log(index, this.$refs.group)
        return this.getGroupRefs()[index].checkValue(filter)
      }
    },
    getValue (filter) {
      const index = this.getIndex(filter)
      if (index !== -1) {
        return this.getGroupRefs()[index].getValue(filter)
      }
    },
    getIndex (item) {
      const group = this.getGroupRefs()
      const index = group.findIndex((items) => items.item.uuid === item.uuid)
      return index
    },
    relationTypeChange (val) {
      const v = typeof val === 'object' && val && 'target' in val ? val.target.value : val
      this.$emit('update:relationType', v)
    }
  }

}
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  margin-bottom: 10px;
}
.relativeClass {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
}
.setConditions {
  border: 1px dashed #ccd3db;
  padding: 10px 15px 0 0px;
  margin-bottom: 10px;
}
.delItemClass {
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(30%, -50%);
}
.selectAndOr {
  position: relative;
  width: 64px;
  height: 100%;
  align-items: center;
}
.treeBox {
  width: calc(100% - 104px);
  height: 100%;
  margin-bottom: 0;
}
.flexRight {
  margin-left: 1%;
  margin-bottom: 0px;
}
.searchLi {
  margin-bottom: 2px;
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
  // height:calc(100% - 48px);
  height: calc(100% - 36px);
  left: 20px;
}
.between {
  justify-content: space-between;
}

.column {
  flex-direction: column;
}
.del-item-icon {
  display: flex;
  align-items: center;
  margin-left: 5px;
}
</style>
