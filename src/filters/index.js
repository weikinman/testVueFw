import filters from './src/main';

/* istanbul ignore next */
filters.install = function(Vue) {
    Object.keys(filters).forEach(item=>{
        if(item=='install')return true;
        Vue.filter(item,filters[item])
    });
};

export default filters;
