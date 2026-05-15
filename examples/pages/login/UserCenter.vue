<template>

  <a-form v-bind="{ layout: 'vertical' }" :destroyOnClose="true" ref='formRef'>
  <a-alert
    message="由于您第一次登录，为了保障您的账户信息安全，请先修改初始密码，谢谢！"
    type="warning"
    closable
  />
    <a-form-item label="用户名" :colon="false">
      <a-input
        placeholder="请填写用户名"
        :maxLength="20"
        class = "readonly"
        read-only="read-only"
        v-model:value="formModel.username"
      />
    </a-form-item>
    <a-form-item label="新密码" :colon="false">
      <a-input-password
        placeholder="请输入至少8个至多16个字符(至少包含数字/字母/字符两种组合)"
        :minLength="8"
        :maxLength="16"
        @change=getComplex
        v-model:value="formModel.newPassword"
      />
    </a-form-item>
    <a-form-item label="确认新密码" :colon="false">
      <a-input-password
        placeholder="请再次输入新密码"
        :minLength="8"
        :maxLength="16"
        v-model:value="formModel.confirmNewPassword"
      />
    </a-form-item>

  </a-form>
</template>

<script>
import { mapGetters } from 'vuex'
import { updatePasswordInfo } from '@/services/user'
export default {
  name: 'HeaderAvatar',
  data () {
    return {
      form: null
    }
  },
  computed: {
    ...mapGetters('account', ['user'])
  },
  watch: {
  },
  mounted () {
    this.initUserCenterInfo()
  },
  methods: {
    initUserCenterInfo () {
      this.formModel = { ...this.formModel,
        username: this.user.name
       }
    },
    checkState () {
      let result
      this.$refs.form.validate().then(() => {
        result = true
      }).catch(() => {
        result = false
      })
      return result
    },
    async handleEdit () {
      console.log(this.formModel.newPassword)
      const data = {
        id: this.user.id,
        newPassword: this.formModel.newPassword,
        confirmNewPassword: this.formModel.newPassword
      }
      const result = await updatePasswordInfo(data)
      if (result.data.code == 200) {
        this.$router.push('/dashboard/workplace')
        this.$message.success(result.data.msg)
      } else {
        this.$message.error(result.data.msg)
      }
    },
    equalToNew (rule, value, callback) {
      const form = this.form
      if (value && value !== this.formModel.newPassword) {
        const res = '两次密码不一样'
        callback(res)
      } else {
        callback()
      }
    },
    zeroCount (arr) {
      return arr.reduce((prev, next) => {
        prev[next] = prev[next] + 1 || 1
        return prev
      }, {})
    },
    getComplex () {
      let val = ''
      this.$nextTick(() => {
        val = this.formModel.newPassword
        const result = val
          .split('')
          .map((val) => val.charCodeAt())
          .reduce(
            (pre, val) => {
              if (val < 48) pre.special += 1
              else if (val < 58) pre.num += 1
              else if (val < 65) pre.special += 1
              else if (val < 91) pre.word += 1
              else if (val < 97) pre.special += 1
              else if (val < 123) pre.word += 1
              else pre.special += 1
              return pre
            },
            { num: 0, word: 0, special: 0 }
          )

        const arr = Object.values(result)
        const zCount = this.zeroCount(arr)['0']

        if (!zCount) {
          this.percent = 95
        } else if (zCount === 1) {
          this.percent = 50
        } else {
          this.percent = 28
        }
      })
    }
  }
}
</script>

<style lang="less">
.readonly{
  background-color: #f5f5f5;
  opacity: 1;
  color: rgba(0, 0, 0, 0.25);
  pointer-events: none;
}
.ant-alert.ant-alert-closable{margin-bottom:30px;}
</style>
