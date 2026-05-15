<template>
  <div class="common_layout">
    <div class="layout__main"><slot></slot></div>
    <div class="layout__footer">
      <page-footer :link-list="footerLinks" :copyright="copyright"></page-footer>
    </div>
  </div>
</template>

<script>
import PageFooter from '@/layouts/footer/PageFooter'
import { mapState } from 'vuex'

export default {
  name: 'CommonLayout',
  components: { PageFooter },
  computed: {
    ...mapState('setting', ['footerLinks', 'copyright'])
  }
}
</script>

<style scoped lang="less">
.common_layout{
  position: relative;
  height: 100vh;
  min-height: 667px;
  // overflow: auto;
  background-color: @layout-body-background;
  background-image: url('@/assets/img/common_layout_bg.svg');
  background-repeat: no-repeat;
  background-position-x: center;
  background-position-y: 110px;
  background-size: 100%;
  .layout__main{
    position: absolute; overflow: hidden;
    left: 0; right: 0; top: 0;
    height: 91.4vh;
    // display: flex;
    // flex-direction: column;
    // padding: 32px 0;
    // @media (min-width: 768px){
    //   padding: 112px 0 24px;
    // }
  }
  .layout__footer{
    height: 8.5vh; overflow: hidden;
    position: absolute;
    left: 0; right: 0;
    bottom: 0;
  }
}
</style>
