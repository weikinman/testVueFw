<template>
    <div>
        <el-form 
            :ref="'bw_form_'+(formConfigs.formid)" 
            :resetFields="formReset" 
            :model="formConfigs.formData" 
            :label-width="formConfigs.styles.labelWidth"
            :label-position="formConfigs.styles.labelPostion"
            :size="formConfigs.styles.size"
            :disabled="formConfigs.styles.disabled"
        >
        <slot></slot>
        <slot name="bwformprev" v-bind="{_that:this}" ></slot>
        <FormLayout v-for="item in formInfo.datas" :key="item.id" :formdata="item">
            <template v-for="(_, slot) in $slots">
                <template :slot="slot">
                <slot :name="slot"></slot>
                </template>
            </template>
        </FormLayout>
        <slot name="bwformlast" v-bind="{_that:this}" ></slot>
        </el-form>
        
    </div>
</template>
<script>
import FormLayout from './FormLayout';
import utils from '../../utils/index';
import $ from 'jquery';
export default {
    props:
    {
       formConfigs:{
           type:Object,
            default:function(){
                return {
                    formid:'formid_1',
                    formData:{},
                    $validaters:[],
                    datas:[],
                    __super:null,
                    styles:{
                         
                    }
                }
            }
       }
    },
    provide:function(){
            return {
                formConfigs:this.formConfigs
            }
    },
    components: {
        FormLayout
    },
    methods:{
        getFieldInfo(fieldName){

        },
       formSubmit(){
           let validaters = [];
           this.formConfigs.$validaters.forEach(item=>{
               const res = item.validateHandler();
            //    res.then(result=>{
            //        console.log(result);
            //    })
               validaters.push(res);
           });
         //  console.log('formSubmit',validaters)
        //    var $form = this.$refs['bw_form_'+this.formConfigs.formid];
        //    validaters.push(this.$validator.validateAll());
        // Promise.all(validaters).then(res=>{
        //     console.log('promise_result',res);
        // })
           return Promise.all(validaters);
          
       },
       upDateChildrens(){
        //    this.$nextTick(res=>{
        //         this.formConfigs.$formCells.forEach(item=>{
        //             item.$forceUpdate();
        //         });
        //    })
           this.$emit('file.formCellUpdate');
       },
       getFormValidates(){
           let validaters = [];
           this.formConfigs.$validaters.forEach(item=>{
               const res = item.validateHandler();
               validaters.push(res);
           });
           return validaters;
       },
       formReset(){
           var $form = this.$refs['bw_form_'+this.formConfigs.formid];
           if($form){
               let resets = [];
                // this.formConfigs.$validaters.forEach(item=>{
                //     if(item.resetForm){
                //         resets.push(item.resetForm());
                //     }
                // });
               
                   this.validateReset();
                   $form.resetFields();
                   setTimeout(()=>{
                    this.$forceUpdate();
                   },100)
               
               
           }
       },
       validateReset(){
           let validaters = [];
           this.formConfigs.$validaters.forEach(item=>{
               validaters.push(item.resetValidate());
               item.mountedChange();
           });
           return Promise.all(validaters).then((results)=>{
                if (results.indexOf(false) > -1) {
                    console.log("没能全部reset")
                    return
                }

                // 校验全部通过处理
                console.log("全部reset");
                // this.$emit('formSubmit')
           })
       }
    },
    
    created(){
       // this.formConfigs.$validaters = [];
        this.formInfo = this.formConfigs;
        if(!this.formConfigs.formid){
            this.formConfigs.formid = utils.NewGuid().ToString();
        }
        if(!this.formConfigs.$formCells){
            this.formConfigs.$formCells = [];
        }
        this.formConfigs.__super = this;
        let defaultStyles = {
                labelWidth:"auto",
                labelPostion:'right',
                size:'mini',
                disabled:false
            }
        if(!this.formConfigs.styles){
            this.formConfigs.styles = defaultStyles;
        }else{
            this.formConfigs.styles = $.extend(true,{},defaultStyles,this.formConfigs.styles);
        }
      //  console.log('form component',this.formConfigs)
        
    },
    data(){
        return {
           __super:this,
           formInfo:{}
        }
    }
}
</script>
<style >
.form-item-error{
    position: absolute;
    font-size: .14rem;
    color: #ff0000;
    left: 2px;
    bottom: -26px;
}
.is-danger input:not(.el-select__input), 
.is-danger select, 
.is-danger textarea {
 border: 1px solid #ff0000;
}
</style>