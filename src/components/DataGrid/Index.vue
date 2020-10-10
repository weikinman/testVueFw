<template>
    <div class="datagrid-box">
      <ag-grid-vue style="width: 500px; height: 300px;"
          class="ag-theme-alpine"
          :columnDefs="tableInfo.columnConfig.columnModels"
          :gridOptions="tableInfo.gridOptions"
          :rowData="tableInfo.tableDatas">
      </ag-grid-vue>
      <div class="pagetion-box pull-right">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :page-sizes="pageinfo.pageSizes"
          :page-size="pageinfo.pageSize"
          layout="slot, sizes, prev, pager, next, jumper"
          :current-page.sync="pageinfo.pageNum"
          background
          :total="pageinfo.total"
        >
        </el-pagination>
      </div>
    </div>
</template>

<script>

import theaderMix from '../../mixins/tablehandler';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridVue } from 'ag-grid-vue';
import { AllModules } from '@ag-grid-enterprise/all-modules'
export default {
    name: "DataTable",
    props:["tableInfo"],
    components: {
      AgGridVue
    },
    mixins: [theaderMix],
    data() {
      return {
        gridOptions: null,
        gridApi: null,
        modules: AllModules,
        columnApi: null,
        columnDefs: null,
        defaultColDef: null,
        rowSelection: null,
        paginationPageSize: null,
        rowData: null,
      }
    },
    methods:{
        handleList(){
          this.$fetch(this.tableInfo.tableDatas.url,{
            params:{
              pageNum:this.pageinfo.pageNum,
              ...(this.tableInfo.filterDatas || {})
            }
          }).then((res)=>{
            console.log('testdatas',res);
            if(res){
              if(this.tableInfo.dataFilter){
                res = this.tableInfo.dataFilter.call(this,res);
              }
              let datas = JSON.parse(res.data.data).results;
              this.pageinfo.pageNum = (res.data.pageNum*1) || 1;
              this.pageinfo.total = res.data.total*1;
              this.tableDatas = datas;
            }
          });
        }
    },
    beforeMount () {
      this.handleList();
      this.$on('datatable.refresh',opts=>{
        this.pageinfo.pageNum = 1;
        this.handleList();
      })
      console.log('index.columnConfig',this.tableInfo.columnConfig);
        console.log('index.tableDatas',this.tableInfo.tableDatas);
    },
    mounted(){
      this.tableInfo.gridApi = this.gridOptions.api;
      this.tableInfo.gridColumnApi = this.gridOptions.columnApi;
    }
}
</script>
<style scoped>
 @import "../../../node_modules/ag-grid-community/dist/styles/ag-grid.css";
  @import "../../../node_modules/ag-grid-community/dist/styles/ag-theme-alpine.css";
</style>