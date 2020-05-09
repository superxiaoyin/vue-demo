<template>
    <div>
        <tab
            bar-active-color="#478aee"
            active-color="#478aee"
            :line-width="2"
            custom-bar-width="70px"
        >
            <tab-item selected @on-item-click="onItemClick">应用中心</tab-item>
            <tab-item @on-item-click="onItemClick">模版中心</tab-item>
            <tab-item @on-item-click="onItemClick">开通列表</tab-item>
        </tab>
        <SnSearch @searchInfo="search" btnText="确定" v-model="seachText"></SnSearch>
        <SnSearch
            @searchInfo="search"
            type="line"
            v-model="seachText"
            isEmpty
            :maxlength="10"
            placeholder="请输入搜索内容"
        ></SnSearch>
        <toast v-model="show" text="请输入搜索内容" type="text"></toast>
    </div>
</template>

<script>
import { Tab, TabItem, Toast } from "vux";
import { SnSearch } from "components/index.js";
export default {
    components: {
        Tab,
        TabItem,
        Toast,
        SnSearch
    },
    data() {
        return {
            seachText: "",
            show: false
        };
    },
    beforeCreate: function() {},
    created() {
        let _this = this;
    },
    mounted() {},
    methods: {
        onItemClick(index) {
            console.log("on item click:", index);
        },
        search(text) {
            if (!text) {
                this.show = true;
            }
            console.log(text);
        }
    }
};
</script>