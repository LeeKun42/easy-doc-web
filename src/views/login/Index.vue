<template>
  <div id="login-page">
    <div class="welcome">欢迎使用Easy Doc</div>
    <el-card class="box-card">
      <h2 style="text-align: center;margin-bottom: 20px;">账号登录</h2>
      <el-form ref="loginForm" :model="loginData" label-width="80px" label-position="top">
        <el-form-item label="账号" prop="account" :rules="[{required: true, message: '请输入账号'}]">
          <el-input v-model="loginData.account" />
        </el-form-item>
        <el-form-item label="密码" prop="passwd" :rules="[{required: true, message: '请输入密码'}]">
          <el-input v-model="loginData.passwd" type="password"/>
        </el-form-item>
        <el-form-item style="">
          <el-button type="primary" @click="doLogin" style="width: 100%;margin-top: 10px">登录</el-button>
          <el-link type="primary" @click="toRegister">注册账号</el-link>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Login",
  data(){
    return {
      loginData: {
        account: "",
        passwd: ""
      }
    }
  },
  created() {
  },
  methods: {
    doLogin() {
      this.$refs["loginForm"].validate((valid)=>{
          if (valid){
            this.$fly.get("/api/users/token", this.loginData).then((res)=>{
              this.$storage.set("user.token", res.data.token)
              this.$router.replace({path:"/"})
            })
          }
      })
    },
    toRegister(){
      this.$router.push({path:"/register"})
    }
  }
}
</script>

<style lang="scss" scoped>
#login-page{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .welcome{
    margin-top: 180px;
    font-size: 32px;
    margin-bottom: 20px;
  }
  .box-card {
    padding: 10px 30px 30px 30px;
    width: 460px;
    height: 350px;
  }
}

</style>