<template>
    <div class="rentWithDraw">
        <div class='info'>
            <div class="title">续租</div>
            <cell title="保管箱种类:" :value="15545445455"></cell>
            <cell title="租赁开始日期：" :value="'2020-02-03'"></cell>
            <Calendar 
            :readonly="readonly" 
            v-model="dateTime"
            title="租赁结束日期：" 
            disable-past 
            placeholder="请选择日期" 
            @on-change="changes"
            >
            </Calendar>
            <div id='freeBox'>
                <div class="totalOne">
                    <label class="weui-label" style="width: 5.5em;">收费金额:</label>
                    <div class="cont-rl" @click="moneyInfo()">
                        <span>{{'45454545'}}</span>
                        <SnIcon type="clamation-circle-fill" />
                    </div>
                </div>
            </div>
            <cell title="姓名:" :value="'xxxxx'"></cell>
            <cell title="联系电话:" :value="'13692682356'"></cell>
            <cell title="身份证号:" :value="'513709991263589960'"></cell>
        </div>

        <SnModal
            v-if="commonPopObj.showCommonPop"
            @SnCanclePop="SnCanclePop"
            @SnConfirmPop="SnConfirmPop"
            :title="commonPopObj.title"
            :content="commonPopObj.content"
            :shadowColor="commonPopObj.shadowColor"
        ></SnModal>

        <SnModal
            v-if="isShow"
            @SnCanclePop="SnCanclePopOne"
            @SnConfirmPop="SnConfirmPopOne"
            :title="title"
            :content="content"
            :btnType="btnType"
            @SnConfirmPopOnly='SnConfirmPopOnly'
            >
            <div slot="descriptionContent" class="description_content" v-if="isSlot">
                <p>1.姓名需与所持证件的姓名一致</p>
                <p>2.姓名中间不要输入空格或其他符号。</p>
                <p>3.少数民族的乘客，若需要购买火车票，需要输入姓名中的“·”,如“阿不都·买买提”；如需购买机票，可直接出入“阿卜杜买买提”。</p>
                <p>4.香港、台湾、澳门的护照不支持国内航班，请改用其他证件输入。</p>
            </div>
        </SnModal>

        <div class="footer button-on" >
            <div class="btns"  @click="next" >下一步</div>
        </div>
    </div>
</template>

<script>

import { Cell,Calendar} from 'vux';
import { SnButton } from 'components';
import { SnModal } from "components/index.js";
import { SnIcon } from "sinosun-ui";
import {  showToast } from 'sslib/common/extend';
export default {
    data(){
        return{
            readonly:false, 
            endTime:'',
            dateTime:'',
            commonPopObj: {
            showCommonPop: false,
            title: "续租",
            content: "确认续租次保管箱吗？",
            shadowColor: "rgba(0, 0, 0, .2)"
            },
            isShow: false,
            title: "",
            content: "",
            isSlot: false,
            btnType: "two",
        }
    },
    components:{
       Cell,Calendar,SnButton,SnModal,SnIcon
    },
    methods:{
        changes(value){
            console.log('结束日期',value)
            let _this=this;
            _this.endTime=value;
        },
        next(){
            let _this=this;
            if(_this.endTime){
                _this.commonPopObj.showCommonPop=true
            }else if(!_this.endTime){
                showToast("请填写结束日期", "middle")
            }
        },
        moneyInfo() {
            let {isShow,isSlot,title,btnType} =this;
            isShow = true;
            isSlot = true;
            title = "费用明细";
            btnType = "one";
        },
        SnConfirmPopOnly() {
            let _this=this;
            _this.isSlot = false;
            _this.isShow = false;
        },
        SnCanclePopOne() {
            let _this=this;
            _this.isShow = false;
        },
        SnConfirmPopOne() {
            let _this=this;
            _this.isShow = false;
        },
        SnCanclePop(){
            let _this=this;
            _this.commonPopObj.showCommonPop=false;
        },
        SnConfirmPop(){
            let _this=this;
            _this.commonPopObj.showCommonPop = false;
        },
    }
}
</script>

<style lang="less" >
@import (reference) "~components/style/common";
@import '~vux/src/styles/1px.less';
    .rentWithDraw{
        padding-top: 10px;
        .info{
            padding: 10px;
            box-shadow: 0px 5px 12px 3px rgba(0, 0, 0, 0.06);
            margin: 12px;
            border-radius: 10px;
            padding-bottom: 0;
            padding-top: 1px;
            .title {
                font-size: 0.36rem;
                font-weight: bold;
                padding: 10px 14px;
            }
            }
    .weui-label,.vux-label{
        width: 2.9rem !important;
    }
    #freeBox{
        .totalOne {
            padding: 0.25rem 0.3rem;
            border-top: solid 1px #ececec;
            margin-left: 12px;
            padding-left: 0.06rem;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }
    }
    .footer{
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 99;
        width: 100%;
        height:1.12rem;
        background:rgba(255,255,255,1);
        box-shadow:0px -2px 8px 0px rgba(0,0,0,0.06);
        padding: 7px .3rem 0;
    .btns{
        height:0.8rem;
        line-height: 0.8rem;
        background:linear-gradient(132deg,rgba(255,134,109,1) 0%,rgba(250,65,143,1) 100%);
        border-radius:40px;
        text-align: center;
        color: #fff;
        font-size: .32rem;
    }
    }
    }
</style>