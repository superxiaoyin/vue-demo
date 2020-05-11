import { OpenActionFunction, TPayGetDssStatusFunction, 
	 verifySignFunction, ConnectDssBb, LoginDss, 
	CalculatePassword, GetDssAccountList, ModifyDssPsw} from './common/SnJsBridge.js';
import Vue from 'vue';
import {cryptPost} from './common/base.js';
import {showToast,isPC} from './common/extend.js';



//密码器调用相关常量

/**
 * 密码器提示信息
 */
const DSS_STATUS_TOAST = '请插入密码器!';

/**
 * 密码器日志信息
 */
const INIT_DSS_ERROR = '初始化密码器错误!';
const LOGIN_DSS_ERROR = '登录密码器失败!';
const OPENPSW_DIALOG_ERROR = '打开密码输入框获取输入密码错误!';

/**
 * 打开app输入密码弹框 参数
 */
const pswJson = {
	action  : 'IntentAction_PayPasswordActivity',
	dataList: [{key: 'userid', value: 'abc1', type: "string"}],
	responseKeyList: [{key: 'result_key', value: '', type: 'string'}]
};

/**
 * 校验密码器权限
 */
const CheckDevTypeData = {
	/**
	  * //最高管理员可以操作
	  */
	MANAGER_SUCCESS_TYPE : 1,
	 /**
	  * //最高管理员不能操作
	  */
	MANAGER_FAIL_TYPE : 2,
	/**
	 * //其他人员可以操作
	 */
	OTHER_SUCCESS_TYPE : 3,
	/**
	 * //其他人员不能操作(不是该企业密码器)
	 */
	OTHER_FAIL_OTHER_COMPANY : 4,
	/**
	 * //其他人员不能操作(不是该密码器持有人)
	 */
	OTHER_FAIL_NOT_OWNER : 5,
};
/**
 * 密码器相关方法
 */
var DSSHandler = function(){
	this.CheckDevTypeData = CheckDevTypeData;
}

