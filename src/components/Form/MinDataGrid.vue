<template>
    <div class="min-datagrid-box minextend-datagrid-box">
      <el-row :gutter="formdata.padding||15" >
            <el-col v-for="item in formdata.childrens" :key="item.id"  :span="item.span || 15">
               <span class="min-datagrid-header-item">{{item.label}}</span>
            </el-col>
        </el-row>
        <el-row :gutter="formdata.padding||15" v-for="(valueitem,valueIndex) in gridDatas.values" :key="valueIndex">
            <el-col v-for="(item) in formdata.childrens" :key="item.id"  :span="item.span || 15">
               <MinFormCell :values="valueitem" :index="valueIndex" :formdata="item"></MinFormCell>
            </el-col>
            <el-col v-if="isCopy">
               <el-button type="primary" @click="copyRow(valueitem)" size="mini">{{$t('复制')}}</el-button>
            </el-col>
        </el-row>
        <el-button type="primary" @click="addRow" size="mini">{{$t('新增')}}</el-button>
    </div>
</template>

<script>
import MinFormCell from './MinFormCell';
import $ from 'jquery';
export default {
    name: "MinDataGrid",
    props:["gridDatas","formdata"],
    components: {
      MinFormCell
    },
    data() {
      return {
        isCopy:false,
        rowData: null,
      }
    },
    methods:{
      copyRow(valueitem){
        let temp = {}; 
        this.gridDatas.values.push(temp);
        $.extend(temp,valueitem);
        this.$forceUpdate();
      },
       addRow(){
         this.gridDatas.values.push({});
         this.$forceUpdate();
       }
    },
    beforeMount () {
      
    },
    mounted(){
    }
}
</script>
<style >
.min-datagrid-box .el-form-item__content{margin-left: 0 !important;}
.min-datagrid-header-item{font-size: 14px;}
</style>