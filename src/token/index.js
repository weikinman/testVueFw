import axiosConfig from '../axios';
import $cookies from 'vue-cookies';
import '../polyfill/index';
const errorCodeMsg = axiosConfig.errorCodeMsg;
const post = axiosConfig.post;
export default class RefreshToken{
    constructor(opts){
        this.tokenOpts = {
            refreshPrev:null,
            refreshNext:null,
            refreshCatch:null,
            refreshUrl:'',
            timeout:3000000
        }
        this.context = null;
        this.timer=null;
        Object.assign(this.tokenOpts,opts);
    }
    
    
    setOptions(opts){
        Object.assign(this.tokenOpts,opts);
    }
    runRefresh(opts){
        if(opts && opts.context){
            this.context = opts.context;
        }
        if(!this.timer){
            console.log('refreshToken',this)
            this.timer = setInterval(() => {
                this.refresh_token();
            }, this.tokenOpts.timeout);
        }
    }
    stopRefreshToken(){
        clearInterval(this.timer);
        this.timer = null;
    }
    refresh_token(){
        const rtoken = $cookies.get("refreshToken");
        const typ = localStorage.getItem("typ");
        //const userlogin = sessionStorage.getItem("userlogin");
        if(!rtoken || !typ)return false;
        if(this.tokenOpts.refreshNext){
            this.tokenOpts.refreshNext.call(this,response);
        }
        console.log('refreshToken',rtoken,typ)
        this.context && this.context.$post && this.context.$post(this.tokenOpts.refreshUrl,{}, {
            headers: {
                typ: typ,
                bw_token: rtoken
            }
        },{noShowTips:true}).then(response => {
            let rcode = response.code;
            if (rcode == 200) {
                //生效token
                let accessToken = response.data.accessToken;
                //刷新token
                let refreshToken = response.data.refreshToken;
                //设置生效token
                $cookies.set("accessToken", accessToken, "1h");
                $cookies.set("TokenTime", true, "50MIN");
                //设置刷新token
                console.log('refreshToken',refreshToken)
                $cookies.set("refreshToken", refreshToken, "2h");
            }
            else if (rcode == 401) {
                sessionStorage.removeItem("userlogin");
            }
            if(this.tokenOpts.refreshNext){
                this.tokenOpts.refreshNext.call(this,response);
            }
        }).catch(err =>{
            console.log(err);
            sessionStorage.removeItem("userlogin");
            if(this.tokenOpts.refreshCatch){
                this.tokenOpts.refreshCatch.call(this,err);
            }
        })
    }
}

export const createRefreshToken = (opts)=>{
    return new RefreshToken(opts);
}