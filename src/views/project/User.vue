<template>
  <el-dialog v-model="visible" :title="project.name+' 成员管理'" :close-on-click-modal="false" @closed="close" width="680">
    <div>
      <el-input v-model="account" placeholder="输入要添加的账号">
        <template #append>
          <el-button @click="addUser" type="primary">添加</el-button>
        </template>
      </el-input>
    </div>
    <div style="margin-top: 30px">
      <el-table :data="users" style="width: 100%">
        <el-table-column prop="nick_name" label="姓名/昵称" width="200" />
        <el-table-column prop="account" label="账号" />
        <el-table-column  label="删除" width="100" align="center">
          <template #default="scope">
            <template v-if="scope.row.id==project.owner_user_id">
              项目拥有者
            </template>
            <template v-else-if="scope.row.id==$store.state.user.id">
              您自己
            </template>
            <template v-else>
              <el-button link type="primary" size="small" @click="deleteUser(scope.row.id)" >删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "User",
  data(){
    return {
      project: 0,
      account:"",
      users:[],
      visible: false,
    }
  },
  mounted() {

  },
  methods: {
    open(project){
      this.project = project
      this.getUsers()
      this.visible = true
    },
    close() {
      this.visible = false
    },
    getUsers(){
      this.$fly.get("/api/projects/" + this.project.id + "/users").then((res) => {
        this.users = res.data.users
      })
    },
    addUser(){
      if (this.account.length<=0){
        return ElMessage.error('请输入要添加的账号')
      }
      this.$fly.post("/api/projects/" + this.project.id + "/users",{account:this.account}).then((res) => {
        ElMessage.success('添加成功')
        this.account= ""
        this.getUsers()
      })
    },
    deleteUser(userId){
      this.$fly.delete("/api/projects/" + this.project.id + "/users/"+userId).then((res) => {
        ElMessage.success('删除成功')
        this.getUsers()
      })
    }
  }
}
</script>

<style scoped>

</style>