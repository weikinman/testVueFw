<template>
    <div :class="['content-item clearfix',(tableInfo.className || '')]">
      <!-- 列表 -->
      <el-table
            :data="tableDatas"
            style="width: 100%"
            ref="multipleTable"
            class="theader-cell-center"
            tooltip-effect="dark"
            :stripe="tableInfo.stripe||false"
            :height="(tableInfo.height===false?null:(tableInfo.height || 250))"
            :row-class-name="tableInfo.tableRowClassName"
            :default-sort="tableInfo.defaultSort||{}"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChange"
            :header-row-style="tableInfo.headerCellStyle||{
            'background-color': '#eaf1f6',
            'color':'#74859f',
            }"
            :header-cell-style="tableInfo.headerCellStyle||{
            'background-color': '#eaf1f6',
            'color':'#74859f',
            }">
            <template slot="empty">{{$t('没有数据')}}</template>
            <el-table-column v-if="columnConfig.isSelectAll" type="selection"  :align="columnConfig.selectAllAlign?columnConfig.selectAllAlign:'center'" :min-width="columnConfig.selectAllWidth?item.selectAllWidth:'5%'"></el-table-column>

            <el-table-column v-for="(item,index) in columnConfig.columnModels" :key="index" :header-align="item.headerAlign" :align="item.cellAlign" :sortable="item.sortable?item.sortable:false" :prop="item.field" :label="changeHeaderItemValue(item.headerName || item.field)" :min-width="item.width?item.width:'13%'">
                <template slot-scope="scope">
                 <slot name="cell" v-bind="{scope,item,columnConfig,tableDatas}"></slot>
                </template>
            </el-table-column>

            <el-table-column v-if="(columnConfig.columnModels && columnConfig.columnModels.length>0)&&!columnConfig.notShowOperation" :label="$t('操作')"  :min-width="columnConfig.operaterWidth?columnConfig.operaterWidth:'13%'" :align="columnConfig.operaterAlign?columnConfig.operaterAlign:'center'">
                
                 <template slot-scope="scope">
                  <slot name="operater" v-bind="{scope,columnConfig,tableDatas}"></slot>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagetion-box pull-right">
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :page-size.sync="pageinfo.pageSize"
                :layout="tableInfo.layouts || 'sizes,slot, prev, pager, next,jumper'"
                :current-page.sync="pageinfo.pageNum"
                background
                :total="pageinfo.total"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
/**
 * 表格单元格的渲染方式
 *  <template  v-slot:cell="scope">
      <p >{{changeRowValue(scope.scope.row,scope.item.field)}}</p>
    </template>
    表格操作列的渲染方式
    <template  v-slot:operater="scope">
      <el-button size="mini" @click="refreshTable"> 编辑 </el-button>
      <p v-if="false">{{scope.scope.row.count}}</p>
    </template>
 * 
 * @param {Object} tableInfo
 *   tableInfo.columnConfig:列配置项，具体配置在  columnConfig.columnModels里面
  *      example columnConfig.columnModels {Array} = [{name:'attributename',label:'显示名称',sortby:''，displayorder:0}]
  *      example  columnConfig.isSelectAll {Boolean}  是否显示表格前面复选框
 *   tableInfo.tableDatas {Array}: 列表具体数据配置信息  tableDatas.url：获取数据的API
 *  
 *   tableInfo.filterDatas: {Object} 传到API中的过滤条件
 * 
 *   tableInfo.sortHandler {Function} 返回一个对象 ，列如{
       sortby:'',
       sortorder:"descending"
     }
      tableInfo.defaultSort {object} 例如{prop: 'count', order: 'descending'}
     tableInfo.layouts 分页显示那些内容 ，默认：'slot, prev, pager, next,jumper'
 */

