<template>
<div id="edit-page">
  <el-form ref="editForm" :model="info" label-width="100px" label-position="right">
    <el-form-item label="所属目录" prop="directory_id" :rules="[{required: true, message: '请输入接口名称'}]">
      <el-select v-model="info.directory_id" style="width: 300px">
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
      <el-input v-model="info.name" />
    </el-form-item>
    <el-form-item label="接口路径" prop="path" :rules="[{required: true, message: '请输入密码'}]">
      <el-input v-model="info.path" class="input-with-select" >
        <template #prepend>
          <el-select v-model="info.method" style="width: 100px" @change="methodChange">
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
      <el-input v-model="info.seq" />
    </el-form-item>

    <el-divider content-position="left" class="info-divider">请求参数</el-divider>
    <el-tabs type="card" v-model="requestActiveName">
      <el-tab-pane label="Body" name="Body" v-if="info.method!='GET'">
        <el-button type="default" @click="addRequestRootField('body')">添加字段</el-button>
        <el-button type="default" @click="openImportRequestDialog">导入json</el-button>
        <EditParams v-model="info.request_body" type="body"></EditParams>
      </el-tab-pane>
      <el-tab-pane label="Query" name="Query" v-else>
        <el-button type="default" @click="addRequestRootField('query')">添加字段</el-button>
        <EditParams v-model="info.request_query" type="query"></EditParams>
      </el-tab-pane>
      <el-tab-pane label="Path" name="Path">
        <el-button type="default" @click="addRequestRootField('path')">添加字段</el-button>
        <EditParams v-model="info.request_path" type="path"></EditParams>
      </el-tab-pane>
      <el-tab-pane label="Headers" name="Headers">
        <el-button type="default" @click="addRequestRootField('header')">添加字段</el-button>
        <EditParams v-model="info.request_headers" type="header"></EditParams>
      </el-tab-pane>
    </el-tabs>

    <el-divider content-position="left" class="info-divider">响应参数</el-divider>
    <el-button type="default" @click="addRequestRootField('response')">添加字段</el-button>
    <el-button type="default" @click="openImportResponseDialog">导入json</el-button>
    <EditParams v-model="info.response_body" type="body"></EditParams>

    <el-divider content-position="left" class="info-divider">备注</el-divider>
    <div>
      <el-input v-model="info.desc" :rows="10" type="textarea" />
    </div>
  </el-form>

  <el-affix :offset="0" position="bottom">
    <div style="height: 80px;line-height: 80px;text-indent: 2em;">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="returnPage">返回</el-button>
    </div>
  </el-affix>
</div>
</template>

<script>
import EditParams from '@/components/EditParams.vue'
export default {
  name: "Edit",
  components:{
    EditParams
  },
  data() {
    return {
      project_id: 0,
      api_id: 0,
      dirs:[],
      info:{

      },
      requestFormVisible:false,
      requestJsonError:"",
      requestJson:"",
      requestActiveName:"Body"
    }
  },
  created() {
    this.project_id = this.$route.params.project_id
    this.api_id = this.$route.params.api_id
    this.getDirs()
    this.getApi()
  },
  methods: {
    methodChange(val){
      if (val === 'GET'){
        this.requestActiveName = 'Query'
      }else{
        this.requestActiveName = 'Body'
      }
    },
    getDirs(){
      this.$fly.get("/api/projects/" + this.project_id + "/directories").then((res) => {
        this.dirs = res.data.directories
      })
    },
    getApi() {
      this.$fly.get("/api/projects/" + this.project_id + "/apis/" + this.api_id).then((res) => {
        this.info = res.data
        this.info.request_body = JSON.parse(this.info.request_body)
        this.info.request_query = JSON.parse(this.info.request_query)
        this.info.request_path = JSON.parse(this.info.request_path)
        this.info.request_headers = JSON.parse(this.info.request_headers)
        this.info.response_body = JSON.parse(this.info.response_body)
        this.methodChange(this.info.method)
      })
    },
    addRequestRootField(type){
      const item = {
        name: "",
        test_val: "",
        type: "string",
        sub_type: null,
        required: 0,
        is_placeholder: false,
        children:[],
        desc:""
      }
      switch (type) {
        case 'body':
          this.info.request_body.push(item)
          break
        case 'query':
          this.info.request_query.push(item)
          break
        case 'path':
          this.info.request_path.push(item)
          break
        case 'header':
          this.info.request_headers.push(item)
          break
        case 'response':
          this.info.response_body.push(item)
          break
      }
    },
    openImportRequestDialog(){
      this.$importJson.open((res)=>{
        this.info.request_body = res
      })
    },
    openImportResponseDialog(){
      this.$importJson.open((res)=>{
        this.info.response_body = res
      })
    },
    save(){
      let data = JSON.parse(JSON.stringify(this.info))
      data.request_body = JSON.stringify(data.request_body)
      data.request_query = JSON.stringify(data.request_query)
      data.request_path = JSON.stringify(data.request_path)
      data.request_headers = JSON.stringify(data.request_headers)
      data.response_body = JSON.stringify(data.response_body)
      this.$fly.patch("/api/projects/" + this.project_id + "/apis/"+this.api_id, data).then((res) => {
        ElMessage.success('保存成功')
      })
    },
    returnPage(){
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" >
#edit-page{
  padding: 20px;
  background-color: #ffffff;
  padding-bottom: 80px;

  .info-divider{
    margin-top: 60px;
    margin-bottom: 30px;

    .el-divider__text{
      font-weight: bold;
    }
  }
}
</style>