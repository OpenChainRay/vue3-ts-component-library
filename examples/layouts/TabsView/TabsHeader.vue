<template>
  <div :class="['tabs-head', layout, pageWidth]">
    <a-tabs
      type="editable-card"
      :class="['tabs_container', layout, pageWidth,
      {'affixed' : affixed, 'fixed-header' : fixedHeader, 'collapsed' : baseLayout.collapsed}]"
      :active-key="active"
      :hide-add="true"
    >
    <!-- 标签栏悬浮锁定按钮 -->
      <!-- <a-tooltip placement="left" :title="lockTitle" slot="tabBarExtraContent">
        <a-icon
            theme="filled"
            @click="onLockClick"
            class="header-lock"
            :type="fixedTabs ? 'lock' : 'unlock'"
        />
      </a-tooltip> -->
      <a-tab-pane v-for="page in pageList" :key="page.fullPath" :closable="false">
        <template #tab>
          <div class="tab" @contextmenu="e => onContextmenu(page.path, e)">
          <component
            :is="page.loading ? 'LoadingOutlined' : 'SyncOutlined'"
            @click="onRefresh(page)"
            :class="['icon-sync', {'hide': page.fullPath !== active && !page.loading}]"
          />
          <div class="title" @click="onTabClick(page.fullPath)" >{{pageName(page)}}</div>
          <CloseOutlined v-if="!page.unclose" @click="onClose(page.fullPath)" class="icon-close"/>
          </div>
        </template>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { CloseOutlined, LoadingOutlined, SyncOutlined } from '@ant-design/icons-vue'
import { getI18nKey } from '@/utils/routerUtil'
export default {
  name: 'TabsHeader',
  i18n: {
    messages: {
      CN: {
        lock: '点击锁定页签头',
        unlock: '点击解除锁定'
      },
      HK: {
        lock: '點擊鎖定頁簽頭',
        unlock: '點擊解除鎖定'
      },
      US: {
        lock: 'click to lock the tabs head',
        unlock: 'click to unlock'
      }
    }
  },
  props: {
    pageList: Array,
    active: String,
    fixed: Boolean
  },
  components: {
    CloseOutlined,
    LoadingOutlined,
    SyncOutlined
  },
  data () {
    return {
      affixed: false
    }
  },
  inject: ['baseLayout'],
  created () {
    this.affixed = this.fixedTabs
  },
  computed: {
    ...mapState('setting', ['layout', 'pageWidth', 'fixedHeader', 'fixedTabs', 'customTitles']),
    lockTitle () {
      return this.$t(this.fixedTabs ? 'unlock' : 'lock')
    }
  },
  methods: {
    ...mapMutations('setting', ['setFixedTabs']),
    onLockClick () {
      this.setFixedTabs(!this.fixedTabs)
      if (this.fixedTabs) {
        setTimeout(() => {
          this.affixed = true
        }, 200)
      } else {
        this.affixed = false
      }
    },
    onTabClick (key) {
      if (this.active !== key) {
        this.$emit('change', key)
      }
    },
    onClose (key) {
      this.$emit('close', key)
    },
    // 刷新标签
    onRefresh (page) {
      this.$emit('refresh', page.fullPath, page)
    },
    onContextmenu (pageKey, e) {
      this.$emit('contextmenu', pageKey, e)
    },
    pageName (page) {
      const pagePath = page.fullPath.split('?')[0]
      const custom = this.customTitles.find(item => item.path === pagePath)
      const defaultTitle = this.$t(getI18nKey(page.keyPath || page.path || page.fullPath || '/'))
      return (custom && custom.title) || page.title || defaultTitle || page.path || page.fullPath || 'Untitled'
    }
  }
}
</script>
<style scoped lang="less">
  .tab{
    margin: 0 -16px;
    padding: 0 16px;
    font-size: 14px;
    user-select: none;
    transition: all 0.2s;
    .title{
      display: inline-block;
      height: 100%;
    }
    .icon-close{
      font-size: 12px;
      margin-left: 6px;
      margin-right: -4px !important;
      color: @text-color-second;
      &:hover{
        color: @text-color;
      }
    }
    .icon-sync{
      margin-left: -4px;
      color: @primary-4;
      transition: all 0.3s ease-in-out;
      &:hover{
        color: @primary-color;
      }
      font-size: 14px;
      &.hide{
        font-size: 0;
      }
    }
  }
  .tabs-head{
    margin: 0 auto;
    &.head.fixed{
      width: 1400px;
    }
  }
  .tabs_container{
    margin: -16px auto 8px;
    transition: top,left 0.2s;
    :deep(.ant-tabs-card-bar div.ant-tabs-nav-container){
      height: 45px;
    }
    :deep(.ant-tabs-card-bar div.ant-tabs-tab){
    height: 40px;
    padding: 0 30px 0 30px;
    margin-top: 5.95px;
    margin-right: -18px;
    line-height: 40px;
    text-align: center;
    border: 0;
    outline: none;
    z-index: auto;
    transition: padding .3s cubic-bezier(.645,.045,.355,1)!important;
      &:hover{
        -webkit-mask: url('./assets/img/mask_bg.png');
        mask: url('./assets/img/mask_bg.png');
        mask-size: 100% 100%;
        -webkit-mask-size: 100% 100%;
        color: #515a6e;
        background: #dee1e6;
        z-index: 2;
      }
    }
    :deep(.ant-tabs-card-bar div.ant-tabs-tab-active){
      color: @primary-color!important;
      background: @primary-1 !important;
      -webkit-mask: url('./assets/img/mask_bg.png');
      mask: url('./assets/img/mask_bg.png');
      mask-size: 100% 100%;
      -webkit-mask-size: 100% 100%;
      z-index: 1;
    }
    .header-lock{
      font-size: 18px;
      cursor: pointer;
      color: @primary-3;
      &:hover{
        color: @primary-color;
      }
    }
    &.affixed{
      margin: 0 auto;
      top: 0px;
      padding: 8px 24px 0;
      position: fixed;
      height: 48px;
      z-index: 1;
      background-color: @layout-body-background;
      &.side,&.mix{
        right: 0;
        left: 256px;
        &.collapsed{
          left: 80px;
        }
      }
      &.head{
        width: inherit;
        padding: 8px 0 0;
        &.fluid{
          left: 0;
          right: 0;
          padding: 8px 24px 0;
        }
      }
      &.fixed-header{
        top: 64px;
      }
    }
  }
  .virtual-tabs{
    height: 48px;
  }
</style>
