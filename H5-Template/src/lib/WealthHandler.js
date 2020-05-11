import {cryptPost,noCryptPost} from './common/base.js';
import {throttle,getStorage,setStorage,moneyStringFixTwo,sumStrings,openPage} from './common/extend.js';
/**
 * 风险等级map
 */
const riskLevelMap = {
	'1':{id:1,text:'低风险',cls:''},
	'2':{id:2,text:'小风险',cls:''},
	'3':{id:3,text:'中风险',cls:''},
	'4':{id:4,text:'大风险',cls:''},
	'5':{id:5,text:'极大风险',cls:''},
};
const breakEvenMap = {
	'0':{id:0,text:'保本',cls:''},
	'1':{id:1,text:'不保本',cls:''}
};
const totalMap = {
	'1':{id:1,text:'购买金额',cls:''},
	'2':{id:2,text:'赎回金额',cls:''},
	'3':{id:3,text:'',cls:''}
};
var  WealthHandler = function(){
	
}

WealthHandler.prototype = {
	/**
	 * 初始数据
	 */
	init:function(){},
	/**
	 * 格式化财富管理数据  生成风险等级/格式化利率/格式化起购金额
	 * @param {Object} item
	 */
	format:function(item){
		item.riskLevelStr = riskLevelMap[(item.riskLevel || 1)].text;//风险等级
		item.riskClass = riskLevelMap[(item.riskLevel || 1)].cls;//风险等级样式
		item.rateStr = moneyStringFixTwo(item.rate||0).replace(/[^0-9.]*/g,"")+"%";//利率     
		item.startAmountStr = moneyStringFixTwo(item.startAmount);
		if(item.dueTime){
			if(item.dueTime>=30&&item.dueTime%30==0&&item.dueTime<365){
				item.dueTimeStr = item.dueTime/30 + "月";
			}else if(item.dueTime>=365&&item.dueTime%365==0){
				item.dueTimeStr = item.dueTime/365 + "年";
			}else{
				item.dueTimeStr = item.dueTime + "天";
			}
		}
		if(undefined!=item.breakEven){
			item.breakEvenStr = breakEvenMap[item.breakEven].text;
		}
		if(item.amount){
			item.amountStr = moneyStringFixTwo(item.amount);
		}
		if(undefined!=item.interest){
			item.interestStr = moneyStringFixTwo(item.interest);
		}
		if(undefined!=item.amount&&undefined!=item.interest){
			item.totalAmount = moneyStringFixTwo(sumStrings(item.amount,item.interest));
		}
		if(item.tradeType){
			item.totalTitle = totalMap[item.tradeType].text;
			if(1==item.tradeType){//购买
				item.totalAmount = moneyStringFixTwo(item.amount);
			}
		}
		
		return item;
	},
	/**
	 * 打开协议页面
	 */
	openProtocol:function(){
		throttle(function(){
			openPage('yqt.html?active=24');
        }, this);
	}
}

export default new WealthHandler();
