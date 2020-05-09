<template>
    <div>
        <!-- <div>{{userInfo}} --- 用户信息</div>
        <div>{{prodId}} --- 产品信息</div>
        <div>{{iconInfo}} --- 头像信息</div> -->
        <div @click="goto" class="hehe">新开窗口 -- 跳转到list2</div>
        <br>
        <!-- <a href="#" @click="goto1" class="btn J_demo">回退多步</a> -->
    </div>
</template>
<script>
import { Cell, Group } from "vux";
import {
    registerHandler,
    GetUserInfoFunction,
    QueryUserIconFunction,
    ToastFunction,
    popWindowFunction,
    LocationObserverFunction,
    GetAppConfigFunction,
    AliReady
} from "lib/common/SnJsBridge.js";
import { openPage } from "lib/common/extend.js";

export default {
    data() {
        return {
            userInfo: "",
            prodId: "T信",
            iconInfo: ""
        };
    },
    created() {
        var _this = this;
        // ToastFunction("hehe");
        // popWindowFunction("http://www.baidu.com");
        GetUserInfoFunction().then(function(uaData) {
            _this.userInfo = uaData;
        });
        GetAppConfigFunction({ key: "tid" }).then(function(Data1) {
            _this.prodId = Data1.value;
        });
        // QueryUserIconFunction({ uaid: 52 }).then(function(iconData) {
        //     _this.iconInfo = iconData;
        // });
    },
    components: {
        Cell,
        Group
    },
    mounted() {},
    methods: {
        goto: function() {
            console.log(1111112121212);
            // AliReady(function() {
            //     AlipayJSBridge.call("pushWindow", {
            //         url: "https://m.taobao.com/"
            //     });
            // });
            // openPage("/pages/list1.html");
            // window.location.href = "list4.html";
            // window.open('H52Native.html');
            AlipayJSBridge.call("pushWindow", {
                url: "https://yqtdev.sinosun.com:18094/yqt/appstore/home/dist/pages/list2.html#/"
            });
        },
        goto1: function() {
            AlipayJSBridge.call(
                "popTo",
                {
                    index: -1, // 回退到上一个页面，假如这个时候没有上一个页面，就会报错
                    data: {
                        // 特别强调：data 是字典，不是数组
                        from: location.href,
                        info: Date.now()
                    }
                },
                function(e) {
                    // 添加回调，因为 popTo 不一定会成功（当前页面是唯一打开的页面的时候，会报错）
                    alert(JSON.stringify(e));
                }
            );
        }
    }
};
</script>
<style lang="less">
.weui-cells {
    font-size: 14px !important;
}
.hehe {
    color: #478aee;
    font-size: 20px;
}
</style>