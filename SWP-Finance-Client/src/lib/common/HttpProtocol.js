import {EncryptionFunction, DecryptionFunction} from './SnJsBridge.js';

/**
 * post请求(data加密)
 * @param url
 * @param data
 */
export function doPostRequest(url, data={}) {
    var p = new Promise(function (res, rej) {
    	var cryptKey = "";
    	var zip = 1;
    	var keyType = 24;
        encryptData(data).then(function (encryptData) { // 加密request数据
        	cryptKey = encryptData.key;
        	zip = encryptData.zip;
        	keyType = encryptData.keyType;
            return sendPost('POST', url, encryptData, 'json'); // 发送网络请求
        }).then(function (response) { // 服务器response处理
            return decryptData(response, cryptKey, zip, keyType); // 去解密
        }).then(function (decryptData) { // 解密成功(包含code==0和code！=0，由业务自己处理code)
            res(decryptData);
        }).catch(function (e) { // 统一处理异常情况, 由调用层自己处理异常情况
            console.log("formRequest e = " + JSON.stringify(e));
            rej(e);
        })
    });
    return p;
}

/**
 * 加密数据
 */
function encryptData(data={}) {
    var p = new Promise(function (res, rej) {
        EncryptionFunction(data).then(function(eData){
            var d = {
                bdata: JSON.stringify({
                    data: eData.encryptData,
                    zip: eData.zip,
                    key: eData.key,
                    keyType: eData.keyType,
                }),
                key: eData.key,
                zip: eData.zip,
                keyType: eData.keyType,
            };
//          DecryptionFunction(JSON.parse(d.bdata)).then(function (result) {
//              console.log("加密后："+JSON.stringify(result));
//          });
            res(d);
        });
    });
    return p;
}

/**
 * 解密数据
 */
function decryptData(result, key, zip, keyType) {
    var p = new Promise(function (res, rej) {
    	var response = result;
    	if('string'==typeof(result)){
    		response = JSON.parse(result);
    	}
        // ssp服务的response最外层协议结构
        // mj 2019-04-17 协议新增ecode，emsg; 用于拼接在desc后面展示给用户
        var ret = {
            code: response.code,
            ecode: response.ecode,
            emsg: response.emsg,
            desc: response.rdesc,
            data: response.data,
        };
        if (isSuccess(response)&&!!response.data) { // code == 0并且data不能为空
            var d = {
                zip: zip,
                key: key,
                keyType: keyType,
                data: response.data,
            };
            DecryptionFunction(d).then(function (result) {
                ret.data = result;
                res(ret);
            });
        } else { // 服务器返回异常code
            res(ret);
        }
    });
    return p;
}

/**
 * result 是否成功 code == 0
 * @param result
 * @returns {boolean}
 */
export function isSuccess(result) {
    if(result && result.code == 0) {
        return true;
    } else {
        return false;
    }
}

/**
 * 网络请求
 * @param method
 * @param url
 * @param data
 * @param responseType
 * @returns {Promise<any>}
 */
function sendPost(method, url, data, responseType){

    function getClass(object){
        return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
    }
    return new Promise(function(res, rej){
        var tempData = '', sendData = null;
        for (var o in data) {
            if (data.hasOwnProperty(o)) {
                tempData += `&${o}=${data[o]}`;
            }
        }
        tempData = tempData.slice(1);
        var xhr = new window.XMLHttpRequest();
        if(method == 'GET'){
            //如果是GET请求需要把data拼接到url中
            var and = url.indexOf('?') == -1 ? '?' : '&';
            url += and + tempData;
        } else{
            //否则直接发送
            sendData = tempData;
        }
        xhr.open(method, url);
        xhr.timeout = 30000;
        xhr.ontimeout = function(event){
            console.log("sendPost - ontimeout..." + event);
            var errInfo = {
                errorCode: "100001",
                errorDesc: "请求超时",
            };
            rej(errInfo);
        }
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;');
        if('json' != responseType && 'JSON' != responseType) {
            xhr.responseType = responseType||'text';
        }
        xhr.onreadystatechange  = function(e){
            if(e.currentTarget.readyState === 4){
                if(e.currentTarget.status == 200){
                    if('json'==responseType||'JSON'==responseType){
                        var returnRes = e.currentTarget.response;
                        try{
                            if(getClass(returnRes)==='Object'){
                                res(returnRes)
                            }else if(getClass(returnRes)==='String'){
                                res(JSON.parse(returnRes));
                            }
                        }catch(e){
                            res(returnRes);
                        }
                    }else if('arraybuffer'==responseType){//将blob数据类型改为arraybuffer兼容Android4.3
                        res(xhr.response);
                    }
                } else {
                    console.log("formRequest - xhr.status is not 200");
                    var errInfo = {
                        errorCode: "100002",
                        errorDesc: "网络异常" + e.currentTarget.status,
                    };
                    rej(errInfo);
                }
            }
        }
        xhr.send(sendData);
    });
}