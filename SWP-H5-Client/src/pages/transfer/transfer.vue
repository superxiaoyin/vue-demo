<template>
    <div>
        <group>
            <!--付方账号-->
            <!-- <popup-radio title="付方账号" :options="options1" v-model="text1" placeholder="请选择付方账号（必填）"></popup-radio> -->
            <!--选择汇款类型-->
            <!-- <SnRadio title='汇款类型' fieldKey='payType' :radioList='radioList1' :defaultIndex='1'></SnRadio> -->
            <!-- <SnRadio title='到账时间' fieldKey='transMethod' :radioList='radioList2' :defaultIndex='2'></SnRadio> -->
            <!--收款账号-->
            <!-- <SnNumber title='收款账号' v-model='text2' placeholder="请输入收款账号（必填）" maxlength='32'></SnNumber> -->
            <!-- <SnPadInput title='收款户名' v-model='text3' placeholder="请输入收款户名（必填）" maxlength='30'></SnPadInput> -->
            <!--汇款金额-->
            <!-- <SnMoney title="汇款金额" ref="amount" v-model='text4' placeholder="0.00" fieldKey='amount'></SnMoney> -->
            <!-- <cell title='金额大写' value-align='left'>{{text4}}</cell> -->
            <!--备注-->
            <!-- <SnText title="备注" maxlength="200" ref='mark' placeholder="请输入备注（选填）" v-model='text5'></SnText> -->
            <!-- 从头开始  每个组件运行一次  写属性和方法 -->
            <SnLoading message="SnLoading"></SnLoading>
            <SnInput title="SnInput" type='text' placeholder="SnInput" maxlength=13 v-model='SnInputValue' @focus='SnInputFocus'></SnInput>
            <SnTextarea title="SnTextarea" placeholder="SnTextarea" rows='3' maxlength=133 v-model='SnTextareaValue' @focus='SnTextareaFocus'></SnTextarea>
            <SnXTextarea title="SnXTextarea" placeholder="SnXTextarea" :maxlength='125' v-model='SnXTextareaValue'></SnXTextarea>
            <SnEmail title="SnEmail" placeholder="SnEmail" v-model='SnEmailValue'></SnEmail>
            <SnLetter title="SnLetter" placeholder="SnLetter" v-model='SnLetterValue'></SnLetter>
            <SnButton :showLoading=true @SnButtonClick="SnButtonClick">转账</SnButton>
            <SnEmpty :isShow=false icon="no-content"></SnEmpty>
            <SnRadio title='SnRadio' :radioList='radioList1' v-model='SnRadioValue'></SnRadio>
            <SnNumber title="SnNumber" placeholder="SnNumber" :maxlength='13' v-model="SnNumberValue" :pointlength='2' unit="元"></SnNumber>
            <SnNumber title="SnNumber" placeholder="SnNumber" :maxlength='13' v-model="SnNumberValue"></SnNumber>
            <SnBigMoney title="SnBigMoney" v-model="SnNumberValue"></SnBigMoney>
            <SnButton @SnButtonClick="SnButtonClick">显示SnPanel</SnButton>
            <SnPanel :show='SnPanelValue' @SnPanelClick="SnPanelClickBack">
                <SnLoading message="SnLoading"></SnLoading>
            </SnPanel>
            <SnToast :show=true content='SnToastValue'></SnToast>
            <!-- <el-input v-model="SnInputValue" placeholder="请输入内容"></el-input>
            <el-switch v-model="SnRadioValue" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
            <i class="el-icon-edit"></i>
            <i class="el-icon-share"></i>
            <i class="el-icon-delete"></i>
            <el-button type="primary" icon="el-icon-search">搜索</el-button> -->
            <!-- vux组件 -->
            <!-- <SnActionsheet v-model="showActionsheet" :menus="menus2" @on-click-menu="SnInputFocus" show-cancel></SnActionsheet> -->
        </group>
    </div>
