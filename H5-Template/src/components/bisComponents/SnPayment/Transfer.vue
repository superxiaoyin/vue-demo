<template>
    <div>

        <group label-width="5em">
            <cell title="汇款类型" value-align="left" >
                <div class="checker">
                    <div v-for="(item,index) in defalutPayType" class="checker-body">
                        <input class="magic-radio" type="radio" name="payType" :id="'payType'+item.key" :value="item.key" @change="paytypeChange(item.key)" v-model="payType">
                        <label :for="'payType'+item.key">
                            {{item.value}}
                        </label>
                    </div>
                </div>

            </cell>

            <cell title="汇款对象" value-align="left" >

                <div class="checker">
                    <div v-for="(item,index) in defalutTransObj" class="checker-body" >
                        <input class="magic-radio" type="radio" name="transObj" :id="'transObj'+item.key" :value="item.key" @change="transObjChange(item.key)" v-model="transObj">
                        <label :for="'transObj'+item.key">
                            {{item.value}}
                        </label>
                    </div>
                </div>

            </cell>

            <cell title="汇款方式" value-align="left" >

                <div class="checker">
                    <div v-for="(item,index) in defalutTransMethod" class="checker-body" >
                        <input class="magic-radio" type="radio" name="transMethod" :id="'transMethod'+item.key" :value="item.key" @change="transMethodChange(item.key)" v-model="transMethod">
                        <label :for="'transMethod'+item.key">
                            {{item.value}}
                        </label>
                    </div>
                </div>

            </cell>

        </group>


        <group>
            <!--<cell title="选择常用收款账户" @click.native="checkContact">
                <img src="../../resource/img/oa-icon-1-new.png" class="notebook" />
            </cell>-->
            <cell-box class="vux-tap-active" @click.native="checkContact" >
		    	<span class="cellText">选择常用收款账户</span>
		    	<img src="../../resource/img/oa-icon-1-new.png" class="notebookTran" />
		    </cell-box>
        </group>

        <group label-width="5em" gutter="-1px">
            <div v-if=" payType === 1 ">

                <cell title="收款户名"  value-align="left" >
                    <input type="text" ref='payeeName' v-model="payeeName" maxlength="20" @input="submit" placeholder="请输入收款户名(必填)" />
                </cell>
                <cell title="收款账号"  value-align="left">
                    <input type="number" ref="payeeaccount" maxlength="32" v-model="payeeaccount" @input="submit" placeholder="请输入收款账号(必填)"/>
                </cell>
            </div>
            <div v-if=" payType === 2 ">
                <cell title="收款户名"   value-align="left" >
                    <input type="text" ref='payeeName' maxlength="20" v-model="payeeName" @input="submit" placeholder="请输入收款户名(必填)" />
                </cell>
                <cell title="收款账号"  value-align="left">
                    <input type="number" ref="payeeaccount" maxlength="32" v-model="payeeaccount" @input="submit" placeholder="请输入收款账号(必填)"/>
                </cell>

                <cell title="收款银行" value="请选择收款银行" v-model="bankName" @click.native="selectBank" value-align="left" is-link></cell>

                <cell title="所在省市" value="请选择省市" v-model="cityName" @click.native="selectProCity" value-align="left" is-link></cell>
                <cell title="开户支行" :value="branchName" v-model="branchName" value-align="left" @click.native="showBranch" is-link></cell>
                <!--选择形式类似收款银行选择-->
            </div>

            <div v-else>
                <!--未选择时显示-->
            </div>
        </group>

        <group gutter="-1px">
            <x-switch title="保存为常用收款账户" v-model="contactValue"></x-switch>
        </group>

        <div v-transfer-dom>
            <popup  v-model="contactType" position="right" width="100%">
                <div class="position-horizontal-demo popupDebit">
                    <panel :list="contactList" header="请选择收款账户" type="1" @on-click-item="panelClick"></panel>
                </div>
            </popup>
      </div>

    </div>
</template>

