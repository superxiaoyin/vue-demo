<template>
    <div class="contact">
        <group label-width="5em">
            <cell-box class="vux-tap-active" ref="selectPerson" @click.native="choose(0)">
                <div class="cellText"><span>{{title.next}}</span></div>
                <div class="content_names" :placeholder='placeholder.next'>
                    <span v-for='(item,index) in nextAndCopy.nextUAIds' v-bind:class='{member_del:delFlag==true}'
                        @click.stop='delNext(index)'>{{nextAndCopyName.nextUANames[index]}}</span>
                </div>
                <em class="notebook" /></em>
            </cell-box>
        </group>
        <group label-width="5em">
            <cell-box class="vux-tap-active" ref="selectPerson" @click.native="choose(1)">
                <div class="cellText"><span>{{title.copy}}</span></div>
                <div class="content_names" :placeholder='placeholder.copy'>
                    <span v-for='(item,index) in nextAndCopy.copyUAIds' v-bind:class='{member_del:delFlag==true}'
                        @click.stop='delCopy(index)'>{{nextAndCopyName.copyUANames[index]}}</span>
                </div>
                <em class="notebook" /></em>
            </cell-box>
        </group>
        <div class="bgf2 usedContactDiv" :class="{contactsShow:topContactsShow}">
            <div class="quick_name_box">
                <div class="tijiaogei">
                    <div class="tijiaogei_tit">
                        <span class="tijiaogei_tit_text fl">提交给<span>（可选1人）</span></span>
                        <span v-if="!!topContacts.next.length && topContacts.next.length>5" class="down"
                            :class="{up:moreNext}" @click="moreNext=!moreNext">更多</span>
                        <span class="tijioagei_tit_button fr" @click="chooseTop(3)"></span>
                    </div>
                    <ul class="tijiaogei_info_box">
                        <div v-if="!topContacts.next||topContacts.next.length < 1" class="no_zhihuiren_box"><span
                                class="no_zhihuiren">暂无最近审批人，请从通讯录中选择</span></div>
                        <checker v-model="choosedNext" type="radio" default-item-class="option_info"
                            selected-item-class="option_chosed">
                            <div>
                                <checker-item v-if="index<=4" :value="temp" v-for="(temp, index) in topContacts.next"
                                    :key="index">
                                    <li v-for="(value,key) in  temp" class="tijiaogei_info clearfix">
                                        <span id="chRadiospan" class="tijiaogei_radio  fl"></span>
                                        <div class="tijiaogei_text_box clearfix">
                                            <span class="tijiaogei_icon fl">
                                                <span
                                                    v-bind:style="{backgroundImage: 'url(../communication_icon/' + key + ')'}"></span>
                                            </span>
                                            <span class="tijiaogei_text fl">{{value}}</span>
                                            <span class="tijiaogei_del fr"
                                                @click.stop="delTopContactsNext(index,value,key)"></span>
                                        </div>
                                    </li>
                                </checker-item>
                            </div>
                            <div class="slide" :class="moreNext?'animate':''" v-show="moreNext">
                                <checker-item v-if="index>4" :value="temp" v-for="(temp, index) in topContacts.next"
                                    :key="index">
                                    <li v-for="(value,key) in  temp" class="tijiaogei_info clearfix">
                                        <span id="chRadiospan" class="tijiaogei_radio  fl"></span>
                                        <div class="tijiaogei_text_box clearfix">
                                            <span class="tijiaogei_icon fl">
                                                <span
                                                    v-bind:style="{backgroundImage: 'url(../communication_icon/' + key + ')'}"></span>
                                            </span>
                                            <span class="tijiaogei_text fl">{{value}}</span>
                                            <span class="tijiaogei_del fr"
                                                @click.stop="delTopContactsNext(index,value,key)"></span>
                                        </div>
                                    </li>
                                </checker-item>
                            </div>
                        </checker>
                    </ul>
                </div>
                <div class="tijiaogei">
                    <div class="tijiaogei_tit">
                        <span class="tijiaogei_tit_text fl">知会给<span>（最多20人）</span></span>
                        <span v-if="!!topContacts.copy.length && topContacts.copy.length>5" class="down"
                            :class="{up:moreCopy}" @click="moreCopy=!moreCopy">更多</span>
                        <span class="tijioagei_tit_button fr" @click="chooseTop(4)"></span>
                    </div>
                    <ul id="usedCopyContactUL" class="tijiaogei_info_box">
                        <div v-if="!topContacts.copy||topContacts.copy.length< 1" class="no_zhihuiren_box"><span
                                class="no_zhihuiren">暂无最近知会人，请从通讯录中选择</span></div>
                        <checker v-model="choosedCopy" type="checkbox" default-item-class="option_info"
                            selected-item-class="option_chosed">
                            <div>
                                <checker-item v-if="index<=4" :value="temp" v-for="(temp, index) in topContacts.copy"
                                    :key="index">
                                    <li v-for="(value,key) in  temp" class="tijiaogei_info clearfix">
                                        <span id="chCheckboxspan" class="zhihuigei_checkbox  fl"></span>
                                        <div class="tijiaogei_text_box clearfix">
                                            <span class="tijiaogei_icon fl">
                                                <span
                                                    v-bind:style="{backgroundImage: 'url(../communication_icon/' + key + ')'}"></span>
                                            </span>
                                            <span class="tijiaogei_text fl">{{value}}</span>
                                            <span class="tijiaogei_del fr"
                                                @click.stop="delTopContactsCopy(index,value,key)"></span>
                                        </div>
                                    </li>
                                </checker-item>
                            </div>
                            <div class="slide" :class="moreCopy?'animate':''" v-show="moreCopy">
                                <checker-item v-if="index>4" :value="temp" v-for="(temp, index) in topContacts.copy"
                                    :key="index">
                                    <li v-for="(value,key) in  temp" class="tijiaogei_info clearfix">
                                        <span id="chCheckboxspan" class="zhihuigei_checkbox  fl"></span>
                                        <div class="tijiaogei_text_box clearfix">
                                            <span class="tijiaogei_icon fl">
                                                <span
                                                    v-bind:style="{backgroundImage: 'url(../communication_icon/' + key + ')'}"></span>
                                            </span>
                                            <span class="tijiaogei_text fl">{{value}}</span>
                                            <span class="tijiaogei_del fr"
                                                @click.stop="delTopContactsCopy(index,value,key)"></span>
                                        </div>
                                    </li>
                                </checker-item>
                            </div>
                        </checker>
                    </ul>
                </div>
            </div>
            <div class="queding_button_box" @click="topContactsChoose">
                <div class="queding_button">确定</div>
            </div>
        </div>
    </div>
