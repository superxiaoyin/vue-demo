/*
 功能：扩展方法，公共方法
author：yangguang
date：2016年12月15日
 */
import Vue from 'vue';
import { CommonDialogFunction, ClearWebViewCache, goBackFunction, goBackFunction_new, CheckNetWorkFunction, addAppViewListener, RegisterMenuFunction, popWindowFunction, OpenActionFunction } from './SnJsBridge.js';
import { bankMap } from '../../lib/ConstantData.js';
import { imgBase64Map } from './imgBase64Map.js';
import { cryptPost } from "./base";
import { domainMap } from "../domainData.js";
console.log(domainMap);
import { doPost } from "../../lib/common/Net.js";
/*******************************原生方法 prototype start*****************************************/
/**
 * 时间格式化
 * @param {Object} fmt
 */
Date.prototype.format = function (fmt) {
    var showDayArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "E+": showDayArr[this.getDay()], //周
        "D+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/i.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

export function isLeapYear(year) {
    if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) {
        return true
    }
    return false;
}

export function getMonthDay(month) {
    if (month == 2) {
        if (isLeapYear(new Date().getFullYear())) {
            return 29;
        } else {
            return 28;
        }
    }
    let longMonth = [1, 3, 5, 7, 8, 10, 12];
    if (!~longMonth.indexOf(month)) {
        return 30;
    } else {
        return 31;
    }
}
/**
 * 数组是否包含元素
 * @param {Object} ele
 */
Array.prototype.contains = function (ele) {
    for (var i in this) {
        if (this[i] == ele) return true;
    }
    return false;
}

/**
 * 字符串全部替换
 * @param {Object} s1
 * @param {Object} s2
 */
String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2); //g全局   
}

/**
 * 判断两个字符串是否相等（不区分大小写）
 * @param {Object} s1
 * @param {Object} s2
 */
String.prototype.compare = function (str) {
    //不区分大小写
    if (this.toLowerCase() == str.toLowerCase()) {
        return true; // 正确
    } else {
        return false; // 错误
    }
}
/*******************************原生方法 end*****************************************/

/******************************自定义方法 start**************************************/
/**
 * 根据key获取cookie的值
 * @param {Object} key
 */
function getCookie(key) {
    var str = document.cookie; // 获取Cookie字符串     
    if (!str || str.indexOf(key + "=") < 0) // 寻找name=     
        return;
    var cookies = str.split("; "); // 用;将所有的Cookie分隔开     
    for (var i = 0; i < cookies.length; i++) {
        // 遍历每个Cookie     
        var cookie = cookies[i]; // 当前Cookie     
        if (cookie.indexOf(key + "=") == 0) {
            // 如果名字为name     
            var value = cookie.substring(key.length + 1); // 获取value     
            return decodeURI(value); // 将value解码，并返回     
        }
    }
}

/**
 * 设置cookie
 * @param {Object} key      key
 * @param {Object} value       值
 * @param {Object} expiredays  失效时间
 */
function setCookie(key, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = key + "=" + encodeURI(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString() + ";path=/");
}

/**
 * 删除cookie
 * @param {Object} key
 */
function delCookie(key) {
    var curVal = getCookie(key);
    var exp = new Date();
    exp.setTime(exp.getTime() - 10);
    if (null != curVal) {
        document.cookie = key + '=' + encodeURI(curVal) + ';expires=' + exp.toGMTString();
    }
}
/**
 * 设置storage
 * @param {Object} key
 * @param {Object} value
 */
export function setStorage(key, value) {
    if (window.localStorage) {
        var storage = window.localStorage;
        storage.setItem(key, value);
    } else {
        setCookie(key, value, cacheExpiredays);
    }
}

/**
 * 获取storage
 * @param {Object} key
 */
export function getStorage(key) {
    if (window.localStorage) {
        var storage = window.localStorage;
        if ("undefined" != typeof (storage.getItem(key)) && null != storage.getItem(key) && "" != storage.getItem(key)) {
            return storage.getItem(key);
        } else {
            return "";
        }
    } else {
        getCookie(key);
    }
}
/**
 * 删除storage
 * @param {Object} key
 */
export function deleteStorage(key) {
    if (window.localStorage) {
        localStorage.removeItem(key);
    } else {
        delCookie(key);
    }

}

/**
 * 模糊删除storage
 * @param {Object} key
 */
export function deleteStorageByName(key) {
    if (window.localStorage) {
        for (var i = 0; i < localStorage.length; i++) {
            var storageKey = localStorage.key(i);
            if (storageKey.indexOf(key) > -1) {
                localStorage.removeItem(storageKey);
                i--;
            }
        }
    } else {
        delCookie(key);
    }

}

/**
 * 设置sessionStorage
 * @param {Object} key
 * @param {Object} value
 */
export function setSessionStorage(key, value) {
    if (window.sessionStorage) {
        var storage = window.sessionStorage;
        if (!storage.getItem(key)) {
            storage.setItem(key, value);
        }
    }
}

/**
 * 获取sessionStorage
 * @param {Object} key
 */
export function getSessionStorage(key) {
    if (window.sessionStorage) {
        var storage = window.sessionStorage;
        if ("undefined" != typeof (storage.getItem(key)) && null != storage.getItem(key) && "" != storage.getItem(key)) {
            return storage.getItem(key);
        } else {
            return "";
        }
    }
}
/**
 * 获取当前url的参数 
 */
