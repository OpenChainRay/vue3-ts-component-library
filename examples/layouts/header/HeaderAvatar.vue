<template>
  <a-dropdown>
    <div class="header-avatar" style="cursor: pointer">
      <a-avatar class="avatar" size="small" shape="circle" :src="user.avatar || localAvatar"/>
      <span class="name">{{user.name || 'name'}}</span>
    </div>
    <template #overlay>
      <a-menu :class="['avatar-menu']">
        <a-menu-item>
          <a-icon type="user" />
          <span>个人中心</span>
        </a-menu-item>
        <a-menu-item>
          <a-icon type="setting" />
          <span>设置</span>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item @click="logout">
          <a-icon style="margin-right: 8px;" type="poweroff" />
          <span>退出登录</span>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script>
import { mapGetters } from 'vuex'
import { logout } from '@/services/user'
import localAvatar from './assets/img/avatar.png'
export default {
  name: 'HeaderAvatar',
  data () {
    return {
      localAvatar
    }
  },
  computed: {
    ...mapGetters('account', ['user'])
  },
  watch: {
    user (val) {
      console.log('val', val)
    }
  },
  methods: {
    logout () {
      logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less">
  .header-avatar{
    display: inline-flex;
    .avatar, .name{
      align-self: center;
    }
    .avatar{
      margin-right: 8px;
    }
    .name{
      font-weight: 500;
    }
  }
  .avatar-menu{
    width: 150px;
  }

</style>
