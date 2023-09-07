<template>
  <el-dialog v-model="visible" title="添加接口" :close-on-click-modal="false" @closed="close" width="680">
    <el-form ref="addForm" :model="formData" label-width="100px" label-position="right">
      <el-form-item label="所属目录" prop="directory_id" :rules="[{required: true, message: '请选择所属目录'}]">
        <el-select v-model="formData.directory_id" style="width: 300px" placeholder="请选择所属目录">
          <template v-for="dir in dirs">
            <el-option :label="dir.name" :value="dir.id" >
              <el-icon style="color: var(--el-text-color-secondary);margin-right: 5px;"><icon-ep-folder /></el-icon><span>{{ dir.name }}</span>
            </el-option>
            <template v-for="sub_dir in dir.children">
              <el-option :label="sub_dir.name" :value="sub_dir.id" >
                <el-icon style="color: var(--el-text-color-secondary);margin-left: 10px;margin-right: 5px;"><icon-ep-folder /></el-icon><span>{{ sub_dir.name }}</span>
              </el-option>
            </template>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="接口名称" prop="name" :rules="[{required: true, message: '请输入接口名称'}]">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="接口路径" prop="path" :rules="[{required: true, message: '请输入接口路径'}]">
        <el-input v-model="formData.path" class="input-with-select" >
          <template #prepend>
            <el-select v-model="formData.method" style="width: 100px">
              <el-option label="GET" value="GET" />
              <el-option label="POST" value="POST" />
              <el-option label="PUT" value="PUT" />
              <el-option label="PATCH" value="PATCH" />
              <el-option label="DELETE" value="DELETE" />
            </el-select>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="排序号" prop="seq">
        <el-input v-model="formData.seq" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="save">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "Add",
  data(){
    return {
      dirs:[],
      projectId: 0,
      dirId: 0,
      success: null,

      formData:{
        directory_id: "",
        name: "",
        method: "POST",
        path: "",
        seq: 20,
      },
      visible: false,
    }
  },
  mounted() {

  },
  methods: {
    open(dirId, projectId, callback){
      this.formData = {
        directory_id: dirId,
        name: "",
        method: "POST",
        path: "",
        seq: 20,
      }
      this.projectId = projectId
      this.success = callback
      this.visible = true
      this.getDirs()
    },
    close() {
      this.visible = false
    },
    getDirs(){
      this.$fly.get("/api/projects/" + this.projectId + "/directories").then((res) => {
        this.dirs = res.data.directories
      })
    },
    save(){
      this.formData.request_body = "[]"
      this.formData.request_query = "[]"
      this.formData.request_path = "[]"
      this.formData.request_headers = "[]"
      this.formData.response_body = "[]"
      this.$refs["addForm"].validate((valid)=> {
        if (valid) {
          this.$fly.post("/api/projects/" + this.projectId + "/apis", this.formData).then((res) => {
            ElMessage.success('添加成功')
            this.visible = false
            this.success(res.data.id)
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>