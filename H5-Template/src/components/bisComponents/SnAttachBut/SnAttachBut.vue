<template>
    <span>
        <em :class="{attachDivem:version!='poc', attachDivemRed:version=='poc'}" @click.native="selFileBt(1)">
            <a v-if="title" :id="imageUploadId" href="javascript:;">
                <span>{{ title }}</span>
            </a>
            <a
                v-else
                class="attachA"
                href="javascript:;"
                :id="imageUploadId"
            ></a>
            <!--imageUpload1：上传附件绑定事件对象-->
        </em>
    </span>
</template>

<script>
import {
    GetUserInfoFunction,
} from "../../../lib/common/SnJsBridge.js";
import MstpFileHandler from "../../../lib/MstpFileHandler.js";
export default {
    model: {
        event: "setMun" //子组件向父组件传值
    },
    props: {
        datanum: {
            //明细detail number
            type: Number,
            default: 1
        },
        value: {
            type: Array,
            default: []
        },
        imageUploadId: {
            type: String,
            default: "imageUpload0" //附件DOM索引
        },
        title: {
            type: String,
            default: ""
        }
    },
    data: function() {
        return {
            datanum: 1,
            version: "prod",
            tokenData:{}
        };
    },
    beforeCreate: function() {},
    created: function() {},
    mounted: function() {
        //组件渲染生成dom
        var _this = this;
        if (!!localStorage.getItem("publishVersion")) {
            _this.version = localStorage.getItem("publishVersion");
        }
        MstpFileHandler.initUpload({
            id: _this.imageUploadId,
            beforeAddFunction: function(files) {
                _this.addBeforeFunction(_this, files);
            },
            succFunction: function(file, fileId) {
                _this.addSuccessFunction(_this, file, fileId);
            }
        });
        GetUserInfoFunction().then(function(Data){
            if(!!Data){
                _this.tokenData = JSON.parse(Data.token);
                setTimeout(function(){
                        // 遍历数据并且初始化MSTP
                        _this.initMstp(_this.imageUploadId)
                },2000)
                
                _this.userInfo = Data;
            }
        })
    },
    /**
     * 监听父组件传值给子组件
     */
    watch: {
        value: function(oldVal, newVal) {
            //主要供明细控件删除使用
        }
    },
    methods: {
        // 初始化Mstp
        initMstp: function(upId) {
            let _this = this;
            var initOption = {
                appId : _this.tokenData.appId,
                mstpId : _this.tokenData.mstpId,
                exptime : _this.tokenData.exptime,
                creationTime : _this.tokenData.creationTime,
                signature : _this.tokenData.signature,
                url : "https://mstpblackbox.sinosun.com",
                log_level : 6 // 日志级别
            };
            Mstp.initSdk(initOption);
            Mstp.uploader({
                browse_button: upId,
                chunk_size: 4 << 20, // 4M
                anonymous: 1, // 是否允许该文件匿名下载
                filters: {
                    mime_types: [
                        // { title: "files", extensions: "xls" },
                        // { title: "files", extensions: "xlsx" },
                        // { title: "files", extensions: "txt" }
                    ],
                    max_file_size: '10240kb'
                },

                //  beforeAddFunction: function(files) {
                //     _this.addBeforeFunction(_this, files);
                // },
                // succFunction: function(file, fileId) {
                //     _this.addSuccessFunction(_this, file, fileId);
                // },
                onUploadFilesAdded: function(files) {
                     _this.addBeforeFunction(_this, files);
                    // if(!!files && files.length>0){
                    //     let PluploadFile = files[0];
                    //     _this.fileName = PluploadFile.name;
                    //     _this.importFileShow = true;
                    // }
                },
                onUploadProgress: function(file, progress) {
                   
                },
                onUploadSuccess: function(file, fileId) {
                    // _this.upFileId = fileId;
                    // console.log(fileId);
                    _this.addSuccessFunction(_this, file, fileId);
                },
                onUploadFail: function(file, errorCode) {
                    Common.toast('出错了，请重新操作。');
                }
            });
        },
    	
        /**
         * 附件选择之后，上传之前方法回调
         * @param {Object} _this
         * @param {Object} files
         */
        addBeforeFunction: function(_this, files) {
            _this.$emit("onBeforeAddFunction", files);
        },
        /**
         * 附件上传成功方法回调
         * @param {Object} _this
         * @param {Object} file
         * @param {Object} fileId
         */
        addSuccessFunction: function(_this, file, fileId) {
            _this.$emit("onAddSuccessFunction", file, fileId);
        },
        /**
         * 附件点击预览方法
         * @param {Object} item ：
         */
        selFileBt: function(num) {
            _this.$emit("setMun", num);
        }
    }
};
</script>
<style lang="less">
@import "./SnAttachBut.less";
</style>