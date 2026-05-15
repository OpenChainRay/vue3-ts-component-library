// @ts-nocheck
import Tooltip from 'ant-design-vue/es/tooltip'
import { cutStrByFullLength, getStrFullLength } from '../utils'
import './index.less'

export default {
  name: 'AtEllipsis',
  components: {
    Tooltip
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-ellipsis'
    },
    tooltip: {
      type: Boolean
    },
    length: {
      type: [Number, String]
    },
    lines: {
      type: Number,
      default: 1
    },
    fullWidthRecognition: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    limitLength () {
      if (this.length) return Number(this.length)
      return 0
    }
  },
  methods: {
    /** 兼容 Vue2/Vue3 默认插槽读取 */
    getDefaultSlotText () {
      const defaultSlot = this.$slots.default
      const nodes = typeof defaultSlot === 'function' ? defaultSlot() : (defaultSlot || [])
      return nodes.map(vNode => vNode.text || vNode.children || '').join('')
    },
    /** 对字符串进行指定长度截取 */
    getStrDom (str, fullLength) {
      return (
        <span>{ cutStrByFullLength(str, this.limitLength) + (fullLength > this.limitLength ? '...' : '') }</span>
      )
    },
    /** 生成带 tooltip 的文本 */
    getTooltip (fullStr, fullLength) {
      return (
        <Tooltip scopedSlots={{ title: () => fullStr }}>
          { this.getStrDom(fullStr, fullLength) }
        </Tooltip>
      )
    }
  },
  render () {
    const { tooltip, length } = this.$props
    const str = this.getDefaultSlotText()
    const fullLength = getStrFullLength(str)
    const strDom = tooltip && fullLength > length ? this.getTooltip(str, fullLength) : this.getStrDom(str, fullLength)
    if (length) {
      return strDom
    }
    return (
      <Tooltip scopedSlots={{ title: () => str }}>
        <div ref="strContainer" class="at_auto_tooltip" >{ str }</div>
      </Tooltip>
    )
  }
}
