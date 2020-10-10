import VeeValidate,{ Validator } from 'vee-validate';
import $ from 'jquery';
import i18n from '../i18n/index';
import dictionary from './config'


Validator.extend('address', {
// getMessage: field => 'The ' + field + ' value is not truthy.',
    validate: (value,target) => {
        return /^[\u4e00-\u9fa5\w\s\_\.\-\(\)]+$/mg.test(value);
    }
});
Validator.extend('effective', {
    // getMessage: field => 'The ' + field + ' value is not truthy.',
    validate: (value,target) => {
        return /^[\u4e00-\u9fa5\w]+$/mg.test(value);
    }
});

const validate = {validate:null};
//如果需要加载的模块需要引用VUE，则需要添加 install 方法进行加载
validate.install = (Vue,config={})=>{
    //默认的配置
    let defaultConfig = $.extend(true,{},dictionary);
    
    defaultConfig = $.extend(true,{},defaultConfig,config);
    if(process.env.NODE_ENV!='production'){
        console.log(defaultConfig)
    }
    console.log(defaultConfig);
    if(defaultConfig.preUseHandler){
        defaultConfig.preUseHandler(VeeValidate,Validator,defaultConfig);
    }
    Vue.use(VeeValidate,{
        i18nRootKey: 'validations', // customize the root path for validation messages.
        i18n:i18n.i18n,
         errorBagName: 'errorBags', // change if property conflicts.
         fieldsBagName: 'fieldBags',
         defaultConfig
      });
      validate.VeeValidate = VeeValidate;
      validate.Validator = Validator;
};

export default validate;