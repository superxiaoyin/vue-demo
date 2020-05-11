<template>
    <div class="radioBox">
        <div class="label" v-if="title">{{title}}</div>
        <!--title-->
        <div class="radioRight" v-if="!!radioList.length">
            <span
                v-for="(btn,index) in radioList"
                :key="index"
                v-bind:class="btn.cls"
                @click="radioClick(btn)"
            >
                <span class="leftIcoBox" v-bind:class="{'radioCheck':btn.id==value}">
                    <span class="leftIco"></span>
                </span>
                <span class="radioText" v-text="btn.text"></span>
            </span>
        </div>
    </div>
</template>
<style lang="less" src="./SnRadio.less"></style>
<script>
export default {
    props: {
        title: {
            type: String,
            default: ""
        },
        radioList: {
            type: Array,
            default: []
        },
        value: {
            type: Number
        }
    },
    data: function() {
        return {};
    },
    created: function() {},
    mounted: function() {},
    methods: {
        radioClick(btn) {
            this.$emit("input", btn.id);
        }
    }
};
</script>