export function getUrlParams() {
    var url = window.location.href;
    var regexP = /[^#&\?]+=[^#&\?]*/ig, res = {};
    var ms = url.match(regexP);
    if (ms) {
        for (var i = 0; i < ms.length; i++) {
            var arr = ms[i].split('=');
            res[arr[0]] = decodeURI(arr[1]);
        }
    }
    return res;
}

/**
 * 获取当前函数的节流函数(就是在xx毫秒内只能触发一次func)
 * 
 * @param {any} func 
 * @param {any} context func的上下文环境
 */
export function throttle(func, context) {
    if (throttle.ready) {
        throttle.ready = false;
        func.call(context);
        window.setTimeout(function () {
            throttle.ready = true;
        }, 1000);
    }
}
throttle.ready = true;




/**
 * 给数字num前面补零，不足length的前面补length-num.length个零，超过length的前面截取
 * @param {Object} num
 * @param {Object} length
 */
export function prefixInteger(num, length) {
    var num = (num + '').replace(/d/g, '');
    return (Array(length).join('0') + num).slice(-length);
}


//数组补位
export function pad(num, n) {
    var len = num.toString().length;
    while (len < n) {
        num = "0" + num;
        len++;
    }
    return num;
}
/**
 * 插入特定位置的字符串
 * @param str 原字符串
 * @param flg 插入字符
 * @param sn  插入位置
 * @returns {String}
 */
export function insert_flg(str, flg, sn) {
    var newstr = "";

    if (3 > str.length) {//如果sn为负数
        str = pad(str, 3);
        sn = 1;
    }

    var arr = str.split("");

    for (var i = 0; i < arr.length; i++) {
        if (i == sn) {
            newstr += flg;
        }
        newstr += arr[i];
    }

    return newstr;
}

/**
 * 字符串整数相加
 * @param {Object} a
 * @param {Object} b
 */
export function sumStrings(a, b) {
    a = a || '';
    b = b || '';
    a = a + "";
    b = b + "";
    var res = '', c = 0;
    a = a.split('');
    b = b.split('');
    while (a.length || b.length || c) {
        c += ~~a.pop() + ~~b.pop();
        res = c % 10 + res;
        c = c > 9;
    }
    return res.replace(/^0+/, '');
}


/**
 * 字符串相减  返回两个数的绝对值
 * @param {Object} a
 * @param {Object} b
 */
export function minusString(a, b) {//先判断a与b的大小
    var negativeFlag = false;//负数标识
    a = a || '';
    b = b || '';
    a = a + "";
    b = b + "";
    var res = '', c = 0, temp = '', tempArr = [];
    if (a.length < b.length) {//比较a与b的大小，如果a小于b则对调
        negativeFlag = true;
    } else if (a.length == b.length) {
        var a1 = a.split('');
        var b1 = b.split('');
        while (a1.length) {
            var a2 = ~~a1.shift();
            var b2 = ~~b1.shift();
            if (a2 > b2) {
                break;
            } else if (a2 < b2) {
                negativeFlag = true;
                break;
            }
        }
    }
    if (negativeFlag) {
        temp = a;
        a = b;
        b = temp;
    }
    a = a.split('');
    b = b.split('');
    while (a.length || b.length) {
        c += ~~a.pop() - ~~b.pop() + 10;
        res = c % 10 + res;
        c = c > 9 ? 0 : -1;
    }
    return res.replace(/^0+/, '');
}
/**
 * 格式化数据   100-->1.00元   
 * @param {Object} ms
 */
export function moneyStringFixTwo(ms) {
    var moneyDis = "";
    ms = ms + "";
    ms = ms.replace(/[^\d]/g, '');
    if (ms.length < 3) {//小数
        ms = pad(ms, 3);
    }
    moneyDis = insert_flg(ms, ".", (ms.length - 2));
    var l = moneyDis.split(".")[0].split("").reverse(),
        r = moneyDis.split(".")[1],
        t = "";
    for (var i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    var moneyDisBig = t.split("").reverse().join("") + "." + r + "元";
    return moneyDisBig;
}

/**
 * 字符串加上小数点，保留两位小数，增加单位   
 * @param {Object} ms
 * @param {Object} type -- 单位 可以传入空  （100 -> 1.00）
 */
export function stringFixTwoWithType(ms, type) {
    var moneyDis = "";
    ms = ms + "";

    //兼容历史数据开始，content中的金额可能为245.6，245.32等 
    if (ms.indexOf(".") > 0) {
        var dotnum = ms.split(".")[1];
        if (dotnum.length == 1) {
            ms = ms + "0";
        } else if (dotnum.length == 0) {
            ms = ms + "00";
        } else if (dotnum.length > 2) { //兼容历史金额数据为58129.99999999999
            var value = parseFloat(ms);
            value = (ms / 100).toFixed(2);
            ms = value + "";
        }
        ms = ms.replace(/,/g, "").replace(".", "");
    }
    //兼容历史数据结束，content中的金额可能为245.6，245.32等 
    if (ms.indexOf(".") < 0) {
        if (ms.length < 3) {
            ms = pad(ms, 3);
        }
        moneyDis = insert_flg(ms, ".", (ms.length - 2));
    }
    return moneyDis + type;
}

/**
 * 转换Arr为加上str型数据
 * @param {Object} arr 列表字段
 * @param {Object} arrJson 列表数据
 * @param {Object} str  插入字符串
 */
export function transArrToStr(arr, arrJson, str) {
    var result = "";
    if (0 > arr.length) {
        return result;
    }
    arr.forEach(function (i) {
        result += "${" + (arrJson[i] || '0') + "}" + str;
    });

    if (0 < result.length) {
        result = result.substr(0, result.length - 1);
    }
    return result;
}

/**
 * 金额转大写 传入不带小数点的正整数   至少三位
 * @param {Object} num
 */
export function moneyUppercase(num) {
    var Num = num + "";
    Num = insert_flg(Num, ".", (Num.length - 2));
    var part = Num.split(".");
    var newchar = "";
    var perchar = "";
    var tmpnewchar = "";
    for (var i = part[0].length - 1; i >= 0; i--) {
        if (part[0].length > 20) { tipsBox("数字过大，无法计算"); return ""; }
        tmpnewchar = "";
        perchar = part[0].charAt(i);
        switch (perchar) {
            case "0": tmpnewchar = "零" + tmpnewchar; break;
            case "1": tmpnewchar = "壹" + tmpnewchar; break;
            case "2": tmpnewchar = "贰" + tmpnewchar; break;
            case "3": tmpnewchar = "叁" + tmpnewchar; break;
            case "4": tmpnewchar = "肆" + tmpnewchar; break;
            case "5": tmpnewchar = "伍" + tmpnewchar; break;
            case "6": tmpnewchar = "陆" + tmpnewchar; break;
            case "7": tmpnewchar = "柒" + tmpnewchar; break;
            case "8": tmpnewchar = "捌" + tmpnewchar; break;
            case "9": tmpnewchar = "玖" + tmpnewchar; break;
        }
        switch ((part[0].length - i - 1) % 8) {
            case 0:
                switch ((part[0].length - i - 1) / 8) {
                    case 0:
                        tmpnewchar = tmpnewchar + "元";
                        break;
                    case 1:
                        tmpnewchar = tmpnewchar + "亿";
                        break;
                    default:
                        break;
                }

                break;
            case 1: if (perchar != 0) tmpnewchar = tmpnewchar + "拾"; break;
            case 2: if (perchar != 0) tmpnewchar = tmpnewchar + "佰"; break;
            case 3: if (perchar != 0) tmpnewchar = tmpnewchar + "仟"; break;
            case 4: if (part[0].substr(0, 4) > 0) tmpnewchar = tmpnewchar + "万"; break;
            case 5: if (perchar != 0) tmpnewchar = tmpnewchar + "拾"; break;
            case 6: if (perchar != 0) tmpnewchar = tmpnewchar + "佰"; break;
            case 7: if (perchar != 0) tmpnewchar = tmpnewchar + "仟"; break;
        }
        newchar = tmpnewchar + newchar;
    }
    if (Num.indexOf(".") != -1) {
        if (part[1].length > 2) {
            part[1] = part[1].substr(0, 2)
        }
        for (var i = 0; i < part[1].length; i++) {
            tmpnewchar = "";
            perchar = part[1].charAt(i)
            switch (perchar) {
                case "0": tmpnewchar = "零" + tmpnewchar; break;
                case "1": tmpnewchar = "壹" + tmpnewchar; break;
                case "2": tmpnewchar = "贰" + tmpnewchar; break;
                case "3": tmpnewchar = "叁" + tmpnewchar; break;
                case "4": tmpnewchar = "肆" + tmpnewchar; break;
                case "5": tmpnewchar = "伍" + tmpnewchar; break;
                case "6": tmpnewchar = "陆" + tmpnewchar; break;
                case "7": tmpnewchar = "柒" + tmpnewchar; break;
                case "8": tmpnewchar = "捌" + tmpnewchar; break;
                case "9": tmpnewchar = "玖" + tmpnewchar; break;
            }
            if (i == 0) tmpnewchar = tmpnewchar + "角";
            if (i == 1) tmpnewchar = tmpnewchar + "分";
            newchar = newchar + tmpnewchar;
        }
    }
    while (newchar.search("零零") != -1) {
        newchar = newchar.replace("零零", "零");
    }
    newchar = newchar.replace("零亿", "亿");
    newchar = newchar.replaceAll("零万", "万");
    newchar = newchar.replace("亿万", "亿");
    newchar = newchar.replace("零元", "元");
    newchar = newchar.replace("零角", "");
    newchar = newchar.replace("零分", "");
    if (newchar == "") {
        newchar = "零元";
    }
    if (newchar.charAt(newchar.length - 1) == "元") {
        newchar = newchar + "整";
    }
    if (newchar.charAt(newchar.length - 1) == "拾" || newchar.charAt(newchar.length - 1) == "佰" || newchar.charAt(newchar.length - 1) == "仟" || newchar.charAt(newchar.length - 1) == "万") {
        newchar = newchar + "元整";
    }
    if (newchar == "元整") {
        newchar = "零元";
    }
    if (newchar.substring(0, 1) == "元") {
        newchar = newchar.substring(1, newchar.length);
    }
    return newchar;
}

/**
 * 判断对象是否为空，为空返回true，否则返回false
 * @param {Object} e
 */
export function isEmptyObject(e) {
    for (var t in e) {
        return !1;
    }
    return !0
}

/**
 * 判断a与b是否相等 暂时用来比较对象，后续需要扩展为比较任意对象
 * @param {Object} x
 * @param {Object} y
 */
export function isEqual(x, y) {
    if (x === y) {
        return true;
    }

    // If they are not strictly equal, they both need to be Objects 
    if (!(x instanceof Object) || !(y instanceof Object)) {
        return false;
    }

    //They must have the exact same prototype chain,the closest we can do is
    //test the constructor. 
    if (x.constructor !== y.constructor) {
        return false;
    }

    for (var p in x) {
        //Inherited properties were tested using x.constructor === y.constructor
        if (x.hasOwnProperty(p)) {
            // Allows comparing x[ p ] and y[ p ] when set to undefined 
            if (!y.hasOwnProperty(p)) {
                return false;
            }

            // If they have the same strict value or identity then they are equal 
            if (x[p] === y[p]) {
                continue;
            }

            // Numbers, Strings, Functions, Booleans must be strictly equal 
            if (typeof (x[p]) !== "object") {
                return false;
            }

            // Objects and Arrays must be tested recursively 
            if (!isEqual(x[p], y[p])) {
                return false;
            }
        }
    }

    for (p in y) {
        // allows x[ p ] to be set to undefined 
        if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
            return false;
        }
    }
    return true;
}
/**
 * 数据转换  utf16转utf8
 * @param {Object} str
 */
export function utf16to8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
}

