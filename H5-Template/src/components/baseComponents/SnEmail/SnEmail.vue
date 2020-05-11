<template>
	<div class="Snemail">
		<cell :title='title' value-align='left'>
	    	<input ref="input" 
                type="email"
	    		:value = "value"
		    	:placeholder="placeholder" 
                :readonly="readonly"
		    	:disabled="disabled"
                :maxlength="maxlength"
		    	@input="inputFrtValue($event.target.value)" />
	    </cell>
	</div>
</template>
<script>
	import './SnEmail.less';
	import {Cell} from 'vux';
    export default {
    	components:{
            Cell,
    	},
        props: {
            title:{
            	type:String,
            	default:''
            },
            value:{
            	type:String
            },
            placeholder:{
            	type:String
            },
            maxlength:{
            	type:Number,
            	default:32
            },
            readonly:{
            	type:Boolean,
            	default:false
            },
            disabled:{
                type:Boolean,
                default:false
            },
        },
        data:function(){
        	return {}
        },
        created:function () {},
        mounted:function(){},
        methods: {
			inputFrtValue:function(value){
                console.log(value)
                var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                if (filter.test(value)) {
                    this.$emit('input',value);
                    return true; 
                } else {
                    return false;
                } 
			},
        },
    }
</script>