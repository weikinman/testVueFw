/**
 * 
 */
import _ from 'lodash';
var echarts = require('echarts');
const handleOptions = (datas,options)=>{
    return datas;
}
let chartOptions = {
    handleOptions:handleOptions
}
const options = {
    backgroundColor: '#212650',
    legend: {
        show: true,
        data: [],
        textStyle: {
            color: '#fff'
        }
    },
    title: {
         textStyle: {
            color: '#fff'
        },
        text: '',
       // subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom'
    },
     tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
            label: {
                show: true,
                formatter: function (params) {
                    return params.value.replace('\n', '');
                }
            }
        }
    },
   
    xAxis: {
        data: [],
        axisLabel: {
            textStyle: {
                color: '#fff'
            }
        },
        axisTick: {
            show: false
        },
        axisLine: {
            show: false
        },
        silent: false,
        splitLine: {
            show: false,
            color:['#fff'],
            opacity:0.3,
            lineStyle:{
                width:0.5
            }
        },
        splitArea: {
            show: false
        },
        z: 0
    },
    grid: {
        left: "40",
        right: "40",
        top: "50",
        bottom: "30",
        containLabel: true
      },
    yAxis: {
        axisLine: {
            show: false
        },
        splitLine: {
            show: true,
            color:['#fff'],
            opacity:0.1,
            lineStyle:{
                width:0.5
            }
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            textStyle: {
                color: '#ccc'
            }
        }
    },
    dataZoom: [
        {
            type: 'inside'
        }
    ],
    series: [
        
    ]
};
let defaultConfig = {
    title:{//標題
        textStyle: {
            color: '#fff'
        },
        x:10,
        y:10,
        text: 'Title',
    },
    backgroundColor:'#212650',
    borderRadius:[0,0,0,0],
    url:'http://172.19.201.201:8900/api/splunk?key=Customer1%20Malware%20Activity',//獲取數據的接口
    areaStyle:false,//折綫圖顯示數據時，是否顯示下方區域顔色,
    areaColor:['#fff','#fff'],//多個為漸變色
    xAxis: {//X軸顯示的字段
        data: ['_time'],
        axisLabel: {
            textStyle: {
                color: '#fff'
            }
        }
    },
    yAxis: {//Y軸顯示的字段
        axisLabel: {
            textStyle: {
                color: '#ccc'
            }
        }
    },
    chartType :  'bar', //line  顯示為柱形或者折現
    legend: {
        show: true,
        data: ['blocked'],
        textStyle: {
            color: '#fff'
        },
        right:10,
        y:10,
    },
    LinearColor:['#FFF'],//數據顯示的顔色//多個為漸變色
}
const baseSeries = {
    type: 'bar',
    smooth: true, 
    seriesLayoutBy: 'row', 
    barMaxWidth:'10%',
    itemStyle:{
        
        normal:{},
        emphasis:{}
    },
    data: []
}
export class BaseCharts{
    constructor(opts,config){
        var _opts = _.cloneDeep(options);
        this.options = Object.assign({},_opts,opts);
        this.config = Object.assign({},defaultConfig,config);
        this.options.grid = Object.assign({},this.options.grid||{},this.config.grid||{});
        this.options.tooltip = Object.assign({},this.options.tooltip||{},this.config.tooltip||{});
        this.options.xAxis = Object.assign({},this.options.xAxis||{},this.config.xAxis||{});
        this.options.yAxis = Object.assign({},this.options.yAxis||{},this.config.yAxis||{});
        
        this.datas = [];
        this.series = [];
        this.state = {};
        this.myChart = null;
        this.init();
    }
    init(){

    }
    getDatas(){

    }
    handleOptions(){
        
    }
    preRender(){
        if(this.config.dataZoom){
            this.options.dataZoom = Object.assign([],this.options.dataZoom||[],this.config.dataZoom||[]);
        }
    }
    /**
     * 處理從後臺獲取的數據
     * 
     */
    filterDatas(){
        return this.datas;
    }
    /**
     * 
     * @param {Dom} context 一個DOM元素，渲染的容器 
     * @param {Object} datas //數據，格式為 fields:所有字段   ，results:接口數據
     * @param {Object} options //可覆蓋默認圖表配置信息
     */
    renderChart(context,datas,options){
       // console.log(context,datas);
        this.datas = datas;
        this.filterDatas(this.datas);
        this.handleOptions(this.datas,options);
        options = _.cloneDeep(options);
        this.options = Object.assign(this.options,options);
        var myChart = this.myChart = echarts.init(context);
        window.addEventListener('resize',()=>{
            myChart.resize();
        })
        this.preRender();
        // 绘制图表
        console.log('options',this.options);
        setTimeout(()=>{
            myChart.setOption(this.options);
        })
        
    }
}

