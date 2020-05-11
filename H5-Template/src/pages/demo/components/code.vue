<template>
    <div>
        <div class="oneCode">
            <header>#组件名称：SnLoading</header>
            <article>引用方式：import SnLoading from 'vue文件的路径'</article>
            <article>使用实例：{{codetext[0]}}</article>
            <article>属性说明：message：提示的文字，默认数据加载中</article>
        </div>

        <div class="oneCode">
            <header>#组件名称：SnEmpty</header>
            <article>引用方式：import 组件名称：SnEmpty from 'vue文件的路径'</article>
            <article>使用实例：{{codetext[1]}}</article>
            <article>属性说明：isShow：显示数据加载中，icon：图标，tip：说明文字，showBtn：是否显示按钮，btnTips：按钮文字</article>
        </div>

        <div class="oneCode">
            <header>#组件名称：SnSearch</header>
            <article>引用方式：import 组件名称：SnSearch from 'vue文件的路径'</article>
            <article>使用实例：{{codetext[2]}}</article>
            <article>属性说明：@searchInfo：需要绑定的事件，传值给父组件</article>
        </div>

        <div class="oneCode">
            <header>#组件名称：SnBigMoney</header>
            <article>引用方式：import 组件名称：SnBigMoney from 'vue文件的路径'</article>
            <article>使用实例：{{codetext[3]}}</article>
            <article>属性说明：value：需要处理的值，title：名称</article>
        </div>

        <div class="oneCode">
            <header>#组件名称：SnButton</header>
            <article>引用方式：import 组件名称：SnButton from 'vue文件的路径'</article>
            <article>使用实例：{{codetext[4]}}</article>
            <article>属性说明：showLoading：是否出现小菊花，type：按钮的类型，是一个，还是两个，还是底部，color：特殊按钮颜色，@SnButtonClick@SnButtonClickBottom@SnButtonClickLeft@SnButtonClickRight：传递给父组件</article>
        </div>

        <div class="oneCode">
            <header>#组件名称：SnEmail</header>
            <article>引用方式：import 组件名称：SnEmail from 'vue文件的路径'</article>
            <article>使用实例：{{codetext[5]}}</article>
            <article>属性说明：SnInput的基础上对邮件进行的过滤</article>
        </div>

        <div class="oneCode">
            <header>#组件名称：SnInput</header>
            <article>引用方式：import 组件名称：SnInput from 'vue文件的路径'</article>
            <article>使用实例：{{codetext[6]}}</article>
            <article>属性说明：x-input的封装，title，value，type，maxlength，placeholder，disabled，readonly，@focusInput，@blurInput，@changeInput等属性</article>
        </div>

        <div class="oneCode">
            <header>#组件名称：SnLetter</header>
            <article>引用方式：import 组件名称：SnLetter from 'vue文件的路径'</article>
            <article>使用实例：{{codetext[7]}}</article>
            <article>属性说明：SnInput的基础上只能输入数字</article>
        </div>

        <div class="oneCode">
            <header>#组件名称：SnXTextarea</header>
            <article>引用方式：import 组件名称：SnXTextarea from 'vue文件的路径'</article>
            <article>使用实例：{{codetext[8]}}</article>
            <article>属性说明：x-textarea的封装，value，title，maxlength，placeholder，rows，height，autosize，@changeXTextarea等属性</article>
        </div>

        <div class="oneCode">
            <header>#组件名称：SnList</header>
            <article>引用方式：import 组件名称：SnList from 'vue文件的路径'</article>
            <article>使用实例：{{codetext[9]}}</article>
            <article>属性说明：type：类型，title：标题，dec：描述，mark：记录，isLink：是否箭头</article>
        </div>

        <div class="oneCode">
            <header>#组件名称：SnNumber</header>
            <article>引用方式：import 组件名称：SnNumber from 'vue文件的路径'</article>
            <article>使用实例：{{codetext[10]}}</article>
            <article>属性说明：title：标题，value：值，unit：单位，pointlength：小数点</article>
        </div>

        <div class="oneCode">
            <header>#组件名称：SnToast</header>
            <article>引用方式：import 组件名称：SnToast from 'vue文件的路径'</article>
            <article>使用实例：{{codetext[11]}}</article>
            <article>属性说明：show：是否展示，content：提示内容</article>
        </div>

        <div class="oneCode">
            <header>#组件名称：SnRadio</header>
            <article>引用方式：import 组件名称：SnRadio from 'vue文件的路径'</article>
            <article>使用实例：{{codetext[12]}}</article>
            <article>属性说明：title：标题，radioList：列表，value：选中的值，isBigRadio：是否大图标</article>
        </div>

    </div>
</template>

<script>
export default {
    data() {
        return {
            codetext: [
                '<SnLoading message="自定义语句……"></SnLoading>',
                '<SnEmpty :isShow="!isShow" icon="no-app" :showBtn=true btnTips="自定义文字"></SnEmpty>',
                '<SnSearch @searchInfo="search"></SnSearch>',
                '<SnBigMoney :title="title" :value="value"></SnBigMoney>',
                '<SnButton  @SnButtonClickLeft="SnButtonClickLeft" @SnButtonClickRight="SnButtonClickRight" type="two" color="#f83939"><span slot="left" >取消</span><span slot="right" >确定</span></SnButton>',
                '<SnEmail :title="title" :value="value"></SnEmail>',
                '<SnInput title="SnInput" type="text" placeholder="SnInput" maxlength=13 v-model="SnInputValue" @focus="SnInputFocus"></SnInput>',
                '<SnLetter :title="title" :value="value"></SnLetter>',
                '<SnXTextarea title="SnXTextarea" placeholder="SnXTextarea"  v-model="SnTextareaValue"></SnXTextarea>',
                '<SnList type="big" title="我的用户信息我的用户信息我的用户信息我的用户信息" dec="我的描述" mark="2019-01-02" is-link>图片卡槽</SnList>',
                '<SnNumber :title="title" :value="value" :pointlength="2" :unit="元"></SnNumber>',
                '<SnToast :show=true :content="提示"></SnToast>',
                '<SnRadio title="SnRadio" :radioList="radioList1" v-model="SnRadioValue"></SnRadio>',
            ]
        };
    },
    computed: {},
    beforeCreate: function() {},
    created() {},
    mounted() {},
    methods: {}
};
</script>
<style lang="less">
@import "~style/common.less";
.oneCode {
    background-color: #fff;
    padding: 0.4rem 0.3rem;
    header {
        margin-bottom: 0.3rem;
        font-size: 0.36rem;
        color: #478aee;
    }
    article {
        margin-bottom: 0.3rem;
    }
    footer {
        margin-bottom: 0.3rem;
    }
    &:first-child{
        padding-top: 50px;
    }
    &:last-child{
        padding-bottom: 50px;
    }
}
@media screen and (min-width: @pc-width) {
    .oneCode {
        font-size: 14px;
    }
}
</style>