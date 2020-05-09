<template>
    <div class="card-list">
       <div class="cardinfo">
           <div class="li"><div class="fl">账号</div><div class="fr">{{cardNum}}</div></div>
           <div class="li"><div class="fl">查询时间</div><div class="fr">{{start}} 至 {{end}}</div></div>
       </div>

        <ul class="ul" v-if="!pageLoading&&list.length">
            <li v-for="(item,index) in list" :key="index">
                <div class="warp"><div class="fl">交易时间</div><div class="fr">{{item.tradeTime*1000 | time}}</div></div>
                <div class="warp"><div class="fl">交易描述</div><div class="fr">{{item.transactionDesc}}</div></div>
                <div class="warp"><div class="fl">交易金额</div><div class="fr">{{item.money / 100}}</div></div>
                <div class="warp"><div class="fl">余额</div><div class="fr">{{item.balance / 100}}</div></div>

                <!-- <div class="warp"><div class="fl">交易渠道</div><div class="fr">
                    {{item.channelNo == '00002' ? '运管ATM' : item.channelNo == '10024' ? '叙永ATM': item.channelNo == '10027' ? '古蔺ATM':item.channelNo == '77772' ? '信贷系统':item.channelNo == '77773' ? '城商行系统':item.channelNo == '77775' ? '财务系统1':item.channelNo == '77776' ? '财务系统2':item.channelNo == '77777' ? '银联交易虚拟行':item.channelNo == '99999' ? '网银系统':item.channelNo == '10025' ? '合江ATM':item.channelNo == '10028' ? '泸县ATM':item.channelNo == '00001' ? '财税库银':item.channelNo == '22001' ? '成都ATM':item.channelNo == '77779' ? '直销银行系统':item.channelNo == '99992' ? '呼叫中心':item.channelNo == '99991' ? '微信银行':item.channelNo == '88881' ? '手机银行系统':item.channelNo == '77778' ? '成都分行财务系统交易虚拟行':item.channelNo == '66666' ? '测试机构':item.channelNo == '98998' ? '银企直连虚拟机构':item.channelNo == '98999' ? '无卡支付虚拟机构':item.channelNo == '88888' ? '测试':item.channelNo == '88886' ? '天天见面虚拟机构':item.channelNo == '55551' ? '非税代理':item.channelNo == '77701' ? '银企对账':item.channelNo == '10016' ? '发卡机':item.channelNo == '10002' ? '移动展业 ':item.channelNo == '88884' ? '国结虚拟机构':'无'}}
                </div></div> -->
                <div class="warp"><div class="fl">交易渠道</div><div class="fr">{{item.channelNo}}</div></div>

                <div class="warp"><div class="fl">摘要</div><div class="fr">{{item.mark}}</div></div>
            </li>
        </ul>

       <div v-if="nomarl" class="nomarl">~暂无交易明细~</div>

       <SnLoading v-if="pageLoading"></SnLoading>
    </div>
</template>
<script>
import moment from 'moment'
import { SnLoading } from 'components'
import {getServerData,setBusinessData,getBusinessData,getServerDataH5,formatNumber} from '../../handler/handler'
import { throttle, showToast, getUrlParams } from 'sslib/common/extend'
var urlParams = getUrlParams();
export default {
    data(){
        return{
            tradeType:0,
           //分页加载参数
            scroll:null,
            canAddpage: true,//翻页节流控制
            prepScrollTop: 0,//控制只能向下滚动
            loadingFlag: true,//loadingFlag加载中控制
            loadendFlag: false,//loadendFlag加载结束控制
            pageIndex: 0,//页数
            pageNum: 20,
            start:'',
            end:'',
            cardNum:'',
            list:[],
            pageLoading:false,
            nomarl:false
        }
    },
    created(){
        let _this = this
        let cardInfo = _this.$store.state.parms
        _this.start = _this.$route.query.startTime
        _this.end= _this.$route.query.endTime

        let startT= ''
        let endT= ''
        if(_this.$route.query.type !=2 || _this.$route.query.type == '' || _this.$route.query.type == undefined){
            startT =  _this.$route.query.startTime + ' '+ '00:00:01'
            endT =  _this.$route.query.endTime + ' '+ '23:59:00'
        }else{
            startT =  _this.$route.query.startTime
            endT =  _this.$route.query.endTime
        }
        
        // console.log(startT.replace(/\-/g,"/"))

        let data = {
            account: cardInfo.cardNumber,
            startTime: new Date(startT.replace(/\-/g,"/")).getTime()/1000,
            endTime: new Date(endT.replace(/\-/g,"/")).getTime()/1000, 
            phone:_this.$route.query.phone
        }
        _this.cardNum = formatNumber(data.account,6,4)
        _this.info = data
       _this.init(data)
    },
    components:{
        SnLoading
    },
    methods:{
        //数据初始化
        init(data){
            let _this = this;
            _this.pageLoading = true
            let tradeListJson = {
                ...data,
                type: _this.tradeType,
                cpyId:-1,
                orderType: 1,//按交易事件倒序
                paging: {
                    pageIndex: _this.pageIndex,
                    pageNum: _this.pageNum
                }
            };
            // console.log(tradeListJson)
            getServerDataH5('/yqt/accountmgr/accountMgr.queryAccountTradeList',tradeListJson,'POST',true).then(res=>{
                console.log('------------',res)
                if(res.tradeList.length ==0){
                    _this.nomarl = true
                }
                _this.list = res.tradeList
                _this.pageLoading = false
            })
            // _this.userLogin();
        },
        parseISOLocal (s) {
            var b = s.split(/\D/);
            return new Date(b[0], b[1]-1, b[2]);

        },
        scrollToEnd(scroll){
            this.scroll = scroll;
            console.log("下拉到最底下");
        },
        setScroll(scroll){
            this.scroll = scroll;
            console.log("scroll创建成功");
        },
        scroll(pos){
            console.log(pos);//监听滚动坐标
        },
        beforeScroll(){
            console.log('滚动之前');
        }
    }
}
</script>
<style lang="less" scoped>
    .nomarl{margin: 50px 20px;font-size: 15px;text-align: center;color:#999}
    .card-list{
        margin: 10px;
        .cardinfo{
            background-color: #EB4633;color: #fff;padding: 10px 15px;border-radius:6px;
            .li{
                display: flex;
                padding: 5px 0;
                font-size: 15px;
                .fl{flex: 1;}
                .fr{flex: 3;}
            }
        }
        .ul{
            li{
                background-color: #fff;
                padding: 10px 15px;
                border-radius: 6px;
                margin: 10px 0;
                overflow: hidden;
                .warp{
                    display: flex;
                    padding: 5px 0;
                    font-size: 15px;
                    .fl{
                        width: 30%;
                        color: #999;
                    }
                    .fr{
                        width: 70%;
                    }
                }
            }
        }
    }
</style>