/**
 * 跳转页面
 * @param {Object} url
 */
export function openPage(url) {
    CheckNetWork(function () {
        window.open(url);
    }, this);
}

/**
 * 跳转页面
 * @param {Object} url + objParam
 */
export function openPageByObj(url, objParam) {

    var param = encodeURI(JSON.stringify(objParam));
    if (url.indexOf("?") > -1) {
        url += "param=" + param;
    } else {
        url += "?param=" + param;
    }
    console.log(url);
    //跳转前判断是否IOS
    var isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    CheckNetWork(function () {
        if (isIOS) {
            window.location.href = url;
        } else {
            window.open(url);
        }
    }, this);
}

/**
 * 重定向页面
 * @param {Object} url
 */
export function locationPage(url) {
    CheckNetWork(function () {
        window.location.href = url;
    }, this);
}

/**
 * 返回页面
 * @param {Object} url
 */
export function goBackPage_new(url, backSteps, loadData) {
    goBackFunction_new(url, backSteps, loadData);
}

/**
 * 返回页面
 * @param {Object} url
 */
export function goBackPage(url) {
    goBackFunction(url);
}

/**
 * 检查网络状态
 * @param {Object} func   函数名
 * @param {Object} content  上下文
 */
export function CheckNetWork(func, content) {
    CheckNetWorkFunction().then(function (statusData) {
        if (statusData.contectState) {
            if (func) {
                func.call(content);
            }
        } else {
            showToast('网络连接不可用', 'middle');
        }
        return statusData;
    })
}

