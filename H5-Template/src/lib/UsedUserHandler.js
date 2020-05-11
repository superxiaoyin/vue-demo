import {getStorage,setStorage} from './common/extend.js';

//常用账户处理

var UsedUserHandler = function(){
}

UsedUserHandler.prototype = {
	/**
	 * 保存常用联系人
	 */
	setStorageTopContacts:function(_this){
    	var MAX_NEXT = 5;
		var MAX_COPY = 20;
    	var key = 'topContactsFromStorage_'+(_this.UAId+'')+'_'+(_this.cpyId+'');
    	var topContacts = {next:[],copy:[]};
		if(undefined != getStorage(key) && "" != getStorage(key)){
            topContacts = JSON.parse(getStorage(key));	                                                
    	}  	         		         	
    	if('' != _this.nextAndcopy.nextUaId){
			var nextJson = {};
			var nextUAId = _this.nextAndcopy.nextUaId;
			nextJson[nextUAId] = _this.nextAndcopy.nextName;
			var nextLenght = topContacts.next.length;
			if(nextLenght == 0){//为空时不用去重
				topContacts.next.unshift(nextJson);
			}else{			
				var nextLenght = topContacts.next.length;
				for(var i=0;i< nextLenght;i++){//去重
					var jsonKey;
					for(var p in topContacts.next[i]){
						jsonKey = p;
					}														
					if(nextUAId == jsonKey){
						break;
					}
					if(nextLenght == i+1){
						topContacts.next.unshift(nextJson);//添加到第一位								
					}
				}							
			}																		
			if (topContacts.next.length > MAX_NEXT) {//数组超过COPY_TO_USERS，  则取前面的COPY_TO_USERS个   ;
				topContacts.next = topContacts.next.slice(0,MAX_NEXT);
			}
		}            	
		if(0 < _this.nextAndcopy.copyToUaIds.length){
			for(var i=0;i<_this.nextAndcopy.copyToUaIds.length;i++){
				var copyJson = {};
				var copyUAIds = _this.nextAndcopy.copyToUaIds[i];
				copyJson[copyUAIds] = _this.nextAndcopy.copyToNames[i];	
				var copyLenght = topContacts.copy.length;
				if(copyLenght == 0){//为空时不用去重
					topContacts.copy.unshift(copyJson);
				}else{
					var copyLenght = topContacts.copy.length;
					for(var j=0;j< copyLenght;j++){//去重
						var jsonKey;
						for(var p in topContacts.copy[j]){
							jsonKey = p;
						}								
						if(copyUAIds == jsonKey){
							break;
						}
						if(copyLenght == j+1){
							topContacts.copy.unshift(copyJson);//添加到第一位									
						}
					}							
				}						
				if (topContacts.copy.length > MAX_COPY) {//数组超过COPY_TO_USERS， 则取前 面的COPY_TO_USERS个 ;
					topContacts.copy = topContacts.copy.slice(0,MAX_COPY);
				}	
			}										
		} 
		setStorage(key,JSON.stringify(topContacts))				            	
  	}
}
export default new UsedUserHandler();
