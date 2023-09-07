<template>
  <template v-for="params in data">
  <tr v-show="show">
    <td>
      <span class="placeholder" v-for="n in (this.index-1)"></span>
      <template v-if="params.type==='array' || params.type==='object'">
        <template v-if="params.expand">
          <span class="openBtn" @click="expand(params, false)">-</span>
        </template>
        <template v-else>
          <span class="openBtn" @click="expand(params, true)">+</span>
        </template>
      </template>
      <template v-else>
        <span class="placeholder"></span>
      </template>
      {{ params.name }}
    </td>
    <td>
      <template v-if="params.type==='array'">
        {{  params.children.length>0 ? params.children[0].type : ''}}[]
      </template>
      <template v-else>
        {{ params.type }}
      </template>
    </td>
    <td>{{ params.required==1?"必须":"非必须" }}</td>
    <td>{{ params.test_val }}</td>
    <td>{{ params.desc }}</td>
  </tr>
  <template v-if="params.type==='array' && params.children.length>0">
    <ParamsSubTable :data="params.children[0].children" v-if="params.children[0].type=='object'" :show="params.expand" :index="newIndex"></ParamsSubTable>
  </template>
  <template v-else-if="params.type==='object'">
    <ParamsSubTable :data="params.children" :show="params.expand" :index="newIndex"></ParamsSubTable>
  </template>
</template>
</template>

<script>
export default {
  name: "ParamsSubTable",
  props:{
    data:{
      type: Array,
      default: []
    },
    index:{
      type: Number,
      default: 2
    },
    show:{
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      newIndex:0,
    }
  },
  created() {
    this.newIndex = this.index+1
    console.log(this.index, this.data)
  },
  methods: {
    expand(params, expand){
      params.expand = expand
      if (!expand){
        if (params.children.length>0){
          for (let i=0; i<params.children.length; i++){
            this.expand(params.children[i], expand)
          }
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.openBtn{
  border: 1px solid #dcdfe6;
  display: inline-block;
  width: 18px;
  height: 18px;
  line-height: 14px;
  font-size: 16px;
  text-align: center;
  cursor: pointer;
}
.placeholder{
  display: inline-block;
  width: 18px;
  height: 18px;
}
.params-table{
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
.params-table th{
  text-align: left;
  border: 1px solid #dcdfe6;
  padding: 6px;
}
.params-table td{
  border: 1px solid #dcdfe6;
  padding: 6px;
}
</style>