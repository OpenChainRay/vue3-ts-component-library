<template>
  <div class="login-box flex-wrap" :style="background">
    <div class="flex-wrap">
      <div :style="backgroundLeftImg" />
      <div class="flex-wrap" :style="backgroundRightImg">
        <div class="flex-wrap-column">
          <p>登 录</p>
          <form class="flex-wrap-column" >
            <slot></slot>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const loginAssets = import.meta.glob('../assets/*', { eager: true, import: 'default' })

/**
 * 获取登录页静态资源地址。
 */
function resolveLoginAssetUrl (fileName) {
  const assetPath = `../assets/${fileName}`
  return loginAssets[assetPath] || ''
}

export default {
  data () {
    return {
      /* 背景图片 */
      background: {
        backgroundImage: 'url(' + resolveLoginAssetUrl(this.bgImg) + ')',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'cover'
      },
      /* 登录左边的背景 */
      backgroundLeftImg: {
        backgroundImage: 'url(' + resolveLoginAssetUrl(this.bgLeftImg) + ')',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'cover'
      },
      /* 登录右边的背景 */
      backgroundRightImg: {
        backgroundImage: 'url(' + resolveLoginAssetUrl(this.bgRightImg) + ')',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'cover'
      }
    }
  },
  props: {
    bgImg: String, /* 背景图片 */
    bgLeftImg: String, /* 登录左边的背景 */
    bgRightImg: String/* 登录右边的背景 */
  }
}
</script>

<style lang="less" scoped>
.flex-wrap{
  display: flex;
  align-items: center;
  justify-content: center;
}
.flex-wrap-column {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
}

.login-box {
  height: 100%;
  width: 100%;
  min-width: 1000px;
  background-size: 100% 100%;

  >div {
    width: 60%;
    height: 70%;
    border-radius: 60px;
    overflow:hidden;

    >div {
      width: 50%;
      height: 100%;
      background-size: 100% 100%;

      >div {
        height: 80%;
        width: 100%;
        >p {
          height: 40px;
          line-height: 40px;
          font-size: 40px;
          word-spacing: 50px;
          font-weight: bolder;
          text-align:center;
        }
        >form {
          width: 100%;
          height: 70%;
        }
      }
    }
  }
}
</style>
