const commonobj = {
    getImageUrl(value,url) {
        if(!url){
            url = this.bw_imageHost+ '/';
        }else if(url=='BUFF'){
            url = 'data:image/jpeg;base64,';
        }
        if (value) {
            return url + value
        } else {
            return value;
        }
    },
    temperatureToC(num) {
        return num + '°C';
    },
    parseTime(value) {
        if (value) {
            return value + "" && value.replace(/T/g, " ");
        } else {
            return '';
        }

    },
    checkStranger(value){
        return value==='0000-0000';
    }
}
export const commonMixins = {
    data () {
        return {
            bw_imageHost:''      
        }
    },
    methods: {
        ...commonobj,
        findField(arr,name){
            let res = null;
            if(arr && arr.length>0){
                arr.forEach(item=>{
                if(item.field && item.field==name){
                    res = item;
                    return false;
                }else{
                    if(item.childrens && item.childrens.length>0){
                    res = this.findField(item.childrens,name);
                    if(res){
                        return false;
                    }
                    }
                }
                })
            }
            return res;
        },
        getFieldInstance(name){
            let res = null
            if(this.formConfigs&&this.formConfigs.datas && this.formConfigs.datas.length>0){
                res = this.findField(this.formConfigs.datas,name);
            }
            return res;
        },
        dataURLtoBlob: function(dataurl) { 
            var arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
        },
        //将blob转换为file
        blobToFile: function(theBlob, fileName){
           theBlob.lastModifiedDate = new Date();
           theBlob.name = fileName;
           return theBlob;
        },
        exportData (url,opts) {
            this.$axios({ // 用axios发送请求
              method: 'get',
              url: url, // 请求地址
              data: opts.data, // 参数
              responseType: 'blob' // 表明返回服务器返回的数据类型
            })
              .then((res) => { // 处理返回的文件流
                 
                if(opts && opts.filterData){
                    res = opts.filterData(res);
                }
                var blob = this.dataURLtoBlob(res);
                const fileName = opts.fileName
                if ('download' in document.createElement('a')) { // 非IE下载
                  const elink = document.createElement('a')
                  elink.download = fileName
                  elink.style.display = 'none'
                  elink.href = URL.createObjectURL(blob)
                  document.body.appendChild(elink)
                  elink.click()
                  URL.revokeObjectURL(elink.href) // 释放URL 对象
                  document.body.removeChild(elink)
                } else { // IE10+下载
                  navigator.msSaveBlob(blob, fileName)
                }
                
            })
          },
        getRandomId(){
            return (Math.random()*100000>>0).toString(16)+(Math.random()*100000>>0).toString(16)+(Math.random()*100000>>0).toString(16);
        },
        changeGender(value){
            var res = value;
            if(value){
                if(this.$t){
                    res = value==1?this.$t('formPlaceHolder.male'):this.$t('formPlaceHolder.female')
                }else{
                    res = value
                }
            }
            return res;
        },
        changeLang(lang){
            console.log(lang)
            localStorage.setItem('currentLang',lang);
            this.$i18n && lang && (this.$i18n.locale = lang);
            if(this.$root && this.$root.Bus){
                this.$root.Bus.$emit('i18nChangeLang',{locale:lang,i18n:this.$i18n});
            }
        },
        //i18n转换方法
        translater(value,opts) {
            if (!value) return '';
            var res = '',transer = this.$t;
            if(opts && opts.filterPre){
                value = opts.filterPre.call(this,value);
            }
            if(opts && opts.transer){
                transer = opts.transer;
            }
            if(transer){
                var msg = transer.call(this,value);
                if(msg){
                    res =  msg;
                }else{
                    res = value;
                }
            }
            if(opts && opts.filterEnd){
                res = opts.filterEnd.call(this,value);
            }
            return res;
          }
    },
    filters:{
        ...commonobj,
        //i18n转换方法
        translater(value,context,opts) {
            if (!value) return '';
            var res = '',transer = context.$t;
            if(opts && opts.filterPre){
                value = opts.filterPre.call(this,value);
            }
            if(opts && opts.transer){
                transer = opts.transer;
            }
            if(transer){
                var msg = transer.call(context,value);
                if(msg){
                    res =  msg;
                }else{
                    res = value;
                }
            }
            if(opts && opts.filterEnd){
                res = opts.filterEnd.call(this,value);
            }
            return res;
          }
    }
}
