//系统常量相关


/**
 * 配置app,当有多个APP的时候进行配置选择
 */
const App_Config = {
	APP_ID:1,
	APP_NAME:''
};
/**
 * 系统数据常量
 */
const ConstantData = {
	DEFAULT_TEMPLETID :1,//默认模板ID
	GET_PUBACC_URL :'dss/apply/getPubAcc.html',//获取付方账号列表
	LOADING_DEFAULT : "加载中...",
	LOADING_CAL : "计算中...",//loading数字
	DETAIL_URL : "dss.html?active=3&payType=3",//详情也


}


/**
 * //待我发起，我的审批，我的申请，知会我的类型
 */
export const FlowTypeData = {
	/**
	  * //我的申请审批中
	  */
	MY_APPLYING_FLOWTYPE : 1,
	 /**
	  * //我的申请已结束
	  */
	MY_APPLYED_FLOWTYPE : 4,
	/**
	 * //我的处理处理中
	 */
	MY_APPROVING_FLOWTYPE :0,
	/**
	 * //我的处理已处理
	 */
	MY_APPROVED_FLOWTYPE : 2,

	 /**
	  * //知会我
	  */
	NOTIFY_ME_FLOWTYPE :3,
}

/**
 * 模板type
 */
export const TempletTypeData = {
	/**
	 * 行内转账
	 */
	INNERTRANSFER_TEMPLETTYPE: 9 ,
	/**
	 * 跨行转账
	 */
	OUTERTRANSFER_TEMPLETTYPE: 10 ,
	/**
	 * 结算卡
	 */
	CREDCARD_TEMPLETTYPE : 11,
	/**
	 * 数字支票
	 */
	DIGITALCHECK_TEMPLETTYPE : 12,
	/**
	 * 代发工资
	 */
	SALARY_TEMPLETTYPE : 14,
	/**
	 * 定期购买模板类型
	 */
	FINANCIAL_BUY_TEMPLETTYPE : 16,
	/**
	 * 定期赎回模板类型
	 */
	FINANCIAL_REDEEM_TEMPLETTYPE : 17,
	/**
	 * 银企对账相符
	 */
	BALANCE_MATCH_TEMPLETTYPE : 18,
	/**
	 * 银企对账不相符
	 */
	BALANCE_NOTMATCH_TEMPLETTYPE : 19,
	/**
	 * 购买理财  20
	 */
	WEALTH_BUT_TEMPLETTYPE : 20,
	/**
	 * 批量转账  21
	 */
	BATCHTRANSFER_TEMPLETTYPE :21,
	/**
	 * 支票  22,23,24,25,26,27,28
	 */
	DSS_CHECK_TEMPLETTYPE : 22,
	/**
	 * 银行汇票申请书
	 */
	DSS_BANKDRAFT_TEMPLETTYPE : 23,
	/**
	 * 银行本票申请书
	 */
	DSS_BANKERSORDER_TEMPLETTYPE : 24,
	/**
	 * 汇兑凭证
	 */
	DSS_REMITTANCE_TEMPLETTYPE : 25,
	/**
	 * 其他
	 */
	DSS_OTHER_TEMPLETTYPE : 26,
	/**
	 * 禹道卡取现
	 */
	DSS_YUDAOCARD_ENCHASHMENT_TEMPLETTYPE : 27,
	/**
	 * 禹道卡转账
	 */
	DSS_YUDAOCARD_TRANSFER_TEMPLETTYPE : 28
}
/**
 * 支付方式
 */
 export const PayTypeData = {
	/**
	 * 转账支付
	 */
	TRANSFER_TYPE : 1000,
	/**
	 * 票据
	 */
	DSS_TYPE : 1003,
	/**
	 * 结算卡
	 */
	CREDCARD_TYPE : 1001,
	/**
	 * 数字支票
	 */
	DIGITALCHECK_TYPE : 1002,
	/**
	 * 代发工资 
	 */
	SALARY_TYPE : 1200,
	/**
	 * 财富管理 购买
	 */
	WEALTH_BUT_TYPE : 1400,
	/**
	 * 财富管理 赎回 
	 */
	WEALTH_REDEEM_TYPE : 1401,
	/**
	 * 银企对账
	 */
	BALANCE_TYPE : 1300,
	/**
	 * 批量转账
	 */
	//BATCHTRANSFER_TYPE : 9,
	/**
	 * 安全硬件模板支付
	 */
	//DSS_TEMPLET_TYPE : 10
}
 /**
 * 安全硬件模板type
 */
