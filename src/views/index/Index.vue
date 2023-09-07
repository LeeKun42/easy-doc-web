<template>
  <div id="index-page">
    <el-header class="header">
      <div>
        <label style="font-size: 24px;font-weight: bold;line-height: 50px">Easy Doc</label>
      </div>
      <div class="user-info">
        <UserHead></UserHead>
      </div>
    </el-header>
    <div class="body">
      <el-card class="project-card" v-for="project in projects">
        <h2 @click="toApiPage(project.id)" style="display: inline-block">{{project.name}}</h2>
        <el-dropdown @command="handleCommand" v-if="project.owner_user_id==$store.state.user.id" class="opt">
          <span class="el-dropdown-link">
            <el-icon size="16px" title="项目设置"><icon-ep-setting /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :command="{cmd:'user-manage', project:project}">成员管理</el-dropdown-item>
              <el-dropdown-item :command="{cmd:'delete', project:project}">删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

      </el-card>
      <el-icon size="50px" @click="addProject" title="创建项目" class="addBtn"><icon-ep-plus /></el-icon>
    </div>

    <ProjectUser ref="project-user-dialog"></ProjectUser>
  </div>
</template>

<script>
import UserHead from '@/views/user/Head.vue'
import ProjectUser from '@/views/project/User.vue'
export default {
  name: "Index",
  components: {
    UserHead,
    ProjectUser
  },
  data(){
    return {
      projects:[]
    }
  },
  created() {
    this.$store.dispatch('pullUser')
    this.getProjects()
  },
  methods: {
    getProjects() {
      this.$fly.get("/api/projects").then((res)=>{
        this.projects = res.data
      })
    },
    toApiPage(id){
      this.$router.push({path:"/project/"+id})
    },
    addProject(){
      ElMessageBox.prompt('请输入项目名称', '创建项目', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputValue: "",
        inputValidator: function (val) {
          if (val.length<=0){
            return '请输入项目名称'
          }
          return true
        },
      }).then(({ value }) => {
        let data = {
          name: value
        }
        this.$fly.post("/api/projects", data).then((res) => {
          ElMessage.success('创建项目成功')
          this.getProjects()
        })
      }).catch(() => {

      })
    },
    handleCommand(cmd){
      switch (cmd.cmd) {
        case 'user-manage':
          this.$refs['project-user-dialog'].open(cmd.project)
          break
        case 'delete':
          ElMessageBox.confirm(
              '确定要删除项目？删除项目将会删除项目中所有数据，且无法回复',
              '警告',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,
                type: 'warning',
              }
          ).then(() => {
            this.$fly.delete("/api/projects/"+cmd.project.id).then((res)=>{
              ElMessage.success('删除成功')
              this.getProjects()
            })
          }).catch(() => {

          })
          break
      }
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

    .project-card{
      width: 260px;
      height: 100px;
      margin: 50px;
      cursor: pointer;
    }

    .opt{
      float: right;
      display: none;
    }

    .project-card:hover .opt{
      display: inline-block;
    }

    .addBtn{
      cursor: pointer;
      width: 100px;
      height: 100px;
      font-size: 50px;
      margin: 50px;
      border: 1px solid #dcdfe6;
      font-weight: normal;
    }
  }
}
</style>