<template>
    <cell :title="title" class="snCityList" value-align="left" @click.native="selectProCity">
        <input type="text" class="popupInput sn-pointer" v-model="cityName" :placeholder="placeholder" readonly="readonly">
    </cell>
</template>

<script>
import './SnCityList.less';
import { SelectProvinceWidget } from '../../../lib/common/SnJsBridge.js';
import { callHandler, cryptPost } from '../../../lib/common/base.js';
import { doPost } from "../../../lib/common/Net.js";
import { showToast, getStorage, setStorage } from '../../../lib/common/extend.js';
import { Group, Cell, ToastPlugin } from 'vux';
Vue.use(ToastPlugin);
export default {
    components: {
        Group,
        Cell
    },
    data: function () {
        return {
            cityValue: '',
            cityName: '',
            proCityData: '',
            provinceValue: '',
            provinceName: '',
            selectedValue: '',
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
        privAndcity: {
            type: Object
        }
    },
    beforeCreate: function () {
    },
    created: function () {
        var _this = this;
        _this.getProCityList();
    },
    mounted: function () {//存在value,显示value  供存草稿使用
        var _this = this;
        if (_this.value) {
            _this.cityValue = _this.value;
            //根据value从省市数据中获取省市名称来显示
            for (var i = 0; i < _this.proCityData.length; i++) {
                if (!!_this.proCityData[i].cityList) {
                    for (var k = 0; k < _this.proCityData[i].cityList.length; k++) {
                        if (_this.proCityData[i].cityList[k].cityId == _this.value) {
                            _this.cityName = _this.proCityData[i].provName + " " + _this.proCityData[i].cityList[k].cityName;
                            continue;
                        }
                    }
                }
            }
            _this.selectedValue = _this.cityName;
        }
    },
    methods: {
        /**
         * 获取省市数据
         */
        getProCityList: function () {
            var _this = this;
            var provList;
            if ("" != getStorage("provList")) {
                //getStorage取本地存储的provList
                var provList = JSON.parse(getStorage("provList"));
                _this.showProCity(provList);
            } else {
                //取后台省市列表
                doPost('openAccount/getProCityList.do', {}).then(function (result) {
                    if (0 == result.code) {
                        provList = result.data.provList;
                        setStorage("provList", JSON.stringify(provList));//设置省市列表缓存
                        _this.showProCity(provList);
                    }
                });
            }
        },
        selectProCity() {
            var _this = this;
            //取省市列表，请求native选择
            var provinceList = new Array;
            var cityList = new Array;
            var proCityData = _this.proCityData;
            if ('' != proCityData.length) {
                proCityData.map(function (item, index) {
                    provinceList.push({ id: item.provId, name: item.provName });
                    var arrayChild = new Array;
                    var cityDate = item.cityList;
                    cityDate.map(function (city, i) {
                        arrayChild.push({ id: city.cityId, name: city.cityName });
                    });
                    cityList.push(arrayChild);

                });
            }
            var provinceCityList = { mProvinceList: provinceList, mCityList: cityList };
            var selectProvinceCity = { selectID: '', mSelPrivience: provinceList[0], mSelCity: cityList[0][0] };
            var provinceListAll = { provienceCityList: provinceCityList, selectProvienceCity: selectProvinceCity, title: '选择省市' };
            //请求native选择省市
            SelectProvinceWidget(JSON.stringify(provinceListAll)).then(function (data) { //调用native选择
                if ('' != data) {
                    _this.cityName = data.mSelPrivience.name + " " + data.mSelCity.name;
                    _this.cityValue = data.mSelCity.id;
                    var privAndcity = {
                        provId: data.mSelPrivience.id,
                        provName: data.mSelPrivience.name,
                        cityId: data.mSelCity.id,
                        cityName: data.mSelCity.name                    }
                    _this.$emit('input', privAndcity);
                    _this.setContentValue(privAndcity, _this.cityName);//设置发送给服务器的数据
                    _this.selectedValue = _this.cityName;
                }
            });
        },
        showProCity(proCityList) {
            var _this = this;
            _this.proCityData = proCityList; //proCityData需要用到的省市数据
        },
        /**
         * 设置父组件content中的值
         * @param {Object} cityDisplay
         */
        setContentValue: function (privAndcity, cityDisplay) {
            var _this = this;
            var city = { 'privAndcity': privAndcity, 'cityDisplay': cityDisplay };
            _this.$emit('city', city);
            //          	//如果在明细中，需要区分
            //				if(_this.isInDetailFlag){//明细
            //				   _this.$root.content.inDetail[_this.idx]['cityDisplay'] = cityDisplay || '';//传递给服务器
            //				} else {
            //				   _this.$root.content.cityDisplay = cityDisplay || '';//给content中另存一个bankDisplay的值
            //				}
        },
    },
    watch: {
        /**
         * 数据显示 主要针对删除使用
         * @param {Object} newVal
         * @param {Object} oldVal
         */
        value: function (newVal, oldVal) {

            var _this = this;
            //	        	if(_this.value){
            //	        		_this.cityValue = _this.value;
            //	        		
            //		        	if(_this.isInDetailFlag){//明细
            //					   _this.cityName = _this.$root.content.inDetail[_this.idx].cityDisplay || '' ;//值显示
            //					} else {
            //					  _this.cityName =  _this.$root.content.cityDisplay || '' ;//值显示
            //					}
            //	        	}
        },
    }
}
</script>