/**
 * 判断是否PC端
 */
export function isPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
    }
    return flag;
}



//原OA tipsbox方法
function tipsBox(tipsText, delayTime) {
    var time = 200;
    if (delayTime != undefined) {
        time = delayTime;
    }
    if ($(".tipsBox").length == 0) {
        $("body").append("<div class='tipsBox' style='display:none;position:fixed;width:100%;bottom:30%;left:0;text-align:center;z-index:1101'><span style='max-width:60%;margin:0 auto;display:inline-block;border-radius:5px;padding:12px 24px;font-size:16px;color:#fff;background:rgba(0,0,0,0.9);box-shadow:1px 1px 5px #b2b2b2'>" + tipsText + "</span></div>");
        $(".tipsBox").stop().delay(time).animate({ opacity: 'show' }, 0).delay(2000).animate({ opacity: 'hide' }, 350, function () { $(".tipsBox").remove() });
        $(document).on("click", ".tipsBox", function () { //点击tipsbox隐藏
            $(".tipsBox").stop().animate({ opacity: 'hide' }, 150, function () { $(".tipsBox").remove() });
        })
    }
}
/**
 * 弹框提示
 * @param {Object} tips  提示内容
 * @param {Object} type  提示类型  text-普通文本  success-提示成功  error-失败提示
 */
export function showToast(tips, position, time, type) {

    tipsBox(tips, time);
    return;

    var type = type || 'text';//默认普通文本
    var position = position || 'middle';
    var time = time || 2000;
    Vue.$vux.toast.show({
        text: tips,
        time: time,
        position: position,
        type: type
    });
}


//success pop
function successPop(successText, delayTime) {
    var time = 200;
    if (delayTime != undefined) {
        time = delayTime;
    }
    $("body").append('<div class="sub_prompt_box"><div class="sub_prompt"><div></div><span>' + successText + '</span></div></div>');
    $(".sub_prompt_box").stop().delay(time).animate({ opacity: 'show' }, 0).delay(2000).animate({ opacity: 'hide' }, 350, function () { $(".sub_prompt_box").remove() });

}

export function showSuccessPop(successText, delayTime) {
    successPop(successText, delayTime)
}


/**
 * 确认框提示
 * @param {Object} content  内容
 * @param {Object} rightFunction  确定函数
 * @param {Object} title    title
 * @param {Object} type     类型  
 */
/**
 * 
 * @param {Object} content      内容
 * @param {Object} rightFunction   右侧按钮点击事件
 * @param {Object} title        title
 * @param {Object} type         类型       1-单个按钮  2-两个按钮  3-多个按钮      默认为两个按钮
 * @param {Object} strLeftBtn   左侧按钮
 * @param {Object} strRightBtn  右侧按钮
 * @param {Object} leftFunction   左侧按钮点击事件
 * @param {Object} H5Flag       是否调用H5方法
 */
