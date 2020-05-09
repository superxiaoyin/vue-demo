import {GetUserInfoFunction } from '../../../lib/common/SnJsBridge.js';

var DatetimeHandler = function(){
}
DatetimeHandler.prototype = {
	/**
	 * 开始和结束时间的计算
	 * @param {Object} UAId
	 */
	datetimeCompute:function(startDate,endDate) {
		var _this = this;
		//var startDate = $compareDivObj.find("span[daterange='trvstartDate']").attr("key")*1000;
		//var endDate = $compareDivObj.find("span[daterange='trvendDate']").attr("key")*1000;
		
/*		var date3 = endDate - startDate;
		
		var days=Math.floor(date3/(24*3600*1000)) +1 ;*/
		
		
		var date3 = endDate - startDate;
		var days=Math.floor(date3/(24*3600*1000)) ;
		
		var leave1=date3%(24*3600*1000);    //计算出小时数
		var hours=Math.floor(leave1/(3600*1000));
		
		var leave2=leave1%(3600*1000)        //计算相差分钟数
		var minutes=Math.floor(leave2/(60*1000));
		if (0 < minutes && minutes <= 30) {
			hours = hours + 0.5;
		} else if (minutes > 30) {
			hours = hours + 1;
		}
		var leaveDay = "";
		var tjhrs=0;
		if (hours > 4) {
			tjhrs = 1;
		} else if (hours <= 4 && hours > 0){
			tjhrs = 0.5;
		} else if (hours == 0) {
			tjhrs = 0;
		}
		var totalDays = days + tjhrs;
/*		//复制模板分支，不需要赋值了  zhch 20161212
		if (!(copyFlg == true || copyFlg == "true")) {
			$("span[units='3']").text(totalDays + "天");
			//请假提示信息显示
			if(typeof(showTips)=="function"){ 
				showTips(); 
			}
		}*/
		return totalDays;
	},
}

export default new DatetimeHandler();