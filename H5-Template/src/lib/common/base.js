import { GetUserInfoFunction, EncryptionFunction, DecryptionFunction, CheckNetWorkFunction } from './SnJsBridge.js';
import { showConfirm, showToast, openLonginPage, goBackPage } from './extend.js';
import Base64 from '../../lib/base64.js';
import { cryptPostFlag } from '../../config/request_config'; 
/**
 * 通过XMLHttpRequest发送请求,返回一个Promise,如果status!=200,走reject流程
 * @export
 * @param {any} method [GET/POST/PUT/DELETE]
 * @param {any} url 请求url
 * @param {any} data 发送的数据
 * @param {any} responseType 响应类型
 */

/***************  数据加解密开关   **************/


/***************  前端请求url host  **************/
var urlhost = 'https://tsblackbox.tixin4u.com:18093/SSP-Reservation/home/'; //TODO 这里需要从配置获取请求url，暂时默认写成黑盒环境，后续调整
if(window.CLIENT_HOST){ //从config文件获取host
    urlhost = window.CLIENT_HOST;
}
/*************** ********* **************/

export function formRequest(method, url, data, responseType) {

    function getClass(object) {
        return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
    }
    return new Promise(function (res, rej) {
        var tempData = '', sendData = null;
        for (var o in data) {
            if (data.hasOwnProperty(o)) {
                tempData += `&${o}=${data[o]}`;
            }
        }
        tempData = tempData.slice(1);
        var xhr = new window.XMLHttpRequest();
        if (method == 'GET') {
            //如果是GET请求需要把data拼接到url中
            var and = url.indexOf('?') == -1 ? '?' : '&';
            url += and + tempData;
        } else {
            //否则直接发送
            sendData = tempData;
        }
        xhr.open(method, url);
        xhr.timeout = 30000;
        xhr.ontimeout = function (event) {
            showToast('请求超时');
            rej('xhr.status is not 200');
        }
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;');
        if ('json' != responseType && 'JSON' != responseType) {
            xhr.responseType = responseType || 'text';
        }
        xhr.onreadystatechange = function (e) {
            if (e.currentTarget.readyState === 4) {
                if (e.currentTarget.status == 200) {
                    if ('json' == responseType || 'JSON' == responseType) {
                        var returnRes = e.currentTarget.response;
                        try {
                            if (getClass(returnRes) === 'Object') {
                                res(returnRes)
                            } else if (getClass(returnRes) === 'String') {
                                res(JSON.parse(returnRes));
                            }
                        } catch (e) {
                            res(returnRes);
                        }
                    } else if ('arraybuffer' == responseType) {//将blob数据类型改为arraybuffer兼容Android4.3
                        res(xhr.response)
                    }
                } else {
                    rej('xhr.status is not 200');
                }
            }
        }
        xhr.send(sendData);
    }).catch(function (error) {
        console.log("formRequest Error = " + JSON.stringify(error))
    })
}

export var nativeInfo = {};
//数据加密后发送给服务器(Promise版本)  
export function cryptPost(url, data = {}, vm, noCryptType) {
    if (noCryptType) { //数据不加密后发送给服务器
        var reqUrl =  urlhost + url;
        return formRequest('POST', reqUrl, data, 'json').then(function (result) {
            if (result && result.success) {
                return result.result;
            } else {
                var error = result ? result.message : url + ' is error, no message';
                //show error
                throw new Error(error);
            }
        });
    }
    return new Promise(function (res, rej) {
        if (nativeInfo.UAId) {
            res(nativeInfo);
        } else {
            return GetUserInfoFunction({
                isNeedSeesion: true
            }).then(function (uaData) {
                if (uaData) {//如果native登录
                    nativeInfo.UAId = uaData.UAId;
                    nativeInfo.cpyId = uaData.cpyId;
                    nativeInfo.UAName = uaData.uName;
                    nativeInfo.orgId = uaData.orgId;
                    nativeInfo.orgName = uaData.orgName;
                    nativeInfo.uPhone = uaData.uPhone;
                    try{
                    	var lgParam = JSON.parse(uaData.lgParam);
	                    lgParam.seq = Number(new Date())/1000 +'';
	                    nativeInfo.lgParam = JSON.stringify(lgParam);
                    }catch(e){
                    	var lgParam = {session:uaData.lgParam};
                    	lgParam.seq = Number(new Date())/1000 +'';
	                    nativeInfo.lgParam = JSON.stringify(lgParam);
                    }
                    if (!!uaData.deviceId) {
                        nativeInfo.deviceId = uaData.deviceId;
                    }
                    if (!!uaData.token) {
                        nativeInfo.token = JSON.parse(uaData.token);
                    }
                    console.log('nativeInfo:'+ JSON.stringify(nativeInfo));
                    res(nativeInfo);
                }
            });
        }
    }).then(function (nativeInfo) {
        return CheckNetWorkFunction().then(function (statusData) {//获取网络状态
            if (statusData.contectState) {
                if (nativeInfo.UAId) {
                    data.UAId = nativeInfo.UAId;
                    data.cpyId = nativeInfo.cpyId;
                    data.lgParam = nativeInfo.lgParam;
                }
                if (cryptPostFlag) {
                    return EncryptionFunction(data).then(function (eData) {
                        var d = {
                            cryptPostFlag: cryptPostFlag,
                            bdata: JSON.stringify({
                                data: eData.encryptData,
                                zip: eData.zip,
                                key: eData.key
                            })
                        };
                        return requestPost(url, vm, d, eData);
                    });
                } else {
                    var d = {
                        cryptPostFlag: cryptPostFlag,
                        bdata: Base64.encode(JSON.stringify(data))
                    };
                    return requestPost(url, vm, d, {});
                }
            } else {
                showToast('网络连接不可用', 'middle');
                rej('网络连接不可用');
            }
        });
    });
}


function requestPost(url, vm, d, eData) {
    var reqUrl =  urlhost + url;
    return formRequest('POST', reqUrl, d, 'json').then(function (result) {
        if (result && result.success) {
            if (cryptPostFlag) {
                return DecryptionFunction({
                    zip: eData.zip,
                    key: eData.key,
                    data: (result.result || {}).data
                }).then(function(dData){
                	try{
                		return JSON.parse(Base64.decode(dData));
                	}catch(e){
                		return Base64.decode(dData);
                	}
                });
            } else {
                return (result.result || {}).data;
            }
        } else {
            if (508 == result.result.code) {//未登录
                openLonginPage();
                goBackPage('');
                return;
            }
            if (vm) {
                vm.toastShow = false;
            }
            if (result.message) {
                showConfirm(result.message, null, 1, '确定');
            }
            //需要增加登录接口判断
            throw new Error(error);
        }
    });
}
//数据不加密后发送给服务器(Promise版本)
export function noCryptPost(url, data = {}) {
    var reqUrl =  urlhost + url;
    return formRequest('POST', reqUrl, data, 'json').then(function (result) {
        if (result && result.success) {
            return result.result;
        } else {
            var error = result ? result.message : url + ' is error, no message';
            //show error
            throw new Error(error);
        }
    });
}