export function showConfirm(content, rightFunction, type, strLeftBtn, strRightBtn, title, leftFunction, H5Flag) {
    var type = type || 2;//默认两个按钮	
    if (!H5Flag) {//非H5方法
        if (2 == type) {//两个按钮
            strLeftBtn = strLeftBtn || '取消';
            strRightBtn = strRightBtn || '确认';
            if (isPC()) {//PC默认为左侧确定，右侧取消	
                var tempFun = rightFunction;
                rightFunction = leftFunction;
                leftFunction = tempFun;
                var tempText = strRightBtn;
                strRightBtn = strLeftBtn || '取消';
                strLeftBtn = tempText || '确认';
            }
        };
        var confirmJson = {//调用native弹框方法请求参数
            requestCode: 0,
            strTitle: title,
            message: content,
            strLeftBtn: strLeftBtn,
            rightBtnFontColor: '#478aee',//右边按钮默认颜色
            strRightBtn: strRightBtn
        };
        //调用native弹框方法
        CommonDialogFunction(confirmJson).then(function (data) {
            if (3 == data.clickType) {//两个按钮点击右侧按钮     //选择按钮类型 1:关闭按钮  2:左侧按钮  3:右侧按钮
                if (rightFunction) {//函数存在则执行函数
                    rightFunction();
                }
            } else if (2 == data.clickType) {//两个按钮点击左侧按钮
                if (leftFunction) {//函数存在则执行函数
                    leftFunction();
                }
            }
        });
    } else {
        if (2 == type) {
            Vue.$vux.confirm.show({ //显示confirm弹窗   暂时屏蔽H5方法
                title: title || '',
                content: content,
                onShow() {
                    console.log('show')
                },
                onHide() {
                    console.log('hide')
                },
                onCancel() {
                    leftFunction();
                },
                onConfirm() {
                    rightFunction();
                }
            });
        } else {
            alert(content);
        }
    }
}

/**
 * 获取类型名称
 * @param {Object} object
 * __getClass(5); // => "Number"
 * __getClass({}); // => "Object"
 * __getClass(/foo/); // => "RegExp"
 * __getClass(''); // => "String"
 * __getClass(true); // => "Boolean"
 * __getClass([]); // => "Array"
 * __getClass(undefined); // => "Window"
 * __getClass(Element); // => "Constructor"
 *
 */
export function getClass(object) {
    return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
}

/*
*  图片转base64
* */
export function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var dataURL = canvas.toDataURL("image/png");
    //return dataURL
    return dataURL.replace("data:image/png;base64,", "");

}
export function newTitlePng(src) { //传base64图标给app
    var img = document.createElement('img');
    var baseImg;
    var data = '';
    img.src = src;
    img.onload = function () {
        data = getBase64Image(img);
        console.log('img:' + data);
        return data;
    }

}

/**
 * 设置页面title、按钮、菜单，包含原addAppButton，changeViewTitle
 * @param {Arr} menuList，数组第一个参数为titile的str，后面的为按钮名
 * 
 * 按钮配置说明：
 * String name;  //  如果是菜单，用name显示菜单文字
 * String iconNormalBase64;  // 如果是图标按钮，用来显示 正常图标（JS交互时，用base64转码，如果图片超过5k，提出来让UI重新切图）
 * String iconPressedBase64; // 如果是图标按钮，用来显示 按下效果 图标（JS交互时，用base64转码，如果图片超过5k，提出来让UI重新切图）
 * String menuId;  //必填   菜单ID （不区分是 图标按钮 或是 菜单项），列表中的menuId必须相互唯一
 * Int type;  // 必填 类型 1 ActionBar上的图标按钮，2 下拉菜单项 3 title显示（一般情况下，只有一个图标按钮，可以有多个下拉菜单项）
 * 注意
 * name 和 iconNormalBase64 至少需要填写一个；
 * name 和iconNormalBase64 都有值时ActionBar上的按钮优先显示name，下拉菜单项会左边显示图标，右边显示name；
 * pc可配多个1级按钮，app1级按钮知会显示1个
 * 当有多个type 为1的item时，app会取第一个值；       
 * 下拉菜单项显示顺序默认按menuList的顺序排序； 
 * menuList位Arr，第一位固定为title，后面可以传menuMap里面的key，也可以直接传json(fun需要传变量时使用)
 * 
 */
export function initTitleMenu(menuList) {
    var helpUrl = '';
    var path = '';
    if (isPC()) {
        path = 'pc';
        helpUrl = 'yqt.html?active=90';
    } else {
        path = 'app';
        helpUrl = 'yqt.html?active=97';
    }
    var imgBase64MapJson = imgBase64Map[path];
    var menuMap = {
        menuTitle: { name: menuList[0], menuId: 'title', type: 3 },
        menuOpenHistory: { iconNormalBase64: imgBase64MapJson['path_1_0'], menuId: 'but_1_0', type: 1, func: function () { openPage('openlist.html') } },
        menuBankmap: { iconNormalBase64: imgBase64MapJson['path_1_4'], iconPressedBase64: imgBase64MapJson['path_1_4_hov'], menuId: 'but_1_4', type: 1, func: function () { openPage('net.do?active=2') } },
    }
    var titleMenuList = [menuMap.menuTitle];
    for (var i = 1; i < menuList.length; i++) {
        var menuName = menuList[i];
        if ('String' == getClass(menuName)) {
            titleMenuList.push(menuMap[menuName]);
        } else if ('Object' == getClass(menuName)) {
            titleMenuList.push(menuName);
        }
    }
    RegisterMenuFunction(titleMenuList);
}
/*
 * 页面只设置title
 * 
 * */
export function setTitleOnly(title) {
    initTitleMenu([title]);
}


/**
 * 根据数组中的key获取Object中的value并且设置数组值
 * @param {Object} Arr    源数组
 * @param {Object} Object 有数据的对象
 */
