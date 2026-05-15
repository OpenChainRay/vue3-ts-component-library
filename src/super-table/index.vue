<template>
    <tiny-grid  border
      v-bind="componentAttrs"
      v-on="compatListeners"
      seq-serial
    >
      <slot></slot>
    </tiny-grid>
  </template>

<script lang="jsx">
import { Grid } from '@opentiny/vue'

export default {
  name: 'STable',

  components: {
    TinyGrid: Grid
    // TinyGridColumn: GridColumn
  },
  data () {
    return {

    }
  },
  computed: {
    componentAttrs () {
      const attrs = this.$attrs || {}
      return Object.keys(attrs).reduce((obj, key) => {
        if (!/^on[A-Z]/.test(key)) {
          obj[key] = attrs[key]
        }
        return obj
      }, {})
    },
    compatListeners () {
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
  }
}
</script>
