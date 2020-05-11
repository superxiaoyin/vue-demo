<template>
    <div>


    <group label-width="5em">

         <cell title="结算卡" value-align="left" is-link  @click.native="showPop">
        	<input class="popupInput" type="text" v-model="debitcard" value="" @input="submit" maxlength="20" placeholder="请选择结算卡(必填)" readonly="readonly"/>
        </cell>
        
    </group>
    
    <!--<group label-width="5em">   
        <cell title="金额"  value-align="left" >
            <input type="text" v-model="debitSum" value="" @input="submit" maxlength="200" placeholder="请输入金额(必填)"/>
        </cell>
    </group>-->
    
    <group label-width="5em">   
        <cell title="事由"  value-align="left" >
            <input type="text" v-model="debitText" value="" @input="submit" maxlength="200" placeholder="请输入用卡事由(选填)"/>
        </cell>
    </group>
       
   
   
   <div v-transfer-dom>
            <popup  v-model="transferType" position="right" width="100%">
                <div class="position-horizontal-demo popupDebit">
                    <panel :list="debitcardList" header="请选择结算卡" type="1" @on-click-item="panelClick"></panel>
                </div>
            </popup>
        </div>
   
    </div>
</template>

<script>
	import { cryptPost } from '../../lib/api.js';
	import { bankMap } from '../../lib/ConstantData.js';
    import { getBankType,showToast } from '../../lib/common/extend.js';
    import {Group,  Cell, Panel, Popup, PopupHeader, TransferDom } from 'vux';
    export default {
    	directives: {
		    TransferDom
		  },
        components: {
            Group,
            Cell,
            Panel,
            Popup,
            PopupHeader
        },
        props: {
           debitSelectPage:{
                type:Boolean
           },
        },
        data () {
         return {
             debitcard : '',
            //debitSum  : '',
             debitText : '',
             
             transferType:false,
             debitcardList: [],
             appBankType: ''
         }
        },
        mounted(){
        	var _this = this;
        	getBankType( _this ); //获取银行type
        },
        beforeCreate (){
        	
        },
        created () {
        	var _this = this;
            _this.debitSelect();
            console.log( '_this.appBankType:' + _this.appBankType );
        	//var debitcardBankname = '厦门银行';
        	var debitcardList = [];
        	//queryCpyDebitCardList 获取结算卡列表
        	cryptPost('approval/queryCpyDebitCardList.do', {}).then(function(result){
        		    
        		    var debitcardBankname =  bankMap[ _this.appBankType ].name ; //获取银行name
		        	var bankIcon = bankMap[ _this.appBankType ].icon ;  //获取银行icon
		        	console.log( debitcardBankname );
					debitcardList = result.jskList;
		            _this.debitcard = debitcardList[0];
		        	_this.debitcardList = debitcardList.map(function(item){return {src:'./resource/img/tempicon/' + bankIcon,title:debitcardBankname+'('+item.substring(item.length - 4, item.length)+')',card:item}});
		            _this.submit();//初始化传值父组件
			});
            
            
        },
        watch:{
            debitSelectPage(curVal,oldVal){ // 父组件传入debitSelectPage时，赋值给transferType
                var _this = this;
               _this.transferType = curVal;
               _this.submit();
            }
        },
        methods: {
        	
        	/**
        	 * 显示结算卡选择项页面
        	 */
        	showPop(){
        		var _this = this;
        		if(0 == _this.debitcardList.length){
        			showToast('此企业暂无结算卡', 'middle');
        			return;
        		}
        		_this.transferType = true;
        		_this.debitSelect(); 
        	},
            panelClick(item){ //选中结算卡点击事件
            	console.log('panelItem :'+item.card);
            	var _this = this;
            	 _this.debitcard = item.card;
            	 _this.transferType = false;
            	 _this.debitSelect(); 
            	 _this.submit();
            },
            debitSelect(){//结算卡组件与父组件之间传值
            	var _this = this;
            	_this.$emit('debitSelectType',_this.transferType);
            },
            submit(){
                var msg = {
                    
                    'settlementCard'  : {'value':this.debitcard,'title':'结算卡','validate':'notEmpty'},
//                  'settlementSum'   : {'value':this.debitSum,'title':'金额','validate':'notEmpty'},
                    'settlementReason': {'value':this.debitText,'title':'事由','validate':''}
                    
                };
                this.$emit('submiBtn',msg);
            }
           
        }
    }
</script>
<style scoped>
    .checker{
        display: flex;
    }
    .checker-body{
        width: 2rem;
    }
    .weui-cells_radio{
        display: -webkit-box;
    }
    .check-item {
        width: 12px;
        height: 12px;
        line-height: 12px;
        text-align: center;
        border-radius: 3px;
        border: 1px solid #ccc;
        background-color: #fff;
        margin-right: 1px;
    }
    .check-item-selected {
        color: #fff;
        background-color: #3864A7;
        border-color: #3864A7;
    }
    .position-horizontal-demo {
        position: relative;
        height: 100%;
    }
    .vux-close {
        position: absolute;
        top: 5%;
        left: 5%;
        /*transform: translateX(-50%) translateY(-50%) scale(2);*/
        color: #000;
    }
    .popupDebit {
		overflow-y: scroll!important;
	}
	.position-horizontal-demo{
		
	}
	.popupInput{background: rgba(255,255,255,0);}
	::-webkit-scrollbar:horizontal {
	    height: 0em!important;
	}
	/*滚动条设置， 需要屏蔽vux的滚动条*/
	/*::-webkit-scrollbar{width:0px;} 
	::-webkit-scrollbar-track{background-color:#bee1eb;}
	::-webkit-scrollbar-thumb{background-color:#00aff0;}
	::-webkit-scrollbar-thumb:hover {background-color:#9c3}
	::-webkit-scrollbar-thumb:active {background-color:#00aff0}*/
</style>