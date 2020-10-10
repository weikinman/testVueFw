<template>
    <el-breadcrumb :separator-class="icon" v-if='$breadcrumbList'>
        <el-breadcrumb-item v-for="(item,index) in $breadcrumbList" :key="index" :to="{path:item.to.path}" >
            {{(item.to.breadcrumbTitle|| item.to.title||'')}}
            <slot v-bind="item"></slot>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script>
export default {
    name:'BwBreadCrumb',
    props:{
        icon:{
            default(){
                return 'el-icon-arrow-right'
            }
        }
    }
}
</script>
<style scoped>

</style>