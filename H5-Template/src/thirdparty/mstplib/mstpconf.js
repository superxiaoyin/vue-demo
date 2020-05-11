"use strict";

(function(){
	var mstpAddress = getFSIpAddress();
	var MstpConf = {
			/**
			 * 根据不同的环境，此处的url地址不同
			 */
			ipAddress:mstpAddress.MSTP_FS_ipAddress,
			previewAddress:mstpAddress.MSTP_FS_previewAddress,
			/**
			 * 日志级别
			 */
			loglevel:6,
			
			inintMstpParam:function(uaToken){
		    	var initOption = {
		                appId : uaToken.appId,
		                mstpId : uaToken.mstpId,
		                exptime : uaToken.exptime,
		                creationTime : uaToken.creationTime,
		                signature : uaToken.signature,
		                url : this.ipAddress,
		                log_level : this.loglevel// 日志级别
		            };
		        // 初始化SDK
		        Mstp.initSdk(initOption);
			},
	};
	window.MstpConf = MstpConf || {};
})();

/**
 * 从服务器获取MSTP配置
 */
function getFSIpAddress() {
	var mstpAddress = {};
	var mstpurl = './common/getMSTPConfig.do';
	try{
		if(!!localhostPath){
			mstpurl = localhostPath+'home/common/getMSTPConfig.do';
		}
	}catch(e){
		console.log(e);
	}
	
	// 发送请求
	$.ajax({
		type: 'POST',
		//cache: false,
		url: mstpurl,
		data: {'paramName':JSON.stringify(['MSTP_FS_ipAddress','MSTP_FS_previewAddress'])},
		contentType: 'application/x-www-form-urlencoded',
		async:false,
		success: function(data) {
			var dataJson = JSON.parse(data);
			if(dataJson.success) {
				mstpAddress = dataJson.result.paramValue;
			}
		},
		error: function(data) {
			console.log('未获取到MSTP配置');
		}
	});
	return mstpAddress;
}