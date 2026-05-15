<template>
  <a-button>{{name}}</a-button>
</template>

<script>

export default {
  data () {
    return {

    }
  },
  props: {
    name: String
  }
}

</script>

<style scoped>
button {
  width: 60%;
  height: 50px;
  line-height: 50px;
  font-size: 24px;
  word-spacing: 50px;
  border: none;
  border-radius: 5px;
  background-color: dodgerblue;
  color: white;
}
</style>
