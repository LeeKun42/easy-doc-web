<template>
  <div id="index-page">
    <el-header class="header">
      <div style="line-height: 60px;">
        <el-icon size="18px" style="cursor: pointer;" @click="toBack" title="返回上一页"><icon-ep-back /></el-icon>
        <el-icon size="18px" style="cursor: pointer;margin-left: 20px;margin-right: 20px" @click="toHome" title="回到项目主页"><icon-ep-home-filled /></el-icon>
        <label style="font-size: 24px;font-weight: bold;line-height: 50px">Easy Doc</label>
      </div>
      <div class="user-info">
        <UserHead></UserHead>
      </div>
    </el-header>
    <div class="body">
      <div class="info-form">
        <h2 style="margin-bottom: 30px;">个人信息</h2>
        <el-form ref="infoForm" label-width="100px" label-position="left">
          <el-form-item label="姓名/昵称">
            {{$store.state.user.nick_name}}
            <el-button @click="updateInfo('nick_name', $store.state.user.nick_name)" style="margin-left: 20px;">
              <el-icon style="margin-right: 5px;"><icon-ep-edit /></el-icon>修改
            </el-button>
          </el-form-item>
          <el-form-item label="账号">
            {{$store.state.user.account}}
            <el-button @click="updateInfo('account', $store.state.user.account)" style="margin-left: 20px;">
              <el-icon style="margin-right: 5px;"><icon-ep-edit /></el-icon>修改
            </el-button>
          </el-form-item>
          <el-form-item label="注册时间">{{$store.state.user.created_at}}</el-form-item>
          <el-form-item label="密码">
            <div v-if="passwdFormVisible" class="passwd-form">
              <el-input v-model="passwdForm.old_password" type="password" placeholder="旧密码"/><br/>
              <el-input v-model="passwdForm.new_password" type="password" placeholder="新密码"/><br/>
              <el-input v-model="passwdForm.new_password_confirm" type="password" placeholder="确认新密码"/><br/>
              <el-button @click="passwdFormVisible=false">取消</el-button>
              <el-button @click="doUpdatePasswd" type="primary">提交</el-button>
            </div>
            <el-button v-else @click="passwdFormVisible=true">
              <el-icon style="margin-right: 5px;"><icon-ep-edit /></el-icon>修改密码
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import UserHead from '@/views/user/Head.vue'
export default {
  name: "Index",
  components: {
    UserHead
  },
  data(){
    return {
      passwdFormVisible: false,
      passwdForm:{
        old_password:'',
        new_password:'',
        new_password_confirm:''
      }
    }
  },
  created() {
    this.$store.dispatch('pullUser')
  },
  methods: {
    updateInfo(field, val){
      ElMessageBox.prompt('请输入姓名/名称', '修改', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputValue: val,
        inputValidator: function (val) {
          if (val.length<=0){
            return '请输入姓名/名称'
          }
          return true
        },
      }).then(({ value }) => {
        let data = {
          account: this.$store.state.user.account,
          nick_name: this.$store.state.user.nick_name,
        }
        data[field] = value
        this.$fly.patch("/api/users/current", data).then((res) => {
          ElMessage.success('保存成功')
          this.$store.dispatch('pullUser')
        })
      }).catch(() => {

      })
    },
    doUpdatePasswd(){
      if (this.passwdForm.old_password.length<=0 || this.passwdForm.new_password.length<=0 || this.passwdForm.new_password_confirm.length<=0){
        return ElMessage.error('请输入密码')
      }
      if (this.passwdForm.new_password!=this.passwdForm.new_password_confirm){
        return ElMessage.error('两次新密码输入不一致')
      }
      this.$fly.patch("/api/users/password", this.passwdForm).then((res) => {
        ElMessage.success('修改密码成功')
        this.passwdFormVisible = false
        this.passwdForm = {
          old_password: '',
          new_password: '',
          new_password_confirm: ''
        }
        this.$store.dispatch('pullUser')
      })
    },
    toHome(){
      this.$router.replace("/")
    },
    toBack(){
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
#index-page{
  width: 100%;
  height: 100%;

  .header {
    height: 60px;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    justify-content: space-between;
    padding-right: 30px;
    background-color: #ffffff;

    .user-info{
      display: flex;
      align-items: center;
      .el-dropdown-link {
        cursor: pointer;
      }
    }
  }

  .body{
    display: flex;

    .info-form{
      width: 800px;
      margin: 50px auto;
      background-color:#ffffff;
      padding: 30px;

      .passwd-form{
        .el-input{
          margin-top: 10px;
          width: 420px;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>