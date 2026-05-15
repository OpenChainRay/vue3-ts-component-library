<template>
  <div class="topContainer" ref="tContainer">
    <div class="top">
      <div class="btns">
        <slot name="btns" />
      </div>
      <div class="title"><img src='@/assets/img/icon.png' class='imgicon'>{{ title }}</div>

    </div>
    <div class="line"></div>
    <div class="views">

      <div class="custonSelect">
        <div class="viewsLeft">
          <slot name="viewsLeft" />
        </div>
        <div class="viewsRight">
          <slot name="views" />
        </div>

      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
.topContainer {
  border-radius: 8px;
  background: white;
  padding: 15px;
  padding-bottom: 0px;
  margin-bottom: 10px;

  .top {
    display: flex;
    align-items: center;

    .title {
      font-size: 20px;
      font-weight: 600;
      color: black;
      display:flex
    }
    .imgicon{
        width:33px;
        margin-right:5px;
      }

    .btns {
      flex: 1;
      text-align: left;
    }
  }

  .line {
    margin: 10px 0;
    height: 1px;
    background: rgba(30, 31, 32, 0.08);
  }

  .views {
    padding-bottom: 12px;
    .custonSelect {
      display: flex;
      flex: 1;
      justify-content: flex-end;
      align-items: center;

      .viewsLeft {
        justify-self: flex-start;
      }

      .viewsRight{
        flex: 1;
        text-align: right;
        justify-self: flex-end;

      }
    }

    :deep(.main){
      margin-bottom: 5px;
    }

    .pageSearch {
      margin-top: 8px;
    }

    .filter {
      font-size: 14px;
      //color: rgba(53, 113, 255, 1);
      cursor: pointer;
      // margin: 0 10px 0 20px;

      .anticon {
        margin-right: 5px;
      }
    }

  }

}
</style>
