/**
 * 差旅二级明细处理方法
 */
 
const SubSidiaryMap = {  
	'travelLongTransport':{id:1,key:'travelLongTransport',inDetailList:[//长途交通费
		{"displayorder":1,"fieldId":"LTdateDiv1","fieldDispValue":"","fieldname":"发生日期",
			"fieldKey":"LTdateDiv1","validate":{},"displayFlag":true,"dataType":"date",
			"formatDate":{"format":"YYYY/MM/DD","serverFormat":"timestamp"}
		},
		
		{"displayorder":2,"fieldId":"LTusedDiv1","placeholder":"起点","fieldDispValue":"",
			"fieldname":"起点","fieldKey":"LTusedDiv1","validate":{},"maxlength":"200","displayFlag":true,"dataType":"usedDiv","frt":{}
		},
		{"displayorder":3,"fieldId":"LTusedDiv2","placeholder":"目的地","fieldDispValue":"",
		"fieldname":"目的地","fieldKey":"LTusedDiv2","validate":{},"maxlength":"200","displayFlag":true,"dataType":"usedDiv","frt":{}
		},
		{"displayorder":4,"fieldId":"LTinputDiv1","placeholder":"0.00元","fieldDispValue":"","fieldname":"交通费","fieldKey":"LTinputDiv1",
			"dataType":"money","summationFlag":true,"relationFiledIds":"subValue","ssDiaryFlag":true,"cpyPayShowFlag":true},
		{"displayorder":5,"fieldId":"LTinputDiv2","placeholder":"0.00元","fieldDispValue":"","fieldname":"其他杂费","fieldKey":"LTinputDiv2",
			"dataType":"money","summationFlag":true,"relationFiledIds":"subValue","ssDiaryFlag":true,"cpyPayShowFlag":true},
		{"displayorder":6,"fieldId":"LTtextareaDiv1","placeholder":"备注说明","fieldDispValue":"","fieldname":"备注","fieldKey":"LTtextareaDiv1","validate":{},"maxlength":"200","displayFlag":true,"dataType":"text","frt":{}}
	]}, 
	'travelLongTransportAirplane':{id:2,key:'travelLongTransportAirplane',inDetailList:[//长途交通费(飞机)
		{"displayorder":1,"fieldId":"LTdateDiv1","fieldDispValue":"","fieldname":"发生日期","fieldKey":"LTdateDiv1","validate":{},"displayFlag":true,"dataType":"date","formatDate":{"format":"YYYY/MM/DD","serverFormat":"timestamp"}},
		{"displayorder":2,"fieldId":"LTusedDiv1","placeholder":"起点","fieldDispValue":"","fieldname":"起点","fieldKey":"LTusedDiv1","validate":{},"maxlength":"200","displayFlag":true,"dataType":"usedDiv","frt":{}},
		{"displayorder":3,"fieldId":"LTusedDiv2","placeholder":"目的地","fieldDispValue":"","fieldname":"目的地","fieldKey":"LTusedDiv2","validate":{},"maxlength":"200","displayFlag":true,"dataType":"usedDiv","frt":{}},
		{"displayorder":4,"fieldId":"LTinputDiv1","placeholder":"0.00元","fieldDispValue":"","fieldname":"交通费","cpyPayShowFlag":true,"fieldKey":"LTinputDiv1","dataType":"money","summationFlag":true,"relationFiledIds":"subValue","ssDiaryFlag":true},
		{"displayorder":5,"fieldId":"LTinputDiv2","placeholder":"0.00元","fieldDispValue":"","fieldname":"其他杂费","cpyPayShowFlag":true,"fieldKey":"LTinputDiv2","dataType":"money","summationFlag":true,"relationFiledIds":"subValue","ssDiaryFlag":true},
		{"displayorder":6,"fieldId":"LTtextareaDiv1","placeholder":"备注说明","fieldDispValue":"","fieldname":"备注","fieldKey":"LTtextareaDiv1","validate":{},"maxlength":"200","displayFlag":true,"dataType":"text","frt":{}}
	]}, 
	'travelCityTransport':{id:3,key:'travelCityTransport',inDetailList:[//市内交通费
		{"displayorder":1,"fieldId":"CTdateDiv1","fieldDispValue":"","fieldname":"发生日期","fieldKey":"CTdateDiv1","validate":{},"displayFlag":true,"dataType":"date","formatDate":{"format":"YYYY/MM/DD","serverFormat":"timestamp"}},
		{"displayorder":2,"fieldId":"CTusedDiv1","placeholder":"起点","fieldDispValue":"","fieldname":"起点","fieldKey":"CTusedDiv1","validate":{},"maxlength":"200","displayFlag":true,"dataType":"usedDiv","frt":{}},
		{"displayorder":3,"fieldId":"CTusedDiv2","placeholder":"目的地","fieldDispValue":"","fieldname":"目的地","fieldKey":"CTusedDiv2","validate":{},"maxlength":"200","displayFlag":true,"dataType":"usedDiv","frt":{}},
		{"displayorder":4,"fieldId":"CTinputDiv1","placeholder":"0.00元","fieldDispValue":"","fieldname":"交通费","cpyPayShowFlag":true,"fieldKey":"CTinputDiv1","dataType":"money","summationFlag":true,"relationFiledIds":"subValue","ssDiaryFlag":true},
		{"displayorder":5,"fieldId":"CTinputDiv2","placeholder":"0.00元","fieldDispValue":"","fieldname":"其他杂费","cpyPayShowFlag":true,"fieldKey":"CTinputDiv2","dataType":"money","summationFlag":true,"relationFiledIds":"subValue","ssDiaryFlag":true},
		{"displayorder":6,"fieldId":"CTtextareaDiv1","placeholder":"备注说明","fieldDispValue":"","fieldname":"备注","fieldKey":"CTtextareaDiv1", "validate":{},"maxlength":"200","displayFlag":true,"dataType":"text","frt":{}}
	]}, 
	'travelHotelExpense':{id:4,key:'travelHotelExpense',inDetailList:[//住宿费
		{"displayorder":1,"fieldId":"HEdateDiv3","fieldDispValue":"","fieldname":"开始","fieldKey":"HEdateDiv3","daterange":"startDate", "relationFiledIds":["HEdateDiv4","HEinputDiv7"],"intervalhours":"9", "validate":{},"displayFlag":true,"dataType":"date","formatDate":{"format":"YYYY/MM/DD","serverFormat":"timestamp"}},
		{"displayorder":2,"fieldId":"HEdateDiv4","fieldDispValue":"","fieldname":"结束","fieldKey":"HEdateDiv4","daterange":"endDate",  "relationFiledIds":["HEdateDiv3","HEinputDiv7"], "intervalhours":"9", "validate":{},"displayFlag":true,"dataType":"date","formatDate":{"format":"YYYY/MM/DD","serverFormat":"timestamp"}},
		{"displayorder":3,"fieldId":"HEusedDiv5","placeholder":"入住城市","fieldDispValue":"","fieldname":"入住城市","fieldKey":"HEusedDiv5","validate":{},"maxlength":"200","displayFlag":true,"dataType":"usedDiv","frt":{}},
		{"displayorder":4,"fieldId":"HEinputDiv6","placeholder":"入住酒店","fieldDispValue":"","fieldname":"入住酒店","fieldKey":"HEinputDiv6","validate":{},"maxlength":"200","displayFlag":true,"dataType":"usedDiv","frt":{}},
		{"displayorder":5,"fieldId":"HEinputDiv7","placeholder":"入住天数","fieldDispValue":"","fieldname":"入住天数","fieldKey":"HEinputDiv7","validate":{},"unit":"天","dataType":"number","pointlength":"1","displayFlag":true,"frt":{}},
		{"displayorder":6,"fieldId":"HEtextareaDiv12","placeholder":"同住人","fieldDispValue":"","fieldname":"同住人","fieldKey":"HEtextareaDiv12","validate":{},"maxlength":"200","displayFlag":true,"dataType":"text","frt":{}},
		{"displayorder":7,"fieldId":"HEinputDiv9","placeholder":"0.00元","fieldDispValue":"","fieldname":"住宿费","cpyPayShowFlag":true,"fieldKey":"HEinputDiv9","dataType":"money","summationFlag":true,"relationFiledIds":"subValue","ssDiaryFlag":true},
		{"displayorder":8,"fieldId":"HEinputDiv10","placeholder":"0.00元","fieldDispValue":"","fieldname":"其他杂费","cpyPayShowFlag":true,"fieldKey":"HEinputDiv10","dataType":"money","summationFlag":true,"relationFiledIds":"subValue","ssDiaryFlag":true},
		{"displayorder":9,"fieldId":"HEtextareaDiv11","placeholder":"备注说明","fieldDispValue":"","fieldname":"备注","fieldKey":"HEtextareaDiv11","validate":{},"maxlength":"200","displayFlag":true,"dataType":"text","frt":{}}
	]}, 
	'travelHospitalityExpense':{id:5,key:'travelHospitalityExpense',inDetailList:[//招待费
		{"displayorder":1,"fieldId":"HPEdateDiv6","fieldDispValue":"","fieldname":"发生日期","fieldKey":"HPEdateDiv6","validate":{},"displayFlag":true,"dataType":"date","formatDate":{"format":"YYYY/MM/DD","serverFormat":"timestamp"}},
		{"displayorder":2,"fieldId":"HPEinputDiv3","placeholder":"0.00元","fieldDispValue":"","fieldname":"招待费","cpyPayShowFlag":true,"fieldKey":"HPEinputDiv3","dataType":"money","summationFlag":true,"relationFiledIds":"subValue","ssDiaryFlag":true},
		{"displayorder":3,"fieldId":"HPEinputDiv4","placeholder":"0.00元","fieldDispValue":"","fieldname":"其他杂费","cpyPayShowFlag":true,"fieldKey":"HPEinputDiv4","dataType":"money","summationFlag":true,"relationFiledIds":"subValue","ssDiaryFlag":true},
		{"displayorder":4,"fieldId":"HPEtextareaDiv1","placeholder":"备注说明","fieldDispValue":"","fieldname":"备注","fieldKey":"HPEtextareaDiv1","validate":{},"maxlength":"200","displayFlag":true,"dataType":"text","frt":{}}
	]},
	'travelAllowance':{id:4,key:'travelAllowance',inDetailList:[//出差补助
		{"displayorder":1,"fieldId":"TAdateDiv3","fieldDispValue":"","fieldname":"开始","fieldKey":"TAdateDiv3","validate":{},"daterange":"startDate", "relationFiledIds":["TAdateDiv4","TAinputDiv7"],"intervalhours":"9", "displayFlag":true,"dataType":"date","formatDate":{"format":"YYYY/MM/DD","serverFormat":"timestamp"}},
		{"displayorder":2,"fieldId":"TAdateDiv4","fieldDispValue":"","fieldname":"结束","fieldKey":"TAdateDiv4","validate":{},"daterange":"endDate", "relationFiledIds":["TAdateDiv3","TAinputDiv7"],"intervalhours":"9","displayFlag":true,"dataType":"date","formatDate":{"format":"YYYY/MM/DD","serverFormat":"timestamp"}},
		{"displayorder":3,"fieldId":"TAusedDiv5","placeholder":"出差地","fieldDispValue":"","fieldname":"出差地","fieldKey":"TAusedDiv5","validate":{},"maxlength":"200","displayFlag":true,"dataType":"usedDiv","frt":{}},
		{"displayorder":4,"fieldId":"TAinputDiv7","placeholder":"出差天数","fieldDispValue":"","fieldname":"出差天数","fieldKey":"TAinputDiv7","validate":{},"unit":"天","dataType":"number","displayFlag":true,"frt":{}},
		{"displayorder":5,"fieldId":"TAinputDiv9","placeholder":"0.00元","fieldDispValue":"","fieldname":"补助费","cpyPayShowFlag":true,"fieldKey":"TAinputDiv9","dataType":"money","summationFlag":true,"relationFiledIds":"subValue","ssDiaryFlag":true},
		{"displayorder":6,"fieldId":"TAinputDiv10","placeholder":"0.00元","fieldDispValue":"","fieldname":"其他杂费","cpyPayShowFlag":true,"fieldKey":"TAinputDiv10","dataType":"money","summationFlag":true,"relationFiledIds":"subValue","ssDiaryFlag":true},
		{"displayorder":7,"fieldId":"TAtextareaDiv11","placeholder":"备注说明","fieldDispValue":"","fieldname":"备注","fieldKey":"TAtextareaDiv11","validate":{},"maxlength":"200","displayFlag":true,"dataType":"text","frt":{}}
	]},
	'travelOtherExpense':{id:5,key:'travelOtherExpense',inDetailList:[//其他杂项
		{"displayorder":1,"fieldId":"OEdateDiv1","fieldDispValue":"","fieldname":"发生日期","fieldKey":"OEdateDiv1","validate":{},"displayFlag":true,"dataType":"date","formatDate":{"format":"YYYY/MM/DD","serverFormat":"timestamp"}},
		{"displayorder":2,"fieldId":"OEinputDiv1","placeholder":"0.00元","fieldDispValue":"","fieldname":"其他杂费","cpyPayShowFlag":true,"fieldKey":"OEinputDiv1","dataType":"money","summationFlag":true,"relationFiledIds":"subValue","ssDiaryFlag":true},
		{"displayorder":3,"fieldId":"OEtextareaDiv1","placeholder":"备注说明","fieldDispValue":"","fieldname":"备注","fieldKey":"OEtextareaDiv1","validate":{},"maxlength":"200","displayFlag":true,"dataType":"text","frt":{}}
	]}
};


var SnSubsidiaryHandler = function(){
	this.SubSidiaryMap = SubSidiaryMap;
};

export default new SnSubsidiaryHandler();