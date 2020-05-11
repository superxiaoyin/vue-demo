<template>
	<div>
		<cell :title="title" class="snCityList" value-align="left" @click.native="openCitySelect">
			<input type="text" class="popupInput" v-model="cityName" :placeholder="placeholder"
				   readonly="readonly"/>
		</cell>
		<popup-picker :show.sync="showPopup"  popup-title="选择省市" @on-change="setProvCity('save')" :show-cell="false" :columns=3  :data="cityData" v-model="selectedData"></popup-picker>
	</div>
</template>

<script>
import "./SnProvAndCityList.less";
import { SelectProvinceWidget } from "../../../lib/common/SnJsBridge.js";
import { callHandler, cryptPost } from "../../../lib/common/base.js";
import {
  showToast,
  getStorage,
  setStorage
} from "../../../lib/common/extend.js";
import {
  Group,
  Cell,
  ToastPlugin,
  Popup,
  PopupPicker,
  TransferDom,
  Picker
} from "vux";

Vue.use(ToastPlugin);
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
  data: function() {
    return {
      showPopup: false,
      cityValue: "",
      cityName: "",
      proCityData: [],
      cityData: [],
      provinceValue: "",
      provinceName: "",
      selectedValue: "",
      selectedData: ["1", "1610"],
      lastSelectedValue: ["1", "1610"]
    };
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
      default: ""
    },
    isInDetailFlag: {
      //是否明细组件 默认为否
      type: Boolean,
      default: false
    },
    idx: {
      //明细组件的index
      type: Number
    },
    cityOldName: {
      type: String,
      default: ""
    }
  },
  created: function() {
    var _this = this;
    _this.getProCityList();
  },
  mounted: function() {
    //存在value,显示value  供存草稿使用
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
                  _this.cityName =
                    _this.proCityData[i].provName +
                    " " +
                    _this.proCityData[i].cityList[k].cityName;
                  var data = _this.proCityData[i];
                  var index = k;
                  setTimeout(function() {
                    _this.selectedData = [
                      data.provId + "",
                      data.cityList[index].cityId + ""
                    ];
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
      _this.cityData.forEach(item => {
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
      if (type == "save") {
        _this.lastSelectedValue = [..._this.selectedData];
        var data = _this.findCityData(
          _this.selectedData[0],
          _this.selectedData[1]
        );
        _this.cityName = data.provName + " " + data.cityName;
        _this.selectedValue = _this.cityName;
        _this.cityValue = data.cityId;
        var privAndcity = {
          provId: data.provId,
          provName: data.provName,
          cityId: data.cityId,
          cityName: data.cityName
        }
        _this.$emit('input', privAndcity);
        _this.setContentValue(_this.cityName); //设置发送给服务器的数据
        console.log(_this.$root.$refs[_this.relationFiledIds]);
        if (_this.relationFiledIds == "branch") {
          //分行下拉框的选择值清空
          if (_this.isInDetailFlag) {
            //明细
            //需要清空content中的值，不然会被控件重新赋值
            _this.$root.content.inDetail[_this.idx].branchDisplay = "";
            _this.$parent.$refs[_this.relationFiledIds][
              _this.idx
            ].selectedValue = "";
            _this.$parent.$refs[_this.relationFiledIds][_this.idx].$emit(
              "input",
              ""
            );
          } else {
            //非明细
            //需要清空content中的值，不然会被控件重新赋值
            _this.$root.content.branchDisplay = "";
            console.log(_this.$root.$refs[_this.relationFiledIds]);
            console.log(_this.$parent.$refs[_this.relationFiledIds]);
            if (_this.$root.$refs[_this.relationFiledIds]) {
              _this.$root.$refs[_this.relationFiledIds].selectedValue = "";
              _this.$root.$refs[_this.relationFiledIds].$emit("input", "");
            } else if (_this.$parent.$refs[_this.relationFiledIds]) {
              //后续操作中的控件值
              _this.$parent.$refs[_this.relationFiledIds][0].selectedValue = "";
              _this.$parent.nextOprData[_this.relationFiledIds] = "";
            }
          }
        }
      } else if (type == "close") {
        _this.selectedData = [..._this.lastSelectedValue];
      }
    },
    /*
			* 打开弹窗
			* */
    openCitySelect() {
      var _this = this;
      //解决城市选择弹框白屏的问题
      setTimeout(function() {
        _this.showPopup = true;
      }, 500);
    },
    /**
     * 获取省市数据
     */
    getProCityList: function() {
      var _this = this;
      var provList;
      return new Promise(function(res) {
        if ("" != getStorage("provList")) {
          //getStorage取本地存储的provList
          var provList = JSON.parse(getStorage("provList"));
          _this.showProCity(provList);
          _this.handleCityDate(provList);
          res(provList);
        } else {
          //取后台省市列表
          cryptPost("openAccount/getProCityList.do", {}).then(function(result) {
            provList = result.provList;
            setStorage("provList", JSON.stringify(provList)); //设置省市列表缓存
            _this.handleCityDate(provList);
            _this.showProCity(provList);
            _this.submit(); //初始化传值父组件
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
        provList.forEach(province => {
          var provinceObj = {
            name: province.provName,
            value: "" + province.provId,
            parent: 0
          };
          if (0 == province.provId) {
            provinceObj = {
              name: province.provName,
              value: "default"
            };
          }
          array.push(provinceObj);
          if (!!province.cityList && province.cityList.length > 0) {
            province.cityList.forEach(city => {
              var cityObj = {
                name: city.cityName,
                value: "" + city.cityId,
                parent: "" + province.provId
              };
              if (0 == province.provId) {
                cityObj = {
                  name: city.cityName,
                  value: "" + city.cityId,
                  parent: "default"
                };
              }
              array.push(cityObj);
            });
          }
        });
      }
      _this.cityData = array;
    },
    showProCity(proCityList) {
      var _this = this;
      _this.proCityData = proCityList; //proCityData需要用到的省市数据
    },
    /**
     * 设置父组件content中的值
     * @param {Object} cityDisplay
     */
    setContentValue: function(cityDisplay) {
      console.log("cityDisplay", cityDisplay);
      var _this = this;
      _this.$emit('cityDisplay', cityDisplay);
//    //如果在明细中，需要区分
//    if (_this.isInDetailFlag) {
//      //明细
//      _this.$root.content.inDetail[_this.idx]["cityDisplay"] =
//        cityDisplay || ""; //传递给服务器
//    } else {
//      _this.$root.content.cityDisplay = cityDisplay || ""; //给content中另存一个bankDisplay的值
//    }
    }
  },
  watch: {
    showPopup(newVal, oldVal) {
      if (newVal) {
        $("body").css("overflow", "hidden");
      } else {
        $("body").css("overflow", "auto");
      }
    },
    /**
     * 数据显示 主要针对删除使用
     * @param {Object} newVal
     * @param {Object} oldVal
     */
    value: function(newVal, oldVal) {
      var _this = this;
//    if (_this.value) {
//      _this.cityValue = _this.value;
//      if (_this.isInDetailFlag) {
//        //明细
//        _this.cityName =
//          _this.$root.content.inDetail[_this.idx].cityDisplay || ""; //值显示
//      } else {
//        _this.cityName = _this.$root.content.cityDisplay || ""; //值显示
//      }
//    }
    }
  }
};
</script>