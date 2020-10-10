import $ from 'jquery';
import guid from './guid';
import breamcrumb from './breamcrumb';
import axios from '../axios';
import jsencrypt from 'jsencrypt';
const objsToFormData =  function(formdata, postModel, parKey) {
    parKey = parKey || '';
    var type = Object.prototype.toString.call(postModel);
    if (type == '[object Array]') {
        $.each(postModel, function (i, n) {
            objsToFormData(formdata, n, parKey + '[' + i + ']');
        });
    }
    else if (type == '[object Object]') {
        for (var i in postModel) {
            objsToFormData(formdata, postModel[i], parKey ? parKey + '.' + i : i);
        }
    } else {
        formdata.append(parKey, postModel);
    }
}
/**
 * @info 检测perStr中是否可以通过regs里的权限
 * @param {Array} perArr example: 'get-/user,get-/role,put-/user';
 * @param {Array} regs example: ^(GET|POST)-(/user|/users)$;
 * @return 如果其中一个匹配到则直接返回true
 */
function permissionSome(perArr,regs){
    let res = false;
    if(typeof perArr==='string' && perArr.indexOf(',')!=-1){
        perArr = perArr.split(',');
    }
    regs.forEach(item=>{
        let reg = new RegExp(item);
        let isFind = perArr.filter(per=>{
            return reg.test(per);
        });
        if(isFind.length>0){
            res=true;
            return false;
        }
    });
    return res
}
//只能转换 dd/MM/yyyy 或者 dd/MM/yyyy hh:mm:ss格式的时间字符串
function changeStringToDate(strDate,hasTime=false,datePrefix='/'){
    let res = null;
    if(strDate.indexOf(datePrefix)==-1){
        if(strDate.indexOf('-')!=-1){
            datePrefix='-';
        }
    }
    if(strDate.indexOf(':')!=-1){
        hasTime= true;
    }
    if(strDate.indexOf('T')!=-1){
        strDate = strDate.replace('T',' ');
    }
    if(strDate){
        try{
            if(hasTime){
                if(datePrefix=='/'){
                    let dateTimeArr = strDate.split(' ');
                    let dateArr = dateTimeArr[0].split(datePrefix);
                    let d = dateArr[0]*1;
                    let m = dateArr[1]*1;
                    let y = dateArr[2]*1;
                    let timeArr = dateTimeArr[1].split(':');
                    let h = timeArr[0]*1;
                    let mm = timeArr[1]*1;
                    let s = timeArr[2]?timeArr[2]*1:'00';
                    res = new Date(y,m-1,d,h,mm,s);
                }else{
                    let dateTimeArr = strDate.split(' ');
                    let dateArr = dateTimeArr[0].split(datePrefix);
                    let d = dateArr[2]*1;
                    let m = dateArr[1]*1;
                    let y = dateArr[0]*1;
                    let timeArr = dateTimeArr[1].split(':');
                    let h = timeArr[0]*1;
                    let mm = timeArr[1]*1;
                    let s = timeArr[2]?timeArr[2]*1:'00';
                    res = new Date(y,m-1,d,h,mm,s);
                }
            }else{
                if(datePrefix=='/'){
                    let dateArr = strDate.split(datePrefix);
                    let d = dateArr[0]*1;
                    let m = dateArr[1]*1;
                    let y = dateArr[2]*1;
                    res = new Date(y,m-1,d);
                }else{
                    let dateArr = strDate.split(datePrefix);
                    let d = dateArr[2]*1;
                    let m = dateArr[1]*1;
                    let y = dateArr[0]*1;
                    res = new Date(y,m-1,d);
                }
                
            }
        }catch(e){
            console.log(e);
        }
    }
    return res;
}

function createEncrypt(publicKey,opts={}){
    var encrypt = new JSEncrypt();
     
    encrypt.setPublicKey(publicKey);
     
    return encrypt;
     
    // let encryptText = ('username=xxxxx&password=xxfxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx&clientid=aaaa&clientSecret=bbbbb');
}

function objectToQueryString(obj){
    let res = [];
    if(obj){
        Object.keys(obj).forEach(item=>{
            let temp = [];
            temp.push(item);
            temp.push(obj[item]||'');
            res.push(temp.join('='));
        });
    }
    return res.join('&')
}

let cacheAjax = {
    PageCacheConfig: { timeount: 5000, step: 50 }
    , PageCacheData: []//页面异步缓存数据
    , PageCache: function (type, url, param, callback) {//页面缓存数据获取方法，type值同一个页面一样。
        var cacheFactory;
        if (typeof cacheAjax.PageCacheData[type] === 'undefined') {
            cacheFactory = cacheAjax.PageCacheData[type] = [];
            cacheFactory[param.type] = [];
            cacheFactory[param.type]['state'] = 'start';
            cacheFactory[param.type]['data'] = null;
        } else {
            cacheFactory = cacheAjax.PageCacheData[type];
            if (typeof cacheFactory[param.type] == 'undefined') {
                cacheFactory[param.type] = [];
                cacheFactory[param.type]['state'] = 'start';
                cacheFactory[param.type]['data'] = null;
            }
        }
        //console.log(cacheFactory)
        if (cacheFactory[param.type]['state'] == 'init' || cacheFactory[param.type]['state'] == 'loaded') {
            var starttime = 0;
            var timer = setInterval(function () {
                if (cacheFactory[param.type]['state'] == 'loaded') {
                    if (cacheFactory[param.type]['data']) {
                        
                        clearInterval(timer);
                        callback(cacheFactory[param.type]['data']);
                    }
                }
            }, cacheAjax.PageCacheConfig.step);
        } else if (cacheFactory[param.type]['state'] == 'start' && cacheFactory[param.type]['state'] != 'loaded') {
            console.log(cacheFactory[param.type]['state']);
            cacheFactory[param.type]['state'] = 'init';
            axios.fetch(url, param.data).then((data) =>{
                if(data.code==200){
                    cacheFactory[param.type]['state'] = 'loaded';
                    cacheFactory[param.type]['data'] = data;
                    callback(data);
                }else{
                    cacheFactory[param.type] = [];
                }
            }).catch(e=>{
                console.warn(e);
            });
        }
    }
}

const utils = {
    objsToFormData,
    permissionSome,
    changeStringToDate,
    cacheAjax,
    createEncrypt,
    objectToQueryString,
    //permissionAll,
    queryByKeyValue(arr,key,value){
        let res = [];
        arr.filter((item,index)=>{
            return item[key] == value;
        });
        return res;
    },
    $:$,
    extend:$.extend,
    deboundsEvent: function (timeout) {
        var isRun = false;
        return function (callback) {
            if (isRun == true) return false;
            isRun = true;
            callback && callback();
            setTimeout(function () {
                isRun = false;
            }, timeout);
        }
    },
    breamcrumb,
    ...guid
}

export const isEmpty = (keys) => {
    if (typeof keys === "string") {
        keys = keys.replace(/\"|&nbsp;|\\/g, '').replace(/(^\s*)|(\s*$)/g, "");
        if (keys == "" || keys == null || keys == "null" || keys === "undefined" ) {
            return true;
        } else {
            return false;
        }
    } else if (typeof keys === "undefined") {  // 未定义
        return true;
    } else if (typeof keys === "number") {
        return false;
    }else if(typeof keys === "boolean"){
        return false;
    }else if(typeof keys == "object"){
        if(JSON.stringify(keys )=="{}"){
            return true;
        }else if(keys == null){ // null
            return true;
        }else{
            return false;
        }
    }

    if(keys instanceof Array && keys.length == 0){// 数组
        return true;
    }

}
export const extend = $.extend;
export default utils