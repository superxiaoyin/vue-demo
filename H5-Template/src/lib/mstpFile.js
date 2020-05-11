import Base64 from './base64';
import {GetAppConfigFunction} from './common/SnJsBridge.js';
import {cryptPost,formRequest} from './common/base.js';
//不同环境下的mstp文件上传下载ip地址
const mstpIpMap = {
	"develop_server_host":{
		//ip:"http://211.148.21.18:8181",
		ip:"https://mstpblackbox.sinosun.com:8443",
	},
	"heihe_server_host":{
		//ip:"http://211.148.21.18:8181",
		ip:"https://mstpblackbox.sinosun.com:8443",
	},
	"shahe_server_host":{
		//ip:"http://mstpsandbox.tixin4u.com:8181",
		ip:"https://mstpsandbox.sinosun.com:8443",
	},
	"release_server_host":{
		//ip:"http://fs.tixin4u.com:80",
		ip:"https://mstpfs.sinosun.com",
	}
}

let MstpFile = function(){
    var _this = this;
    GetAppConfigFunction({key:'mstpHost'}).then(function(data){
    	_this.ipAddress = data.value;
    });
    cryptPost("appstore/createFileUploadMstpToken.html",'',{},true).then(function(result){
        _this.mtoken = result.token;
    });
}


/**
 * @private
 * 私有方法
 * @param base64UrlUnsafeStr
 * @returns {XML|string|*}
 */
function base64UrlUnsafe2Base64UrlSafe(base64UrlUnsafeStr) {
    return base64UrlUnsafeStr.replace(/\//g, "_").replace(/\+/g, "-");
};
MstpFile.prototype = {
    download: function(fileId){
    	var paramValue = {
	            token: Base64.encode(this.mtoken),
	            fileId: fileId
        };
        var base64UnsafeParams = Base64.encode(JSON.stringify(paramValue));
        var base64SafeParams = base64UrlUnsafe2Base64UrlSafe(base64UnsafeParams);
    	//var url = this.ipAddress + "/file/download";
		var url = this.ipAddress + "/file/download";
        return formRequest('GET', url, {params: base64SafeParams}, 'arraybuffer').then(function(xhr){//使用arraybuffer，兼容低版本Android
            return xhr;
        });
    },

	//通过fileid取文件url
	fileid2url: function(fileid){
		//从fileid取文件链接
		var urlToken = Base64.encode(this.mtoken).replace(/\//g, '_').replace(/\+/g, '-'),
			urlParam =  Base64.encode(JSON.stringify({fileId: fileid, token: urlToken})).replace(/\//g, '_').replace(/\+/g, '-'),
			obj = {params: urlParam},
			tempData = '';
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {tempData += key + '=' + obj[key] + '&';}
		}
		var param = tempData ? tempData.slice(0, -1) : tempData,
			url = this.ipAddress +  "/file/download";
		url += (url.indexOf("?") > 0 ? "" : "?") + param;
		return url;
	},

}
let instance;
export default new MstpFile();
