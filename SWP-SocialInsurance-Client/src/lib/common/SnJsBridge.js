//调用native相关方法

function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
    } else {
        document.addEventListener(
            'WebViewJavascriptBridgeReady'
            , function() {
                callback(WebViewJavascriptBridge)
            },
            false
        );
    }
}

//js调用App方法(Promise版本)
export function callHandler(method, data){
    return new Promise(function(res,rej){
        connectWebViewJavascriptBridge(function(bridge){
            bridge.callHandler(method, data, function(responseData) {
					try{
						if(responseData){
							res(JSON.parse(responseData));
						}
					}catch(e){
						res(responseData);
					}
            });
        });
        
    })
}

/**
 * js注册方法等待App调用
 * @export
 * @param {any} method 方法名
 * @param {any} callback app调用后的回调
 *  function(data, responseCallback){
 *      //dosomething
 *      var responseData = {};
 *      responseCallback(responseData);
 *  }
 */
export function registerHandler(method, callback){
    connectWebViewJavascriptBridge(function(bridge){
        bridge.registerHandler(method, function(data){
        	callback(data);
        });
    });
}


/**
 * js调用 Native 获取用户信息
 * @export
 */
export function GetUserInfoFunction(data={}){
	return callHandler('GetUserInfoFunction',data);
}

/**
 * js调用 Native 加解密
 * @export
 */
export function EncryptionFunction(data){
	return callHandler('EncryptionFunction', data);
}

export function DecryptionFunction(data){
	return callHandler('DecryptionFunction', data);
}

/**
 * 从APP获取企业信息
 */
export function QueryCompanyDetailFunction(cpyInfo){
	return callHandler('QueryCompanyDetailFunction',cpyInfo);
}

/**
 * js调用 Native confirm 弹窗
 * @export
 */

export function CommonDialogFunction(confirmJson){
	return callHandler('CommonDialogFunction',JSON.stringify(confirmJson));
}

/**
 * js调用 Native Toast弹窗
 * @export
 */

export function ToastFunction(tips){
	return callHandler('ToastFunction',{
		toastData:tips,
		duration:0       //toast时长，只能是系统默认的2个类型 0: 短时间显示(2s);  1:长时间显示(3.5s)
	});
}

/**
 * js调用 Native PopMenu弹窗
 * @export
 */

export function PopMenuFunction(appData){
	return callHandler('PopMenuFunction',appData);
}

/**
 * js调用 Native 省市选择弹窗
 * @export
 */

export function SelectProvinceWidget(provinceListAll){
	return callHandler('SelectProvinceWidgetFunction', provinceListAll);
}

/**
 * js调用app查看附件预览接口
 * @export
 */
export function FilePreviewWidget(previemJson){
	return callHandler('PreviewFunction',previemJson);
}


/**
 * js调用 Native 时间选择弹窗
 * selectTimeJson
 * @export
 */

export function SelectTimeWidget(selectTimeJson){
	return callHandler('SelectTimeWidgetFunction', selectTimeJson);
}

/**
 * 增加app页面监听事件
 * @param {Object} appViewId        事件Id
 * @param {Object} appViewAction    app事件
 * @param {Object} appViewOperator  app显示
 * @param {Object} appViewName      app显示名称
 * @param {Object} func             回调函数
 */
export function addAppViewListener(appViewId,appViewAction,appViewOperator,appViewName,func){
	callHandler('addAppViewListener',{
		appViewId:appViewId,
		appViewAction:appViewAction,
		appViewOperator:appViewOperator,
		appViewName:appViewName
	});
	/**
	 * 注册点击app按钮回调
	 */
    registerHandler('appViewCallBack', function(data){
    	if(func){
    		func();
    	}
    }.bind(this));
}

/**
 * 监听app菜单监听事件
 * @param {Object} menuList
 *  {
      List<MenuItem>  menuList;
    }

    MenuItem {
     String name;  //  如果是菜单，用name显示菜单文字
     String iconNormalBase64;  // 如果是图标按钮，用来显示 正常图标（JS交互时，用base64转码，如果图片超过5k，提出来让UI重新切图）
     String iconPressedBase64; // 如果是图标按钮，用来显示 按下效果 图标（JS交互时，用base64转码，如果图片超过5k，提出来让UI重新切图）
     String menuId;  //必填   菜单ID （不区分是 图标按钮 或是 菜单项），列表中的menuId必须相互唯一
     Int type;  // 必填 类型 1 ActionBar上的图标按钮，2 下拉菜单项 3 title显示（一般情况下，只有一个图标按钮，可以有多个下拉菜单项）
	}
   注意
    name 和 iconNormalBase64 至少需要填写一个；
    name 和iconNormalBase64 都有值时ActionBar上的按钮优先显示name，下拉菜单项会左边显示图标，右边显示name；
        当有多个type 为1的item时，app会取第一个值；
        下拉菜单项显示顺序默认按menuList的顺序排序；

 */
export function RegisterMenuFunction(menuList){
	
	callHandler('RegisterMenuFunction',menuList);
	
	registerHandler('clickMenuCallBack', function(data){
		var dataJson = JSON.parse(data);
    	// 找出menuList中的与注册事件对应的函数并且执行
    	if(menuList){
 			//取对应的func执行 
			for(var i=0;i<menuList.length;i++){
				if(dataJson.menuId==menuList[i].menuId && menuList[i].func){
					menuList[i].func();
					break;
				}
			}
    	}
    }.bind(this));
}