export function genArrValueByKey(Arr, Object) {
    var res = JSON.parse(JSON.stringify(Arr));
    res.map(function (item, index) {
        if ('money' == item.type && Object[item.value]) {//金额
            return item.value = moneyStringFixTwo(Object[item.value]);
        } else if ('date' == item.type && Object[item.value]) {//日期
            return item.value = new Date(Object[item.value] * 1000).format(item.frt);
        } else if (Object[item.value]) {//content内容里面的数据
            return item.value = Object[item.value];
        }
    });
    return res;
}

/**
 * 数组合并并去重
 * @param {Object} ele
 */
export function delRepeat(arr1, arr2) {
    var arr = arr1.concat(arr2);
    var lastArr = [];
    for (var i = 0; i < arr.length; i++) {
        if (!unique(arr[i], lastArr)) {
            lastArr.push(arr[i]);
        }
    }
    return lastArr;
}
function unique(n, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (n == arr[i]) {
            return true;
        }
    }
    return false;
}

/**
 * 获取index的url
 */
export function getIndexUrl() {
    var getIndexUrl = 'yqt.html?active=1'; //index默认值
    if (!!getStorage('indexUrl')) {
        getIndexUrl = JSON.parse(getStorage('indexUrl'));
    }
    return getIndexUrl;
}


/**
 * 获取字符串字节数
 * @param {Object} str 
 * @return {Object} realLength
 */
export function getBLength(str) {
    var realLength = 0;
    var len = str.length;
    var charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) {
            realLength += 1;
        } else {
            realLength += 2;
        }
    }
    return realLength;
}
/**
 * 邮箱的规则验证 （onblur）
 * @param {} ele
 */
export function checkEmail(value) {
    if (!!value && value != "") {
        //邮箱规则  
        var websiteCheck = /(^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$)|(^$)/.test(value);
        if (!websiteCheck) {
            return false;
        }
    }
    return true;
}
/**
 * 网址的规则验证 （onblur）
 * @param {} ele
 */
export function checkWebsite(value) {
    if (!!value && value != "") {
        var reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;
        if (!reg.test(value)) {
            return false;
        }
    }
    return true;
}


/**
 * 查询银行信息
 */
export function getBankConfig() {
    return doPost('common/getBankConfig.do', {}).then(function (result) {
        if (!!result && !!result.bankInfo) {
            let bankconfig = result.bankInfo[0];
            bankconfig.iconImg = './resource/img/bankicon/' + bankconfig.iconId + '.png';//iconimg
            return bankconfig;
        }
    });
}


/**
 * 查询银行网点信息（查询web后台json文件）
 */
export function getBankAddress() {
    return doPost('common/getBankAddress.do', {}).then(function (result) {
        if (!!result && result.data) {
            let bankAddress = result.data;
            return bankAddress;
        }
    });
}

/**

/**
 * 获取跳转url配置
 */
export function getUrlConfig() {
    var param = {};
    return doPost('common/getUrlConfig.do', param, null, true).then(function (result) {
        if (!!result) {
            //商旅通去预定的url从zk中获取全路径, result.appIDList封装了审批和支付审批的appID
            let urlConfig = result;
            domainMap.forEach(function (item) {
                if (item.id != 'travelURL') {
                    urlConfig[item.id] = result.pageSubPath[item.zkId] + item.name;
                }
            })
            // urlConfig["yqturl"] = "http://10.2.25.111:8103/bisApproval";
            // urlConfig["wealthurl"] = "http://10.2.25.111:8111/wealth";
            return urlConfig;
        }
    });
}

/**
 * 获取配置参数
 */
export function getParam(paramName) {
    return cryptPost('common/getParam.do', { paramName: paramName }, null, true).then(function (result) {
        if (!!result) {
            let paramJo = result;
            return paramJo;
        }
    });
}

/**
 * 获取appID
 */
export function getAppID(paramName) {
    //参数为数组转成的string
    return cryptPost('common/getAppID.do', { paramName: paramName }, null, true).then(function (result) {
        if (!!result) {
            let paramJo = result;
            return paramJo;
        }
    });
}

/*
 * 查询银行网点信息（查询web后台json文件）
 */
export function getToken() {
    return doPost('openAccount/getToken.do').then(function (result) {
        if (!!result && result.data) {
            return result.data;
        }
    });
}
/**
 * 打开app登录界面
 */
export function openLonginPage() {
    var openLonginJson = {
        action: 'IntentAction_LoginPage',
        dataList: []
    };
    OpenActionFunction(openLonginJson).then(function (data) {
        //do something
    });
}

/**
 * 压缩数据
 */
export function zip(str) {
    var binaryString = pako.gzip(str, { to: 'string' });
    return btoa(binaryString);
}

/**
 * 解压数据
 */
export function unzip(b64Data) {
    var strData = atob(b64Data);
    // Convert binary string to character-number array
    var charData = strData.split('').map(function (x) { return x.charCodeAt(0); });
    // Turn number array into byte-array
    var binData = new Uint8Array(charData);
    // // unzip
    var data = pako.inflate(binData);
    // Convert gunzipped byteArray back to ascii string:
    strData = String.fromCharCode.apply(null, new Uint16Array(data));
    return strData;
}

/**
 * 生产随机数 函数
 */
