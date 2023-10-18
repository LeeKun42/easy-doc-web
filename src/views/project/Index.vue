<template>
<div id="project-index">
  <el-form label-width="100px" label-position="left">
    <el-form-item label="项目名称">
      {{project.name}}
    </el-form-item>
    <el-form-item label="创建人">
      {{project.owner_user}}
    </el-form-item>
    <el-form-item label="创建时间">
      {{project.created_at}}
    </el-form-item>
    <el-form-item >
      <el-upload  :action="host" :limit="1" accept=".json" ref="api-upload"
          :headers="headers" method="PUT" name="api" :show-file-list="false"
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
      >
        <el-button type="primary"><icon-ep-upload /> 导入YApi json数据</el-button>
        <template #tip>
          <div class="el-upload__tip text-red">
            请选择YApi中导出的json文件，自动忽略重复的目录和接口，只导入该项目中不存在的接口
          </div>
        </template>
      </el-upload>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import Storage from "@/lib/storage";

export default {
  name: "Index",
  data() {
    return {
      host:import.meta.env.EASY_DOC_SERVER_HOST + '/api/projects/8/apis',
      headers:{
        'X-Tag': import.meta.env.EASY_DOC_APP_NAME,
        'Accept': 'application/json',
        'ContentType': 'application/json',
        'Authorization': 'Bearer ' + Storage.get("user.token")
      },
      project_id: 0,
      project:{}
    }
  },
  created() {
    console.log(this.host)
    this.project_id = this.$route.params.project_id
    this.getProject()
  },
  methods: {
    getProject(){
      this.$fly.get("/api/projects/"+this.project_id).then((res)=>{
        this.project = res.data.project
      })
    },
    beforeUpload(rawFile){
      if (rawFile.size / 1024 / 1024 > 5) {
        ElMessage.error('文件大小不能超过5MB!')
        return false
      }else if (rawFile.type !== 'application/json') {
        ElMessage.error('只能导入json文件')
        return false
      }
      return true

    },
    handleSuccess(response, uploadFile){
      console.log(response, uploadFile)
      if (response.code==0){
        ElMessage.success('导入成功成功')
        window.location.reload()
      }else{
        ElMessage.error(response.message)
      }
      this.$refs["api-upload"].clearFiles()
    }
  }
}
</script>

<style lang="scss" scoped>
#project-index{
  background-color: #ffffff;
  padding: 20px;
  .text-red{
    color: red;
  }
}
</style>