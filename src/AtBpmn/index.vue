<template>
  <div class="hello">
    <div style="margin: 0 10px 30px;">审批处理一览:</div>
    <a-table :columns="bpmnColumns" :data-source="HistoryDataSource" :pagination="false" :scroll="{ y: 320 }" />
    <div ref="bpmn" class="bpmn-canvas"></div>
    <!-- <button type="success" size="small" @click="handleZoom(0.1)">放大</button>
    <button type="warning" size="small" @click="handleZoom(-0.1)">缩小</button> -->
    <!-- 菜单 -->
    <!-- <div v-show="menuShow" class="menuList" :style="{ left: menuX + 'px', top: menuY + 'px' }">
      <div class="menu-box">
        <div class="menu-li" v-for="item in menuCurrentList" :key="item.id" @click.stop="menuTap(item)">{{ item.name }}
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>

/**
 * @component AtBpmn
 * @description 使用 bpmn-js diagram-js 第三方插件 渲染xml文件 显示流程图  示例如下
 *  <at-bpmn :processInstanceInfo="processInstanceInfo" :history="history" :formId="$route.query.id" processName="at_srm_purchasecontract_v1"></at-bpmn>
 * @props { history } 必填   请求函数     获取表格list数据
 *        { processInstanceInfo }  必填   请求函数    获取xml | 待处理任务 | 已处理任务 | 线 ID
 *        { formId } 必填   流程图id    请求参数
 *        { processName } 必填   流程图 进程名称(与后端约定的名字)  请求参数
 */

import BpmnViewer from 'bpmn-js/lib/Viewer'
import MoveModule from 'diagram-js/lib/features/move'
import ModelingModule from 'bpmn-js/lib/features/modeling'
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas'
import { bpmnColumns } from './tableContent'

// import { processInstanceInfo, history } from './services.js'

