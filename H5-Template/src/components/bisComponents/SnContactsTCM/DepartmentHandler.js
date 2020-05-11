import {GetUserInfoFunction } from '../../../lib/common/SnJsBridge.js';



var DepartmentHandler = function(){
}
DepartmentHandler.prototype = {
	/**
	 * 获取部门信息
	 * @param {Object} UAId
	 */
	getDepartment:function(UAId) {
		var _this = this;
		return GetUserInfoFunction({"UAId":UAId}).then(function(uaData){
			var orgId = ''; var orgName = '';
			if (!!uaData.orgId) {
				orgId = uaData.orgId;//报销人id
				orgName = uaData.orgName//"申请人部门";//报销人部门
			} else {
				orgId = '';//报销人id
				orgName = '';//报销人部门
			}
			uaData.orgId = orgId; uaData.orgName = orgName;
			return uaData
       });
	},
}

export default new DepartmentHandler();