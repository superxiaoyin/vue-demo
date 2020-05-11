<template>
    <SnLabel class="sn-contact" :title="title">
        <div class="contact-input" ref="selectPerson" @click="openMailList">
            <div class="content-names" :placeholder="placeholder">
                <span v-for='(item,index) in contactList' :key="item.UAId" ref='UANames'>{{item.uName}}</span>
            </div>
            <em class="notebook"/></em>
        </div>       
    </SnLabel>
</template>
<script>
	import { OpenActionFunction, GetUserInfoFunction } from 'sslib/common/SnJsBridge.js';
	import { cryptPost,nativeInfo } from 'sslib/common/base.js';
	import DepartmentHandler from '../SnDepartment/DepartmentHandler.js';
	import {showToast,setStorage,getStorage,getClass,isPC,getNativeInfo} from 'sslib/common/extend.js';
    import SnLabel from '../SnLabel/SnLabel.vue';
    import "./SnContacts.less";
    export default {
        components:{
            SnLabel
        },
	    model: {
	    	event:'choosedPerson'//子组件向父组件传值
	    },
        props: {
        	title:{//title
        		type:String
        	},
            chooseType:{//选择类型  默认为单选   0-单选   1-多选
            	type:Number,
            	default:0
            },
            defaultFlag:{//是否在模板中的标示  默认不在模板中    需要修改为是否存在默认值
            	type:Boolean,
            	default:false
            },
            filterUserList:{//需要过滤的人员列表
            	type:Array,
            	default:[]
            },
            showInactivated:{//是否显示未激活人员
            	type:Boolean,
            	default:false
            },
            value:{
            	type:String
            },
            salaryRelationFlag:{//该组件是否关联工资卡组件
            	type:Boolean,
            	default:false
            },
            relationFields:{//当前组件的关联组件
            	type:Array
            },
            isInDetailFlag:{//是否明细组件 默认为否
            	type:Boolean,
            	default:false
            },
            idx:{ //明细组件的index
            	type:Number
            },
            departmentRelationFlag:{//该组件是否关联部门组件
            	type:Boolean,
            	default:false
            },
            cardRelationFlag:{//该组件是否是名片印制
            	type:Boolean,
            	default:false
            },
            applyRelationFlag:{//联系人组件是否要自动赋值给申请人
            	type:Boolean,
            	default:false
            },
            placeholder:{
                type:String,
                default:''
            }
        },
        data:function(){
        	return {
                UAIds:[],
                UANames:[],
                uPhones: [],
                contactList: [],
        		contactsKey: '',//通讯录缓存key
        		hasSalary:false,
        	}
        },
        mounted:function(){//组件渲染生成dom
        	var _this = this;
        	if (!!_this.value) {//草稿的存在的情况
				//判断this.value的类型
				if(getClass(this.value)=='Array'&&0==this.value.length){//多选,并且没值
					return;
				}
				this.UAIds = [this.value];
				if(_this.isInDetailFlag){//明细
					this.UANames = _this.$root.content.inDetail[_this.idx].UANames;
				} else {
					if(_this.defaultFlag){
						this.UANames = _this.$root.content.UANames;
					}else{//技术支持模板 市场负责人无默认值
						this.UANames = _this.$root.content.contentNames;
					}	
				}
				if(_this.departmentRelationFlag){
						//存在部门关联组件，获取部门信息
                    _this.getDepartment(Number(_this.value));
				}
                this.formatData()
        	} else {//组件加载完成
        		if (_this.defaultFlag) {//如果组件存在默认值
        			//使用extend。js中的 getNativeInfo方法获取NativeInfo对象里面的用户基本信息
					getNativeInfo(nativeInfo).then(function(data){
						_this.contactsKey = `contacts_${nativeInfo.cpyId}_${nativeInfo.UAId}`,//通讯录缓存key
						_this.UANames = [nativeInfo.UAName];
	        			_this.UAIds = [nativeInfo.UAId];
	        			_this.uPhones = [nativeInfo.uPhone];
						_this.setServerData(nativeInfo.UAId,[nativeInfo.UAName]);
						
						if(_this.departmentRelationFlag){
							//存在部门关联组件，获取部门信息
							_this.getDepartment(nativeInfo.UAId);
						} 
						_this.setRelationField();
						_this.formatData();
					})
        		}
        	}
        },
        /**
         * 监听父组件传值给子组件
         */
        watch:{
			value: function(oldVal,newVal){ //主要供明细控件删除使用
				if(this.$parent.delInDetailFlag){//明细控件删除
					//判断value类型
					if(this.$root.content.inDetail[this.idx].UANames){
						this.UAIds = this.$root.content.inDetail[this.idx].UAId;
						if(!this.UAIds){
							this.UAIds = this.$root.content.inDetail[this.idx].UAName;
						}
						this.UANames = this.$root.content.inDetail[this.idx].UANames;
					}else{
						this.UAIds = [];
						this.UANames = [];
					}
                    this.formatData()
				} 
			},
        },
        methods: {
            formatData:function(){
                this.UAIds.forEach((UAId, index)=>{
                    this.contactList.push({
                        UAId: UAId,
                        uName: this.UANames[index],
                        uPhones: this.uPhones[index]
                    })
                })
            },
            /**
        	 * 打开通讯录，选择联系人
        	 * @param {Object} type 0表示单选  1表示多选
        	 */
            openMailList: function(){
                var _this = this;
				let selectType = _this.chooseType;
				//明细内联系人选择已选人员共享互斥xiaowen2018-1-2
				var selectId = [];//选中的人员					
				if(_this.isInDetailFlag){//明细
					this.$root.content.inDetail.forEach(function(item){
						if(!!item.UAId){
							selectId.push(parseInt(item.UAId));
						}else if(!!item.UAName && parseInt(item.UAName)){
							selectId.push(parseInt(item.UAName));
						}
					})					
				} else {
					selectId = _this.UAIds;
				}													
				if(_this.filterUserList&&_this.filterUserList.length>0){
					selectId = selectId.concat(_this.filterUserList);//过滤的人员与选择人员的合集
				}
				//调用app方法 打开通讯录 参数
				var selectJson = {
					action: 'IntentAction_SelectContactWithOrgListActivity',
					dataList: [
								{key: 'from_key', value: 9, type: "int"},
								{key: 'select_model', value: selectType + '', type: "string"},
								{key: 'selected_list_tpay', value: JSON.stringify(selectId), type: "string"},
								{key: 'is_show_inactivated', value:_this.showInactivated, type:"bool"}
							],
					responseKeyList: [
								{key: 'addusers_tpay', value: '', type: 'string'}
							]
				};
				OpenActionFunction(selectJson).then(function(data){//调用app选择联系人窗口
                    _this.contactList = [];
                    let selectUser;
                    try{
                        selectUser = JSON.parse(data[0].value);
                    }catch(e){
                        selectUser = [];
                    }
                    _this.addContact(selectUser);
                })
            },
            addContact: function(selectUser){
                let _this = this;
                try{
                    var UAIds = [], UANames = [];
                    var MAX_COPYTO = 20;//最多知会人个数

                    selectUser.slice(0, MAX_COPYTO).forEach(function(item){
                        UAIds.push(item.UAId);
                        UANames.push(item.uName)
                        _this.uPhones.push(item.uPhone);
                        _this.contactList.push({
                            UAId: item.UAId,
                            uName: item.uName,
                            uPhones: item.uPhone
                        })
                    });
                    if(isPC() || 0 == this.chooseType ){//PC通讯录组件可删除人员
                        _this.UAIds = UAIds;  //PC人员Id
                        _this.UANames = UANames;  //PC人员名称							
                    }else{			
                        _this.UAIds =  _this.UAIds.concat(UAIds);  //人员Id
                        _this.UANames =  _this.UANames.concat(UANames);  //人员名称							
                    }
                    
                    if( MAX_COPYTO < _this.UAIds.length ){//超过二十个人
                        showToast(`最多添加${MAX_COPYTO}个知会人`, 'middle');
                        _this.UAIds = _this.UAIds.slice (0, MAX_COPYTO);
                        _this.UANames = _this.UANames.slice (0, MAX_COPYTO);
                    }
                    //处理是否有关联组件
                    _this.relationCheck(UAIds[0], UANames[0]);
                }catch(e){
                    //不需要操作
                    _this.UAIds = [];
                    _this.UANames = [];
                }
                _this.setServerData(_this.UAIds.join(), _this.UANames);
            },
			/**
			 * 设置发送给服务器的id与name
			 * @param {Object} UAId
			 * @param {Object} UAName
			 */
			setServerData:function(UAIds, UANames){
				var _this = this;
				_this.$emit('choosedPerson', UAIds);//传递父组件服务器值
				if(_this.isInDetailFlag){//明细组件
					_this.$root.content.inDetail[_this.idx].UAName = UAIds;
					_this.$root.content.inDetail[_this.idx].UANames = UANames;//传递给服务器供显示使用
				} else { //模板中的独立组件，不包含提交给和知会给两个组件 
					if(_this.defaultFlag){
						_this.$root.content.UANames = UANames;//传递给服务器供显示使用
					}else{//技术支持模板 市场负责人无默认值
						_this.$root.content.contentNames = UANames;
					}	
				}
			},
			/**
			 * 判断是否存在关联控件
			 * @param {Object} UAId
			 */
			relationCheck:function(UAId,UAName){
				var _this = this;
				if(_this.salaryRelationFlag){
					//存在工资卡关联组件，获取工资卡
					_this.getSalaryList(UAId);
				}
				if(_this.departmentRelationFlag){
					//存在部门关联组件，获取部门信息
					_this.getDepartment(UAId);
				} 
				//选择了人员后需要把联系人赋值给提交人，续签合同模板使用该功能
				if (_this.applyRelationFlag) {
					_this.$root.$refs.snNextAndCopy.fillNextAndCopyContacts(UAId,UAName);
				}
				//设置跟联系人相关联的控件的值
				_this.setRelationField();
			},
			/**
			 * 获取部门信息
			 * @param {Object} UAId
			 */
			getDepartment:function(UAId) {
				var _this = this;
				DepartmentHandler.getDepartment(UAId).then(function(res){
                    if (!!_this.$root.$refs.department && 0 < _this.$root.$refs.department.length) {
                        //_this.$root.$refs.department[0].$emit('input', res.orgId);//报销人id
                      _this.$root.$refs.department[0].show=res.orgName;
                      _this.$root.$refs.department[0].orgId=res.orgId;//报销人id
                        //_this.$root.content.applyOgrName = res.orgName;//报销人部门
					}
					//名片印制模板
					if (_this.cardRelationFlag) {
						_this.getCardInformation(res);
					}
        		});
			},
			/*
			 * 获取工资卡
			 * 
			 * */
			getSalaryList:function(UAId){
				var _this = this;
				//获取工资卡
				cryptPost('approval/getSalaryCardInfo.do',{choosedUAId:UAId}).then(function(result){
					if(0 < result.salaryCard.length ){ //存在卡，修改关联组件的值和状态
						_this.setRelationField(result.salaryCard[0]); //取第一张工资卡
						_this.hasSalary = true;
					}else{ //不存在卡，清空关联组件的值和状态
						_this.clearRelationField();
						showToast('该收款人未设置工资卡，无法完成代发工资', 'middle');
						_this.hasSalary = false;
						_this.UAIds = [];
						_this.UANames = [];
						_this.setServerData(0==_this.selectType?_this.UAIds.join():_this.UAIds,_this.UANames);
					}
				});
			},
			/*
			 * 修改关联组件的值和状态
			 * */
			setRelationField:function(cardData){
				var _this = this;
				//发送给服务器的值  传给父组件
				//给父组件赋值
				if (_this.relationFields) {
					if(0 < _this.relationFields.length ){
					
	            		for(var i=0;i<_this.relationFields.length;i++){
	            			var refKey = _this.relationFields[i];
	            			//获取工资卡的设置逻辑分支
	            			if (cardData) {
		            			//将组件置为只读
		            			_this.$parent.$refs[refKey][_this.idx].disabledFlag = true;
		            			
		            			 if('bankList'== refKey ){//选择控件赋值
		            				_this.setDisplayValue(cardData.bankName,refKey);//设置显示值
		            				_this.setContentValue(cardData.bankId,refKey,cardData.bankName,'bankDisplay');//传递给服务器
		            				
		            			}else if('cardNum'== refKey ){//文本控件赋值
		            				//_this.setDisplayValue(cardData.cardNumber,refKey);//设置显示值
									_this.setContentValue(cardData.cardNumber,refKey);//传递给服务器
									_this.setContentValue(cardData.bankCode,'bankCode');//厦门银行添加的行别，银行三字码
									_this.setContentValue(cardData.bankMemberId,'bankMemberId');//厦门银行添加的行号，唯一标识银行的id
		            				_this.$parent.$refs[refKey][_this.idx].value = cardData.cardNumber;//显示数据
		            			}
	            			} else {
	            				//其他通用设置关联控件的逻辑分支
	            				if (refKey == 'mobilePhone') {
	            					_this.$root.$refs[refKey][0].$emit('input', _this.uPhones[0]);
	            				}
	            			}
	            		}
	            	}
				}

			},
			/*
			 * 当前选择人没有银行卡时，初始化关联组件的值和状态
			 * */
			clearRelationField:function(cardData){
				var _this = this;
				if(0 < _this.relationFields.length ){
					
            		for(var i=0;i<_this.relationFields.length;i++){
            			var refKey = _this.relationFields[i];
            			
            			if('bankList'== refKey ){//选择控件赋值
            				_this.setDisplayValue('',refKey);//设置显示值
            				_this.setContentValue('',refKey,'','bankDisplay');//传递给服务器
            				
            			}else if('cardNum'== refKey ){//文本控件赋值
            				//_this.setDisplayValue('',refKey);//设置显示值
							_this.setContentValue('',refKey);//传递给服务器
							_this.setContentValue('','bankCode');
							_this.setContentValue('','bankMemberId');
            				_this.$parent.$refs[refKey][_this.idx].value = '';//显示数据
            			}
            			
            			//_this.setDisabledFlag(false,refKey);
            			//设置组件状态
            			_this.$parent.$refs[refKey][_this.idx].disabledFlag = false;
            		}
            	}
				
			},
			/**
			 * 设置关联组件显示值
			 * @param {Object} value
			 */
			setDisplayValue:function(displayValue,ref){
				var _this = this;
				//判断$refs是数组还是对象  数据显示
				if(getClass(_this.$parent.$refs[ref])=='Array'){//数组
					_this.$parent.$refs[ref][_this.idx].$refs.input.value = displayValue;//显示数据
				} else {//input元素
					_this.$parent.$refs[ref].$refs.input.value = displayValue;
				}
			},
			/**
			 * 设置关联组件content值
			 * @param {Object} value
			 * @param {Object} ref
			 * @param {Object} displayName 存在需要显示的name时传值给组件
			 * @param {Object} displayKey
			 */
			setContentValue:function(contentValue,ref,displayName,displayKey){
				var _this = this;
				//判断inDetail是否为数组 赋值content
				if(getClass(_this.$root.content.inDetail)=='Array'){
				   _this.$root.content.inDetail[_this.idx][ref] = contentValue;//传递给服务器
				   if(displayKey){
				    _this.$root.content.inDetail[_this.idx][displayKey] = displayName;//传递给服务器
				   }
				}else {
				   _this.$root.content[ref] = contentValue;//传递给服务器
				}
			},
			setDisabledFlag:function(disableFlag,ref){
				var _this = this;
				if(getClass(_this.$parent.$refs[ref])=='Array'){//数组
					
					_this.$parent.$refs[ref][_this.idx].disabledFlag = disableFlag;
				} else {
					_this.$parent.$refs[ref].disabledFlag = disableFlag;
				}
			},
			/**
			 * 设置名片印制模板中的人员信息
			 */
			getCardInformation:function(userInfo){
				var _this = this;
				_this.$root.$refs['cardOrgName'][0].$emit('input',userInfo.orgName || '');
				_this.$root.$refs['cardPostName'][0].$emit('input',userInfo.postName || '');
				//如果电话号中有","，并且","后面的位数只小于或者等于4位，则将","后的数据截取给分机。
				var wPhone = userInfo.wPhone;
				var phone = wPhone;//电话
				var extensionNum = '';//分机
				if (!!wPhone) {
					//分割分机号
					if (wPhone.indexOf(",") > 0) {
						var wPhoneArr = wPhone.split(",");
						extensionNum = wPhoneArr[wPhoneArr.length-1];
						if (extensionNum.length <= 4) {
							phone =wPhone.substring(0, wPhone.length-extensionNum.length-1);
						}
					}
					if (wPhone.indexOf("-") > 0) {
						var wPhoneArr = wPhone.split("-");
						if (wPhoneArr.length > 0 && wPhoneArr.length ==3) {
							extensionNum = wPhoneArr[2];
							phone = wPhoneArr[0] + "-" +wPhoneArr[1];
						}
					}
				}
				_this.$root.$refs['cardPhone'][0].$emit('input', phone);
				_this.$root.$refs['cardEmail'][0].$emit('input',userInfo.email || '');
				_this.$root.$refs['cardMobilePhone'][0].$emit('input',userInfo.uPhone || '');
				_this.$root.$refs['cardExtensionNum'][0].$emit('input',extensionNum);
			}
        }
    }
</script>


