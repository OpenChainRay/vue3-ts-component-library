<template>
  <a-form-item ref="select" model="select" label-width="auto" v-bind:label="label" :key="key" >
    <a-select v-model="item.selectVal" v-bind:placeholder="placeholder" @change="dataChange" >
      <a-select-option v-for="(option) in item.items" :key="option.id" :value="option.id">{{option.name}}</a-select-option>
    </a-select>
  </a-form-item>
</template>

<script >
// import {PropType, reactive} from "vue";
// import {DialogItems} from "@/components/dialog/Model";

// export default {
//   data () {
//     return {
//       options : DialogItems,
//       item: DialogItems = reactive<DialogItems>(this.options)
//     }
//   },
//   props: {
//     label: String,
//     key: Number,
//     placeholder: String,

//     },
//   methods: {

//   sendChange(val){

//   },
//   dataChange(val){
//     this.sendChange(val);
//     }
//   }
// }
</script>

<style scoped lang="less">
</style>
