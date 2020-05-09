<template>
    <div class="outDiv">
        <cell :title="title" v-bind:class="[snCityList, (textAlign === 'right') ? showRight : '']" value-align="left" @click.native="openCitySelect">
            <input
                type="text"
                class="popupInput"
                v-model="cityName"
                :placeholder="placeholder"
                readonly="readonly"
            >
        </cell>
        <group>
            <popup-picker
                :show.sync="showPopup"
                popup-title="选择省市"
                @on-change="setProvCity('save')"
                :show-cell="false"
                :columns="3"
                :data="cityData"
                v-model="selectedData"
            ></popup-picker>
        </group>
        <!--<div v-transfer-dom>-->
        <!--<popup v-model="showPopup" position="bottom" :show-mask="true"-->
        <!--style="min-height: 2rem;background: #ffffff " @touchmove="pickerMove($event)">-->
        <!--<div class="titleOption">-->
        <!--<div class="dialog-title">-->
        <!--<div class="titleText">选择省市</div>-->
        <!--</div>-->
        <!--<div class="cancel" @click="setProvCity('close')">-->
        <!--<img src="resource/img/cityList/icon_btn_close.png" class="icon"-->
        <!--/>-->
        <!--</div>-->
        <!--<div class="success" @click="setProvCity('save')">-->
        <!--<img src="resource/img/cityList/icon_btn_ok.png" class="icon"-->
        <!--/>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="citySelect" @touchmove="pickerMove($event)">-->
        <!--<div class="">-->
        <!--<picker :data='cityData' :columns=3 v-model='selectedData' @touchmove="pickerMove($event)"></picker>-->
        <!--</div>-->
        <!--</div>-->
        <!--</popup>-->
        <!--</div>-->
    </div>
</template>