export function GUID() {
    this.date = new Date();   /* 判断是否初始化过，如果初始化过以下代码，则以下代码将不再执行，实际中只执行一次 */
    if (typeof this.newGUID != 'function') {   /* 生成GUID码 */
        GUID.prototype.newGUID = function () {
            this.date = new Date();
            var guidStr = '';
            var sexadecimalDate = this.hexadecimal(this.getGUIDDate(), 16);
            var sexadecimalTime = this.hexadecimal(this.getGUIDTime(), 16);
            for (var i = 0; i < 9; i++) {
                guidStr += Math.floor(Math.random() * 16).toString(16);
            }
            guidStr += sexadecimalDate;
            guidStr += sexadecimalTime;
            while (guidStr.length < 32) {
                guidStr += Math.floor(Math.random() * 16).toString(16);
            }
            return this.formatGUID(guidStr);
        }
        /* * 功能：获取当前日期的GUID格式，即8位数的日期：19700101 * 返回值：返回GUID日期格式的字条串 */
        GUID.prototype.getGUIDDate = function () {
            return this.date.getFullYear() + this.addZero(this.date.getMonth() + 1) + this.addZero(this.date.getDay());
        }
        /* * 功能：获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933 * 返回值：返回GUID日期格式的字条串 */
        GUID.prototype.getGUIDTime = function () {
            return this.addZero(this.date.getHours()) + this.addZero(this.date.getMinutes()) + this.addZero(this.date.getSeconds()) + this.addZero(parseInt(this.date.getMilliseconds() / 10));
        }
        /* * 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现 * 参数: 参数表示准备再前面添加0的数字或可以转换成数字的字符串 * 返回值: 如果符合条件，返回添加0后的字条串类型，否则返回自身的字符串 */
        GUID.prototype.addZero = function (num) {
            if (Number(num).toString() != 'NaN' && num >= 0 && num < 10) {
                return '0' + Math.floor(num);
            } else {
                return num.toString();
            }
        }
        /*  * 功能：将y进制的数值，转换为x进制的数值 * 参数：第1个参数表示欲转换的数值；第2个参数表示欲转换的进制；第3个参数可选，表示当前的进制数，如不写则为10 * 返回值：返回转换后的字符串 */GUID.prototype.hexadecimal = function (num, x, y) {
            if (y != undefined) { return parseInt(num.toString(), y).toString(x); }
            else { return parseInt(num.toString()).toString(x); }
        }
        /* * 功能：格式化32位的字符串为GUID模式的字符串 * 参数：第1个参数表示32位的字符串 * 返回值：标准GUID格式的字符串 */
        GUID.prototype.formatGUID = function (guidStr) {
            var str1 = guidStr.slice(0, 8) + '-', str2 = guidStr.slice(8, 12) + '-', str3 = guidStr.slice(12, 16) + '-', str4 = guidStr.slice(16, 20) + '-', str5 = guidStr.slice(20);
            return str1 + str2 + str3 + str4 + str5;
        }
    }
}


/*
 * 给NativeInfo对象赋值 
 */
export function getNativeInfo(nativeInfo) {
    return new Promise(function (res, rej) {
        if (nativeInfo.UAId) {
            res(nativeInfo);
        } else {
            return GetUserInfoFunction().then(function (uaData) {
                if (!!uaData) {
                    nativeInfo.UAId = uaData.UAId;
                    nativeInfo.cpyId = uaData.cpyId;
                    nativeInfo.UAName = uaData.uName;
                    nativeInfo.orgId = uaData.orgId;
                    nativeInfo.orgName = uaData.orgName;
                    nativeInfo.uPhone = uaData.uPhone;
                    if (!!uaData.deviceId) {
                        nativeInfo.deviceId = uaData.deviceId;
                    }
                    if (!!uaData.token) {
                        nativeInfo.token = JSON.parse(uaData.token);
                    }
                    res(nativeInfo);
                }
            });
        }
    })
}
/******************************自定义方法 end**************************************/


/***************************VUE过滤器 start**************************************/

/**
 * 图标显示，通过iconId显示图标
 * 对图片路径进行格式化
 */
Vue.filter('imgUrl', function (value) {
    if (!value) return '';
    value = "resource/img/" + value + ".png";
    return value;
});

/**
 * 对金额格式化
 */
Vue.filter('moneyFrt', function (value, frtZeroFlag) {
    if (!value || 0 == value) {
        if (frtZeroFlag) {
            return '0.00元'
        }
        return '0元';
    }

    if (-1 == value) return '无金额';
    return moneyStringFixTwo(value);
});

/**
 * 对有单位数据格式化
 * @param pointlength 组件中小数点的长度
 * @param pointlength 单位
 */
Vue.filter('unitsFrt', function (value, unit, pointlength) {
    if (pointlength == 2) {
        value = stringFixTwoWithType(value, '');
    }
    if (pointlength == 1) {
        value = value / 10;
    }
    if (!!unit) {
        if (!value) return '0' + unit;
        return value + unit;
    } else {
        return value;
    }
});

/**
 * 数据格式化
 * @param str 替换字符
 * @param begin 开始位置
 * @param end 结束位置
 */
Vue.filter('replaceChar', function (value, str, begin, end) {
    var value = value + '';
    var fstStr = value.substring(0, begin);
    var scdStr = value.substring(begin, end);
    var lstStr = value.substring(end, value.length);
    return fstStr + scdStr.replace(/\w/g, str) + lstStr;
});

/**
 * 对有单选框数据转换
 */
Vue.filter('radioFrt', function (value, radioList) {
    var text = '';
    if (!value && 0 != value) return text;
    var reg = new RegExp("^[0-9]*$");
    if (reg.test(value)) {//数字
        if (!!radioList) {
            radioList.forEach(function (item) {
                if (value == item.id) {
                    text = item.text;
                }
            });
        }
    } else {//非数字  兼容历史数据有“是”“否”的表单
        text = value;
    }
    return text;
});

/**
 * 对有下拉库框数据转换
 */
