<template>
    <div  v-show="formdata.isShow!==false" :class="['bw-form-cell',className]">
        <template class="bw-form-cell-title" v-if="formdata.datatype=='boolean' && formdata.formater=='checkbox'">
            <el-form-item :ref="'bwminformitem_'+formdata.field+'_'+index"  v-show="formdata.isShowLabel" :prop="formdata.field+'_'+index" >
                <el-checkbox-group 
                    :ref="'bwminform_'+formdata.field"
                    v-model="values[formdata.field]" 
                    :name="formdata.field+'_'+index"
                    v-validate="validaterules"
                    :class="{'input': true, 'is-danger':  errorBags.first(formdata.field+'_'+index) }"
                    >
                    <el-checkbox 
                        @change="fieldChange"
                        :disabled="formdata.disabled===true"
                        :label="''"
                        :value="true"></el-checkbox>
                </el-checkbox-group>
                <span class="form-item-error">{{ errorBags.first(formdata.field+'_'+index) }}</span>
            </el-form-item>
        </template>
        <template class="bw-form-cell-title" v-if="formdata.datatype=='boolean' && (!formdata.formater||formdata.formater=='switch')">
           <el-form-item :ref="'bwminformitem_'+formdata.field+'_'+index" v-show="formdata.isShowLabel" :prop="formdata.field+'_'+index"  >
                <el-switch
                     @change="fieldChange"
                    :ref="'bwminform_'+formdata.field"
                    v-model="values[formdata.field]" 
                    placeholder=""
                    :name="formdata.field+'_'+index"
                    :disabled="formdata.disabled===true"
                    v-validate="validaterules"
                    :class="{'input': true, 'is-danger':  errorBags.first(formdata.field+'_'+index) }"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
                <span class="form-item-error">{{ errorBags.first(formdata.field+'_'+index) }}</span>
            </el-form-item>
        </template>
        <template v-if="formdata.datatype=='string'">
            <el-form-item :ref="'bwminformitem_'+formdata.field+'_'+index" v-show="formdata.isShowLabel" :prop="formdata.field+'_'+index"  >
                <el-input 
                 @input="fieldChange"
                :ref="'bwminform_'+formdata.field"
                v-model="values[formdata.field]"
                :type="formdata.formater=='textarea'?'textarea':'text'" 
                placeholder=""
                :disabled="formdata.disabled===true"
                :name="formdata.field+'_'+index"
                v-validate="validaterules"
                :class="{'input': true, 'is-danger':  errorBags.first(formdata.field+'_'+index) }"
                ></el-input>
                <span class="form-item-error">{{ errorBags.first(formdata.field+'_'+index) }}</span>
            </el-form-item>
        </template>
        <template v-if="formdata.datatype=='date'">
            <el-form-item :ref="'bwminformitem_'+formdata.field+'_'+index" v-show="formdata.isShowLabel" :prop="formdata.field+'_'+index"  >
                
                 <el-date-picker
                    @change="fieldChange"
                     :ref="'bwminform_'+formdata.field"
                    v-model="values[formdata.field]" 
                    placeholder=""
                    :name="formdata.field+'_'+index"
                    :disabled="formdata.disabled===true"
                    v-validate="validaterules"
                    :value-format="formdata.dataformat||''"
                    :class="{'input': true, 'is-danger':  errorBags.first(formdata.field+'_'+index) }"
                    type="datetime">
                    </el-date-picker>
                <span class="form-item-error">{{ errorBags.first(formdata.field+'_'+index) }}</span>
            </el-form-item>
        </template>
        <template v-if="formdata.datatype=='picklist'">
            <template v-if="!formdata.mutil &&formdata.formater=='select'">
                <el-form-item :ref="'bwminformitem_'+formdata.field+'_'+index" v-show="formdata.isShowLabel" :prop="formdata.field+'_'+index"  >
                    <el-select 
                    @change="fieldChange"
                    :ref="'bwminform_'+formdata.field"
                    v-model="values[formdata.field]" 
                    :name="formdata.field+'_'+index"
                    v-validate="validaterules"
                    :disabled="formdata.disabled===true"
                    :class="{'input': true, 'is-danger':  errorBags.first(formdata.field+'_'+index) }"
                    placeholder="">
                        <el-option v-if="!formdata.required"  :label="$t('请选择')" value=""></el-option>
                        <el-option v-for="item in formdata.formaterItems"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <span class="form-item-error">{{ errorBags.first(formdata.field+'_'+index) }}</span>
                </el-form-item>
            </template>
            <template v-if="formdata.formater=='radio'">
                <el-form-item :ref="'bwminformitem_'+formdata.field+'_'+index" v-show="formdata.isShowLabel" :prop="formdata.field+'_'+index"  >
                    <el-radio-group 
                        :ref="'bwminform_'+formdata.field"
                        v-model="values[formdata.field]" 
                        :name="formdata.field+'_'+index"
                        v-validate="validaterules"
                        :class="{'input': true, 'is-danger':  errorBags.first(formdata.field+'_'+index) }"
                    >
                        <el-radio v-for="item in formdata.formaterItems"
                            @change="fieldChange"
                            :key="item.value"
                            :disabled="formdata.disabled===true"
                            :label="item.value"
                            :value="item.value">
                            {{item.label}}
                            </el-radio>
                    </el-radio-group>
                   
                    <span class="form-item-error">{{ errorBags.first(formdata.field+'_'+index) }}</span>
                </el-form-item>
            </template>
            <template v-if="formdata.mutil && formdata.formater=='checkbox'">
                <el-form-item :ref="'bwminformitem_'+formdata.field+'_'+index" v-show="formdata.isShowLabel"  :prop="formdata.field+'_'+index"  >
                    <el-checkbox-group 
                        :ref="'bwminform_'+formdata.field"
                        v-model="values[formdata.field]" 
                        :name="formdata.field+'_'+index"
                        v-validate="validaterules"
                        :class="{'input': true, 'is-danger':  errorBags.first(formdata.field+'_'+index) }"
                        >
                        <el-checkbox  v-for="item in formdata.formaterItems"
                            @change="fieldChange"
                            :key="item.value"
                            :disabled="formdata.disabled===true"
                            :label="item.value"
                            :value="item.value"> {{item.label}}</el-checkbox>
                    </el-checkbox-group>
                    <span class="form-item-error">{{ errorBags.first(formdata.field+'_'+index) }}</span>
                </el-form-item>
            </template>
            <template v-if="formdata.mutil && formdata.formater=='select'">
                <el-form-item :ref="'bwminformitem_'+formdata.field+'_'+index" v-show="formdata.isShowLabel" :prop="formdata.field+'_'+index"  >
                    <el-select 
                    @change="fieldChange"
                    :ref="'bwminform_'+formdata.field"
                    v-model="values[formdata.field]" 
                    :name="formdata.field+'_'+index"
                    :disabled="formdata.disabled===true"
                    multiple
                    v-validate="validaterules"
                    :class="{'input': true, 'is-danger':  errorBags.first(formdata.field+'_'+index) }"
                    placeholder="">
                        <el-option v-if="!formdata.required" :label="$t('请选择')" value=""></el-option>
                        <el-option v-for="item in formdata.formaterItems"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <span class="form-item-error">{{ errorBags.first(formdata.field+'_'+index) }}</span>
                </el-form-item>
            </template>
        </template>
    </div>
