<template>
  <el-dialog v-model="visible" title="添加目录" :close-on-click-modal="false" @closed="close" width="680">
    <el-form ref="addDirForm" :model="formData" label-width="100px" label-position="right">
      <el-form-item label="父级目录" prop="parent_id" :rules="[{required: true, message: '请选择父级目录'}]">
        <el-select v-model="formData.parent_id" style="width: 300px" placeholder="请选择父级目录">
          <el-option label="无" :value="0" ></el-option>
          <template v-for="dir in dirs">
            <el-option :label="dir.name" :value="dir.id" >
              <el-icon style="color: var(--el-text-color-secondary);margin-right: 5px;"><icon-ep-folder /></el-icon><span>{{ dir.name }}</span>
            </el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="目录名称" prop="name" :rules="[{required: true, message: '请输入目录名称'}]">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="排序号" prop="seq" :rules="[{required: true, message: '请输入目录排序号'}]">
        <el-input v-model="formData.seq" />
      </el-form-item>
      <el-form-item label="备注" prop="desc">
        <el-input v-model="formData.desc" />
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
  name: "Edit",
  data(){
    return {
      dirs:[],
      projectId: 0,
      success: null,

      formData: {
        parent_id: 0,
        name: "",
        desc: "",
        seq: 20,
      },
      visible: false,
    }
  },
  mounted() {

  },
  methods: {
    open(projectId, callback){
      this.projectId = projectId
      this.success = callback
      this.getDirs()
      this.visible = true
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
      this.$refs["addDirForm"].validate((valid)=> {
        if (valid) {
          this.$fly.post("/api/projects/" + this.projectId + "/directories", this.formData).then((res) => {
            ElMessage.success('添加成功')
            this.visible = false
            this.success()
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>