import $ from 'jquery';
import {commonMixins} from './common';
import tablemix from './tablehandler';
const mixins = $.extend(true,{},commonMixins,tablemix);
//console.log(commonMixins);
//console.log(tablemix)
export default {
    // ...commonMixins,
    // ...tablemix
    ...mixins
}