Vue.filter('selectFrt', function (value, selectList, textFlag) {
    var text = '';
    if (textFlag) return value; //如果textFlag为true，则说明下拉框的这个值不需要再处理，直接返回value
    if (!value && 0 != value) return text;
    if (!!selectList) {
        selectList.forEach(function (item) {
            //{"title":"定期存款","dispValue":"定期存款","value":1}
            if (value == item.value) {
                text = item.dispValue;
            }
        });
    }
    return text;
});


/**
 * 对时间格式的转换
 */
Vue.filter('dateFrt', function (value, formatDate) {
    var text = '';
    if (formatDate.serverFormat == 'timestamp') {
        var dateVelue = Number(value);
        if (isNaN(dateVelue)) {
            text = value;//兼容差旅二级明细中的历史数据是字符串“2017/12/25”的问题
        } else {
            text = new Date(dateVelue * 1000).format(formatDate.format);
        }
    } else if (formatDate.serverFormat == 'YYYYMMDD') {
        var dataStr = value.substring(0, 4) + '-' + value.substring(4, 6) + '-' + value.substring(6, 8);
        text = new Date(dataStr).format(formatDate.format);
    } else {
        var dateVelue = Number(value);
        if (isNaN(dateVelue)) {
            text = value;//兼容差旅二级明细中的历史数据是字符串“2017/12/25”的问题
        } else {
            text = new Date(dateVelue * 1000).format(formatDate);
        }
    }
    return text;
});
/**
 * 计算字符串的真实长度汉字1，字符0.5，向上取整
 * str  传入的字符串
 */
Vue.filter('strTrueLength', function (str) {
    var re = /[\u4E00-\u9FA5]/g; //中文字符的正则
    var tempL = str.length;
    var tempCL = 0;
    if ('' == str.match(re) || null == str.match(re)) {
        tempCL = 0;
    } else {
        tempCL = str.match(re).length;
    }
    var tempTL = Math.ceil((tempL - tempCL) * 0.5 + tempCL)
    return tempTL;//返回字符串真实长度汉字1，字符0.5，向上取整
});

/**
 * 银行名称，账号，icon组合
 */
Vue.filter('bankFrt', function (account) {
    var bankType = getStorage("bankType") || 1; //默认赋值
    return (bankMap[bankType] || {}).name + "(" + account.slice(-4) + ")";
});

Vue.filter('iconFrt', function (account) {
    var bankType = getStorage("bankType") || 1;//默认赋值
    return "resource/img/tempicon/" + (bankMap[bankType] || {}).icon;
});


/***************************VUE过滤器 end**************************************/

/*****************************清理缓存，后续使用js/css版本号处理 start***************/
// $(document).ready(function () {
//  var url = "./resource/xml/cacheVersion.xml";
//  $.ajax({
//      url: url,
//      datatype: "xml",
//      type: "GET",
//      cache: false,//不缓存
//      success: function (data) {
//          var cacheVersion = $(data).find("cacheVersion").text();
//          //如缓存版本号与本地存储版本号不一致，调用APP清除webview缓存接口
//          //如果localStorge中的cacheVersion不存在，则用调用APP清除webview缓存接口
//          var localVersion = getStorage(["cacheVersionOA"], false); //从localStorage中取数据
//          var localVersionStr = localVersion; //oa存取缓存方式不同，oa取出是对象，YQT取出是value
//          if (cacheVersion != localVersionStr) {
//              ClearWebViewCache();
//          }
//          var cacheVersionOA = {};
//          cacheVersionOA["cacheVersionOA"] = cacheVersion;
//          setStorage("cacheVersionOA", cacheVersion);//oa存取缓存方式不同，oa取出是对象，YQT取出是value
//      },
//      error: function () {
//          //          tipsBox("网络繁忙，请稍后重试");   //为了提供更好的用户体验 暂时屏蔽 yg 2016年12月15日16:52:40
//      }
//
//  })

//获取mstp配置
// });
/*****************************清理缓存，后续使用js/css版本号处理 end***************/

/***************************VUE自定义函数 start********************************/
/**
 * 使用blob对象来生成图片的预览
 * @param el <img>标签dom
 * @param binding 绑定数据，使用value获取值
 */
Vue.directive('imgfid', function (el, binding) {
    var imgBlob = undefined;
    var blob = binding.value;
    if (blob != undefined && blob != "") {
        try {
            imgBlob = new Blob([blob], { type: 'image/png' });
        } catch (e) {
            window.BlobBuilder = window.BlobBuilder ||
                window.WebKitBlobBuilder ||
                window.MozBlobBuilder ||
                window.MSBlobBuilder;
            if (e.name == 'TypeError' && window.BlobBuilder) {
                var bb = new BlobBuilder();
                bb.append(blob)
                imgBlob = bb.getBlob("image/png");
            }
            else if (e.name == "InvalidStateError") {
                imgBlob = new Blob([blob], { type: "image/png" });
            }
        }
        var reader = new FileReader();
        reader.readAsDataURL(imgBlob);
        reader.onload = function () {
            el.setAttribute('src', this.result || defaultImgBlob);
        }
    }
});
/***************************VUE自定义函数 end********************************/

/**
 * 对标签进行转义处理
 */
export function htmlEncodeByRegExp(str) {
    var s = "";
    str = str + "";
    if (str.length == 0) return "";
    s = str.replaceAll(/&/g, "&amp;");
    s = s.replaceAll(/</g, "&lt;");
    s = s.replaceAll(/>/g, "&gt;");
    s = s.replaceAll(/ /g, "&nbsp;");
    s = s.replaceAll(/\'/g, "&#39;");
    s = s.replaceAll(/\"/g, "&quot;");

    return s;
}