</template>
<script>
import { Group } from 'vux';
// 从头开始  每个组件运行一次  写属性和方法
// import SnLoading from 'components/SnLoading/SnLoading';
// import SnInput from 'components/SnInput/SnInput';
// import SnTextarea from 'components/SnTextarea/SnTextarea';
// import SnXTextarea from 'components/SnXTextarea/SnXTextarea';
// import SnEmail from 'components/SnEmail/SnEmail';
// import SnButton from 'components/SnButton/SnButton';
// import SnLetter from 'components/SnLetter/SnLetter';
// import SnEmpty from 'components/SnEmpty/SnEmpty';
// import SnRadio from 'components/SnRadio/SnRadio';
// import SnNumber from 'components/SnNumber/SnNumber';
// import SnBigMoney from 'components/SnBigMoney/SnBigMoney';
// import SnPanel from 'components/SnPanel/SnPanel';
// import SnToast from 'components/SnToast/SnToast';

import { SnLoading, SnInput, SnTextarea, SnXTextarea, SnEmail, SnButton, SnLetter, SnEmpty, SnRadio, SnNumber, SnBigMoney, SnPanel, SnToast } from 'components/index.js';

// vux组件
// import SnActionsheet from 'components/SnActionsheet'

export default {

    data() {
        return {
            // option: '',
            // options1: ['123', '456', '789'], //付方账号
            radioList1: [{ "id": "1", "text": "行内", "cls": "radio" }, { "id": "2", "text": "跨行", "cls": "radio" }],
            // radioList2: [{ "id": "2", "text": "实时", "cls": "radio" }, { "id": "1", "text": "普通", "cls": "radio" }, { "id": "3", "text": "次日", "cls": "radio" }],
            // text1: '',
            // text2: '',
            // text3: '',
            // text4: '',
            // text5: '',

            // 从头开始  每个组件运行一次  写属性和方法
            SnInputValue: 'SnInput',
            SnTextareaValue: 'SnTextareaValue',
            SnXTextareaValue: 'SnXTextareaValue',
            SnEmailValue: 'SnEmailValue',
            SnLetterValue: 'SnLetterValue',
            SnNumberValue: '123',
            SnRadioValue: '2',
            SnPanelValue: false,

            // vux组件
            // showActionsheet: false,
            // menus2: {
            //     menu1: '北京烤鸭',
            //     menu2: '陕西油泼面'
            // }
        }
    },
    components: {
        // LoadMore,
        // Tab,
        // TabItem,
        // Search,
        // Radio,
        // Group,
        // Cell,
        // XButton,
        // Alert,
        // AlertPlugin,
        // PopupRadio,

        // SnRadio,
        // SnNumber,
        // SnPadInput,
        // SnMoney,
        // SnText


        Group,
        // 从头开始  每个组件运行一次  写属性和方法
        SnLoading,
        SnInput,
        SnTextarea,
        SnXTextarea,
        SnEmail,
        SnButton,
        SnLetter,
        SnEmpty,
        SnRadio,
        SnNumber,
        SnBigMoney,
        SnPanel,
        SnToast,

        // vux组件
        // SnActionsheet
    },
    mounted() {

    },

    methods: {
        SnInputFocus(val) {
            console.log(val)
        },
        SnTextareaFocus(val) {
            console.log(val)
        },
        SnButtonClick() {
            console.log('SnButtonClick')
            this.SnPanelValue = true;
        },
        SnPanelClickBack(val) {
            this.SnPanelValue = false;
        }
    },
    watch: {
        SnInputValue: function(val) {
            console.log(val)
        },
        SnTextareaValue: function(val) {
            console.log(val)
        },
        SnXTextareaValue: function(val) {
            console.log(val)
        },
        SnEmailValue: function(val) {
            console.log(val)
        },
        SnLetterValue: function(val) {
            console.log(val)
        }
    }
}
</script>
<style lang="less">
@import '~style/common.less';

.weui-cells {
    margin-top: 0 !important;

    .vux-label {
        min-width: 100px;
        margin-right: 20px;
    }
}
</style>