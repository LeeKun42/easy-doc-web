<template>
  <el-dropdown @command="handleCommand">
    <span class="el-dropdown-link">
      {{$store.state.user.nick_name}}
      <el-icon class="el-icon--right"><icon-ep-arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="profile">个人信息</el-dropdown-item>
        <el-dropdown-item command="logout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
export default {
  name: "Head",
  created() {
    this.$store.dispatch('pullUser')
  },
  methods: {
    handleCommand(cmd){
      switch (cmd) {
        case 'profile':
          this.$router.push("/user")
          break
        case 'logout':
          this.$fly.delete('/api/users/token').then((res)=>{
            this.$store.commit('logout')
            this.$storage.remove('user.token')
            this.$router.replace("/login")
          })
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dropdown-link {
  cursor: pointer;
}
</style>