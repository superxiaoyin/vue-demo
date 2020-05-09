import {cryptPost,noCryptPost,nativeInfo} from './common/base.js';
import {throttle,getStorage,setStorage,moneyStringFixTwo,sumStrings,deleteStorage} from './common/extend.js';

//常用账户处理

var UsedHandler = function(){
}

UsedHandler.prototype = {
	
	/**
	 * 初始数据
	 */
	init:function(){},
	/**
	 * 保存常用
	 * @param {Object} ele 控件对象
	 * @param {Object} storageId 存储key
	 * @param {Object} displayKeys 列表显示对应的字段
	 * @param {Object} relationFieldIds 需要存储的关联字段
	 */
	saveUsedAccount:function(ele,storageId,displayKeys,relationFieldIds,usedValue){
		var _this = this;
//		var storageId = 'templetType' + templetType + 'UAId' + nativeInfo.UAId + 'cpyId' + nativeInfo.cpyId + 'storageKey';
		var storageData = {};
		if(displayKeys&&displayKeys.length>1){//常用账户
			var mainValue = ele[displayKeys[0]];
			var minorValue = ele[displayKeys[1]];
			if(mainValue && minorValue){
				storageData["title"] = mainValue + "(" + minorValue + ")";
				storageData["value"] = minorValue;
				storageData["dispValue"] = storageData.title;
			}
		}else{//常用地址
			var mainValue = "";
			if(displayKeys){
				mainValue = ele[displayKeys[0]];
			}
			if(usedValue && !mainValue){
				mainValue = usedValue;
			}
			if(mainValue){
				storageData["title"] = mainValue;
				storageData["value"] = mainValue;
				storageData["dispValue"] = mainValue;
			}
		}
		//常用账户存储
		if(relationFieldIds){
			var relationObj = {};
			for(var i=0;i<relationFieldIds.length;i++){
				var refKey = relationFieldIds[i];
				if(ele[refKey]){
					//针对fieldKey存储
					relationObj[refKey] = ele[refKey];
					if("bankValue"==refKey){//银行需要额外存储显示值
						relationObj.bankDisplay = ele.bankDisplay;
					}else if("cityName"==refKey){//省市需要额外存储显示值
						relationObj.cityDisplay = ele.cityDisplay;
					}else if("branch"==refKey){//银支需要额外存储显示值
						relationObj.branchDisplay = ele.branchDisplay;
					}
				}
			}
			if(storageData.value){
				storageData["relationObj"] = relationObj;				
			}
		}
		var storageDataArr = [];
		storageDataArr.push(storageData);
		_this.saveStorage(storageId,storageDataArr);
	},
	/**
	 * 保存二级明细常用
	 * @param {Object} tempStorageId
	 * @param {Object} storageId
	 */
	saveSubUsed:function(tempStorageId,storageId){
		var _this = this;
		//获取临时二级明细常用
		var tempStorageValue = getStorage(tempStorageId);
		var dataList = [];
    	if(tempStorageValue){
    		dataList = JSON.parse(tempStorageValue);
    	}
    	//保存常用
    	_this.saveStorage(storageId,dataList);
    	//删除临时二级明细常用缓存
		deleteStorage(tempStorageId);
	},
	/**
	 * 过滤重复常用后存入storage
	 * @param {Object} storageId
	 * @param {Object} storageDataArr
	 */
	saveStorage:function(storageId,storageDataArr){
		var _this = this;
		//获取历史常用
		var storageValue = getStorage(storageId);
		var dataList = [];
    	if(storageValue){
    		dataList = JSON.parse(storageValue);
    	}
    	storageDataArr.forEach(function(item){
    		//新增元素插入数组首位
			if(item&&item.dispValue&&-1==_this.containsValue(dataList,item)){
				dataList.unshift(item);
			}
			//数组长度大于100时，删除末尾元素2018-3-22改为100
			if(dataList.length>100){
				dataList.pop();
			}
    	});
		//将常用账户存储进localStorage
		if(dataList.length > 0){
			setStorage(storageId,JSON.stringify(dataList));
		}
	},
	/**
	 * 是否已包含常用
	 * @param {Object} dataList
	 * @param {Object} obj
	 */
	containsValue:function(dataList,obj){
		for(var i=0;i<dataList.length;i++){
			var dataObj = dataList[i];
			if(dataObj.dispValue==obj.dispValue){
				return i;
			}
		}
		return -1;
	},
	/**
	 * 删除常用
	 * @param {Object} index
	 * @param {Object} templetType
	 */
	deleteUsed:function(index,storageId){
//		var storageId = 'templetType' + templetType + 'UAId' + nativeInfo.UAId + 'cpyId' + nativeInfo.cpyId + 'storageKey';
		//获取历史常用
		var storageValue = getStorage(storageId);
		var dataList = [];
    	if(storageValue){
    		dataList = JSON.parse(storageValue);
    	}
    	dataList.splice(index,1);
    	//将常用账户存储进localStorage
    	if(dataList.length > 0){
    		setStorage(storageId,JSON.stringify(dataList)); 
    	}else{
    		deleteStorage(storageId);
    	}
	},
	/**
	 * 转化历史缓存
	 * @param {Object} historyStorageKey
	 * @param {Object} storageKey
	 */
	transferHistoryData:function(historyStorageKey,storageKey,relationFieldIds,displayKeys){
		var _this = this;
		var historyStorageValue = getStorage(historyStorageKey);
		var storageValue = getStorage(storageKey);
		var dataList = [];
		if(storageValue){
    		dataList = JSON.parse(storageValue);
    	}
		if(historyStorageValue){
			var historyArr = historyStorageValue.split('*');
			historyArr.forEach(function(item){
				if(item){
					if(relationFieldIds){
						dataList.push(_this.applicationHistory(item,relationFieldIds,displayKeys));
					}else{
						dataList.push(item);
					}
				}
			});
		}
		//将常用地址存储进localStorage
		_this.saveStorage(storageKey,dataList); 
		//删除历史缓存
//		deleteStorage(historyStorageKey); 
	},
	applicationHistory:function(item,relationFieldIds,displayKeys){
		var applicationArr = item.split('_');
		var returnData = {};
		var mainValue = applicationArr[0];
		var minorValue = applicationArr[2];
		returnData.title = mainValue + "(" + minorValue + ")";
		returnData.value = minorValue;
		returnData.dispValue = mainValue + "(" + minorValue + ")";
		returnData.relationObj = {};
		relationFieldIds.forEach(function(key,index){
			returnData.relationObj[key] = applicationArr[index];
		});
		return returnData;
	}
}

export default new UsedHandler();