</template>
<script>
    import './SnNextAndCopy.less';
    import { OpenActionFunction, QueryUserInfoFunction } from 'sslib/common/SnJsBridge.js';
    import { cryptPost, nativeInfo } from 'sslib/common/base.js';
    //import DepartmentHandler from '../SnDepartment/DepartmentHandler.js';
    import { ApplyApproveData } from '../../../../src/pages/approval/ApprovalConstantData.js';//TODO 引用待处理
    import { showToast, setStorage, getStorage, getClass, isPC, setTitleOnly, initTitleMenu, deleteStorage } from 'sslib/common/extend.js';
    import { ToastPlugin, Group, Cell, CellBox, Checker, CheckerItem } from 'vux';
    Vue.use(ToastPlugin);
    export default {
        components: {
            Group,
            Cell,
            CellBox,
            Checker,
            CheckerItem
        },
        model: {
            event: 'choosedPerson'//子组件向父组件传值
        },
        props: {
            title: {//title
                type: Object
            },
            nextUserList: {//下一处理人列表
                type: Array
            },
            placeholder: {
                type: Object
            },
            delFlag: {//删除标识与功能  默认有删除功能
                type: Boolean,
                default: true
            },
            filterUserList: {//需要过滤的人员列表
                type: Array,
                default: []
            },
            showInactivated: {//是否显示未激活人员
                type: Boolean,
                default: false
            },
            auditModeId: {//固定审批模式默认为否
                type: Number,
                default: 1
            },
            value: {
                type: Object
            },
            salaryRelationFlag: {//该组件是否关联工资卡组件
                type: Boolean,
                default: false
            },
            relationFields: {//当前组件的关联组件
                type: Array
            },
            idx: { //明细组件的index
                type: Number
            },
            departmentRelationFlag: {//该组件是否关联部门组件
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
            UAId: {
                type: Number,
                default: 0
            },
            subTemplet: {// 模板id，有值，则会自动带入上一次提交人跟知会人，否则不会带入
                type: Number,
                default: 0
            },
            cpyId: {
                type: Number,
                default: 0
            },
            topContactsFlag: {
                type: Object,
                default: { 'show': false }
            },
            subTitle: {
                type: Array,
                default() {
                    return []
                }
            },
            applyApproveType: {
                type: Number,
                default: 0
            },
            nextUAIdClickFlag: {
                type: Boolean,
                default: true
            }
        },
        data: function () {
            return {
                nextUserFlag: false,
                moreCopy: false,
                moreNext: false,
                nextUserList: [],
                nextAndCopy: { 'nextUAIds': [], 'copyUAIds': [] },
                nextAndCopyName: { 'nextUANames': [], 'copyUANames': [] },
                selectType: 2,//选择模式，0表示单选，1表示多选,2表示pc 提交知会最近联系人组件
                contactsObj: {},
                chooseFlag: false,
                topContactsFromStorage: {},//
                topContacts: { next: [], copy: [] },//常用联系人组件显示数据
                choosedNext: {},//常用界面选择的next数组
                choosedCopy: [],//常用界面选择的copy数组
                UAId: this.UAId,
                cpyId: this.cpyId,
                subTemplet: this.subTemplet,// 模板id，有值，则会自动带入上一次提交人跟知会人，否则不会带入
                haveTopContacts: false,//是否有常用联系人
                topContactsShow: false,//常用联系人组件显示
                delayShow: 0,//等待键盘收起再弹出下拉框
            }
        },
        beforeCreate: function () {
        },
        created: function () {
            var _this = this;
            _this.nextAndCopyName.nextUANames = [];
            _this.setInitCopyToUaIds();
            _this.getOldNextAndCopy();
        },
        mounted: function () {//组件渲染生成dom
            var _this = this;
            if (0 != this.value.nextUaId) {
                this.nextAndCopy.nextUAIds = [this.value.nextUaId];
            }
            this.nextAndCopy.copyUAIds = this.value.copyToUaIds;
            //检测键盘是否弹起并设置下拉框弹出延时
            $(document).on("focus", "input,textarea", function () {
                _this.delayShow = 450;
            })
            $(document).on("blur", "input,textarea", function () {
                setTimeout(function () {
                    _this.delayShow = 0;
                }, 500)
            })
            // 根据模板id填充上一次提交成功的处理人跟知会人
            //_this.fillNextAndCopyContacts();

        },
        updated: function () {
        },
        /**
         * 监听父组件传值给子组件
         */
        watch: {
            initCopyToUaIds: function (oldVal, newVal) {
                this.setInitCopyToUaIds();
            },
            'topContactsFlag.show': function (newVal, oldVal) {
                var _this = this;
                if (!this.topContactsFlag.show) {//父组件隐藏子 组件        			        			
                    this.topContactsShow = false;
                }
            },
        },
        methods: {
        	/**
        	 * 联系人选择
        	 * @param {Object} type 0表示单选  1表示多选
        	 */
            choose: function (selectTypeParam) {
                if (!this.nextUAIdClickFlag && selectTypeParam == 0) {
                    showToast('不能选择下一处理人', 'middle');
                    return;
                }
                var _this = this;
                var MAX_NEXT = 20;
                var MAX_COPY = 20;

                var maxUAId = { '0': 1, '1': 20, '2': 20, '3': 1, '4': 20 };

                var selectType = selectTypeParam
                var selectId = [];//选中的人员	

                if (isPC()) {//pc
                    selectId = { selected_list_next_uaid: _this.nextAndCopy.nextUAIds, selected_list_copy_uaid: _this.nextAndCopy.copyUAIds };//选中的人员		
                    selectType = 2;
                    selectTypeParam = 2;
                } else {//app					
                    if (3 == selectType) {//常用提交给
                        selectType = 0;
                        if (!!_this.choosedNext) {
                            for (p in _this.choosedNext) {
                                selectId = [p];
                            }
                        }
                    } else if (4 == selectType) {//常用知会给	
                        selectType = 1;
                        if (0 < _this.choosedCopy.length) {
                            var copyUAIdsArr = [];
                            for (var i = 0; i < _this.choosedCopy.length; i++) {
                                var choosedCopyJson = _this.choosedCopy[i];
                                for (var p in choosedCopyJson) {
                                    copyUAIdsArr.push(p);
                                }
                            }
                            selectId = copyUAIdsArr;
                        }
                    } else if (0 == selectType) {//app提交给
                        var selectId = [];//选中的人员					
                        selectId = _this.nextAndCopy.nextUAIds;
                    } else if (1 == selectType) {//app知会给
                        var selectId = [];//选中的人员					
                        selectId = _this.nextAndCopy.copyUAIds;
                    }
                    if (_this.filterUserList && _this.filterUserList.length > 0) {
                        selectId = selectId.concat(_this.filterUserList);//过滤的人员与选择人员的合集
                    }
                }
                //app打开常用联系人分支,如果nextUAIdClickFlag为true，可以打开常用联系人，如果为false，直接打开通讯录  zc 20180801
                if ((_this.haveTopContacts && (0 == selectTypeParam || 1 == selectTypeParam) && 2 != selectTypeParam) && this.nextUAIdClickFlag) {//app有常用
                    _this.appChooseContacts();
                    return false;
                }
                //打开通讯录参数
                var selectJson = {
                    action: 'IntentAction_SelectContactWithOrgListActivity',
                    dataList: [
                        { key: 'from_key', value: 9, type: "int" },
                        { key: 'select_model', value: selectType + '', type: "string" },
                        { key: 'selected_list_tpay', value: JSON.stringify(selectId), type: "string" },
                        { key: 'is_show_inactivated', value: _this.showInactivated, type: "bool" }
                    ],
                    responseKeyList: [
                        { key: 'addusers_tpay', value: '', type: 'string' }
                    ]
                };
                OpenActionFunction(selectJson).then(function (data) {//调用app选择联系人窗口
                    if (2 == selectTypeParam) {
                        try {
                            var nextSelectUser = JSON.parse(data[0].value);//提交
                            var copySelectUser = JSON.parse(data[1].value);//知会
                            var MAX_COPYTO = maxUAId[selectTypeParam];//最多知会人个数
                            if (MAX_COPYTO < copySelectUser.length) {//超过二十个人
                                showToast('最多添加' + MAX_COPYTO + '个知会人', 'middle');
                            }
                            var nextUAIds = nextSelectUser.slice(0, MAX_COPYTO).map(function (item) {
                                return item.UAId;
                            });
                            var nextUANames = nextSelectUser.slice(0, MAX_COPYTO).map(function (item) {
                                return item.uName;
                            });
                            var copyUAIds = copySelectUser.slice(0, MAX_COPYTO).map(function (item) {
                                return item.UAId;
                            });
                            var copyUANames = copySelectUser.slice(0, MAX_COPYTO).map(function (item) {
                                return item.uName;
                            });
                            _this.nextAndCopy.nextUAIds = nextUAIds;
                            _this.nextAndCopyName.nextUANames = nextUANames;
                            _this.nextAndCopy.copyUAIds = copyUAIds;
                            _this.nextAndCopyName.copyUANames = copyUANames;

                        } catch (e) {
                            //不需要操作							        		
                            _this.nextAndCopy.nextUAIds = [];
                            _this.nextAndCopyName.nextUANames = [];
                            _this.nextAndCopy.copyUAIds = [];
                            _this.nextAndCopyName.copyUANames = [];
                        }
                    } else if (0 == selectTypeParam) {//app提交给
                        try {
                            var selectUser = JSON.parse(data[0].value);
                            var MAX_COPYTO = maxUAId[selectTypeParam];//最多提交人个数
                            var UAIds = selectUser.slice(0, MAX_COPYTO).map(function (item) {
                                return item.UAId;
                            });
                            var UANames = selectUser.slice(0, MAX_COPYTO).map(function (item) {
                                return item.uName;
                            });
                            _this.nextAndCopy.nextUAIds = UAIds; //人员Id
                            _this.nextAndCopyName.nextUANames = UANames; //人员名称							
                            if (MAX_COPYTO < _this.nextAndCopy.nextUAIds.length) {//超过1个人
                                showToast('最多添加' + MAX_COPYTO + '个提交人', 'middle');
                                _this.nextAndCopy.nextUAIds = _this.nextAndCopy.nextUAIds.slice(0, MAX_COPYTO);
                                _this.nextAndCopyName.nextUANames = _this.nextAndCopyName.nextUANames.slice(0, MAX_COPYTO);
                            }
                        } catch (e) {
                            //不需要操作							        		
                            _this.nextAndCopy.nextUAIds = [];
                            _this.nextAndCopyName.nextUANames = [];
                        }
                    } else if (1 == selectTypeParam) {//app知会给
                        try {
                            var selectUser = JSON.parse(data[0].value);
                            var MAX_COPYTO = maxUAId[selectTypeParam];//最多知会人个数
                            if (MAX_COPYTO < selectUser.length) {//超过二十个人
                                showToast('最多添加' + MAX_COPYTO + '个知会人', 'middle');
                            }
                            var UAIds = selectUser.slice(0, MAX_COPYTO).map(function (item) {
                                return item.UAId;
                            });
                            var UANames = selectUser.slice(0, MAX_COPYTO).map(function (item) {
                                return item.uName;
                            });

                            _this.nextAndCopy.copyUAIds = _this.nextAndCopy.copyUAIds.concat(UAIds); //人员Id							
                            _this.nextAndCopyName.copyUANames = _this.nextAndCopyName.copyUANames.concat(UANames); //人员名称																												
                            if (MAX_COPYTO < _this.nextAndCopy.copyUAIds.length) {//超过二十个人
                                showToast('最多添加' + MAX_COPYTO + '个知会人', 'middle');
                                _this.nextAndCopy.copyUAIds = _this.nextAndCopy.copyUAIds.slice(0, MAX_COPYTO);
                                _this.nextAndCopyName.copyUANames = _this.nextAndCopyName.copyUANames.slice(0, MAX_COPYTO);
                            }
                        } catch (e) {
                            //不需要操作
                            _this.nextAndCopy.copyUAIds = [];
                            _this.nextAndCopyName.copyUANames = [];
                        }
                    } else if (3 == selectTypeParam) {//常用选择提交给
                        try {
                            var selectUser = JSON.parse(data[0].value);
                            var MAX_COPYTO = maxUAId[selectTypeParam];//最多知会人个数
                            var UAIds = selectUser.slice(0, MAX_COPYTO).map(function (item) {
                                return item.UAId;
                            });
                            var UANames = selectUser.slice(0, MAX_COPYTO).map(function (item) {
                                return item.uName;
                            });
                            _this.choosedNext = {};
                            if (0 < UAIds.length) {//已选提交人添加到常用面板
                                var nextJson = {};
                                var nextUAIds = UAIds[0];
                                nextJson[nextUAIds] = UANames[0];
                                var nextLenght = _this.topContacts.next.length;
                                if (nextLenght == 0) {//为空时不用去重
                                    _this.topContacts.next.unshift(nextJson);
                                } else {
                                    for (var i = 0; i < nextLenght; i++) {//去重
                                        var jsonKey;
                                        for (var p in _this.topContacts.next[i]) {
                                            jsonKey = p;
                                        }
                                        if (nextUAIds == jsonKey) {
                                            break;
                                        }
                                        if (nextLenght == i + 1) {
                                            _this.topContacts.next.unshift(nextJson);//添加到 第一位																		
                                        }
                                    }
                                }
                                if (_this.topContacts.next.length > MAX_NEXT) {//数组超过COPY_TO_USERS，则取前面的COPY_TO_USERS个;
                                    _this.topContacts.next = _this.topContacts.next.slice(0, MAX_NEXT);
                                }
                                _this.choosedNext = nextJson;
                            }
                        } catch (e) { }
                    } else if (4 == selectTypeParam) {//常用选择知会给
                        try {
                            var selectUser = JSON.parse(data[0].value);
                            var MAX_COPYTO = maxUAId[selectTypeParam];//最多知会人个数
                            if (MAX_COPYTO < selectUser.length) {//超过二十个人
                                showToast('最多添加' + MAX_COPYTO + '个知会人', 'middle');
                            }
                            var UAIds = selectUser.slice(0, MAX_COPYTO).map(function (item) {
                                return item.UAId;
                            });
                            var UANames = selectUser.slice(0, MAX_COPYTO).map(function (item) {
                                return item.uName;
                            });
                            //_this.choosedCopy = [];							
                            if (0 < UAIds.length) {//已选知会人添加到常用面板
                                for (var i = 0; i < UAIds.length; i++) {
                                    var copyJson = {};
                                    var copyUAIds = UAIds[i];
                                    copyJson[copyUAIds] = UANames[i];
                                    var copyLenght = _this.topContacts.copy.length;

                                    if (copyLenght == 0) {//为空时不用去重
                                        _this.topContacts.copy.unshift(copyJson);
                                    } else {
                                        for (var j = 0; j < copyLenght; j++) {//去重
                                            var jsonKey;
                                            for (var p in _this.topContacts.copy[j]) {
                                                jsonKey = p;
                                            }
                                            if (copyUAIds == jsonKey) {
                                                break;
                                            }
                                            if (copyLenght == j + 1) {
                                                _this.topContacts.copy.unshift(copyJson);//添加到第一位								
                                            }
                                        }
                                    }
                                    if (_this.topContacts.copy.length > MAX_COPY) {//数组超过COPY_TO_USERS，则取前面的COPY_TO_USERS个;
                                        _this.topContacts.copy = _this.topContacts.copy.slice(0, MAX_COPY);
                                    }
                                    _this.choosedCopy.unshift(copyJson);
                                }
                            }
                        } catch (e) { }
                    }
                    if (3 != selectTypeParam && 4 != selectTypeParam) {
                        var nextAndCopyJson = { nextUaId: _this.nextAndCopy.nextUAIds[0], copyToUaIds: _this.nextAndCopy.copyUAIds, nextName: _this.nextAndCopyName.nextUANames[0], copyToNames: _this.nextAndCopyName.copyUANames }
                        _this.setServerData(nextAndCopyJson);//回传给父页面						
                    }
                });
            },
            //删除提交
            delNext: function (index) {
                var _this = this;
                if (_this.delFlag) {
                    _this.nextAndCopy.nextUAIds.splice(index, 1);//删除当前元素
                    _this.nextAndCopyName.nextUANames.splice(index, 1);
                    var nextAndCopyJson = { nextUaId: _this.nextAndCopy.nextUAIds[0], copyToUaIds: _this.nextAndCopy.copyUAIds, nextName: _this.nextAndCopyName.nextUANames[0], copyToNames: _this.nextAndCopyName.copyUANames }
                    _this.setServerData(nextAndCopyJson);
                }
            },
            //删除知会
            delCopy: function (index) {
                var _this = this;
                if (_this.delFlag) {
                    _this.nextAndCopy.copyUAIds.splice(index, 1);//删除当前元素
                    _this.nextAndCopyName.copyUANames.splice(index, 1);
                    var nextAndCopyJson = { nextUaId: _this.nextAndCopy.nextUAIds[0], copyToUaIds: _this.nextAndCopy.copyUAIds, nextName: _this.nextAndCopyName.nextUANames[0], copyToNames: _this.nextAndCopyName.copyUANames }
                    _this.setServerData(nextAndCopyJson);
                }
            },
			/**
			 * 设置发送给服务器的id与name
			 * @param {Object} UAId
			 * @param {Object} UAName
			 */
            setServerData: function (UAIds) {
                var _this = this;
                _this.$emit('choosedPerson', UAIds);//传递父组件服务器值
            },
            setInitCopyToUaIds: function () {
                var _this = this;
                if (!!_this.initCopyToUaIds && _this.initCopyToUaIdNames) {
                    _this.nextAndCopy.copyUAIds = _this.initCopyToUaIds;
                    _this.nextAndCopyName.copyUANames = _this.initCopyToUaIdNames;
                }

            },
            //app打开常用联系人选择界面
            appChooseContacts: function () {
                var _this = this;
                var MAX_NEXT = 20;
                var MAX_COPY = 20;
                var topContactsFromStorageStr = JSON.stringify(_this.topContactsFromStorage);
                var tempTop = JSON.parse(topContactsFromStorageStr);
                //根据UAId获取UAName

                var uaids = tempTop.next.map(function (item) {
                    for (var key in item) {
                        return key
                    }

                }).concat(tempTop.copy.map(function (item) {
                    for (var key in item) {
                        return key
                    }
                })
                );
                var userMap = {};
                QueryUserInfoFunction({
                    cpyId: _this.cpyId,
                    uaid: (uaids || []).filter(item => {
                        if (/^[1-9]+[0-9]*]*$/.test(item)) {
                            return item;
                        }
                    })
                }).then(function (res) {
                    (res.userList || []).forEach(function (item) {
                        //用户状态正常返回
                        if (0 == item.status) {
                            userMap[item.uaid] = item;
                        }
                    });
                    console.log('userMap==' + JSON.stringify(userMap))
                    tempTop.next = (tempTop.next || []).filter(function (item) {
                        for (var key in item) {
                            if (userMap[key]) {
                                item[key] = userMap[key].userName;
                                return item;
                            }
                        }
                    });

                    tempTop.copy = (tempTop.copy || []).filter(function (item) {
                        for (var key in item) {
                            if (userMap[key]) {
                                item[key] = userMap[key].userName;
                                return item;
                            }
                        }
                    });

                    _this.topContacts = tempTop;
                    _this.choosedNext = {};
                    if (0 < _this.nextAndCopy.nextUAIds.length) {//已选提交人添加到常用面板
                        var nextJson = {};
                        var nextUAIds = _this.nextAndCopy.nextUAIds[0];
                        nextJson[nextUAIds] = _this.nextAndCopyName.nextUANames[0];
                        var nextLenght = _this.topContacts.next.length;
                        if (nextLenght == 0) {//为空时不用去重
                            _this.topContacts.next.unshift(nextJson);
                        } else {
                            for (var i = 0; i < nextLenght; i++) {//去重
                                var jsonKey;
                                for (var p in _this.topContacts.next[i]) {
                                    jsonKey = p;
                                }
                                if (nextUAIds == jsonKey) {
                                    break;
                                }
                                if (nextLenght == i + 1) {
                                    _this.topContacts.next.unshift(nextJson);//添加到 第一位																		
                                }
                            }
                        }
                        if (_this.topContacts.next.length > MAX_NEXT) {//数组超过COPY_TO_USERS，则取前面的COPY_TO_USERS个;
                            _this.topContacts.next = _this.topContacts.next.slice(0, MAX_NEXT);
                        }
                        _this.choosedNext = nextJson;
                    }
                    _this.choosedCopy = [];
                    if (0 < _this.nextAndCopy.copyUAIds.length) {//已选知会人添加到常用面板
                        for (var i = 0; i < _this.nextAndCopy.copyUAIds.length; i++) {
                            var copyJson = {};
                            var copyUAIds = _this.nextAndCopy.copyUAIds[i];
                            copyJson[copyUAIds] = _this.nextAndCopyName.copyUANames[i];
                            var copyLenght = _this.topContacts.copy.length;
                            if (copyLenght == 0) {//为空时不用去重
                                _this.topContacts.copy.unshift(copyJson);
                            } else {
                                for (var j = 0; j < copyLenght; j++) {//去重
                                    var jsonKey;
                                    for (var p in _this.topContacts.copy[j]) {
                                        jsonKey = p;
                                    }
                                    if (copyUAIds == jsonKey) {
                                        break;
                                    }
                                    if (copyLenght == j + 1) {
                                        _this.topContacts.copy.unshift(copyJson);//添加到第一位								
                                    }
                                }
                            }
                            if (_this.topContacts.copy.length > MAX_COPY) {//数组超过COPY_TO_USERS，则取前  面的COPY_TO_USERS个;
                                _this.topContacts.copy = _this.topContacts.copy.slice(0, MAX_COPY);
                            }
                            _this.choosedCopy.unshift(copyJson);
                        }
                    };

                    _this.topContactsFlag.show = true;
                    //等待键盘收起再弹出下拉 框
                    setTimeout(function () {
                        _this.topContactsShow = true;
                        _this.delayShow = 0;
                    }, _this.delayShow);
                    //打开二级页面记住一级页面滚动位 置
                    var bodyScrTop = $("body").scrollTop();
                    $("body").css({
                        'overflow': 'hidden',
                        'position': 'fixed',
                        'top': bodyScrTop * -1
                    });
                    $("body").attr("bodyScrTop", bodyScrTop);
                    setTitleOnly("选择常用联系人");
                });



            },
            //常用联系人选择
            topContactsChoose: function () {
                var _this = this;
                var MAX_COPYTO = 20;
                if ({} != _this.choosedNext && undefined != _this.choosedNext && '' != _this.choosedNext) {
                    for (var p in _this.choosedNext) {
                        _this.nextAndCopy.nextUAIds = [p];
                        var value = _this.choosedNext[p];
                        _this.nextAndCopyName.nextUANames = [value];
                    }
                } else {
                    _this.nextAndCopy.nextUAIds = [];
                    _this.nextAndCopyName.nextUANames = [];
                }
                if (0 < _this.choosedCopy.length) {
                    var copyUAIdsArr = [];
                    var copyUANamesArr = [];
                    for (var i = 0; i < _this.choosedCopy.length; i++) {
                        var choosedCopyJson = _this.choosedCopy[i];
                        for (var p in choosedCopyJson) {
                            copyUAIdsArr.push(p);
                            var value = choosedCopyJson[p];
                            copyUANamesArr.push(value);
                        }
                    }
                    _this.nextAndCopy.copyUAIds = copyUAIdsArr;
                    _this.nextAndCopyName.copyUANames = copyUANamesArr;
                    if (MAX_COPYTO < _this.nextAndCopy.copyUAIds.length) {//超过二十个人
                        showToast('最多添加' + MAX_COPYTO + '个知会人', 'middle');
                        _this.nextAndCopy.copyUAIds = _this.nextAndCopy.copyUAIds.slice(0, MAX_COPYTO);
                        _this.nextAndCopyName.copyUANames = _this.nextAndCopyName.copyUANames.slice(0, MAX_COPYTO);
                    }
                } else {
                    _this.nextAndCopy.copyUAIds = [];
                    _this.nextAndCopyName.copyUANames = [];
                }
                var nextAndCopyJson = { nextUaId: _this.nextAndCopy.nextUAIds[0], copyToUaIds: _this.nextAndCopy.copyUAIds, nextName: _this.nextAndCopyName.nextUANames[0], copyToNames: _this.nextAndCopyName.copyUANames }
                _this.setServerData(nextAndCopyJson);//回传给父页面	
                _this.setBodysrcTop();
                this.topContactsFlag.show = false;
                setTimeout(() => {
                    initTitleMenu(_this.subTitle);//设置title及按钮
                }, 250)
                //this.topContactsShow = false;
            },
        	/**
        	 * 常用联系人界面选择
        	 * @param {Object} type 0表示单选  1 表示多选
        	 */
            chooseTop: function (selectTypeParam) {
                var _this = this;
                _this.choose(selectTypeParam)
            },
            delTopContactsNext: function (index, value, key) {
                var _this = this;
                var storageKey = 'topContactsFromStorage_' + (_this.UAId + '') + '_' + (_this.cpyId + '');
                //删除常用列表
                _this.topContacts.next.splice(index, 1);
                //删除选中列表
                delete _this.choosedNext[key];
                //删除缓存数据并重新保 存            	
                _this.topContactsFromStorage.next.splice(index, 1);
                setStorage(storageKey, JSON.stringify(_this.topContactsFromStorage));
                if (undefined != getStorage(storageKey) && "" != getStorage(storageKey)) {
                    _this.topContactsFromStorage = JSON.parse(getStorage(storageKey));
                    if (_this.topContactsFromStorage.next.length > 0 || _this.topContactsFromStorage.copy.length > 0) {
                        _this.haveTopContacts = true;
                    } else {
                        _this.haveTopContacts = false;
                    }
                } else {
                    _this.haveTopContacts = false;
                }
            },
            delTopContactsCopy: function (index, value, key) {
                var _this = this;
                var storageKey = 'topContactsFromStorage_' + (_this.UAId + '') + '_' + (_this.cpyId + '');
                //删除常用列表
                _this.topContacts.copy.splice(index, 1);

                //删除选中列表						
                for (var i = 0; i < _this.choosedCopy.length; i++) {
                    var choosedCopyJosn = _this.choosedCopy[i];
                    var delJsonKey;
                    for (var p in choosedCopyJosn) {
                        delJsonKey = p
                    }
                    if (key == delJsonKey) {
                        _this.choosedCopy.splice(i, 1)
                    }
                }
                //				_this.choosedCopy.splice(index,1);				
                //删除缓存数据并重新保存            	
                _this.topContactsFromStorage.copy.splice(index, 1);
                setStorage(storageKey, JSON.stringify(_this.topContactsFromStorage));
                if (undefined != getStorage(storageKey) && "" != getStorage(storageKey)) {
                    _this.topContactsFromStorage = JSON.parse(getStorage(storageKey));
                    if (_this.topContactsFromStorage.next.length > 0 || _this.topContactsFromStorage.copy.length > 0) {
                        _this.haveTopContacts = true;
                    } else {
                        _this.haveTopContacts = false;
                    }
                } else {
                    _this.haveTopContacts = false;
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
            },
            getNextAndCopyForStorage: function () {
                var _this = this;
                //取缓存常用人数 据
                var key = 'topContactsFromStorage_' + (_this.UAId + '') + '_' + (_this.cpyId + '');
                if (undefined != getStorage(key) && "" != getStorage(key)) {
                    _this.topContactsFromStorage = JSON.parse(getStorage(key));
                    if (_this.topContactsFromStorage.next.length > 0 || _this.topContactsFromStorage.copy.length > 0) {
                        _this.haveTopContacts = true;
                    }
                }


            },
            //兼容老OA数据
            getOldNextAndCopy: function () {
                var _this = this;
                var oldNextKey = _this.cpyId + "-" + _this.UAId + "-" + "next";
                var oldCopyKey = _this.cpyId + "-" + _this.UAId + "-" + "copy";
                var oldNextArr, oldCopyArr;
                var MAX_NEXT = 20;
                var MAX_COPY = 20;
                var key = 'topContactsFromStorage_' + (_this.UAId + '') + '_' + (_this.cpyId + '');
                var topContacts = { next: [], copy: [] };
                if (undefined != getStorage(key) && "" != getStorage(key)) {
                    topContacts = JSON.parse(getStorage(key));
                }
                //提交人处理
                if (undefined != getStorage(oldNextKey) && "" != getStorage(oldNextKey)) {
                    oldNextArr = JSON.parse(getStorage(oldNextKey));
                    if (0 < oldNextArr.length) {
                        for (var i = 0; i < oldNextArr.length; i++) {
                            var arrStr = oldNextArr[i];
                            var nextJson = {};
                            var nextUAIds = arrStr.split('*')[0];
                            nextJson[nextUAIds] = arrStr.split('*')[1];
                            var nextLenght = topContacts.next.length;
                            if (nextLenght == 0) {//为空时不用去重
                                topContacts.next.unshift(nextJson);
                            } else {
                                var nextLenght = topContacts.next.length;
                                for (var j = 0; j < nextLenght; j++) {//去重
                                    var jsonKey;
                                    for (var p in topContacts.next[j]) {
                                        jsonKey = p;
                                    }
                                    if (nextUAIds == jsonKey) {
                                        break;
                                    }
                                    if (nextLenght == j + 1) {
                                        topContacts.next.unshift(nextJson);//添加到第一位									
                                    }
                                }
                            }
                            if (topContacts.next.length > MAX_NEXT) {//数组超过COPY_TO_USERS， 则取前 面的COPY_TO_USERS个 ;
                                topContacts.next = topContacts.next.slice(0, MAX_NEXT);
                            }
                        }
                    }
                }

                //知会人处理
                if (undefined != getStorage(oldCopyKey) && "" != getStorage(oldCopyKey)) {
                    oldCopyArr = JSON.parse(getStorage(oldCopyKey));
                    if (0 < oldCopyArr.length) {
                        for (var i = 0; i < oldCopyArr.length; i++) {
                            var arrStr = oldCopyArr[i];
                            var copyJson = {};
                            var copyUAIds = arrStr.split('*')[0];
                            copyJson[copyUAIds] = arrStr.split('*')[1];
                            var copyLenght = topContacts.copy.length;
                            if (copyLenght == 0) {//为空时不用去重
                                topContacts.copy.unshift(copyJson);
                            } else {
                                var copyLenght = topContacts.copy.length;
                                for (var j = 0; j < copyLenght; j++) {//去重
                                    var jsonKey;
                                    for (var p in topContacts.copy[j]) {
                                        jsonKey = p;
                                    }
                                    if (copyUAIds == jsonKey) {
                                        break;
                                    }
                                    if (copyLenght == j + 1) {
                                        topContacts.copy.unshift(copyJson);//添加到第一位									
                                    }
                                }
                            }
                            if (topContacts.copy.length > MAX_COPY) {//数组超过COPY_TO_USERS， 则取前 面的COPY_TO_USERS个 ;
                                topContacts.copy = topContacts.copy.slice(0, MAX_COPY);
                            }
                        }
                    }
                }
                setStorage(key, JSON.stringify(topContacts));
                deleteStorage(oldNextKey);
                deleteStorage(oldCopyKey);
                _this.getNextAndCopyForStorage();
            },
            // 根据模板id填充上一次提交成功的处理人跟知会人
            fillNextAndCopyContacts: function (UAId, UAName) {
                var _this = this;
                if (_this.subTemplet <= 0) {
                    console.log('_this.subTemplet <= 0 not apply ,cant not fillNextAndCopyContacts');
                    return;
                }
                var key = 'key_ContactsByTmpletType_' + (_this.UAId + '') + '_' + (_this.cpyId + '') + '_' + (_this.subTemplet + '');
                if (undefined != getStorage(key) && "" != getStorage(key) && !UAId) {
                    var nextAndCopyJson = JSON.parse(getStorage(key));
                    // 填充界面元素
                    if (undefined != nextAndCopyJson && "" != nextAndCopyJson) {
                        if (undefined != nextAndCopyJson.nextUaId && "" != nextAndCopyJson.nextUaId &&
                            nextAndCopyJson.nextUaId > 0 &&
                            undefined != nextAndCopyJson.nextName && "" != nextAndCopyJson.nextName) {
                            _this.nextAndCopy.nextUAIds = [nextAndCopyJson.nextUaId];
                            if (/^[1-9]+[0-9]*]*$/.test(nextAndCopyJson.nextUaId)) {
                                QueryUserInfoFunction({
                                    cpyId: _this.cpyId,
                                    uaid: [nextAndCopyJson.nextUaId]
                                }).then(function (res) {
                                    if ((res.userList && 0 < res.userList.length) && 0 == res.userList[0].status) {
                                        _this.nextAndCopyName.nextUANames = [res.userList[0].userName];
                                    } else {
                                        _this.nextAndCopy.nextUAIds = [];
                                        _this.nextAndCopyName.nextUANames = [''];
                                    }
                                });
                            }
                        }
                        //如果是审批页面的话，知会人不自动显示 zc 20180704
                        if (_this.applyApproveType == ApplyApproveData.APPLYTYPE) {
                            if (undefined != nextAndCopyJson.copyToUaIds && "" != nextAndCopyJson.copyToUaIds &&
                                undefined != nextAndCopyJson.copyToNames && "" != nextAndCopyJson.copyToNames) {
                                _this.nextAndCopy.copyUAIds = [];
                                _this.nextAndCopyName.copyUANames = [];

                                var uaids = nextAndCopyJson.copyToUaIds.filter(function (item) {
                                    if (/^[1-9]+[0-9]*]*$/.test(item)) {
                                        return item;
                                    }
                                });

                                QueryUserInfoFunction({
                                    cpyId: _this.cpyId,
                                    uaid: uaids || []
                                }).then(function (res) {
                                    (res.userList || []).forEach(function (item) {
                                        if (0 == item.status) {
                                            _this.nextAndCopy.copyUAIds.push(item.uaid);
                                            _this.nextAndCopyName.copyUANames.push(item.userName);
                                        }
                                    });

                                });
                            }
                        }
                        //如果是审批页面的话，知会人不自动显示  zc 20180704
                        if (_this.applyApproveType == ApplyApproveData.APPROVETYPE) {
                            nextAndCopyJson.copyToUaIds = _this.nextAndCopy.copyUAIds;
                            nextAndCopyJson.copyToNames = _this.nextAndCopyName.copyUANames;
                        }
                        // 同时将选择数据回传父元素
                        _this.setServerData(nextAndCopyJson);
                    }
                } else if (UAId) {//续签合同中的选择人员后，需要把人员id赋值给下一个处理人
                    _this.nextAndCopy.nextUAIds = [UAId];
                    _this.nextAndCopyName.nextUANames = [UAName];
                    var nextAndCopyJson = { nextUaId: UAId, nextName: UAName, copyToUaIds: _this.nextAndCopy.copyUAIds, copyToNames: _this.nextAndCopyName.copyUANames };
                    // 同时将选择数据回传父元素 
                    _this.setServerData(nextAndCopyJson);
                } else {
                    console.log('getStorage key_ContactsByTmpletType_ is null,cant not fillNextAndCopyContacts');
                }
            }
        }
    }
</script>