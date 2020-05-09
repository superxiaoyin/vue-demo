/**
 * 支付相关方法
 */
import { verifySignFunction } from './common/SnJsBridge.js';
import { cryptPost } from './common/base.js';
import {transArrToStr,moneyStringFixTwo,showToast} from './common/extend.js';
import {PayTypeData,billTypeMap,transObjMap,transMethodMap,CheckDevTypeData} from './ConstantData.js';
import DSSHandler from './DSSHandler.js';
/**
 * 获取签名
 */
const genSignMap = {
	[PayTypeData.TRANSFER_TYPE] : {url:'yqt/pay/getSign.do'},//转账
	[PayTypeData.SALARY_TYPE] : {url:'yqt/pay/getSign.do'},//代发工资 后续会删除
	[PayTypeData.WEALTH_BUT_TYPE] : {url:'yqt/pay/getSign.do'},//财富管理 购买 后续会删除
	[PayTypeData.WEALTH_REDEEM_TYPE] : {url:'yqt/pay/getSign.do'},//财富管理 赎回 后续会删除
	[PayTypeData.BALANCE_TYPE] : {url:'yqt/pay/getSign.do'},//银企对账 后续会删除
	[PayTypeData.DSS_TYPE] : {url:'yqt/pay/getSign4Bill.do'},//票据
	[PayTypeData.DSS_TEMPLET_TYPE] : {url:'yqt/pay/getSign4Bill.do'},//密码器模板
	[PayTypeData.CREDCARD_TYPE] : {url:'yqt/pay/credcard_getSign.do'},//结算卡
	[PayTypeData.DIGITALCHECK_TYPE] : {url:'yqt/pay/digital_getSign.do'},//数字支票
	[PayTypeData.BATCHTRANSFER_TYPE] : {url:'yqt/pay/getSign.do'}//批量转账
};


/**
 * 调用app接口验签
 */
const verifySignMap = {
	[PayTypeData.TRANSFER_TYPE] : {fnt:'TPayVerifyFunction'},//转账
	[PayTypeData.SALARY_TYPE] : {fnt:'TPayVerifyFunction'},//代发工资 后续会删除
	[PayTypeData.WEALTH_BUT_TYPE] : {fnt:'TPayVerifyFunction'},//后续会删除
	[PayTypeData.WEALTH_REDEEM_TYPE] : {fnt:'TPayVerifyFunction'},//后续会删除
	[PayTypeData.BALANCE_TYPE] : {fnt:'TPayVerifyFunction'},//后续会删除
	/*
	[PayTypeData.DSS_TYPE] : {fnt:'TPayPasswordFunction'},//票据
	[PayTypeData.CREDCARD_TYPE] : {fnt:'TPayPasswordFunction'},//结算卡
	[PayTypeData.DIGITALCHECK_TYPE] : {fnt:'TPayPasswordFunction'},//数字支票
	*/
	[PayTypeData.DSS_TYPE] : {fnt:'CalculatePasswordFunction'},//票据
	[PayTypeData.DSS_TEMPLET_TYPE] : {fnt:'CalculatePasswordFunction'},//密码器模板
	[PayTypeData.CREDCARD_TYPE] : {fnt:'CalculatePasswordFunction'},//结算卡
	[PayTypeData.DIGITALCHECK_TYPE] : {fnt:'CalculatePasswordFunction'},//数字支票
	[PayTypeData.BATCHTRANSFER_TYPE] : {fnt:'TPayVerifyFunction'}//批量转账
};

/**
 * 转账或者签发
 */
const endFlowMap = {
	[PayTypeData.TRANSFER_TYPE] : {url:'yqt/pay/transfer.do'},//转账
	[PayTypeData.SALARY_TYPE] : {url:'yqt/pay/sendSalary.do'},//后续会删除  创建工资流程
	[PayTypeData.WEALTH_BUT_TYPE] : {url:'yqt/wealth/buy.do'},//后续会删除  购买理财
	[PayTypeData.WEALTH_REDEEM_TYPE] : {url:'yqt/wealth/redeem.do'},//后续会删除 赎回理财
	[PayTypeData.BALANCE_TYPE] : {url:'yqt/balance/balanceAcc.do'},//后续会删除 对账
	[PayTypeData.DSS_TYPE] : {url:'yqt/pay/billPayment.do'},//票据支付
	[PayTypeData.DSS_TEMPLET_TYPE] : {url:'yqt/pay/billPayment.do'},//密码器模板
	[PayTypeData.CREDCARD_TYPE] : {url:'yqt/pay/credcard_issue.do'},//结算卡授权
	[PayTypeData.DIGITALCHECK_TYPE] : {url:'yqt/pay/digital_issue.do'},//数字支票签发授权
	[PayTypeData.BATCHTRANSFER_TYPE] : {url:'yqt/pay/batchTransfer.do'}//批量转账
};

