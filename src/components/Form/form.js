import $ from 'jquery';
import _ from 'lodash';
import utils from '../../utils/index';
class BaseElement {
    constructor(props){
        $.extend(this,{
            ___id:utils.NewGuid(),
            id:'',//唯一值
            type:'',
            datatype:'',
            formater:'',
            required:false,
            childrens:[],
            format:{
                
            },
            relationship:{
                targets:{
                    attributename:'',
                    change:function(){}
                }
            }
        },props);
        this.$dom = null;
        this.init();
    }
    init(){

    }
    getRenderHtml(){

    }
    render(context){
    }
}