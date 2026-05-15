<template>
  <common-layout>
    <div class="login__container">
      <div class="login__top">
        <div class="login__top__header">
          <img alt="logo" class="header__logo" src="@/assets/img/logo.png" />
          <span class="header__title">爱安特</span>
        </div>
        <div class="login__top__desc">欢迎使用爱安特UMS系统</div>
      </div>
      <div class="login__main">
        <a-form @submit="loginSubmit" ref="form">
          <a-tabs size="large" :tabBarStyle="{textAlign: 'center'}" style="padding: 0 2px;">
            <a-tab-pane tab="账户密码登录" key="1">
              <a-alert type="error" :closable="true" v-show="error" :message="error" showIcon style="margin-bottom: 24px;" />
              <a-form-item>
                <a-input
                  autocomplete="autocomplete"
                  size="large"
                  placeholder="请输入账户名"
                  v-model:value="formModel.name"
                >
                  <a-icon slot="prefix" type="user" />
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-input
                  size="large"
                  placeholder="请输入密码"
                  autocomplete="autocomplete"
                  type="password"
                  v-model:value="formModel.password"
                >
                  <a-icon slot="prefix" type="lock" />
                </a-input>
              </a-form-item>
            </a-tab-pane>
            <!-- <a-tab-pane tab="手机号登录" key="2">
              <a-form-item>
                <a-input size="large" placeholder="mobile number" >
                  <a-icon slot="prefix" type="mobile" />
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-row :gutter="8" style="margin: 0 -4px">
                  <a-col :span="16">
                    <a-input size="large" placeholder="captcha">
                      <a-icon slot="prefix" type="mail" />
                    </a-input>
                  </a-col>
                  <a-col :span="8" style="padding-left: 4px">
                    <a-button style="width: 100%" class="captcha-button" size="large">获取验证码</a-button>
                  </a-col>
                </a-row>
              </a-form-item>
            </a-tab-pane> -->
          </a-tabs>
          <!-- <div>
            <a-checkbox :checked="true" >自动登录</a-checkbox>
            <a style="float: right">忘记密码</a>
          </div> -->
          <a-form-item>
            <a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" htmlType="submit" type="primary">登录</a-button>
          </a-form-item>
          <!-- <div>
            其他登录方式
            <a-icon class="icon" type="alipay-circle" />
            <a-icon class="icon" type="taobao-circle" />
            <a-icon class="icon" type="weibo-circle" />
            <router-link style="float: right" to="/dashboard/workplace" >注册账户</router-link>
          </div> -->
        </a-form>
      </div>
    </div>
    <a-modal
      title="修改初始密码"
      okText="确定"
      width="800px"
      cancelText="取消"
      :visible="userCenterVisible"
      v-if="userCenterVisible"
      :maskClosable="false"
      @cancel="handleCModalCancel"
      @ok="handleCModalOk"
    >
      <user-center ref="UserCenter"></user-center>
    </a-modal>
  </common-layout>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex'
import CommonLayout from '@/layouts/CommonLayout'
import { useLogin } from '@/services/user'
import { setAuthorization } from '@/utils/request'
import { formatAtTree, loadRoutes } from '@/utils/routerUtil'
import UserCenter from './UserCenter'
export default {
  name: 'Login',
  data () {
    return {
      form: null,
      error: '',
      logging: false,
      userCenterVisible: false
    }
  },
  computed: {
    systemName () {
      return this.$store.state.setting.systemName
    },
    ...mapGetters('account', ['user'])
  },
  components: {
    CommonLayout,
    UserCenter
  },
  methods: {
    ...mapMutations('account', ['setUserToken']),
    ...mapActions('account', ['getUserInfo']),
    // 登录
    loginSubmit (event) {
      event.preventDefault()
      // 校验标表单项
      this.$refs.form.validate().then(() => {
        if (true) {
          this.logging = true
          const name = this.formModel.name
          const password = this.formModel.password
          useLogin(name, password).then(this.afterLogin).catch((error) => { throw new Error(error) })
        }
      })
    },
    async afterLogin (res) {
      this.logging = false
      const loginRes = res.data
      if (loginRes.code == 200) {
        const { token } = loginRes.data
        setAuthorization({
          token: token
          // expireAt: new Date(loginRes.data.expireAt)
        })
        this.setUserToken('Bearer ' + token)
        await this.getUserInfo().catch((error) => { throw new Error(error) })
        const routesConfig = formatAtTree(this.user.menuTreeList)
        loadRoutes([{
          router: 'root',
          children: routesConfig
        }])

        if (this.user.passwordOnce == 1) { // 判断是否是第一次登录
          this.userCenterVisible = true// 改密码
        } else {
          this.$router.push('/dashboard/workplace')
        }
      } else {
        this.error = loginRes.msg
      }
    },
    handleCModalCancel () {
      this.userCenterVisible = false
    },
    handleCModalOk () {
      if (this.$refs.UserCenter.checkState()) {
        this.$refs.UserCenter.handleEdit()
        this.userCenterVisible = false
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .login__container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-content: center;
    .login__top {
      text-align: center;
      .login__top__header {
        height: 70px;
        line-height: 70px;
        a {
          text-decoration: none;
        }
        .header__logo {
          height: 70px;
          vertical-align: top;
          margin-right: 16px;
          filter: drop-shadow(0 0.2rem 0.25rem rgba(0, 0, 0, 0.2));
          &:hover{
            filter: brightness(1.3);
          }
        }
        .header__title {
          filter: drop-shadow(0 0.2rem 0.25rem rgba(0, 0, 0, 0.2));
          &:hover{
            filter: brightness(1.3);
          }
          font-size: 33px;
          // color: @title-color;
          color: @primary-color;
          font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
          font-weight: 600;
          position: relative;
          top: 2px;
        }
      }
      .login__top__desc {
        font-size: 14px;
        color: @text-color-second;
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }
    .login__main {
      width: 370px;
      margin: 0 auto;
    }
  }
</style>
