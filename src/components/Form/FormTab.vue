<template>
    <div v-show="formdata.isShow!==false" :class="['bw-form-tab',className]">
         <h3 class="bw-form-tab-title" v-show="formdata.isShowTitle">{{(formdata.i18nLabel?$t(formdata.title):formdata.title)}}</h3>
        <el-row :gutter="formdata.padding||0" >
            <el-col v-for="item in formdata.childrens" :key="item.id" :span="item.span || 24">
                <FormTable :formdata="item">
                    <template v-for="(_, slot) in $slots">
                        <template :slot="slot">
                        <slot :name="slot"></slot>
                        </template>
                    </template>
                </FormTable>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import utils from '../../utils/index';
import FormTable from './FormTable';
export default {
    inject:['formConfigs'],
    name:'FormTab',
    components: {
        FormTable
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
                datatype:'',
                formater:'',//如果是表单元素则会按照这个类型渲染 ,input,select,单选，多选
                formaterItems:[],//如果是单选，多选的时候的数据来源
                required:false,
                label:'',//显示的名字
                field:'',//字段名
                validate:{ //需要的验证信息 min,max,length
                    
                },
                relationship:{ //关联的字段的配置信息
                    targets:[{
                        attributename:'',
                        change:function(){}
                    }]
                },
                childrens:[{
                   
                }]
            }
        }
    },
    created(){
      //  console.log('formtab',this.formConfigs);
    },
    data(){
        return {

        }
    }
}
</script>
<style scoped>
 .bw-form-tab-title{font-size: .2rem;padding: .1rem 0;}
</style>