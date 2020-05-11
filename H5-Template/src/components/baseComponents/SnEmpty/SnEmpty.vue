<template>
    <section class="empty-comp" v-show="isShow">
        <div class="panel">
            <i :class="icon">&nbsp;</i>
            <div class="emptyTips" v-if="tip">{{tip}}</div>
            <div class="emptyTips" v-else>{{tipDefatul[icon][0]}}</div>
            <div class="emptyTipsLine2">{{(tipDefatul[icon] && tipDefatul[icon].length > 1)?tipDefatul[icon][1]:''}}</div>
            <div class="emptyBtn" @click="clickHandler" v-if="showBtn">{{btnTips}}</div>
        </div>
    </section>
</template>
<script>
import "./SnEmpty.less";
export default {
    data: function () {
        return {
            tipDefatul: {
                "no-content": ["暂无内容"],
                "no-search": ["暂无查询记录"],
                "no-contract": ["该业务暂不可使用", "需前往银行网点完成签约才能使用"],
                "no-app": ["工作圈下此应用暂不可用", "您可以通过创建企业来体验此应用"],
                "no-sign": ["该业务暂未开通", "请前往我行网点签约办理"],
                "no-auth": ["暂无权限"]
            }
        };
    },
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        icon: {
            type: String,
            default: ""
        },
        tip: {
            type: String,
            default: ""
        },
        showBtn: {
            type: Boolean,
            default: false
        },
        btnTips: {
            type: String,
            default: "去创建"
        }
    },
    methods: {
        clickHandler() {
            this.$emit("clickHandler")
        }
    }
};
</script>