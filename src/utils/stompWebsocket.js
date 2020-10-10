import cookies from 'vue-cookies';
import Sockjs from 'sockjs-client';
if(typeof Stomp=='undefined'){
    throw new Error('请先引用 stomp.js,'+'可以使用CDN: <script type="application/javascript" src="http://cdn.bootcss.com/stomp.js/2.3.3/stomp.min.js"></script>');
}
const propDefaults = {
    url:'http://172.19.201.201:8901/wserver'
}
export class bwSocket{
    constructor(props={}){
        this.props = Object.assign({},propDefaults, props);
        this.socket=null;
        this.stompClient = null;
        this.subscribes = [];
        // client does not want to receive heartbeats
        this.status = '0';//0：未连接，1:成功，2:失败 3:连接中
    }
    connect(opts={}){
          // 建立连接对象（还未发起连接）
          this.socket=new Sockjs(this.props.url);
        
          // 获取 STOMP 子协议的客户端对象
          this.stompClient = Stomp.over(this.socket);
          this.stompClient.heartbeat.outgoing = 20000; 
          // client will send heartbeats every 20000ms
          this.stompClient.heartbeat.incoming = 0;
        if(this.status==3)return false;
        var self = this;
        // 向服务器发起websocket连接并发送CONNECT帧
        const token =cookies.get("accessToken");
        const ltyp = localStorage.getItem("typ");
        opts = Object.assign({
            typ: ltyp,
            bw_token: token
        },opts);
        return new Promise((resolve,reject)=>{
            this.status = 3;
            this.stompClient.connect(
                opts,
                function connectCallback (frame) {
                    // 连接成功时（服务器响应 CONNECTED 帧）的回调方法
                        console.log('已连接【' + frame + '】');
                        self.status = 1;
                        resolve(self,frame);
                        
                        //stompClient.subscribe('/queue/1261127670520643585', function (response) {
                        // showResponse(response.body);
                        //    console.log(response.body)
                        //});
                },
                function errorCallBack (error) {
                    self.status = 2;
                    reject(error,self);
                    // 连接失败时（服务器响应 ERROR 帧）的回调方法
                    console.log('连接失败【' + error + '】');
                }
            );
            console.log(this.stompClient);
        });
    }
    disconnect(){
        this.stompClient && this.stompClient.disconnect();
    }
    hasSubscribe(url){
        return this.subscribes.filter((item,value)=>{
            return item.url==url;
        }).length>0;
    }
    subscribe(url,callback){
        if(this.status==1){
            var clientsubscribe = this.stompClient && this.stompClient.subscribe(url,(response)=>{
                callback && callback.call(this,response);
                console.log(response);
            });
            this.subscribes.push({url:url,subscribe:clientsubscribe});
        }
    }
    clearAllSubscribe(){
        this.subscribes.forEach((item,key)=>{
            item.subscribe.unsubscribe();
        });
        this.subscribes = [];
    }
    unsubscribe(url,callback){
        if(this.status==1){
            let index = -1;
            this.subscribes.forEach((item,key)=>{
                if(item.url==url){
                    item.subscribe.unsubscribe();
                    index = key;
                }
            });
            if(index!=-1){
                this.subscribes.splice(index,1);
            }
            // this.stompClient && this.stompClient.unsubscribe(url,(response)=>{
            //     callback && callback.call(this,response);
            //     console.log(response);
            // });
        }
    }
}