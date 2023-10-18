<template>
  <div id="api-page" v-if="info.id">
    <div class="base-info">
      <div>
        <h3 style="display: inline-block;">{{info.name}}</h3>
        <el-button @click="toEditPage" style="margin-left: 20px;margin-top: -5px">
          <el-icon style="margin-right: 5px;"><icon-ep-edit /></el-icon>编辑
        </el-button>
      </div>
      <div class="path-method">
        <div class="method">{{info.method}}</div>
        <div class="path">{{info.path}}
          <el-icon style="margin-left: 10px;cursor: pointer;margin-top: 3px;" title="复制api地址" @click="doCopy(info.path)"><icon-ep-document-copy /></el-icon>
        </div>
      </div>
    </div>
    <div class="desc">
      <h3>备注</h3>
      <div v-html="info.desc"></div>
    </div>
    <div class="request-box">
      <h3>请求参数</h3>
      <div v-if="info.request_headers.length>0">
        <p>Headers</p>
        <ParamsTable :data="info.request_headers"></ParamsTable>
      </div>
      <div v-if="info.request_query.length>0">
        <p>Query参数</p>
        <ParamsTable :data="info.request_query"></ParamsTable>
      </div>
      <div v-if="info.request_path.length>0">
        <p>Path参数</p>
        <ParamsTable :data="info.request_path"></ParamsTable>
      </div>
      <div v-if="info.request_body.length>0">
        <p>Body</p>
        <ParamsTable :data="info.request_body"></ParamsTable>
      </div>
    </div>
    <div class="response-box">
      <h3>响应参数</h3>
      <ParamsTable :data="info.response_body"></ParamsTable>
    </div>
  </div>
</template>

<script>
import ParamsTable from '@/components/ParamsTable.vue'
export default {
  name: "Api",
  components:{
    ParamsTable
  },
  data(){
    return {
      project_id: 0,
      api_id: 0,
      info: {}
    }
  },
  watch: {
    $route(to, from) {//当前页面路由发生变化
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    init(){
      this.project_id = this.$route.params.project_id
      this.api_id = this.$route.params.api_id
      if (this.api_id){
        this.getApi()
      }
    },
    getApi() {
      this.$fly.get("/api/projects/"+this.project_id+"/apis/"+this.api_id).then((res)=>{
        this.info = res.data
        this.info.request_body = JSON.parse(this.info.request_body)
        this.info.request_query = JSON.parse(this.info.request_query)
        this.info.request_path = JSON.parse(this.info.request_path)
        this.info.request_headers = JSON.parse(this.info.request_headers)
        this.info.response_body = JSON.parse(this.info.response_body)
        console.log('response_body',this.info.response_body)
      })
    },
    toEditPage(){
      this.$router.push({path:"/project/"+this.project_id+"/edit/"+this.api_id})
    }
  }
}
</script>

<style lang="scss" scoped>
#api-page{
  padding: 20px;
  background-color: #ffffff;

  .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
  }

  h3 {
    font-weight: bold;
  }
  .base-info{
    .path-method{
      display: flex;
      height: 50px;
      line-height: 50px;

      .method{
        width: 80px;
        text-align: center;
      }

      .path{
        flex-grow: 1;
      }
    }

    margin-bottom: 20px;
  }

  .desc{
    margin-bottom: 20px;
    p{
      padding: 20px;
    }
  }

  .request-box {
    margin-bottom: 20px;
  }

  .response-box {
    margin-bottom: 20px;
  }

  .params-table{
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  .params-table th{
    font-weight: normal;
    text-align: left;
    border: 1px solid #dcdfe6;
    padding: 6px;
  }
  .params-table td{
    border: 1px solid #dcdfe6;
    padding: 6px;
  }
}
</style>