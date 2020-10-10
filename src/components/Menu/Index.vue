<template>
    <el-aside width="auto">
        <el-menu
          :default-active="defaultActive"
          :collapse="iscollapse"
          :router="true"
          @open="handleOpen"
          @close="handleClose"
          class="el-menu-vertical-demo"
          :background-color="m_bgColor"
          :text-color="m_textColor"
          :active-text-color="m_activeTextColor"
           
        >
        <template  v-for="(itemmenu, index) in menuDatas" >
            <el-submenu v-if="itemmenu.childrens.length>0" :key="index" :index="index+''">
                <template slot="title" v-if="itemmenu.isshow && itemmenu.childrens.length>0">
                <div class="icon-box" v-if="itemmenu.icon">
                    <img :src="itemmenu.icon" :class="[itemmenu.iconclass]" />
                </div>
                <div class="icon-box" v-if="itemmenu.iconclass">
                <span v-if="!itemmenu.icon && itemmenu.iconclass" :class="[itemmenu.iconclass]"></span>
                </div>
                <span class="icon-title">{{(itemmenu.isI18n && $t)? $t(itemmenu.title) : itemmenu.title}}</span>
                </template>
                <el-menu-item-group v-if="itemmenu.isshow && itemmenu.childrens.length>0">
                <el-menu-item v-for="(submenu, subindex) in itemmenu.childrens" v-show="submenu.isshow" :key="subindex+''" :index="submenu.url"  >
                    <div class="icon-child-box" v-if="submenu.icon">
                      <img :src="submenu.icon" :class="[submenu.iconclass]" />
                    </div>
                    <span v-if="!submenu.icon && submenu.iconclass" :class="[submenu.iconclass]"></span>
                    <span class="child-title">{{(submenu.isI18n && $t)? $t(submenu.title) : submenu.title}}</span>
                </el-menu-item>
                
                </el-menu-item-group>
                
            </el-submenu>
            <el-menu-item  v-if="itemmenu.childrens.length==0" v-show="itemmenu.isshow" :key="index+''" :index="itemmenu.url"  >
                    <div class="icon-box" v-if="itemmenu.icon">
                      <img :src="itemmenu.icon" :class="[itemmenu.iconclass]" />
                    </div>
                    <span v-if="!itemmenu.icon && itemmenu.iconclass" :class="[itemmenu.iconclass]"></span>
                    <span  slot="title" class="icon-title">{{(itemmenu.isI18n && $t)? $t(itemmenu.title) : itemmenu.title}}</span>
                </el-menu-item>
                
        </template>
        </el-menu>
        
        <div class="iscollapse" @click="setcollapse">
          <i class="el-icon-d-arrow-right" v-if="iscollapse"></i>
          <i class="el-icon-d-arrow-left" v-else></i>
        </div>
      </el-aside>
</template>

<script>
/**
 * menuData example
 */
// const menuDatas = [{
//     url:'/',
//     icon:'../../assets/image/icon/Management.png',
//     iconclass:'Management-icon',
//     title:'Management',
//     permissionurls:[],
//     childrens:[{
//         url:'/UserCon',
//         icon:'../../assets/image/icon/User.png',
//         iconclass:'User-icon',
//         title:'User management',
//         permissionurls:['/adm/pageUser'],
//         childrens:[]
//     },
//     {
//         url:'/CustCon',
//         icon:'../../assets/image/icon/Customer.png',
//         iconclass:'Customer-icon',
//         title:'Customer management',
//         permissionurls:['/pageCustome'],
//         childrens:[]
//     }]
// }]
/**
 * 
 */
export default {
    props:['menuDatas','defaultActive','bgColor','textColor','activeTextColorr'],
    data(){
        return {
            iscollapse:false,
            m_bgColor:'#244A79',
            m_textColor:'#fff',
            m_activeTextColor:'#ffd04b'
        }
    },
    created () {
      console.log(this.$t);
      this.$props.bgColor && (this.m_bgColor = this.$props.bgColor);
      this.$props.textColor && (this.m_textColor = this.$props.textColor);
      this.$props.activeTextColor && (this.m_activeTextColor = this.$props.activeTextColor);
      
    },
    methods: {
        //收缩展开
        setcollapse() {
          this.iscollapse = !this.iscollapse;
        },
        handleOpen(key, keyPath) {
        // console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
        // console.log(key, keyPath);
        }
    }
}
</script>

<style scoped>

.el-aside .el-menu {
  border-right: none;
}

.iscollapse {
  position: absolute;
  bottom: 0;
  background: #132843;
  color: #fff;
  width: 100%;
  height: 0.4rem;
  text-align: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center; 
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 2.5rem;
  min-height: 400px;
}
.el-menu-item {
  margin: 0.025rem 0;
  text-align: left;
}
.el-submenu {
  margin: 0.025rem 0;
  text-align: left;
}
.menu-icon {
  width: 0.25rem;
  margin-right: 0.15rem;
}
.el-menu-item span {
  word-break: normal;
  width: 100px;
  /* white-space: pre-wrap; */
  word-wrap: break-word;
}
.el-menu-item span.el-icon{
  width:.25rem; 
}
.el-menu-item>span:first-child.child-title{
  padding-left: .15rem;
}
.el-menu >>> .is-active {
  background-color: #1b3b61 !important;
  color: #fff !important;
}
.el-submenu >>> i,
.el-menu-item >>> i {
  color: #fff;
}
.child-title {
  font-size: 0.15rem;
}
.icon-box {
  width: 0.29rem;
  /* margin-left: 0.41rem; */
  display: inline-block;
}
.img-icon {
  width: 100%;
}
.icon-title {
  font-size: 0.17rem;
}
.icon-child-box {
  margin-left: 0.2rem;
  display: inline-block;
}
/* 按钮样式 */
.Management-icon {
  width: 0.25rem;
}
.User-icon {
  width: 0.22rem;
}
.Customer-icon {
  width: 0.24rem;
}
.Contract-icon {
  width: 0.27rem;
}
.Report-icon {
  width: 0.25rem;
}
.Amendment-icon {
  width: 0.35rem;
}
.Email-icon {
  width: 0.29rem;
}
.Permission-icon {
  width: 0.26rem;
}
.Settings-icon {
  width: 0.27rem;
}
</style>