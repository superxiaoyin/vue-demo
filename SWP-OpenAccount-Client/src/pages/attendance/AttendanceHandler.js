import {cryptPost} from '../../lib/common/base.js';
import {showToast} from '../../lib/common/extend.js';
import DatetimeHandler from 'biscomponents/SnDatetime/DatetimeHandler.js';

var AttendanceHandler = function(){
}
AttendanceHandler.prototype = {
	/**
	 * 年假设置
	 * @param {Object} UAId
	 */
	holidaySet:function(selectValue,selectEle) {
		var choose = selectValue;
		if (choose == "年假") {
			this.getannualLeave(false, selectEle);
		} else {
			selectEle.$root.$refs.num10_584_noempty[0].placeholder ="请假天数(必填)"; //$("#num10_584_noempty").attr("placeholder","请假天数(必填)");
			DatetimeHandler.datetimeCompute(0);//20170531 添加 参数key=0 区别 差旅模板天数计算
			
			var startDateTime = selectEle.$root.content.date_557_noempty*1000;
			var endDateTime = selectEle.$root.content.date_287_noempty*1000;
			var days = DatetimeHandler.datetimeCompute(startDateTime,endDateTime);
			selectEle.$root.$refs.num10_584_noempty[0].$emit('input', days*10);
			selectEle.$root.$refs.num10_584_noempty[0].placeholderSet = '请假天数（必填）';
		}
		this.showLeaveTips(selectEle);  
	},
	/**
	 * 查询可用年假天数
	 * @param {Object} timeChange  是修改下拉框触发还是修改时间触发的flag
	 * @param {Object} ele  下拉框Obj 或者 时间Obj
	 */
	getannualLeave:function(timeChange,ele) {
		var uaId = $("#uaId").val();
	    var cpyId = $("#cpyId").val();
	    //获取开始时间的时间戳
	    var statrtime = ele.$root.content.date_557_noempty*1000;//$('#date_557_noempty').attr("key")*1000;
	    var startData = new Date(statrtime);
	    var startY = startData.getFullYear();
	    var startM = startData.getMonth()+1;
	    
	    var newdate = new Date();
	    var Syear = newdate.getFullYear();
	    //年假的时间周期是 当年的3月至次年的2月底。以开始时间的年份去获取年假（3-12月份取当前年份，1-2月份取前一年的年份）
	    if (3 <= startM && startM <= 12) {
	    	Syear = startY;
	    } else if (0< startM <=2){
	    	Syear = startY - 1;
	    }
	    
	    //获取结束时间的时间戳
	    var endtime = ele.$root.content.date_287_noempty*1000//$('#date_287_noempty').attr("key")*1000;
	    var endData = new Date(endtime);
	    var endY = endData.getFullYear();
	    var endM = endData.getMonth()+1;
	    
	    var Eyear = newdate.getFullYear();
	    if (3 <= endM && endM <= 12) {
	    	Eyear = endY;
	    } else if (0< endM <= 2){
	    	Eyear = endY - 1;
	    }
	    //年份跨度两年，并且天数大于60，给出提示
	    if (endtime > statrtime) {
	    	var betweenTimes = endtime - statrtime;
	    	var betweenDays = Math.floor(betweenTimes/(24*3600*1000));
	    	if (Eyear != Syear && betweenDays >60) {
	    		tipsBox("年假请假区间跨度太大，请重新选择");
	    		return;
	    	}
	    }
	    timeChangeFlg = timeChange;
		
	    var json={"uaId":parseInt(uaId),"cpyId":parseInt(cpyId),"beginTime":statrtime/1000,'endTime':endtime/1000};
		cryptPost('staff/getHolidayAvailable.do', json).then(function(result){	
			if (!!result.availableDays) {
				var hDaysDetails = result.hDaysDetails;
				var placeholderText = "";
				if (!!hDaysDetails) {
					for (var i=0;i<hDaysDetails.length;i++) {
						placeholderText += hDaysDetails[i].belongYear+"可用"+hDaysDetails[i].availableDays+"天,";
					}
				}
				if (!!placeholderText){
					placeholderText = placeholderText.substring(0,placeholderText.length-1)+"(必填)";
				} else {
					placeholderText = Syear+'可用年假'+retData.availableDays+'天(必填)';
				}
				ele.$root.$refs.num10_584_noempty[0].placeholderSet = placeholderText;  
			} else {
				ele.$root.$refs.num10_584_noempty[0].placeholderSet = '假期信息不存在(必填)';  
			}
			//切换年假选项的时候，清空字段计算天数，选择时间空间的时候 timeChangeFlg=true，不清空
			if (!timeChangeFlg) {
				ele.$root.$refs.num10_584_noempty[0].$emit('input', '');
				ele.$root.$refs.num10_584_noempty[0].$refs.input.value = '';
			}
		});
	},
	/**
	 * 除事假和病假外，其他假期2天以上，需要提示用户先提交给行政进行审批
	 * @param {Object} ele（下拉框或者天数number组件对象）
	 */
	showLeaveTips:function(ele){
		var inputday = ele.$root.content.num10_584_noempty;//   $(".template_div").find("#num10_584_noempty").text();
		var selectValue = ele.$root.$refs.type_554[0].selectedValue;
		if (selectValue != "" && !(selectValue == "事假" || (selectValue == "病假" && parseFloat(inputday/10) <=2))) {
			ele.$root.showApplyUserTips = true;
		} else {
			ele.$root.showApplyUserTips = false;
		}
	},
	/**
	 * 请假模板的天数的校验，
	 * @param {Object} value  天数
	 * @param {Object} computeDays  根据时间计算出来的天数
	 * @param {Object} ele  组件对象
	 */
	leaveDaysCheck:function(value, computeDays, ele) {
		
		if (value > computeDays) {
			showToast('天数不正确', 'middle');
			return false;
		} else if (value < 0.5) {
			ele.$root.$refs.num10_584_noempty[0].$emit('input', 0.5*10);
			showToast('最低请假0.5天', 'middle');
			return false;
		} else if (value && (value+'').split('.')[1] && (value+'').split('.')[1] != '5' && (value+'').split('.')[1] != '0') {
			showToast("请假天数需以0.5为倍数");
			return false;
		}else {
			return true;
		}
	},
	/**
	 * 销假模板的天数的校验，
	 * @param {Object} value  天数 
	 * @param {Object} ele  组件对象
	 */
	recallDaysCheck:function(value, ele) {
		if (value < 0.5) {
			ele.$root.$refs.num10_4_noempty[0].$emit('input', 0.5*10);
			showToast('最低销假0.5天', 'middle');
			return false;
		} else if (value && (value+'').split('.')[1] && (value+'').split('.')[1] != '5' && (value+'').split('.')[1] != '0') {
			showToast("销假天数需以0.5为倍数");
			return false;
		}else {
			return true;
		}
	},
    /**
     * 获取确认页面的数据,考勤-补打卡确认页数据
     */
    getConfirmDetail:function(UAId,cpyId,genFlowData,flowId,bisData){
        return cryptPost('staff/queryDetermineInfo.do', {
            'UAId':UAId,
            'cpyId':cpyId,
            'templetId':genFlowData.templetId,
            'flowId':flowId,
            'bisData': bisData,
            'content':genFlowData.content
        });
    },
}
export default new AttendanceHandler();
var timeChangeFlg = false;






