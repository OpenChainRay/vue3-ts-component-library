// @ts-nocheck
import './HeaderSelect.less'
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
      if (this.$listeners) {
        return this.$listeners
      }
      const attrs = this.$attrs || {}
      return Object.keys(attrs).reduce((eventMap, key) => {
        if (/^on[A-Z]/.test(key) && typeof attrs[key] === 'function') {
          const eventName = key.slice(2, 3).toLowerCase() + key.slice(3)
          eventMap[eventName] = attrs[key]
        }
        return eventMap
      }, {})
    }
  },
  render () {
    // return (
    //   <a-dropdown>
    //     <a class="ant-dropdown-link" onClick="e => e.preventDefault()">
    //       常州爱安特<a-icon type="down" />
    //     </a>
    //     <a-menu slot="overlay">
    //       <a-menu-item>
    //         <a-icon type="user" />
    //         <span>个人中心</span>
    //       </a-menu-item>
    //       <a-menu-item>
    //         <a-icon type="setting" />
    //         <span>设置</span>
    //       </a-menu-item>
    //     </a-menu>
    //   </a-dropdown>
    // )
    const attrs = { ...(this.$attrs || {}) }
    const options = Array.isArray(attrs.options) ? attrs.options : []
    delete attrs.options
    if (attrs['default-value'] !== undefined && attrs.defaultValue === undefined) {
      attrs.defaultValue = attrs['default-value']
      delete attrs['default-value']
    }

    const compatListeners = this.getCompatListeners()
    return (
      <a-select class="at_select" {...{ props: attrs, on: compatListeners }}>
        {options.map((item, index) => (
          <a-select-option
            key={item.value ?? index}
            value={item.value}
            {...{ props: { orgCode: item.orgCode, label: item.label } }}
          >
            {item.label}
          </a-select-option>
        ))}
      </a-select>
    )
  }
}
