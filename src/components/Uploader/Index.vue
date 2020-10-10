<template>
  <div class="">
    <div class="avatar-uploader">
      <div :ref="'elUploader'" @click="triggerChange" class="el-upload el-upload--text">
        <slot></slot>
        <input type="file" :name="name" @change="fileChange" class="el-upload__input">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Uploader",
    props: {
      dataInfo:{
        type:Object,
        default:function(){
          return {}
        }
      },
      url:{
        type:String,
        default:''
      },
      name:{
        type: String,
        default: 'file'
      },
      maxSize:{
        type:String,
        default:'2'
      },
      fileType:{
        type:String,
        default:'jpeg|png|gif|jpg|bmp|tif'
      },
      handleSuccess:{
        type:Function
      },
      beforeChange:{
        type:Function,
        default:function(){
          return true;
        }
      }
    },
    data() {
      return {
        defaultConfig: {
          fileType: 'jpeg|png|gif|jpg|bmp|tif' //\.jpg||\.jpeg||\.png||\.bmp||\.tif
        }
      };
    },
    mounted () {
        // let $dom = this.$refs.elUploader;
        // if($dom){
        //   var $input = $dom.$el.querySelector('input');
        //   $input.addEventListener('click')
        // }
        console.log(this);
    },
    methods: {
      triggerChange(e){
        let $dom = this.$refs.elUploader;
        if($dom){
          var $input = $dom.querySelector('input');
          $input.click();
        }
      },
      clearFiles(e){
        let $dom = this.$refs.elUploader;
        if($dom){
          var $input = $dom.querySelector('input');
          $input.value='';
        }
      },
      fileChange(e){
        var self = this;
        var target = e.target;
        var files = target.files;
        if(files.length>0){
          var file = files[0];
          var flag = this.beforeChange(file,target,e,this);
          if(!flag){return false;}
          var reader = new FileReader();
          //用于图片显示不需要传入后台，reader.result的结果是base64编码数据，直接放入img的src中即可
          reader.readAsDataURL(file);
          reader.onload = function () {
              self.handleSuccess(file,reader,e,self);
          }
        }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleAvatarSuccess(res, file) {
        console.log(file);
        this.addform.imageUrl = URL.createObjectURL(file.raw);
        this.addform.imgFile = file.raw;
      },
      beforeAvatarUpload(file) {
        const isJPG = new RegExp(this.uploadConfig.fileType, 'mg').test(file.type) // === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < this.uploadConfig.maxSize;

        if (!isJPG) {
          this.$message.error(`上传头像图片只能是 ${this.uploadConfig.fileType.replace('\|',',')} 格式!`);
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        isJPG = true;
        return isJPG && isLt2M;
      },

      addbwForm() {
        const imgFile = this.addform.imageUrl;
        console.log(this.addform);

        function objsToFormData(formdata, postModel, parKey) {
          parKey = parKey || '';
          var type = Object.prototype.toString.call(postModel);
          if (type == '[object Array]') {
            $.each(postModel, function (i, n) {
              objsToFormData(formdata, n, parKey + '[' + i + ']');
            });
          } else if (type == '[object Object]') {
            for (var i in postModel) {
              objsToFormData(formdata, postModel[i], parKey ? parKey + '.' + i : i);
            }
          } else {
            formdata.append(parKey, postModel);
          }
        }
        var formdata = new FormData();
        var $uploaderImage = this.$refs.uploaderImage;
        if ($uploaderImage) {
          var singleFile = $uploaderImage.$el.children[0].children[1];
          if (singleFile.length > 0) {
            formdata.append('imgFile', singleFile.files[0]);
          }
        }
        let postModel = {
          libId: this.formData.libId,
          ...this.addform
        }
        objsToFormData(formdata, postModel);
        this.$post(
          this.url,
          formdata, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        ).then(response => {
          let rcode = response.code;
          if (rcode == 200) {
            this.$errorMsg("添加成功！", "success", 3000);
            this.handleList();
          }
        });
      }
    }
  };
</script>
<style scoped>
  /* 合约中的服务类型 */
  .search-list-box {
    text-align: left;
  }

  .sevices-box {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 27px;
  }

  .services-type {
    display: inline-block;
    background-color: #3b5c84;
    color: #ffffff;
    padding: 3px 8px;
    border-radius: 15px;
    margin-left: 9px;
  }

  .ser-svrs {
    display: inline-block;
  }

  .services-text {
    font-size: 0.13rem;
  }

  .goList {
    cursor: pointer;
  }

  .table-class {
    margin-top: .1rem;
  }

  .table-class .el-table>>>th:first-child .cell {
    text-align: center;
  }

  .el-form--inline .el-form-item {
    margin-bottom: 0;
  }

  .table-item {
    padding: 5px 0;
  }
</style>