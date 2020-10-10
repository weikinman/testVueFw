import utils from '../utils/index'
const directives = {}
directives.install = (Vue,config={})=>{
    Vue.directive('dialogDrag', {
        bind(el, binding, vnode, oldVnode) {
          const dialogHeaderEl = el.querySelector('.el-dialog__header')
          const dragDom = el.querySelector('.el-dialog')
          dialogHeaderEl.style.cursor = 'move'
       
          // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
          const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)
       
          dialogHeaderEl.onmousedown = (e) => {
            // 鼠标按下，计算当前元素距离可视区的距离
            const disX = e.clientX - dialogHeaderEl.offsetLeft
            const disY = e.clientY - dialogHeaderEl.offsetTop
       
            // 获取到的值带px 正则匹配替换
            let styL, styT
       
            // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
            if (sty.left.includes('%')) {
              styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
              styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
            } else {
              styL = +sty.left.replace(/\px/g, '')
              styT = +sty.top.replace(/\px/g, '')
            }
       
            document.onmousemove = function(e) {
              // 通过事件委托，计算移动的距离
              const l = e.clientX - disX
              const t = e.clientY - disY
       
              // 移动当前元素
              dragDom.style.left = `${l + styL}px`
              dragDom.style.top = `${t + styT}px`
       
              // 将此时的位置传出去
              // binding.value({x:e.pageX,y:e.pageY})
            }
       
            document.onmouseup = function(e) {
              document.onmousemove = null
              document.onmouseup = null
            }
          }
        }
      })
       
      // v-dialogDragWidth: 弹窗宽度拖大 拖小
      Vue.directive('dialogDragWidth', {
        bind(el, binding, vnode, oldVnode) {
          const dragDom = binding.value.$el.querySelector('.el-dialog')
       
          el.onmousedown = (e) => {
            // 鼠标按下，计算当前元素距离可视区的距离
            const disX = e.clientX - el.offsetLeft
       
            document.onmousemove = function(e) {
              e.preventDefault() // 移动时禁用默认事件
       
              // 通过事件委托，计算移动的距离
              const l = e.clientX - disX
              dragDom.style.width = `${l}px`
            }
       
            document.onmouseup = function(e) {
              document.onmousemove = null
              document.onmouseup = null
            }
          }
        }
      })
      // 在组件中，使用自定义的事件：v-loadmore="loadMore" 在methods中调用loadMore
      Vue.directive('loadmore', {
        bind(el, binding) {
          var p = 0;
          var t = 0;
          var down = true;
          var selectWrap = el.querySelector('.el-table__body-wrapper')
          selectWrap.addEventListener('scroll', function () {
            //判断是否向下滚动
            p = this.scrollTop;
            // if ( t < p){down=true}else{down=false}
            if (t < p) {
              down = true;
            } else {
              down = false;
            }
            t = p;
            //判断是否到底
            const sign = 10;
            const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
            if (scrollDistance <= sign && down) {
              binding.value()
            }
          })
        }
      });
      /**
     * 文本框聚焦，且光标定位于文本末尾
     * 适用于v-if组件下的文本框
     */
    Vue.directive('focusCursorEnd', {
        // 当被绑定的元素插入到 DOM 中时……
        inserted: function (el) {
            const pos=el.value.length;
            if (el.createTextRange) {//IE浏览器 IE浏览器中有TextRange  对body,textarea,button有效
                const range = el.createTextRange(); //创建textRange
                range.moveStart("character", pos); //移动开始点（应移动到末尾），以字符为单位
                range.collapse(true);//没有移动结束点直接 折叠到一个点
                range.select();//选择这个点
            } else {//非IE浏览器,如firefox,chrome
                el.setSelectionRange(el.value.length, pos);
            }
            el.focus();
        }
    });
    
    //点击空白处关闭
    Vue.directive('clickOutsideClose',{
        bind:function(el,binding) {
          function handleClick(e){
            if(el.contains(e.target)){
      
              return false;
            }
            if(binding.expression){
              binding.value(e);
            }
          }
          el.__vueClickClose=handleClick;
          document.addEventListener('click',el.__vueClickClose);
        },
        unbind:function(el,binding){
          document.removeEventListener('click',el.__vueClickClose);
        }
      });
      /**
     * 多行文本换行省略
     */
    Vue.directive('autoElli',{
        inserted: function (el) {
            const s = el.textContent|| el.innerText,
                n = el.offsetHeight;
            for(let i=0; i<s.length; i++) {
                el.innerHTML = s.substr(0, i+1);
                if(n < el.scrollHeight) {
                    el.style.overflow = 'hidden';
                    el.innerHTML = s.substr(0, i-3) + '...';
                    break;
                }
            }
        }
    });
    /**
     * 防止重复点击
     * 使用 v-debound-click:fn="args"
     */
    Vue.directive('deboundClick',{
      inserted:function(el,binding,vnode) {
        function handleClick(e,args){
          el.__deboundevent(function(){
            
            if(binding.expression){
              let that = vnode.context
              that[binding.arg](binding.value,e);
            }
          });
        }
        el.__vueDeboundClick=handleClick;
        el.__deboundevent = utils.deboundsEvent(2000);
        el.addEventListener('click',el.__vueDeboundClick,false);
      },
      unbind:function(el,binding){
        el.removeEventListener('click',el.__vueDeboundClick);
      }
  });
  /**
     * 設置高度為父節點高度
     * 使用 v-full-height="args"
     */
    Vue.directive('fullHeight',{
      inserted:function(el,binding,vnode) {
        
          var $par = el.parentNode;
          if($par){
            var parHeight = $par.offsetHeight;
            console.log('fullHeight',parHeight);
            if(parHeight){
              el.style.height = parHeight+'px';
            }
          }
      },
      componentUpdated:function(el,binding,vnode){
        var $par = el.parentNode;
          if($par){
            var parHeight = $par.offsetHeight;
            console.log('fullHeightcomponentUpdated',parHeight);
            if(parHeight){
              el.style.height = parHeight+'px';
            }
          }
      },
      unbind:function(el,binding){

      }
  });
  /**
     * 設置高度為父節點高度
     * 使用 v-full-height="args"
     */
    Vue.directive('fullWinHeight',{
      inserted:function(el,binding,vnode) {
        var $win = window;
        if($win){
          var parHeight = $win.innerHeight;
          var offsetParent = el.offsetParent;
          var parentTop = 0;
          var elOffetTop = el.offsetTop;
          if(offsetParent){
            parentTop = offsetParent.offsetTop;
            elOffetTop+=parentTop;
          }
          var fixedHeight=-15;
          console.log('fullHeight',parHeight,binding);
          if(binding.value){
            fixedHeight = binding.value*1;
          }
          if(parHeight){
            el.style.height = (((parHeight*1)-(elOffetTop*1)+fixedHeight))+'px';
          }
        }
      },
      componentUpdated:function(el,binding,vnode){
        var $win = window;
        if($win){
          var parHeight = $win.innerHeight;
          var offsetParent = el.offsetParent;
          var parentTop = 0;
          var elOffetTop = el.offsetTop;
          if(offsetParent){
            parentTop = offsetParent.offsetTop;
            elOffetTop+=parentTop;
          }
          var fixedHeight=-15;
          console.log('fullHeight',parHeight,binding);
          if(binding.value){
            fixedHeight = binding.value*1;
          }
          if(parHeight){
            el.style.height = (((parHeight*1)-(elOffetTop*1)+fixedHeight))+'px';
          }
        }
      },
      unbind:function(el,binding){

      }
  });

  /**
     * 根据权限是否显示
     * 使用 v-per-ctrl="pers"
     * pers  example: 'get-/user,get-/role,put-/user' 数组或字符串（,隔开）
     * __$permissions
     * regs  example: ^(GET|POST)-(/user|/users)$    数组
     */
    Vue.directive('perCtrl',{
      inserted:function(el,binding,vnode) {
        let isShow = true;
          if(binding.value){
            let pers = binding.value;
            if(typeof pers=='string'){
              pers = pers.split(',');
            }
            isShow = utils.permissionSome(pers,vnode.__$permissions)
          }
          if(isShow==true){
            el.style.display = 'inline-block';
          }else{
            el.style.display = 'none';
          }
      },
      componentUpdated:function(el,binding,vnode){
        let isShow = true;
          if(binding.value){
            let pers = binding.value;
            if(typeof pers=='string'){
              pers = pers.split(',');
            }
            isShow = utils.permissionSome(pers,vnode.__$permissions)
          }
          if(isShow==true){
            el.style.display = 'inline-block';
          }else{
            el.style.display = 'none';
          }
      },
      unbind:function(el,binding){

      }
  });
}

export default directives;