<template>
    <div>
        <div @click="back" class="haha">回退到list</div>
        <br>
        <br>
        <br>
        <a class="btn J_demo">执行</a>
        <br>
        <br>
        <div @click="goto" class="hehe">跳转到list2</div>
    </div>
</template>
<script>
import { Cell, Group, Divider } from "vux";
import {
    registerHandler,
    GetUserInfoFunction,
    ToastFunction,
    popWindowFunction,
    LocationObserverFunction,
    GetAppConfigFunction,
    AliReady,
    goBackFunction_new
} from "lib/common/SnJsBridge.js";
import { openPage } from "lib/common/extend.js";

function ready(callback) {
    // 如果 jsbridge 已经注入则直接调用
    if (window.AlipayJSBridge) {
        callback && callback();
    } else {
        // 如果没有注入则监听注入的事件
        document.addEventListener("AlipayJSBridgeReady", callback, false);
    }
}
ready(function() {
    document.querySelector("a").addEventListener("click", function() {
        // 打开淘宝首页，自动读取 title，并且去除右边菜单
        AlipayJSBridge.call("pushWindow", {
            url: "https://m.taobao.com/",
            param: {
                readTitle: true,
                showOptionMenu: false
            }
        });
    });
});

export default {
    data() {
        return {};
    },
    created() {},
    components: {
        Cell,
        Group,
        Divider
    },
    mounted() {},

    methods: {
        goto: function() {
            openPage("/pages/list2.html");
        },
        back: function() {
            goBackFunction_new();
        }
    }
};
</script>
<style lang="less">
.weui-cells {
    font-size: 14px !important;
}
.haha {
    color: #ccc;
    font-size: 20px;
}
.hehe {
    color: #478aee;
    font-size: 20px;
}
</style>