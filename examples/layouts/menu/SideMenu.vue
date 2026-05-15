<template>
  <a-layout-sider :theme="sideTheme"
    :class="['side-menu', 'beauty-scroll', isMobile ? null : 'shadow']"
    width="220px" :collapsible="collapsible" :collapsed="collapsed" :trigger="null"
  >
    <div :class="['logo', theme]">
      <router-link to="/dashboard/workplace">
        <img src="@/assets/img/logo.png">
        <h1>{{ systemName }}</h1>
      </router-link>
    </div>
    <i-menu :theme="theme" :collapsed="collapsed" :options="menuData" @select="onSelect" class="menu"/>
  </a-layout-sider>
</template>
<script>
import { mapState } from 'vuex'
import IMenu from './menu'
export default {
  name: 'SideMenu',
  components: { IMenu },
  props: {
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    // 侧边布局栏是否收起，默认false（展开）
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    menuData: {
      type: Array,
      required: true
    }
  },
  computed: {
    sideTheme () {
      return this.theme === 'light' ? this.theme : 'dark'
    },
    ...mapState('setting', ['isMobile', 'systemName'])
  },
  methods: {
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    }
  }
}
</script>
<style lang="less" scoped>
@import "index";
</style>
