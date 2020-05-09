<template>
    <div>
        <Contact label="报销人" :multi=false></Contact>
        <Contact label="提交给" tip="处理人( 不选择结束流程 )" :multi=false></Contact>
        <Contact label="知会给" tip="知会人( 可多选 )" :multi=true></Contact>
    </div>
</template>
<script>
import '../../newStyle/sn-common.less';
import Contact from "./SnContact/SnContact.vue";
import Loading from "../../comp/Loading/Loading.vue";
import Button from "../../comp/Button/Button.vue";
import Empty from "../../comp/Empty/Empty.vue";
export default{
    components: {
        Contact,
        Loading,
        Empty,
        Button
    },
    data: function(){
        return {
        }
    },
    beforeCreate: function(){
    }
}
</script>