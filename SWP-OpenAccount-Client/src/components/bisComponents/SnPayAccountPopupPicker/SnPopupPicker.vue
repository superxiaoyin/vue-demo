<template>
        <!--付方账号-->
        <SnPopupPicker  :initData="initData"
                         v-model="payAccount"
                         value-text-align="left"
                        :selectFlag="selectFlag"
                        :dataList="dataList"
                        columns="1"></SnPopupPicker>
</template>

<script>
import './SnPopupPicker.less';
import SnPopupPicker from '../SnCommonPopupPicker/SnPopupPicker.vue';
export default {
    components: {
    },
      props: {
        titleIndex: {//titleIndex
            type: Number,
        },
        dataList: {//list数据
            type: Array,
            default() {
                return []
            }
        },
        value: {
            type: Number
        },
        columns: {
            type: Number,
            default: 1
        },
        selectFlag: {
            type: Object,
            default: { 'show': false }
        },
        initData:{
            type: Object,
            default: {
                title:'请选择',
                placeholder:"请选择(必填)" ,
                noTips:'数据为空',
                subTitle:['选择'],
            }
        },
        flag: {
            type: Boolean,
            default: true
        },
        selectType: {//下来框的类型，根据类型获取不同的下拉框值
            type: String,
            default: ""
        },
        isLoading: {
            type: Boolean,
            default: false
        }
    },
    data: function () {
        return {
            selectedValue: '',
            popupShowFlag: false,
            delayShow: 0,//等待键盘收起再弹出下拉框
            nonDisplayValue: '',
        }
    },
    beforeCreate: function () {
        var _this = this;
    },
    created: function () {
        var _this = this;
    },
    mounted: function () {//存在value,显示value  供存草稿使用
        var _this = this;
    },
    methods: {
        
    },
    
}
</script>
