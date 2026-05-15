<template>
  <div></div>
</template>
<script>
export default {
  name: 'SubEdit',
  data () {
    return {
      editForm: null,
      editFormData: {},
      localEditVisible: false
    }
  },
  props: {
    visible: Boolean
  },
  watch: {
    visible (val) {
      this.localEditVisible = val
    }
  },
  methods: {
    initFormNode () {
      return (
        <a-form form={this.editForm} >

        </a-form>
      )
    }
  }
}
</script>
<style lang="less" scoped>

</style>
