<template>
    <div class="listInfoSmall" v-if="type == 'small'">
        <div class="listLeft">
            <slot name="lefticon"></slot>
        </div>
        <div class="listCenter">
            <div class="title">{{title}}</div>
        </div>
        <div class="listRight" :class="{ rightLink: isLink}">
            <div class="mark">{{mark}}</div>
        </div>
    </div>
    <div class="listInfoMiddle" v-else-if="type == 'middle'">
        <div class="listLeft">
            <slot name="lefticon"></slot>
        </div>
        <div class="listCenter">
            <div class="title">{{title}}</div>
        </div>
        <div class="listRight" :class="{ rightLink: isLink}">
            <div class="mark">{{mark}}</div>
        </div>
    </div>
    <div class="listInfoBig" v-else-if="type == 'big'">
        <div class="listLeft">
            <slot name="lefticon"></slot>
        </div>
        <div class="listCenter">
            <div class="title">{{title}}</div>
            <div class="dec">{{dec}}</div>
        </div>
        <div class="listRight" :class="{ rightLink: isLink}">
            <div class="mark">{{mark}}</div>
        </div>
    </div>
    <div class="listInfoChoose" v-else-if="type == 'choose'">
        <div class="listLeft">
            <div class="title">{{title}}</div>
        </div>
        <div class="listRight">
            <div class="mark">{{mark}}</div>
            <slot name="righticon"></slot>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        type: {
            type: String,
            default: ""
        },
        title: {
            type: String,
            default: ""
        },
        dec: {
            type: String,
            default: ""
        },
        mark: {
            type: String,
            default: ""
        },
        isLink: {
            type: Boolean,
            default: false
        }
    }
};
</script>
<style lang="less" scoped>
@import "../../style/common.less";
.listInfoSmall,
.listInfoMiddle,
.listInfoBig {
    position: relative;
    background: #fff;
    .flex-box();
    .align-items();
    height: 0.92rem;
    padding: 0 0.3rem;
    font-size: 0.32rem;
    &:active {
        background-color: #ececec;
    }
    .listLeft {
        width: 0.58rem;
        height: 0.58rem;
        margin-right: 0.3rem;
        img {
            height: 0.58rem;
        }
    }
    .listCenter {
        line-height: 1;
        flex: 1;
        overflow: hidden;
        .title {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .listRight {
        width: 2rem;
        text-align: right;
        color: #c2c2c2;
        font-size: 0.28rem;
    }
    .rightLink {
        .mark {
            margin-right: 0.34rem;
        }
        position: relative;
        &::after {
            content: " ";
            display: inline-block;
            border-color: #c2c2c2;
            height: 0.16rem;
            width: 0.16rem;
            border-width: 2px 2px 0 0;
            border-style: solid;
            transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
            position: absolute;
            top: 50%;
            margin-top: -4px;
            right: 2px;
        }
    }
    &:after {
        content: " ";
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: 1px;
        border-bottom: 1px solid #e5e5e5;
        color: #e5e5e5;
        transform-origin: 0 100%;
        transform: scaleY(0.5);
        left: 1.18rem;
    }
}
.listInfoMiddle {
    height: 1.1rem;
    .listLeft {
        width: 0.72rem;
        height: 0.72rem;
        img {
            height: 0.72rem;
        }
    }
    &:after {
        left: 1.32rem;
    }
}
.listInfoBig {
    height: 1.34rem;
    .listLeft {
        width: 0.92rem;
        height: 0.92rem;
        margin-right: 0.2rem;
        img {
            height: 0.92rem;
        }
    }
    .listCenter {
        .title {
            margin-bottom: 0.15rem;
        }
        .dec {
            color: #999;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 0.28rem;
        }
    }
    &:after {
        left: 1.42rem;
    }
}
.listInfoChoose {
    position: relative;
    background: #fff;
    .flex-box();
    .align-items();
    .justify-content(space-between);
    height: 1.1rem;
    padding: 0 0.3rem;
    font-size: 0.32rem;
    &:active {
        background-color: #ececec;
    }
    .listRight {
        .flex-box();
        .mark {
            margin-right: 0.3rem;
            color: #c2c2c2;
        }
        img {
            width: 0.38rem;
            height: 0.29rem;
        }
    }
    &:after {
        content: " ";
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: 1px;
        border-bottom: 1px solid #e5e5e5;
        color: #e5e5e5;
        transform-origin: 0 100%;
        transform: scaleY(0.5);
        left: 0.3rem;
    }
}
@media screen and (min-width: 550px) {
    .listInfoSmall,
    .listInfoMiddle,
    .listInfoBig,
    .listInfoChoose {
        font-size: 14px;
    }
}
</style>