export const TempletPayMap = {
	[TempletTypeData.INNERTRANSFER_TEMPLETTYPE] : PayTypeData.TRANSFER_TYPE,//行内
	[TempletTypeData.OUTERTRANSFER_TEMPLETTYPE] : PayTypeData.TRANSFER_TYPE,//跨行
	[TempletTypeData.CREDCARD_TEMPLETTYPE] : PayTypeData.CREDCARD_TYPE,//结算卡
	[TempletTypeData.DIGITALCHECK_TEMPLETTYPE] : PayTypeData.DIGITALCHECK_TYPE,//数字支票
	[TempletTypeData.SALARY_TEMPLETTYPE] : PayTypeData.SALARY_TYPE,//代发工资
	[TempletTypeData.WEALTH_BUT_TEMPLETTYPE] : PayTypeData.WEALTH_BUT_TYPE,//财富管理 模板购买
	[TempletTypeData.FINANCIAL_BUY_TEMPLETTYPE] : PayTypeData.WEALTH_BUT_TYPE,//财富管理 直接购买
	[TempletTypeData.FINANCIAL_REDEEM_TEMPLETTYPE] : PayTypeData.WEALTH_REDEEM_TYPE,//财富管理 赎回
	[TempletTypeData.BALANCE_MATCH_TEMPLETTYPE] : PayTypeData.BALANCE_TYPE,//银企对账 相符
	[TempletTypeData.BALANCE_NOTMATCH_TEMPLETTYPE] : PayTypeData.BALANCE_TYPE,//银企对账 不相符
	[TempletTypeData.BATCHTRANSFER_TEMPLETTYPE] : PayTypeData.BATCHTRANSFER_TYPE,//批量转账
	[TempletTypeData.DSS_CHECK_TEMPLETTYPE] : PayTypeData.DSS_TEMPLET_TYPE,//安全硬件 支票
	[TempletTypeData.DSS_BANKDRAFT_TEMPLETTYPE] : PayTypeData.DSS_TEMPLET_TYPE,//安全硬件 银行汇票申请书
	[TempletTypeData.DSS_BANKERSORDER_TEMPLETTYPE] : PayTypeData.DSS_TEMPLET_TYPE,//安全硬件 银行本票申请书
	[TempletTypeData.DSS_REMITTANCE_TEMPLETTYPE] : PayTypeData.DSS_TEMPLET_TYPE,//安全硬件 汇兑凭证
	[TempletTypeData.DSS_OTHER_TEMPLETTYPE] : PayTypeData.DSS_TEMPLET_TYPE,//安全硬件 其他
	[TempletTypeData.DSS_YUDAOCARD_ENCHASHMENT_TEMPLETTYPE] : PayTypeData.DSS_TEMPLET_TYPE,//安全硬件 禹道卡取现
	[TempletTypeData.DSS_YUDAOCARD_TRANSFER_TEMPLETTYPE] : PayTypeData.DSS_TEMPLET_TYPE//安全硬件 禹道卡转账
};
/**
 * 支付方式列表
 */
export const PayTypeArr = [
	/**
	 * 转账支付
	 */
	{id:PayTypeData.TRANSFER_TYPE,name:'转账支付'},
	/**
	 * 票据
	 */
	{id:PayTypeData.DSS_TYPE,name:'票据支付'},
	/**
	 * 结算卡
	 */
	{id:PayTypeData.CREDCARD_TYPE,name:'结算卡'},
	/**
	 * 数字支票
	 */
	{id:PayTypeData.DIGITALCHECK_TYPE,name:'数字支票'},
	/**
	 * 代发工资
	 */
	{id:PayTypeData.SALARY_TYPE,name:'代发工资'}
]
/**
 * 票据支付方式
 */
