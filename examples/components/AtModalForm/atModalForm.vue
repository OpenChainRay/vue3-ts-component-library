<template>
  <a-form
    v-bind="{..._props}"
  >
    <!--
    :hideRequiredMark="hideRequiredMark"
    :labelAlign="labelAlign"
    :layout="layout"
    :labelCol="labelCol"
    :wrapperCol="wrapperCol"
    :colon="colon"
    :selfUpdate="selfUpdate" -->
    <slot></slot>
  </a-form>
</template>

<script>
// import T from 'ant-design-vue/es/form'
/**
 * @description
 * 1. 把a-form抽出来，设置好layout值，然后设置一个solt，让使用这个组件的人自己设置a-form-item
 * 2. 开放下a-form的props 让使用者可以自己设定其他的props
 * 3. 本质上我们多做一层的目的，目前是为了统一样式而已
 *
 * 以下props 是完全照抄的From 参数
 */
export default {
  name: 'AtModalForm',
  props: {
    form: {
      type: Object,
      default: function () {
        return {}
      }
    },
    hideRequiredMark: {
      type: Boolean,
      default: true
    },
    labelAlign: {
      type: String,
      default: 'right'
    },
    layout: {
      // type: 'horizontal' | 'vertical' | 'inline',
      type: String,
      default: 'vertical'
    },
    labelCol: {
      type: Object,
      default: function () {
        return {}
      }
    },
    wrapperCol: {
      type: Object,
      default: function () {
        return {}
      }
    },
    selfUpdate: {
      type: Boolean,
      default: false
    },
    colon: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  mounted () {
    // console.log('this==', this)
  }
}
</script>

<style scoped>
::v-deep .ant-form-item-label > label.ant-form-item-required.ant-form-item-no-colon::after {
  display: inline-block;
  margin-right: 4px;
  color: #f5222d;
  font-size: 14px;
  font-family: SimSun,sans-serif;
  line-height: 1;
  content: "*";
}
</style>
