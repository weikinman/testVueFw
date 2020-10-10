<template>
    <div v-show="formdata.isShow!==false" :class="['bw-form-table',className]">
         <h3 class="bw-form-table-title"  @click="showContent=!showContent" v-show="formdata.isShowTitle">{{(formdata.i18nLabel?$t(formdata.title):formdata.title)}}</h3>
        <transition name="el-fade-in-linear">
        <el-row v-show="showContent" :gutter="formdata.padding||0" >
            <el-col  v-for="item in formdata.childrens" :key="item.id" :span="item.span || 24">
                <FormRows :formdata="item">
                    <template v-for="(_, slot) in $slots">
                        <template :slot="slot">
                        <slot :name="slot"></slot>
                        </template>
                    </template>
                </FormRows>
            </el-col>
        </el-row>
        </transition>
    </div>
</template>
<script>
import utils from '../../utils/index';
import FormRows from './FormRows';
export default {
    inject:['formConfigs'],
    name:'FormTable',
    components: {
        FormRows
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
       // console.log('formtable',this.formConfigs);
    },
    data(){
        return {
            showContent:true    
        }
    }
}
</script>
<style scoped>
 .bw-form-table-title{font-size: .2rem; padding: .1rem 0; cursor: pointer;}
</style>