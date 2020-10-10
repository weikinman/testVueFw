<template>
  <div class="dashboard-content">
    <el-row :gutter="10" class="dashboard-item">
      <el-col v-for="item in datas.rows" :key="item.id"  class="dashboard-cell" :span="item.span?(item.span*1):8">
        <template v-if="item.chartType==0">
          <LocalDataTable :chartConfig="item.chartData" :height="item.height" :width="item.width"></LocalDataTable>
        </template>
        <template v-if="item.chartType==1">
          <HBarChart :chartConfig="item.chartData" :height="item.height" :width="item.width"></HBarChart>
        </template>
        <template v-if="item.chartType==2">
          <BarChart :chartConfig="item.chartData" :height="item.height" :width="item.width"></BarChart>
        </template>
        <template v-if="item.chartType==3">
          <PieChart :chartConfig="item.chartData" :height="item.height" :width="item.width"></PieChart>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import echarts from "echarts";
import HBarChart from "../Charts/components/HBar.vue";
import BarChart from "../Charts/components/Bar.vue";
import PieChart from "../Charts/components/Pie.vue";
import LocalDataTable from "../DataTable/LocalDataTable.vue";
export default {
  name: "Dashboard",
  components: {
    HBarChart,
    LocalDataTable,
    BarChart,
    PieChart
  },
  props:['dashboardData'],
  data() {
    return {
      datas:[]
    };
  },
  methods: {
    
  },
  created(){
    this.datas = this.dashboardData;
  },
  mounted() {
    
    //console.log(this.datas);
  }
};
</script>

<style>
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.dashboard-content {
  background-color: #131734;
  width: 100%;
  box-sizing: border-box;
}
.dashboard-item {
  padding: 0 3%;
}
.dashboard-item canvas{border-radius: 10px;}
.dashboard-cell{margin-top:10px;}
.chart-item-box{border-radius: 10px;}
</style>>

</style>