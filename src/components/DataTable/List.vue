<template>
    <div>
        
    </div>
</template>
<script>
/**
 * columnConfig
 * columnConfig.columnModels = [{name:'attrname',label:'displayLabel',type:'string',format:{N:2},displayorder:0,relation:[]}]
 */
import theaderMix from '../../mixins/tablehandler'
export default {
    name: "DataList",
    inject:{
        'tableInfo':{
            from:'tableInfo'
        }
    },
    mixins: [theaderMix],
    data() {
        return {
            tableDatas:this.tableInfo.tableDatas,
            columnConfig:this.tableInfo.columnConfig
        }
    },
    methods:{
        changeHeaderItemValue(value){
            return value;
        },
        changeRowValue(rowData,name){
            return rowData[name];
        },
        changePage(){

        }
    },
    created () {
        console.log('list.tableInfo',this.tableInfo);
    }
}
</script>
<style scoped>

</style>