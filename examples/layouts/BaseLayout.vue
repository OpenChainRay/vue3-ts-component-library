<template>
  <a-layout :class="['admin-layout', 'beauty-scroll']">
    <!-- 如果是移动端则采用悬浮图标，默认隐藏左侧导航菜单 -->
    <drawer v-if="isMobile" v-model="drawerOpen">
      <side-menu :theme="theme.mode" :menuData="menuData" :collapsed="false" :collapsible="false"
        @menuSelect="onMenuSelect"/>
    </drawer>
    <side-menu v-else-if="layout === 'side' || layout === 'mix'"
      :class="[fixedSideBar ? 'fixed-side' : '']"
      :theme="theme.mode" :collapsible="true" :collapsed="collapsed"
      :menuData="sideMenuData"
    >
    </side-menu>
    <div v-if="fixedSideBar && !isMobile" class="virtual-side"
      :style="`width: ${sideMenuWidth}; min-width: ${sideMenuWidth};max-width: ${sideMenuWidth};`"
    ></div>
    <!-- 设置项（悬浮齿轮图标） -->
    <!-- <drawer v-if="!hideSetting" v-model="showSetting" placement="right">
      <div class="setting" slot="handler">
        <a-icon :type="showSetting ? 'close' : 'setting'"/>
      </div>
      <setting />
    </drawer> -->
    <!-- 右侧布局 -->
    <a-layout class="admin-layout-main beauty-scroll">
      <!-- 顶部悬浮时占位顶部高度 -->
      <a-layout-header
        :class="['virtual-header', {'fixed-tabs' : fixedTabs, 'fixed-header': fixedHeader, 'multi-page': multiPage}]"
        v-show="fixedHeader">
      </a-layout-header>
      <!-- 右侧顶部状态栏 -->
      <base-header :class="[{'fixed-tabs': fixedTabs, 'fixed-header': fixedHeader, 'multi-page': multiPage}]"
        :style="headerStyle" :menuData="headMenuData" :collapsed="collapsed" @toggleCollapse="toggleCollapse"
      />
      <!-- 右侧中间内容区域 -->
      <a-layout-content class="admin-layout-content" :style="`min-height: ${minHeight}px;`">
        <div style="position: relative">
          <slot></slot>
        </div>
      </a-layout-content>
      <!-- <a-layout-footer style="padding: 0px">
        <page-footer :link-list="footerLinks" :copyright="copyright" />
      </a-layout-footer> -->
    </a-layout>
  </a-layout>
</template>

<script>
import Drawer from '@/components/tool/Drawer'
import SideMenu from './menu/SideMenu.vue'
// import Setting from '@/components/setting/Setting'
import BaseHeader from './header/BaseHeader'
import PageFooter from './footer/PageFooter'
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'admin-layout',
  components: {
    Drawer,
    SideMenu,
    // Setting,
    BaseHeader,
    PageFooter
  },
  data () {
    return {
      drawerOpen: false,
      minHeight: window.innerHeight - 64 - 122,
      collapsed: false,
      showSetting: false
    }
  },
  provide () {
    return {
      baseLayout: this
    }
  },
  computed: {
    ...mapState('setting', [
      'isMobile', 'layout', 'fixedSideBar',
      'theme', 'hideSetting', 'fixedHeader',
      'fixedTabs', 'multiPage', 'footerLinks', 'copyright'
    ]),
    ...mapGetters('setting', ['firstMenu', 'subMenu', 'menuData']),
    sideMenuData () {
      const { layout, menuData, subMenu } = this
      return layout === 'mix' ? subMenu : menuData
    },
    sideMenuWidth () {
      return this.collapsed ? '80px' : '220px'
    },
    headerStyle () {
      const width = (this.fixedHeader && this.layout !== 'head' && !this.isMobile) ? `calc(100% - ${this.sideMenuWidth})` : '100%'
      const position = this.fixedHeader ? 'fixed' : 'static'
      return `width: ${width}; position: ${position};`
    },
    headMenuData () {
      const { layout, menuData, firstMenu } = this
      return layout === 'mix' ? firstMenu : menuData
    }
  },
  watch: {
    isMobile (val) {
      if (!val) {
        this.drawerOpen = false
      }
    },
    $route (val) {
      this.setActivated(val)
    },
    layout () {
      this.setActivated(this.$route)
    }
  },
  methods: {
    ...mapMutations('setting', ['correctPageMinHeight', 'setActivatedFirst']),
    toggleCollapse () {
      this.collapsed = !this.collapsed
    },
    onMenuSelect () {
      this.toggleCollapse()
    },
    setActivated (route) {
      if (this.layout === 'mix') {
        let matched = route.matched
        matched = matched.slice(0, matched.length - 1)
        console.log('matched', matched)
        const { firstMenu } = this
        for (const menu of firstMenu) {
          console.log('menu', menu)
          if (matched.findIndex(item => item.path === menu.fullPath) !== -1) {
            this.setActivatedFirst(menu.fullPath)
            break
          }
        }
      }
    }
  },
  created () {
    this.correctPageMinHeight(this.minHeight - 24)
    this.setActivated(this.$route)
  },
  beforeUnmount () {
    this.correctPageMinHeight(-this.minHeight + 24)
  }
}
</script>
<style lang="less" scoped>
  .admin-layout{
    // min-height: 100vh;
    .side-menu{
      &.fixed-side{
        position: fixed;
        height: 100vh;
        left: 0;
        top: 0;
      }
    }
    .virtual-side{
      transition: all 0.2s;
    }
    .virtual-header{
      transition: all 0.2s;
      opacity: 0;
      &.fixed-tabs.multi-page:not(.fixed-header){
        height: 0;
      }
    }
    .admin-layout-main{
      height: 100vh;
      .admin-header{
        top: 0;
        right: 0;
        overflow: hidden;
        transition: all 0.2s;
        &.fixed-tabs.multi-page:not(.fixed-header){
          height: 0;
        }
      }
    }
    .admin-layout-content{
      padding: 20px 12px 0;
      /*overflow-x: hidden;*/
      /*min-height: calc(100vh - 64px - 122px);*/
    }
    .setting{
      background-color: @primary-color;
      color: @base-bg-color;
      border-radius: 5px 0 0 5px;
      line-height: 40px;
      font-size: 22px;
      width: 40px;
      height: 40px;
      box-shadow: -2px 0 8px @shadow-color;
    }
  }
</style>