import theaderMix from '../../mixins/tablehandler';
export default {
    name: "DataTable",
    props:["tableInfo"],
    components: {
    },
    mixins: [theaderMix],
    data() {
      return {
       // tableDatas:this.tableInfo.tableDatas,
        columnConfig:this.tableInfo.columnConfig,
        type:'get',
        sortData:{
          sortby:'',
          sortorder:"descending"
        }
      }
    },
    created(){
      if(this.tableInfo.sortHandler){
        this.sortData = this.tableInfo.sortHandler.call(this,this.sortData);
      }
     
      this.tableInfo.$_VmTable = this;
      this.$nextTick(res=>{
        this.$refs.multipleTable.doLayout();
      })
    },
    methods:{
      setOptions(handler){
        handler.call(this,this);
      },
      //改变每页多少条
      handleSizeChange(val) {
          this.pageinfo.pageSize = val;
          this.pageinfo.pageNum = 1;
          this.pageinfo.currentPage = 1;
          if(this.tableInfo.handleSizeChange){
          this.tableInfo.handleSizeChange.call(this,val);
          }
          let tableInfoCache = localStorage.getItem(this.$route.name);
          let tableInfoObj = null
          if(tableInfoCache){
            tableInfoObj = JSON.parse(tableInfoCache);
           
          }else{
            tableInfoObj= {};
          }
           tableInfoObj.pageinfo = this.pageinfo;
            localStorage.setItem(this.$route.name,JSON.stringify(tableInfoObj));
          this.handleList();
          
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        if(this.tableInfo.handleSelectionChange){
          this.tableInfo.handleSelectionChange.call(this,val);
        }
        
      },
        changeHeaderItemValue(value){
          let res = value;
          if(this.tableInfo.changeLang){
            res = this.tableInfo.changeLang(value,this);
          }else if(this.$t && this.tableInfo.isI18n==true){
            res = this.$t(value);
          }
            return res;
        },
        changeRowValue(rowData,name){
            return rowData[name];
        },
        handleSortChange(opts){
         // console.log(opts);
          if(this.tableInfo.sortHandler){
            this.sortData = this.tableInfo.sortHandler.call(this,this.sortData,opts);
          }
          let tableInfoCache = localStorage.getItem(this.$route.name);
          let tableInfoObj = null
          if(tableInfoCache){
            tableInfoObj = JSON.parse(tableInfoCache);
          }else{
            tableInfoObj= {};
           
          }
           tableInfoObj.sortData = this.sortData;
             localStorage.setItem(this.$route.name,JSON.stringify(tableInfoObj));
          if(!this.tableInfo.isNotSortRefresh){
            this.handleList();
          }
          if(this.tableInfo.sortEnded){
            this.tableInfo.sortEnded.call(this);
          }
          
         // console.log(this.sortData);
        },
        handleList(){
          // let tableInfoCache = localStorage.getItem(this.$route.name);
          // let tableInfoObj = null
          // if(tableInfoCache){
          //    tableInfoObj = JSON.parse(tableInfoCache);
            
          // }else{
          //    tableInfoObj= {};
            
          // }
          // tableInfoObj.filterDatas = this.tableInfo.filterDatas;
          // localStorage.setItem(this.$route.name,JSON.stringify(tableInfoObj));
          if(!this.tableInfo.getTableDatas){
            var xhr = this.$fetch;
            if(this.tableInfo.type=='post'){
              xhr = this.$post;
            }
          
            let postData = {
                pageNum:this.pageinfo.pageNum,
                pageSize:this.pageinfo.pageSize,
                ...(this.tableInfo.filterDatas || {}),
                ...this.sortData
              };
            if(this.tableInfo.preLoadData){
              this.tableInfo.preLoadData.call(this,postData);
            }
            if(!this.tableInfo.tableDatas.url)return false;
            xhr(this.tableInfo.tableDatas.url,{
              params:postData
            }).then((res)=>{
            // console.log('testdatas',res);
              if(res){
                if(this.tableInfo.dataFilter){
                  res = this.tableInfo.dataFilter.call(this,res);
                }
                let datas = res.items;
                this.pageinfo.pageNum = (res.data.pageNum*1) || 1;
                this.pageinfo.total = res.data.total*1;
                this.tableDatas = datas;
              }
            });
          }else{
            this.tableInfo.getTableDatas(this);
          }
          
        }
    },
    mounted(){
      if(this.$refs && this.$refs.multipleTable){
        this.tableInfo.$_DomTable = this.$refs.multipleTable;
      }
      
    },
    beforeMount () {
      this.handleList();
      this.$on('datatable.refresh',opts=>{
        //this.pageinfo.pageNum = 1;
        this.handleList();
      })
    //  console.log('index.columnConfig',this.tableInfo.columnConfig);
     //   console.log('index.tableDatas',this.tableInfo.tableDatas);
    }
}
</script>
<style scoped>
.theader-cell-center{}
</style>