<script>
	import { OpenActionFunction,SelectProvinceWidget } from '../../lib/common/SnJsBridge.js';
    import { throttle,getStorage,setStorage,showToast,showConfirm } from '../../lib/common/extend.js';
    import { cryptPost, noCryptPost } from '../../lib/api.js';
    import { Group, Cell, CellBox, XSwitch, ToastPlugin, Popup, Panel, TransferDom} from 'vux';
    Vue.use(ToastPlugin);
    export default {
    	directives: {
		    TransferDom
		},
        components: {
            Group,
            Cell,
            CellBox,
            XSwitch,
            Popup,
            Panel
        },
        //props: ['payeeNameFrom'],
        props: {
           payeeNameFrom:{
           	 type:String
           },
           transferSelectPage:{
           	 type:Boolean
           }
        },
        data:function () {
            return {
                payType: 1,
                transObj: 1,
                transMethod:1,
                defalutPayType:[{key:1,value:'行内'},{key:2,value:'跨行'}],
                defalutTransObj:[{key:1,value:'企业'},{key:2,value:'个人'}],
                defalutTransMethod:[{key:1,value:'普通'},{key:2,value:'实时'}],
                //payeeName:'',
                //payeeaccount:'',
                bankValue:'',
                bankName:'',
                bankDataStr:'',
                branch:'',
                branchValue:'',
                branchName:'',
                cityValue:'',
                cityName:'',
                proCityData:'',
                provinceValue:'',
                provinceName:'',
                console:'',
                contactValue:false,
                contactType:false,
                contactList: []
            }
        },
        beforeCreate: function(){

        },
        created:function () {
            var _this = this;
            _this.getBankInfo();
        },
        watch:{
            payeeNameFrom(curVal,oldVal){ // 父组件传入payeeName时，赋值给payeeName
                var vm =this;
                //vm.payeeName = curVal;
                vm.$refs.payeeName.value = curVal;
                vm.submit();
            },
            transferSelectPage(curVal,oldVal){ // 父组件传入debitSelectPage时，赋值给transferType
                var _this = this;
               _this.contactType = curVal;
               _this.submit();
            }
        },
        methods: {
        	getBankInfo:function(){
        		var _this = this;
        		_this.geBankList(); //取银行列表
        	},
        	geBankList:function(){
        		var _this = this;
        		var bankList;
	            //getStorage取本地存储的bankList
	           if(""!=getStorage("bankList2")){//缓存中存在银行列表
	                bankList = JSON.parse(getStorage("bankList2"));
	                _this.showBank(bankList);
	                _this.getProCityList();//取省市列表
	            }else{
	                //取后台银行列表
	                cryptPost('yqt/pay/geBankList.do', {}).then(function(result){
	                bankList = result.bankList;
	                setStorage("bankList",JSON.stringify(bankList));//设置银行列表缓存
	                _this.showBank(bankList);
	                _this.getProCityList();//取省市列表
	            });
	            }
	            
	            /*cryptPost('yqt/pay/geBankList.do', {}).then(function(result){
	                bankList = result.bankList;
	                setStorage("bankList",JSON.stringify(bankList));//设置银行列表缓存
	                _this.showBank(bankList);
	                _this.getProCityList();//取省市列表
	            });*/
        	},
            getProCityList:function(){
            	var _this = this;
        		var provList;
	           
	            if(""!=getStorage("provList")){
	                //getStorage取本地存储的provList
	                var provList = JSON.parse(getStorage("provList"));
	                _this.showProCity(provList);
	            }else{
	                //取后台省市列表
		               cryptPost('bank/getProCityList.do', {}).then(function(result){
		                provList= result.provList;
		                setStorage("provList",JSON.stringify(provList));//设置省市列表缓存
		                _this.showProCity(provList);
		                _this.submit();//初始化传值父组件
		            });
	            }
	
	            /*cryptPost('yqt/pay/getProCityList.do', {}).then(function(result){
	                provList= result.provList;
	                setStorage("provList",JSON.stringify(provList));//设置省市列表缓存
	                _this.showProCity(provList);
	                _this.submit();//初始化传值父组件
	            });*/
            
        	},
            bankClick (value) {
                var vm = this;
                vm.bankValue = value;
            },
            branchClick(value){
                var vm = this;
                vm.branch = value;
            },
            selectBank(){
                var _this = this;
                //取银行列表，请求native选择
                var bankDataList = _this.bankDataStr;
                
                var bankValue = _this.bankValue;
                var bankJson = {
                    action  : 'intent_action_selecttypebyidactivity',
                    dataList: [{key: 'select_key', value: bankValue, type: "string"},
                        {key: 'Title', value: '选择银行', type: "string"},
                        {key: 'SELECTWIDGETID', value: 'bankSelect1', type: "string"},
                        {key: 'data_list_key', value: bankDataList, type: "string"}],
                    responseKeyList: [{key: 'result_key', value: '', type: 'string'},{key: 'SELECTWIDGETID', value: '', type: 'string'}]
                };
                //请求native选择银行
                OpenActionFunction(bankJson).then(function(data){
                    if(''!=data){
                        var result_key;
                        data.forEach(function (item) {
                            if(item.key == 'result_key') {
                                result_key = item.value;
                            }
                        });
                        _this.bankValue = result_key.split('-')[0];  //银行ID
                        _this.bankName =  result_key.split('-')[1]; //银行显示的文字
                        _this.branchName = '';
                        _this.submit();
                    }
                });

            },
            showBank(bankList){
                var _this = this;
                var bankData = ''; //bankData需要用的银行string
                var str = /^[A-Za-z]*$/;
                bankList.forEach(function (item,index) {
                	
                	if (str.test(item.bankId)){ //判断是否字母
                		
                	}else{
                		bankData += item.bankId+"-"+item.bankName+";";
                	}
                    
                });
                _this.bankDataStr = bankData.slice(0,bankData.length-1);
            },
            selectProCity(){
                var _this = this;
                //取省市列表，请求native选择
                var provinceList = new Array;
                var cityList = new Array;
                var proCityData = _this.proCityData;
                if( ''!= proCityData.length){
	                	proCityData.map(function (item,index) {
	                    provinceList.push({id:item.provId,name:item.provName});
	                    var arrayChild = new Array;
	                    var cityDate = item.cityList;
	                    cityDate.map(function (city,i) {
	                        arrayChild.push({id:city.cityId,name:city.cityName});
	                    });
	                    cityList.push(arrayChild);
	
	                });
                }

                

                var provinceCityList = { mProvinceList:provinceList,mCityList:cityList };
                var selectProvinceCity = { selectID:'',mSelPrivience:provinceList[0],mSelCity:cityList[0][0] };
                var provinceListAll = { provienceCityList:provinceCityList,selectProvienceCity:selectProvinceCity,title:'选择省市'};

                //请求native选择省市
                SelectProvinceWidget(JSON.stringify(provinceListAll)).then(function(data) { //调用native选择
                    if(''!=data) {
                        _this.cityName = data.mSelPrivience.name + " " + data.mSelCity.name;
                        _this.cityValue = data.mSelCity.id;
                        _this.branchName = '';
                        _this.submit();
                    }
                });
            },
            showProCity(proCityList){
                var _this = this;
                _this.proCityData = proCityList; //proCityData需要用到的省市数据
            },
            showBranch(){
                var _this = this;
                var branchList;
                var branchDataList;
                var branchValue = _this.branchValue;
                var bankId = _this.bankValue;
                var cityId = _this.cityValue;
                if('' == bankId || '' == cityId){
					showConfirm("请先选择银行和所在省市！",null,1,'确认','','');
                    return false;
                }
                cryptPost('bank/getBranchList.do', {bankId:bankId,cityId:cityId}).then(function(result){ //根据已选银行，省市，请求支行
                    branchList = result.branchList;
                    
                    
                    branchList.forEach(function (item,index) {
                        branchDataList += item.branchId+"-"+item.branchName+";";
                    });
                    
                    
                    if(branchList.length<1){
                    	
                    	showConfirm('暂无支行信息,请重新选择',null,1,'确认','','');
                    	return false;
                    }
                    
                    //setStorage("branchList",JSON.stringify(branchList));//设置支行列表缓存
                    //取到支行列表,请求native，选择支行
                    var branchJson = {
                        action  : 'intent_action_selecttypebyidactivity',
                        dataList: [{key: 'select_key', value: branchValue, type: "string"},
                            {key: 'Title', value: '选择支行', type: "string"},
                            {key: 'SELECTWIDGETID', value: 'branchSelect1', type: "string"},
                            {key: 'data_list_key', value: branchDataList, type: "string"}],
                        responseKeyList: [{key: 'result_key', value: '', type: 'string'},{key: 'SELECTWIDGETID', value: '', type: 'string'}]
                    };
                    
                    OpenActionFunction(branchJson).then(function(data){
                        if(''!=data){
                            var result_key;
                            data.forEach(function (item) {
                                if(item.key == 'result_key') {
                                    result_key = item.value;
                                }
                            });
                            _this.branchValue = result_key.split('-')[0];  //支行ID
                            _this.branchName =  result_key.split('-')[1]; //支行显示的文字
                            _this.submit();
                            _this.console = _this.branchValue;
                        }

                    });

                });


            },
            remitSubmit(){
                var vm = this;
                this.submit();
            },
            paytypeChange(key){
                var vm = this;
                vm.payType = key;
                vm.clearContact();
                this.submit();
            },
            transObjChange(key){
                var vm = this;
                vm.transObj = key;
                this.submit();
            },
            transMethodChange(key){
                var vm = this;
                vm.transMethod = key;
                this.submit();
            },
            submit(){
               // var cityname = this.getName(this.cityValue);
                var msg;
                if(1 === this.payType){
                    msg = {
                        'payType'      : {'value':this.payType,'title':'汇款类型','validate':'notEmpty'},
                        'transObj'     : {'value':this.transObj,'title':'汇款对象','validate':'notEmpty'},
                        'transMethod'  : {'value':this.transMethod,'title':'汇款方式','validate':'notEmpty'},
                        'payeeName'    : {'value':this.$refs.payeeName.value,'title':'收款户名','validate':'notEmpty'},
                        'payeeaccount' : {'value':this.$refs.payeeaccount.value,'title':'收款账号','validate':'notEmpty'},
                        'isSaveCommReceiver':{'value':1,'title':'是否保存为常用收款账户','validate':''}
                    };

                }else if(2 === this.payType){
                    msg = {
                        'payType'      : {'value':this.payType,'title':'汇款类型','validate':'notEmpty'},
                        'transObj'     : {'value':this.transObj,'title':'汇款对象','validate':'notEmpty'},
                        'transMethod'  : {'value':this.transMethod,'title':'汇款方式','validate':'notEmpty'},
                        'payeeName'    : {'value':this.$refs.payeeName.value,'title':'收款户名','validate':'notEmpty'},
                        'payeeaccount' : {'value':this.$refs.payeeaccount.value,'title':'收款账号','validate':'notEmpty'},
                        'bankValue'    : {'value':this.bankValue,'title':'收款银行','validate':'notEmpty'},
                        'bankDisplay'  : {'value':this.bankName,'title':'收款银行','validate':'notEmpty'},
                        'cityName'     : {'value':this.cityValue,'title':'所在省市','validate':'notEmpty'},
                        'cityDisplay'  : {'value':this.cityName,'title':'所在省市','validate':'notEmpty'},
                        'branch'       : {'value':this.branchValue,'title':'开户支行','validate':'notEmpty'},
                        'branchDisplay': {'value':this.branchName,'title':'开户支行','validate':'notEmpty'},
                        'isSaveCommReceiver':{'value':1,'title':'是否保存为常用收款账户','validate':''}
                    };
                    this.console = msg;
                }

                this.$emit('submiBtn',msg);
            },
            checkContact:function(){//常用联系人点击事件
            	var _this = this;
            	var StorageId = '';
            	StorageId = (1 === _this.payType) ?'intraBankStorage':'crossBankStorage';
            	var payAccountStr = getStorage(StorageId);
            	if(payAccountStr == '' || payAccountStr == undefined){
					showToast('暂无常用账户','middle');
				}else{
					var payAccountJson = JSON.parse(payAccountStr);
					if(payAccountJson.length <= 0){
						showToast('暂无常用账户','middle');
					}else {
						if(1 === _this.payType){
		            		_this.contactList = payAccountJson.map(function(item){return {title:item.accountName+'('+item.account.substring(item.account.length - 4, item.account.length)+')',card:item.account,name:item.accountName}});
		            	}else if(2 === _this.payType){
		            		_this.contactList = payAccountJson.map(function(item){return {
		            			title:item.accountName+'('+item.account.substring(item.account.length - 4, item.account.length)+')',
		            			card:item.account,
		            			name:item.accountName,
		            			bankId: item.bankId,
								bankName: item.bankName,
								branchId: item.branchId,
								branchName: item.branchName,
								cityId: item.cityId,
								cityName: item.cityName}});
		            	}
						_this.contactType = true;
						_this.transferSelect();
					}
				}
            },
            saveContact:function(){//保存常用联系人
            	var _this = this;
            	if(_this.contactValue){
            		var payAccount = {};
					var StorageId = '';
					if(1 === _this.payType){//行内汇款
						StorageId = 'intraBankStorage';
						payAccount = {"account":_this.$refs.payeeaccount.value,"accountName":_this.$refs.payeeName.value};
					}else if(2 === _this.payType){//跨行汇款
						StorageId = 'crossBankStorage';
						payAccount = {"account":_this.$refs.payeeaccount.value,"bankName":_this.bankName,"accountName":_this.$refs.payeeName.value,"bankId":_this.bankValue,"cityName":_this.cityName,"cityId":_this.cityValue,"branchName":_this.branchName,"branchId":_this.branchValue};
					};
					var payAccountStr = getStorage(StorageId);
					if(payAccountStr == '' || payAccountStr == undefined){
						var payAccountJson = [];
						payAccountJson[0] = payAccount;
					}else{
						var payAccountJson = JSON.parse(payAccountStr);
						var same = false;
						var payaccountLength = payAccountJson.length;
						for(var i=0; i<payaccountLength;i++){
							var payAccountIndex = payAccountJson[i];
							if(payAccount['account'] == payAccountIndex['account']){
								payAccountJson[i] = payAccount;
								same = true;
								break;
							}			
						}				
						if(!same){
							var MAX_LENGTH = 20;
							payAccountJson.unshift(payAccount);
							if(payAccountJson.length >= MAX_LENGTH){
								payAccountJson.splice(MAX_LENGTH,1);
							}			
						}					
					}
					setStorage(StorageId,JSON.stringify(payAccountJson)); 
            	}
            },
            panelClick:function(item){ //选中常用账户事件
            	var _this = this;
            	_this.contactType = false;
            	 if(1 === _this.payType){
		            //_this.payeeaccount = item.card;
		            _this.$refs.payeeaccount.value = item.card;
		            //_this.payeeName = item.name;
		            _this.$refs.payeeName.value = item.name;
		         }else if(2 === _this.payType){
		            //_this.payeeaccount = item.card;
		            _this.$refs.payeeaccount.value = item.card;
		            //_this.payeeName = item.name;
		            _this.$refs.payeeName.value = item.name;
		            _this.bankValue = item.bankId;
					_this.bankName = item.bankName;
					_this.cityValue = item.cityId;
					_this.cityName = item.cityName;
					_this.branchValue = item.branchId;
					_this.branchName = item.branchName;
		         }
		         _this.transferSelect(); 
            	 _this.submit();
            },
            clearContact:function(){ //清空收款信息input
            	var _this = this;
            	//_this.payeeaccount = '';
            	_this.$refs.payeeaccount = '';
		        //_this.payeeName = '';
		        _this.$refs.payeeName.value = '';
		        _this.bankValue = '';
				_this.bankName = '';
				_this.cityValue = '';
				_this.cityName = '';
				_this.branchValue = '';
				_this.branchName = '';
            },
            transferSelect:function(){//转账组件与父组件之间传值
            	var _this = this;
            	_this.$emit('transferSelectType',_this.contactType);
            },
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
	::-webkit-scrollbar:horizontal {
	    height: 0em!important;
	}
	/*滚动条设置， 需要屏蔽vux的滚动条*/
	/*::-webkit-scrollbar{width:0px;} 
	::-webkit-scrollbar-track{background-color:#bee1eb;}
	::-webkit-scrollbar-thumb{background-color:#00aff0;}
	::-webkit-scrollbar-thumb:hover {background-color:#9c3}
	::-webkit-scrollbar-thumb:active {background-color:#00aff0}*/
	.notebookTran{
		position: absolute;
        width: 22px;
        right: 0.3rem;
       line-height: 100%;
	}
	.cellTitle{
		width: 1.5rem;
	}
	.cellText{
		margin-right: 0.8rem;
		width: 8em;
	}
    
</style>