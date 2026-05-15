// @ts-nocheck
// 内置的文件类型
import { isArray, isObject, isString, createId } from '../utils'
import './index.less'
import AtEllipsis from '../AtEllipsis'
const fileTypes = ['image', 'video', 'audio', 'pdf', 'file']
export default {
  name: 'AtViewer',
  components: {
    AtEllipsis
  },
  data () {
    const width = this.drag ? 800 : window.innerWidth
    const height = this.drag ? 600 : window.innerHeight
    return {
      visible: false,
      loading: false,
      top: 0,
      left: 0,
      scale: 0,
      rotate: 0,
      records: [],
      record: {},
      // 当前预览工具栏可显示的宽度
      mainWidth: 0,
      // 当前文件列表占用的总宽度
      totalWidth: 0,
      // 总页数
      totalPage: 0,
      // 当前页数
      currentPage: 0,

      // 文件左右切换的页数维护
      activeRecordIndex: 0,
      // 预览容器的位置
      viewerConfig: {
        left: (window.innerWidth - width) / 2,
        top: (window.innerHeight - height) / 2,
        width,
        height
      }
    }
  },
  props: {
    /**
     * 受控
     */
    value: {
      type: [Array, Object, String],
      default: () => ([])
    },
    /**
     * 受控
     */
    input: {
      type: Function,
      default: () => {}
    },
    /**
     * 文件类型，默认通过后缀识别，如果指定了就优先使用
     */
    fileType: {
      type: String,
      validator: (value) => fileTypes.indexOf(value) > -1
    },
    /**
     * 文件的上传类型，根据不同的 listType 切换成不同的上传样式
     */
    listType: {
      type: String,
      default: 'thumbnail',
      validator: (value) => ['thumbnail', 'link', 'card', 'custom'].indexOf(value) > -1
    },
    /**
     * 文件预览地址，如果传递了就使用,用于拼接文件下载地址
     */
    downloadUrl: {
      type: String,
      default: ''
    },
    /**
     * 是否自动添加文件下载地址，默认不拼接，一般也不需要拼接
     */
    addDownloadPath: {
      type: Boolean,
      default: false
    },
    /**
     * 是否显示文件列表
     */
    showFileList: {
      type: [String, Boolean],
      default: true
    },
    /**
     * 设置文件数组对象文件和文件路径对应的属性，默认为name或者fileName，url或者filePath
     */
    fieldKey: {
      type: Object,
      default: () => ({
        name: 'fileName',
        url: 'filePath'
      })
    },
    /**
     * 仅 listType 为 card 生效，文件列表以栅格形式展示
     */
    span: {
      type: [Boolean, Number],
      default: false
    },
    /**
     * 是否使用 pdf 组件来显示 pdf 文件，默认使用 iframe 来加载。在 IE11 里面 pdf 文件会变成下载，可以借助 pdf.js 来展示
     */
    usePdf: {
      type: [Boolean, Object],
      default: false
    },
    // 弹框完全关闭后的回调
    onAfterClosed: {
      type: Function,
      default: () => {}
    },
    /**
     * 是否显示出来全局的下载按钮
     */
    showDownload: {
      type: [String, Boolean],
      default: false
    },
    // 弹框可拖动
    drag: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value (value) {
      this.transferValue(value)
    },
    // 根据状态修改 body 的滚动状态
    visible (newValue) {
      if (!newValue) {
        document.body.style.overflow = ''
      } else {
        this.$nextTick(() => {
          this.calcToolbarWidth()
        })
        if (!this.drag) {
          document.body.style.overflow = 'hidden'
        }
      }
    }
  },
  computed: {
    imgStyle () {
      return {
        left: `${this.left}px`,
        top: `${this.top}px`,
        transform: `scale(${this.scale}) rotate(${this.rotate}deg)`
      }
    },
    cardStyle () {
      // 只有是 card 类型的列表才生效
      if (this.listType === 'card') {
        if (this.span) {
          return {
            width: `calc(${100 / this.span}% - 10px)`
          }
        }
      }
      return {}
    },
    toolbarStyle () {
      return {
        justifyContent: this.totalWidth < this.mainWidth ? 'center' : 'flex-start',
        transform: `translateX(${-this.currentPage * this.mainWidth}px)`
      }
    },
    viewerWrapStyle () {
      return {
        left: `${this.viewerConfig.left}px`,
        top: `${this.viewerConfig.top}px`
      }
    }
  },
  methods: {
    // 兼容 Vue2/Vue3 插槽调用方式。
    callScopedSlot (name, payload) {
      const slotFn = this.$slots && this.$slots[name]
      if (typeof slotFn === 'function') {
        return slotFn(payload)
      }
      return null
    },
    hasScopedSlot (name) {
      return typeof (this.$slots && this.$slots[name]) === 'function'
    },
    // 显示弹框
    // activeIndex 默认选中第一个，传递具体下标来选中，如果是 true 也是默认选中第一个
    showModal (record, activeIndex = true) {
      if (record) {
        this.transferValue(record, activeIndex)
      }
      this.visible = true
      this.$nextTick(() => {
        this.calcToolbarWidth()
      })
    },
    // 关闭
    onHideModal () {
      this.hideModal()
    },
    // 暴露给外部使用的方法
    hideModal () {
      this.visible = false
      this.initImgPosition()
    },
    // 初始化图片位置信息
    initImgPosition () {
      this.top = 0
      this.left = 0
      this.scale = 0
      this.rotate = 0
    },
    // 将传递进来的预览数据统一处理成数组的形式
    transferValue (value, active = false) {
      // 如果是无效的参数，直接忽略
      if (!value) {
        return
      }

      let records = []
      // 如果传递的是字符串
      if (isString(value)) {
        records.push({
          uid: createId(),
          name: value,
          url: this.getFileUrl(value),
          fileType: this.getFileType([value])
        })

      // 如果传递的是对象
      } else if (isObject(value)) {
        const sourceUrl = value.url || value[this.fieldKey.url] || ''
        const url = this.getFileUrl(sourceUrl)
        if (url) {
          const name = value.name || value[this.fieldKey.name]
          records.push({
            ...value,
            uid: value.uid || createId(),
            name,
            url,
            fileType: this.getFileType([name, sourceUrl])
          })
        }

      // 如果传递的是数组
      } else if (isArray(value)) {
        records = value.map(item => {
          const sourceUrl = item.url || item[this.fieldKey.url] || ''
          const url = this.getFileUrl(sourceUrl)
          if (!url) {
            return null
          }
          const name = item.name || item[this.fieldKey.name]
          return {
            ...item,
            uid: item.uid || createId(),
            name,
            url,
            fileType: this.getFileType([name, sourceUrl])
          }
        }).filter(n => n)

      // 抛出错误
      } else {
        throw new Error('数据格式错误')
      }

      // 如果传递了说明是设置当前要预览的文件
      if (active !== false) {
        // 如果没有绑定 v-model，把当前传递进来的列表当成是全量的预览列表
        if (this.value && !this.value.length) {
          this.activeRecordIndex = active
          this.record = active === true ? records[0] : records[active]
          this.records = records
        } else {
          // 这里是根据是否绑定了 v-model 来决定选中谁的，传递了就从 records 里面读取，否则 active 就看成是在设置当前选中的文件
          this.activeRecordIndex = active
          this.record = this.records[active]
        }
        this.calcCurrentToolbarPage()
      } else {
        this.records = records
      }
    },
    // 获取文件地址
    getFileUrl (url) {
      // 如果是 http 或者 https 开头
      if (url.match(/^http(s)?:\/\//)) {
        return this.addTimestamp(url)
      }
      // 如果是 blob 开头
      if (url.match(/^blob:/)) {
        return url
      }
      // 否则再拼接完整的地址
      if (this.addDownloadPath) {
        return this.addTimestamp((this.downloadUrl || this.$api.download || '') + url)
      }
      return this.addTimestamp(url)
    },
    // 给图片地址添加一个唯一的后缀标识，因为动画需要这个标识，否则如果外部传递进来的访问地址存在两个一样的，动画就会失效
    addTimestamp (url) {
      return url + (url.match(/\?/) ? `&${createId()}` : `?${createId()}`)
    },
    // 设置文件类型，优先使用 name 的后缀来匹配，如果找不到就用 url 的后缀匹配
    getFileType (types = []) {
      // 如果指定了统一的文件类型
      if (this.fileType) {
        return this.fileType
      }
      // 否则根据文件后缀进行匹配
      if (types.find(t => t.match(/\.(png|jpg|jpeg|gif|svg)(\?.*)*?$/i))) {
        return 'image'
      } else if (types.find(t => t.match(/\.(mp4|avi|mov|wmv|flv|webm|ogg)(\?.*)*?$/i))) {
        return 'video'
      } else if (types.find(t => t.match(/\.(mp3|cd|m4a|wma|wav|ape|flac|ogg|aac|vqf)(\?.*)*?$/i))) {
        return 'audio'
      } else if (types.find(t => t.match(/\.pdf(\?.*)*?$/i))) {
        return 'pdf'
      }
      return 'file'
    },
    // 预览
    onPreview (item, index) {
      this.activeRecordIndex = index
      this.record = item
      this.calcCurrentToolbarPage()
      this.visible = true
      this.$emit('fileChange', index, this.record)
    },
    // 文件切换
    onFileChange (item, index) {
      if (item.uid === this.record.uid) {
        return
      }
      this.initImgPosition()
      this.activeRecordIndex = index
      this.record = item
      this.$emit('fileChange', index, this.record)
    },
    // 文件左切换
    onFileLeftSwitch () {
      const index = this.activeRecordIndex + 1
      if (index < this.records.length) {
        this.initImgPosition()
        this.activeRecordIndex = index
        this.record = this.records[index]
        this.calcCurrentToolbarPage()
        this.$emit('fileChange', index, this.record)
      }
    },
    // 文件右切换
    onFileRightSwitch () {
      const index = this.activeRecordIndex - 1
      if (index >= 0) {
        this.initImgPosition()
        this.activeRecordIndex = index
        this.record = this.records[index]
        this.calcCurrentToolbarPage()
        this.$emit('fileChange', index, this.record)
      }
    },
    // 图片加载完毕之后计算 left 的值，然后显示图片
    onImgLoad (e) {
      this.left = (this.viewerConfig.width - e.target.width) / 2
      this.top = (this.viewerConfig.height - e.target.height - 77) / 2
      this.scale = 1
    },
    // 旋转
    onRotateLeftChange () {
      this.rotate -= 90
    },
    onRotateRightChange () {
      this.rotate += 90
    },
    // 缩放
    onScaleAddChange () {
      if (this.scale < 3) {
        this.scale = +(this.scale + 0.1).toFixed(1)
      }
    },
    onScaleLessChange () {
      if (this.scale > 0.1) {
        this.scale = +(this.scale - 0.1).toFixed(1)
      }
    },
    // 滚动缩放图片
    onScrollScale (e) {
      if (e.currentTarget && e.currentTarget === this.$refs.viewerModal) {
        if (e.preventDefault) {
          e.preventDefault()
        } else {
          e.returnValue = true
        }
        e.preventDefault()
        // 火狐浏览器是正好反过来的
        if (e.wheelDelta > 0 || e.detail < 0) {
          this.onScaleAddChange()
        } else {
          this.onScaleLessChange()
        }
      }
    },
    // 图片拖动
    onImgMouseDown (e) {
      e.stopPropagation()
      e.preventDefault()
      const x = e.clientX - e.target.offsetLeft
      const y = e.clientY - e.target.offsetTop
      document.onmousemove = (es) => {
        this.left = es.clientX - x
        this.top = es.clientY - y
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    onBarMouseDown (e) {
      e.stopPropagation()
      e.preventDefault()
      const x = e.clientX - this.viewerConfig.left
      const y = e.clientY - this.viewerConfig.top
      document.onmousemove = (es) => {
        this.viewerConfig.left = es.clientX - x
        this.viewerConfig.top = es.clientY - y
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    // 计算预览工具栏宽度
    calcToolbarWidth () {
      // 左右的间距
      const mainWidth = this.viewerConfig.width - 66 * 2
      // 48 是一个预览图标占用的总宽度
      const totalWidth = this.records.length * 48
      this.mainWidth = mainWidth
      this.totalWidth = totalWidth
      this.totalPage = Math.floor(totalWidth / mainWidth)
    },
    // 预览工具栏向左移动
    onToolbarScrollLeft () {
      if (this.currentPage + 1 <= this.totalPage) {
        this.currentPage += 1
      }
    },
    // 预览工具栏向右移动
    onToolbarScrollRight () {
      if (this.currentPage - 1 >= 0) {
        this.currentPage -= 1
      }
    },
    // 计算当前选中的图标是否需要翻滚预览工具栏
    calcCurrentToolbarPage () {
      const index = this.records.findIndex(item => item.uid === this.record.uid)
      if (index !== -1) {
        // 原本能展示的个数
        let n = Math.floor(this.mainWidth / 48)
        // 如果当前最后一个文件显示出来的一半都不到，下一次切换的时候直接翻页
        n = Math.floor(n) + 0.5 > n ? n - 1 : n
        let currentPage = Math.ceil((index / n) - 1)
        if (currentPage <= 0) {
          currentPage = 0
        } else if (currentPage >= this.totalPage) {
          currentPage = this.totalPage
        }
        this.currentPage = currentPage
      }
    },
    // 新窗口打开文件
    onNewTabOpen () {
      window.open(this.record.url)
    },
    // 文件下载
    onFileDownload () {
      const request = this.$request || this.$http || this.axios || this.$axios
      if (!request) {
        if (this.$message) {
          this.$message.error('请先配置 $request 或 $http 或 axios 或 $axios')
          return
        } else {
          throw new Error('请先配置 $request 或 $http 或 axios 或 $axios')
        }
      }
      request({
        url: this.record.url,
        method: 'GET',
        headerType: 'download'
      }).then(() => {
        if (this.$message) {
          this.$message.success('下载成功')
        }
      })
    },
    // 根据文件类型渲染相应元素
    listTypeDom ({ item, index }) {
      if (this.listType == 'link') {
        return (
          <a key={item.uid} href="javascript:;" class="list-link-item" onClick={() => this.onPreview(item, index)}>
            <at-ellipsis>
              item.name
            </at-ellipsis>
          </a>
        )
      } else if (this.listType == 'custom') {
        return (
          <div class="custom-item-box" key={item.uid} onClick={() => this.onPreview(item, index)}>
            {this.callScopedSlot('default', {
              record: item,
              index
            })}
          </div>
        )
      } else {
        return (
          <div key={item.uid} class={['list-item', `list-${this.listType}-item`]} style={this.cardStyle} onClick={() => this.onPreview(item, index)}>
            {item.fileType === 'image' && (<img class="item-image" src={item.url} />)}
            {item.fileType === 'video' && (<a-icon class="item-file" type="video-camera" />)}
            {item.fileType === 'audio' && (<a-icon class="item-file" type="audio" />)}
            {item.fileType === 'pdf' && (<a-icon class="item-file" type="file-pdf" />)}
            {item.fileType === 'file' && (<a-icon class="item-file" type="file" />)}
            {this.listType === 'card' && (<at-ellipsis class="ML10">{item.name}</at-ellipsis>)}
          </div>
        )
      }
    },
    renderFileList (renderDom) {
      return this.records.map((item, index) => {
        return renderDom({ item, index })
      })
    },
    fileListTemplate () {
      return (
        <div class={`preview_${this.listType}__list`}>
          {this.renderFileList(this.listTypeDom)}
          {this.$slots.actions}
        </div>
      )
    },
    previewListNode ({ item, index }) {
      return (
        <div class={['list-item', { 'list-item-active': item.uid === this.record.uid }]} key={item.uid} onClick={() => this.onFileChange(item, index)}>
          {item.fileType === 'image' && (<img class="item-image" src={item.url} />)}
          {item.fileType === 'video' && (<a-icon class="item-file" type="video-camera" />)}
          {item.fileType === 'audio' && (<a-icon class="item-file" type="audio" />)}
          {item.fileType === 'pdf' && (<a-icon class="item-file" type="file-pdf" />)}
          {item.fileType === 'pdf' && (<a-icon class="item-file" type="file" />)}
        </div>
      )
    }
  },
  created () {
    this.transferValue(this.value)
    this.calcToolbarWidth()
  },
  render () {
    return (
      <div class='at_viewer_wrap'>
        {/* 文件列表 */}
        { (this.showFileList == true) && this.fileListTemplate()}
        {/* 显示文件 */}
        <transition name="scale" onAfterLeave={() => this.onAfterClosed()}>
          {
            this.visible && (
              <div ref="viewerModal"
                class={['ak-viewer-modal-wrap', { 'ak-viewer-modal-drag': this.drag }]}
                style={this.viewerWrapStyle}
                onWheel={this.onScrollScale}
              >
                {this.drag && (<div class="viewer-drag-bar" onMousedown={this.onBarMouseDown} />)}
                <a-icon type="close" class="icon-fixed icon-close" onClick={this.onHideModal} />
                <div class="preview-content">
                  {
                    this.record.fileType === 'image' && (
                      <img class="item-image" key={this.record.url} style={this.imgStyle}
                        src={this.record.url} onLoad={this.onImgLoad} on-mousedown={this.onImgMouseDown}
                      />
                    )
                  }
                  {
                    this.record.fileType === 'video' && (
                      <video class="item-video" controls src={this.record.url} />
                    )
                  }
                  {
                    this.record.fileType === 'audio' && (
                      <audio class="item-audio" controls src={this.record.url} />
                    )
                  }
                  {
                    this.record.fileType === 'pdf' && (
                      <embed src={this.record.url} type="application/pdf" style={{ width: '100%', height: '100%' }}/>
                    )
                  }
                  {
                    this.record.fileType === 'file' && this.callScopedSlot('preview', {
                      record: this.record,
                      index: this.activeRecordIndex
                    })
                  }
                  {
                    this.record.fileType === 'file' && !this.hasScopedSlot('preview') && (
                      <div class="item-file">
                        <div class="tips">
                          <a-icon type="info-circle" />
                          当前文件不支持预览，请点击下载到本地查看。
                        </div>
                        <a target="_blank" href={this.record.url}>{this.record.name}</a>
                      </div>
                    )
                  }
                  {/* 文件操作 */}
                  <div class="preview-image-action">
                    <a-icon type="undo" onClick={this.onRotateLeftChange} disabled={this.record.fileType !== 'image'} />
                    <a-icon type="redo" onClick={this.onRotateRightChange} disabled={this.record.fileType !== 'image'} />
                    <a-icon type="zoom-in" onClick={this.onScaleAddChange} disabled={this.record.fileType !== 'image'} />
                    <a-icon type="zoom-out" onClick={this.onScaleLessChange} disabled={this.record.fileType !== 'image'} />
                    {(this.showDownload == true) && (<a-icon type="download" onClick={this.onFileDownload} />)}
                    <a-icon type="left" onClick={this.onFileRightSwitch} disabled={this.activeRecordIndex <= 0} />
                    <a-icon type="right" onClick={this.onFileLeftSwitch} disabled={this.activeRecordIndex >= (this.records.length - 1)} />
                    <a-icon type="link" onClick={this.onNewTabOpen} />
                  </div>
                </div>
                {/* 内置的文件切换列表，可快速切换查看文件 */}
                <div class="preview-list-navbar">
                  <span class="file-name">{ this.record.name }</span>
                  <div class="preview-nav-list">
                    <div class="preview-nav-main" style={this.toolbarStyle}>
                      {this.renderFileList(this.previewListNode)}
                    </div>
                  </div>

                  {(this.totalPage > 0) && (<a-icon type="left" class="icon-switch icon-left" onClick={this.onToolbarScrollRight} disabled={this.currentPage <= 0} />)}
                  {(this.totalPage > 0) && (<a-icon type="right" class="icon-switch icon-right" onClick={this.onToolbarScrollLeft} disabled={this.currentPage >= this.totalPage} />)}
                </div>
              </div>
            )
          }
        </transition>
      </div>
    )
  }
}
