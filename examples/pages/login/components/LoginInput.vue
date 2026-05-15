<template>
  <div>
    <span class="title">{{ title }}</span>
    <input v-if="!password" :placeholder="placeholder"  v-model="val" type="text" />
    <input v-if="password" :placeholder="placeholder"   v-model="val" type="password" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      val: ''
    }
  },
  props: {
    title: String,
    placeholder: String,
    password: {
      type: Boolean,
      default: false
    }
  },
  methods: {
  // @Emit('input')
  // sendInput(val)
  // {

  // },
  // dataInput()
  // {
  //   this.sendInput(this.val);
  // }
  // }
  }
}
</script>

<style lang="less" scoped>
  div {
    width: 60%;

    .title {
      display: block;
      font-weight: bolder;
      font-size: 20px;
      text-align: left;
      margin-bottom: 10px;
    }

    input {
      width: 100%;
      min-width: 80%;
      height: 40px;
      line-height: 40px;
      border: 1px solid #af9f9f;
      border-radius: 5px;

      &:hover {
        border: 1px solid dodgerblue;
      }

      &:focus {
        box-shadow: 0 0 10px dodgerblue;
      }
    }
  }

</style>
