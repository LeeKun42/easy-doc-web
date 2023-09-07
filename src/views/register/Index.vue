<template>
  <div id="login-page">
    <el-card class="box-card">
      <h2 style="text-align: center;margin-bottom: 20px;">账号注册</h2>
      <el-form ref="registerForm" :model="registerData" label-width="80px" label-position="top">
        <el-form-item label="账号" prop="account" :rules="[{required: true, message: '请输入账号'}]">
          <el-input v-model="registerData.account" />
        </el-form-item>
        <el-form-item label="姓名/昵称" prop="nick_name" :rules="[{required: true, message: '请输入账号'}]">
          <el-input v-model="registerData.nick_name" />
        </el-form-item>
        <el-form-item label="密码" prop="passwd" :rules="[{required: true, message: '请输入密码'}]">
          <el-input v-model="registerData.passwd" type="password"/>
        </el-form-item>
        <el-form-item style="">
          <el-button type="primary" @click="doRegister" style="width: 100%;margin-top: 10px">注册</el-button>
          <el-link type="primary" @click="toLogin">返回登录</el-link>
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
      registerData: {
        account: "",
        nick_name: "",
        passwd: ""
      }
    }
  },
  created() {
  },
  methods: {
    doRegister() {
      this.$refs["registerForm"].validate((valid)=>{
        if (valid){
          this.$fly.post("/api/users", this.registerData).then((res)=>{
            this.$router.replace({path:"/login"})
          })
        }
      })
    },
    toLogin(){
      this.$router.replace({path:"/login"})
    }
  }
}
</script>

<style lang="scss" scoped>
#login-page{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;

  .box-card {
    padding: 10px 30px;
    margin: 280px auto;
    width: 480px;
    height: 430px;
  }
}

</style>