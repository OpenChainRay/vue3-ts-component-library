<template>
  <a-layout-header :class="[headerTheme, 'admin-header']">
    <div :class="['admin-header-wide', layout, pageWidth]">
      <router-link v-if="isMobile || layout === 'head'" to="/" :class="['logo', isMobile ? null : 'pc', headerTheme]">
        <img width="32" src="@/assets/img/logo.png" />
        <h1 v-if="!isMobile">{{systemName}}</h1>
      </router-link>
      <a-divider v-if="isMobile" type="vertical" />
      <a-icon v-if="layout !== 'head'" class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="toggleCollapse"/>
      <div v-if="layout !== 'side' && !isMobile" class="admin-header-menu" :style="`width: ${menuWidth};`">
        <i-menu class="head-menu" :theme="headerTheme" mode="horizontal" :options="menuData" @select="onSelect"/>
      </div>
      <div :class="['admin-header-right', headerTheme]">
          <!-- <header-search class="header-item" @active="val => searchActive = val" />
          <a-tooltip class="header-item" title="帮助文档" placement="bottom" >
            <a href="https://iczer.gitee.io/vue-antd-admin-docs/" target="_blank">
              <a-icon type="question-circle-o" />
            </a>
          </a-tooltip> -->
          <!-- <header-notice class="header-item"/> -->
          <div class="header_select">
            <header-select
              style="width: 300px; box-sizing: border-box; display: inline-block; border: 0;"
              :options="departmentsOptions" :default-value="currentDepartment ? currentDepartment.value : 1"
              @change="setSelectedDepartment"
            />
          </div>
          <div class="header_select">
            <header-select
              style="width: 300px; box-sizing: border-box; display: inline-block; border: 0;"
              :options="organizationsOptions" :default-value="currentOrganization ? currentOrganization.value : 0"
              @change="getSelected"
            />
          </div>
          <header-avatar class="header-item"/>
          <a-dropdown class="lang header-item">
            <div>
              <a-icon type="global"/> {{langAlias}}
            </div>
            <template #overlay>
              <a-menu @click="val => setLang(val.key)" :selected-keys="[lang]">
                <a-menu-item v-for=" lang in langList" :key="lang.key">{{lang.key.toLowerCase() + ' ' + lang.name}}</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
      </div>
    </div>
  </a-layout-header>
</template>

<script>
// import HeaderSearch from './HeaderSearch'
// import HeaderNotice from './HeaderNotice'
import HeaderAvatar from './HeaderAvatar'
import HeaderSelect from './HeaderSelect'
import IMenu from '../menu/menu'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

export default {
  name: 'AdminHeader',
  components: {
    IMenu,
    HeaderAvatar,
    HeaderSelect
    // HeaderNotice
    // HeaderSearch
  },
  props: ['collapsed', 'menuData'],
  data () {
    return {
      langList: [
        { key: 'CN', name: '简体中文', alias: '简体' },
        // { key: 'HK', name: '繁體中文', alias: '繁體' },
        { key: 'US', name: 'English', alias: 'English' }
      ],
      searchActive: false
    }
  },
  computed: {
    ...mapState('setting', ['theme', 'isMobile', 'layout', 'systemName', 'lang', 'pageWidth']),
    ...mapGetters('account', ['organizationsOptions', 'currentOrganization', 'departmentsOptions', 'currentDepartment', 'organizationsList']),
    headerTheme () {
      if (this.layout == 'side' && this.theme.mode == 'dark' && !this.isMobile) {
        return 'light'
      }
      return this.theme.mode
    },
    langAlias () {
      const lang = this.langList.find(item => item.key == this.lang)
      return lang.alias
    },
    menuWidth () {
      const { layout, searchActive } = this
      const headWidth = layout === 'head' ? '100% - 188px' : '100%'
      const extraWidth = searchActive ? '600px' : '400px'
      return `calc(${headWidth} - ${extraWidth})`
    }
  },
  methods: {
    ...mapActions('account', ['getAllOrganizations']),
    toggleCollapse () {
      this.$emit('toggleCollapse')
    },
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    },
    /**
     * 兼容 Vue2/3 提取下拉项文本。
     */
    resolveOptionLabel (option) {
      if (!option) {
        return ''
      }
      const propsLabel = option?.data?.props?.label
      if (typeof propsLabel === 'string') {
        return propsLabel.trim()
      }
      const compText = option?.componentOptions?.children?.[0]?.elm?.data
      if (typeof compText === 'string') {
        return compText.trim()
      }
      const children = option?.children
      if (Array.isArray(children) && typeof children[0]?.children === 'string') {
        return children[0].children.trim()
      }
      return ''
    },
    ...mapMutations('setting', ['setLang']),
    ...mapMutations('account', ['setCurrentOrganization', 'setCurrentDepartment']),
    getSelected (val, option) {
      this.setCurrentOrganization({
        value: val,
        label: this.resolveOptionLabel(option),
        orgCode: option?.data?.props?.orgCode
  })
    },
    setSelectedDepartment (val, option) {
      this.setCurrentDepartment({
        value: val,
        label: this.resolveOptionLabel(option)
  })
    }
  },
  created () {
    this.getAllOrganizations()
  }
}
</script>

<style lang="less" scoped>
@import "index";
.header_select{
  display: inline-flex; padding: 0 12px;
  justify-content: center;
  flex-direction: column;
}
</style>
