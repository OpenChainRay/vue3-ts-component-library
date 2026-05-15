<template>
  <a-config-provider :locale="locale" :get-popup-container="popContainer">
    <router-view/>
  </a-config-provider>
</template>

<script>
import { mapState } from 'vuex'
import { getI18nKey } from '@/utils/routerUtil'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import enUS from 'ant-design-vue/es/locale/en_US'
export default {
  name: 'App',
  components: {

  },
  data () {
    return {
      locale: {}
    }
  },
  watch: {
    lang (val) {
      this.setLanguage(val)
      this.setHtmlTitle()
    },
    $route () {
      this.setHtmlTitle()
    },
    layout: function () {
      window.dispatchEvent(new Event('resize'))
    }
  },
  computed: {
    ...mapState('setting', ['layout', 'theme', 'weekMode', 'lang'])
  },
  created () {
    this.setHtmlTitle()
    this.setLanguage(this.lang)
  },
  methods: {
    popContainer () {
      return document.getElementById('popContainer')
    },
    setLanguage (lang) {
      this.$i18n.locale = lang
      switch (lang) {
        case 'CN':
          this.locale = zhCN
          break
        // case 'HK':
        //   this.locale = require('ant-design-vue/es/locale-provider/zh_TW').default
        //   break
        case 'US':
          this.locale = enUS
          break
        default:
          this.locale = zhCN
          break
      }
    },
    setHtmlTitle () {
      const route = this.$route
      const matchedRoute = route && route.matched && route.matched.length ? route.matched[route.matched.length - 1] : null
      const key = route.path === '/' ? 'home.name' : getI18nKey(matchedRoute ? matchedRoute.path : '/')
      document.title = process.env.GLOBE_APP_TITLE + ' | ' + this.$t(key)
    }
  }
}
</script>
<style lang="less" scoped>

</style>
