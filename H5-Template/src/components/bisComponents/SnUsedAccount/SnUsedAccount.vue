<template>
	<div class="snUsedAccountDiv">
		<div v-show="divFlag=='start'">
	        <cell :title="title" value-align="left">
	        	<input ref="input" 
		    	:relationFiledIds="relationFiledIds" 
		    	:maxlength='maxlength'
		    	:minlength='minlength'
		    	:placeholder="placeholder"
		    	:readonly="readonly"
		    	:autocomp='autocomp' 
		    	v-on:blur="blurFrtValue($event.target.value)" 
		    	v-on:input="inputNumFrtValue($event.target.value)" />
	        	<a class="button-detail" @click="openPopup">常用</a>
	        </cell>
	    
	        <popup  v-model="popupShowFlag" position="right" width="100%">
	            <div class="position-horizontal-demo sn-main-con popupDebit usedAccountLineWarp">
					<SnSearch @searchInfo="searchUsed" v-model="searchKey" isEmpty=true></SnSearch>
	            	<!-- list里面的参数为 src-图标  title-显示数据 value-返回数据-->
	            	<!-- list里面的参数为 src-图标  title-显示数据 value-返回数据-->
	                <!--<panel :list="dataList"  type="1" @on-click-item="choosedItem" @on-img-error="onImgError"></panel>-->
					<div class="card">
						<div class="tit">
							<span class="card-title">我的银行卡</span>
							<span class="card-num">{{userName}}({{cardList.length}}张)</span>
							<em class="button-icon" v-if="displayCardFlag"></em>
							<em class="button-icon up" v-else-if="!displayCardFlag"></em>
						</div>
						<div v-show="displayCardFlag">
							<div class="query-item-content" v-for="(queryItem,index) in cardList" :key="index" @click="choosedItem(queryItem)">
								<div class="card-header">
									<span class="header-number">{{queryItem.bankName}}</span>
								</div>
								<div class="card-content">
									<span class="bankName-list">{{formatAccount(queryItem.cardNumber)}}</span>
								</div>
							</div>
						</div>
					</div>
					<div class="used-account">	
						<div class="tit">
							<span class="used-title">常用</span>
						</div>					
						<div v-if="!ispc">
							<swipeout class="lineWrap">
								<div class="query-item-content" v-for="(queryItem,index) in dataList" :key="index" @click="choosedItem(queryItem)">
									<swipeout-item class="line icon5" transition-mode="follow">
										<div slot="right-menu">
											<swipeout-button @click.native.stop="beforeDel(queryItem,index)" type="warn" class="delbut">删除</swipeout-button>
										</div>
										<div slot="content" class="demo-content vux-1px-t linetext">
											<div class="card-header">
												<span class="header-number">{{queryItem.accountInfo.name}}</span>
											</div>
											<div class="card-content">
												<span class="bankName-list">{{queryItem.accountInfo.branchDisplay||queryItem.accountInfo.bankDisplay||bankName}}</span>
												<span class="account-list">{{formatAccount(queryItem.accountInfo.account)}}</span>
											</div>
										</div>
									</swipeout-item>
								</div>
							</swipeout>
						</div>
						<div v-if="ispc">
							<div class="query-item-content" v-for="(queryItem,index) in dataList" :key="index" @click="choosedItem(queryItem)">
								<div class="card-header">
									<span class="header-number">{{queryItem.accountInfo.name}}</span>
								</div>
								<div class="card-content">
									<span>{{queryItem.accountInfo.branchDisplay||queryItem.accountInfo.bankDisplay||bankName}}</span>
									<span class="account-list">{{queryItem.accountInfo.account}}</span>
								</div>
							</div>
						</div>
					</div>
	            </div>
	            
	        </popup>
	    </div>    
	</div>
