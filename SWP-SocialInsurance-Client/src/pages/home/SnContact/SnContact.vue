<template>
    <section :class="['sn-contact', 'sn-section', className, {'no-tip': !tip}]">
        <div   class="contact-title">
            <span class="sn-label">{{label}}</span>
            <div v-if="tip" class="contact-tip">{{tip}}</div>
        </div>
        <article class="contact-con">
            <ul class="contact-list">
                <li class="contact-item" v-for="(item,index) in contactList">
                    <!-- <span class="avatar item" v-bind:style="{backgroundImage: 'url(../communication_icon/' + item.applyUaId + ')'}" ></span> -->
                    <span class="avatar"></span>
                    <span>{{item.name}}</span>
                    <!-- <img src=`../communication_icon/${applyUaId}`></img> -->
                </li>
                <li class="contact-item add-icon" @click="addUser">+</li>
            </ul>
            <CommonUsed :commonUsedList="commonUsedList" commoUsedLabel="最近联系人" className="testClass"></CommonUsed>
        </article>
    </section>
</template>
<script>
    import './SnContact.less';
    import CommonUsed from "../SnCommonUsed/SnCommonUsed.vue";
    import { OpenActionFunction } from '../../../lib/common/SnJsBridge.js';
    export default {
        components:{
            CommonUsed
        },
        props: {
            className: {
                type: String,
                default: ''
            },
            label:{
            	type:String,
            	default:''
            },
            tip:{
                type:String,
            	default:''
            },
            map:{
                type: Object,
                default: null
            },
            multi:{
                type: Boolean,
                default: true   //type 0表示单选  1表示多选
            },
            showInactivated:{//是否显示未激活人员
            	type:Boolean,
            	default:false
            },
        },
        data: function(){
            return {
                commonUsedList: [{
                    applyUaId: 1, 
                    name: "张三"
                },{
                    applyUaId: 2, 
                    name: "李四"
                },{
                    applyUaId: 3, 
                    name: "张大锤"
                },{
                    applyUaId: 4, 
                    name: "王五"
                },{
                    applyUaId: 5, 
                    name: "李三"
                },{
                    applyUaId: 6, 
                    name: "文强"
                }],
                contactList: [],
            }
        },
        methods: {
            addUser: function(){
				var _this = this;
                let selectType = Number(_this.multi).toString();
                let selectedIds = [];//选中的人员					
				if(_this.isInDetailFlag){//明细
					this.$root.content.inDetail.forEach(function(item){
						if(!!item.UAId){
							selectedIds.push(parseInt(item.UAId));
						}else if(!!item.UAName&&parseInt(item.UAName)){
							selectedIds.push(parseInt(item.UAName));
						}
					})					
				} else {
					selectedIds = _this.UAIds;
				}													
				if(_this.filterUserList&&_this.filterUserList.length>0){
					selectedIds = selectedIds.concat(_this.filterUserList);//过滤的人员与选择人员的合集
				}
				//调用app方法 打开通讯录 参数
				let selectJson = {
					action: 'IntentAction_SelectContactWithOrgListActivity',
					dataList: [
                        {key: 'from_key', value: 9, type: "int"},
                        {key: 'select_model', value: selectType, type: "string"},
                        {key: 'selected_list_tpay', value: JSON.stringify(selectedIds), type: "string"},
                        {key: 'is_show_inactivated', value: _this.showInactivated, type:"bool"}
                    ],
					responseKeyList: [
                        {key: 'addusers_tpay', value: '', type: 'string'}
                    ]
				};
				OpenActionFunction(selectJson).then(function(data){//调用app选择联系人窗口
					try{
						let selectUsers = JSON.parse(data[0].value);
                        let MAX_COPYTO = 20;//最多知会人个数
						if(MAX_COPYTO<selectUser.length){//超过二十个人
							showToast('最多添加'+MAX_COPYTO+'个知会人', 'middle');
						}
						let UAIds = selectUser.slice(0,MAX_COPYTO).map(function(item){
							return item.UAId;
						});
						let UANames = selectUser.slice(0,MAX_COPYTO).map(function(item){
							return item.uName;
						});	
						_this.uPhones = selectUser.slice(0,MAX_COPYTO).map(function(item){
							return item.uPhone;
						});	
						if(isPC()){//PC通讯录组件可删除人员
							_this.UAIds = UAIds;  //PC人员Id
							_this.UANames = UANames;  //PC人员名称							
						}else{			
							_this.UAIds = (0==_this.selectType?UAIds:_this.UAIds.concat(UAIds));  //人员Id
							_this.UANames = (0==_this.selectType?UANames:_this.UANames.concat(UANames));  //人员名称							
						}
						
						if(MAX_COPYTO<_this.UAIds.length){//超过二十个人
							showToast('最多添加'+MAX_COPYTO+'个知会人', 'middle');
							_this.UAIds = _this.UAIds.slice(0,MAX_COPYTO);
							_this.UANames = _this.UANames.slice(0,MAX_COPYTO);
						}
						//处理是否有关联组件
				        _this.relationCheck(UAIds[0],UANames[0]);
					}catch(e){
						//不需要操作
						_this.UAIds = [];
						_this.UANames = [];
					}
					_this.setServerData(0==_this.selectType?_this.UAIds.join():_this.UAIds,_this.UANames);
				});
            }
        }
    }
</script>