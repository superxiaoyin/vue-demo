<!--
 * @Description: 
 * @Author: ZhangChuan
 * @Date: 2020-04-13 10:58:14
 * @LastEditors: ZhangChuan
 * @LastEditTime: 2020-05-06 20:20:26
 -->

<template>
  <div class="handle-rent-ocr">
    <Loading :show="show1" text="数据上传中"></Loading>
    <label class="idcard-title-tips">提示：保管箱仅限本人租用，线下办理业务时会核实身份</label>
    <div class="idcard">
      <label class="idcard-title">拍摄/上传您的二代身份证</label>
      <span id="uploadOnly" class="hide-dive"></span>
      <img
        id="front"
        ref="front"
        src="../../../../resource/img/openaccount/icon_idcard_front.png"
        class="idcard-front"
        @click="getFrontPhoto()"
      />
      <input
        ref="frontFile"
        style="display:none;"
        type="file"
        accept="image/*"
        @change="frontDisplay()"
      />
      <img
        id="back"
        ref="back"
        src="../../../../resource/img/openaccount/icon_idcard_back.png"
        class="idcard-back"
        @click="getBackPhoto()"
      />
      <input
        ref="backFile"
        style="display:none;"
        type="file"
        accept="image/*"
        @change="backDisplay()"
      />
    </div>

    <div class="footer button-on">
      <div class="btns" @click="nextStep">下一步</div>
    </div>
  </div>
</template>

<script>
import {
  newOpenRouterByValue,
  backRouterByValue,
  setBusinessData,
  getBusinessData,
  setLocalData,
  getServerDataH5
} from "../../../handler/handler";
import { sendPost } from "sslib/common/HttpProtocol.js";
import axiosServer from "sslib/common/axios.js";

