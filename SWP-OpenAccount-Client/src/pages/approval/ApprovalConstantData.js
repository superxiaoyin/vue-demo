 //审批流程 常量相关
 import {getIndexUrl} from '../../lib/common/extend.js';
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
		* //我的审批待审批
	 */
	 MY_APPROVING_FLOWTYPE :0,
	 /**
		* //我的审批已审批
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
		* 打卡异常
		*/
	 CLOCKINABNORMAL_TEMPLETTYPE: 3,
	 /**
		* 费用报销
		*/
	 EXPENSESCLAIM_TEMPLETTYPE: 4,
	 /**
		* 差旅报销
		*/
	 TRAVEL_TEMPLETTYPE: 6,
	 /**
		* 用款
		*/
	 APPLICATIONMONEY_TEMPLETTYPE: 7,
	 /**
		* 借款
		*/
	 BORROWMONEY_TEMPLETTYPE: 10,
	 /**
		* 合同签订
		*/
	 CONTRACTS_TEMPLETTYPE: 14,
	 /**
	 * 采购
	 * */
		 PURCHASE_TEMPLETTYPE: 16,
		 /**
	 * 线下理财购买
	 * */
		 WEALTH_BUY_TEMPLETTYPE: 20,
		 /**
			* 资产申购
			*/
		 PURCHASE_BUY_TEMPLETTYPE: 26,
	 /**
		* 行内转账
		*/
	 INNERTRANSFER_TEMPLETTYPE: 31,
	 /**
		* 跨行转账
		*/
	 OUTERTRANSFER_TEMPLETTYPE: 32 ,
	 /**
		* 结算卡
		*/
	 CREDCARD_TEMPLETTYPE : 33,
	 /**
		* 数字支票
		*/
	 DIGITALCHECK_TEMPLETTYPE : 34,
	 /**
		* 票据支付
		*/
	 BILL_TEMPLETTYPE : 35,
	 /**
		* 代发工资
		*/
	 SALARY_TEMPLETTYPE : 36,
	 /**
		* 业务预约
		*/
	 RESERVATION_TEMPLETTYPE : 37,
	 /**
		* 定期购买模板类型
		*/
	 FINANCIAL_BUY_TEMPLETTYPE : 38,
	 /**
		* 定期赎回模板类型
		*/
	 FINANCIAL_REDEEM_TEMPLETTYPE : 39,
	 /**
		* 银企对账相符 
		*/
	 BALANCE_MATCH_TEMPLETTYPE : 40,
	 /**
		* 银企对账不相符
		*/
	 BALANCE_NOTMATCH_TEMPLETTYPE : 41,
	 /**
		* 购买理财  
		*/
	 WEALTH_BUT_TEMPLETTYPE : 42,
	 /**
		* 批量转账  
		*/
	 BATCHTRANSFER_TEMPLETTYPE :43,
	 /**
		* 支票 
		*/
	 DSS_CHECK_TEMPLETTYPE : 44,
	 /**
		* 银行汇票申请书
		*/
	 DSS_BANKDRAFT_TEMPLETTYPE : 45,
	 /**
		* 银行本票申请书
		*/
	 DSS_BANKERSORDER_TEMPLETTYPE : 46,
	 /**
		* 汇兑凭证
		*/
	 DSS_REMITTANCE_TEMPLETTYPE : 47,
	 /**
		* 其他
		*/
	 DSS_OTHER_TEMPLETTYPE : 48,
	 /**
		* 禹道卡取现
		*/
	 DSS_YUDAOCARD_ENCHASHMENT_TEMPLETTYPE : 49,
	 /**
		* 禹道卡转账
		*/
	 DSS_YUDAOCARD_TRANSFER_TEMPLETTYPE : 50,
		 /**
			* 禹道卡取现五要素	51
			*/
		 DSS_YUDAOCARD_ENCHASHMENT_TEMPLETTYPE_FIVE: 51,
		 /**
			* 禹道卡转账五要素	52
			*/
		 DSS_YUDAOCARD_TRANSFER_TEMPLETTYPE_FIVE: 52,
	 /**
		* 银企对账 
		*/
	 BALANCE_TEMPLETTYPE : 53,
	 /**
		* 固定审批
		*/
	 FIXAPPROVE_TEMPLETTYPE : 57,
	 /**
		* 出差申请
		*/
	 TRAVELAPPLY_TEMPLETTYPE : 58,
	 /**
		* 缴税申请
		*/
	 TEXAPPLY_TEMPLETTYPE : 59,
	 /**
		* 税款缴纳
		*/
	 TEXAPPROVEL_TEMPLETTYPE : 60,
	 /**
		* 工资卡申请,（废弃）
		*/
	 CARDAPPLY_TEMPLETTYPE : 61,
	 /**
		* 公务卡申请,（废弃）
		*/
	 COMPCARDAPPLY_TEMPLETTYPE : 62,
	 /**
		* 大额存款申请表单
		*/
	 STRUCTURE_BUY_TEMPLETTYPE : 63,
		 /**
			* 大额存单赎回表单
			*/
		 STRUCTURE_REDEEM_TEMPLETTYPE : 64,
		 /**
			* 结构性存款购买表单
			*/
		 STRUCTUREDDEPOSIT_BUY_TEMPLETTYPE: 61,
		 /**
			* 结构性存款赎回表单
			*/
		 STRUCTUREDDEPOSIT_REDEEM_TEMPLETTYPE: 62,
		 /**
			* 转账PEW
			*/
		 TRANSFER_PEW_TEMPLETTYPE: 69,
		 /**
			* 跨境汇款
			*/
		 INTER_REMITTANCE_TEMPLETTYPE: 72,
			/**
			* 对公贷款借款业务
			*/
	 LOAN_PAYEE_TEMPLETTYPE: 73,
				/**
			* 对公贷款还款业务
			*/
		 LOAN_PAYER_TEMPLETTYPE: 74,
		 /**
			* 预约转账
			*/
		 TRANSFER_RESERVATION_TEMPLETTYPE: 75,
 
			 /**
			* 通知存款存入
			*/
		 TRANSFER_NOTICE_DEPOSIT_BUY_TEMPLETTYPE: 76,
 
			 /**
			* 通知存款支取
			*/
		 TRANSFER_NOTICE_DEPOSIT_REDEEM_TEMPLETTYPE: 77,
		 
 }
 
 /**
	* 审批历史状态管理
	*/
 export const OptTypeMap = {
	 '0':{text:'打回',clr:''},
	 '1':{text:'同意',clr:'#25CB67'},
	 '2':{text:'不同意',clr:'#eb5757'},
	 '3':{text:'已转交',clr:'#ffb843'},
	 '4':{text:'申请者',clr:'#848484'},
	 '5':{text:'已撤销',clr:''},
	 '6':{text:'审批撤回',clr:''},
	 '7':{text:'支付',clr:''},
	 '8':{text:'驳回',clr:''},
	 '10':{text:'已完成',clr:''},
	 '20':{text:'支付成功',clr:'#25CB67'},
	 '116':{text:'授权成功',clr:'#25CB67'},
	 '126':{text:'签发成功',clr:'#25CB67'}
 }
 
 /**
	* 下一审批人状态管理
	*/
 export const approveOptMap = {
	 [FlowTypeData.MY_APPLYING_FLOWTYPE]:{text:'待审批',clr:'#F8A339'},//我的申请 审批中 增加下一处理人 并且显示状态
	 [FlowTypeData.MY_APPROVING_FLOWTYPE]:{text:'待审批',clr:'#F8A339'},//我的审批 待处理  增加下一处理人 并且显示状态
	 [FlowTypeData.MY_APPROVED_FLOWTYPE]:{text:'',clr:''},//我的审批 已结束 增加下一处理人 不显示状态
	 [FlowTypeData.NOTIFY_ME_FLOWTYPE]:{text:'待审批',clr:'#F8A339'},//知会我  增加下一处理人 并且显示状态
 }
 
 /**
	* 数据状态栏显示
	*/
 export const ListDataMap = {//key与ConstantData中的FlowTypeData一一对应
	 [FlowTypeData.MY_APPLYING_FLOWTYPE] : {text:'当前处理人：',status:false},
	 [FlowTypeData.MY_APPLYED_FLOWTYPE] : {text:'',status:true},
	 [FlowTypeData.MY_APPROVING_FLOWTYPE] : {text:'上一处理人：',status:false},
	 [FlowTypeData.MY_APPROVED_FLOWTYPE] : {text:'',status:true},
	 [FlowTypeData.NOTIFY_ME_FLOWTYPE] : {text:'',status:false}
 };
 
 
 /**
	* 列表状态对应关系
	*/
 export const StatusMap = {
		 0:{statusText:'处理中',cls:'listTitRight fr licolor04'},
		 1:{statusText:'已通过',cls:'listTitRight fr licolor01'},
		 2:{statusText:'未通过',cls:'listTitRight fr licolor02'},
		 3:{statusText:'已撤销',cls:'listTitRight fr licolor03'},
 };
 
 export const LastOptTypeMap = {
		 //我的审批 已审批状态 1-3 ; 已同意/已拒绝/已转发..
		 2000:{statusText:'未操作',cls:'listTitRight fr licolor04'},
		 2001:{statusText:'已同意',cls:'listTitRight fr licolor01'},
		 2002:{statusText:'不同意',cls:'listTitRight fr licolor02'},
		 2003:{statusText:'已转交',cls:'listTitRight fr licolor04'},
		 
 };
 
 /**
	* 确认审批弹窗提示消息
	*/
 export const ApproveConfirmTextMap = {
								 1:'您未选中处理人,是否要结束审批流程并完成支付?',
								 2:'您未选中处理人,是否要结束审批流程?',
								 3:'确定提交吗?'
							 }
 
 /**
	* 列表时间格式化
	*/
 export const TimeMap = {
	 [FlowTypeData.MY_APPLYING_FLOWTYPE] : {id:'applyTime',frt:'yyyy-MM-dd HH:mm'},//我的申请-审批中
	 [FlowTypeData.MY_APPLYED_FLOWTYPE] : {id:'approveTime',frt:'yyyy-MM-dd HH:mm'},//我的申请-已结束
	 [FlowTypeData.MY_APPROVING_FLOWTYPE] : {id:'approveTime',frt:'yyyy-MM-dd HH:mm'},//我的审批-处理中
	 [FlowTypeData.MY_APPROVED_FLOWTYPE] : {id:'approveTime',frt:'yyyy-MM-dd HH:mm'},//我的审批-已处理
	 [FlowTypeData.NOTIFY_ME_FLOWTYPE] : {id:'approveTime',frt:'yyyy-MM-dd HH:mm'}//知会我
 };
 
 
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
	* 操作按钮  1 同意,2不同意,3转发4,申请
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
		* 申请
		*/
	 APPLY_TYPE : 4,
	 /**
		* 申请撤销
		*/
	 RECALL_TYPE : 5,
	 /**
		* 审批撤回
		*/
	 APPROVERECALL_TYPE : 6
 }
 
 
 export const flowOptTypeMap = {
	 default:{url:'approval/getApplyInfo.do'},//流程申请 返回模板信息
	 apply:{url:'approval/getApplyInfo.do'},//流程申请 返回模板信息
	 approve:{url:'approval/getApproveInfo.do'},//流程审批 返回带值的模板信息
	 detail:{url:'approval/getDetailInfo.do'}//流程详情  返回带值的模板信息
 }
 
 
 /**
	* 校验密码器权限
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
		* //其他人员不能操作(不是该企业密码器)
		*/
	 OTHER_FAIL_OTHER_COMPANY : 4,
	 /**
		* //其他人员不能操作(不是该密码器持有人)
		*/
	 OTHER_FAIL_NOT_OWNER : 5,
 }
 
 
 
 /*  支付相关  后续移除  */
 
 /**
	* 支付方式
	*/
	export const PayTypeData = {
	 /**
		* 转账支付
		*/
	 TRANSFER_TYPE : 1,
	 /**
		* 票据
		*/
	 DSS_TYPE : 2,
	 /**
		* 结算卡
		*/
	 CREDCARD_TYPE : 3,
	 /**
		* 数字支票
		*/
	 DIGITALCHECK_TYPE : 4,
	 /**
		* 代发工资  后续需要删除
		*/
	 SALARY_TYPE : 5,
	 /**
		* 财富管理 购买，后续需要删除
		*/
	 WEALTH_BUT_TYPE : 6,
	 /**
		* 财富管理 赎回 ，后续需要删除
		*/
	 WEALTH_REDEEM_TYPE : 7,
	 /**
		* 银企对账，后续需要删除
		*/
	 BALANCE_TYPE : 8,
	 /**
		* 批量转账
		*/
	 BATCHTRANSFER_TYPE : 9,
	 /**
		* 密码器模板支付
		*/
	 DSS_TEMPLET_TYPE : 10
 }
	
 /**
	* 密码器模板type
	*/
 export const TempletPayMap = {
	 [TempletTypeData.INNERTRANSFER_TEMPLETTYPE] : PayTypeData.TRANSFER_TYPE,//行内
	 [TempletTypeData.OUTERTRANSFER_TEMPLETTYPE] : PayTypeData.TRANSFER_TYPE,//跨行
	 [TempletTypeData.INTER_REMITTANCE_TEMPLETTYPE] : PayTypeData.TRANSFER_TYPE,//跨境汇款
	 [TempletTypeData.CREDCARD_TEMPLETTYPE] : PayTypeData.CREDCARD_TYPE,//结算卡
	 [TempletTypeData.DIGITALCHECK_TEMPLETTYPE] : PayTypeData.DIGITALCHECK_TYPE,//数字支票
	 [TempletTypeData.SALARY_TEMPLETTYPE] : PayTypeData.SALARY_TYPE,//代发工资
	 [TempletTypeData.WEALTH_BUT_TEMPLETTYPE] : PayTypeData.WEALTH_BUT_TYPE,//财富管理 模板购买
	 [TempletTypeData.FINANCIAL_BUY_TEMPLETTYPE] : PayTypeData.WEALTH_BUT_TYPE,//财富管理 直接购买
	 [TempletTypeData.FINANCIAL_REDEEM_TEMPLETTYPE] : PayTypeData.WEALTH_REDEEM_TYPE,//财富管理 赎回
	 [TempletTypeData.BALANCE_MATCH_TEMPLETTYPE] : PayTypeData.BALANCE_TYPE,//银企对账 相符
	 [TempletTypeData.BALANCE_NOTMATCH_TEMPLETTYPE] : PayTypeData.BALANCE_TYPE,//银企对账 不相符
	 [TempletTypeData.BATCHTRANSFER_TEMPLETTYPE] : PayTypeData.BATCHTRANSFER_TYPE,//批量转账
	 [TempletTypeData.DSS_CHECK_TEMPLETTYPE] : PayTypeData.DSS_TEMPLET_TYPE,//密码器 支票
	 [TempletTypeData.DSS_BANKDRAFT_TEMPLETTYPE] : PayTypeData.DSS_TEMPLET_TYPE,//密码器 银行汇票申请书
	 [TempletTypeData.DSS_BANKERSORDER_TEMPLETTYPE] : PayTypeData.DSS_TEMPLET_TYPE,//密码器 银行本票申请书
	 [TempletTypeData.DSS_REMITTANCE_TEMPLETTYPE] : PayTypeData.DSS_TEMPLET_TYPE,//密码器 汇兑凭证
	 [TempletTypeData.DSS_OTHER_TEMPLETTYPE] : PayTypeData.DSS_TEMPLET_TYPE,//密码器 其他
	 [TempletTypeData.DSS_YUDAOCARD_ENCHASHMENT_TEMPLETTYPE] : PayTypeData.DSS_TEMPLET_TYPE,//密码器 禹道卡取现
	 [TempletTypeData.DSS_YUDAOCARD_TRANSFER_TEMPLETTYPE] : PayTypeData.DSS_TEMPLET_TYPE//密码器 禹道卡转账
 };
 
 /**
	* 转账汇款对象：1-行内 2-跨行
	*/
 export const transTypeMap = {
	 defaultObj:{id:1,name:'行内'},
	 [TempletTypeData.INNERTRANSFER_TEMPLETTYPE]:{id:1,name:'行内'},
	 [TempletTypeData.OUTERTRANSFER_TEMPLETTYPE]:{id:2,name:'跨行'},
	 [TempletTypeData.INTER_REMITTANCE_TEMPLETTYPE]:{id:2,name:'跨境汇款'},
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
 
 
 export const ApplyApproveData = {
	 /**
		* 申请页面标示
		*/
	 APPLYTYPE: 1,
	 /**
		* 审批页面标示
		*/
	 APPROVETYPE: 2,
	 /**
		* 审批页面标示
		*/
	 DETAILTYPE: 3,
 }
 
 export const ApplyApproveUrlMap = {
	 [ApplyApproveData.APPLYTYPE]:{approvalUrl:'approval/applyAndApprove.do',backUrl:getIndexUrl()},
	 [ApplyApproveData.APPROVETYPE]:{approvalUrl:'approval/approve.do',backUrl:'yqt.do?active=4'},
 }
 
 /**
	* 表单内容最大支持长度
	*/
 export const DataMaxLength = 46300
 
 /**
	* 限额提醒
	*/
 export const AmtLimitData = {
	 /**
		* 单笔限额
		*/
	 SINGLELIMITTYPE: 412001,
	 /**
		* 单日限额
		*/
	 DAILYLIMITTYPE: 412002,
	 /**
		* 日累计交易次数
		*/
	 DAILYCOUNTTYPE: 34025,
	 /**
		* 年限额
		*/
	 YEARLIMITTYPE: 34026,
	 /**
		* 付方账号为黑名单账号
		*/
	 PAYERBLACKLISTTYPE: 34027,
	 /**
		* 收方账号为黑名单账号
		*/
	 PAYEEBLACKLISTTYPE: 34028,
	 /**
		* 限额提醒
		*/
	 BLOCKTRADNOTICETYPE: 34030,
	 /**
		* 单笔头寸限额
		*/
	 SINGLEPOSITIONTYPE: 34031,
	 /**
		* 单日头寸限额
		*/
	 DAILYPOSITIONTYPE: 34032,
 }
 
 /**
	* 跨行转账
	*/
 export const AmountLimit = 5000000
 
 export const BuyNowRate = {
	 1:{
		 1:'86.38',
		 2:'462.02',
		 3:'677.79',
		 4:'778.95',
		 5:'6.2815',
		 6:'871.86',
		 7:'487.57',
		 8:'690.41',
		 9:'511.07',
		 10:'501.55'
	 },
	 2:{
		 1:'86.38',
		 2:'461.81',
		 3:'677.82',
		 4:'779.03',
		 5:'6.2814',
		 6:'872.16',
		 7:'487.54',
		 8:'680.55',
		 9:'511.06',
		 10:'501.54'
	 }
 }
 
 export const SaleNowRate = {
	 1:'85.51', //港币现钞
	 2:'86.12', //港币现汇
	 3:'444.87',//纽元现钞
	 4:'459.46',//纽元现汇
	 5:'670.03',//美元现钞
	 6:'675.58',//美元现汇
	 7:'748.47',//欧元现钞
	 8:'772.92',//欧元现汇
	 9:'6.0375',//日元现钞
	 10:'6.2353',//日元现汇
	 11:'839.93',//英镑现钞
	 12:'867.36',//英镑现汇
	 13:'469.67',//澳元现钞
	 14:'485.08',//澳元现汇
	 15:'664.74',//瑞郎现钞
	 16:'686.45',//瑞郎现汇
	 17:'491.85',//加元现钞
	 18:'507.79',//加元现汇
	 19:'482.11',//新元现钞
	 20:'497.82',//新元现汇
 }