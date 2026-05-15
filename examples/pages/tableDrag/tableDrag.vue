<template>
    <a-card :bordered="false">
      <div ref="Scheduling">
        <a-table ref="table" :columns="columns" :data-source="tableData">
          <a slot="name" slot-scope="text">{{ text }}</a>
        </a-table>
      </div>

    </a-card>
</template>
<script>

import { columns, tableData } from './utils/tableContent'
import Sortable from 'sortablejs'
export default {
  data () {
    return {
      tableData,
      columns
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.rowDrop()
    })
  },
  methods: {
    // 列拖拽
    rowDrop () {
      // const tbody = this.$refs.Scheduling.querySelectorAll('.ant-table-tbody') // 元素选择器名称根据实际内容替换
      const thead = document.querySelectorAll('.ant-table-thead')[0]
      const sortableHost = thead && thead.firstElementChild
      if (!(sortableHost instanceof HTMLElement)) {
        return
      }
      console.log(thead, sortableHost)
      const _this = this
      Sortable.create(sortableHost, {
        sort: true,
        // fallbackClass: true,
        animation: 150, // 动画
        disabled: false, // boolean 定义是否此sortable对象是否可用，为true时sortable对象不能拖放排序等功能，为false时为可以进行排序，相当于一个开关；
        // handle: '.dragSort', // 指定哪个类名的可以拖动
        // handle: '.ant-table-tbody', //使用这个类名则是整行任意位置都可以拖动
        // chosenClass: 'sortable-ghost',被选中项的css 类名
        // dragClass: 'sortable-drag',正在被拖拽中的css类名
        group: { name: 'name', pull: true, put: true },
        // 开始拖拽的时候
        onStart: function (/** Event */evt) {
          // element index within parent
          console.log(evt, '开始拖拽')
        },
        onEnd ({ newIndex, oldIndex }) {
          console.log(newIndex, '结束拖拽')
          // const currRow = _this.tableData.splice(oldIndex, 1)[0]
          // _this.tableData.splice(newIndex, 0, currRow)
          const currRow = _this.columns.splice(oldIndex, 1)[0]
          _this.columns.splice(newIndex, 0, currRow)
          // console.log(_this.columns, _this.tableData)
        }
      })
      // Sortable.create(tbody[0], {
      //   sort: true,
      //   // fallbackClass: true,
      //   animation: 150, // 动画
      //   // handle: '.dragSort', // 指定哪个类名的可以拖动
      //   // handle: '.ant-table-tbody', //使用这个类名则是整行任意位置都可以拖动
      //   // chosenClass: 'sortable-ghost',被选中项的css 类名
      //   // dragClass: 'sortable-drag',正在被拖拽中的css类名
      //   group: { name: 'name', pull: true, put: true },
      //   onEnd ({ newIndex, oldIndex }) {
      //     const currRow = _this.tableData.splice(oldIndex, 1)[0]
      //     _this.tableData.splice(newIndex, 0, currRow)
      //   }
      // })
    }
  }
}
</script>
