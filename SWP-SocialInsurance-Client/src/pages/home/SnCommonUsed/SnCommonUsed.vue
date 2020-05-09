<template>
    <div class="sn-common-used" :class="className">
        <div class="sn-label">{{commoUsedLabel}}</div>
        <ul class="common-used-list"> 
            <li class="common-used-item" v-for="(item,index) in commonUsedList">
                {{item.name}}
            </li>
        </ul>
    </div>
</template>
<script>
import './SnCommonUsed.less';
export default{
    props: {
        commonUsedList: {
            type: Array,
            default: []
        },
        commoUsedLabel:{
            type: String,
            default: ''
        },
        className:{
            type: String,
            default: ''
        }
    }
}
</script>