/**
 * DebitCardHandler 支付相关方法
 */
import { PopMenuFunction } from '../../lib/common/SnJsBridge.js';
import { cryptPost,nativeInfo } from '../../lib/common/base.js';
import { getStorage,setStorage,deleteStorage,pad,transArrToStr,genArrValueByKey } from '../../lib/common/extend.js';
import DSSHandler from '../../lib/DSSHandler.js';//密码器处理   在票据相关业务里面
import PayHandler from '../../lib/PayHandler.js';
import {billTypeMap} from "../../lib/ConstantData";
import {showToast} from "../../lib/common/extend";
//支付相关处理

var DebitCardHandler = function(){
    this.bisDataKey = '';//存bisData的key
}

DebitCardHandler.prototype = {

	init:function(param){
		var _this = this;
		
	},
	/**
	 * 生成校验数据 主要针对密码器签名与验签
	 * @param {Object} dataSign  服务器获取的签名数据
	 * @param {Object} checkSignData  生成验签数据的源数据
	 */
	genVerifyData:function(dataSign,checkSignData){
        const verifyData = checkSignData || {};
        verifyData.dataSign = dataSign;
        verifyData.qfDate = checkSignData.date;
        verifyData.payeeaccount = checkSignData.payeeAccount;//兼容payeeaccount
        verifyData.payeraccount = checkSignData.payerAccount;//兼容payeraccount
        verifyData.transactionSN = checkSignData.transactionSN+'';//sn转string
        return verifyData;
	},
	/**
	 * 校验  数据提交前校验
	 * @param {Object} param   //验证签名所需的源数据
	 * @param {Object} flowId  
	 */
	verification:function(param,flowId,genFlowData,vm){
		var _this = this;
		var loginType = 1;
//		return DSSHandler.checkRight(loginType).then(function(res){ //①判断是否有密码器权限
//			if(0==res.code){//成功 有密码器使用权限
//				return _this.checkSign(param,flowId,genFlowData);//②获取签名
//			}
//		});
		// 开始转圈
		vm.showLoad = true;
		vm.loadingText = "安全校验中...";
		return _this.checkSign(param,flowId,genFlowData).then(function(data){//①获取签名
			if(data){
				if(!!vm&&!!vm.showLoad){
					vm.showLoad = false;
                    vm.loadingText = "确认授权";
				}
				return DSSHandler.checkRight(loginType).then(function(result){ //②判断是否有密码器权限
					if(0==result.code){//成功 有密码器使用权限
						//③签名校验 结算卡
						return DSSHandler.TPayVerifyFunction('CalculatePasswordFunction',data).then(function(res){
				            if(0==res.ret){
				                console.log("verifySign success");
				                res.signData = data;
				                return res;
				            }else{//密码器验签失败，提示错误信息
				                console.log("verifySign fail");
				                showToast(res.responseData, 'middle');
				                return false;
				            }
						});
					}else{
						return false;
					}
				});
			}
		});
	},
	/**
	 * 获取签名并且校验
	 * @param {Object} param
	 */
	checkSign:function(param,flowId,genFlowData){
		var _this = this;
		//var payInfo = {content : param}; //验签需要传payInfo，java端处理
		var bisData = {uaIdList : genFlowData.uaIdList,cpyId : genFlowData.cpyId,bisId: genFlowData.bisData.bisId};//校验业务权限
		return DSSHandler.getSign('approval/getSign.do',{payInfo:param,flowId:flowId,bisData:bisData}).then(function(data){
			var signData = _this.genVerifyData(data.dataSign,data.checkSignData); //生成验签数据
			//③签名校验 结算卡
//			return DSSHandler.TPayVerifyFunction('CalculatePasswordFunction',signData).then(function(res){
//              if(0==res.ret){
//                  console.log("verifySign success");
//                  res.signData = signData;
//                  return res;
//              }else{//密码器验签失败，提示错误信息
//                  console.log("verifySign fail");
//                  showToast(res.responseData, 'middle');
//                  return false;
//              }
//			});
			return signData;
		});
	},
	/**
	 * 获取确认页信息
	 * @param {Object} bisData 业务数据 在确认页面显示数据
	 */
	getConfirmPage:function(bisData){
		return cryptPost('getConfirmPage.do',bisData);//返回成功后 显示确认页面
	},
	/**
	 * 点击确认页面
	 * @param {Object} data  最后审批与页面业务处理数据
	 */
	confirmOk:function(data){
		cryptPost('confirmOk.do',data).then(function(res){
			//显示成功或者错误页面
		})
	},
	/*
	* 获取工资卡
	* 
	* */
	getSalaryList:function(UAId){
		//获取工资卡
		return cryptPost('approval/getSalaryCardInfo.do',{choosedUAId:UAId});
	},
	/*
	* 获取付方账号
	* */
	getPubAcc:function(){
		return PayHandler.getPubAcc();
	},
	/**
	 * 保存bisData信息
	 * @param {Object} data       存储信息
	 * @param {Object} flowId     表单Id
	 * @param {Object} UAId       人员Id
	 * @param {Object} cpyId      公司Id
	 */
	saveBisData:function(data,flowId,UAId,cpyId){
		var uaid = UAId  || nativeInfo.UAId;
		var cpyid =  cpyId  || nativeInfo.cpyId;
		console.log('setStorage:key='+this.bisData+';data='+JSON.stringify(data||{}));
		this.bisDataKey = 'debitCardBisData'+'UAId' + uaid + 'cpyId' + cpyid + 'flowId'+flowId;
		setStorage(this.bisDataKey,JSON.stringify(data||{}));
		
	},
	/**
	 * 确认页获取表单信息
	 * @param {Object} flowId
	 * @param {Object} UAId       人员Id
	 * @param {Object} cpyId
	 */
	getBisData:function(flowId,UAId,cpyId){
		
		var uaid = UAId  || nativeInfo.UAId;
		var cpyid =  cpyId  || nativeInfo.cpyId;
		this.bisDataKey = 'debitCardBisData'+'UAId' + uaid + 'cpyId' + cpyid + 'flowId'+flowId;
		if(getStorage(this.bisDataKey)){
			var data = JSON.parse(getStorage(this.bisDataKey))
			return data;
		}
		return null;
	},
	/**
	 * 删除确认页面里面的缓存数据
	 * @param {Object} flowId
	 */
	delBisData:function(flowId,UAId,cpyId) {
		var uaid = UAId  || nativeInfo.UAId;
		var cpyid =  cpyId  || nativeInfo.cpyId;
		this.bisDataKey = 'debitCardBisData'+'UAId' + uaid + 'cpyId' + cpyid + 'flowId'+flowId;
		deleteStorage(this.bisDataKey);
	},
    /**
     * 获取确认页面的数据
     */
    getConfirmDetail:function(UAId,cpyId,genFlowData,flowId,bisData){
        return cryptPost('approval/queryDetermineInfo.do', {
            'UAId':UAId,
            'cpyId':cpyId,
            'templetId':genFlowData.templetId,
            'flowId':flowId,
            'bisData': bisData,
            'content':genFlowData.content
        });
    },
	
}

export default new DebitCardHandler();


/**
 * 对结算卡状态格式化
 */
Vue.filter('debitStatus', function(status) {
   /* 0 未授权
    1 授权成功
    2 授权失败
    3 已使用完余额
    4 已失效*/
    const debitStatusMap ={0:'处理中',1:'授权成功',2:'授权失败',3:'授权成功',4:'授权成功'};
	return debitStatusMap[status];
});
/**
 * 对时间格式的转换
 */
Vue.filter('transDate', function(value,formatDate) {
	var transDate = new Date(value*1000).format(formatDate||'yyyy-MM-dd HH:mm');
	//var transDate = value + formatDate；
    return transDate;
});