<template>
  <el-dialog v-model="show" title="导入json" :close-on-click-modal="false" @closed="close">
    <el-input v-model="requestJson" :rows="22" type="textarea" />
    <label style="color: red;" v-if="requestJsonError!=''">{{requestJsonError}}</label>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="importRequestJson">确定导入</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "ImportJson",
  props:{
    visible:{
      type: Boolean,
      default: false
    },
    callback: {
      type: Function
    }
  },
  data(){
    return {
      resData: [],
      requestJsonError:"",
      requestJson:"",
      show: false
    }
  },
  mounted() {
    this.show = this.visible
  },
  methods: {
    close(){
      this.show = false
    },
    importRequestJson(){
      this.requestJsonError = ""
      try{
        const json = JSON.parse(this.requestJson)
        const formData = this.json2Form(json)
        this.resData = formData
        this.callback(this.resData)
        this.show = false;
      }catch (e) {
        this.requestJsonError = e.message
      }
    },
    json2Form(jsonObject){
      const formData = []
      for (const [key, val] of Object.entries(jsonObject)){
        let type = typeof val
        if (Array.isArray(val)){
          type = 'array'
        }

        const row = {
          name: key,
          test_val: val,
          type: type,
          sub_type: null,
          required: 0,
          is_placeholder: false,
          children:[],
          desc:""
        }
        if (type=='object'){
          row.test_val = null
          row.children = this.json2Form(val)
        }else if (type=="array"){
          row.test_val = null
          if (val.length>0){
            const item = val[0]
            const sub_type = typeof item
            //row.sub_type = sub_type
            const subRow = {
              name: "items",
              test_val: "",
              type: sub_type,
              sub_type: null,
              required: 0,
              is_placeholder: true,
              children:[],
              desc:""
            }

            if (sub_type=='object'){
              subRow.children = this.json2Form(item)
            }

            row.children = [subRow]
          }
        }
        formData.push(row)
      }
      return formData
    }
  }
}
</script>

<style scoped>

</style>