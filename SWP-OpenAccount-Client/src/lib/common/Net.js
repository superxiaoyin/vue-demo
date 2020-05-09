import {GetUserInfoFunction, CheckNetWorkFunction} from './SnJsBridge.js';
import {showToast,GUID} from './extend.js';
import {doPostRequest, isSuccess} from "./HttpProtocol";

/***************  前端请求url host  **************/
var urlhost = '/yqt/'; //TODO 这里需要从配置获取请求url
if(window.CLIENT_HOST){ //从config文件获取host
    urlhost = window.CLIENT_HOST;
}
/*************** ********* **************/


// 所有请求的seqindex,防止毫秒级的请求重复
var seqIndex = 0;
var tempSep = 0;

/*
 * 生成不重复请求seq
*/
function newSeq() {
   var seqGUID = new GUID(); // guid用于生成不重复请求seq
   var seq = Math.round(Number(new Date())) + "" + Math.round(Math.random(seqGUID.newGUID()) * 1000);
   return seq;
}

/**
 * post请求(data加密)
 * @param url
 * @param data
 * @param showBisError 是否自动toast提示业务异常
 */
export function doPost(url, data={}, showBisError=true) {
	var reqUrl =  urlhost + url;
    var p = new Promise(function (res, rej) {
        checkNetWrok().then(function () { // 检查网络
            return getUserInfo(data); // 从app获取用户信息
        }).then(function (result) {
            data.UAId = result.UAId; // 填充用户信息, TODO 后续的session可以在这里添加
            data.cpyId = result.cpyId;
            try{
            	data.lgParam = JSON.parse(JSON.stringify(result.lgParam)); // 登录校验参数,从app登录返回获取来的
				data.lgParam.seq = newSeq(); // 请求seq不能重复
			}catch(e){
				console.log('从app获取session失败');
			}
            //传出去的对象解除引用
            return doPostRequest(reqUrl,JSON.parse(JSON.stringify(data))); // 调用协议层网络请求
        }).then(function (result) { // server端返回数据，不管code是否为0，都走这里统一处理
            // 如果code非0，表示业务失败，转换错误提示，并根据调用者showError决定是否自动提示toast
            result = handleResult(result, showBisError);
            // 最后将数据返回调用者
            res(compatiableData(result));
        }).catch(function (e) { // 统一处理异常情况, 并且rej给调用者，界面需要处理rej情况
            console.log("formRequest e = " + JSON.stringify(e));
            var desc = e.errorDesc || "请求失败";
            showToast(desc);
            rej(e);
        });
    });
    return p;
}

/**
 * post请求，不携带uaid、cpyId
 * @param url
 * @param data
 * @param showBisError 是否自动toast提示业务异常
 */
export function doPostWithoutUser(url, data={}, showBisError=true) {
	var reqUrl =  urlhost + url;
    var p = new Promise(function (res, rej) {
        checkNetWrok().then(function () { // 检查网络
            return doPostRequest(reqUrl,data); // 调用协议层网络请求
        }).then(function (result) { // server端返回数据，不管code是否为0，都走这里统一处理
            result = handleResult(result, showBisError);
            // 最后将数据返回调用者
            res(compatiableData(result));
        }).catch(function (e) { // 统一处理异常情况, 并且rej给调用者，界面需要处理rej情况
            console.log("formRequest e = " + JSON.stringify(e));
            var desc = e.errorDesc || "请求失败";
            showToast(desc);
            rej(e);
        });
    });
    return p;
}

/**
 * post请求，不携带uaid、cpyId， 用于调用跨服务url，URL里面相对完整，除了域名、端口，要从"/yqt/微服务名称/"开始
 * @param url url是完整的URL： /yqt/company/company.findCpyInfoByCode
 * @param data
 * @param showBisError 是否自动toast提示业务异常
 */
export function doPostWithoutUserCompleteUrl(url, data = {}, showBisError = true) {
    var reqUrl = url;
    var p = new Promise(function (res, rej) {
        checkNetWrok().then(function () { // 检查网络
            return doPostRequest(reqUrl, data); // 调用协议层网络请求
        }).then(function (result) { // server端返回数据，不管code是否为0，都走这里统一处理
            result = handleResult(result, showBisError);
            // 最后将数据返回调用者
            res(compatiableData(result));
        }).catch(function (e) { // 统一处理异常情况, 并且rej给调用者，界面需要处理rej情况
            console.log("formRequest e = " + JSON.stringify(e));
            var desc = e.errorDesc || "请求失败";
            showToast(desc);
            rej(e);
        });
    });
    return p;
}

/**
 * 处理服务器响应结果, 主要是处理错误码提示
 * @param {} result
 */
