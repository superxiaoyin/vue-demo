/**
 * 差旅二级明细处理方法
 */
 
const nomatchDetailList = [
	{
		"displayorder": 1,
		"fieldId": "account",
		"placeholder": "请输入账号（必填）",
		"fieldDispValue": "",
		"fieldname": "账号",
		"fieldKey": "account",
		"displayFlag": true,
		"dataType": "text",
		"frt": {
			"readonly": 'readonly'
		}
	},
{"displayorder":2,
"fieldId":"dealTime","fieldDispValue":"",
"fieldname":"发生日期",
"fieldKey":"dealTime",
"validate":{},
"displayFlag":true,
"dataType":"date",
"formatDate":{"format":"YYYY/MM/DD","serverFormat":"timestamp"}},
	
	{
		"displayorder":3,
		"fieldId": "voucherNo",
		"placeholder": "请输入凭证号码",
		"fieldDispValue": "",
		"fieldname": "凭证号",
		"fieldKey": "voucherNo",
		"displayFlag": true,
		"dataType": "text",
	},
	{"displayorder": 4, 
		"fieldDispValue":"",
		"defaultIndex":"0",
		"dataType":"radio",
		"displayFlag":true,
		"fieldId":"type",
		"validate":{"notEmpty":true},
		"fieldKey":"type",
		"fieldname":"项目类型",
		"radioList":[{"id":"0","text":"我单位账无以下款项","cls":"radio"},{"id":"1","text":"你行账无以下款项","cls":"radio"}]
	},
	{
		"displayorder": 5,
		"fieldId": "debitAmount",
		"placeholder": "请填写借方金额",
		"fieldDispValue": "",
		"fieldname": "借方",
		"fieldKey": "debitAmount",
		"validate": {
		},
		"displayFlag": true,
		"dataType": "money",
	},
	{
		"displayorder": 6,
		"fieldId": "creditAmount",
		"placeholder": "请填写贷方金额",
		"fieldDispValue": "",
		"fieldname": "贷方",
		"fieldKey": "creditAmount",
		"validate": {
		},
		"displayFlag": true,
		"dataType": "money",
	}
];


var SnBalanceHandler = function(){
	this.NomatchDetailList = nomatchDetailList;
};

export default new SnBalanceHandler();