export const billTypeMap = {
	[PayTypeData.DIGITALCHECK_TYPE]:{id:'',value:53},
	[PayTypeData.CREDCARD_TYPE]:{id:'',value:53}
};
/**
 * 票据支付类型
 */
export const billMap = {
    49:{name:'支票'},
    50:{name:'银行汇票申请书'},
    51:{name:'银行本票申请书'},
    52:{name:'汇兑凭证'},
    53:{name:'其他'},
    54:{name:'禹道卡取现'},
    55:{name:'禹道卡转账'}
};
/**
 * oa各服务ip列表
 */
export const oaIpMap = {
	"develop_server_host":{
		//ip:"https://oa.tixin.co:18086",
		ip:"https://tsblackbox.tixin4u.com:18086",
	},
	"heihe_server_host":{
		//ip:"https://oa.tixin.co:18091",
		ip:"https://tsblackbox.tixin4u.com:18091",
	},
	"shahe_server_host":{
		//ip:"https://tssandbox.tixin4u.com:18088",
		ip:"https://tssandbox.tixin4u.com:18088",
	},
	"release_server_host":{
		//ip:"https://oa.tixin4u.com:18080",
		ip:"https://oa.tixin4u.com:18080",
	}
};
/**
 * 根据appBankType取银行名字和icon
 */
export const bankMap = {
	1:{
		name:"厦门银行",
		icon:"4.png" //./resource/img/tempicon/4.png
	},
	2:{
		name:"华夏银行",
		icon:"5.png" //./resource/img/tempicon/5.png
	},
	3:{
		name:"北京银行"
	}
};

/**
 * 转账汇款对象：1-企业  2-个人
 */
export const transObjMap = {
	defaultObj:{id:1,name:'企业'},
	'1':{id:1,name:'企业'},
	'2':{id:2,name:'个人'}
}

/**
 * 转账汇款对象：1-行内 2-跨行
 */
export const transTypeMap = {
	defaultObj:{id:1,name:'行内'},
	[TempletTypeData.INNERTRANSFER_TEMPLETTYPE]:{id:1,name:'行内'},
	[TempletTypeData.OUTERTRANSFER_TEMPLETTYPE]:{id:2,name:'跨行'}
}

/**
 * 转账汇款方式：1-普通  2-实时
 */
export const transMethodMap = {
	defaultMethod:{id:'2',name:'实时'},
	'1':{id:'1',name:'普通'},
	'2':{id:'2',name:'实时'}
}

/**
 * 操作按钮  1 同意,2不同意,3转发4,打回
 */
export const OptTypeData = {
	/**
	 * 同意
	 */
	AGREE_TYPE : 1,
	/**
	 * 不同意 -拒绝
	 */
	DISAGREE_TYPE : 2,
	/**
	 * 转发
	 */
	TRANSMIT_TYPE : 3,
	/**
	 * 打回
	 */
	BEATBACK_TYPE : 4
}

/**
 * 校验安全硬件权限
 */
export const CheckDevTypeData = {
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
}

/**
 * 表单失败详情状态
 */
export const FailPayTypeData = {
	/**
	  * 待支付
	  */
	DETAIL_STATUS_REPAY : 9,
	/*
	 * 支付失败
	 * */
	DETAIL_STATUS_FAIL : 8,

}

/**
 * 草稿操作状态码
 */
export const DraftOptType = {
	/**
	 * 草稿保存
	 */
	DRAFT_SAVE : 1,
	/**
	 * 草稿放弃
	 */
	DRAFT_QUIT : 2
}

/**
 * 催批操作状态码
 */
export const UrgeOptType = {
	/**
	 * 第一种催批信息
	 */
	URGE_FIRST : 1,
	/**
	 * 第二种催批信息
	 */
	URGE_SECOND : 2
}