export class HBarChart extends BaseCharts{
    constructor(opts,config){
        super(opts,config);
    }
    handleOptions(){
       // console.log('hbarinfo:',this.options,this.config);
        //virmap 
        if(this.config.visualMap){
            this.options.visualMap = Object.assign({},this.options.visualMap,this.config.visualMap);
        }
        //標題
        this.options.title = Object.assign({},this.options.title,this.config.title);

        //放大缩小
        
        //處理X軸
        this.options.xAxis.data = [];
        
        //X軸字段
        const xAxisField = this.config.xAxis.data[0];

        //Y軸數據
        this.options.series = Object.assign([],this.options.series,this.config.series);
        this.options.legend = Object.assign({},this.options.legend,this.config.legend);

        this.options.yAxis.splitLine = {
            show: true,
            color:['#fff'],
            opacity:0.3,
            lineStyle:{
                width:0.5
            }
        }
        this.options.yAxis.splitLine = Object.assign({},this.options.yAxis.splitLine,this.config.yAxis.splitLine||{});

        let legendField = this.options.legend.data;
        if(this.datas && this.datas.results){
            var seriesData = [];
            this.datas.results.forEach((item,index)=>{
                if(_.isDate(item[xAxisField]) || ~xAxisField.indexOf('time')){
                    this.options.xAxis.data.push(echarts.format.formatTime('yyyy-MM-dd\nhh:mm:ss', item[xAxisField]));
                }else{
                    this.options.xAxis.data.push(item[xAxisField]);
                }
               //處理Y軸
                legendField.forEach((n,i)=>{
                    if(!seriesData[n]){
                        seriesData[n] = [];
                    }
                    seriesData[n].push( item[n])
                })
            });
           // console.log('seriesData',seriesData);
            
            //處理Y軸
            if(!this.config.isLineColor){//不是渐变色的话
                let k = 0;
                legendField.forEach((n,i)=>{
                    var serieData = seriesData[n];
                    var series = _.cloneDeep(baseSeries);
                    series.name = n;
                    series.type = this.config.chartType;
                    
                    if(this.config.LinearColor && this.config.LinearColor[i]){
                        series.itemStyle = {
                            normal:{
                                barBorderRadius:this.config.borderRadius,
                                color: this.config.LinearColor[i]
                            },
                            
                        };
                    }
                    if(this.config.areaStyle){
                        let areaColor = [];
                        if(this.config.areaColor && this.config.areaColor.length>0){
                            for(let i=0,j=0;i<=1;i++){
                                let color = this.config.areaColor[i]
                                if(!color){
                                    color = this.config.areaColor[i-1];
                                    if(!color){
                                        color = this.config.areaColor[i-2];
                                    }
                                }
                                areaColor.push({
                                    offset:j,
                                    color:color
                                })
                                j+=0.5;
                            }
                            series.areaStyle= {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, areaColor)
                            }
                        }else{
                            series.areaStyle= {
                                opacity:0.2
                            }
                        }
                    }
                    series.data =serieData;
                    this.options.series.push(series);
                })
            }else{
                legendField.forEach((n,i)=>{
                    var serieData = seriesData[n];
                    var series = _.cloneDeep(baseSeries);
                    series.name = n;
                    series.type = this.config.chartType;
                    //渐变色
                    if(this.config.LinearColor && this.config.LinearColor[i] && _.isArray(this.config.LinearColor[i])){
                        let color = this.config.LinearColor[i];
                        let seriesColor = [];
                        for(let k=0,j=0;j<3;j++){
                            if(color[j]){
                                seriesColor.push({
                                    offset:k,
                                    color:color[j]
                                });
                            }
                            k+=0.5;
                        }
                        
                        if(this.config.chartType=='bar' && seriesColor.length>0){
                            series.itemStyle = {
                                normal:{
                                    barBorderRadius:this.config.borderRadius,
                                    color: new echarts.graphic.LinearGradient(
                                        1, 0, 0, 1,
                                        seriesColor
                                    )
                                },
                                
                            };
                            series.emphasis = {
                                itemStyle: {
                                    normal:{
                                        barborderRadius:this.config.borderRadius,
                                        color: new echarts.graphic.LinearGradient(
                                            1, 0, 0, 1,
                                            seriesColor
                                        )
                                    },
                                    
                                }
                            }
                        }
                    }
                    if(this.config.areaStyle){
                        let areaColor = [];
                        for(let i=0,j=0;i<=1;i++){
                            let color = this.config.areaColor[i]
                            if(!color){
                                color = this.config.areaColor[i-1];
                                if(!color){
                                    color = this.config.areaColor[i-2];
                                }
                            }
                            areaColor.push({
                                offset:j,
                                color:color
                            })
                            j+=0.5;
                        }
                        series.areaStyle= {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, areaColor)
                        }
                    }
                    series.data =serieData;
                    this.options.series.push(series);
                })
            }
            //標簽
           // console.log(legendField)
            //this.options.legend.data = legendField;
           // console.log(this.options.series)
        }
    }
}


