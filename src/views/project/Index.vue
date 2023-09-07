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
  </el-form>
</div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      project_id: 0,
      project:{}
    }
  },
  created() {
    this.project_id = this.$route.params.project_id
    this.getProject()
  },
  methods: {
    getProject(){
      this.$fly.get("/api/projects/"+this.project_id).then((res)=>{
        this.project = res.data.project
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#project-index{
  background-color: #ffffff;
  padding: 20px;
}
</style>