<template>
    <div class="sn-self-add">
        <div v-for="n in listLength" :key="n" :data-index="n" class="sn-self-add-vertical">
            <slot></slot>
            <div
                v-if="n == listLength && listLength != limitLength"
                class="sn-self-add-icon"
                @click="addHandler"
            >
                <i class="sn-self-add-icon-add"/>
            </div>
            <div v-if="n < listLength" class="sn-self-add-icon" @click="delHandler">
                <i class="sn-self-add-icon-del"/>
            </div>
        </div>
    </div>
</template>



<script>
import { showToast } from '../../../lib/common/extend.js';
export default {
    components: {},

    data() {
        return {
            listLength: 1
        };
    },
    props: {
        limitLength: {
            type: Number,
            default: 0,
        },
    },
    mounted() { },

    methods: {
        addHandler: function () {
            if (!this.limitLength) {
                this.listLength++;
            } else if (this.listLength < this.limitLength) {
                this.listLength++;
            }
        },
        delHandler: function () {
            this.listLength--;
        }
    }
}

</script>
<style lang="less">
@import "./index.less";
</style>