export class BarChart extends BaseCharts{
    constructor(opts,config){
        super(opts,config);
    }
    handleOptions(){
       // console.log('barinfo:',this.options,this.config);
       
        //virmap 
        if(this.config.visualMap){
            this.options.visualMap = Object.assign({},this.options.visualMap,this.config.visualMap);
        }
        //標題
        this.options.title = Object.assign({},this.options.title,this.config.title);

            this.options.dataZoom = [{
                type:'inside',
                yAxisIndex: [0]
            }];
            //this.options.dataZoom.orient = 'horizontal';

        //處理X軸
        this.options.xAxis.data = [];
        this.options.xAxis.type = 'value';
        //X軸字段
        const xAxisField = this.config.xAxis.data[0];
        this.options.yAxis.type = 'category';
        //Y軸數據
        this.options.series = Object.assign([],this.options.series,this.config.series);
        this.options.legend = Object.assign({},this.options.legend,this.config.legend);
        this.options.yAxis.splitLine = {show:false}
        this.options.xAxis.splitLine = {
            show: true,
            color:['#fff'],
            opacity:0.3,
            lineStyle:{
                width:0.5
            }
        }
        this.options.xAxis.splitLine = Object.assign({},this.options.xAxis.splitLine,this.config.xAxis.splitLine||{});
        let legendField = this.options.legend.data;
        this.options.xAxis.data = _.cloneDeep(this.options.legend.data);
        if(this.datas && this.datas.results){
            var seriesData = [];
            this.options.yAxis.data = [];
            this.datas.results.forEach((item,index)=>{
                if(_.isDate(item[xAxisField]) || ~xAxisField.indexOf('time')){
                    this.options.yAxis.data.push(echarts.format.formatTime('yyyy-MM-dd\nhh:mm:ss', item[xAxisField]));
                }else{
                    this.options.yAxis.data.push(item[xAxisField]);
                }
               //處理Y軸
                legendField.forEach((n,i)=>{
                    if(!seriesData[n]){
                        seriesData[n] = [];
                    }
                    seriesData[n].push( item[n])
                })
            });
           // console.log('seriesData',seriesData);
           
            //處理Y軸
            if(!this.config.isLineColor){//不是渐变色的话
                let k = 0;
                legendField.forEach((n,i)=>{
                    var serieData = seriesData[n];
                    var series = _.cloneDeep(baseSeries);
                    series.name = n;
                    series.type = this.config.chartType;
                    
                    if(this.config.LinearColor && this.config.LinearColor[i]){
                        series.itemStyle = {
                            normal:{
                                barBorderRadius:this.config.borderRadius,
                                color: this.config.LinearColor[i]
                            },
                            
                        };
                    }
                    if(this.config.areaStyle){
                        let areaColor = [];
                        for(let i=0,j=0;i<=1;i++){
                            let color = this.config.areaColor[i]
                            if(!color){
                                color = this.config.areaColor[i-1];
                                if(!color){
                                    color = this.config.areaColor[i-2];
                                }
                            }
                            areaColor.push({
                                offset:j,
                                color:color
                            })
                            j+=0.5;
                        }
                        series.areaStyle= {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, areaColor)
                        }
                    }
                    series.data =serieData;
                    this.options.series.push(series);
                })
            }else{
                legendField.forEach((n,i)=>{
                    var serieData = seriesData[n];
                    var series = _.cloneDeep(baseSeries);
                    series.name = n;
                    series.type = this.config.chartType;
                    //渐变色
                    if(this.config.LinearColor && this.config.LinearColor[i] && _.isArray(this.config.LinearColor[i])){
                        let color = this.config.LinearColor[i];
                        let seriesColor = [];
                        for(let k=0,j=0;j<3;j++){
                            if(color[j]){
                                seriesColor.push({
                                    offset:k,
                                    color:color[j]
                                });
                            }
                            k+=0.5;
                        }
                        
                        if(this.config.chartType=='bar' && seriesColor.length>0){
                            series.itemStyle = {
                                normal:{
                                    barBorderRadius:this.config.borderRadius,
                                    color: new echarts.graphic.LinearGradient(
                                        1, 0, 0, 1,
                                        seriesColor
                                    )
                                },
                                
                            };
                            series.emphasis = {
                                itemStyle: {
                                    normal:{
                                        barborderRadius:this.config.borderRadius,
                                        color: new echarts.graphic.LinearGradient(
                                            1, 0, 0, 1,
                                            seriesColor
                                        )
                                    },
                                    
                                }
                            }
                        }
                    }
                    if(this.config.areaStyle){
                        let areaColor = [];
                        for(let i=0,j=0;i<=1;i++){
                            let color = this.config.areaColor[i]
                            if(!color){
                                color = this.config.areaColor[i-1];
                                if(!color){
                                    color = this.config.areaColor[i-2];
                                }
                            }
                            areaColor.push({
                                offset:j,
                                color:color
                            })
                            j+=0.5;
                        }
                        series.areaStyle= {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, areaColor)
                        }
                    }
                    series.data =serieData;
                    this.options.series.push(series);
                })
            }
            //標簽
           // console.log(legendField)
            //this.options.legend.data = legendField;
           // console.log(this.options.series)
        }
    }
}

