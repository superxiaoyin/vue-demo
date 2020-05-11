<template>
    <div class="contact sncontacts">
        <group label-width="5em">
            <cell-box class="vux-tap-active" ref="selectPerson" @click.native="choose(chooseType)">
                <div class="cellText"><span>{{title}}</span></div>
                <div class="content_names" :placeholder='placeholder'>
                    <span v-for='(item,index) in UAIds' v-bind:class='{member_del:delFlag==true}'
                        @click.stop='del(index)' ref='UANames'>{{UANames[index]}}</span>
                </div>
                <em class="notebook" /></em>
            </cell-box>
        </group>
        <div v-show="nextUserFlag" class='bgf2'>
            <div class='quick_name_box'>
                <div class='tijiaogei'>
                    <div class='tijiaogei_tit clearfix'>
                        <span class='tijiaogei_tit_text fl'>提交给<span>（可选1人）</span></span>
                    </div>
                    <ul id='usedNextContactUL' class='tijiaogei_info_box'>
                        <li class="tijiaogei_info clearfix" v-for="item in nextUserList" @click="chooseNextUser(item)">
                            <span id='chRadiospan' v-bind:class="item.userClass"></span>
                            <div class='tijiaogei_text_box clearfix'>
                                <span class='tijiaogei_icon fl'>
                                    <span
                                        v-bind:style="{backgroundImage: 'url(../communication_icon/' + item.UAId + ')'}"></span>
                                </span>
                                <span class='tijiaogei_text fl' v-text="item.name"></span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import './SnContacts.less';
    import {
        OpenActionFunction,
        GetUserInfoFunction
    } from '../../../lib/common/SnJsBridge.js';
    import {
        cryptPost,
        nativeInfo
    } from '../../../lib/common/base.js';
    import DepartmentHandler from './DepartmentHandler.js';
    import {
        showToast,
        setStorage,
        getStorage,
        getClass,
        isPC
    } from '../../../lib/common/extend.js';
    import {
        ToastPlugin,
        Group,
        CellBox,
        Toast
    } from 'vux';
    Vue.use(ToastPlugin);
    export default {
        components: {
            Group,
            CellBox,
            Toast,
            ToastPlugin
        },
        model: {
            event: 'choosedPerson' //子组件向父组件传值
        },
        props: {
            title: { //title
                type: String
            },
            nextUserList: { //下一处理人列表
                type: Array
            },
            chooseType: { //选择类型  默认为单选   0-单选   1-多选
                type: Number,
                default: 0
            },
            placeholder: {
                type: String
            },
            delFlag: { //删除标识与功能  默认有删除功能
                type: Boolean,
                default: true
            },
            defaultFlag: { //是否在模板中的标示  默认不在模板中    需要修改为是否存在默认值
                type: Boolean,
                default: false
            },
            filterUserList: { //需要过滤的人员列表
                type: Array,
                default: []
            },
            showInactivated: { //是否显示未激活人员
                type: Boolean,
                default: false
            },
            auditModeId: { //固定审批模式 默认为否
                type: Number,
                default: 1
            },
            value: {
                type: String
            },
            salaryRelationFlag: { //该组件是否关联工资卡组件
                type: Boolean,
                default: false
            },
            relationFields: { //当前组件的关联组件
                type: Array
            },
            isInDetailFlag: { //是否明细组件 默认为否
                type: Boolean,
                default: false
            },
            idx: { //明细组件的index
                type: Number
            },
            departmentRelationFlag: { //该组件是否关联部门组件
                type: Boolean,
                default: false
            },
            initCopyToUaIds: { //知会给的默认值
                type: Array,
                default: []
            },
            initCopyToUaIdNames: { //知会给的默认值
                type: Array,
                default: []
            },
            cardRelationFlag: { //该组件是否是名片印制
                type: Boolean,
                default: false
            }
        },
        data: function () {
            return {
                nextUserFlag: false,
                nextUserList: [],
                UAIds: [],
                UANames: [],
                selectType: 0, //选择模式，0表示单选，1表示多选
                //contactsKey: 'contacts_' + nativeInfo.cpyId + '_'+ nativeInfo.UAId,//通讯录缓存key
                contactsObj: {},
                chooseFlag: false,
                hasSalary: false,
            }
        },
        beforeCreate: function () {},
        created: function () {},
        mounted: function () { //组件渲染生成dom
            var _this = this;

            //      	if (!!_this.value) {//草稿的存在的情况
            //				//判断this.value的类型
            //				if(getClass(this.value)=='Array'&&0==this.value.length){//多选,并且没值
            //					return;
            //				}
            //				this.UAIds = [this.value];
            //				if(_this.isInDetailFlag){//明细
            //					this.UANames = _this.$root.content.inDetail[_this.idx].UANames;
            //				} else {
            //					this.UANames = _this.$root.content.UANames;
            //				}
            //      	} else {//组件加载完成
            //      		if (_this.defaultFlag) {//如果组件存在默认值
            //      			_this.UANames = [nativeInfo.UAName];
            //      			_this.UAIds = [nativeInfo.UAId];
            //					_this.setServerData(nativeInfo.UAId,[nativeInfo.UAName]);
            //					
            //					if(_this.departmentRelationFlag){
            //						//存在部门关联组件，获取部门信息
            //						_this.getDepartment(nativeInfo.UAId);
            //					}
            //      		}
            //      	}
            //_this.setInitCopyToUaIds(); //知会给的默认值
        },
        updated: function () {},
        /**
         * 监听父组件传值给子组件
         */
        watch: {
            value: function (newVal, oldVal) { //主要供明细控件删除使用
                var _this = this;
                _this.UAIds = [newVal];
                console.log(newVal, oldVal);
                if (0 < _this.UAIds.length && '' != newVal) {
                    GetUserInfoFunction({
                        "UAId": parseInt(newVal)
                    }).then(function (uaData) {
                        console.log(uaData);
                        /*
                        zuoxu 20190419 可以选择未激活用户
                        */
                        if (undefined != uaData.uName && "" != uaData
                            .uName) { //用户存在							
                            _this.UANames = [uaData.uName];
                        }
                    })


                } else {
                    _this.UANames = [];
                }
                if (!!_this.UAIds[0]) {
                    _this.$emit('choosedPerson', _this.UAIds[0]); //传递父组件服务器值
                } else {
                    _this.$emit('choosedPerson', ''); //传递父组件服务器值
                }






                //				if(this.$parent.delInDetailFlag){//明细控件删除
                //					//判断value类型
                //					if(this.$root.content.inDetail[this.idx].UANames){
                //						this.UAIds = this.$root.content.inDetail[this.idx].UAId;
                //						if(!this.UAIds){
                //							this.UAIds = this.$root.content.inDetail[this.idx].UAName;
                //						}
                //						this.UANames = this.$root.content.inDetail[this.idx].UANames;
                //					}else{
                //						this.UAIds = [];
                //						this.UANames = [];
                //					}
                //				} 
            },
            initCopyToUaIds: function (oldVal, newVal) {
                this.setInitCopyToUaIds();
            }
        },
        methods: {
            /**
             * 联系人选择
             * @param {Object} type 0表示单选  1表示多选
             */
            choose: function (selectType) {
                var _this = this;
                _this.selectType = selectType;
                //明细内联系人选择已选人员共享互斥xiaowen2018-1-2
                var selectId = []; //选中的人员					
                if (_this.isInDetailFlag) { //明细
                    this.$root.content.inDetail.forEach(function (item) {
                        if (!!item.UAId) {
                            selectId.push(parseInt(item.UAId));
                        } else if (!!item.UAName && parseInt(item.UAName)) {
                            selectId.push(parseInt(item.UAName));
                        }
                    })
                } else if (_this.UAIds == "") {
                    selectId = [];
                } else {
                    selectId = _this.UAIds;
                }
                if (_this.filterUserList && _this.filterUserList.length > 0) {
                    selectId = selectId.concat(_this.filterUserList); //过滤的人员与选择人员的合集
                }
                if (0 == selectType && _this.isAuditFixed()) { //单选 判断是否固定模式
                    return;
                }
                console.log(JSON.stringify(selectId))
                //调用app方法 打开通讯录 参数
                var selectJson = {
                    action: 'IntentAction_SelectContactWithOrgListActivity',
                    dataList: [{
                            key: 'from_key',
                            value: 9,
                            type: "int"
                        },
                        {
                            key: 'select_model',
                            value: _this.selectType + '',
                            type: "string"
                        },
                        {
                            key: 'selected_list_tpay',
                            value: JSON.stringify(selectId),
                            type: "string"
                        },
                        {
                            key: 'is_show_inactivated',
                            value: _this.showInactivated,
                            type: "bool"
                        }
                    ],
                    responseKeyList: [{
                        key: 'addusers_tpay',
                        value: '',
                        type: 'string'
                    }]
                };
                OpenActionFunction(selectJson).then(function (data) { //调用app选择联系人窗口
                    try {
                        var selectUser = JSON.parse(data[0].value);
                        var MAX_COPYTO = 20; //最多知会人个数
                        if (MAX_COPYTO < selectUser.length) { //超过二十个人
                            showToast('最多添加' + MAX_COPYTO + '个知会人', 'middle');
                        }
                        var UAIds = selectUser.slice(0, MAX_COPYTO).map(function (item) {
                            return item.UAId;
                        });
                        var UANames = selectUser.slice(0, MAX_COPYTO).map(function (item) {
                            return item.uName;
                        });
                        if (isPC()) { //PC通讯录组件可删除人员
                            _this.UAIds = UAIds; //PC人员Id
                            _this.UANames = UANames; //PC人员名称							
                        } else {
                            _this.UAIds = (0 == _this.selectType ? UAIds : _this.UAIds.concat(
                            UAIds)); //人员Id
                            _this.UANames = (0 == _this.selectType ? UANames : _this.UANames.concat(
                                UANames)); //人员名称							
                        }

                        if (MAX_COPYTO < _this.UAIds.length) { //超过二十个人
                            showToast('最多添加' + MAX_COPYTO + '个知会人', 'middle');
                            _this.UAIds = _this.UAIds.slice(0, MAX_COPYTO);
                            _this.UANames = _this.UANames.slice(0, MAX_COPYTO);
                        }
                        //处理是否有关联组件
                        _this.relationCheck(UAIds[0]);
                    } catch (e) {
                        //不需要操作
                        _this.UAIds = [];
                        _this.UANames = [];
                    }
                    _this.setServerData(0 == _this.selectType ? _this.UAIds.join() : _this.UAIds, _this
                        .UANames);
                });
            },
            /**
             * 判断是否走固定模式
             */
            isAuditFixed: function () {
                var _this = this;
                var auditFixedFlag = false;
                if (1 < _this.auditModeId) { //固定审批
                    auditFixedFlag = true;
                    if (_this.nextUserList.length > 0) { //存在下一处理人
                        _this.nextUserFlag = true;
                    } else { //不存在则取服务器获取  只有申请时需要从服务器获取  currOptType参数默认传1
                        _this.getNextUserList(_this.auditModeId, 1);
                    }
                } else {
                    auditFixedFlag = false;
                }
                return auditFixedFlag;
            },
            /**
             * 特殊处理，固定审批模式 获取下一处理人   在其他地方另外需要处理
             * @param {Object} auditModeId    固定审批模式
             * @param {Object} currOptType    审批类型  1表示申请  2表示审批
             */
            getNextUserList: function (auditModeId, currOptType) {
                var _this = this;
                var amount = '';
                if (5 == auditModeId) { //判断金额模式
                    //获取金额，判断
                    amount = _this.$root.content.amount;
                    if (!amount && /^0+$/ig.test(amount)) {
                        showToast('请输入正确金额', 'middle');
                        return;
                    }
                }
                cryptPost('yqt/flow/getNextUserList.html', {
                    currOptType: currOptType,
                    amount: amount
                }).then(function (data) {
                    _this.nextUserFlag = true; //显示下一处理人界面
                    _this.nextUserList = data.userList;
                });
            },
            /**
             * 选择下一处理人
             */
            chooseNextUser: function (item) {
                var _this = this;
                _this.nextUserList.forEach(function (user) {
                    user.userClass = 'tijiaogei_radio  fl'
                })
                item.userClass = 'tijiaogei_choosed tijiaogei_radio  fl'

                _this.UAIds = [item.uaId];
                _this.UANames = [item.name];
                _this.nextUserFlag = false; //隐藏子组件
                _this.setServerData(item.uaId, _this.UANames);

            },
            /**
             * 删除人员  //阻止事件冒泡 使用stop方法
             * @param {Object} index
             */
            del: function (index) {
                var _this = this;
                if (_this.delFlag) {
                    _this.UAIds.splice(index, 1); //删除当前元素
                    _this.UANames.splice(index, 1);
                    //					var UAIds = 0==_this.selectType?_this.UAIds.join():_this.UAIds;
                    //					_this.setServerData(UAIds,_this.UANames);
                }
                _this.$emit('choosedPerson', '');
            },
            /**
             * 设置发送给服务器的id与name
             * @param {Object} UAId
             * @param {Object} UAName
             */
            setServerData: function (UAIds, UANames) {
                var _this = this;
                _this.$emit('choosedPerson', UAIds); //传递父组件服务器值
                if (_this.isInDetailFlag) { //明细组件
                    _this.$root.content.inDetail[_this.idx].UAName = UAIds;
                    _this.$root.content.inDetail[_this.idx].UANames = UANames; //传递给服务器供显示使用
                } else if (_this.defaultFlag) { //模板中的独立组件，不包含提交给和知会给两个组件
                    _this.$root.content.UANames = UANames; //传递给服务器供显示使用
                }
            },
            /**
             * 判断是否存在关联控件
             * @param {Object} UAId
             */
            relationCheck: function (UAId) {
                var _this = this;
                if (_this.salaryRelationFlag) {
                    //存在工资卡关联组件，获取工资卡
                    _this.getSalaryList(UAId);
                }
                if (_this.departmentRelationFlag) {
                    //存在部门关联组件，获取部门信息
                    _this.getDepartment(UAId);
                }
            },
            /**
             * 获取部门信息
             * @param {Object} UAId
             */
            getDepartment: function (UAId) {
                var _this = this;
                DepartmentHandler.getDepartment(UAId).then(function (res) {
                    if (!!_this.$root.$refs.department && 0 < _this.$root.$refs.department.length) {
                        _this.$root.$refs.department[0].$emit('input', res.orgId); //报销人id
                        _this.$root.content.applyOgrName = res.orgName; //报销人部门
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
            getSalaryList: function (UAId) {
                var _this = this;
                //获取工资卡
                cryptPost('cpy/getSalaryCardInfo.html', {
                    choosedUAId: UAId
                }).then(function (result) {
                    if (0 < result.salaryCard.length) { //存在卡，修改关联组件的值和状态
                        _this.setRelationField(result.salaryCard[0]); //取第一张工资卡
                        _this.hasSalary = true;
                    } else { //不存在卡，清空关联组件的值和状态
                        _this.clearRelationField();
                        showToast('该人员未设置工资卡，请设置后再进行申请', 'middle');
                        _this.hasSalary = false;
                        _this.UAIds = [];
                        _this.UANames = [];
                        _this.setServerData(0 == _this.selectType ? _this.UAIds.join() : _this.UAIds, _this
                            .UANames);
                    }
                });

            },
            /*
             * 修改关联组件的值和状态
             * */
            setRelationField: function (cardData) {
                var _this = this;
                //发送给服务器的值  传给父组件
                //给父组件赋值
                if (0 < _this.relationFields.length) {

                    for (var i = 0; i < _this.relationFields.length; i++) {
                        var refKey = _this.relationFields[i];

                        //将组件置为只读
                        _this.$parent.$refs[refKey][_this.idx].disabledFlag = true;

                        if ('bankList' == refKey) { //选择控件赋值
                            _this.setDisplayValue(cardData.bankName, refKey); //设置显示值
                            _this.setContentValue(cardData.bankId, refKey, cardData.bankName,
                            'bankDisplay'); //传递给服务器

                        } else if ('cardNum' == refKey) { //文本控件赋值
                            //_this.setDisplayValue(cardData.cardNumber,refKey);//设置显示值
                            _this.setContentValue(cardData.cardNumber, refKey); //传递给服务器
                            _this.$parent.$refs[refKey][_this.idx].value = cardData.cardNumber; //显示数据
                        }

                        //_this.setDisabledFlag(true,refKey);
                    }
                }
            },
            /*
             * 当前选择人没有银行卡时，初始化关联组件的值和状态
             * */
            clearRelationField: function (cardData) {
                var _this = this;
                if (0 < _this.relationFields.length) {

                    for (var i = 0; i < _this.relationFields.length; i++) {
                        var refKey = _this.relationFields[i];

                        if ('bankList' == refKey) { //选择控件赋值
                            _this.setDisplayValue('', refKey); //设置显示值
                            _this.setContentValue('', refKey, '', 'bankDisplay'); //传递给服务器

                        } else if ('cardNum' == refKey) { //文本控件赋值
                            //_this.setDisplayValue('',refKey);//设置显示值
                            _this.setContentValue('', refKey); //传递给服务器
                            _this.$parent.$refs[refKey][_this.idx].value = ''; //显示数据
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
            setDisplayValue: function (displayValue, ref) {
                var _this = this;
                //判断$refs是数组还是对象  数据显示
                if (getClass(_this.$parent.$refs[ref]) == 'Array') { //数组
                    _this.$parent.$refs[ref][_this.idx].$refs.input.value = displayValue; //显示数据
                } else { //input元素
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
            setContentValue: function (contentValue, ref, displayName, displayKey) {
                var _this = this;
                //判断inDetail是否为数组 赋值content
                if (getClass(_this.$root.content.inDetail) == 'Array') {
                    _this.$root.content.inDetail[_this.idx][ref] = contentValue; //传递给服务器
                    if (displayKey) {
                        _this.$root.content.inDetail[_this.idx][displayKey] = displayName; //传递给服务器
                    }
                } else {
                    _this.$root.content[ref] = contentValue; //传递给服务器
                }
            },
            setDisabledFlag: function (disableFlag, ref) {
                var _this = this;
                if (getClass(_this.$parent.$refs[ref]) == 'Array') { //数组

                    _this.$parent.$refs[ref][_this.idx].disabledFlag = disableFlag;
                } else {
                    _this.$parent.$refs[ref].disabledFlag = disableFlag;
                }
            },
            setInitCopyToUaIds: function () {
                var _this = this;
                if (!!_this.initCopyToUaIds && _this.initCopyToUaIdNames) {
                    _this.UAIds = _this.initCopyToUaIds;
                    _this.UANames = _this.initCopyToUaIdNames;
                }
            },
            /**
             * 设置名片印制模板中的人员信息
             */
            getCardInformation: function (userInfo) {
                var _this = this;
                _this.$root.$refs['cardOrgName'][0].$emit('input', userInfo.orgName || '');
                _this.$root.$refs['cardPostName'][0].$emit('input', userInfo.postName || '');
                //如果电话号中有","，并且","后面的位数只小于或者等于4位，则将","后的数据截取给分机。
                var wPhone = userInfo.wPhone;
                var phone = wPhone; //电话
                var extensionNum = ''; //分机
                if (!!wPhone) {
                    //分割分机号
                    if (wPhone.indexOf(",") > 0) {
                        var wPhoneArr = wPhone.split(",");
                        extensionNum = wPhoneArr[wPhoneArr.length - 1];
                        if (extensionNum.length <= 4) {
                            phone = wPhone.substring(0, wPhone.length - extensionNum.length - 1);
                        }
                    }
                    if (wPhone.indexOf("-") > 0) {
                        var wPhoneArr = wPhone.split("-");
                        if (wPhoneArr.length > 0 && wPhoneArr.length == 3) {
                            extensionNum = wPhoneArr[2];
                            phone = wPhoneArr[0] + "-" + wPhoneArr[1];
                        }
                    }
                }
                _this.$root.$refs['cardPhone'][0].$emit('input', phone);
                _this.$root.$refs['cardExtensionNum'][0].$emit('input', extensionNum);
                _this.$root.$refs['cardEmail'][0].$emit('input', userInfo.email || '');
                _this.$root.$refs['cardMobilePhone'][0].$emit('input', userInfo.uPhone || '');
            }
        }
    }
</script>