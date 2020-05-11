<template>
    <section class="sn-label">
        <div class="label-info">
            <span class="label-title">{{title}}</span>
        </div>
        <div class="label-con">
            <slot></slot>
        </div>
    </section>
</template>
<script>
import './SnLabel.less';
export default {
    props:{
        title: {
            type: String,
            default: '',
        },
    }
}
</script>