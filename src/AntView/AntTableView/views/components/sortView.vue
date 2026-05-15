<template>
  <div>
    <div v-if="viewSorter.length" class="relativeClass">
      <!-- -------------- index -->
      <div class='box' :class="searchListLength > 1 ? 'flexRight' : ''">
        <div v-for="(item, index) in viewSorter" :key='item.uuid' :class="item.deleteFlag === false ? 'searchLi' : ''">
          <div style="display: flex;align-items: center;margin-bottom: 10px;">
            <!-- 列表字段 -->
            <a-select showSearch @search="handleSearch($event, item)" @blur="handleblurs($event, item)"
              :filter-option="false" style="width: 23.2%;margin-right: 1%;" v-model="item.dataIndex"
              :disabled="disabled" placeholder="请选择字段">
              <a-spin v-if="item.fetching" slot="notFoundContent" size="small" />
              <a-select-option v-for="(item1, index1) in sortColumnList" :key="index1" :value="item1.code" :data="item1"
                :title="item1.columnTitle" :disabled="item1.disabled">
                {{ item1.columnTitle }}
              </a-select-option>
            </a-select>
            <div style="margin-right: 2%;">
              <a-select style="width: 150px;" showSearch :filter-option="false" v-model="item.value"
                :disabled="disabled" placeholder="请选择排序方式">
                <a-spin v-if="item.fetching" slot="notFoundContent" size="small" />
                <a-select-option v-for="(item1, index1) in sortTypeList" :key="index1" :value="item1.value"
                  :data="item1" :title="item1.lable">
                  {{ item1.lable }}
                </a-select-option>
              </a-select>
            </div>
            <div v-if="disabled === false" style="display: flex; align-items: center;">
              <a-icon @click="addSortItem(index)" class="add-item-icon" type="plus-circle" style="margin-right: 5px;" />
              <a-icon @click="delSortItem(item, index)" class="del-item-icon" type="close-circle" />
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import { getTableCode } from '../../getTableCode'
export default {
  name: 'sortView',
  props: {
    // 排序list
    viewSorter: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 第一列 下拉列表
    sortColumnList: {
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
    tableCode () {
      // console.log(this.currentTableCode, this.tableCode, 'currentTableCode')
      this.currentTableCode = getTableCode(this)
    }
  },
  data () {
    return {
      currentTableCode: '',
      sortTypeList: [
        {
          lable: '正序',
          value: 'true'
        },
        {
          lable: '倒序',
          value: 'false'
        }
      ]
    }
  },
  computed: {
    searchListLength () {
      const arr = this.viewSorter.filter((item) => item.deleteFlag === false)
      return arr.length
    }
  },
  components: {
  },
  created () {
    // console.log(this.cacheColumnList, 'cacheColumnList')
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
      this.$emit('handleSortSearch', value, item)
    },
    // 初始化一级下拉列表
    handleblurs (value, item) {
      this.$emit('handleSortSearch', '', item)
    },
    // 添加 排序
    addSortItem (index) {
      // console.log(item, index, filterIndex)
      // 1 条件添加  2 条件组添加
      this.$emit('addSortItem', index)
    },
    // 删除 排序
    delSortItem (item, index) {
      //   console.log(item, index)
      // 1 排序删除
      this.$emit('delSortItem', item, index)
    }
  }

}
</script>

<style lang="less" scoped>
.box {
  // display: flex;
  width: 100%;
  margin: 0 0 10px 0px;
}

.relativeClass {
  position: relative;
  padding: 0 0 0 64px;
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

.del-item-icon {
  display: flex;
  align-items: center;
  margin-left: 5px;
}
</style>