DSSHandler.prototype = {
	/**
	 * 检查密码器是否插入
	 */
	TPayGetDssStatus:function(){
//		if(isPC()){			
//			showToast('请在手机客户端上操作此功能', 'middle');
//			return false;
//		}
		//检测密码器是否插入  TPayGetDssStatusFunction “0”密码器已经插入     “-1”密码器未插入
		return TPayGetDssStatusFunction().then(function(data){
			//console.log('TPayGetDssStatusFunction');
			if( 0==data.ret){ //密码器已插入
				return true;
			}else{
				showToast(DSS_STATUS_TOAST, 'middle');
				return false;
			}
		});
	},
	/**
	 * 判断是否存在密码器使用权限  true表示有使用权限  false表示没有使用权限     在ConnectAndLoginFunction已经处理 该方法放弃
	 */
	hasDSSRight:function(){
		//判断人员使用有密码器使用权限
		return cryptPost('yqt/DSS/getCompanyCreator.html', {}).then(function(result){//判断是否管理员
			if(result.cUAId == result.UAId){//是管理员，不需要取服务器数据
    			return true;
	    	}else{ //不是管理员，需要取服务器数据
    			cryptPost('yqt/DSS/queryMCodeUser.html',{}).then(function(result){ //提交成功
					if(0<(result.mCodeUserList||[]).length){
						return true;
					}else{
						showToast('您没有密码器使用权限,请联系企业最高管理员', 'middle');  
						return false;
					}
				})
	    	}
		})
	},
	/**
	 * 打开密码输入框，返回输入密码
	 */
	openPswDialog:function(){
		return OpenActionFunction(pswJson).then(function(data){
			try{
				return JSON.parse(data[0].value).passWord;
			}catch(e){
				console.log(OPENPSW_DIALOG_ERROR)
				return -1;
			}
			
		});
	},
	
	/**
	 * 校验密码器
	 * @param {Object} url
	 * @param {Object} param
	 */
	CheckDevFunction:function(url,param){
		return cryptPost(url,param);
	},
	
	/**
	 * 验证签名
	 * @param {Object} fun          app验证签名函数名
	 * @param {Object} signData     需要验证签名的数据 格式为JSON
	 */
	TPayVerifyFunction:function(fun,signData){
		return verifySignFunction(fun,JSON.stringify(signData));
	},
	/**
	 * 初始化密码器，返回mCode
	 * ConnectDssBbFunction 已修改，不返回List<String> list
	 */
	ConnectDssBbFunction:function(dev){
		return ConnectDssBb(dev);
	},
	
	/**
	 * 登录密码器
	 * @param {Object} codeUserData
	 */
	LoginDssFunction:function(codeUserData){
		return LoginDss(JSON.stringify(codeUserData));
	},
	
	/**
	 * 修改口令
	 * @param {Object} dssPswData
	 */
	ModifyDssPswFunction:function(dssPswData){
		return ModifyDssPsw(JSON.stringify(dssPswData));
	},
	/**
	 * 获取密码器付方账号列表
	 * ConnectDssBbFunction 已修改，不返回List<String> list
	 */
	GetDssAccountListFunction:function(){
		return GetDssAccountList();
	},
	/**
	* 调用app计算支付密码
	* @param {Object} signData
	*/
	calDssPwd:function(signData){
		return CalculatePassword(JSON.stringify(signData));
	},
	/**
	 * 调用服务器生成签名
	 * @param {Object} url    获取签名url 
	 * @param {Object} data   数据
	 * @param {Object} _this  传递进来对象
	 */
	getSign:function(url,data,_this){
		var url = url || 'yqt/pay/getSign4Bill.html';//默认获取票据签名
		return cryptPost(url,data,_this);
	},
	/**
	 * 验证签名
	 * @param {Object} signFnt
	 * @param {Object} signData
	 */
	verifySign:function(signFnt,signData){
		return this.TPayVerifyFunction(signFnt,signData).then(function(res){
			if(0==res.ret){
				console.log("verifySign success")
				return res.responseData;
			}else{//密码器验签失败，提示错误信息
				console.log("verifySign fail");
				showToast(res.responseData, 'middle');
				return false;
			}
			
		});
	},
	/**
	 * 初始化及登录密码器
	 * @param {Object} loginType
	 * @param {Object} dev
	 */
	ConnectAndLoginFunction:function(loginType,dev){
		var _this = this;
//		if(isPC()){			
//			showToast('请在手机客户端上操作此功能', 'middle');
//			return false;
//		}
		return _this.ConnectDssBbFunction(dev).then(function(data){//①初始化密码器
			if(0==data.ret){ //密码器已插入
				if(undefined!=dev&&dev!=data.connectDev){
					showToast('请连接正确的密码器', 'middle');
					return false;
				}else{
					return _this.CheckDevFunction('bill/checkDev.html',{"mCode":data.connectDev}).then(function(res){//②校验密码器
						if(CheckDevTypeData.MANAGER_SUCCESS_TYPE==res.type||CheckDevTypeData.OTHER_SUCCESS_TYPE==res.type||CheckDevTypeData.MANAGER_FAIL_TYPE==res.type){
							
							if(1==loginType){
								if(CheckDevTypeData.MANAGER_FAIL_TYPE==res.type){//同步新增密码器使用
									var codeUserId = -1;
								}
								return _this.LoginDssFunction({"codeUserId":parseInt(undefined==res.mCodeUserId?0:res.mCodeUserId) || codeUserId }).then(function(result){
									if(0==result.ret){ //③密码器已登录成功
										return _this.GetDssAccountListFunction().then(function(response){ //读取密码器账户列表
												if(0==response.ret){ //读取密码器账户列表成功		
													var returnData = {"type":res.type,"list":response.list,"mCode":data.connectDev};
												    return returnData;
										    	}else if(-1==response.ret){
													showToast(response.strError, 'middle');
													return false;
												}
										});
									}else if(-1==result.ret){
										showToast(result.strError, 'middle');
										return false;
									}
								});
								
							}else{
								var returnData = {"type":res.type,"mCode":data.connectDev};
								return returnData;
							}
							
						}else{
							//根据res.type 显示正确的提示语
                            var dssToastMap = {4:'该密码器不属于当前企业，请联系管理员进行绑定',5:'您没有密码器使用权限，请联系管理员'};
                            showToast(dssToastMap[res.type], 'middle');
							return;
						}
					});
				}
			}else if(-1==data.ret){
				showToast(data.strError, 'middle');
				return false;
			}
		});
	},
	/**
	 * 检查密码器使用权限 有权限则返回mCodeList 没有权限返回false
	 * @param {Object} loginType
	 */
	checkRight:function(loginType){
		var _this = this;
//		if(isPC()){			
//			showToast('请在手机客户端上操作此功能', 'middle');
//			return false;
//		}
		var loginType = 1 || loginType;
		var res = {code:-1};//默认为没有权限
		return _this.ConnectAndLoginFunction(loginType).then(function(data){//①判断密码器是否初始化成功，计算密码需要登录，传1
			if(_this.CheckDevTypeData.MANAGER_SUCCESS_TYPE==data.type || _this.CheckDevTypeData.OTHER_SUCCESS_TYPE==data.type){
				var mCodeList = [{'mCode':data.mCode,'optType':1,'pubAccount':data.list}];//取出密码器传回的账户信息，用来计算成功后自动同步账号
				res.code = 0;
				res.mCodeList = mCodeList;
			}else if(_this.CheckDevTypeData.MANAGER_FAIL_TYPE==data.type || _this.CheckDevTypeData.OTHER_FAIL_OTHER_COMPANY==data.type){
				showToast('该密码器不属于当前企业', 'middle'); 
			}else if(_this.CheckDevTypeData.OTHER_FAIL_NOT_OWNER==data.type){
				showToast('请连接正确的密码器', 'middle'); 
			}
			return res;
		});
	} 

}

export default new DSSHandler();
