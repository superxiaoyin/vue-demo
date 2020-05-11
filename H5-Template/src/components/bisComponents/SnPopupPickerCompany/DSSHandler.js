import { OpenActionFunction, TPayGetDssStatusFunction, 
	 verifySignFunction, ConnectDssBb, LoginDss, 
	CalculatePassword, GetDssAccountList, ModifyDssPsw} from '../../../lib/common/SnJsBridge.js';
import Vue from 'vue';
import {cryptPost} from '../../../lib/common/base.js';
import {showToast,isPC} from '../../../lib/common/extend.js';



//安全硬件调用相关常量

/**
 * 安全硬件提示信息
 */
const dssToastMap = {
	2:'该安全硬件不属于当前企业，请联系管理员',
	4:'该安全硬件不属于当前企业，请联系管理员',
	5:'您没有该安全硬件使用权限，请联系管理员',//插入BB权限判断
	6:'您没有安全硬件使用权限，请联系管理员'//未插BB时权限判断
};

const DSS_STATUS_TOAST = '请插入安全硬件!';

/**
 * 安全硬件日志信息
 */
const INIT_DSS_ERROR = '初始化安全硬件错误!';
const LOGIN_DSS_ERROR = '登录安全硬件失败!';
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
 * 校验安全硬件权限
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
	 * //其他人员不能操作(不是该企业安全硬件)
	 */
	OTHER_FAIL_OTHER_COMPANY : 4,
	/**
	 * //其他人员不能操作(不是该安全硬件持有人)
	 */
	OTHER_FAIL_NOT_OWNER : 5,
};
/**
 * 安全硬件相关方法
 */
var DSSHandler = function(){
	this.CheckDevTypeData = CheckDevTypeData;
}

