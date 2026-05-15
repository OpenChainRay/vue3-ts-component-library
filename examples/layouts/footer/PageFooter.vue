<template>
  <div class="footer_container">
    <!-- <div class="footer_container__links">
      <a target="_blank" :key="index" :href="item.link ? item.link : 'javascript: void(0)'" v-for="(item, index) in linkList">
        <a-icon v-if="item.icon" :type="item.icon"/>{{ item.name }}
      </a>
    </div> -->
    <!-- <div class="footer_container__copyright">
      Copyright<a-icon type="copyright" />{{copyright}}
    </div> -->
    <div class="footer_container__info">
      <div>
        Copyright © 2015-2018 . All Rights Reserved 天津爱安特精密机械有限公司 版权所有
        <a target="_blank" rel="noreferrer" href="https://beian.miit.gov.cn">
          津ICP备16003673号-1
        </a>
      </div>
      <span>版本号: {{version}}</span>
      <span>推荐浏览器：</span>
      <img width="24px" src="@/assets/icons/icon-chrome.png" />
      <b>(谷歌)</b>
      <img width="24px" src="@/assets/icons/icon-360.png" />
      <b>(360极速)</b>
    </div>
  </div>
</template>

<script>
import appPackage from '/package.json'
export default {
  name: 'PageFooter',
  props: ['copyright', 'linkList'],
  data () {
    return {
      version: appPackage.version
    }
  }
}
</script>

<style lang="less" scoped>
  .footer_container{
    margin: 10px 0;
    /*margin: 48px 0 24px;*/
    box-sizing: border-box;
    text-align: center;
    .footer_container__links{
      margin-bottom: 8px;
      a:not(:last-child) {
        margin-right: 40px;
      }
      a{
        color: @text-color-second;
        -webkit-transition: all .3s;
        transition: all .3s;
      }
    }
    .footer_container__copyright{
      color: @text-color-second;
      font-size: 14px;
      i {
          margin: 0 4px;
      }
    }
    .footer_container__info{
      height: "48px";
      line-height: "48px";
      a,span,img,b{ display: inline-block; vertical-align: middle; font-weight: normal; }
      a,span{ margin-left: 5px; }
    }

  }
</style>
