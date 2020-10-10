<template>
    <div :ref="'chartId_'+chartId"  :style="{'height':this.height,'width':this.width}">

    </div>
</template>
<script>
import _ from 'lodash';
import {PieChart} from '../charts';
import {NewGuid} from 'main/utils/guid';
export default {
    props:{
        chartConfig:{
            default:function(){
                return {
                    
                };
            }
        },
        height:{
            default:function(){
                return '300px';
            }
        },
        width:{
            default:function(){
                return '100%';
            }
        }
    },
    data () {
        return {
            type:'pie',
            chartId:NewGuid().ToString(),
            chart:null,
            chartData:{}
        }
    },
    created(){
      this.chart = new PieChart({},this.chartConfig);
    },
    methods:{
        getDatas(){
            // var _tempdata = localStorage.getItem(this.chart.config.url);
            // if(_tempdata){
            //     var datas = JSON.parse(_tempdata);
            //     this.renderChart(datas)
            // }else{
            this.$fetch(this.chart.config.url,{})
            .then(res=>{
                //console.log(res.data.data);
                try{
                    var datas = JSON.parse(res.data.data);
                   // localStorage.setItem(this.chart.config.url,res.data.data)
                   //  console.log(datas)
                }catch(e){
                   
                }
                this.renderChart(datas)
            })
          //  }
        },
        renderChart(datas){
            // 绘制图表
            let $dom = this.$refs['chartId_'+this.chartId];
            if($dom){
                console.log(datas)
                this.chart.renderChart($dom,datas)
            }
        }
    },
    mounted(){
        this.getDatas();
    }
}
</script>
<style scoped>

</style>