<script>
import './SnCityList.less';
import { SelectProvinceWidget } from '../../../lib/common/SnJsBridge.js';
import { callHandler, cryptPost } from '../../../lib/common/base.js';
import { showToast, getStorage, setStorage } from '../../../lib/common/extend.js';
import { Group, Cell, Popup, PopupPicker, TransferDom, Picker, dateFormat } from 'vux';
export default {
    directives: {
        TransferDom
    },
    components: {
        PopupPicker,
        Popup,
        Picker,
        Group,
        Cell
    },
    data: function () {
        return {
            showPopup: false,
            cityValue: '',
            cityName: '',
            proCityData: [],
            cityData: [],
            provinceValue: '',
            provinceName: '',
            selectedValue: '',
            selectedData: ['1', '1610'],
            lastSelectedValue: ['1', '1610'],
            showRight:'showRight',
            snCityList:'snCityList',
        }
    },
    props: {
        title: {
            type: String,
            default: ""
        },
        placeholder: {
            type: String,
            default: ""
        },
        value: {
            type: String
        },
        relationFiledIds: {
            type: String,
            default: ''
        },
        isInDetailFlag: {//是否明细组件 默认为否
            type: Boolean,
            default: false
        },
        idx: { //明细组件的index
            type: Number
        },
        cityOldName: {
            type: String,
            default: ''
        },
        textAlign: {
            type: String,
            default: 'left',
        },
    },
    beforeCreate: function () {
    },
    created: function () {
        var _this = this;
        _this.getProCityList();
    },
    mounted: function () {//存在value,显示value  供存草稿使用
        var _this = this;
        if (!!_this.value) {
            if (_this.cityOldName) {
                _this.cityName = _this.cityOldName;
                _this.selectedValue = _this.cityName;
            } else {
                _this.getProCityList().then(dataList => {
                    _this.dataList = dataList;
                    _this.cityValue = _this.value;
                    //根据value从省市数据中获取省市名称来显示
                    for (var i = 0; i < _this.proCityData.length; i++) {
                        if (!!_this.proCityData[i].cityList) {
                            for (var k = 0; k < _this.proCityData[i].cityList.length; k++) {
                                if (_this.proCityData[i].cityList[k].cityId == _this.value) {
                                    _this.cityName = _this.proCityData[i].provName + " " + _this.proCityData[i].cityList[k].cityName;
                                    var data = _this.proCityData[i];
                                    var index = k;
                                    setTimeout(function () {
                                        _this.selectedData = [data.provId + "", data.cityList[index].cityId + ""];
                                        _this.lastSelectedValue = [..._this.selectedData];
                                    }, 1000);
                                }
                            }
                        }
                    }
                    _this.selectedValue = _this.cityName;
                });
            }
        }
    },
    methods: {
        /*
        * 抵消picker的滚动影响父级元素
        * */
        pickerMove(event) {
            //                var event = window.event || arguments[0];
            console.log(event);
            event.preventDefault();
            event.stopPropagation();
        },
        /*
        * 根据id 匹配城市信息
        * */
        findCityData(provIndex, cityIndex) {
            var _this = this;
            var obj = {};
            _this.cityData.forEach((item) => {
                if (item.value == provIndex) {
                    obj.provName = item.name;
                    obj.provId = item.value;
                } else if (item.value == cityIndex) {
                    obj.cityName = item.name;
                    obj.cityId = item.value;
                }
            });
            return obj;
        },
        /*
        * 保存、取消选择
        * */
        setProvCity(type) {
            var event = window.event || arguments[0];
            event.preventDefault();
            event.stopPropagation();
            var _this = this;
            _this.showPopup = false;
            if (type == 'save') {
                _this.lastSelectedValue = [..._this.selectedData];
                var data = _this.findCityData(_this.selectedData[0], _this.selectedData[1]);
                _this.cityName = data.provName + " " + data.cityName;
                _this.selectedValue = _this.cityName;
                _this.cityValue = data.cityId;
                _this.$emit('input', _this.cityValue);
                _this.setContentValue(_this.cityName);//设置发送给服务器的数据
                console.log(_this.$root.$refs[_this.relationFiledIds]);
                if (_this.relationFiledIds == 'branch') {//分行下拉框的选择值清空
                    if (_this.isInDetailFlag) {//明细
                        //需要清空content中的值，不然会被控件重新赋值
                        _this.$root.content.inDetail[_this.idx].branchDisplay = '';
                        _this.$parent.$refs[_this.relationFiledIds][_this.idx].selectedValue = '';
                        _this.$parent.$refs[_this.relationFiledIds][_this.idx].$emit('input', '');
                    } else {//非明细
                        //需要清空content中的值，不然会被控件重新赋值
                        _this.$root.content.branch = '';
                        _this.$root.content.branchDisplay = '';
                        if (_this.$root.$refs[_this.relationFiledIds] && _this.$root.$refs[_this.relationFiledIds][0]) {
                            _this.$root.$refs[_this.relationFiledIds][0].current = {};
                            _this.$root.$refs[_this.relationFiledIds][0].$emit('input', '');
                        }
                        //后续操作中的控件值
                        else if (_this.$parent.$refs[_this.relationFiledIds]) {
                            if (_this.$parent.$refs[_this.relationFiledIds][0]) {
                                _this.$parent.$refs[_this.relationFiledIds][0].current = {};
                            }
                            if (_this.$parent.$refs[_this.relationFiledIds]) {
                                _this.$parent.$refs[_this.relationFiledIds].current = {};
                            }
                            if (_this.$parent.nextOprData && _this.$parent.nextOprData[_this.relationFiledIds]) {
                                _this.$parent.nextOprData[_this.relationFiledIds] = '';
                            }
                        }
                    }
                }
            } else if (type == 'close') {
                _this.selectedData = [..._this.lastSelectedValue];
            }
        },
        /*
        * 打开弹窗
        * */
        openCitySelect() {
            var _this = this;
            //解决城市选择弹框白屏的问题
            setTimeout(function () {
                _this.showPopup = true;
            }, 500);
        },
        /**
         * 获取省市数据
         */
        getProCityList: function () {
            var _this = this;
            let todayStr = dateFormat(new Date(), "YYYY_MM_DD");
            let cityKey = "provList" + todayStr;
            var provList;
            return new Promise(function (res) {
                if ("" != getStorage(cityKey)) {
                    //getStorage取本地存储的provList
                    var provList = JSON.parse(getStorage(cityKey));
                    _this.showProCity(provList);
                    _this.handleCityDate(provList);
                    res(provList);
                } else {
                    //取后台省市列表
                    cryptPost('approval/getProCityList.do', {}).then(function (result) {
                        provList = result.provList;
                        setStorage(cityKey, JSON.stringify(provList));//设置省市列表缓存
                        _this.handleCityDate(provList);
                        _this.showProCity(provList);
                        _this.submit();//初始化传值父组件
                        res(provList);
                    });
                }
            });
        },
        //处理地点格式为选择器适用的
        handleCityDate(provList) {
            var _this = this;
            var array = [];
            if (!!provList && provList.length > 0) {
                provList.forEach((province) => {
                    var provinceObj = {
                        name: province.provName,
                        value: '' + province.provId,
                        parent: 0
                    };
                    if (0 == province.provId) {
                        provinceObj = {
                            name: province.provName,
                            value: 'default',
                        };
                    }
                    array.push(provinceObj);
                    if (!!province.cityList && province.cityList.length > 0) {
                        province.cityList.forEach((city) => {
                            var cityObj = {
                                name: city.cityName,
                                value: '' + city.cityId,
                                parent: '' + province.provId
                            };
                            if (0 == province.provId) {
                                cityObj = {
                                    name: city.cityName,
                                    value: '' + city.cityId,
                                    parent: 'default'
                                };
                            }
                            array.push(cityObj);
                        });
                    }
                })
            }
            _this.cityData = array;
        },
        //            selectProCity() {
        //                var _this = this;
        //                //取省市列表，请求native选择
        //                var provinceList = new Array;
        //                var cityList = new Array;
        //                var proCityData = _this.proCityData;
        //                if ('' != proCityData.length) {
        //                    proCityData.map(function (item, index) {
        //                        provinceList.push({id: item.provId, name: item.provName});
        //                        var arrayChild = new Array;
        //                        var cityDate = item.cityList;
        //                        cityDate.map(function (city, i) {
        //                            arrayChild.push({id: city.cityId, name: city.cityName});
        //                        });
        //                        cityList.push(arrayChild);
        //
        //                    });
        //                }
        //
        //                var provinceCityList = {mProvinceList: provinceList, mCityList: cityList};
        //                var selectProvinceCity = {selectID: '', mSelPrivience: provinceList[0], mSelCity: cityList[0][0]};
        //                var provinceListAll = {
        //                    provienceCityList: provinceCityList,
        //                    selectProvienceCity: selectProvinceCity,
        //                    title: '选择省市'
        //                };
        //                //请求native选择省市
        //                SelectProvinceWidget(JSON.stringify(provinceListAll)).then(function (data) { //调用native选择
        //                    console.log('SelectProvinceWidget', data);
        //                    if ('' != data) {
        //                        _this.cityName = data.mSelPrivience.name + " " + data.mSelCity.name;
        //                        _this.cityValue = data.mSelCity.id;
        //                        _this.$emit('input', _this.cityValue);
        //                        _this.setContentValue(_this.cityName);//设置发送给服务器的数据
        //                        _this.selectedValue = _this.cityName;
        //                        if (_this.relationFiledIds == 'branch') {//分行下拉框的选择值清空
        //                            if (_this.isInDetailFlag) {//明细
        //                                //需要清空content中的值，不然会被控件重新赋值
        //                                _this.$root.content.inDetail[_this.idx].branchDisplay = '';
        //                                _this.$parent.$refs[_this.relationFiledIds][_this.idx].selectedValue = '';
        //                                _this.$parent.$refs[_this.relationFiledIds][_this.idx].$emit('input', '');
        //                            } else {//非明细
        //                                //需要清空content中的值，不然会被控件重新赋值
        //                                _this.$root.content.branchDisplay = '';
        //                                if (_this.$root.$refs[_this.relationFiledIds]) {
        //                                    _this.$root.$refs[_this.relationFiledIds][0].selectedValue = '';
        //                                    _this.$root.$refs[_this.relationFiledIds][0].$emit('input', '');
        //                                }
        //                                //后续操作中的控件值
        //                                else if (_this.$parent.$refs[_this.relationFiledIds]) {
        //                                    _this.$parent.$refs[_this.relationFiledIds][0].selectedValue = '';
        //                                    _this.$parent.nextOprData[_this.relationFiledIds] = '';
        //                                }
        //                            }
        //                        }
        //                    }
        //                });
        //            },
        showProCity(proCityList) {
            var _this = this;
            _this.proCityData = proCityList; //proCityData需要用到的省市数据
        },
        /**
         * 设置父组件content中的值
         * @param {Object} cityDisplay
         */
        setContentValue: function (cityDisplay) {
            console.log('cityDisplay', cityDisplay);
            var _this = this;
            //如果在明细中，需要区分
            if (_this.isInDetailFlag) {//明细
                _this.$root.content.inDetail[_this.idx]['cityDisplay'] = cityDisplay || '';//传递给服务器
            } else {
                _this.$root.content.cityDisplay = cityDisplay || '';//给content中另存一个bankDisplay的值
            }
        },
    },
    watch: {
        showPopup(newVal, oldVal) {
            if (newVal) {
                $('body').css('overflow', 'hidden');
            } else {
                $('body').css('overflow', 'auto');
            }
        },
        /**
         * 数据显示 主要针对删除使用
         * @param {Object} newVal
         * @param {Object} oldVal
         */
        value: function (newVal, oldVal) {
            var _this = this;
            if (_this.value) {
                _this.cityValue = _this.value;
                if (_this.isInDetailFlag) {//明细
                    _this.cityName = _this.$root.content.inDetail[_this.idx].cityDisplay || '';//值显示
                } else {
                    _this.cityName = _this.$root.content.cityDisplay || '';//值显示
                }
            }
        },
    }
}
</script>