//未完成
export class PieChart extends BaseCharts{
    constructor(opts,config){
        super(opts,config);
    }
    handleOptions(){
        console.log('PieChartInfo:',this.options,this.config);
        //virmap 
        if(this.config.visualMap){
            this.options.visualMap = Object.assign({},this.options.visualMap,this.config.visualMap);
        }
        //標題
        this.options.title = Object.assign({},this.options.title,this.config.title);

        //處理X軸
        this.options.xAxis.data = [];
        this.options.xAxis.show = false;
        this.options.tooltip = {};
        this.options.tooltip = Object.assign({},this.options.tooltip,this.config.tooltip);
        //X軸字段
        const xAxisField = this.config.xAxis.data[0];

        //Y軸數據
        this.options.series = Object.assign([],this.options.series,this.config.series);
        this.options.legend = Object.assign({},this.options.legend,this.config.legend);

        this.options.yAxis.splitLine = {
            show: false,
            color:['#fff'],
            opacity:0.3,
            lineStyle:{
                width:0.5
            }
        }
        this.options.yAxis.splitLine = Object.assign({},this.options.yAxis.splitLine,this.config.yAxis.splitLine||{});

        let legendField = this.options.legend.data;
        if(this.datas && this.datas.results){
            var seriesData = [];
            this.datas.results.forEach((item,index)=>{
                if(_.isDate(item[xAxisField]) || ~xAxisField.indexOf('time')){
                    this.options.xAxis.data.push(echarts.format.formatTime('yyyy-MM-dd\nhh:mm:ss', item[xAxisField]));
                }else{
                    this.options.xAxis.data.push(item[xAxisField]);
                }
               //處理Y軸
                legendField.forEach((n,i)=>{
                    if(!seriesData[n]){
                        seriesData[n] = [];
                    }
                    seriesData[n].push( {name:item[xAxisField],value:item[n]})
                })
            });
           // console.log('seriesData',seriesData);
            
            //處理Y軸
            if(!this.config.isLineColor){//不是渐变色的话
                let k = 0;
                legendField.forEach((n,i)=>{
                    var serieData = seriesData[n];
                    var series = _.cloneDeep(baseSeries);
                    series.name = n;
                    series.type = 'pie';
                    
                    if(this.config.LinearColor && this.config.LinearColor[i]){
                        series.itemStyle = {
                            normal:{
                                barBorderRadius:this.config.borderRadius,
                                color: this.config.LinearColor[i]
                            },
                            
                        };
                    }
                    if(this.config.areaStyle){
                        let areaColor = [];
                        if(this.config.areaColor && this.config.areaColor.length>0){
                            for(let i=0,j=0;i<=1;i++){
                                let color = this.config.areaColor[i]
                                if(!color){
                                    color = this.config.areaColor[i-1];
                                    if(!color){
                                        color = this.config.areaColor[i-2];
                                    }
                                }
                                areaColor.push({
                                    offset:j,
                                    color:color
                                })
                                j+=0.5;
                            }
                            series.areaStyle= {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, areaColor)
                            }
                        }else{
                            series.areaStyle= {
                                opacity:0.2
                            }
                        }
                    }
                    series.data =serieData;
                    this.options.series.push(series);
                })
            }else{
                legendField.forEach((n,i)=>{
                    var serieData = seriesData[n];
                    var series = _.cloneDeep(baseSeries);
                    series.name = n;
                    series.type = 'pie';
                    //渐变色
                    if(this.config.LinearColor && this.config.LinearColor[i] && _.isArray(this.config.LinearColor[i])){
                        let color = this.config.LinearColor[i];
                        let seriesColor = [];
                        for(let k=0,j=0;j<3;j++){
                            if(color[j]){
                                seriesColor.push({
                                    offset:k,
                                    color:color[j]
                                });
                            }
                            k+=0.5;
                        }
                        
                        if(this.config.chartType=='bar' && seriesColor.length>0){
                            series.itemStyle = {
                                normal:{
                                    barBorderRadius:this.config.borderRadius,
                                    color: new echarts.graphic.LinearGradient(
                                        1, 0, 0, 1,
                                        seriesColor
                                    )
                                },
                                
                            };
                            series.emphasis = {
                                itemStyle: {
                                    normal:{
                                        barborderRadius:this.config.borderRadius,
                                        color: new echarts.graphic.LinearGradient(
                                            1, 0, 0, 1,
                                            seriesColor
                                        )
                                    },
                                    
                                }
                            }
                        }
                    }
                    if(this.config.areaStyle){
                        let areaColor = [];
                        for(let i=0,j=0;i<=1;i++){
                            let color = this.config.areaColor[i]
                            if(!color){
                                color = this.config.areaColor[i-1];
                                if(!color){
                                    color = this.config.areaColor[i-2];
                                }
                            }
                            areaColor.push({
                                offset:j,
                                color:color
                            })
                            j+=0.5;
                        }
                        series.areaStyle= {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, areaColor)
                        }
                    }
                    series.data =serieData;
                    this.options.series.push(series);
                })
            }
            // this.options.xAxis = {};
            // this.options.yAxis = {};
            //標簽
          //  console.log(legendField)
            //this.options.legend.data = legendField;
          //  console.log(this.options.series)
        }
    }
}
