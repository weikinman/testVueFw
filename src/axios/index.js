import axios from "axios";
import {errorMsg} from '../Message/index';
import NProgress from 'nprogress';
import i18n from '../i18n/index';
import 'nprogress/nprogress.css';
/**
 * $\{((\w+|\.)+)\}$/g.exec('${401.account.authen.failure}')
 * echo ['${401.account.authen.failure}','401.account.authen.failure',...]
 */
const responseHandler = (res)=>{
    return res.data;
}
let options = {
    debug:false,
    isLoading:false,
    filterResponse:null,
    filterRequest:null,
    responseHandler:responseHandler,
    prevSend:null,
    endSend:null,
    errorHandler:null,
    catchHandler:null,
    errorTimeout:5000,
    showTipsCount:1
}
const setOption = (opts)=>{
    options = Object.assign({},options,opts);
}
const ERROR_MSG_REG = /\$\{((\w+|\.)+)\}$/g; ///\
const getErrorMsg = function(msg){
    //匹配到的时候获取数组中index为1的数据
    return ERROR_MSG_REG.exec(msg);
}

let axiosrequest = axios.interceptors.request.use(
    config => {
        const token = true;
        if(typeof options.filterRequest=="function"){
            options.filterRequest(config);
        }
        if (token) {
            // config.headers = Object.assign({},config.headers,{ 'token':token})
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);
let axiosresponse = axios.interceptors.response.use(
    res => {
        // if(res.data.code==200){
        if(typeof options.filterResponse=="function"){
            options.filterResponse(res);
        }
        return options.responseHandler(res);
        //  }
    },
    err => {
        return Promise.reject(err);
    }
);
//根据状态显示错误信息
const errorCodeMsg = function (code, msg,extInfo) {
    if (code != 200) {
        msg = getResponsei18nMsg.call(this, msg,extInfo);
    }
}

//根据返回信息显示错误信息(i18n)
const getResponsei18nMsg = function (msg,extInfo) {
    let showMsg = msg;
    console.log('getResponsei18nMsg',i18n);
    if(i18n && i18n.i18n.t ){
        let perLen = msg.indexOf('%{');
        if(perLen!=-1){
            let msgArr = msg.split('%');
            let msgStrs = [];
            msgArr.forEach((item,index)=>{
                if(index!=0){
                    msgStrs.push(item.replace('{','').replace('}',''));
                }else{
                    msgStrs.push(i18n.i18n.t('responseMsg["' + item+'"]'));
                }
            });
            showMsg = msgStrs.join('');
        }else{
            showMsg = i18n.i18n.t('responseMsg["' + msg+'"]');
        }
        
    }
    return errorMsg(showMsg, "", options.errorTimeout,options.showTipsCount);
}

const loadingHandler = ()=>{
    if(options.isLoading){
        NProgress.start()
        return NProgress;
    }
}

const closeLoading = (loading)=>{
    if(options.isLoading){
        loading && loading.done();
    }
}

const fetch = function (url, params, config={}) {
    const loading = loadingHandler.call(this);
    if(typeof options.prevSend=="function"){
        options.prevSend(url, params, config);
    }
    return new Promise((resolve, reject) => {
        axios.get(url, { ...params, ...config }).then(res => {
            if(res || options.debug){
                resolve(res);
            }else{
              
               if(config && config.responseHandler){
                config.responseHandler(res);
               }
            }
            if(res.error&&!config.noShowTips){
                errorCodeMsg.call(this, res.code, res.error,options.extInfo);
            }
            if(res.code==500 && !res.error){
                if(!config.noShowTips){
                    if(i18n && i18n.i18n.t ){
                        errorMsg(i18n.i18n.t('responseMsg.requestError'), "error", "5000",options.showTipsCount);
                    }
                }
            }
            closeLoading(loading);
            if(typeof options.endSend=="function"){
                options.endSend(url, res, config);
            }
        }).catch(error => {
            if(!config.noShowTips){
                if(i18n && i18n.i18n.t ){
                    errorMsg(i18n.i18n.t('responseMsg.requestError'), "error", "5000",options.showTipsCount);
                }
            }
            
            closeLoading(loading);
            if(typeof options.errorHandler=="function"){
                options.errorHandler(url, error, config);
            }
        });
    }).catch(e=>{
        reject(res);
        closeLoading(loading);
        console.log(e);
    });
}

const post = function (url, params, config={}) {
    const loading = loadingHandler.call(this);
    if(typeof options.prevSend=="function"){
        options.prevSend(url, params, config);
    }
    return new Promise((resolve, reject) => {
        axios.post(url, params, config).then(res => {
            if(res || options.debug){
                resolve(res);
            }else{
                if(config && config.responseHandler){
                    config.responseHandler(res);
                   }
            }
            if(res.error&&!config.noShowTips){
                errorCodeMsg.call(this, res.code, res.error,options.extInfo);
            }
            if(res.code==500 && !res.error){
                if(!config.noShowTips){
                    if(i18n && i18n.i18n.t ){
                        errorMsg(i18n.i18n.t('responseMsg.requestError'), "error", "5000",options.showTipsCount);
                    }
                }
            }
            closeLoading(loading);
            if(typeof options.endSend=="function"){
                options.endSend(url, res, config);
            }
        }).catch(error => {
            if(!config.noShowTips){
                if(i18n && i18n.i18n.t ){
                    errorMsg(i18n.i18n.t('responseMsg.requestError'), "error", "5000",options.showTipsCount);
                }
            }
            //reject(error);
            closeLoading(loading);
            if(typeof options.errorHandler=="function"){
                options.errorHandler(url, error, config);
            }
        });
    }).catch(e=>{
        reject(e);
        closeLoading(loading);
        console.log(e);
    });
}

const put = function (url, params, config={}) {
    const loading = loadingHandler.call(this);
    if(typeof options.prevSend=="function"){
        options.prevSend(url, params, config);
    }
    return new Promise((resolve, reject) => {
        axios.put(url, params, config).then(res => {
            if(res || options.debug){
                resolve(res);
            }else{
                if(config && config.responseHandler){
                    config.responseHandler(res);
                   }
            }
            if(res.error&&!config.noShowTips){
                errorCodeMsg.call(this, res.code, res.error,options.extInfo);
            }
            if(res.code==500 && !res.error){
                if(!config.noShowTips){
                    if(i18n && i18n.i18n.t ){
                        errorMsg(i18n.i18n.t('responseMsg.requestError'), "error", "5000",options.showTipsCount);
                    }
                }
            }
            closeLoading(loading);
            if(typeof options.endSend=="function"){
                options.endSend(url, res, config);
            }
        }).catch(error => {
            if(!config.noShowTips){
                if(i18n && i18n.i18n.t ){
                    errorMsg(i18n.i18n.t('responseMsg.requestError'), "error", "5000",options.showTipsCount);
                }
            }
           // reject(error);
            closeLoading(loading);
            if(typeof options.errorHandler=="function"){
                options.errorHandler(url, error, config);
            }
        });
    }).catch(e=>{
        reject(e);
        closeLoading(loading);
        console.log(e);
    });
}
const $delete = function (url, params, config={}) {
    const loading = loadingHandler.call(this);
    if(typeof options.prevSend=="function"){
        options.prevSend(url, params, config);
    }
    return new Promise((resolve, reject) => {
        axios.delete(url, params, config).then(res => {
            if(res || options.debug){
                resolve(res);
            }else{
                if(config && config.responseHandler){
                    config.responseHandler(res);
                   }
            }
            if(res.error&&!config.noShowTips){
                errorCodeMsg.call(this, res.code, res.error,options.extInfo);
            }
            if(res.code==500 && !res.error){
                if(!config.noShowTips){
                    if(i18n && i18n.i18n.t ){
                        errorMsg(i18n.i18n.t('responseMsg.requestError'), "error", "5000",options.showTipsCount);
                    }
                }
            }
            closeLoading(loading);
            if(typeof options.endSend=="function"){
                options.endSend(url, res, config);
            }
        }).catch(error => {
            if(!config.noShowTips){
                if(i18n && i18n.i18n.t ){
                    errorMsg(i18n.i18n.t('responseMsg.requestError'), "error", "5000",options.showTipsCount);
                }
            }
           // reject(error);
            closeLoading(loading);
            if(typeof options.errorHandler=="function"){
                options.errorHandler(url, error, config);
            }
        });
    }).catch(e=>{
        reject(e);
        closeLoading(loading);
        console.log(e);
    });
}
const $axios = function (config={}) {
    const loading = loadingHandler.call(this);
    if(typeof options.prevSend=="function"){
        options.prevSend( config);
    }
    return new Promise((resolve, reject) => {
        axios(config).then(res => {
            if(res || options.debug){
                resolve(res);
            }else{
                if(config && config.responseHandler){
                    config.responseHandler(res);
                   }
            }
            if(res.error&&!config.noShowTips){
                errorCodeMsg.call(this, res.code, res.error,options.extInfo);
            }
            if(res.code==500 && !res.error){
                if(!config.noShowTips){
                    if(i18n && i18n.i18n.t ){
                        errorMsg(i18n.i18n.t('responseMsg.requestError'), "error", "5000",options.showTipsCount);
                    }
                }
            }
            closeLoading(loading);
            if(typeof options.endSend=="function"){
                options.endSend( res, config);
            }
        }).catch(error => {
            if(!config.noShowTips){
                if(i18n && i18n.i18n.t ){
                    errorMsg(i18n.i18n.t('responseMsg.requestError'), "error", "5000",options.showTipsCount);
                }
            }
           // reject(error);
            closeLoading(loading);
            if(typeof options.errorHandler=="function"){
                options.errorHandler( error, config);
            }
        });
    }).catch(e=>{
        reject(e);
        closeLoading(loading);
        console.log(e);
    });
}
const install = (Vue,opts)=>{
    Vue.bwAxios = axiosConfig;
    Vue.prototype.bwAxios = axiosConfig;
    Vue.prototype.$http = axios;
    Vue.prototype.$post = post;
    Vue.prototype.$fetch = fetch;
    Vue.prototype.$put = put;
    Vue.prototype.$axios = $axios;
    Vue.prototype.$fetchDel = $delete;
    return axiosConfig;
}
const axiosConfig = {
    setOption,
    options,
    fetch,
    post,
    put,
    $delete,
    $axios,
    errorMsg,
    loadingHandler,//必須返回一個loading 在 closeLoading時關閉
    closeLoading,
    axios,//暴露当前实例的axios
    axiosrequest,//为了自定义，可以使用axios.interceptors.request.eject(axiosrequest);删除改拦截器
    axiosresponse//为了自定义，可以使用axios.interceptors.response.eject(axiosresponse);删除改拦截器
    ,install
}


export default axiosConfig