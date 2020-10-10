<template>
    <div :class="[selectClass,'filter-box','group-selecter']" :style="selectStyle" >
        <div class="filter-icon pull-left"> <span :class="icon"></span></div>
        <el-select v-model="firstData" size="mini"  :placeholder="$t('formPlaceHolder.pleaseSelect')">
            <el-option
            v-for="(item,index) in groups"
            :key="index+'group'"
            :label="item.title"
            :value="item.id">
            </el-option>
        </el-select>
        <template>
            <el-select size="mini" v-model="selectDatas" :placeholder="$t('formPlaceHolder.pleaseSelect')">
                <el-option
                v-for="(item,index) in groupitems"
                :key="index+'camera'"
                :label="item.title"
                :value="item.id">
                </el-option>
            </el-select>
        </template>
        <slot></slot>
    </div>
</template>
<script>
/**
 * 
 */
import WaringInfo from '@/components/WaringInfo/Index';
import {bwSocket} from '@/config/websocket';
import Vue from 'vue';
import _ from 'lodash';
import {imageMixin} from '@/mixins/image';
import api from "@/config/api.config.js";
import WaringReview from '@/components/WaringInfo/WaringReviewMsg';

export default {
    components: {
      WaringInfo  ,
      WaringReview
    },
    model: {
        prop: 'selectDatas',
        event: 'change'
    },
    mixins: [imageMixin],
    name:'GroupsSelecter',
    props:{
        selectClass:{
            default(){
                return '';
            }
        },
        selectStyle:{
            default(){
                return '';
            }
        },
        groupDatas:{
            type:Array
        },
        groupInfos:{
            default:function(){
                return {
                    firstLabel:'',
                    lastLabel:''
                }
            }
        },
        icon:{
            default:function () {
                return '';
            }
        }
    },
    data () {
        return {
            firstData:'',
            lastData:'',
            selectDatas:'',
            groups:[],
            groupitems:[]
        }
    },
    created () {

    },
    methods: {
        changeGroupDatas(datas){
            this.groups = _.cloneDeep(datas);
            console.log(this.groups);
        }
    },
    watch: {
        selectDatas(newValue){
            this.$emit('change',newValue);
            return newValue;
        },
        groupDatas(newValue){
            this.changeGroupDatas(newValue);
            return newValue;
        },
        firstData(newValue,oldValue){
            let first = this.groups.filter(item=>{
                return item.id == newValue;
            });
            this.groupitems = [];
            if(first.length>0){
                var oldlist = [];//防止重複記錄
                first[0].nebulas && first[0].nebulas.forEach(item=>{
                    if(item && item.cameras){
                        item.cameras.forEach(camera=>{
                            if(oldlist.indexOf(camera.id)==-1) {
                                this.groupitems.push(camera);
                                oldlist.push(camera.id);
                            }
                        });
                    }
                })
            }
            console.log(this.groupitems)
            return newValue
        }
    }
}
</script>
<style>
   .list-box{border-radius: 0;}
</style>