/**
 * 回退页面
 * @param {Object} url  //目标页面url
 */
export function goBackFunction_new(url,backSteps,loadData){
	var data = {loadData:'',url:url};
	if(backSteps){
		data.backSteps= backSteps;
	}
	if (loadData) {
		data.loadData= loadData;
	}
	callHandler('goBackFunction',JSON.stringify(data));
}

/**
 * 回退页面
 * @param {Object} url  //目标页面url
 */
export function goBackFunction(url){
	callHandler('goBackFunction',JSON.stringify({loadData:'',url:url}));
}

/*
 * 调用app通知返回事件
 *
 * */

export function notifyAppBackEvent(){
	callHandler('notifyAppBackEvent','');
}



/**
 * 清除缓存
 * @param {Object}
 */
export function ClearWebViewCache(){
	callHandler('ClearWebViewCacheHandler','');
}


/**
 * OpenActionFunction
 * @param {Object} str
 */
export function OpenActionFunction(str){
	return callHandler('OpenActionFunction',str);
}

/**
 * verifySignFunction
 * 验签调用函数，此处写为callHandler通用调用方法
 * @param {Object} fnt  接口名
 * @param {Object} signData   参数
 */
export function verifySignFunction(fnt,signData){
	return callHandler(fnt,signData);
}


//密码器相关调用

/**
 * 检测密码器是否插入  TPayGetDssStatusFunction “0”密码器已经插入    “-1”密码器未插入
 * @param {Object}
 */
export function TPayGetDssStatusFunction(){
	return callHandler('TPayGetDssStatusFunction','');
}

/**
	 * 初始化密码器，返回mCode
	 * ConnectDssBbFunction 已修改，不返回List<String> list
	 */
export function ConnectDssBb(dev){
	return callHandler('ConnectDssBbFunction',dev);
}

	/**
	 * 登录密码器
	 * @param {Object} codeUserData
	 */
export function LoginDss(codeUserData){
	return callHandler('LoginDssFunction',codeUserData);
}

/**
	 * 修改口令
	 * @param {Object} dssPswData
	 */
export function ModifyDssPsw(dssPswData){
	return callHandler('ModifyDssPswFunction',dssPswData);
}
/**
	 * 获取密码器付方账号列表
	 * ConnectDssBbFunction 已修改，不返回List<String> list
	 */
export function GetDssAccountList(){
	return callHandler('GetDssAccountListFunction','');
}
/**
	* 调用app计算支付密码
	* @param {Object} signData
	*/
export function CalculatePassword(signData){
	return callHandler('CalculatePasswordFunction',signData);
}

/**
 * 添加密码器持有人
 * @param {Object} 
 */
export function SetDssUserFun(setUserData){
	return callHandler('SetDssUserFunction',setUserData);
}

/**
	* 调用app获取配置信息
	* @param {Object} signData
	*/
	
export function GetAppConfigFunction(data={}){
	return callHandler('GetAppConfigFunction',data);
}


/* 获取App的BankType 
 * 2：厦门银行
 * 3：华夏银行
 * */
export function getBankType(vm){
	var _this = vm;
    callHandler('GetAppConfigFunction',{key:'bankId'}).then(function(data){
    	    console.log('before:'+_this.appBankType);
			if( 3 === Number(data.value) ){ //华夏银行
				_this.appBankType = 2;
			}else{      //厦门银行
				_this.appBankType = 1;
			}
			console.log('after:'+_this.appBankType);
				
	});
}


/**
 * 获取网络状态
 * boolean contectState;//  false 未连接，true已连接
   int netType;// 1 WIFI，2是数据 0，默认值无意义
 */
export function CheckNetWorkFunction(){
	return callHandler('CheckNetWorkFunction','');
}

/**
 * 弹窗打开页面
 * @param {Object} url  //弹窗目标页面url
 */
export function popWindowFunction(targetUrl){
	callHandler('PopWindowFunction',JSON.stringify({url:targetUrl}));
}

/**
 * 获取签名
 */
export function SignDataFunction(data){
	return callHandler('SignDataFunction',data);
}

/**
 * 获取SM2 SM4加密的密码
 */
export function EncryptPasswordFunction(data){
	return callHandler('EncryptPasswordFunction',data);
}

// 实时监听gps信息
export function LocationObserverFunction(data) {
    callHandler('LocationObserverFunction', data);
}
/**
 * 获取基本配置信息
 */
export function GetLocalDataFunction(data){
	//临时数据
	var result = {"ret":0,"IMEI":1111111111,"terType":0};
	return result;
//	return callHandler('GetLocalDataFunction',data);
}
/**
 * 注册推送
 */
export function registerCommonPushEvent(){
	callHandler('RegisterCommonPushFunction','');
}
/**
 * 强制页面刷新
 */
export function ReloadPageFunction(){
	callHandler('ReloadPageFunction','');
}
/**
 * 跳转第三方应用地图
 */
export function OpenThirdPartMapFunction(data){
	callHandler('OpenThirdPartMapFunction',data);
}
