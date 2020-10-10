/**
 * 目前只支持2种图表和一种列表
 */
const dashboardDatas = {
  title:'',
  padding:'0',//暂不支持
  rows:
    [{
      "id":'example_1',
      "type":1,//仪表板块的类型
      "span":6,//一行有24列，该图表或列表占多少列，默认8列
      "width":"100%",
      "height":"200px",
      "chartType":"1",//圖表或者列表{0：列表,1:'竖柱形图',2:'横柱形图'}
      "chartData":{
        title:{//標題
          textStyle: {
              color: '#fff',
              fontSize:14,
              fontWeight: 'normal'//标题加粗，
          },
          //位置信息
          x:10,
          y:10,
          text: 'Malware Activity',
        },
        backgroundColor:'#212650',//背景颜色
        borderRadius:[10,10,0,0],//柱形数据圆边
        url:'http://172.19.201.201:8900/api/splunk?key=Malware%20Activity',//獲取數據的接口
        areaStyle:false,//折綫圖顯示數據時，是否顯示下方區域顔色,
        areaColor:['#fff','#ffe'],//多個為漸變色,最多3个
        xAxis: {//X軸顯示的字段
            data: ['_time'],
            axisLabel: {
                textStyle: {
                    color: '#fff'
                }
            }
        },
        yAxis: {
            axisLabel: {
                textStyle: {
                    color: '#ccc'
                }
            }
        },
        chartType :  'bar', //'line','bar'  数据顯示為柱形或者折线
        legend: {
            show: true,
            data: ['blocked'],//Y軸顯示的字段
            icon: "circle", //图例形状
            orient: "horizontal",
            right: "30px",
            y: "10px",
            itemWidth: 8, // 图例图形宽度
            itemHeight: 8, // 图例图形高度
            textStyle: {
              color: "#fff",
              fontSize: 12
            }
        },
        isLineColor:true,
        LinearColor:[['#f82c2e','#ff2d2e','#562a4b']]//數據顯示的顔色,多個為漸變色,最多3个,多组数组分别对应不同字段颜色，不传的话使用调色板颜色
      }
  },

  {
    "id":'example_2',
    "span":18,
    "type":1,//仪表板块的类型
    "width":"100%",
    "height":"200px",
    "chartType":"1",//圖表或者列表{0：列表,1:'竖柱形图',2:'横柱形图' }
    "chartData":{
      title:{//標題
        textStyle: {
            color: '#fff',
            fontSize:14,
            fontWeight: 'normal'
        },
        //位置信息
        x:10,
        y:10,
        text: 'Authentication Attempts by Users',
      },
      backgroundColor:'#212650',
      borderRadius:[10,10,0,0],
      url:'http://172.19.201.201:8900/api/splunk?key=Authentication Attempts by Users',//獲取數據的接口
      areaStyle:false,//折綫圖顯示數據時，是否顯示下方區域顔色,
      areaColor:['#fff','#ffe'],//多個為漸變色,最多3个
      xAxis: {//X軸顯示的字段
          data: ['_time'],
          axisLabel: {
              textStyle: {
                  color: '#fff'
              }
          }
      },
      yAxis: {
          axisLabel: {
              textStyle: {
                  color: '#ccc'
              }
          }
      },
      chartType :  'line', //line  顯示為柱形或者折現
      legend: {
          show: true,
          data: ['A',
         'C',
          'I',
          'K',
          'OHER',
          'P',
          'S',
         'a',
          'f',
          'l',
          's'],
          icon: "circle", //图例形状
          orient: "horizontal",
          right: "30px",
          y: "10px",
          itemWidth: 8, // 图例图形宽度
          itemHeight: 8, // 图例图形高度
          textStyle: {
            color: "#fff",
            fontSize: 12
          }
      },
      isLineColor:false,
      LinearColor:[]//數據顯示的顔色//多個為漸變色,最多3个
    }
  },

  {
    "id":'example_3',
    "span":24,
    "type":1,//仪表板块的类型
    "width":"100%",
    "height":"200px",
    "chartType":"2",//圖表或者列表{0：列表,1:'竖柱形图',2:'横柱形图' }
    "chartData":{
      title:{//標題
        textStyle: {
            color: '#fff',
            fontSize:14,
            fontWeight: 'normal'
        },
        //位置信息
        x:10,
        y:10,
        text: 'Intrusion Detection - Top 10 Target IP',
      },
      grid: {
        left: "40",
        right: "100",
        top: "50",
        bottom: "30",
        containLabel: true
      },
      backgroundColor:'#212650',
      borderRadius:[0,10,10,0],
      url:'http://172.19.201.201:8900/api/splunk?key=Intrusion Detection - Top 10 Target IP',//獲取數據的接口
      areaStyle:false,//折綫圖顯示數據時，是否顯示下方區域顔色,
      areaColor:['#fff','#ffe'],//多個為漸變色,最多3个
      xAxis: {//X軸顯示的字段
          data: ['dest'],
          axisLabel: {
              textStyle: {
                  color: '#fff'
              }
          }
      },
      yAxis: {
          axisLabel: {
              textStyle: {
                  color: '#ccc'
              }
          }
      },
      chartType :  'bar', //line  顯示為柱形或者折現
      legend: {
          show: false,
          data: ['count'],//Y軸顯示的字段
          icon: "circle", //图例形状
          orient: "horizontal",
          right: "30px",
          y: "10px",
          itemWidth: 8, // 图例图形宽度
          itemHeight: 8, // 图例图形高度
          textStyle: {
            color: "#fff",
            fontSize: 12
          }
      },
      isLineColor:false,
      LinearColor:['#FFF'],//數據顯示的顔色//多個為漸變色,最多3个
      visualMap: { //数据在不同区间显示不同颜色
        show:true,
        top: 120,
        right: 10,
        dimension:0,//根据Y轴数值变颜色  0-Y 1-X
          textStyle: {
          color: "#fff"
        },
        itemWidth: 6 ,
        itemHeight: 6 ,
        pieces: [ //区间设置
          {
            gt: 0,//最小
            lte: 5,//最大
            color: "#fdf62c"
          },
          {
            gt: 5,
            lte: 15,
            color: "#f95d3f"
          },
          {
            gt: 15,
            color: "#f72d2f"
          }
          ],//设置区间显示的颜色
        outOfRange: {
            color: '#999'
        }
    },
    }
  },

  {
    "id":'example_4',
    "type":1,//仪表板块的类型
    "width":"100%",
    "height":"200px",
    "chartType":"1",//圖表或者列表{0：列表,1:'竖柱形图',2:'横柱形图' }
    "chartData":{
      title:{//標題
        textStyle: {
            color: '#fff',
            fontSize:14,
            fontWeight: 'normal'
        },
        //位置信息
        x:10,
        y:10,
        text: 'Malware by Signature',
      },
      backgroundColor:'#212650',
      borderRadius:[10,10,0,0],
      url:'http://172.19.201.201:8900/api/splunk?key=Malware by Signature',//獲取數據的接口
      areaStyle:false,//折綫圖顯示數據時，是否顯示下方區域顔色,
      areaColor:[],//多個為漸變色,最多3个
      xAxis: {//X軸顯示的字段
          data: ['_time'],
          axisLabel: {
              textStyle: {
                  color: '#fff'
              }
          }
      },
      yAxis: {
          axisLabel: {
              textStyle: {
                  color: '#ccc'
              }
          }
      },
      chartType :  'bar', //line  顯示為柱形或者折現
      legend: {
          show: true,
          data: ['Hacktool.Ace','Heur.AdvML.B'],//Y軸顯示的字段
          icon: "circle", //图例形状
          orient: "horizontal",
          right: "30px",
          y: "10px",
          itemWidth: 8, // 图例图形宽度
          itemHeight: 8, // 图例图形高度
          textStyle: {
            color: "#fff",
            fontSize: 12
          }
      },
      isLineColor:false,
      LinearColor:['#f82c2e','#ff2d2e','#562a4b']//數據顯示的顔色//多個為漸變色,最多3个
    }
  },

  {
    "id":'example_5',
    "type":1,//仪表板块的类型
    "width":"100%",
    "height":"200px",
    "chartType":"1",//圖表或者列表{0：列表,1:'竖柱形图',2:'横柱形图' }
    "chartData":{
      title:{//標題
        textStyle: {
            color: '#fff',
            fontSize:14,
            fontWeight: 'normal'
        },
        //位置信息
        x:10,
        y:10,
        text: 'Access over Time by Action',
      },
      backgroundColor:'#212650',
      borderRadius:[10,10,0,0],
      url:'http://172.19.201.201:8900/api/splunk?key=Access over Time by Action',//獲取數據的接口
      areaStyle:true,//当以折綫圖顯示數據時，是否顯示下方區域顔色,
      areaColor:[],//多個為漸變色,最多3个，0个则使用调色板颜色
      xAxis: {//X軸顯示的字段
          data: ['_time'],
          axisLabel: {
              textStyle: {
                  color: '#fff'
              }
          }
      },
      yAxis: {
          axisLabel: {
              textStyle: {
                  color: '#ccc'
              }
          }
      },
      chartType :  'line', //line  顯示為柱形或者折現
      legend: {
          show: true,
          data: ['failure','success'],//Y軸顯示的字段
          icon: "circle", //图例形状
          orient: "horizontal",
          right: "30px",
          y: "10px",
          itemWidth: 8, // 图例图形宽度
          itemHeight: 8, // 图例图形高度
          textStyle: {
            color: "#fff",
            fontSize: 12
          }
      },
      isLineColor:false,
      LinearColor:['#f30','#0ff','#562a4b']//數據顯示的顔色//多個為漸變色,最多3个
    }
  },

  {
    "id":'example_6',
    "type":1,//仪表板块的类型
    "width":"100%",
    "height":"200px",
    "chartType":"2",//圖表或者列表{0：列表,1:'竖柱形图',2:'横柱形图' }
    "chartData":{
      title:{//標題
        textStyle: {
            color: '#fff',
            fontSize:14,
            fontWeight: 'normal'
        },
        //位置信息
        x:10,
        y:10,
        text: 'Intrusion Detection - Top 10 Attack Signature',
      },
      grid: {
        left: "40",
        right: "100",
        top: "50",
        bottom: "30",
        containLabel: true
      },
      backgroundColor:'#212650',
      borderRadius:[0,10,10,0],//数据是否带圆角，不需要不传
      url:'http://172.19.201.201:8900/api/splunk?key=Intrusion Detection - Top 10 Attack Signature',//獲取數據的接口
      areaStyle:false,//折綫圖顯示數據時，是否顯示下方區域顔色,
      areaColor:['#fff','#ffe'],//多個為漸變色,最多3个
      xAxis: {//X軸顯示的字段
          data: ['dest'],
          axisLabel: {
              textStyle: {
                  color: '#fff'
              }
          }
      },
      yAxis: {
          axisLabel: {
              textStyle: {
                  color: '#ccc'
              }
          }
      },
      chartType :  'bar', //line  顯示為柱形或者折現
      legend: {
          show: false,
          data: ['count'],//Y軸顯示的字段
          icon: "circle", //图例形状
          orient: "horizontal",
          right: "30px",
          y: "10px",
          itemWidth: 8, // 图例图形宽度
          itemHeight: 8, // 图例图形高度
          textStyle: {
            color: "#fff",
            fontSize: 12
          }
      },
      visualMap: {
          show:true,
          top: 120,
          right: 10,
          dimension:0,//根据Y轴数值变颜色  0-Y 1-X
            textStyle: {
            color: "#fff"
          },  
          itemWidth: 6 ,
          itemHeight: 6 ,
          pieces: [
            {
              gt: 0,
              lte: 5,
              color: "#fdf62c"
            },
            {
              gt: 5,
              lte: 15,
              color: "#f95d3f"
            },
            {
              gt: 15,
              color: "#f72d2f"
            }
            ],//设置区间显示的颜色
          outOfRange: {
              color: '#999'
          }
      },
      isLineColor:false,
      LinearColor:['#FF0']//數據顯示的顔色//多個為漸變色,最多3个
    }
  }
  ,
  {
    "id":'example_7',
    "span":24,
    "type":1,//仪表板块的类型
    "width":"100%",
    "height":"200px",
    "chartType":"0",//圖表或者列表{0：列表,1:'竖柱形图',2:'横柱形图' }
    "chartData":{
      url:'http://172.19.201.201:8900/api/splunk?key=Authentication Attempts by Users',//獲取數據的接口
     // dataFields:[{name:''}]
    }
  }
  ,
  {
    "id":'example_8',
    "type":1,//仪表板块的类型
    "span":24,
    "width":"100%",
    "height":"200px",
    "chartType":"0",//圖表或者列表{0：列表,1:'竖柱形图',2:'横柱形图' }
    "chartData":{
      url:'http://172.19.201.201:8900/api/splunk?key=Users Added to Privilege Group',//獲取數據的接口
     // dataFields:[{name:''}]
    }
  }
  ]
}


export default dashboardDatas