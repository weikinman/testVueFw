import VueI18n from 'vue-i18n';
import local_zh from './lang/zh';
import local_en from './lang/en';
import responsemsg_zh from './lang/responsemsg-zh';
import responsemsg_en from './lang/responsemsg-en';
import responsemsg_tw from './lang/responsemsg-zh-tw';
import elementui_zh from 'element-ui/lib/locale/lang/zh-CN';
import elementui_en from 'element-ui/lib/locale/lang/en';
import elementui_tw from 'element-ui/lib/locale/lang/zh-TW';
import {extend} from '../utils/index';
//elementEnLocale 和elementZhLocale 
const i18n = {i18n:null};
//如果需要加载的模块需要引用VUE，则需要添加 install 方法进行加载
i18n.install = (Vue,config={})=>{
    Vue.use(VueI18n);
    //默认的配置
    let defaultConfig = { 
        locale: 'zh', // 语言标识 
        messages: { 
            'zh': {
                ...local_zh,
                ...responsemsg_zh,
                ...elementui_zh
            } ,
            'en': {
                ...local_en,
                ...responsemsg_en,
                ...elementui_en
            },
            'zh-TW': {
                ...responsemsg_tw,
                ...elementui_tw
            }
        } 
    };

    defaultConfig = extend(true,{},defaultConfig,config);
    if(process.env.NODE_ENV!='production'){
        console.log(defaultConfig)
    }
    let _i18n = new VueI18n(defaultConfig);
    i18n.i18n = _i18n;
    Vue.use(_i18n);
    
    return _i18n;
};

function extI18n(Vue){
    //擴展i18n的方法
    let translate = Vue.prototype.$t;
    Vue.prototype.$t = function(msg,ext){
        //console.log('test i18nnnnn')
        if(ext){
            if(typeof ext=='object' ){
                let trnMsg = msg;
                trnMsg = translate.call(this,trnMsg);
                if(trnMsg && trnMsg.indexOf('{{')!=-1){
                    Object.keys(ext).forEach(item=>{
                        if(trnMsg&& trnMsg.indexOf('{{')!=-1 && trnMsg.indexOf(item)!=-1){
                        let reg = new RegExp('{{'+item+'}}','mg');
                        trnMsg = trnMsg.replace(reg,ext[item]);
                        }
                    });
                    return trnMsg;
                }else{
                    return translate.call(this,msg,ext);
                }
            }
        }else{
            return translate.call(this,msg,ext);
        }
    }
}
i18n.extI18n = extI18n;
export default i18n;