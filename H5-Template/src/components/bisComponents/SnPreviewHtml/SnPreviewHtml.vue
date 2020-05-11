<template>
	<div>
  	<mu-circular-progress :size="40" v-if="loading"/>
    <div v-html='previewInHtml'></div>
  </div>
</template>
<style>
</style>
<script>
  export default{
		    props: {
		      src: {
		        type:String,
		        default:'',
		      },
		      previewInHtml:{
		      	type:String,
		      	default:'<div style="color: #478aee; font-size: 24px; text-align: center;">你要审批的内容去火星了……</div>'
		      }
		    },
		    data () {
		      return {
		        loading: false,
		        src:'',
		      }
		    },
		    created:function () {
						this.src.replace(/\u0000/g,'');
		    },
		    mounted () {
		    	this.$emit('input',this.src);
		    },
		    methods: {
		    	
		    }
    }
</script>