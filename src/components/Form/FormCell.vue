<template>
    <div  v-show="formdata.isShow!==false" :class="['bw-form-cell',className]">
         <template class="bw-form-cell-title" v-if="formdata.type=='customerCell'">
            <slot :name="formdata.customerName" v-bind="{formdata,formConfigs}"></slot>
        </template>
        <template class="bw-form-cell-title" v-if="formdata.type=='subgrid'">
            <MinDataGrid :gridDatas="formConfigs.formData[formdata.field]" :formdata="formdata"></MinDataGrid>
        </template>
        <template class="bw-form-cell-title" v-if="formdata.datatype=='boolean' && formdata.formater=='checkbox'">
            <template v-if="formdata.editable==false">
                <el-form-item :label-width="formdata.labelWidth || formConfigs.labelWidth || '100px'" :class="formdata.required?'is-required':''" v-show="formdata.isShowLabel" :prop="formdata.field" :label="transfromLabel()+':'">
                    <span>{{formConfigs.formData[formdata.field]==true?$t('是'):$t('否')}}</span>
                </el-form-item>
            </template>
            <template v-else>
                <el-form-item :label-width="formdata.labelWidth || formConfigs.labelWidth || '100px'" :class="[formdata.required?'is-required':'','bw-form-checkbox']" v-show="formdata.isShowLabel" :prop="formdata.field" :label="transfromLabel()">
                    <el-checkbox  
                    @change="fieldChange"
                        :ref="'bwform_'+formdata.field"
                        v-model="formConfigs.formData[formdata.field]" 
                        placeholder=""
                        :name="formdata.field"
                        v-validate="validaterules"
                        :disabled="formdata.disabled===true"
                        :class="{'input': true, 'is-danger':  errorBags.first(formdata.field) }"></el-checkbox>
                    <span class="form-item-error">{{ errorBags.first(formdata.field) }}</span>
                </el-form-item>
            </template>
            
        </template>
        <template class="bw-form-cell-title" v-if="formdata.datatype=='boolean' && (!formdata.formater||formdata.formater=='switch')">
            <template v-if="formdata.editable==false">
                <el-form-item  :label-width="formdata.labelWidth || formConfigs.labelWidth || '100px'" :class="formdata.required?'is-required':''" v-show="formdata.isShowLabel" :prop="formdata.field" :label="transfromLabel()+':'">
                    <span>{{formConfigs.formData[formdata.field]==true?$t('是'):$t('否')}}</span>
                </el-form-item>
            </template>
            <template v-else>
                <el-form-item  :label-width="formdata.labelWidth || formConfigs.labelWidth || '100px'" :class="formdata.required?'is-required':''" v-show="formdata.isShowLabel" :prop="formdata.field" :label="transfromLabel()">
                    <el-switch
                        @change="fieldChange"
                        :ref="'bwform_'+formdata.field"
                        v-model="formConfigs.formData[formdata.field]" 
                        placeholder=""
                        :name="formdata.field"
                        v-validate="validaterules"
                        :disabled="formdata.disabled===true"
                        :class="{'input': true, 'is-danger':  errorBags.first(formdata.field) }"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                    <span class="form-item-error">{{ errorBags.first(formdata.field) }}</span>
                </el-form-item>
            </template>
        </template>
        <template v-if="formdata.datatype=='string'">
            <template v-if="formdata.editable==false">
                <el-form-item  :label-width="formdata.labelWidth || formConfigs.labelWidth || '100px'" :class="formdata.required?'is-required':''" v-show="formdata.isShowLabel" :prop="formdata.field" :label="transfromLabel()+':'">
                    <span v-if="formdata.formater=='textarea'" style="word-break: break-all;" v-html="formConfigs.formData['x_comments']?formConfigs.formData['x_comments'].replace(/\n|\t|\r/g,'<br>'):''"></span>
                    <span v-else >{{formConfigs.formData[formdata.field]}}</span>
                </el-form-item>
            </template>
            <template v-else>
                <template v-if="formdata.formater && formdata.formater=='password'">
                    <el-form-item  :label-width="formdata.labelWidth || formConfigs.labelWidth || '100px'" :class="formdata.required?'is-required':''" v-show="formdata.isShowLabel" :prop="formdata.field" :label="transfromLabel()">
                        <el-input 
                        @input="fieldChange"
                        :ref="'bwform_'+formdata.field"
                        v-model="formConfigs.formData[formdata.field]"
                        :type="'password'" 
                        placeholder=""
                        :rows="3"
                        :clearable="formdata.clearable||false"
                        :maxlength="formdata.maxLength||''"
                        :show-word-limit="formdata.showWordLimit||false"
                        :disabled="formdata.disabled===true"
                        :name="formdata.field"
                        v-validate="validaterules"
                        :class="{'input': true, 'is-danger':  errorBags.first(formdata.field) }"
                        ></el-input>
                        <span class="form-item-error">{{ errorBags.first(formdata.field) }}</span>
                    </el-form-item>
                </template>
                <template v-else>
                    <el-form-item  :label-width="formdata.labelWidth || formConfigs.labelWidth || '100px'" :class="formdata.required?'is-required':''" v-show="formdata.isShowLabel" :prop="formdata.field" :label="transfromLabel()">
                        <el-input 
                        @input="fieldChange"
                        :ref="'bwform_'+formdata.field"
                        v-model="formConfigs.formData[formdata.field]"
                        :type="formdata.formater=='textarea'?'textarea':'text'" 
                        placeholder=""
                        :rows="3"
                        :clearable="formdata.clearable||false"
                        :maxlength="formdata.maxLength||''"
                        :show-word-limit="formdata.showWordLimit||false"
                        :disabled="formdata.disabled===true"
                        :name="formdata.field"
                        v-validate="validaterules"
                        :class="{'input': true, 'is-danger':  errorBags.first(formdata.field) }"
                        ></el-input>
                        <span class="form-item-error">{{ errorBags.first(formdata.field) }}</span>
                    </el-form-item>
                </template>
            </template>
        </template>
        <template v-if="formdata.datatype=='number'">
            <template v-if="formdata.editable==false">
                <el-form-item  :label-width="formdata.labelWidth || formConfigs.labelWidth || '100px'" :class="formdata.required?'is-required':''" v-show="formdata.isShowLabel" :prop="formdata.field" :label="transfromLabel()+':'">
                    <span>{{formConfigs.formData[formdata.field]}}</span>
                </el-form-item>
            </template>
            <template v-else>
                <el-form-item  :label-width="formdata.labelWidth || formConfigs.labelWidth || '100px'" :class="formdata.required?'is-required':''" v-show="formdata.isShowLabel" :prop="formdata.field" :label="transfromLabel()">
                    <el-input 
                    @input="fieldChange"
                    :ref="'bwform_'+formdata.field"
                    v-model="formConfigs.formData[formdata.field]"
                    :type="'number'" 
                    placeholder=""
                    :rows="3"
                    :clearable="formdata.clearable||false"
                    :maxlength="formdata.maxLength||''"
                    :show-word-limit="formdata.showWordLimit||false"
                    :disabled="formdata.disabled===true"
                    :name="formdata.field"
                    v-validate="validaterules"
                    :class="{'input': true, 'is-danger':  errorBags.first(formdata.field) }"
                    ></el-input>
                    <span class="form-item-error">{{ errorBags.first(formdata.field) }}</span>
                </el-form-item>
            </template>
        </template>
        <template v-if="formdata.datatype=='date'">
            <template v-if="formdata.editable==false">
                <el-form-item  :label-width="formdata.labelWidth || formConfigs.labelWidth || '100px'" :class="formdata.required?'is-required':''" v-show="formdata.isShowLabel" :prop="formdata.field" :label="transfromLabel()+':'">
                    <span>{{formConfigs.formData[formdata.field]?new Date(formConfigs.formData[formdata.field]).format(formdata.viewformat||formdata.dataformat||'yyyy-MM-dd'):''}}</span>
                </el-form-item>
            </template>
            <template v-else>
                <template v-if="formdata.dataformat&& formdata.dataformat.indexOf('hh')==-1">
                    <el-form-item  :label-width="formdata.labelWidth || formConfigs.labelWidth || '100px'" :class="formdata.required?'is-required':''" v-show="formdata.isShowLabel" :prop="formdata.field" :label="transfromLabel()">
                        <el-date-picker
                            @change="fieldChange"
                            :ref="'bwform_'+formdata.field"
                            v-model="formConfigs.formData[formdata.field]" 
                            placeholder=""
                            :name="formdata.field"
                            :disabled="formdata.disabled===true"
                            v-validate="validaterules"
                            :clearable="formdata.clearable||false"
                            :value-format="formdata.dataformat||'yyyy-MM-dd'"
                            :format="formdata.viewformat||formdata.dataformat||'yyyy-MM-dd'"
                            :class="{'input': true, 'is-danger':  errorBags.first(formdata.field) }"
                            type="date">
                            </el-date-picker>
                        <span class="form-item-error">{{ errorBags.first(formdata.field) }}</span>
                    </el-form-item>
                </template>
                <template v-if="!formdata.dataformat || ( formdata.dataformat&& formdata.dataformat.indexOf('hh')!=-1)">
                    <el-form-item  :label-width="formdata.labelWidth || formConfigs.labelWidth || '100px'" :class="formdata.required?'is-required':''" v-show="formdata.isShowLabel" :prop="formdata.field" :label="transfromLabel()">
                        <el-date-picker
                            @change="fieldChange"
                            :ref="'bwform_'+formdata.field"
                            v-model="formConfigs.formData[formdata.field]" 
                            placeholder=""
                            :name="formdata.field"
                            :disabled="formdata.disabled===true"
                            v-validate="validaterules"
                            :clearable="formdata.clearable||false"
                            :value-format="formdata.dataformat||'yyyy-MM-dd hh:mm:ss'"
                            :format="formdata.viewformat||formdata.dataformat||'yyyy-MM-dd'"
                            :class="{'input': true, 'is-danger':  errorBags.first(formdata.field) }"
                            type="datetime">
                            </el-date-picker>
                        <span class="form-item-error">{{ errorBags.first(formdata.field) }}</span>
                    </el-form-item>
                </template>
            </template>
        </template>
        <template v-if="formdata.datatype=='picklist'">
            <template v-if="formdata.editable==false">
                <el-form-item  :label-width="formdata.labelWidth || formConfigs.labelWidth || '100px'" :class="formdata.required?'is-required':''" v-show="formdata.isShowLabel" :prop="formdata.field" :label="transfromLabel()+':'">
                    <span>{{getPickListValue(formConfigs.formData[formdata.field])}}</span>
                </el-form-item>
            </template>
            <template v-else>
                <template v-if="formdata.remote==true &&formdata.formater=='select'">
                    <el-form-item :label-width="formdata.labelWidth || formConfigs.labelWidth || '100px'" :class="formdata.required?'is-required':''" v-show="formdata.isShowLabel" :prop="formdata.field" :label="transfromLabel()">
                        <el-select 
                        filterable
                        remote
                        reserve-keyword
                        :remote-method="remoteMethod"
                        :loading="loading"
                        :clearable="formdata.clearable||false"
                        @change="fieldChange"
                        :ref="'bwform_'+formdata.field"
                        v-model="formConfigs.formData[formdata.field]" 
                        :name="formdata.field"
                        :popper-append-to-body="false"
                        :disabled="formdata.disabled===true"
                        v-validate="validaterules"
                        :class="{'input': true, 'is-danger':  errorBags.first(formdata.field) }"
                        placeholder="">
                            <el-option v-for="item in formdata.formaterItems"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <span class="form-item-error">{{ errorBags.first(formdata.field) }}</span>
                    </el-form-item>
                </template>
                <template v-if="!formdata.remote &&!formdata.mutil &&formdata.formater=='select'">
                    <el-form-item :label-width="formdata.labelWidth || formConfigs.labelWidth || '100px'" :class="formdata.required?'is-required':''" v-show="formdata.isShowLabel" :prop="formdata.field" :label="transfromLabel()">
                        <el-select 
                        filterable
                        @change="fieldChange"
                        :ref="'bwform_'+formdata.field"
                        v-model="formConfigs.formData[formdata.field]"  
                        :name="formdata.field"
                        :clearable="formdata.clearable||false"
                        :popper-append-to-body="false"
                        :disabled="formdata.disabled===true"
                        v-validate="validaterules"
                        :class="{'input': true, 'is-danger':  errorBags.first(formdata.field) }"
                        placeholder="">
                            <el-option v-for="item in formdata.formaterItems"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <span class="form-item-error">{{ errorBags.first(formdata.field) }}</span>
                    </el-form-item>
                </template>
                <template v-if="formdata.formater=='radio'">
                    <el-form-item :label-width="formdata.labelWidth || formConfigs.labelWidth || '100px'" :class="formdata.required?'is-required':''" v-show="formdata.isShowLabel" :prop="formdata.field" :label="transfromLabel()">
                        <el-radio-group 
                            :ref="'bwform_'+formdata.field"
                            v-model="formConfigs.formData[formdata.field]" 
                            :name="formdata.field"
                            v-validate="validaterules"
                            :class="{'input': true, 'is-danger':  errorBags.first(formdata.field) }"
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
                    
                        <span class="form-item-error">{{ errorBags.first(formdata.field) }}</span>
                    </el-form-item>
                </template>
                <template v-if="formdata.mutil && formdata.formater=='checkbox'">
                    <el-form-item :label-width="formdata.labelWidth || formConfigs.labelWidth || '100px'" :class="[formdata.required?'is-required':'','bw-form-checkbox']" v-show="formdata.isShowLabel"  :prop="formdata.field" :label="transfromLabel()">
                        <el-checkbox-group 
                            :ref="'bwform_'+formdata.field"
                            v-model="formConfigs.formData[formdata.field]" 
                            :name="formdata.field"
                            v-validate="validaterules"
                            :class="{'input': true, 'is-danger':  errorBags.first(formdata.field) }"
                            >
                            <el-checkbox  v-for="item in formdata.formaterItems"
                                @change="fieldChange"
                                :key="item.value"
                                :disabled="formdata.disabled===true"
                                :label="item.value"
                                :value="item.value"> {{item.label}}</el-checkbox>
                        </el-checkbox-group>
                        <span class="form-item-error">{{ errorBags.first(formdata.field) }}</span>
                    </el-form-item>
                </template>
                <template v-if="formdata.mutil && formdata.formater=='select'">
                    <el-form-item :label-width="formdata.labelWidth || formConfigs.labelWidth || '100px'" :class="formdata.required?'is-required':''" v-show="formdata.isShowLabel" :prop="formdata.field" :label="transfromLabel()">
                        <el-select 
                        filterable
                        @change="fieldChange"
                        :ref="'bwform_'+formdata.field"
                        v-model="formConfigs.formData[formdata.field]" 
                        :name="formdata.field"
                        multiple
                        :clearable="formdata.clearable||false"
                        :popper-append-to-body="false"
                        :disabled="formdata.disabled===true"
                        v-validate="validaterules"
                        :class="{'input': true, 'is-danger':  errorBags.first(formdata.field) }"
                        placeholder="">
                            <el-option v-for="item in formdata.formaterItems"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <span class="form-item-error">{{ errorBags.first(formdata.field) }}</span>
                    </el-form-item>
                </template>
            </template>
        </template>
    </div>
