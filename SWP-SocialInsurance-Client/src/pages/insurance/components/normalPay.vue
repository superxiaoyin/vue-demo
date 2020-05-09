<template>
    <div class="query-main">
        <div class="person-info">
            <div class="manager-name" @click="showASSelectfun"><div class="manager-name-info">缴费档次</div><div class="gradeNum">{{grade}}</div></div>

            <cell class="sn-text" title="缴费年份" :value="displayYear" value-align="left"></cell>
        </div>
        <div class="person-info">
           <cell class="sn-text" title="档次金额">
               <slot><div class="sn-price">{{payMoney}}</div></slot>
           </cell>
            <!-- <div class="sn-text">
                <div class="agreement">
                    <i :class="agree?'agree_pre':'agree_nor'" @click="agree=!agree"></i>
                    <span class="agree-text">我已阅读并同意</span>
                    <a class="sn-pointer" @click="openProtocol">《缴费协议》</a>
                </div>
            </div> -->
        </div>
        <div class="next-btn">
            <SnButton @SnButtonClick="nextStep">下一步</SnButton>
        </div>


        <SnPopupList
            @onChange="onChange"
            @onSelect="onSelect"
            @beforePopup="beforePopup"
            @onHide="onHide"
            @loadMore="loadMore"
            :list="dataList"
            :selectFlag="selectFlag"
            :hasMore="hasMore"
            textAlign="center"
            size="small"
            v-model="showActionSheetSelect"
        >
        </SnPopupList>
    </div>
</template>
<script>
import {Cell,TransferDom} from 'vux'
import { throttle, showToast } from 'sslib/common/extend'
import { openRouterByValue, setBusinessData,getServerDataH5 } from '../../handler/handler'
import { SnText } from 'biscomponents'
import { SnButton,SnPopupList} from 'components'
export default {
    data(){
        return{
            idNum:"",
            gradeNum:'',
            grade:'请选择缴费档次',
            subTitle: ['正常缴费'],
            showActionSheetSelect: false,
            agree: false,
            payMoney:'--',
            dataList:[{valuePropName:'1档',id:1},{valuePropName:'2档',id:2}],
            joinInfo:{},
            payYear:new Date().getFullYear(),
            hasMore:false,
            selectFlag:false,
            defaultValue:[],
            valuePropName:''

        }
    },
    components:{
        SnButton,SnText,Cell,SnPopupList
    },
    directives: {
        TransferDom
    },
    computed:{
        displayYear(){
            return  `${this.payYear}年`
        }
    },
    created(){
        let _this = this;
        _this.init();
    },
    methods:{
        init(){
            let _this = this;
            if(!!_this.$route.query.joinInfo){
                _this.joinInfo = JSON.parse(decodeURIComponent(_this.$route.query.joinInfo));
            }
            getServerDataH5(textUrl+'/SSP-HTTP/socialSecurity.queryPayConfig',_this.joinInfo,'POST').then(result => {
                if(result.code === 0){
                    _this.dataList = result.configList.map(function (item, index) {
                        return {
                            valuePropName: `${item.configName+"档"} ${item.money}元`,
                            valueName: `${item.configName+"档"}`,
                            id: item.money,
                            money: item.money,
                        }
                    });
                }else{
                    showToast(result.rdesc);
                }

            })
        },
        nextStep(){
            let _this = this;
            if(!_this.gradeNum){
                showToast('请选择缴费档次','middle');
                return;
            // }else if(!_this.agree){
            //     showToast('请勾选缴费协议','middle');
            //     return;
            }
            _this.joinInfo.payYear = _this.payYear;
            _this.joinInfo.payMoney = _this.payMoney;
            openRouterByValue("paycardInfo",{joinInfo:encodeURIComponent(JSON.stringify(_this.joinInfo))},_this);
        },
        openProtocol(){
            let _this = this;
            openRouterByValue("payprotocol",{},_this);
        },
        showASSelectfun(){
            this.showActionSheetSelect = true;
        },
        cancleFun() {
            this.showActionSheetSelect = false;
        },
        showMenuItem(menuIndex, menuItem) {
            this.gradeNum = menuItem.id;
            this.grade = menuItem.label;
            this.payMoney = menuItem.money;
        },
        onChange(e){
            console.log(e)
        },
        onSelect(e){
            console.log(e)
            this.grade = `${e.valueName}`
            this.payMoney = e.money
            this.gradeNum = e.id

        },
        beforePopup(){},
        onHide(){},
        loadMore(){},
    },
}
</script>
<style lang="less">
    @import '~components/style/common.less';
    .step2{
        background: @color-bg;
        padding: .3rem 0;
        .step-header{
            text-align: center;
            margin: 0 .3rem .3rem .3rem;
        }
        .person-info{
            background: @color-white;
            .vux-cell-value{color: #333}
            .weui-cell{
                padding: .24rem 0 !important;
                border-bottom: 1px solid @color-bg; 
                .weui-label{
                    width: 2.2rem !important;
                }
                .vux-cell-bd{
                    .vux-label{
                        width: 2.2rem !important;
                    }
                }
            }
            .borderTip{
                height: .3rem;
                background: @color-bg;
            }
            .sn-picker{
                padding: 0 .3rem;
            }
        }
        .next-btn{
            padding: .5rem .3rem;
        }
    }
    
    .manager-name{
        display: -webkit-box;
        padding: 0 .3rem;
        height: .9rem;
        line-height: .9rem;
        border-bottom: 1px solid @color-bg; 
        .manager-name-info{
            width:2.2rem;
            color: #666;
        }
        &:after {
            content: "";
            width: .42rem;
            height: .42rem;
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAQlBMVEUAAACAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIWAgIXJE8ckAAAAFnRSTlMA/r7y6KZ7bz4pHw8H38e1lYliV0wxns2HqAAAAGNJREFUOMvt00kSgCAQBEELFcR9/f9XDX5QER6lz3mAmZ6m5s/JYfQ4sHg9rXTZ60D3aD1vtIPXfdE6Pdxe73B5fcDpdYTkdYL4Hftn+A/60fml+HX7IvmK+vL7s/IHW1NT8gLVxQKJ1fadGgAAAABJRU5ErkJggg==) no-repeat 50%;
            background-size: .42rem .42rem;
            display: inline-block;
            vertical-align: middle;
            cursor: pointer;
        }
        .gradeNum{width: 61%}
    }
    .sn-price{font-size: .5rem;font-weight: bold}
    .agreement {
        display: flex;
        align-items: center;
        padding: .24rem !important;
        font-size: @fs-mob-smaller;
        .agree_pre{
            background: url('../../../resource/img/icon_agree_pre.png') no-repeat center;
        }
        .agree_nor{
            background: url('../../../resource/img/icon_agree_nor.png') no-repeat center;
        }
        .agree_pre,.agree_nor{
            display: inline-block;
            width: .24rem;
            height: .24rem;
            background-size: .24rem .24rem;
        }
        .agree-text{
            margin-left: 0.15rem;
            color: @fc-info;
        }
        a {
            color: #3891FF;
        }
    }
    .vux-cell-value{color: #333}
    .weui-cell:before {border-top: 0}
    .sn-popup .weui-cell__ft:after{background: transparent;}
</style>
