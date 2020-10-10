<template>
    <div :ref="'chartId_'+chartId" style="height:300px; width:100%">
          <el-table
            v-if="localDatas && localDatas.length>0"
            :data="localDatas"
            style="width: 100%"
            ref="multipleTable"
            class="theader-cell-center"
            tooltip-effect="dark"
            :header-cell-style="{
            'background-color': '#eaf1f6',
            'color':'#74859f',
            }"
            >
                <template slot="empty">{{$t('table.queryEmpty')}}</template>
                <el-table-column v-for="(item,index) in tableFields" :key="index" :header-align="chartConfig.headerAlign" :align="chartConfig.cellAlign" :label="changeHeaderItemValue(item.name)" min-width="13%">
                    <template slot-scope="scope">
                    <p>{{ changeRowValue(scope.row,item.name)}}</p>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagetion-box pull-right">
                <el-pagination
                    v-if="localDatas && localDatas.length>0"
                    @current-change="renderTable"
                    :page-size="pageinfo.pageSize"
                    layout="slot, prev, pager, next,jumper"
                    :current-page.sync="pageinfo.pageNum"
                    background
                    :total="pageinfo.total"
                >
                </el-pagination>
            </div>
        </div>
</template>
<script>
var echarts = require('echarts');
const OnlyId = ()=>{
    return (Math.random()*10000000>>0).toString(16)+'-'+(Math.random()*10000000>>0).toString(16);
}
const chartInfo = {
    title:'',
}

import _ from 'lodash';
export default {
    props:{
        chartConfig:{
            default:function(){
                return {
                    customerFields:[],
                    headerAlign:'center',
                    cellAlign:'center'
                };
            }
        }
    },
    data () {
        return {
            type:'datatable',
            chartId:OnlyId(),
            localDatas:[],
            tableDatas:[],//當前列表頁存放列表數據，在handleList中賦值即可在
            tableFields:[],
            pageinfo:{
                pageNum: 1, //查询第几页
                currentPage: 1, //页码对应值
                total: 0, //总页数
                pageSize: 10, //显示条数
                pageSizes:[10,20,50,100]
            },
        }
    },
    created(){
        console.log('datatable.loading');
      this.getDatas();
    },
    methods:{
        changeHeaderItemValue(value){
            return value;
        },
        changeRowValue(itemData,value){
            return itemData[value];
        },
        handleCurrentChange(page){
            this.pageinfo.pageNum = page;
            this.getDatas();
        },
        getDatas(){
            
            this.$fetch(this.chartConfig.url,{})
            .then(res=>{
                 var datas = [];
                try{
                    if(res.data && res.data.data){
                        datas = JSON.parse(res.data.data);
                        this.handleData(datas)
                    }
                   console.log('datatable',datas);
                }catch(e){
                   
                }
                
            });
        },
        handleData(datas){
            if(this.dataFields){
                this.tableFields = _.cloneDeep(this.dataFields);
            }else{
                this.tableFields = datas.fields;
            }
            this.tableDatas = datas.results;
            this.pageinfo.total = this.tableDatas.length;
            this.renderTable();
        },
        limitData(){
            var res = [];
            var start = (this.pageinfo.pageNum-1)*this.pageinfo.pageSize;
            var end = start+this.pageinfo.pageSize-1;
            if(start<0){
                start=0;
            }
            if(end>this.tableDatas.length){
                end=this.tableDatas.length;
            }
            var tempDatas = _.cloneDeep(this.tableDatas);
            return tempDatas.slice(start,end);
        },
        renderTable(){
            this.localDatas = this.limitData()
        }
    },
    mounted(){
        
    }
}
</script>
<style scoped>

</style>