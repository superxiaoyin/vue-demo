/**
 * Mstp文件上传管理
 */
import {nativeInfo,noCryptPost,cryptPost} from './common/base.js';
import { doPost } from "./common/Net.js";
import { showToast, getToken } from './common/extend.js';

let MstpFileHandler = function (mtoken) {
    var _this = this;
    this.mtoken = mtoken;
    this.start = false;
}
let hasLoad = false;
let getMSTPConfigFun = function () { 
    return new Promise(function (res, rej) {
        let timer = 0;
        if (hasLoad && !window.MstpConf) { 
            timer = 500;
        }
        console.log("timer   : ", timer);
        setTimeout(function () {
            if (window.MstpConf) {
               return res(window.MstpConf); 
            }
            hasLoad = true;
            doPost('common/getMSTPConfig.do', {
                'paramName': JSON.stringify(['MSTP_FS_ipAddress', 'MSTP_FS_previewAddress'])
            }).then(function (result) {
                if (!result || 0 != result.code || !result.data) {
                    rej("返回出错");
                    window.MstpConf && res(window.MstpConf);
                } else {
                    var MstpConf = {
                        // 根据不同的环境，此处的url地址不同
                        ipAddress: result.data.MSTP_FS_ipAddress,
                        previewAddress: result.data.MSTP_FS_previewAddress,
                        loglevel: 6,  //日志级别
                        inintMstpParam: function (uaToken) {
                            var initOption = {
                                appId: uaToken.appId,
                                mstpId: uaToken.mstpId,
                                exptime: uaToken.exptime,
                                creationTime: uaToken.creationTime,
                                signature: uaToken.signature,
                                url: this.ipAddress,
                                log_level: this.loglevel// 日志级别
                            };
                            // 初始化SDK
                            Mstp.initSdk(initOption);
                        },
                    };
                    console.log("window.MstpConf", MstpConf);
                    window.MstpConf = MstpConf || {};
                    res(MstpConf);
                }
            }, function (res, rej) {
                rej("返回出错");
                window.MstpConf && res(window.MstpConf);
            });
        }, timer);
    });
}
let hasLoadToken = false;
MstpFileHandler.prototype = {
    getMSTPConfig: function () {
        return getMSTPConfigFun();
    },
	/**
	 * Mstp token初始化
	 */
    initToken: function () {
        let token = {};
        let _this = this;
        let timer = 0;
        if (hasLoadToken && !MstpFileHandler.mtoken) { 
            timer = 500;
        }
        hasLoadToken = true;
        return new Promise(function (res, rej) {
    	 //预约开户从服务器取token
	    	setTimeout(function () { 
		         if (!!MstpFileHandler.mtoken) { //如果_this.mtoken为空，则去服务器获取
			    	token = MstpFileHandler.mtoken;
			    	_this.getMSTPConfig().then(function (MstpConf) {
		                var initOption = {
		                    appId : token.appId,
		                    exptime : token.exptime,
		                    mstpId : token.mstpId,
		                    creationTime : token.creationTime,
		                    signature : token.signature,
		                    url : MstpConf.ipAddress,
		                    log_level : MstpConf.loglevel // 日志级别
		                }
		                // 初始化SDK
		                Mstp.initSdk(initOption);
		                res();
		            }, function (e) {
		                rej("getMSTPConfig error")
		                console.log(e);
		            });
			    } else {
			    	doPost('openAccount/getToken.do').then(function (result) {
					    if(!!result){
					        token = result.data;
							MstpFileHandler.mtoken = token;		
							_this.getMSTPConfig().then(function (MstpConf) {
				                var initOption = {
				                    appId : token.appId,
				                    exptime : token.exptime,
				                    mstpId : token.mstpId,
				                    creationTime : token.creationTime,
				                    signature : token.signature,
				                    url : MstpConf.ipAddress,
				                    log_level : MstpConf.loglevel // 日志级别
				                }
				                // 初始化SDK
				                Mstp.initSdk(initOption);
				                res();
				            }, function (e) {
				                rej("getMSTPConfig error")
				                console.log(e);
				            });
					    }
					}); 
			    }    
			}, timer);   
       	})
	},
	/**
	 * 获取文件下载地址
	 * @param {Object} fileId
	 */
	downloadFileUrl:function(fileId) {
        var _this = this;
        return new Promise(function (res, rej) {
            _this.initToken().then(function () {
                // 初始化SDK
                var dlUrl = Mstp.generateUrl({
                    fileId : fileId
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
	previewFileUrl:function(fileId) {
        var _this = this;
        return new Promise(function (res, rej) { 
            _this.initToken().then(function () { 
                var previewUrl = Mstp.previewUrl({
                    url : MstpConf.previewAddress,
                    fileId : fileId
                });
                res(previewUrl);
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
		if( 0 < IEVersion() && IEVersion() < 10){
	    	showToast('浏览器版本不支持附件上传，请尝试使用高版本或者其他浏览器','middle');
		}
	    var initUploadOption = {
	        browse_button: uploadOption.id,
	        chunk_size: 4 << 20,
	        anonymous: 1,
	        filters: uploadOption.filter,
	        onUploadFilesAdded: uploadOption.beforeAddFunction,
	        onUploadProgress: function(files, progress) {
	            console.log("file: ", files.transactionId);
	            console.log("upload process: ", progress);
	        },
	        onUploadSuccess: uploadOption.succFunction,
	        onUploadFail: function(files, errorCode) {
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
    if(isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if(fIEVersion == 7) {
            return 7;
        } else if(fIEVersion == 8) {
            return 8;
        } else if(fIEVersion == 9) {
            return 9;
        } else if(fIEVersion == 10) {
            return 10;
        } else {
            return 6;//IE版本<=7
        }   
    } else if(isEdge) {
        return 'edge';//edge
    } else if(isIE11) {
        return 11; //IE11  
    }else{
        return -1;//不是ie浏览器
    }
};
export default new MstpFileHandler();


