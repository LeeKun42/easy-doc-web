<template>
  <div class="params-comp">
    <template v-for="(param, index) in modelValue">
      <div class="params-row" >
        <div class="name">
          <span class="placeholder" v-for="i in seq"></span>
          <el-input v-model="param.name" :disabled="param.is_placeholder" placeholder="参数名称"/>
        </div>
        <div class="type">
          <el-select v-model="param.type" style="width: 100px" @change="(val)=>{typeChange(val, param)}" placeholder="参数类型">
            <el-option label="string" value="string" />
            <el-option v-if="type=='body'" label="number" value="number" />
            <el-option v-if="type=='body'" label="object" value="object" />
            <el-option v-if="type=='body' && !param.is_placeholder" label="array" value="array" />
            <el-option v-if="type=='body'" label="boolean" value="boolean" />
          </el-select>
        </div>
        <div class="required">
          <el-checkbox v-model="param.required" :true-label="1" :false-label="0" title="是否必须" label="必须"/>
        </div>
        <div class="test_val">
          <el-input v-model="param.test_val" placeholder="参数示例值"/>
        </div>
        <div class="desc">
          <el-input v-model="param.desc" placeholder="参数说明"/>
        </div>
        <div class="option">
          <el-icon class="optbtn" title="删除字段" v-if="!param.is_placeholder" @click="removeField(param, index)"><icon-ep-close /></el-icon>
          <el-icon class="optbtn" :title="param.type=='object'?'添加子字段':'添加兄弟字段'" @click="addField(param, index)"><icon-ep-plus /></el-icon>
        </div>
      </div>
      <template v-if="param.children.length>0">
        <EditParams v-model="param.children" :seq="subIndex"></EditParams>
      </template>
    </template>
  </div>
</template>

<script>

export default {
  name: "EditParams",
  components:{

  },
  props:{
    modelValue:{
    },
    type:{
      type: String,
      default: 'body'
    },
    seq:{
      type: Number,
      default: 0
    }
  },
  emits: ['update:modelValue'],
  data(){
    return {
      subIndex:0,
    }
  },
  created() {
    this.subIndex = this.seq + 1
  },
  methods:{
    typeChange(val, param){
      if (param.type=='object'){
        param.children = [{
          name: "",
          test_val: "",
          type: "string",
          sub_type: null,
          required: 0,
          is_placeholder: false,
          children:[],
          desc:""
        }]
      }else if (param.type=='array'){
        param.children = [{
          name: "items",
          test_val: "",
          type: "string",
          sub_type: null,
          required: 0,
          is_placeholder: true,
          children:[],
          desc:""
        }]
      }else{
        param.children = []
      }
    },
    removeField(param, index){
      this.modelValue.splice(index, 1)
    },
    addField(param, index){
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
      if (param.type=='object'){
        param.children.push(item)
      }else{
        this.modelValue.splice(index+1, 0, item)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.params-comp{
  .placeholder{
    display: inline-block;
    width: 2em;
  }

  .params-row{
    display: flex;
    padding: 5px;

    .name{
      width: 360px;
      margin-right: 20px;
      display: flex;
    }

    .type{
      width: 120px;
      margin-right: 20px;
    }

    .required{
      width: 80px;
      margin-right: 20px;
    }

    .test_val{
      width: 260px;
      margin-right: 20px;
    }

    .desc{
      flex-grow: 1;
    }

    .option{
      width: 120px;

      .optbtn{
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }

  .params-row:hover{
    background-color: #F0F2F5;
  }
}

</style>