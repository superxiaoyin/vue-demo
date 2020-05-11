<template>
	<div>
		<div v-show='hmtlshowFlag'>
	  		<mu-circular-progress :size="40" v-if="loading"/>
	    	<div v-html='previewInHtml'></div>
	  	</div>
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
        },
	    displayFlag: {
	      type: Boolean
	    },
	    fixBusiness:{
	    	type:String,
	    },
	    hmtlshowFlag:{
	    	type: Boolean,
	    	default:false
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
    	if (this.displayFlag || this.fixBusiness==1) {
    		this.hmtlshowFlag = true;
    	} else if (this.previewInHtml != '' && this.previewInHtml != '<div style="color: #478aee; font-size: 24px; text-align: center;">你要审批的内容去火星了……</div>') {
    		this.hmtlshowFlag = true;
    	}
    	this.$emit('input',this.src);
    },
    methods: {
    	
    },
    watch:{
    	previewInHtml: function (newVal, oldVal) {
/*    		if (newVal) {
    			this.hmtlshowFlag = true;
    		}*/
    	}
    }
}
</script>