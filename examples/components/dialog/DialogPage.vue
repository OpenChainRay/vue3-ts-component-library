<template>
  <!--  选择部门角色弹窗  -->
  <a-modal @cancel="sendCancel" :key="key?key:0" v-model="diaShow" draggable :width="width">
    <template v-slot:title >
      <div id="title"><span class="dialog-title">{{title}}</span></div>
      <hr/>
    </template>
    <a-form>
      <div id="body">
        <slot></slot>
      </div>
    </a-form>
    <template v-slot:footer >
      <hr/>
      <span class="dialog-footer" id="footer">
        <a-button size="large" @click="sendCancel">取消</a-button>
        <a-button size="large" type="primary" @click="sendConfirm">确定</a-button >
      </span>
    </template>
  </a-modal>
</template>

<script>
// import {Options, Vue} from "vue-class-component";
// import {Emit} from "vue-property-decorator";
// import {ref} from "vue";

export default {
  data () {
    return {
      show: false,
      diaShow: false
    }
  },
  props: {
    width: String,
    isShow: Boolean,
    title: String,
    Key: Number
  },
  methods: {
  /* 关闭dialog回调 */
  //   @Emit("cancel")
  //   cancel(){

    //   },
    //   /* 确认dialog回调 */
    //   @Emit("confirm")
    //  confirm(){

    //     },

  //   sendCancel(){
  //     this.cancel();
  //   },
  //   sendConfirm(){
  //     this.confirm();
  //   }
  }
}
</script>

<style scoped lang="less">

#title{
  >span{
    display: block;
    font-weight: bolder;
    font-size: 24px;
    text-align:left;
    margin-bottom: 10px;
  }
}
#body {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

</style>