/**
 * 密码器界面显示数据
 */
const dssBbShowBeanMap = {
	defaultDssShow : [//默认展示信息
					{name:"收款人姓名:",value:'applyName'},
					{name:'收款人账号:',value:'payeeaccount'},
					{name:'金额:',value:'amount',type:'money'}],
	[PayTypeData.WEALTH_BUT_TYPE] : [//财富购买
					{name:"产品名称:",value:'pName'},
					{name:'付方账号:',value:'payeraccount'},
	                {name:'金额:',value:'amount',type:'money'}],
	[PayTypeData.WEALTH_REDEEM_TYPE] : [//财富赎回
					{name:"产品名称:",value:'pName'},
					{name:'入账账号:',value:'payeraccount'},
	                {name:'金额:',value:'amount',type:'money'}],
	[PayTypeData.BALANCE_TYPE] : [//银企对账
					{name:"账期:",value:'payDate',type:'date',frt:'yyyy-MM'},
	                {name:'对账账号:',value:'payeraccount'},
	                {name:'对账结果:',value:'statusStr'}],
	[PayTypeData.SALARY_TYPE] : [//代发工资
					{name:"发放月份:",value:'sendDate',type:'date',frt:'yyyy-MM'},
	                {name:'付方账号:',value:'payeraccount'},
	                {name:'发放金额:',value:'amount',type:'money'}],
	[PayTypeData.BATCHTRANSFER_TYPE] : [//批量转账
					{name:'付方账号:',value:'payeraccount'},
					{name:'转账金额:',value:'amount',type:'money'}]
};

/**
 * 支付成功后显示字段
 */
const successTitleMap = {
	[PayTypeData.TRANSFER_TYPE] : {sucTitle:'支付成功',flowTitle:'审批单据号：'},//转账
	[PayTypeData.SALARY_TYPE] : {sucTitle:'交易成功',flowTitle:'审批单据号：'},//代发工资
	[PayTypeData.WEALTH_BUT_TYPE] : {sucTitle:'购买成功',flowTitle:'财富流水号：'},//理财购买
	[PayTypeData.WEALTH_REDEEM_TYPE] : {sucTitle:'赎回成功',flowTitle:'财富流水号'},//理财赎回
	[PayTypeData.BALANCE_TYPE] : {sucTitle:'对账成功',flowTitle:'审批单据号：'},//银企对账
	[PayTypeData.DSS_TYPE] : {sucTitle:'支付成功',flowTitle:'审批单据号：'},//票据
	[PayTypeData.CREDCARD_TYPE] : {sucTitle:'授权成功',flowTitle:'支付凭证号：'},//修改为凭证号
	[PayTypeData.DIGITALCHECK_TYPE] : {sucTitle:'签发成功',flowTitle:'数字支票号：'},//数字支票
	[PayTypeData.BATCHTRANSFER_TYPE] : {sucTitle:'支付成功',flowTitle:'审批单据号：'}//批量转账
};

/**
 * 确认按钮显示字段
 */
const confirmButtonMap = {
	[PayTypeData.TRANSFER_TYPE] : {confirmText:'确认付款'},
	[PayTypeData.SALARY_TYPE] : {confirmText:'确认付款'},
	[PayTypeData.WEALTH_BUT_TYPE] : {confirmText:'确认付款'},
	[PayTypeData.WEALTH_REDEEM_TYPE] : {confirmText:'确认付款'},
	[PayTypeData.BALANCE_TYPE] : {confirmText:'确认对账'},
	[PayTypeData.DSS_TYPE] : {confirmText:'确认付款'},
	[PayTypeData.CREDCARD_TYPE] : {confirmText:'确认付款'},
	[PayTypeData.DIGITALCHECK_TYPE] : {confirmText:'确认付款'}
};

