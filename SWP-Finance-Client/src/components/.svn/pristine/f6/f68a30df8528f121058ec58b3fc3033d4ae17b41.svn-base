<template>
	<div class="snPopupPicker">
		<div v-if="detailFlag">
			<cell :title="title+(titleIndex?titleIndex:'')" :value="selectedValue" value-align="left" > </cell>
		</div>
		<div v-else>
			<cell :title="title+(titleIndex?titleIndex:'')" value-align="left" class="snPopupRight"
				@click.native="openPopup">
				<input type="text" class="popupInput" maxlength="20" :placeholder="placeholder" readonly="readonly"
					ref="input" :value='selectedValue' />
			</cell>
			<popup v-model="popupShowFlag" position="right" width="100%">
				<div class="position-horizontal-demo popupDebit">
					<!-- list里面的参数为 src-图标  title-显示数据 value-返回数据-->
					<panel :list="dataList" type="1" @on-click-item="choosedItem"></panel>
				</div>
			</popup>
		</div>
	</div>
</template>

<script>
	import './SnPopupPicker.less';
	import {
		getBankType
	} from '../../../lib/common/SnJsBridge.js';
	import {
		cryptPost
	} from '../../../lib/common/base.js';
	import {
		showToast,
		getStorage,
		setStorage,
		deleteStorage,
		initTitleMenu,
		setTitleOnly,
		isPC,
		getBankConfig
	} from '../../../lib/common/extend.js';
	import {
		Group,
		Popup,
		PopupHeader,
		Panel,
		Cell
	} from 'vux';
	export default {
		components: {
			Group,
			Popup,
			PopupHeader,
			Panel,
			Cell
		},
		data: function () {
			return {
				selectedValue: '',
				popupShowFlag: false,
				appBankType: '',
				delayShow: 0, //等待键盘收起再弹出下拉框
				bankName: '',
				bankId: 0,
				iconImg: '', //银行图标路径
				periodList: [], //预约网点时段信息
				orderDate: this.orderDate, //申请日期
			}
		},
		props: {
			title: { //title
				type: String,
				default: ""
			},
			titleIndex: { //titleIndex
				type: Number,
			},
			subTitle: {
				type: Array,
				default () {
					return []
				}
			},
			dataList: { //list数据
				type: Array,
				default () {
					return []
				}
			},
			value: {
				type: Number
			},
			funName: { //传递进来的方法名
				type: String,
				default: ""
			},
			columns: {
				type: Number,
				default: 1
			},
			placeholder: { //控件提示
				type: String,
				default: ""
			},
			noTips: { //为空提示信息
				type: String,
				default: "数据为空"
			},
			hasDefault: { //默认值，默认为没有
				type: Boolean,
				required: true,
				default: false
			},
			selectFlag: {
				type: Object,
				default: {
					'show': false
				}
			},
			flag: {
				type: Boolean,
				default: true
			},
			cssClass: {
				type: String,
				default: ""
			},
			selectType: { //下来框的类型，根据类型获取不同的下拉框值
				type: String,
				default: ""
			},
			relationFiledIds: {
				type: Array,
				default: []
			},
			isInDetailFlag: { //是否明细组件 默认为否
				type: Boolean,
				default: false
			},
			isInNextOprFlag: { //是否后续操作组件 默认为否
				type: Boolean,
				default: false
			},
			idx: { //组件的index
				type: Number
			},
			fieldKey: {
				type: String,
				default: null
			},
			disabledFlag: { //申请填了支付方式  后续的需要不让选
				type: Boolean
			},
			detailFlag: { //详情入口
				type: Boolean
			},
			bisBranchDisplay: { //支行在转账业务组件中的显示值
				type: String,
				default: null
			},
			cityId: {
				type: Number,
				default: 0
			},
			branchId: {
				type: Number,
				default: 0
			},
			orderDate: {
				type: Number
			}
		},
		beforeCreate: function () {
			var _this = this;
			getBankType(_this); //获取银行type
		},
		created: function () {
			var _this = this;
			if (_this.selectType == "debitcard") { //取结算卡列表数据
				//从服务器获取结算卡的数据
				_this.getDebitcardList();
			} else if (_this.selectType == "payerAccount") { //安全硬件模板 付方账号     后续需要优化
				//从服务器获取安全硬件模板 付方账号
				_this.getAccountList();
			}

			if (this.dataList.length > 0 && this.hasDefault) {
				this.selectedValue = this.dataList[0].dispValue || ''; //给控件赋值默认值  控件显示值
				this.$emit('input', this.dataList[0].value || ''); //控件返回值
			}
			//_this.getBankInfo();
		},
		mounted: function () { //存在value,显示value  供存草稿使用
			var _this = this;
			if (_this.value || _this.value == 0) {
				var text = _this.value;
				if (!!_this.dataList && _this.dataList.length > 0) {
					_this.dataList.forEach(function (item) {
						if (_this.value == item.value) {
							text = item.dispValue;
						}
					});
				} else if (_this.selectType == "branch") { //如果是支行，则在content中的存储branchDisplay来显示
					if (_this.isInDetailFlag) { //明细
						text = _this.$root.content.inDetail[_this.idx].branchDisplay || ''; //值显示
					} else if (_this.isInNextOprFlag) { //在业务组件中的显示值
						text = _this.bisBranchDisplay;
					} else {
						text = _this.$root.content.branchDisplay || ''; //值显示
					}
				}
				_this.selectedValue = text;
			}
			//检测键盘是否弹起并设置下拉框弹出延时
			$(document).on("focus", "input,textarea", function () {
				_this.delayShow = 0;
			})
			$(document).on("blur", "input,textarea", function () {
				setTimeout(function () {
					_this.delayShow = 0;
				}, 500)
			})
		},
		methods: {
			/**
			 * 打开选择页面
			 */
			openPopup: function () {
				var _this = this;
				if (_this.selectType == "branch") {
					_this.showBranch();
				} else if (_this.selectType == "orderTimeId") {
					_this.showorderTimeId();
				} else {
					if (!_this.detailFlag) {
						_this.selectShowControl();
					}
				}
			},
			choosedItem: function (item) {
				var _this = this;
				_this.setBodysrcTop();
				this.selectFlag.show = false;
				_this.selectedValue = item.dispValue; //控件显示值
				setTimeout(() => {
					_this.$emit('input', item.value); //控件返回值

					if (_this.selectType == "branch") { //如果是支行，则在content中的存储branchDisplay来显示
						_this.setContentValue('branchDisplay', item.dispValue);
					}
					if (_this.selectType == "orderTimeId") {
						var branchId = _this.branchId;
						_this.$emit('ordertimeidchange', item.upLimit);
					}
					initTitleMenu(_this.subTitle); //设置title及按钮
				}, 500)
			},
			/**
			 * 设置父组件content中的值
			 * @param {Object} key   数据中的key
			 * @param {Object} value 数据中的value
			 */
			setContentValue: function (key, value) {
				var _this = this;
				//如果在明细中，需要区分
				if (_this.isInDetailFlag) { //明细
					_this.$root.content.inDetail[_this.idx][key] = value; //传递给服务器
				} else {
					_this.$root.content[key] = value; //给content中另存一个bankDisplay的值
				}
			},
			/**
			 * 查询结算卡数据
			 */
			getDebitcardList: function () {
				var _this = this;
				var debitcardList = [];
				cryptPost('debitcard/queryCpyDebitCardList.html', {}).then(function (result) {
					//var debitcardBankname =  bankMap[ _this.appBankType ].name ; //获取银行name
					//var bankIcon = bankMap[ _this.appBankType ].icon ;  //获取银行icon
					//console.log( debitcardBankname );
					debitcardList = result.debitCardList;
					_this.debitcard = debitcardList[0];
					_this.dataList = debitcardList.map(function (item) {
						return {
							src: _this.iconImg,
							title: _this.bankName + '(' + item.substring(item.length - 4, item
								.length) + ')',
							value: item,
							dispValue: item
						}
					});
				});
			},
			/**
			 * 查询分行信息
			 */
			showBranch: function () {
				var _this = this;
				var branchList;
				var branchDataList;
				var bankId = parseInt(_this.bankId);
				var cityId = _this.cityId;
				if (!cityId || '' == cityId) {
					showToast('请先选择开户地区');
					return false;
				}
				cryptPost('openAccount/downloadBranchBankList.do', {
					bankId: bankId,
					cityId: cityId
				}).then(function (result) { //根据已选银行，省市，请求支行
					branchList = result.branchList;
					if (branchList.length < 1) {
						showToast('暂无开户网点信息，请重新选择');
						return false;
					}
					_this.dataList = branchList.map(function (item) {
						return {
							title: item.branchName,
							value: item.branchId,
							dispValue: item.branchName
						}
					});
					_this.selectShowControl();
				});
			},
			/**
			 * 查询网点时段信息
			 */
			showorderTimeId: function () {
				var _this = this;
				var branchId = _this.branchId;

				if (!branchId || '' == branchId) {
					showToast('请先选择开户网点');
					return false;
				}

				var week = parseInt(_this.getWeek(new Date(_this.orderDate * 1000).format('yyyy-MM-dd')));
				cryptPost('openAccount/getBranchPeriodInfo.do', {
					branchId: branchId
				}).then(function (result) { //根据已选银行，省市，请求支行
					_this.periodList = result.periodList;
					if (_this.periodList.length < 1) {
						showToast('暂无网点时段信息，请重新选择');
						return false;
					}
					_this.dataList = [];
					var len = _this.periodList.length;
					for (var i = 0; i < len; i++) {
						if (week == _this.periodList[i].workdayId) {
							var item = _this.periodList[i];
							var showText = item.startTime + '-' + item.endTime;
							var itemJson = {
								title: showText,
								value: item.timeId,
								dispValue: showText,
								upLimit: item.upLimit
							}
							_this.dataList.push(itemJson);
						}
					}
					if (_this.dataList.length < 1) {
						showToast('暂无网点时段信息，请重新选择日期');
						return false;
					}
					_this.selectShowControl();
				});
			},
			/**
			 * 下拉框显示隐藏控制
			 */
			selectShowControl: function () {
				var _this = this;
				if (0 < this.dataList.length) {
					//等待键盘收起再弹出下拉 框
					if (isPC()) {
						_this.popupShowFlag = true;
					} else {
						setTimeout(function () {
							_this.popupShowFlag = true;
							_this.delayShow = 0;
						}, _this.delayShow);
					}
					//打开二级页面记住一级页面滚动位 置
					var bodyScrTop = $("body").scrollTop();
					$("body").css({
						'overflow': 'hidden',
						'position': 'fixed',
						'top': bodyScrTop * -1
					});
					$("body").attr("bodyScrTop", bodyScrTop);
					setTimeout(function () {
						$("body").addClass("setTop0");
					}, 200)
					_this.selectFlag.show = true;
					setTitleOnly("选择" + this.title);
				} else {
					this.selectFlag.show = false;
					showToast(this.noTips);
				}
			},
			/*             
			 * 设置页面body滚动高度，用于显示隐藏二级页面时保持一级页面的高度
			 * */
			setBodysrcTop: function () {
				//关闭二级页面设置一级页面滚动位置
				$("body").css({
					'overflow': 'auto',
					'position': 'static',
					'top': 'auto'
				});
				$("body").scrollTop($("body").attr("bodyScrTop"));
				$("body").removeClass("setTop0");
			},
			/**
			 * 获取银行信息，银行名，银行ID,ICONID，iconimg
			 * */
			getBankInfo: function () {
				let _this = this;
				getBankConfig().then(function (result) {
					if (!!result) {
						let bankconfig = result;
						_this.bankName = bankconfig.bankName;
						_this.iconImg = bankconfig.iconImg;
						_this.bankId = bankconfig.bankId;
					}
				})
			},
			/**
			 * 根据日期字符串获取星期几
			 * @param dateString 日期字符串（如：2016-12-29），为空时为用户电脑当前日期
			 * @returns {String}
			 */
			getWeek: function (dateString) {
				var date;
				var dateArray = dateString.split("-");
				date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
				return "6012345".charAt(date.getDay());
			},
		},
		watch: {
			/**
			 * 父组件控件组件显示隐藏标识
			 * @param {Object} newVal  新值
			 * @param {Object} oldVal  旧值
			 */
			'selectFlag.show': function (newVal, oldVal) {
				var _this = this;
				if (!this.selectFlag.show) { //父组件隐藏子组件       			
					this.popupShowFlag = false;
				}
			},
			/**
			 * 数据显示 主要针对删除使用
			 * @param {Object} newVal
			 * @param {Object} oldVal
			 */
			value: function (newVal, oldVal) {
				var _this = this;
				if (_this.value || _this.value == 0) {
					if (_this.selectType == "branch") { //如果是支行，则在content中的存储branchDisplay来显示
						if (_this.isInDetailFlag) { //明细
							_this.selectedValue = _this.$root.content.inDetail[_this.idx].branchDisplay || ''; //值显示
						} else {
							_this.selectedValue = _this.$root.content.branchDisplay || ''; //值显示
						}
					} else {
						if (!!_this.dataList && _this.dataList.length > 0) {
							var valueFlag = false;
							_this.dataList.forEach(function (item) {
								if (_this.value == item.value) {
									_this.selectedValue = item.dispValue;
									valueFlag = true;
								}
							});
							if (!valueFlag) { //针对自增下拉
								_this.selectedValue = '';
							}
						}
					}
				} else {
					_this.selectedValue = '';
				}
			},
		}
	}
</script>
<style lang='less'>
@import "./SnPopupPicker.less";
</style>