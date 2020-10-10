<template>
    <div class="mutilselecter-box" :style="'width:'+(width)">
        <el-row :gutter="10">
            <el-col :span="10">
                <div class="mutilselecter-selecter-search">
                    <el-input
                     v-model="keyword" 
                    @input="searchByKeyword" 
                    size="mini" 
                    placeholder=""
                    >
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="10">
                <div class="mutilselecter-selecter mutilselecter-item-box">
                    <div v-if="closeable" class="mutilselecter-item-tools"><span class="el-icon-circle-close" @click="clearDatasActived"></span></div>
                    <ul :style="'height:'+(height)">
                        <template  v-for="(item,index) in datalist">
                            <li :key="index" @dblclick="function(e){quickAddItem(item,index);}" @click="function(e){activeItem(item,index);}"  v-if="(selecteds.filter(jitem=>{return jitem.value==item.value}).length==0) && item.isShow" :class="item.active?'active':''">
                                {{item.label}}
                            </li>
                        </template>
                    </ul>
                </div>
            </el-col>
            <el-col :span="4">
                <div class=" " :style="'margin-top:'+(ctrlMarginTop)">
                    <div class="mutilselecter-ctrler text-center">
                        <div><el-button type="default" size="mini" @click="addToSelected"><span class="el-icon-arrow-right"></span></el-button></div>
                        <div><el-button type="default" size="mini" @click="backToDatas"><span class="el-icon-arrow-left"></span></el-button></div>
                        <div><el-button type="default" size="mini" @click="addToSelectedALL"><span class="el-icon-d-arrow-right"></span></el-button></div>
                        <div><el-button type="default" size="mini" @click="backToDatasALL"><span class="el-icon-d-arrow-left"></span></el-button></div>
                    </div>
                </div>
            </el-col>
            <el-col :span="10">
                <div class="mutilselecter-result mutilselecter-item-box">
                    <div v-if="closeable" class="mutilselecter-item-tools"><span class="el-icon-circle-close" @click="clearSelectedActived"></span></div>
                    <ul :style="'height:'+(height)">
                        <li v-for="(item,index) in selecteds" @click="function(e){activeSelectedItem(item,index);}" :key="index"  :class="item.selectedActive?'active':''">
                            {{item.label}}
                        </li>
                    </ul>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    name:'bwMutilSelecter',
    data(){
        return{
           // datalist:[],
           keyword:'',
           // results:[]
        }
    },
    model: {
        prop: 'selecteds',
        event: 'change'
    },
    props:{
        closeable:{
            type:Boolean,
            default:false
        },
        datas:{
            type:Array,
            default(){
                return []
            }
        },
        selecteds:{
            type:Array,
            default(){
                return []
            }
        },
        height:{
            type:String,
            default:'300px'
        },
        width:{
            type:String,
            default:'700px'
        },
    },
    beforeDestroy(){
        this.$emit('change',[]);
        
    },
    created(){
        console.log('mutil init',this);
    },
    computed:{
        datalist(){
            this.datas.forEach(item=>{
                if(item.isShow===undefined){
                    item.isShow = true;
                }
            })
            return this.datas;
        },
        ctrlMarginTop(){
            let res = 100;
            if(this.height && this.height.indexOf('px')!=-1){
                res = this.height.replace('px','')*1;
                res = (res/2)>>0;
            }
            return res+'px';
        }
        // results(){
        //     return this.selecteds;
        // }
    },
    methods:{
        clearDatasActived(){
            this.datas.forEach(item=>{
                item.active = false;
            })
            this.$forceUpdate();
        },
        clearSelectedActived(){
            let actives = [];
            this.selecteds.forEach(item=>{//只保留没有激活的  
                actives.push(item);
            });
            actives.forEach(item=>{
                item.selectedActive = false;
            });
            this.$emit('change',actives);
        },
        searchByKeyword(value){
            this.datas.forEach(item=>{
                if(new RegExp(value,'img').test(item.label)==false){
                    item.isShow = false;
                    item.active = false;
                }else{
                    item.isShow = true;
                }
            })
        },
        update(){
            this.$forceUpdate();
        },
        activeItem(itemData){
            if(itemData){
                if(itemData.active == true){
                     itemData.active = false;
                }else{
                    itemData.active = true;
                }
                this.$forceUpdate()
            }
        },
        activeSelectedItem(itemData){
            if(itemData){
                if(itemData.selectedActive == true){
                     itemData.selectedActive = false;
                }else{
                    itemData.selectedActive = true;
                }
               
                this.$forceUpdate()
            }
        },
        backToDatas(){
            let actives = [];
            this.selecteds.forEach(item=>{//只保留没有激活的  
                if(!item.selectedActive){
                    actives.push(item);
                   
                }
            });
            actives.forEach(item=>{
                item.selectedActive = false;
                item.active = false;
            });
            this.$emit('change',actives);
        },
        backToDatasALL(){
            let actives = [];
            
            this.$emit('change',actives);
        },
        quickAddItem(itemData){
            let actives = [];
            itemData.active = false;
            this.selecteds.push(itemData);
            this.$emit('change',this.selecteds);
        },
        addToSelectedALL(){
            let actives = [];
            this.datalist.forEach(item=>{
                actives.push(item);
                this.selecteds.push(item);
            });
            actives.forEach(item=>{
                item.active = false;
                item.selectedActive = false;
            });
            
            this.$emit('change',this.selecteds);
        },
        addToSelected(){
            // this.$emit('change',()=>{
                
            //     this.selecteds.push(itemData);
            // });
            let actives = [];
            this.datalist.forEach(item=>{
                if( item.active==true){
                    actives.push(item);
                    item.selectedActive = false;
                    this.selecteds.push(item);
                }
            });
            actives.forEach(item=>{
                item.active = false;
            });
            
            this.$emit('change',this.selecteds);
            //this.selecteds = actives;
        }
    }
}
</script>
<style scoped>
.mutilselecter-box{
    font-size: 12px;
}
.mutilselecter-selecter ul,.mutilselecter-result ul{
    overflow-y: auto;
    
}
.mutilselecter-selecter li,.mutilselecter-result li{
    height:22px;
    line-height: 22px;
    overflow-x:hidden ;
    text-overflow: ellipsis;
    white-space: nowrap;
    color:#333;
    font-size: 12px;
    padding: 0px 8px;
    cursor: pointer;
}
.mutilselecter-selecter li:nth-child(2n),
.mutilselecter-result li:nth-child(2n){
    background: #f9f9f9;
}
.mutilselecter-selecter li.active,.mutilselecter-result li.active{
    background: #ddd;

}
.mutilselecter-item-box{
    border:1px solid #eee;
    position: relative;
}
.mutilselecter-ctrler{
    transform: translateY(-50%);
}
.mutilselecter-selecter-search{
    margin-bottom: 8px;
}
.mutilselecter-item-tools{
    position:absolute;
    right:20px;
    top:10px;
    display: none;
    height: 10px;
    width: 10px;
    z-index: 11;
    color:#999;
    cursor: pointer;
}
.mutilselecter-item-box:hover .mutilselecter-item-tools{
    display: block;
}
</style>