/**
 * 金额字段
 */
const amountFieldMap = {
	[PayTypeData.TRANSFER_TYPE] : {fieldId:'amount'},
	[PayTypeData.SALARY_TYPE] : {fieldId:'amount'},
	[PayTypeData.WEALTH_BUT_TYPE] : {fieldId:'amount'},
	[PayTypeData.WEALTH_REDEEM_TYPE] : {fieldId:'amount'},
	[PayTypeData.BALANCE_TYPE] : {fieldId:'bankRemain'},
	[PayTypeData.DSS_TYPE] : {fieldId:'amount'},
	[PayTypeData.CREDCARD_TYPE] : {fieldId:'amount'},
	[PayTypeData.DIGITALCHECK_TYPE] : {fieldId:'amount'}
};
/**
 * 生成转账汇款签名
 * //修改account为amount,xiaowe2017-12-20
 */

const checkSignArr = ["payeeaccount", "payeraccount", "transObj", "transMethod","amount"];
const sourceSignArr= ["payType", "payeeaccount", "payeraccount", "payerPW", "amount", "transObj","transMethod"];

/**
 * 支付相关函数
 */
var PayHandler = function(){
	this.successTitleMap = successTitleMap;
	this.confirmButtonMap = confirmButtonMap;
}

PayHandler.prototype = {
	/**
	 * 生成流程  包括    approve--审批  applyandapprove--自审自批
	 * @param {Object} url
	 * @param {Object} param
	 * @param {Object} payType
	 */
	genFlow:function(url,param,payType,vm){
		var url = url || 'yqt/pay/applyAndApprove.do';
		return cryptPost(url,param,vm);
	},
	/**
	 * 生成获取签名数据   templetId与flowId需要在vm变量中
	 * @param {Object} flowData   流程生成后返回的数据
	 * @param {Object} payType    支付类型
	 * @param {Object} vm         this对象
	 */
	genSignData:function(flowData,payType,vm){
		var _this = vm;
		var data = {};
		if((payType==PayTypeData.DIGITALCHECK_TYPE)
			||(payType==PayTypeData.CREDCARD_TYPE)){//数字支票与结算卡获取签名
			data = {"payeraccount":vm.payeraccount[0],"billtype":billTypeMap[payType].value,"templetId":vm.templetId};
		}else if(payType==PayTypeData.DSS_TYPE){//票据获取签名
			data.payInfo = {'templetId':vm.templetId,'content':vm.msgValue};
		}else if(payType==PayTypeData.DSS_TEMPLET_TYPE){//密码器模板签名
			_this.content.flowId = flowData.flowId || _this.flowId;
			_this.content.date = this.content.qfDate;
			var content = JSON.parse(JSON.stringify(_this.content));
			content.billtype = 53<content.billtype?53:content.billtype;//判断支付类型是否大于53，如果大于53则传递53给服务器
			data.payInfo = {'templetId':templetId,'content':content};
		}
		data.flowId = flowData.flowId||vm.flowId;
		return data;
	},
	/**
	 * 调用服务器生成签名
	 * @param {Object} url
	 * @param {Object} param
	 * @param {Object} payType
	 */
	genSign:function(param,payType,vm){
		return cryptPost(genSignMap[payType].url,param,vm);
	},
	/**
	 * 生成验签数据  不同类型的验签数据不同
	 * @param {Object} dataSign
	 * @param {Object} payType
	 * @param {Object} vm
	 */
	genVerifyData:function(dataSign,payType,vm){
		var _this = vm;
		var transferFlag = (
			(payType==PayTypeData.TRANSFER_TYPE)//转账
			||(payType==PayTypeData.SALARY_TYPE)//代发工资
			||(payType==PayTypeData.WEALTH_BUT_TYPE)//理财购买
			||(payType==PayTypeData.WEALTH_REDEEM_TYPE)//理财赎回
			||(payType==PayTypeData.BALANCE_TYPE)//银企对账
			||(payType==PayTypeData.BATCHTRANSFER_TYPE));//批准转账
			
		if(transferFlag){//转账相关
			var noPayTypeFlag = (
				(payType==PayTypeData.SALARY_TYPE)//代发工资
				||(payType==PayTypeData.WEALTH_BUT_TYPE)//理财购买
				||(payType==PayTypeData.WEALTH_REDEEM_TYPE)//理财赎回
				||(payType==PayTypeData.BALANCE_TYPE));//银企对账
				
			if(noPayTypeFlag){//没有转账类型，默认为0
				_this.msgValue.payType =  _this.msgValue.transObj = _this.msgValue.transMethod = 0;
				_this.msgValue.payeeaccount = '0';
			}else if(payType==PayTypeData.BATCHTRANSFER_TYPE){//批量转账
				_this.msgValue.payType = 0;
				_this.msgValue.transObj = transObjMap.defaultObj.id;//默认为个人
				_this.msgValue.transMethod = transMethodMap.defaultMethod.id;//默认为实时
			}
			var transObjectTemp = JSON.parse(JSON.stringify(_this.msgValue));//特殊业务特殊处理，后续需要删除
			if(payType==PayTypeData.BATCHTRANSFER_TYPE){//批量转账  特殊业务特殊处理，后续需要删除
				transObjectTemp.payeeaccount = '0';
			}
			var checkSignData = transArrToStr(checkSignArr,transObjectTemp ,"@");
			var	sourceSignData = transArrToStr(sourceSignArr,transObjectTemp,"@");
			_this.sourceSignData = sourceSignData;
			dataSign = {
				checkSignData:checkSignData,
				signData:dataSign, 
				sourceSignData:sourceSignData
			};
		}else if(payType==PayTypeData.DSS_TYPE){//票据
			_this.msgValue.dataSign = dataSign;
			_this.msgValue.qfDate = _this.msgValue.date;
			_this.msgValue.amount = moneyStringFixTwo(_this.msgValue.amount).replace(/[^0-9.]*/g,"");//替换除了数字与小数点之外的其他数据 单位为元//account去掉xiawe2017-12-19
			dataSign = _this.msgValue;
		}else if(payType==PayTypeData.DSS_TEMPLET_TYPE){//密码器模板
			_this.content.dataSign = dataSign;
			if(!_this.content.payeeaccount){
				_this.content.payeeaccount = '0';
			}
			dataSign = JSON.parse(JSON.stringify(_this.content));
			if(-1 == dataSign.amount){
				dataSign.amount = '';
			}else{
				dataSign.amount = moneyStringFixTwo(dataSign.amount).replace(/[^0-9.]*/g,"");//替换除了数字与小数点之外的其他数据 单位为元//去除account，统一使用amount xiaowe2017-12-19
			}
		}
		
	
		dssBbShowBeanMap[payType] = dssBbShowBeanMap[payType] || dssBbShowBeanMap.defaultDssShow;//密码器显示内容

		dssBbShowBeanMap[payType].map(function(item,index){
			if('money'==item.type&&_this.msgValue[item.value]){//金额
				return item.value = moneyStringFixTwo(_this.msgValue[item.value]);
			}else if('date'==item.type&&_this.msgValue[item.value]){//日期
				return item.value = new Date(_this.msgValue[item.value]*1000).format(item.frt);
			}else if(_this.msgValue[item.value]){//content内容里面的数据
				return item.value = _this.msgValue[item.value];
			}else if(_this[item.value]){//this对象下面的数据
				return item.value = _this[item.value];
			}
		});
		
		dataSign.dssBbShowBean = dssBbShowBeanMap[payType];
		return dataSign;
	},
	/**
	 * 调用app对签名进行验签
	 * @param {Object} signData
	 * @param {Object} payType
	 */
	verifySign:function(signData,payType){
		return verifySignFunction(verifySignMap[payType].fnt,JSON.stringify(signData));
	},
	/**
	 * 生成流程结束数据
	 * @param {Object} payType
	 * @param {Object} vm
	 */
	genEndData:function(payType,vm){
		var _this = vm;
		if(payType==PayTypeData.TRANSFER_TYPE||payType==PayTypeData.BATCHTRANSFER_TYPE){//转账
			_this.msgValue.sign = _this.sourceSignData;
			_this.msgValue.isSave = 1;
			if(payType==PayTypeData.BATCHTRANSFER_TYPE){//批量转账
				_this.msgValue.transObj = transObjMap.defaultObj.id;//默认为个人
				_this.msgValue.transMethod = transMethodMap.defaultMethod.id;//默认为实时
				if(!_this.msgValue.payeeList){//非重新支付
					_this.msgValue.payeeList = [];
					_this.msgValue.payeeBankId.forEach(function(item,i){//拼接显示内容
						_this.msgValue.payeeList.push({'payeeBankId':item,'payeeaccount':_this.msgValue.payeeaccount[i],'money':_this.msgValue.money[i],'payeeName':_this.msgValue.payeeName[i]});
					})
				}
			}
		}else if(payType==PayTypeData.SALARY_TYPE){//代发工资
			//判断是否再次支付
			if(_this.sendData.payInfo){//如果存在sendData数据则表明是重新支付
				return _this.sendData;
			}
			_this.sendData.bankId = 1;
			_this.sendData.isCheckNoCard = 0;
			
			_this.msgValue.salaryList = _this.msgValue.inDetail;
			_this.salaryList = _this.msgValue.inDetail;

			if((_this.msgValue.sendDate+'').length>8){//时间戳
				_this.msgValue.sendTime = _this.msgValue.sendDate = new Date(_this.msgValue.sendDate*1000).format("yyyyMMdd");
			}else{ //时间格式yyyyMMdd
				_this.msgValue.sendTime = _this.msgValue.sendDate;
			}

			_this.msgValue.date = new Date().format("yyyyMMdd");
			_this.sendData.flowId = _this.msgValue.flowId;
			_this.sendData.pwCode = _this.msgValue.pwCode;
			_this.sendData.payInfo = {'templetId':_this.templetId,'content':_this.msgValue};
			_this.msgValue = _this.sendData;
		}
		return _this.msgValue;
	},
	/**
	 * 支付最后计算  转账 - 数字支票签发 - 结算卡授权
	 * @param {Object} data
	 * @param {Object} payType
	 */
	endFlow:function(data,payType,vm){
		return cryptPost(endFlowMap[payType].url,data,vm);
	},
	/**
	 * 根据类型打开密码器输入框
	 * @param {Object} payType
	 */
	openPswDialog:function(payType){
		var openPswFlag = (
			(payType==PayTypeData.TRANSFER_TYPE)//转账
			||(payType==PayTypeData.SALARY_TYPE)//代发工资
			||(payType==PayTypeData.WEALTH_BUT_TYPE)//理财购买
		    ||(payType==PayTypeData.WEALTH_REDEEM_TYPE)//理财赎回
			||(payType==PayTypeData.BALANCE_TYPE)//银企对账
			||payType==PayTypeData.BATCHTRANSFER_TYPE);//批量转账
			
		if(openPswFlag){//打开密码器输入框
			//return DSSHandler.openPswDialog();
            return new Promise(function(res){
                res('123456');//屏蔽密码器输入框
            })
		}
		return new Promise(function(res){
			res(1);//不打开密码器输入框
		})
	},
	/**
	 * 初始化密码器
	 * @param {Object} loginType  登录类型   支付与计算密码默认为1
	 */
	initDSSManagment:function(loginType){
		var loginType = 1 || loginType;
		return DSSHandler.ConnectAndLoginFunction(loginType).then(function(data){//①判断密码器是否初始化成功，计算密码需要登录，传1
			if(CheckDevTypeData.MANAGER_SUCCESS_TYPE==data.type || CheckDevTypeData.OTHER_SUCCESS_TYPE==data.type){
				var mCodeList = [{'mCode':data.mCode,'optType':1,'pubAccount':data.list}];//取出密码器传回的账户信息，用来计算成功后自动同步账号
				return mCodeList;
			}else if(CheckDevTypeData.MANAGER_FAIL_TYPE==data.type || CheckDevTypeData.OTHER_FAIL_OTHER_COMPANY==data.type){
				showToast('该'+ DSSHandler.NAME_DSS +'不属于当前企业', 'middle'); 
				return false;
			}else if(CheckDevTypeData.OTHER_FAIL_NOT_OWNER==data.type){
				showToast('请连接正确的'+ DSSHandler.NAME_DSS, 'middle'); 
				return false;
			}
			return false;
		});
	},
	/**
	 * 获取付方账号列表
	 * @param {Object} 
	 */
	getPubAcc:function(){
		return cryptPost('approval/getAccountList.do', {});
	}
	
}

export default new PayHandler();