DSSHandler.prototype = {
	/**
	 * 检查安全硬件是否插入
	 */
	TPayGetDssStatus:function(){
/*		if(isPC()){			
			showToast('请在手机客户端上操作此功能', 'middle');
			return false;
		}*/
		//检测安全硬件是否插入  TPayGetDssStatusFunction “0”安全硬件已经插入     “-1”安全硬件未插入
		return TPayGetDssStatusFunction().then(function(data){
			//console.log('TPayGetDssStatusFunction');
			if( 0==data.ret){ //安全硬件已插入
				return true;
			}else{
				showToast(DSS_STATUS_TOAST, 'middle');
				return false;
			}
		});
	},
	/**
	 * 判断是否存在安全硬件使用权限  true表示有使用权限  false表示没有使用权限     在ConnectAndLoginFunction已经处理 该方法放弃
	 */
	hasDSSRight:function(){
		//判断人员使用有安全硬件使用权限
		return cryptPost('yqt/DSS/getCompanyCreator.html', {}).then(function(result){//判断是否管理员
			if(result.cUAId == result.UAId){//是管理员，不需要取服务器数据
    			return true;
	    	}else{ //不是管理员，需要取服务器数据
    			cryptPost('yqt/DSS/queryMCodeUser.html',{}).then(function(result){ //提交成功
					if(0<(result.mCodeUserList||[]).length){
						return true;
					}else{
						showToast('您没有安全硬件使用权限,请联系企业最高管理员', 'middle');  
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
	 * 校验安全硬件
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
	 * 初始化安全硬件，返回mCode
	 * ConnectDssBbFunction 已修改，不返回List<String> list
	 */
	ConnectDssBbFunction:function(dev){
		return ConnectDssBb(dev);
	},
	
	/**
	 * 登录安全硬件
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
	 * 获取安全硬件付方账号列表
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
			}else{//安全硬件验签失败，提示错误信息
				console.log("verifySign fail");
				showToast(res.responseData, 'middle');
				return false;
			}
			
		});
	},
	/**
	 * BB登录
	 * @param {Object} loginType
	 * @param {Object} res       服务器返回人员安全硬件列表
	 * @param {Object} data      连接上安全硬件后返回的数据
	 */
	loginDss:function(loginType,res,data){
		var _this = this;
		if(1==loginType){
			var mCodeUserId = 0;
			//最高管理员
			if(_this.CheckDevTypeData.MANAGER_FAIL_TYPE==res.type||_this.CheckDevTypeData.MANAGER_SUCCESS_TYPE==res.type){//同步新增安全硬件使用
				mCodeUserId = -1;
			}else{
				//非最高管理员 查找人员名下棒棒对应的codeUserId
				for(var i=0;i<(res.mCodeUserList||[]).length;i++){
					if(data.connectDev==res.mCodeUserList[i].mCode){
						mCodeUserId = parseInt(res.mCodeUserList[i].mCodeUserId||0);
						break;
					}
				}
			}
			
			//安全硬件登录
			return _this.LoginDssFunction({"codeUserId":mCodeUserId }).then(function(result){
				if(0==result.ret){ //④安全硬件已登录成功
					return _this.GetDssAccountListFunction().then(function(response){ //读取安全硬件账户列表
							if(0==response.ret){ //⑤读取安全硬件账户列表成功		
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
	},
	/**
	 * 初始化及登录安全硬件
	 * @param {Object} loginType   登录类型
	 * @param {Object} dev         BB的Id
	 * @param {Object} upFlag      账号同步Flag  true表示账号同步的登录，false表示非同步账号的登录
	 */
	ConnectAndLoginFunction:function(loginType,dev,upFlag){
		var _this = this;
/*		if(isPC()){			
			showToast('请在手机客户端上操作此功能', 'middle');
			return false;
		}*/
		//①校验安全硬件权限
		return _this.CheckDevFunction('bill/checkDev.html').then(function(res){
			//账号同步权限
			var upRight = upFlag&&(_this.CheckDevTypeData.MANAGER_SUCCESS_TYPE==res.type||_this.CheckDevTypeData.MANAGER_FAIL_TYPE==res.type);
			if(res.hasRight||upRight){
				//②连接安全硬件
				return _this.ConnectDssBbFunction(dev).then(function(data){
					//安全硬件已插入
					if(0==data.ret){
						//如果账号同步并且是最高管理者
						if(upRight){
							//判断BB是否为该企业  如果不是该企业BB，则将type修改为MANAGER_FAIL_TYPE
							if(_this.CheckDevTypeData.MANAGER_SUCCESS_TYPE==res.type){
								var mCode = ';'+data.connectDev+';';//BB的Id
								var mCodeList = (res.mCodeList||[]).map(function(item){
									return item.mCode
								});
								var mCodeListStr = ';'+mCodeList.join(';')+';';
								if(mCodeList&&-1==mCodeListStr.indexOf(mCode)){
									res.type = _this.CheckDevTypeData.MANAGER_FAIL_TYPE;
								}
							}
							return _this.loginDss(loginType,res,data);
						}
							
						if(undefined!=dev&&dev!=data.connectDev){
							showToast('请连接正确的安全硬件', 'middle');
							return false;
						}else{
							//判断BB是否在返回的列表中
							var mCode = ';'+data.connectDev+';';//BB的Id
							var mCodeList = (res.mCodeList||[]).map(function(item){
								return item.mCode
							});
							var mCodeListStr = ';'+mCodeList.join(';')+';';
							var mCodeUserList = (res.mCodeUserList||[]).map(function(item){
								return item.mCode;
							});
							var mCodeUserListStr = ';'+mCodeUserList.join(';')+';';
							
							//判断该安全硬件是否为该企业安全硬件
							if(mCodeList&&-1<mCodeListStr.indexOf(mCode)){
								//判断该安全硬件是否为该人员安全硬件 或者最高管理员
								if((mCodeUserList&&-1<mCodeUserListStr.indexOf(mCode))||_this.CheckDevTypeData.MANAGER_SUCCESS_TYPE==res.type){
									//③棒棒登录
									return _this.loginDss(loginType,res,data);
								}else{
									showToast(dssToastMap['5'], 'middle');
								}
							}else{
								showToast(dssToastMap['4'], 'middle');
							}
						}
					}else if(-1==data.ret){
						showToast(data.strError, 'middle');
						return false;
					}
				});
			}else{
				showToast(dssToastMap[res.type], 'middle');
				return;
			}
		});
		
		
		
		
//		return _this.ConnectDssBbFunction(dev).then(function(data){//①初始化安全硬件
//			if(0==data.ret){ //安全硬件已插入
//				if(undefined!=dev&&dev!=data.connectDev){
//					showToast('请连接正确的安全硬件', 'middle');
//					return false;
//				}else{
//					return _this.CheckDevFunction('bill/checkDev.html',{"mCode":data.connectDev}).then(function(res){//②校验安全硬件
//						if(CheckDevTypeData.MANAGER_SUCCESS_TYPE==res.type||CheckDevTypeData.OTHER_SUCCESS_TYPE==res.type||CheckDevTypeData.MANAGER_FAIL_TYPE==res.type){
//							
//							if(1==loginType){
//								if(CheckDevTypeData.MANAGER_FAIL_TYPE==res.type){//同步新增安全硬件使用
//									var codeUserId = -1;
//								}
//								return _this.LoginDssFunction({"codeUserId":parseInt(undefined==res.mCodeUserId?0:res.mCodeUserId) || codeUserId }).then(function(result){
//									if(0==result.ret){ //③安全硬件已登录成功
//										return _this.GetDssAccountListFunction().then(function(response){ //读取安全硬件账户列表
//												if(0==response.ret){ //读取安全硬件账户列表成功		
//													var returnData = {"type":res.type,"list":response.list,"mCode":data.connectDev};
//												    return returnData;
//										    	}else if(-1==response.ret){
//													showToast(response.strError, 'middle');
//													return false;
//												}
//										});
//									}else if(-1==result.ret){
//										showToast(result.strError, 'middle');
//										return false;
//									}
//								});
//								
//							}else{
//								var returnData = {"type":res.type,"mCode":data.connectDev};
//								return returnData;
//							}
//							
//						}else{
//							//根据res.type 显示正确的提示语
//                          var dssToastMap = {4:'该安全硬件不属于当前企业，请联系管理员进行绑定',5:'您没有该安全硬件使用权限，请联系管理员'};
//                          showToast(dssToastMap[res.type], 'middle');
//							return;
//						}
//					});
//				}
//			}else if(-1==data.ret){
//				showToast(data.strError, 'middle');
//				return false;
//			}
//		});
	},
	/**
	 * 检查安全硬件使用权限 有权限则返回mCodeList 没有权限返回false
	 * @param {Object} loginType
	 */
	checkRight:function(loginType){
		var _this = this;
/*		if(isPC()){			
			showToast('请在手机客户端上操作此功能', 'middle');
			return false;
		}*/
		var loginType = 1 || loginType;
		var res = {code:-1};//默认为没有权限
		return _this.ConnectAndLoginFunction(loginType).then(function(data){//①判断安全硬件是否初始化成功，计算密码需要登录，传1
			if(_this.CheckDevTypeData.MANAGER_SUCCESS_TYPE==data.type || _this.CheckDevTypeData.OTHER_SUCCESS_TYPE==data.type){
				var mCodeList = [{'mCode':data.mCode,'optType':1,'pubAccount':data.list}];//取出安全硬件传回的账户信息，用来计算成功后自动同步账号
				res.code = 0;
				res.mCodeList = mCodeList;
			}else if(_this.CheckDevTypeData.MANAGER_FAIL_TYPE==data.type || _this.CheckDevTypeData.OTHER_FAIL_OTHER_COMPANY==data.type){
				showToast('该安全硬件不属于当前企业', 'middle'); 
			}else if(_this.CheckDevTypeData.OTHER_FAIL_NOT_OWNER==data.type){
				showToast('请连接正确的安全硬件', 'middle'); 
			}
			return res;
		});
	} 

}

export default new DSSHandler();
