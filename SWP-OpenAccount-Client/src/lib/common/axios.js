/*
 * @Description: 
 * @Author: ZhangChuan
 * @Date: 2020-05-06 11:09:22
 * @LastEditors: ZhangChuan
 * @LastEditTime: 2020-05-07 11:14:42
 */

// 使用方法
// axiosServer.call(this,{method:'post',url:'/bankConfig',type:'urlen'})

import axios from 'axios'
import qs from 'qs'
import {
    showToast
} from "sslib/common/extend";
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
    100002: "验证码已过期",
    34000004: "账户密码校验失败",
    34000005: "用户未认证，请认证后再执行开户操作",
    34000006: "验证码校验失败",
    34000007: "用户认证中，请稍后再试",
    12000001: "未找到用户认证信息",
    72000002: "人脸对比不通过",
    72000003: "获取三方查询系统工作时间异常",
    72000004: "当前操作不在工作时间段，请稍后重试",
    72000006: "申请Token失败",
    72000007: "组装Ticket错误",
    72000008: "ocr识别身份证正面失败",
    72000009: "ocr识别身份证国徽面失败",
    72000010: "上传身份信息失败",
    72000011: "活性检测比对失败",
    72000012: "上传活性检测图片失败",
    72000013: "缓存身份信息失败",
    72000014: "证件信息已过期",
    72000015: "时间格式转化错误",
    680002: "电表类型不匹配",
    35012: "账户认证未通过",
    12000002: "证件信息已过期",
    340020: "该银行卡已被添加，请勿重复添加",
    421003: "验签失败"
};

// function errorState(response) {
//     console.log(response, this, 666)

//     if (response && response.code) {
//         let desc = ERROR_MAP[response.code];
//         if (response.code === 600003 || response.code === 36006) { //银行返回的统一错误码
//             let list = response.rdesc.split("[600003]");
//             desc = list[list.length - 1].trim();
//         } else if (response.code === 90009) { //腾讯返回错误码
//             desc = response.rdesc;
//         } else if (isEmptyStr(desc)) {
//             desc = "抱歉，网络不给力，请您稍后重试!";
//         }
//         showToast(desc)
//     }
// }
axios.interceptors.response.use(response=>{
    return response;
},error=>{
    if (error && error.response) {
        let response=error.response;
        let desc = ERROR_MAP[response.code];
        if (response.code === 600003 || response.code === 36006) { //银行返回的统一错误码
            let list = response.rdesc.split("[600003]");
            desc = list[list.length - 1].trim();
        } else if (response.code === 90009) { //腾讯返回错误码
            desc = response.rdesc;
        } else if (isEmptyStr(desc)) {
            desc = "抱歉，网络不给力，请您稍后重试!";
        }
        return Promise.reject(desc);
    }
 
})
const axiosServer = function (opts, data) {
   
    // 公共参数
    console.log(this, 4444)
    let Public = {
        token: ''
    }
    let newData;
    if(opts.type=='json'){
        newData=Object.assign(Public, data);
    }else if(opts.type=='form'){
        newData=data;
    }else if(opts.type=='urlen'){
        newData=qs.stringify(Object.assign(Public, data))
    }
    let httpDefaultOpts = {
        method: opts.method,
        baseUrl: textUrl,
        url: opts.url,
        timeout: 10000,
        params: Object.assign(Public, data),
        data:newData ,
        headers: opts.method == 'get' ? {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        } : {
            'X-Requested-With': 'XMLHttpRequest',
            "Accept": "application/json",
            // "Content-Type": "application/json; charset=UTF-8"
        }
    }
    if (opts.method == 'get') {
        delete httpDefaultOpts.data
    } else {
        delete httpDefaultOpts.params
    }
    return new Promise((resolve, reject) => {
        axios(httpDefaultOpts).then(
            (res) => {
                resolve(res.data)
            }
        ).catch(
            (response) => {
                // errorState.call(this, response);
                showToast(response)
            }
        )
    })
}
export default axiosServer