function handleResult(result, showBisError=true) {
    // 如果code非0，表示业务失败，转换错误提示，并根据调用者showError决定是否自动提示toast
    if (!isSuccess(result)) {
        var localDesc = '';
        // emsg 为服务器接口返回的可直接展示用户的 msg描述, 如果不为空，优先展示emsg，否则从本地取desc
        if (!!result.emsg) {
            localDesc = result.emsg;
        } else {
            result.desc = transferErrorDesc(result);
            localDesc = result.desc;
        }
       // 错误描述追加显示 ecode， 如： "账号不存在[21111003]"
        if (!!result.ecode) {
            localDesc += ("[" + result.ecode + "]");
        }
        if (showBisError) {
            showToast(localDesc);
        }
        // 本地拼接的用于显示给用户的edesc："账号不存在[21111003]"， 如果界面需要自己提示toast，可以用这个edesc字段
        result.edesc = localDesc;
   }
   return result;
}

/**
 * 获取用户信息
 * @returns {Promise<any>}
 * @constructor
 */
// 当前从native获取的用户信息
export var nativeInfo = {};
function getUserInfo() {
    var p = new Promise(function (res, rej) {
        // 如果内存中已经取到过uaid，不在从app获取
        if(nativeInfo.UAId){
            res(nativeInfo);
        } else {
            // 从app获取用户信息
            return GetUserInfoFunction({
                isNeedSeesion: true
            }).then(function(uaData){
                if(uaData){//如果native登录
                    nativeInfo.UAId = uaData.UAId;
                    nativeInfo.cpyId = uaData.cpyId;
                    nativeInfo.UAName = uaData.uName;
                    nativeInfo.orgId = uaData.orgId;
                    nativeInfo.orgName = uaData.orgName;
                    nativeInfo.uPhone = uaData.uPhone;
                    // begin 添加登录校验lgparam
                    var lgParam = {};
                    try{
                        lgParam = JSON.parse(uaData.lgParam);
                    }catch(e){
                        // 问题：PC端给的值与app不一致，后续要pc端修改一下
                        lgParam = {session: uaData.lgParam};
                    }
                    nativeInfo.lgParam = lgParam;
                    // end 添加登录校验lgparam

                    if(!!uaData.deviceId) {
                        nativeInfo.deviceId = uaData.deviceId;
                    }
                    if (!!uaData.token) {
                        nativeInfo.token = JSON.parse(uaData.token);
                    }
                    res(nativeInfo);
                } else {
                    var errInfo = {
                        errorCode: "100003",
                        errorDesc: "用户信息获取失败"
                    };
                    console.log("GetUserInfo - getuser info from native failed...");
                    rej(errInfo);
                }
            });
        }
    });
    return p;
}

/**
 * 检查网络状态
 * @constructor
 */
function checkNetWrok() {
    var p = new Promise(function (res, rej) {
        CheckNetWorkFunction().then(function(statusData){//获取网络状态
            if(statusData.contectState){
                res(statusData);
            } else {
                var errInfo = {
                    errorCode: "100004",
                    errorDesc: "网络连接不可用"
                };
                rej(errInfo);
            }
        });
    });
    return p;
}

/**
 * 兼容SWP的webserver后端代码
 * @param {Object} result
 */
function compatiableData(result) {
	if(!!result.data){
		result.data["code"] = result.code;
		return result.data;
	}
	return result;
}

/**
 * 将server的错误码转换为用户提示信息
 * @param result
 * @returns {string}
 */
function transferErrorDesc(result) {
    if (result && result.code) {
        let desc = ERROR_MAP[result.code];
        if(result.code === 600003 || result.code === 36006){//银行返回的统一错误码
            let list = result.desc.split("[600003]");
            desc = list[list.length-1].trim();
        }else if (isEmptyStr(desc)) {
            desc = "抱歉，网络不给力，请您稍后重试!";
        }
        result.desc = desc;
    }
    return result.desc;
}

/** 
 * 判断字符是否为空的方法
 */
function isEmptyStr(obj){
    if(obj == null || obj == "" || typeof obj == "undefined"){
        return true;
    }else{
        return false;
    }
}
/**
 * 错误码表
 */
var ERROR_MAP = {
    '-1': "网络不给力，请您稍后重试!",
    '-5': "网络不给力，请您稍后重试!",
    107: "验证码错误",
    507: "请求参数错误",
    508: "请求参数错误",
    122: "登录超时，请重新登录!",
    3061: "银行卡与银行不匹配",
    3602: "联网核查未获取到用户图像",
    3603: "上传用户图像失败",
    3604: "校验Ⅱ类户开通权限失败",
    3605: "交易密码加密失败",
    100001: "该用户暂不支持电子缴费",
    100002:"验证码已过期",
    34000004: "账户密码校验失败",
    34000005: "用户未认证，请认证后再执行开户操作",
    34000006: "验证码校验失败",
    34000007: "用户认证中，请稍后再试",
    12000001: "未找到用户认证信息",
    72000002: "人脸对比不通过",
    72000003: "获取三方查询系统工作时间异常",
    72000004: "当前操作不在工作时间段，请稍后重试",
    680002: "电表类型不匹配",
    35012: "账户认证未通过",
    12000002: "证件信息已过期",
    340020: "该银行卡已被添加，请勿重复添加"
};