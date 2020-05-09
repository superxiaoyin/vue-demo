<template>
    <div style="background: #fff">
        <SnRadio title="支付方式" :radioList="radioList" v-model="SnRadioValue"></SnRadio>
        <SnRadio title="支付方式" :radioList="radioList" v-model="SnRadioValue"></SnRadio>
        <SnCheck title="支付方式" :radioList="radioList1" v-model="SnValue"></SnCheck>
        <div style="margin-top:20px;"></div>
        <!-- <cell title="支付方式" value="请选择支付方式" is-link value-align="left" :border-intent="false"></cell> -->
        <cell title="支付方式" value="请选择支付方式" is-link @click.native="show8 = true"></cell>

        <cell title="支付方式" is-link :arrow-direction="showContent001 ? 'up' : 'down'" @click.native="showContent001 = !showContent001" value="请选择支付方式" ></cell>

        <div v-if="showContent001">
            <cell-box class="sub-item" is-link>行内</cell-box>
            <cell-box class="sub-item" is-link>跨行</cell-box>
        </div>

        <div v-transfer-dom>
            <popup v-model="show8" width="100%" height="100%" position="left" style="background-color:#fff" >
                <group>
                    <cell v-for="i in 10" :key="i" :title="i" @click.native="show8 = false"></cell>
                </group>
            </popup>
        </div>
    </div>
</template>

<script>
import { SnRadio,SnCheck } from "components/index.js";
import { Cell, CellBox, Group, Popup, TransferDom } from "vux";
export default {
    directives: {
        TransferDom
    },
    components: {
        SnRadio,
        SnCheck,
        Group,
        Cell,
        CellBox,
        Popup
    },
    data() {
        return {
            radioList: [
                { id: 1, text: "行内", cls: "radio" },
                { id: 2, text: "跨行", cls: "radio" }
            ],
            radioList1: [
                { id: 1, text: "行内", cls: "checkbox", check:false },
                { id: 2, text: "跨行", cls: "checkbox", check:false }
            ],
            SnRadioValue: 2,
            SnValue:[],
            showContent001: false,
            show8: false
        };
    },
    beforeCreate: function() {},
    created() {
        let _this = this;
    },
    mounted() {},
    methods: {},
    watch: {
        SnValue(newName, oldName) {
            console.log(newName, oldName)
        }
    } 
};
</script>