export default {
  name: 'AtBpmn',
  props: {
    history: {
      required: true,
      type: Function
    },
    processInstanceInfo: {
      required: true,
      type: Function
    }
  },
  data () {
    return {
      HistoryDataSource: [],
      bpmnColumns,
      bpmnViewer: null,
      canvas: null,
      alive: true,
      scale: 1,
      menuShow: false,
      menuX: 0,
      menuY: 0,
      // 待处理任务ID列表
      activeTaskIdList: [],
      // 已处理任务列表
      finishTaskIdList: [],
      // 线条
      highLineIdList: [],
      menuList: [
        {
          list: [
            {
              id: 1,
              name: '菜单1'
            },
            {
              id: 2,
              name: '菜单2'
            },
            {
              id: 3,
              name: '菜单3'
            }
          ]
        },
        {
          list: [
            {
              id: 1,
              name: '菜单1'
            },
            {
              id: 2,
              name: '菜单2'
            },
            {
              id: 3,
              name: '菜单3'
            },
            {
              id: 4,
              name: '菜单4'
            },
            {
              id: 5,
              name: '菜单5'
            }
          ]
        }
      ],
      menuCurrentList: {}, // 当前要渲染的菜单
      colorList: ['#89CD74', '#F9CD84']
    }
  },
  mounted () {
    // console.log(this.$attrs)
    this.bpmnViewer = new BpmnViewer({
      container: this.$refs.bpmn,
      additionalModules: [
        MoveModule, // 可以调整元素
        ModelingModule, // 基础工具 MoveModule、SetColor 等依赖于此
        MoveCanvasModule, // 移动整个画布
        {
          paletteProvider: ['value', ''], // 禁用/清空左侧工具栏
          labelEditingProvider: ['value', ''], // 禁用节点编辑
          contextPadProvider: ['value', ''], // 禁用图形菜单
          bendpoints: ['value', {}], // 禁用连线拖动
          zoomScroll: ['value', ''], // 禁用滚动
          moveCanvas: ['value', ''], // 禁用拖动整个流程图
          move: ['value', ''] // 禁用单个图形拖动
        }
      ]
    })

    this.canvas = this.bpmnViewer.get('canvas')
    // bpmn点击事件  为了右键菜单所写  暂时不用
    // this.createEventBus()
    // 监听点击事件取消菜单
    window.addEventListener('click', this.windowClickFun)
    this.initFun()
  },
  activated () {
    this.alive = true
    this.$nextTick(() => {
      this.initFun()
      this.refreshDiagramView()
    })
  },
  deactivated () {
    this.alive = false
  },
  beforeUnmount () {
    this.alive = false
    window.removeEventListener('click', this.windowClickFun)
    if (this.bpmnViewer && typeof this.bpmnViewer.destroy === 'function') {
      this.bpmnViewer.destroy()
    }
    this.bpmnViewer = null
    this.canvas = null
  },
  /* eslint-disable */
  methods: {
    /**
     * 统一初始化流程图与历史数据。
     */
    initFun() {
      // 渲染xml
      this.createNewDiagram()
      // 审批历史记录
      this.initHistory()
    },
    /**
     * 检查流程图必要参数是否完整。
     */
    hasBpmnParams () {
      return !!(this.$attrs.formId && this.$attrs.processName)
    },
    /**
     * 兼容缓存恢复后的画布尺寸重算。
     */
    refreshDiagramView () {
      if (!this.canvas) {
        return
      }
      try {
        this.canvas.zoom('fit-viewport', 'auto')
      } catch (e) {}
    },
    /**
     * 校验请求函数合法性。
     */
    isRequestFn (fn) {
      return typeof fn === 'function'
    },
    async initHistory() {
      if (!this.hasBpmnParams() || !this.isRequestFn(this.history)) {
        return
      }
      const params = {
        formId: this.$attrs.formId,
        // formId: 100,
        processName: this.$attrs.processName //和后端约定的字符串 processName字段
      }
      const historyResult = await this.history(params).catch((error) => {
        console.error('init bpmn history failed:', error)
        return null
      })
      if (!historyResult || !historyResult.data) {
        this.HistoryDataSource = []
        return
      }
      if (!this.alive) {
        return
      }
      // console.log(historyResult, 'historyResult----')
      if (historyResult.data.code === 200) {
        this.HistoryDataSource = Array.isArray(historyResult.data.data) ? historyResult.data.data : []
      } else {
        this.HistoryDataSource = []
      }
    },
    // 初始化渲染xml
    async createNewDiagram() {
      if (!this.hasBpmnParams() || !this.isRequestFn(this.processInstanceInfo)) {
        return
      }
      const params = {
        formId: this.$attrs.formId,
        // formId: 100,
        processName: this.$attrs.processName //和后端约定的字符串 processName字段
      }
      const resultData = await this.processInstanceInfo(params).catch((error) => {
        console.error('init bpmn xml failed:', error)
        return null
      })
      if (!resultData || !resultData.data) {
        return
      }
      if (!this.alive || !this.bpmnViewer) {
        return
      }
      if (resultData.data.code === 200) {
        const payload = resultData?.data?.data || {}
        const rawXml = typeof payload.xml === 'string' ? payload.xml : ''
        const xmlStr = rawXml.replace(/\u00A0/g, ' ').trim()
        if (!xmlStr) {
          return
        }
        try {
          const result = await this.bpmnViewer.importXML(xmlStr)
          // console.log(result, 'result')
          if (result.warnings.length === 0) {
            // console.log('success!')
            this.canvas.zoom('fit-viewport', 'auto')
            // nodeCodes为需要设置高亮颜色的部分的id的集合（xml文件中<flowNodeRef>****</flowNodeRef>标签里的部分），这个数据也是从接口获取，这里从xml中随便取出几个测试用
            // 多人审核  数据处理 去除#后面字符
            const activeTaskIdList = Array.isArray(payload.activeTaskIdList) ? payload.activeTaskIdList : []
            const finishTaskIdList = Array.isArray(payload.finishTaskIdList) ? payload.finishTaskIdList : []
            this.stringFilterFun(activeTaskIdList)
            this.stringFilterFun(finishTaskIdList)
            console.log(payload)
            this.activeTaskIdList = activeTaskIdList
            this.finishTaskIdList = finishTaskIdList
            // this.highLineIdList = resultData.data.data.highLineIdList
            this.highLineIdList = Array.isArray(payload.highLineIdList) ? [...payload.highLineIdList] : []
            console.log(this.activeTaskIdList, this.finishTaskIdList, this.highLineIdList, 'activeTaskIdList, finishTaskIdList, highLineIdList')
            // 调用设置高亮颜色class方法,这里可以根据接口获取的id集合情况，对不同的部分设置不同的class名，然后在css中设置样式
            this.setNodeColor(this.activeTaskIdList, 'activeTaskIdList', this.canvas)
            this.setNodeColor(this.finishTaskIdList, 'finishTaskIdList', this.canvas)
            this.setNodeColor(this.highLineIdList, 'highLineIdList', this.canvas)
            this.refreshDiagramView()
          } else {
            console.log('something went wrong:', result)
          }
        } catch (err) {
          console.error('bpmn xml parse failed:', err)
          this.$message && this.$message.error && this.$message.error('流程图解析失败')
        }
      }
    },
    // 任务列表数据过滤
    stringFilterFun(taskList) {
      taskList.forEach((element, Index) => {
        if (element.includes('#')) {
          taskList[Index] = element.split('#')[0]
        }
      });
    },
    // 初始化注册xml事件
    createEventBus() {
      const eventBus = this.bpmnViewer.get('eventBus')
      // 注册节点事件，eventTypes中可以写多个事件 // ,'element.hover','element.out'
      const eventTypes = ['element.contextmenu']
      eventTypes.forEach((eventType) => {
        eventBus.on(eventType, (event) => {
          console.log(event, 'e')
          const { originalEvent, element } = event
          // 阻止浏览器默认事件
          originalEvent.preventDefault()
          // +12 是离鼠标x偏离些距离
          this.menuX = originalEvent.clientX + 12
          this.menuY = originalEvent.clientY
          console.log(this.menuX, this.menuY, this.nodeCodes, element)
          if (this.nodeCodes.includes(element.id)) {
            const index = this.nodeCodes.findIndex((k) => k === element.id)
            this.menuCurrentList = this.menuList[index].list
            this.menuShow = true
          } else {
            this.menuShow = false
          }
        })
      })
    },
    // 根据id添加class
    setNodeColor(nodeCodes, colorClass, canvas) {
      if (!Array.isArray(nodeCodes) || !canvas) {
        return
      }
      // console.log(nodeCodes,colorClass)
      for (let i = 0; i < nodeCodes.length; i++) {
        canvas.addMarker(nodeCodes[i], colorClass)
      }
      // console.log(document.querySelectorAll(`.${colorClass}`), '??')
      // 添加线条颜色
      const classList = document.querySelectorAll(`.${colorClass}`)
      classList.forEach((parentElement, index) => {
        // console.log( parentElement.childNodes[0].childNodes)
        const firstChild = parentElement && parentElement.childNodes && parentElement.childNodes[0]
        const element = firstChild && firstChild.childNodes
        if (element && element[0] && element[0].nodeName === 'path') {
          // console.log(element)
          element[0].style.stroke = '#2E81EA'
        }
      })
    },
    // 放大/缩小xml文件
    /* eslint-disable */
    handleZoom(flag) {
      console.log(flag, this.scale)
      // 放大缩小倍数flag可以自行设置
      if (flag < 0 && this.scale <= 0.8 || this.scale >= 1.4 && flag > 0) {
        return
      }
      this.scale += flag
      this.canvas.zoom(this.scale)
      // canvas.zoom('fit-viewport','auto')
    },
    menuTap(item) {
      console.log(item)
      this.menuShow = false
    },
    // 监听window点击
    windowClickFun() {
      // console.log(123)
      if (this.menuShow === true) {
        this.menuShow = false
      }
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.bpmn-canvas {
  height: 420px;
}

// :deep(.djs-connection ){
//   path {
//     // stroke: blue !important;
//     // marker-end: url(#sequenceflow-arrow-normal) !important;
//   }
// }


// 已处理任务列表
:deep(.finishTaskIdList .djs-visual rect ){

  fill: #D5E9FB !important;
  stroke: #2E81EA !important
}

:deep(.finishTaskIdList .djs-visual circle ){

  fill: #D5E9FB !important;
  stroke: #2E81EA !important
}

:deep(.finishTaskIdList .djs-visual polygon ){

  fill: #D5E9FB !important;
  stroke: #2E81EA !important
}

// 待处理任务ID列表
:deep(.activeTaskIdList .djs-visual rect ){
  fill: #F9CD74 !important;
  stroke: #df9f21 !important
}

:deep(.activeTaskIdList .djs-visual circle ){
  fill: #F9CD74 !important;
  stroke: #df9f21 !important
}

:deep(.activeTaskIdList .djs-visual polygon ){
  fill: #F9CD74 !important;
  stroke: #df9f21 !important
}

:deep(.ant-table-thead>tr>th),
:deep(.ant-table-tbody>tr>td ){
  padding: 6px 16px;
}


// :deep(.finishTaskIdList .djs-visual path ){
//   stroke: blue !important;
//   // marker-end: url(#sequenceflow-arrow-normal) !important;
//   // fill: #D5E9FB !important;
//   // path {
//   //   stroke: blue !important;
//   //   marker-end: url(#sequenceflow-arrow-normal) !important;
//   // }
// }
// :deep(.activeTaskIdList .djs-visual path ){
//   stroke: blue !important;
// }

// :deep(.activeTaskIdList .djs-connection ){
//   path {
//     stroke: blue !important;
//     marker-end: url(#sequenceflow-arrow-normal) !important;
//   }
// }


/* :deep(.nodeSuccess .djs-visual rect ){
  fill: #F9CD74 !important
} */

:deep(.bjs-container img ){
  display: none !important;
}

:deep(.bjs-container a ){
  display: none !important;
}

:deep(.bjs-powered-by ){
  display: none !important;
}

:deep(.djs-search-container ){
  display: none;
}

:deep(.bjs-breadcrumbs ){
  display: none;
}

:deep(.djs-palette ){
  display: none;
}

.menuList {
  position: fixed;
  width: 120px;
  /* height: 150px; */
  border-radius: 5px;
  background-color: white;
}

/* .menu-box { */
/* padding: 10px 0; */
/* } */

.menu-li {
  padding: 5px 0;
  cursor: pointer;
}

.menu-li:hover {
  background-color: rgb(102, 190, 109);
}
</style>
