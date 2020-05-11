<template>
    <div class="disabled-app-comp">
        <div class="disabled-tip">
            <Empty icon="no-app" isShow="true"></Empty>
            <button @click="creatCompany">去创建</button>
        </div>
    </div>
</template>
<script>
import Empty from '../Empty/Empty.vue';
import { openPage, getUrlConfig } from 'ssextend';
export default {
    components: {
        Empty
    },
    methods: {

        creatCompany: function () {
            //获取跳转url
            getUrlConfig().then(function (urlconfig) {
                if (!!urlconfig) {
                    openPage(urlconfig["companyurl"]);
                }
            }, function () {
                console.log("get url config failed")
            });
        }
    }
}
</script>
<style lang="less">
@import "../../style/common.less";
.disabled-app-comp {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    max-width: @max-content-width;
    margin: 0 auto;
    .disabled-tip {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        position: absolute;
        top: 50%;
        left: 0px;
        transform: translateY(-75%);
        width: 100%;
        button {
            bottom: 2rem;
            width: 4.8rem;
            height: 0.84rem;
            color: @color-white;
            background: @color-blue;
            border-radius: 0.08rem;
            font-size: 0.34rem;
            line-height: 0.84rem;
            margin: 0.6rem auto 0 auto;
        }
    }
    .empty-comp {
        position: static;
        .panel {
            transform: none;
            .emptyTipsLine2 {
                color: #333;
            }
        }
    }
}
</style>


