<template>
    <section class="empty-comp" v-show="isShow">
        <div class="panel">
            <i :class="icon">&nbsp;</i>
            <div class="emptyTips">{{tip[icon][0]}}</div>
            <div class="emptyTipsLine2">{{(tip[icon] && tip[icon].length > 1)?tip[icon][1]:''}}</div>
        </div>
    </section>
</template>
<script>
import "./empty.less";
export default {
    data: function() {
        return {
            tip: {
                "no-content": ["暂无内容"],
                "no-search": ["暂无查询记录"],
                // "no-contract": ["该业务暂不可使用","需前往银行网点完成签约才能使用"],//"该业务暂不可使用，<br/>需前往银行网点完成签约才能使用"
                "no-app": ["工作圈下此应用暂不可用", "您可以通过创建企业来体验此应用"],
                "no-sign": ["该业务暂未开通","请前往我行网点签约办理"],
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
        }
    }
};
</script>
