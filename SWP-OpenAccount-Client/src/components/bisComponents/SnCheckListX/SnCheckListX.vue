<template>
	<div class="XCheckListWrap">
		<div class="allWarp">
			<div class="listLi lineBorderB cursorp" @click="checkedAll">
				<div class="checkBox" :class="{checked: usedoptions.length > 0 && usedoptions.length == usedcheckedList.length}"></div>
				<div class="checkText">全部</div>
			</div>
		</div>
		<div class="listWrap">
			<div class="listLi lineBorderB cursorp" v-for="(option,index) in usedoptions" @click="checked(option)">
				<div class="checkBox" :class="{checked:arrhaveitem(option[key],usedcheckedList)}"></div>
				<div class="checkText">{{option[name]}}</div>
			</div>
		</div>
	</div>
</template>
<script>
    export default {
        components: {
        },
		props:{
			value:{
				type:Array,
				default:[]				
			},
			options:{
				type:Array,
				default:[]
			},
			key:{//数据中的id
				type:String,
				default:'value'
			},
			name:{//数据中的显示字段id
				type:String,
				default:'name'
			}
		},
        data() {
            return {
				usedoptions:this.options,
				usedcheckedList:this.value,
            }
        },
        created() {

        },
        mounted() {
        },
        methods: {			
		    arrhaveitem(item,arr){
		    	let _this = this;
		    	var isInArr = false;
		    	var len = arr.length;
				for(var i=0;i<len;i++){
		    		if(arr[i] == item){
		    			isInArr = true;
		    			break;
		    		}					
				}
		    	return isInArr;
		    }, 
            indexOfArr(val,arr) {
				for (var i = 0; i < arr.length; i++) {
					if (arr[i] == val) return i;
				}
				return -1;
			},						
			checked(option){
				let _this = this;				
            	if(_this.arrhaveitem(option[_this.key],_this.usedcheckedList)){ 
            		_this.usedcheckedList.splice(_this.indexOfArr(option[_this.key],_this.usedcheckedList), 1);            		
            	}else{           		
            		_this.usedcheckedList.push(option[_this.key])            		
            	}	            	
            	_this.$emit('input', _this.usedcheckedList)								
			},
			checkedAll(){
				let _this = this;
				var tempChoosedList = [];
				if(_this.usedoptions.length>0 && _this.usedoptions.length == _this.usedcheckedList.length){
					tempChoosedList = [];
				}else{
					for(var i=0;i<_this.usedoptions.length;i++){
			    		tempChoosedList.push(_this.usedoptions[i][_this.key])					
					}															
				}
				_this.usedcheckedList = tempChoosedList;
				_this.$emit('input', _this.usedcheckedList);
			}
		}
    }
</script>
<style scoped lang="less">
@import '../../style/variables.less';
.XCheckListWrap{
	.allWarp{
		margin-bottom:0.3rem;
	}	
    .noInfo{
        margin-top: 1.5rem;
        height: 0.5rem;
        padding-top: 3rem;
        text-align: center;
        font-size: 0.32rem;
        line-height: 0.42rem;
        color: #b2b2b2;
        background: url(../resource/img/bpcompment/empty.png) no-repeat center;
        background-size: 1.62rem 1.83rem;
    }
    .listLi{
        display: -ms-flexbox;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;   
    	line-height: 0.38rem;
    	padding: 0.25rem 0.3rem;
    	background: #fff;
    	font-size: 0.32rem;
    	.checkBox{
    		width:0.9rem;
    		background: url(../resource/img/bpcompment/unCheck.png) no-repeat center;
    		background-size:contain;
    	}
    	.checkBox.checked{
    		background: url(../resource/img/bpcompment/check.png) no-repeat center;
    		background-size:contain;
    	}
	    .checkText{
		    -webkit-box-flex: 1;      
		    -moz-box-flex: 1;        
		    -webkit-flex: 1;          
		    -ms-flex: 1;              
		    flex: 1;                  
		}    	    	
    }

}
</style>

