/**
 * Mstp文件上传管理
 */
import { nativeInfo } from './common/base.js';
import { doPost } from "./common/Net.js";
import { showToast } from './common/extend.js';
import { GetUserInfoFunction } from './common/SnJsBridge.js';

let MstpFileHandler = function (mtoken) {
    var _this = this;
    this.mtoken = mtoken;
    this.start = false;
}

let hasLoadMstpConfig = false;
MstpFileHandler.prototype = {
	/**
	 * Mstp token初始化
	 */
    initToken: function () {
        let _this = this;
        return new Promise(function (res, rej) {
            //预约开户从服务器取token
            return _this.getUserToken().then(function (data) {
                _this.getMstpUrl().then(function (MstpConf) {
                    var initOption = {
                        appId: data.appId,
                        exptime: data.exptime,
                        mstpId: data.mstpId,
                        creationTime: data.creationTime,
                        signature: data.signature,
                        url: MstpConf.ipAddress,
                        log_level: MstpConf.loglevel // 日志级别
                    }
                    // 初始化SDK
                    Mstp.initSdk(initOption);
                    res(MstpConf);
                })
            });
        })
    },
	/**
	 * 获取文件下载地址
	 * @param {Object} fileId
	 */
    downloadFileUrl: function (fileId) {
        var _this = this;
        return new Promise(function (res, rej) {
            _this.initToken().then(function () {
                // 初始化SDK
                var dlUrl = Mstp.generateUrl({
                    fileId: fileId
                });
                res(dlUrl);
            }, function (e) {
                rej("MstpFileHandler initToken error");
                console.log(e);
            });
        })
    },
	/**
	 * 获取文件预览地址
	 * @param {Object} fileId
	 */
    previewFileUrl: function (Option) {
        var _this = this;
        return new Promise(function (res, rej) {
            _this.initToken().then(function (MstpConf) {
                let previewOption = {
                    url: MstpConf.previewAddress,
                    fileId: Option.fileId,
                    onGetPreviewUrlSuccess: Option.onGetPreviewUrlSuccess,
                    onGetPreviewUrlFailure: Option.onGetPreviewUrlFailure,
                };
                Mstp.previewUrl(previewOption);
                res(previewOption);
            }, function (e) {
                rej("MstpFileHandler previewFileUrl error");
                console.log(e);
            })
        })
    },
	/**
	 * 初始化上传按钮，绑定回调函数
	 * @param {Object} uploadOption
	 */
    initUpload: function (uploadOption) {
        var _this = this;
        if (0 < IEVersion() && IEVersion() < 10) {
            showToast('浏览器版本不支持附件上传，请尝试使用高版本或者其他浏览器', 'middle');
        }
        var initUploadOption = {
            browse_button: uploadOption.id,
            chunk_size: 4 << 20,
            anonymous: 1,
            filters: uploadOption.filter,
            onUploadFilesAdded: uploadOption.beforeAddFunction,
            onUploadProgress: function (files, progress) {
                console.log("file: ", files.transactionId);
                console.log("upload process: ", progress);
            },
            onUploadSuccess: uploadOption.succFunction,
            onUploadFail: function (files, errorCode) {
                if (errorCode == '-601') {
                    Common.toast('请选择正确的图片格式');
                }
                if (errorCode == '-600') {
                    Common.toast('请选10兆以内的文件');
                }
                console.log("file: ", files.transactionId);
                console.log("upload error: ", errorCode);
            }
        };
        // 初始化SDK
        _this.initToken().then(function () {
            Mstp.uploader(initUploadOption);
        });
    },
    /**
     * 使用promis同步方法获取token
     */
    getUserToken: function () {
        var token = {};
        return new Promise(function (res, rej) {
            if (!!nativeInfo.token) { //如果nativeinfo中没有token，则需要去接口获取
                token = nativeInfo.token;
                res(token);
            } else {
                return GetUserInfoFunction().then(function (uaData) {
                    if (uaData) {//如果native登录
                        if (!!uaData.token) {
                            token = JSON.parse(uaData.token);
                        }
                        res(token);
                    } else {
                        doPost('openAccount/getToken.do').then(function (result) {
                            if (!result) return;
                            res(result.data);
                        });
                    }
                });
            }
        });
    },
    /**
 * 从webserver后端获取mstp上传的url
 */
    getMstpUrl: function () {
        return new Promise(function (res, rej) {
            if (window.MstpConf) {
                return res(window.MstpConf);
            }
            let timer = 0;
            if (hasLoadMstpConfig) {
                timer = 500;
            }
            var param = { 'paramName': JSON.stringify(['MSTP_FS_ipAddress', 'MSTP_FS_previewAddress']) }
            setTimeout(() => {
                if (window.MstpConf) {
                    return res(window.MstpConf);
                }
                return doPost('common/getMSTPConfig.do', param).then(function (data) {
                    hasLoadMstpConfig = true;
                    if (!!data) {
                        let MstpConf = {
                            ipAddress: data.paramValue.MSTP_FS_ipAddress,
                            previewAddress: data.paramValue.MSTP_FS_previewAddress,
                        }
                        window.MstpConf = MstpConf;
                        res(MstpConf);
                    }
                });
            }, timer)

        });
    }
}
/**
 * IE版本控制
 */
function IEVersion() {//yg
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
            return 7;
        } else if (fIEVersion == 8) {
            return 8;
        } else if (fIEVersion == 9) {
            return 9;
        } else if (fIEVersion == 10) {
            return 10;
        } else {
            return 6;//IE版本<=7
        }
    } else if (isEdge) {
        return 'edge';//edge
    } else if (isIE11) {
        return 11; //IE11  
    } else {
        return -1;//不是ie浏览器
    }
};
export default new MstpFileHandler();