</template>
<style lang="less" src="./SnUsedAccount.less"></style>
<script>
	import {Group,Popup, PopupHeader,Panel,Cell,XSwitch,XTextarea, Swipeout, SwipeoutItem, SwipeoutButton} from 'vux';
	import {nativeInfo,cryptPost} from '../../../lib/common/base.js';
	import {showToast,setStorage,getStorage,initTitleMenu,setTitleOnly,isPC,getBankConfig,showConfirm} from '../../../lib/common/extend.js';
	import UsedManagment from '../../../lib/UsedHandler.js';
	import {TempletTypeData} from '../../../pages/approval/ApprovalConstantData.js';
	import { GetUserInfoFunction } from '../../../lib/common/SnJsBridge.js';
	import SnSearch from '../../baseComponents/SnSearch/SnSearch.vue';
    export default {
    	components: {
			Swipeout,
			SwipeoutItem,
			SwipeoutButton,
    		Group,
		    Popup, 
		    PopupHeader,
		    Panel,
		    Cell,
		    XSwitch,
			XTextarea,
			SnSearch
	    },
	    data:function(){
	    	return {
	    		selectedValue:'',
	    		popupShowFlag:false,
	    		stringValue: '0',
	    		emClass:"usedCountUnchecked",
	    		usedaccountflag:1,
				delayShow:0,//等待键盘收起再弹出下拉框
				ispc: false,
				cardList: [],//银行卡列表
				bakUsedList: [],//备份原始查询常用列表
				bakCardList: [],//备份原始查询银行卡列表
				userName:'',
				displayCardFlag: true,
				searchKey: '',
				bankName: '',
           		bankId: -1,
	    	}
	    },
        props: {
            title:{//title
                type:String,
                default: ""
            },
            subTitle:{
            	type: Array,
		        default () {
		            return []
		        }
            },
            dataList: {//list数据
		      type: Array,
		      default () {
		        return []
		      }
		    },
		    value:{
		    	type:Number
		    },
		    funName:{//传递进来的方法名
		    	type:String,
                default: ""
		    },
		    columns:{
		    	type:Number,
                default: 1
		    },
		    placeholder:{//控件提示
		    	type:String,
                default: ""
		    },
		    noTips:{//为空提示信息
		    	type:String,
                default: "暂无常用选项"
		    },
//		    backUrl:{//点击返回时返回的url
//		    	type:String,
//              default: "yqt.do?active=1"//默认返回银企通首页
//		    },
		    hasDefault:{//默认值，默认为没有
		    	type:Boolean,
		    	required: true,
                default: false
		    },
		    selectFlag:{
		    	type:Object,
		    	default:{'show':false}
		    },
		    flag:{
		    	type:Boolean,
                default: true
		    },
		    cssClass:{
		    	type:String,
                default: ""
		    },
		    relationFiledIds:{
            	type:Array
            },
		    storageKey:{
		    	type:String,
                default: ''
		    },
		    templetType:{
		    	type:String,
                default: ""
		    },
		    divFlag:{
		    	type:String,
                default: "start"
		    },
		    displayKeys:{
            	type:Array
            },
		    isInDetailFlag:{//是否明细组件 默认为否
            	type:Boolean,
            	default:false
            },
		    idx:{ //组件的index
            	type:Number
            },
            maxlength:{
            	type:Number
            },
            usedSaveFlag:{//是否保存常用 默认为否
            	type:Boolean,
            	default:false
            },
            usedFlag:{//是否保存常用 默认为否
            	type:Boolean,
            	default:false
            },
		    
        },
        beforeCreate: function(){
        	
        },
        created:function () {
/*        	var _this = this;
        	if(_this.templetType == TempletTypeData.BATCHTRANSFER_TEMPLETTYPE){
        		if(_this.$parent.$refs.transType[_this.idx].checkedIndex == "1"){
        			_this.templetType = TempletTypeData.INNERTRANSFER_TEMPLETTYPE;
        		}else if(_this.$parent.$refs.transType[_this.idx].checkedIndex == "2"){
        			_this.templetType = TempletTypeData.OUTERTRANSFER_TEMPLETTYPE;
        		}
        	}
        	_this.usedAccountFlag = 0;
        	_this.storageKey = 'UAId' + nativeInfo.UAId + 'cpyId' + nativeInfo.cpyId + 'storageKey';
        	var storageValue = getStorage('templetType'+_this.templetType+_this.storageKey);
        	if(storageValue){
        		_this.dataList = JSON.parse(storageValue);
        	}else{
        		_this.dataList = [];
        	}*/
			var _this = this;
			if (isPC()) {
				_this.ispc = true;
			}
			getBankConfig().then(result => {
				if (!!result) {
					let bankconfig = result;
					_this.bankName = bankconfig.bankName;
					_this.bankId = bankconfig.bankId;
				}
				_this.userName = nativeInfo.UAName;
				_this.nativeInfo = nativeInfo;
				let transferStatus = getStorage('transferStatus');
				if('false' == transferStatus || !getStorage('transferStatus')){
					_this.transferUse(result);
				}else{
					_this.setNewList(result);
				}
			});
        },
        mounted:function(){//存在value,显示value  供存草稿使用
        	var _this = this;
        	if(this.value){
        		this.$refs.input.value = this.value;
        		_this.showBankList(_this.value);
        	}else{
        		_this.$emit('showBank', false);
        	}
        	//检测键盘是否弹起并设置下拉框弹出延时
        	$(document).on("focus","input,textarea",function(){
        		_this.delayShow = 450;			
			})
        	$(document).on("blur","input,textarea",function(){
        		setTimeout(function(){
        			_this.delayShow = 0;
        		},500)        					
			})
			$(document).on("click", ".tit", function () {
				$(this).find(".button-icon").toggleClass("up");
				$(this).next(".card .query-item-content").stop().slideToggle();
				var displayCardFlag = _this.displayCardFlag;
				if (displayCardFlag) {
					setTimeout(function () {
						_this.displayCardFlag = false;
					}, 400)
				} else {
					_this.displayCardFlag = true;
				}
			});
        },
        methods: {
			/**
			 * 打开选择页面
			 */
			openPopup:function(){
				var _this = this;
				getBankConfig().then(result => {
					_this.setNewList(result);

						//等待键盘收起再弹出下拉框
	        			if(isPC()){
	        				_this.popupShowFlag = true;
	        			}else{
		         			setTimeout(function(){
		        				_this.popupShowFlag = true;
		        				_this.delayShow = 0;
		        			},_this.delayShow);       				
	        			}         			         			         			
		        		//打开二级页面记住一级页面滚动位 置
		        		var bodyScrTop = $("body").scrollTop();
						$("body").css({
						    'overflow':'hidden',
						    'position': 'fixed',
						    'top': bodyScrTop*-1
						});	
						$("body").attr("bodyScrTop",bodyScrTop);
						_this.selectFlag.show = true;
						setTitleOnly("选择常用收款账户");

				});
			},
			/**
			 * 选择常用选项
			 * @param {Object} item
			 */
			choosedItem:function(item){
				var _this = this;
            	_this.setBodysrcTop();
            	this.selectFlag.show = false;
            	_this.$parent.usedFlag = false;
            	setTimeout(()=>{
					_this.setRelationField(item);//控件显示值
					if(!!item.accountInfo){
						_this.$emit('input', item.accountInfo.account);//控件返回值
					}else{
						_this.$emit('input', item.cardNumber);//控件返回值
					}
            		initTitleMenu(_this.subTitle);//设置title及按钮
            	},300)
            },
            /**
             * 设置关联控件值
             * @param {Object} item
             */
            setRelationField:function(item){
				var _this = this;
				let relationObj = item;
            	if(!!item && !!item.accountInfo){
					relationObj = item.accountInfo;
				}
            	if(relationObj){
            		let frontStatus = !!_this.$root.$refs.subSelect
							&&!!_this.$root.$refs.subSelect[0].$refs.nextOpr;
        			//如果在明细中，需要区分
					if(_this.isInDetailFlag){//明细
						for(var key in relationObj){
							_this.$root.content.inDetail[_this.idx][key] = relationObj[key];//设置明细控件值
							//content值无法直接作用到页面，需要针对控件赋值
							if(_this.$parent.$refs[key]){
//								for(i=0;i<_this.$root.content.inDetail.length;i++){
//									_this.$root.content.inDetail[i][key]
//									_this.$parent.$refs[key][i].value = relationObj[key];
//								}
//								if(_this.$root.content.inDetail[_this.idx][key]){
//									_this.$parent.$refs[key][_this.idx].value = relationObj[key];
//								}
//								_this.$parent.$refs[key][_this.idx].value = relationObj[key];
							_this.$parent.usedFlag = true;
//							_this.$root.content.inDetail = JSON.parse(JSON.stringify(_this.$root.content.inDetail));
							}
						}
					} else {
						for(var key in relationObj){
							_this.$root.content[key] = relationObj[key];//设置明细控件值
							if(key == 'city'){
								_this.$root.content['cityName'] = relationObj[key];
							}
						}
						if(!!relationObj['name']){
							_this.$root.content['payeeName'] = relationObj['name'];
							if(frontStatus&&!!_this.$root.$refs.subSelect[0].$refs.nextOpr.$refs.payeeName){
								_this.$root.$refs.subSelect[0].$refs.nextOpr.$refs.payeeName[0].value = relationObj['name'];
								_this.$root.$refs.subSelect[0].$refs.nextOpr.nextOprData.payeeName = relationObj['name'];
							}
						}
						if(!!relationObj['bank']){
							_this.$root.content['bankValue'] = relationObj['bank'];
							if(frontStatus&&!!_this.$root.$refs.subSelect[0].$refs.nextOpr.$refs.bankValue){
								_this.$root.$refs.subSelect[0].$refs.nextOpr.$refs.bankValue[0].current['dispValue'] = relationObj['bankDisplay'];
								_this.$root.$refs.subSelect[0].$refs.nextOpr.$refs.bankValue[0].current['bankId'] = relationObj['bank'];
								_this.$root.$refs.subSelect[0].$refs.nextOpr.nextOprData.bankValue = relationObj['bank'];
							}else if(frontStatus&&!!_this.$root.$refs.subSelect[0].$refs.nextOpr.$refs.bankDisplay){
								_this.$root.$refs.subSelect[0].$refs.nextOpr.$refs.bankDisplay[0].value = relationObj['bankDisplay'];
								_this.$root.$refs.subSelect[0].$refs.nextOpr.nextOprData.bankDisplay = relationObj['bankDisplay'];
							}
						}else if(!!relationObj['bankMemberId']){
							_this.$root.content['bankValue'] = relationObj['bankMemberId'];
							if(frontStatus&&!!_this.$root.$refs.subSelect[0].$refs.nextOpr.$refs.bankValue){
								_this.$root.$refs.subSelect[0].$refs.nextOpr.$refs.bankValue[0].current['dispValue'] = relationObj['bankName'];
								_this.$root.$refs.subSelect[0].$refs.nextOpr.$refs.bankValue[0].current['bankId'] = relationObj['bankMemberId'];
								_this.$root.$refs.subSelect[0].$refs.nextOpr.nextOprData.bankValue = relationObj['bankMemberId'];
							}else if(frontStatus&&!!_this.$root.$refs.subSelect[0].$refs.nextOpr.$refs.bankDisplay){
								_this.$root.$refs.subSelect[0].$refs.nextOpr.$refs.bankDisplay[0].value = relationObj['bankName'];
								_this.$root.$refs.subSelect[0].$refs.nextOpr.nextOprData.bankDisplay = relationObj['bankName'];
							}
						}else if(!!relationObj['bankCode']){
							_this.$root.content['bankValue'] = relationObj['bankCode'];
						}
						if(!!relationObj['city']&&_this.$root.interBankFlag){
							_this.$root.content['cityName'] = relationObj['city'];
							if(frontStatus&&!!_this.$root.$refs.subSelect[0].$refs.nextOpr.$refs.cityName){
								_this.$root.$refs.subSelect[0].$refs.nextOpr.$refs.cityName[0].value = relationObj['city'];
								_this.$root.$refs.subSelect[0].$refs.nextOpr.nextOprData.cityName = relationObj['city'];
								_this.$root.$refs.subSelect[0].$refs.nextOpr.nextOprData.cityDisplay = relationObj['cityDisplay'];
							}
						}
						if(!!relationObj['branch']&&_this.$root.interBankFlag){
							if(frontStatus&&!!_this.$root.$refs.subSelect[0].$refs.nextOpr.$refs.branch){
								_this.$root.$refs.subSelect[0].$refs.nextOpr.$refs.branch[0].current['branchName'] = relationObj['branchDisplay'];
								_this.$root.$refs.subSelect[0].$refs.nextOpr.$refs.branch[0].current['branchId'] = relationObj['branch'];
								_this.$root.$refs.subSelect[0].$refs.nextOpr.nextOprData.branch = relationObj['branch'];
								_this.$root.$refs.subSelect[0].$refs.nextOpr.nextOprData.branchDisplay = relationObj['branchDisplay'];
							}
						}
						// getBankConfig().then(result => {
						// 	if(_this.$root.content.bankValue&&_this.$root.content.bankValue!=result.bankId){
						// 		_this.$root.transferFlag = true;
						// 		if(relationObj.branch){
						// 			_this.$root.interBankFlag = true;
						// 		}else{
						// 			_this.$root.interBankFlag = false;
						// 		}
						// 	}else{
						// 		_this.$root.transferFlag = false;
						// 		if(!relationObj.branch){
						// 			_this.$root.interBankFlag = false;
						// 		}
						// 	}
						// });
					}
					if(!!relationObj.account){
						_this.$refs.input.value = relationObj.account;
						// _this.$root.content['payeeAccount'] = relationObj.account;
						// if(frontStatus&&!!_this.$root.$refs.subSelect[0].$refs.nextOpr.$refs.payeeAccount){
						// 	_this.$root.$refs.subSelect[0].$refs.nextOpr.$refs.payeeAccount[0].value = relationObj['account'];
						// 	_this.$root.$refs.subSelect[0].$refs.nextOpr.nextOprData.payeeAccount = relationObj['account'];
						// }
		        	}else if(!!relationObj.cardNumber){
						_this.$refs.input.value = relationObj.cardNumber;
					}
            	}
            },
            /**
             * 开启/关闭常用账户保存
             */
            addUsedAccount:function(){
            	var _this = this;
				if(0==_this.usedAccountFlag){
					_this.usedAccountFlag = 1;
					_this.emClass = "usedCountChecked";
					if(_this.isInDetailFlag){//明细
						_this.$root.usedIndetail[_this.idx] = _this.idx;
					} else {
						_this.$root.usedFlag = true;
					}
				}else{
					_this.usedAccountFlag = 0;
					_this.emClass = "usedCountUnchecked";
					if(_this.isInDetailFlag){//明细
						delete _this.$root.usedIndetail[_this.idx];
					} else {
						_this.$root.usedFlag = false;
					}
				}
			},
			/**
			 * 存储常用账户
			 */
			saveUsed:function(type){
				var _this = this;
				if(type){
					_this.templetType = type;
				}
				_this.storageKey = 'UAId' + nativeInfo.UAId + 'cpyId' + nativeInfo.cpyId + 'storageKey';
				if(_this.isInDetailFlag){//明细
					//替换新的常用账户存储
                	UsedManagment.addCommonlyUsedAccount(_this.$root.content.inDetail[_this.idx]);
				   	// UsedManagment.saveUsedAccount(_this.$root.content.inDetail[_this.idx],'templetType'+_this.templetType+_this.storageKey,_this.displayKeys,_this.relationFiledIds);
				} else {
					//替换新的常用账户存储
                	UsedManagment.addCommonlyUsedAccount(_this.$root.content);
					// UsedManagment.saveUsedAccount(_this.$root.content,'templetType'+_this.templetType+_this.storageKey,_this.displayKeys,_this.relationFiledIds);
				}
			},
			/**
			 * 删除常用
			 * @param {Object} item
			 */
			delUsed:function(item){
				var _this = this;
				for(var i=0;i<_this.dataList.length;i++){
					if(item.title==_this.dataList[i].title){
						//UsedManagment.deleteUsed(i,'templetType'+_this.templetType+_this.storageKey);
						//_this.dataList.splice(i,1);
						UsedManagment.delIntegrationDataList(nativeInfo.UAId, nativeInfo.cpyId,_this.templetType,'templetType',i,item.title);
					}
				}
				getBankConfig().then(result => {
					_this.setNewList(result);
					if(0==_this.dataList.length){
						_this.setBodysrcTop();
						_this.selectFlag.show = false;
						setTimeout(()=>{
		            		initTitleMenu(_this.subTitle);//设置title及按钮
		            	},500);
					}
				});
			},
			clearRelationField:function(){
				var _this = this;
            	
    			//如果在明细中，需要区分
				if(_this.isInDetailFlag){//明细
					delete _this.$root.content.inDetail[_this.idx].cityDisplay;
					delete _this.$root.content.inDetail[_this.idx].branchDisplay;
					delete _this.$root.content.inDetail[_this.idx].bankDisplay;
					for(var i=0;i<_this.relationFiledIds.length;i++){
						var key = _this.relationFiledIds[i];
						delete _this.$root.content.inDetail[_this.idx][key];
						if(_this.$parent.$refs[key]&&_this.$parent.$refs[key][0]){
							_this.$parent.$refs[key][0].value = '';
						}
					}
				}
			},
            /*             
             * 设置页面body滚动高度，用于显示隐藏二级页面时保持一级页面的高度
             * */
            setBodysrcTop:function(){
			    //关闭二级页面设置一级页面滚动位置
    			$("body").css({
				    'overflow':'auto',
				    'position': 'static',
				    'top': 'auto'
				});
				$("body").scrollTop($("body").attr("bodyScrTop"));
            },
            /**
             * 重新读取并设置常用账户选择列表
             */
            setNewList:function(bankInfo){
				var _this = this;
				let frontStatus = !!_this.$root.$refs.subSelect
							&&!!_this.$root.$refs.subSelect[0].$refs.nextOpr;
				let payType = "1";
				if(frontStatus){
					payType = _this.$root.$refs.subSelect[0].$refs.nextOpr.nextOprData.payType;
				}
				cryptPost('approval/queryCommonlyUsedAccount.do', {}).then(function(result){
					_this.dataList = result.accountList;
					for (let index = 0; index < _this.dataList.length; index++) {
						let used = _this.dataList[index].accountInfo;
						used['showStatus'] = true;
						if((31==_this.templetType||'1'==payType)&&bankInfo.bankId != used.bank){
							used['showStatus'] = false;
							_this.dataList.splice(index,1);
							index--;
						}else if((32==_this.templetType||'2'==payType)&&(!used.bank||used.bank==bankInfo.bankId)){
							used['showStatus'] = false;
							_this.dataList.splice(index,1);
							index--;
						}
					}
					_this.bakUsedList = JSON.parse(JSON.stringify(_this.dataList));
				});
				cryptPost('approval/queryCardList.do', {}).then(function(result){
					_this.cardList = result.cardList;
					_this.bakCardList = JSON.parse(JSON.stringify(_this.cardList));
				});
//             	if(_this.templetType == TempletTypeData.BATCHTRANSFER_TEMPLETTYPE){
// 	        		if(_this.$parent.$refs.transType[_this.idx].checkedIndex == "1"){
// 	        			_this.templetType = TempletTypeData.INNERTRANSFER_TEMPLETTYPE;
// 	        		}else if(_this.$parent.$refs.transType[_this.idx].checkedIndex == "2"){
// 	        			_this.templetType = TempletTypeData.OUTERTRANSFER_TEMPLETTYPE;
// 	        		}
// 	        	}
// 	        	_this.usedAccountFlag = 0;
// /*	        	_this.storageKey = 'UAId' + nativeInfo.UAId + 'cpyId' + nativeInfo.cpyId + 'storageKey';
// 	        	var storageValue = getStorage('templetType'+_this.templetType+_this.storageKey);
// 	        	if(storageValue){
// 	        		_this.dataList = JSON.parse(storageValue);
// 	        	}else{
// 	        		_this.dataList = [];
// 	        	}*/
	        	
// 	        	var templetStr = 'templetType';
//         		this.dataList = UsedManagment.getIntegrationDataList(nativeInfo.UAId, nativeInfo.cpyId, this.templetType, templetStr, bankInfo);
			},
			searchUsed:function(key){
				let _this = this;
				let searchedCardList = [];
				let searchedUsedList = [];
				if(!!key){
					//匹配银行卡
					for (let index = 0; index < _this.cardList.length; index++) {
						let card = _this.cardList[index];
						let isContain = false;
						if(!!card.bankName&&card.bankName.indexOf(key) > -1){
							isContain = true;
						}else if(!!card.cardNumber&&card.cardNumber.indexOf(key) > -1){
							isContain = true;
						}
						//如果匹配到搜索内容
						if(isContain){
							searchedCardList.push(card);
						}
					}
					//匹配常用账户
					for (let index = 0; index < _this.dataList.length; index++) {
						let tempAccount = _this.dataList[index].accountInfo;
						let isContain = false;
						if(!!tempAccount.name&&tempAccount.name.indexOf(key) > -1){
							isContain = true;	
						}else if(!!tempAccount.bankDisplay&&tempAccount.bankDisplay.indexOf(key) > -1){
							isContain = true;
						}else if(!!tempAccount.branchDisplay&&tempAccount.branchDisplay.indexOf(key) > -1){
							isContain = true;
						}else if(!!tempAccount.account&&tempAccount.account.indexOf(key) > -1){
							isContain = true;
						}
						//如果匹配到搜索内容
						if(isContain){
							searchedUsedList.push({'accountInfo':tempAccount});
						}
					}
					_this.cardList = searchedCardList;
					_this.dataList = searchedUsedList;
				}else{
					_this.cardList = JSON.parse(JSON.stringify(_this.bakCardList));
					_this.dataList = JSON.parse(JSON.stringify(_this.bakUsedList));
				}
			},
            /**
			 * input输入时对数据进行格式化
			 * @param {Object} value
			 */
			inputNumFrtValue:function(value){
				var result = '';
				result = (value+'').replace(/[^\d]/g,"");
				this.inputFlag = true;
				//不能超过maxlength位数
				if(value.length > this.maxlength){
					result = value.slice(0,this.maxlength);
				}
				this.$refs.input.value = result;
				this.$emit('input',result);
			},
			/**
			 * 失去焦点时反查账号归属银行
			 * @param {Object} value
			 */
			blurFrtValue:function(value){
				let _this = this;
				if(value){
					_this.showBankList(value);
				}
			},
			showBankList:function(value){
				let _this = this;
				if(_this.templetType == TempletTypeData.TRANSFER_PEW_TEMPLETTYPE || _this.templetType == TempletTypeData.TRANSFER_RESERVATION_TEMPLETTYPE){
					_this.queryCardBelongBank(value).then(function(res){
	                   if(!!res&&!!res.bankMemberId){
	                   	   let bankId = res.bankMemberId;
	                       getBankConfig().then(result=>{
								if(bankId!=result.bankId){
									_this.$emit('showBank', true);
								}else{
									_this.$emit('showBank', false);
								}
	                       });
	                    }else{
	                    	_this.$emit('showBank', true);
	                    }
	                });
				}
			},
			queryCardBelongBank:function(cardNo){
               return cryptPost('approval/queryCardBelongBank.do',{cardNo:cardNo}).then(function(data){
                    return data;
                });
			},
			beforeDel(item,index) {
				let _this = this;
				showConfirm("确定删除该常用账户？", function () {
					// 确定删除
					_this.delAccount(item.accountInfo,index);
				}, 2, '取消', '确定');
			},
			delAccount(item,index) {
				let _this = this;
				let delAccount = {'account': item.account};
				let outerDelAccount = {'accountInfo':delAccount,'genre':0};
				let delAccountList = [];
				delAccountList.push(outerDelAccount);
				cryptPost('approval/delCommonlyUsedAccount.do', {
					'accountList': delAccountList
				}).then(function(result){
					showToast('删除成功', 'middle');
					_this.dataList.splice(index,1);
				});
				// let newStorageKey = "usedAccount-UAId_" + _this.nativeInfo.UAId + "-cpyId_" + _this.nativeInfo.cpyId;
				// if (getStorage(newStorageKey)) {
				// 	let oldData = JSON.parse(getStorage(newStorageKey));
				// 	for (var i = 0; i < oldData.length; i++) {
				// 		//删除常用账户
				// 		if (item.title == oldData[i].title) {
				// 			oldData.splice(i, 1);
				// 			setStorage(newStorageKey, JSON.stringify(oldData));
				// 			showToast('删除成功', 'middle');
				// 			_this.getData();
				// 			return;
				// 		}
				// 	}
				// }
			},
		   /**
			 * 格式化银行卡号
			 */
			formatAccount(account){
				if(account){
					return account.replace(/(\d{4})/g, "$1" + " ");
				}else{
					return '';
				}
			},
			transferUse:function(bankInfo){
				let _this = this;
				let data = [];
				let oldList = [];
				let storageKey = "integ_UAId_" + _this.nativeInfo.UAId + "cpyId_" + _this.nativeInfo.cpyId;
				let newStorageKey = "usedAccount-UAId_" + _this.nativeInfo.UAId + "-cpyId_" + _this.nativeInfo.cpyId;
				let combineStatus = getStorage('combineStatus');
				if ('true' == combineStatus && getStorage(newStorageKey)) {
					oldList = JSON.parse(getStorage(newStorageKey));

				} else {
					if (getStorage(storageKey)) {
						data = JSON.parse(getStorage(storageKey));
					}
					if (data) {
						data.forEach(function (item) {
							for (var key in item) {
								if ((key.indexOf('templetType32') > -1 || key.indexOf('templetType31') > -1 || key.indexOf('offlineTempletType') > -1) && item[key]) {
									oldList = delRepeat(oldList, JSON.parse(item[key]));
								}
							}
						});
					}
				}
				if(oldList.length > 0){
					let accountList = [];
					let uniqueArr = [];
					for (let index = 0; index < oldList.length; index++) {
						let oldUsed = oldList[index].relationObj;
						let isRepeat = false;
						for (let i = 0; i < uniqueArr.length; i++) {
							let tempStr = oldUsed.payeeAccount+"-"+oldUsed.bankValue;
							if(uniqueArr[i] == tempStr){
								isRepeat = true;
							}
						}
						if(!isRepeat){
							let outerAccount = {
								type: 0,
								publicType: 0,
								genre: 0,
							}
							let accountInfo = {
								account: oldUsed.payeeAccount,
								name: oldUsed.payeeName,
								bank: oldUsed.bankValue||_this.bankId,
								bankDisplay: oldUsed.bankDisplay||_this.bankName,
								branch: oldUsed.branch,
								branchDisplay: oldUsed.branchDisplay,
							}
							outerAccount['accountInfo'] = accountInfo;
							accountList.push(outerAccount);
							uniqueArr.push(oldUsed.payeeAccount+"-"+oldUsed.bankValue);
						}
					}
					cryptPost('approval/addCommonlyUsedAccount.do', {
						'accountList': accountList
					}).then(function(result){
						_this.dataList = accountList;
						if(!!_this.dataList){
							_this.bakUsedList = JSON.parse(JSON.stringify(_this.dataList));
						}
						setStorage('transferStatus','true');
					},function(){
						//如果服务端返回错误，不提示错误，直接显示列表
						_this.setNewList(bankInfo);
					});
				}else{
					setStorage('transferStatus','true');
					_this.setNewList(bankInfo);
				}
			},
       },
       watch:{
        	/**
        	 * 父组件控件组件显示隐藏标识
        	 * @param {Object} newVal  新值
        	 * @param {Object} oldVal  旧值
        	 */
        	'selectFlag.show':function(newVal,oldVal){
        		var _this = this;
        		if(!this.selectFlag.show){//父组件隐藏子组件  
        			this.popupShowFlag = false;
        		}
        	},
        	templetType:function(newVal,oldVal){
	        	/*var _this = this;
	        	if(_this.templetType == TempletTypeData.BATCHTRANSFER_TEMPLETTYPE){
	        		if(_this.$parent.$refs.transType[_this.idx].checkedIndex == "1"){
	        			_this.templetType = TempletTypeData.INNERTRANSFER_TEMPLETTYPE;
	        		}else if(_this.$parent.$refs.transType[_this.idx].checkedIndex == "2"){
	        			_this.templetType = TempletTypeData.OUTERTRANSFER_TEMPLETTYPE;
	        		}
	        	}
	        	_this.usedAccountFlag = 0;
	        	_this.storageKey = 'UAId' + nativeInfo.UAId + 'cpyId' + nativeInfo.cpyId + 'storageKey';
	        	var storageValue = getStorage('templetType'+_this.templetType+_this.storageKey);
	        	if(storageValue){
	        		_this.dataList = JSON.parse(storageValue);
	        	}else{
	        		_this.dataList = [];
	        	}*/
	        	getBankConfig().then(result => {
					this.setNewList(result);
				});
	        },
	        usedSaveFlag:function(newVal,oldVal){
	        	var _this = this;
	        	if(_this.usedSaveFlag){
	        		_this.saveUsed(_this.templetType);
	        	}
	        }
        }
    }
</script>