</template>
<script>
import Vue from 'vue';
import utils from '../../utils/index';
import MinDataGrid from './MinDataGrid';
import _ from 'lodash';
export default {
    inject:['formConfigs'],
    name:'FormCell',
    data(){
        return {
            that:this,
            loading:false,
           // validaterules:''
        }
    },
    components: {
        MinDataGrid
    },
    props:{
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
                }
            }
        }
    },
    methods:{
        transfromLabel(){
            if(this.formConfigs.translater){
                return this.formConfigs.translater.call(this,this.formdata);
            }
            if(this.formdata.i18nLabel && this.$t){
                return this.$t(this.formdata.label);
            }
            return this.formdata.label;
        },
        remoteMethod(e,a,b){
            if(this.formdata.remoteUrl){
                this.loading=true;
                this.$fetch(this.formdata.remoteUrl,{
                    params:{
                        keyword:e
                    }
                }).then(res=>{
                    this.loading=false;
                    console.log(res);
                    let options = res.data.items;
                    if(this.formdata.filterData){
                        options = this.formdata.filterData(res);
                    }
                    this.formdata.formaterItems = options;
                    this.$forceUpdate();
                })
            }
            console.log(e,a,b);
        },
        validateForm() {
            // this.$validator.validateAll().then(res=>{
            //     console.log(res)
            // });
            // this.$validator.validateAll().then(result=>{
            //     console.log('formCell'+this.formdata.field,result);
            // })
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
                    if(!targetVm){
                        targetVm = this;
                    }
                   // console.log('targetInfo',targetInfo);
                    if( targetVm){
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
                        targetVm &&targetVm.$vm && targetVm.$vm.$forceUpdate();
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
                    if(!targetVm){
                        targetVm = this;
                    }
                   // console.log('targetInfo',targetInfo);
                    if( targetVm){
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
                        
                        targetVm &&targetVm.$vm && targetVm.$vm.$forceUpdate();
                    }
                })
            }
        },
        setValue(value){
            this.formConfigs.formData[this.formdata.field] = value;
        },
        setFormdata(key,value){
            this.formdata[key] = value;
        },
        getPickListValue(field,Vm){
            const value = this.formConfigs.formData[this.formdata.field];
            console.log('getPickListValue',value);
            if(value){
                if(this.formdata.formaterItems && this.formdata.formaterItems.length>0){
                    let res = this.formdata.formaterItems.filter(item=>{
                        return item.value==value;
                    })
                    if(res && res.length>0){
                        return res[0].label;
                    }
                }
                return value;
            }else{
                return '';
            }
        },
    },
    filters:{
        
    },
    created(){
      //  console.log('__super',this.formConfigs.__super);
        if(this.formdata.mutil && (this.formdata.formater=='checkbox' ||this.formdata.formater=='select') ){
            this.$set(this.formConfigs.formData,this.formdata.field,[]);
            //this.formConfigs.formData[this.formdata.field] = [];
        }else if(this.formdata.type=='subgrid' && !this.formConfigs.formData[this.formdata.field]){
            this.$set(this.formConfigs.formData,this.formdata.field,{values:[]});
            //this.formConfigs.formData[this.formdata.field] = {values:[]};
        }else if(this.formdata.datatype=='boolean'){
            this.$set(this.formConfigs.formData,this.formdata.field,false);
           // this.formConfigs.formData[this.formdata.field]= false;
        }else{
             this.$set(this.formConfigs.formData,this.formdata.field,'');
           // this.formConfigs.formData[this.formdata.field] = '';
        }
        
        if(this.formConfigs.$fields){
            this.formConfigs.$formCells.push(this);
        }
         this.formConfigs.__super.$on('file.formCellUpdate',()=>{
            this.$forceUpdate();
        })
       // console.log(this.validaterules);
    },
    computed:{
        validaterules(){
            let tempRules = [];
            this.formdata.required && tempRules.push('required');
            if(this.formdata.rules && this.formdata.rules.length>0){
                tempRules = tempRules.concat(this.formdata.rules);
            }
            return tempRules.join('|');
        }
    },
    mounted(){
       // console.log('formcell',this.formConfigs);
        //this.formConfigs.formData[this.formdata.field];
        var $dom = this.$refs['bwform_'+this.formdata.field];
        if($dom){
            this.formConfigs.$validaters.push({field:this.formdata.field,$vm:this,$el:$dom,validateHandler:this.validateForm,resetValidate:this.resetValidate,mountedChange:this.mountedChange});
        }
        
    }
}
</script>
<style scoped>

</style>