<template>
  <div class="side-setting">
    预留功能
  </div>
</template>
<script>
export default {
  name: 'Setting'
}
</script>
<style lang="less" scoped>
  .side-setting {
    min-height: 100%;
    background-color: @base-bg-color;
    padding: 24px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
    position: relative;

    .flex {
      display: flex;
    }

    .select-item {
      width: 80px;
    }
  }
</style>
