// @ts-nocheck
import './HeaderSelect.less'
import { h, resolveComponent } from 'vue'
export default {
  name: 'HeaderSelect',
  data () {
    return {

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
    const attrs = { ...(this.$attrs || {}) }
    const options = Array.isArray(attrs.options) ? attrs.options : []
    delete attrs.options
    if (attrs['default-value'] !== undefined && attrs.defaultValue === undefined) {
      attrs.defaultValue = attrs['default-value']
      delete attrs['default-value']
    }

    const compatListeners = this.getCompatListeners()
    const selectProps = { ...attrs }
    Object.keys(compatListeners).forEach((eventName) => {
      const key = `on${eventName.slice(0, 1).toUpperCase()}${eventName.slice(1)}`
      selectProps[key] = compatListeners[eventName]
    })
    const ASelect = resolveComponent('a-select')
    const ASelectOption = resolveComponent('a-select-option')
    return h(ASelect, { class: 'at_select', ...selectProps }, () =>
      options.map((item, index) =>
        h(
          ASelectOption,
          {
            key: item.value ?? index,
            value: item.value,
            orgCode: item.orgCode,
            label: item.label
          },
          () => item.label
        )
      )
    )
  }
}