</template>
<script>
import utils from '../../utils/index';
import _ from 'lodash';
export default {
    name:'MinFormCell',
    inject:['formConfigs'],
    components: {
    },
    props:{
        index:{
            type:Number
        },
        values:{
            default:function(){
                return {};
            }
        },
        className:{
            type:String,
            default:function(){
                return '';
            }
        },
        formdata:{
            type:Object,
            default:{
                ___id:utils.NewGuid(),
                id:'',
                title:'layout-title',
                span:6,//页面显示时占宽度的分数，一共24分；
                isShowTitle:false,
                isShowLabel:true,
                type:'layout',//layout,tab,table,rows,cell
                datatype:'string',
                formater:'',//如果是表单元素则会按照这个类型渲染 ,input,select,单选，多选
                formaterItems:[],//如果是单选，多选的时候的数据来源
                required:false,
                label:'',//显示的名字
                field:'',//字段名
                validate:{ //需要的验证信息 min,max,length
                    
                },
                relationship:{ //关联的字段的配置信息
                    targets:[{
                        field:'',
                        change:function(){}
                    }]
                },
                childrens:[{
                   
                }]
            }
        }
    },
    methods:{
        resetForm(){ 
            var $dom = this.$refs['bwminformitem_'+this.formdata.field];
            if($dom){
                $dom.resetField();
            }

        },
        validateForm() {
            // this.$validator.validateAll().then(res=>{
            //     console.log(res)
            // });
            return this.$validator.validateAll();
        },
        resetValidate(){
            
            this.mountedChange();
            return this.$validator.reset();
        },
        getAttributeInfo(list,field){
            var res = null
            list.forEach(item=>{
                if(item.field==field){
                    res = item;
                    return false;
                }
                if(item.childrens && item.childrens.length>0){
                    res = this.getAttributeInfo(item.childrens,field);
                    if(res){
                        return false;
                    }
                }
            });
            return res;
        },
        getTargetVm(field){
            const vm = this.formConfigs.$validaters.filter(item=>{
                return item.field ==field;
            });
            if(vm && vm.length>0){
                return vm[0];
            }
        },
        mountedChange(value){
            if(this.formdata.relationship && this.formdata.relationship.targets&& this.formdata.relationship.targets.length>0){
                let targets = this.formdata.relationship.targets;
                targets.forEach(item=>{
                    const field = item.field;
                    const handler = item.change;
                    const _super = item._super;
                    let targetInfo = this.getAttributeInfo(this.formConfigs.datas,field);
                    let targetVm = this.getTargetVm(field);
                   // console.log('targetInfo',targetInfo);
                    if(field && targetVm){
                        if( _.isFunction(handler)){
                            handler.call(this,
                                targetVm.$vm,
                                value,
                                this.formConfigs.formData[field],
                                this,
                                _super
                            );
                        }else if(typeof handler==='string'){
                            let funHandler = new Function(['target','value','targetValue','$vm','_super'],handler);
                            try{
                                funHandler.call(this,
                                    targetVm.$vm,
                                    value,
                                    this.formConfigs.formData[field],
                                    this,
                                    _super
                                );
                            }catch(e){
                                console.log(e);
                            }
                        }
                        targetVm.$vm.$forceUpdate();
                    }
                })
            }
        },
        fieldChange(value){
            if(this.formdata.relationship && this.formdata.relationship.targets&& this.formdata.relationship.targets.length>0){
                let targets = this.formdata.relationship.targets;
                targets.forEach(item=>{
                    const field = item.field;
                    const handler = item.change;
                    const _super = item._super;
                    let targetInfo = this.getAttributeInfo(this.formConfigs.datas,field);
                    let targetVm = this.getTargetVm(field);
                 if(field && targetVm){
                        if( _.isFunction(handler)){
                            handler.call(this,
                                targetVm.$vm,
                                value,
                                this.formConfigs.formData[field],
                                this,
                                _super
                            );
                        }else if(typeof handler==='string'){
                            let funHandler = new Function(['target','value','targetValue','$vm','_super'],handler);
                            try{
                                funHandler.call(this,
                                    targetVm.$vm,
                                    value,
                                    this.formConfigs.formData[field],
                                    this,
                                    _super
                                );
                            }catch(e){
                                console.log(e);
                            }
                        }
                        targetVm.$vm.$forceUpdate();
                    }
                })
            }
        },
        setValue(value){
            this.values[this.formdata.field] = value;
        },
        setFormdata(key,value){
            this.formdata[key] = value;
        }
    },
    beforeCreate(){
        
    },
    created(){
       // this.formdata.field = 'subgrid_'+this.formdata.field
      //  console.log('__super',this.formConfigs.__super);                   
        if(!this.values){
            this.values={};
        }
        if(this.formdata.mutil && (this.formdata.formater=='checkbox' ||this.formdata.formater=='select') ){
            this.values[this.formdata.field] = [];
        }else{
            this.values[this.formdata.field] = '';
        }
        if(this.formdata.datatype=='boolean' && !this.values[this.formdata.field]){
            this.values[this.formdata.field] = false;
        }
        let tempRules = [];
        this.formdata.required && tempRules.push('required');
        if(this.formdata.rules && this.formdata.rules.length>0){
            tempRules = tempRules.concat(this.formdata.rules);
        }
        this.validaterules = tempRules.join('|');
       // console.log(this.validaterules);
    },
    mounted(){
       // console.log('formcell',this.formConfigs);
        //this.values[this.formdata.field];
        var $dom = this.$refs['bwminform_'+this.formdata.field];
        if($dom){
            this.formConfigs.$validaters.push({
                field:this.formdata.field,
                $vm:this,$el:$dom,
                validateHandler:this.validateForm,
                resetValidate:this.resetValidate,
                mountedChange:this.mountedChange,
                resetForm:this.resetForm
            });
        }
        
    },
    data(){
        return {
            validaterules:''
        }
    }
}
</script>
<style scoped>

</style>