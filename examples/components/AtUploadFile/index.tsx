// @ts-nocheck
import './index.less'
export default {
  name: 'AtUploadFile',
  data () {
    return {}
  },
  props: {
    // a-upload-dragger组件props
    uploadProps: {
      type: [Object],
      default: () => {
        return {
          name: 'file'
        }
      }
    },
    uploadListeners: {
      type: [Object],
      default: () => {
        return {}
      }
    },
    // 是否需要显示下载模版按钮
    downloadTemplate: {
      type: [Boolean],
      default: true
    },
    // 下载模版事件
    downloadTemplateEvent: {
      type: [Function],
      default: () => { }
    },
    uploadRef: {
      type: String
    }
  },
  methods: {
    /**
     * 兼容 Vue2/3 事件监听透传。
     */
    getCompatListeners () {
      const attrs = this.$attrs || {}
      return Object.keys(attrs).reduce((eventMap, key) => {
        const val = attrs[key]
        if (/^on[A-Z]/.test(key) && (typeof val === 'function' || Array.isArray(val))) {
          const eventName = key.slice(2, 3).toLowerCase() + key.slice(3)
          eventMap[eventName] = val
        }
        return eventMap
      }, {})
    }
  },

  render () {
    const compatListeners = this.getCompatListeners()
    return (
      <a-modal
        {...{ props: this.$attrs, on: compatListeners }}
      >
        {
          this.downloadTemplate && (
            <a-alert type="info" show-icon>
              <div slot="message">
                如果需要<a href="javascript:;" onClick={this.downloadTemplateEvent}>下载模板</a>，直接点击即可下载。
              </div>
            </a-alert>
          )
        }
        <div style={{ marginTop: '10px' }}>
          {
            this.$slots.default
          }
        </div>
        <div style={{ marginTop: '10px' }}>
          <a-upload-dragger
            {...{ props: this.uploadProps, on: this.uploadListeners }}
          >
            {this.$slots.uploadDefault}
            {/* <p class="ant-upload-drag-icon">
              <a-icon type="inbox" />
            </p>
            <p class="ant-upload-text">
              将文件拖拽至此区域或<a href="#">选择文件上传</a>
            </p>
            <p class="ant-upload-hint">
              仅支持: XLS,XLSX,大小不超过50MB
            </p> */}
          </a-upload-dragger>
        </div>
      </a-modal>
    )
  }
}
