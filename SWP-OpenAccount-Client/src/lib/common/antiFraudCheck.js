export var _saber = null;
export var antiFraudCheck = function(token,extParams,call){
    _saber = {
        partnerId: 'lzccb',
        tokenKey: token,
        callback:dfCallback,
        extParams:extParams,
        // appId:'',
        // extParans:{},
        // retryObj:{}
    } 

    let env = 'dfst';                         //判断开发环境
    let createScript = document.createElement('script');                                    //创建script标签
    let http = 'https:' == document.location.protocol ? 'https://' : 'http://'              //获取http or https
    let date = (new Date().getTime()/3600000).toFixed(0)                                    //时间截取
    createScript.async = true                                                               //async
    createScript.id = '_saber'                                                              //id
    createScript.src=`${http}${env}.baiqishi.com/static/webdf/saber.js?t=${date}`           //地址请求
    let getScript = document.getElementsByTagName('script')[0]                              //获取script标签
    let getDomScript = document.getElementById('_saber')  
    if(!getDomScript){       
        getScript.parentNode.insertBefore(createScript,getScript)                           //添加到页面上
    }
}
/**
 * 回调方法
 */
function dfCallback(call){
    typeof call == "function" && call()
}