import MstpFileHandler from "sslib/MstpFileHandler.js";
import common from "sslib/common/common.js";
import { registerHandler, notifyAppBackEvent } from "sslib/common/SnJsBridge";
import {
  throttle,
  goBackPage,
  initTitleMenu,
  showToast
} from "sslib/common/extend";
import { Loading } from "vux";
export default {
  data() {
    return {
      subTitle: ["实名认证"],
      backFlag: false,
      frontFlag: false,
      loadingFlag: false,
      frontPath: "",
      backPath: "",
      tokenData: {},
      frontFileId: "",
      backFileId: "",
      phone: "",
      uploadId: "",
      cardNumber: "",
      idNo: "",
      show1: false
    };
  },
  components: { Loading },
  created() {
    //  let _this = this;
    //        if(!!_this.$route.query.idNo){
    //           _this.idNo = decodeURIComponent(_this.$route.query.idNo);
    //       }
  },
  mounted() {
    var _this = this;
    axiosServer.call(this,{method:'post',url:'/bankConfig',type:'urlen'})
    setTimeout(function() {
      // 初始化MSTP
      // _this.initToken("uploadOnly");
      _this.initMstp(upId);
    }, 500);
  },
  methods: {
    // 初始化Mstp
    initMstp: function(upId) {
      let _this = this;
      var initOption = {
        appId: _this.tokenData.appId,
        mstpId: _this.tokenData.mstpId,
        exptime: _this.tokenData.exptime,
        creationTime: _this.tokenData.creationTime,
        signature: _this.tokenData.signature,
        url: textUrl + "/mstp",
        log_level: 6 // 日志级别
      };
      // 初始化SDK
      Mstp.initSdk(initOption);
      Mstp.uploader({
        browse_button: upId,
        chunk_size: 0, // 不分片
        anonymous: 1, // 是否允许该文件匿名下载
        filters: {
          mime_types: [
            //只允许上传图片和zip文件
            {
              title: "Image files",
              extensions: "image/*,jpg,gif,png,bmp,JPG,JPEG,jpeg"
            }
            //{ title : "Zip files", extensions : "zip" }
          ],
          max_file_size: "10240kb"
        },
        // resize: {
        // width: 1000,
        // crop: false,
        // preserve_headers: false
        // },
        maxFileSize: 3 * 1024,
        onUploadFilesAdded: function(files, uploader) {
          _this.beforeAddFunction(_this, files, upId, uploader);
        },
        onUploadProgress: function(file, progress) {},
        onUploadSuccess: function(file, fileId) {
          _this.addSuccessFunction(_this, file, fileId, upId);
        },
        onUploadFail: function(file, errorCode) {
          if ("front" == _this.uploadId) {
            _this.frontFlag = false;
          } else if ("back" == _this.uploadId) {
            _this.backFlag = false;
          }
          showToast("出错了，请重新操作。", "middle");
        }
      });
    },
    /**
     * Mstp token初始化
     */
    // initToken: function(upId) {
    //   let _this = this;
    //   return new Promise(function(res, rej) {
    //     //预约开户从服务器取token
    //     // 发送请求
    //     sendPost(
    //       "GET",
    //       textUrl + "/SSP-HTTP/userTencent.getToken",
    //       {},
    //       "json"
    //     ).then(
    //       result => {
    //         if (!!result && result.code == 0) {
    //           _this.tokenData = result.data;
    //           MstpFileHandler.mtoken = _this.tokenData;
    //           _this.initMstp(upId);
    //         } else {
    //           showToast("出错了，请重新操作。", "middle");
    //         }
    //       },
    //       rej => {
    //         console.log("reservation.getToken - 网络异常...");
    //       }
    //     );
    //   });
    // },
    getObjectURL(file) {
      var url = null;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    getFrontPhoto() {
      this.$refs.frontFile.dispatchEvent(new MouseEvent("click"));
    },
    getBackPhoto() {
      this.$refs.backFile.dispatchEvent(new MouseEvent("click"));
    },
    frontDisplay() {
      let _this = this;
      let inputDOM = this.$refs.frontFile;
      // 通过DOM取文件数据
      this.fil = inputDOM.files;
      let img = {};
      _this.compressImage(this.fil[0]).then(result => {
        let url = _this.getObjectURL(result);
        _this.$refs.front.src = url;
        Mstp.uploadFile(result);
        _this.uploadId = "front";
      });
      // _this.$refs.front.src = JSON.parse(frontData[0].value).photoBase64;
    },
    /**
     * 附件选择之后，上传之前方法回调
     * @param {Object} _this
     * @param {Object} files
     */
    beforeAddFunction: function(obj, files, upId, uploader) {
      var _this = this;
      if ("front" == _this.uploadId) {
        _this.frontFlag = true;
      } else if ("back" == _this.uploadId) {
        _this.backFlag = true;
      }
      // _this.downSizeImage(uploader,files).then(result=>{

      // let url = _this.getObjectURL(files[0].nativeFile);
      //     obj.$refs[upId].src = url;
      // });
      // _this.compressImage(files[0],0.5,uploader).then(result=>{
      //     files[0].nativeFile = result;
      //     let url = _this.getObjectURL(files[0].nativeFile);
      //     obj.$refs[upId].src = url;
      // });
    },
    /**
     * 附件上传成功方法回调
     * @param {Object} _this
     * @param {Object} file
     * @param {Object} fileId
     */
    addSuccessFunction: function(obj, file, fileId, upId) {
      console.log("file  transactionId: ", file.transactionId);
      console.log("upload success fileId: ", fileId);
      var _this = this;
      if ("front" == _this.uploadId) {
        _this.frontFileId = fileId;
      } else if ("back" == _this.uploadId) {
        _this.backFileId = fileId;
      }
    },
    /**
     * 下一步
     */
    async nextStep() {
      this.show1 = true;
      let param = {
        number: 111111111
      };
      setTimeout(() => {
        this.show1 = false;
        let param = {
          name: "ss",
          type: "1",
          number: 123456789098765432,
          address: "少时诵诗书所四十岁少时诵诗书所四十岁所所所所所所所所所所",
          phone: ""
        };
        setLocalData("cardInfo", param);
        newOpenRouterByValue.call(this, "handleRentPersoninfo");
      }, 3000);
      return;
      if (!_this.frontFlag) {
        showToast("请点击拍摄身份证正面", "middle");
        return;
      } else if (!_this.backFlag) {
        showToast("请点击拍摄身份证反面", "middle");
        return;
      } else if (!_this.frontFileId) {
        showToast("身份证正面上传中，请稍后", "middle");
        return;
      } else if (!_this.backFileId) {
        showToast("身份证反面上传中，请稍后", "middle");
        return;
      }
      //1.传正反面图片进行ocr扫描 2.跳转个人信息页面
      try {
        _this.loadingFlag = true;
        let param = {
          imageFontFileId: _this.frontFileId,
          imageBackFileId: _this.backFileId
        };
        getServerDataH5(
          "/yqt/certification/certificateTencent.ocrIdCard",
          param,
          "GET"
        ).then(
          result => {
            _this.loadingFlag = false;
            console.log("input", result);
            if (result.code === 0) {
              let data = result;
              if (data.idcard !== _this.idNo) {
                // if(data.orderNo == _this.data ){
                showToast("身份证与银行卡不匹配");
                setTimeout(() => {
                  backRouterByValue("query", "", _this);
                }, 2000);
              } else {
                if (!!data.orderNo) {
                  data["imageFontFileId"] = _this.frontFileId;
                  data["imageBackFileId"] = _this.backFileId;
                  setBusinessData(data.orderNo, data);
                  newOpenRouterByValue(
                    "step2",
                    { orderNo: encodeURIComponent(data.orderNo) },
                    _this
                  );
                }
              }
            } else {
              showToast(result.desc);
            }
          },
          rej => {
            _this.loadingFlag = false;
          }
        );
      } catch (error) {
        _this.loadingFlag = false;
        console.log(error);
      }
    },
    async backDisplay() {
      let _this = this;
      let inputDOM = this.$refs.backFile;
      // 通过DOM取文件数据
      this.fil = inputDOM.files;
      let img = {};
      let result = await _this.compressImage(this.fil[0]);
      let url = _this.getObjectURL(result);
      _this.$refs.back.src = url;
      Mstp.uploadFile(result);
      _this.uploadId = "back";
    },
    getObjectURL(file) {
      var url = null;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    /**
     * js压缩图片
     * @param file 图片文件对象
     * @param quality 压缩倍率 0~1
     * @constructor
     */
    compressImage(filesrc, quality) {
      return new Promise(function(res, rej) {
        var file = filesrc;
        // 图片小于3M不压缩
        let imageMaxSize = 1024 * 1024;
        if (file.size < imageMaxSize) {
          res(file);
        } else {
          var scare = Math.sqrt(imageMaxSize / file.size); //压缩率
          //压缩率
          quality = scare;

          //保存文件属性，后面用到
          var name = file.name;

          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function(e) {
            var src = e.target.result;

            var img = new Image();
            img.src = src;
            img.onload = function(e) {
              var w = img.width;
              var h = img.height;
              //生成canvas
              var canvas = document.createElement("canvas");
              var ctx = canvas.getContext("2d");
              // 创建属性节点
              var anw = document.createAttribute("width");
              anw.nodeValue = w;
              var anh = document.createAttribute("height");
              anh.nodeValue = h;
              canvas.setAttributeNode(anw);
              canvas.setAttributeNode(anh);

              //铺底色 PNG转JPEG时透明区域会变黑色
              ctx.fillStyle = "#fff";
              ctx.fillRect(0, 0, w, h);

              ctx.drawImage(img, 0, 0, w, h);
              // quality值越小，所绘制出的图像越模糊
              var base64 = canvas.toDataURL("image/jpeg", quality); //图片格式jpeg或webp可以选0-1质量区间
              // 返回base64转blob的值
              console.log(
                "\u539F\u56FE" + (src.length / 1024).toFixed(2) + "kb",
                "\u65B0\u56FE" + (base64.length / 1024).toFixed(2) + "kb"
              );
              //去掉url的头，并转换为byte
              var bytes = window.atob(base64.split(",")[1]);
              //处理异常,将ascii码小于0的转换为大于0
              var ab = new ArrayBuffer(bytes.length);
              var ia = new Uint8Array(ab);
              for (var i = 0; i < bytes.length; i++) {
                ia[i] = bytes.charCodeAt(i);
              }
              //通过Blob生成新图片文件对象
              file = new Blob([ab], { type: "image/jpeg" });
              //这里需要重新设置文件属性
              file.name = name;
              res(file);
            };
            img.onerror = function(e) {
              console.error(e);
            };
          };
          reader.onerror = function(e) {
            console.error(e);
          };
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~components/style/common.less";
@import "~components/style/filex.less";
.handle-rent-ocr {
  background: @color-bg;
  padding: 0.3rem;
  .idcard-title-tips {
    color: red;
    font-size: 12px;
    padding: 0 0.3rem;
  }
  .idcard {
    padding: 0.56rem 0.3rem;
    display: flex;
    flex-direction: column;
    align-items: center;

    .idcard-title {
      font-size: @fs-mob-small;
      color: @fc-info;
      text-align: center;
    }
    .idcard-front,
    .idcard-back {
      display: block;
      width: 100%;
      height: 3.2rem;
      margin-top: 0.4rem;
      border-radius: 0.1rem;
    }
    .hide-dive {
      width: 0px;
      height: 0px;
    }
  }
  .footer {
    .safeBox-footer();
  }
}
</style>