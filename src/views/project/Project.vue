<template>
  <div id="dir-page">
    <el-container class="dir-container">
      <el-aside width="260px">
        <el-menu class="dir-menu"
           :router="true"
           :default-active="activeIndex"
            @open="handleOpen"
            @close="handleClose"
        >
          <el-button @click="addDir" style="width: 100%;" size="large">
            <el-icon style="margin-right: 5px;"><icon-ep-plus /></el-icon>添加目录
          </el-button>
          <template v-for="dir in directories">
            <el-sub-menu :index="dir.id+''">
              <template #title>
                <span>{{ dir.name }}</span>
                <span class="opt">
                  <el-icon size="14px" @click.stop="addApi(dir.id)" title="添加接口"><icon-ep-plus /></el-icon>
                  <el-icon size="14px" @click.stop="editDir(dir)" title="编辑目录"><icon-ep-edit /></el-icon>
                  <el-icon size="14px" @click.stop="deleteDir(dir.id)" title="删除目录"><icon-ep-delete /></el-icon>
                </span>
              </template>
              <template v-for="api in dir.apis">
                <el-menu-item :index="api.id+''" :route="{path:'/project/'+this.project_id+'/api/'+api.id}">
                  {{api.name}}
                  <span class="opt">
                    <el-icon size="14px" @click.stop="copyApi(api.id)" title="复制"><icon-ep-document-copy /></el-icon>
                    <el-icon size="14px" @click.stop="deleteApi(api.id)" title="删除"><icon-ep-delete /></el-icon>
                  </span>
                </el-menu-item>
              </template>
              <template v-for="children_dir in dir.children">
                <el-sub-menu :index="children_dir.id+''">
                  <template #title>
                    <span>{{ children_dir.name }}</span>
                    <span class="opt">
                      <el-icon size="14px" @click.stop="addApi(children_dir.id)" title="添加接口"><icon-ep-plus /></el-icon>
                      <el-icon size="14px" @click.stop="editDir(children_dir)" title="编辑目录"><icon-ep-edit /></el-icon>
                      <el-icon size="14px" @click.stop="deleteDir(children_dir.id)" title="删除目录"><icon-ep-delete /></el-icon>
                    </span>
                  </template>
                  <template v-for="children_api in children_dir.apis">
                    <el-menu-item :index="children_api.id+''"  :route="{path:'/project/'+this.project_id+'/api/'+children_api.id}">
                      {{children_api.name}}
                      <span class="opt">
                      <el-icon size="14px" @click.stop="copyApi(children_api.id)" title="复制"><icon-ep-document-copy /></el-icon>
                      <el-icon size="14px" @click.stop="deleteApi(children_api.id)" title="删除"><icon-ep-delete /></el-icon>
                    </span>
                    </el-menu-item>
                  </template>
                </el-sub-menu>
              </template>
            </el-sub-menu>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
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
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

    <AddApi ref="add-api-dialog"></AddApi>
    <AddDir ref="add-dir-dialog"></AddDir>
    <EditDir ref="edit-dir-dialog"></EditDir>
  </div>
</template>

<script>
import AddApi from '@/views/api/Add.vue'
import EditDir from '@/views/dir/Edit.vue'
import AddDir from '@/views/dir/Add.vue'
import UserHead from '@/views/user/Head.vue'
export default {
  name: "Project",
  components: {
    AddApi,
    AddDir,
    EditDir,
    UserHead
  },
  data(){
    return {
      addApiVisible:false,
      selectDirId: 0,
      project_id: 0,
      activeIndex:0,
      directories:[]
    }
  },
  created() {
    this.$store.dispatch('pullUser')
    this.project_id = this.$route.params.project_id
    this.activeIndex = this.$route.params.api_id+''
    this.getApis()
  },
  methods: {
    getApis() {
      this.$fly.get("/api/projects/"+this.project_id+"/apis").then((res)=>{
        this.directories = res.data.directories
      })
    },
    handleOpen(key, path){

    },
    handleClose(key, path){

    },
    addApi(dirId){
      this.$refs['add-api-dialog'].open(dirId, this.project_id, this.addApiSuccess)
    },
    addApiSuccess(id){
      this.getApis()
      this.$router.push({path:"/project/"+this.project_id+"/api/"+id})
      this.activeIndex = id+''
    },
    copyApi(id){
      this.$fly.post("/api/projects/" + this.project_id + "/apis/"+id).then((res) => {
        ElMessage.success('复制成功成功')
        this.getApis()
        this.$router.push({path:"/project/"+this.project_id+"/api/"+res.data.id})
        this.activeIndex = res.data.id+''
      })
    },
    deleteApi(id){
      ElMessageBox.confirm(
          '确定要删除接口？删除后将无法恢复',
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false,
            type: 'warning',
          }
      ).then(() => {
        this.$fly.delete("/api/projects/"+this.project_id+"/apis/"+id).then((res)=>{
          ElMessage.success('删除成功')
          this.getApis()
        })
      }).catch(() => {

      })
    },
    addDir() {
      this.$refs['add-dir-dialog'].open(this.project_id, this.getApis)
    },
    editDir(dir){
      this.$refs['edit-dir-dialog'].open(dir.id, this.project_id, this.getApis)
    },
    deleteDir(id){
      ElMessageBox.confirm(
          '确定要删除目录？目录下的所有接口都会被删除，删除后将无法恢复',
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false,
            type: 'warning',
          }
      ).then(() => {
        this.$fly.delete("/api/projects/"+this.project_id+"/directories/"+id).then((res)=>{
          ElMessage.success('删除成功')
          this.getApis()
        })
      }).catch(() => {

      })
    },
    handleCommand(cmd){
      switch (cmd) {
        case 'logout':
          this.$fly.delete('/api/users/token').then((res)=>{
            this.$store.commit('logout')
            this.$storage.remove('user.token')
            this.$router.replace("/login")
          })
          break
      }
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

<style lang="scss" >
#dir-page{
  .dir-container{

    .dir-menu{

      .el-menu-item{
        justify-content: space-between;
        .opt{
          display: none;
          .el-icon{
            margin-right: 0;
          }
          .el-icon:hover{
            color: var(--el-color-primary);
          }
        }
      }
      .el-menu-item:hover .opt{
        display: inline-block;
      }

      .el-sub-menu__title{
        justify-content: space-between;

        .opt{
          display: none;
          .el-icon{
            margin-right: 0;
          }
          .el-icon:hover{
            color: var(--el-color-primary);
          }
        }
      }

      .el-sub-menu__title:hover .opt{
        display: inline-block;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
#dir-page{
  width: 100%;
  height: 100%;

  .dir-container{
    height: 100%;

    .dir-menu{
      height: 100%;
    }
  }

  .header{
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
}
</style>