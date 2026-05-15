<template>
    <tiny-grid  border
      v-bind="$attrs"
      v-on="$listeners"
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
  methods: {

  }
}
</script>
