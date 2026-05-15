<template>
  <page-layout :avatar="currUser.avatar">
    <template #headerContent>
      <div class="title">你好，{{currUser.name}}，欢迎登陆UMS系统。</div>
      <div>您的手机号码：{{currUser.mobile}}</div>
    </template>
  </page-layout>
</template>
<script>
import PageLayout from '@/layouts/PageView/PageLayout'
import { mapState } from 'vuex'
import i18n from './i18n'
export default {
  name: 'WorkPlace',
  i18n,
  data () {
    return {
      loading: true
    }
  },
  components: {
    PageLayout
  },
  computed: {
    ...mapState('account', { currUser: 'user' })
  }
}
</script>
<style lang="less">
</style>
