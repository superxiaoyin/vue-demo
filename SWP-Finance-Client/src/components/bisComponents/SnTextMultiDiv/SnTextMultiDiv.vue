<template>
	<div class="snTextMultiDiv">
		<p :style="{color:colortype,textAlign:textAlign, textIndent:textIndent}" 
			:class="{fontBig:isTitle == '1'}">{{fieldDispValue}}</p>
	</div>
</template>
<style lang="less" src="./SnTextMultiDiv.less"></style>
<script>
    export default {
        props: {
            fieldDispValue:{
            	type:String
            },
            colortype:{
            	type:String,
            	default:'#191919'
            },
            isTitle:{
            	type:String,
            	default:''
            },
            textAlign:{ 
            	type:String,
            	default:'left'            	
            },
            textIndent:{
            	type:String,
            	default:''            	
            }
        },
        data:function(){
        	return {
            	textAlign:this.textAlign, 
            	colortype:this.colortype,
            	textIndent:this.textIndent,
        	}
        },
        created:function (){
        },
        mounted:function(){//存在value,显示value  供存草稿使用
        },
        methods: {
        },
    }
</script>