<template>
    <div class="card-list">
        <group>
            <popup-picker title="账号" value-text-align='left' :data="cardlist" v-model="cardData" @on-show="onShow" @on-hide="onHide" @on-change="onChange"></popup-picker>
            <cell title="币种" value="人民币" value-align='left'></cell>
            <datetime title="起始日期" value-text-align='left' :start-date="statDate1" :end-date="noDate" v-model="statDate"></datetime>
            <datetime title="终止日期" value-text-align='left' :start-date="statDate2" :end-date="noDate" v-model="endDate"></datetime>
        </group>
        <p class="notes">*查询期限默认为一年</p>
        <SnButton @SnButtonClick="nextStep">查询</SnButton>

        <div class="text">
            <div class="li" @click="toinfo(1)">今日明细</div>|
            <div class="li" @click="toinfo(7)">一周明细</div>
        </div>
    </div>
</template>
<script>
import { Cell, Group,Datetime, PopupPicker,Picker } from 'vux'
import { SnButton } from 'components'
import {getServerData,setBusinessData,getBusinessData,getServerDataH5,openRouterByValue,formatNumber} from '../../handler/handler'
import { throttle, showToast, getUrlParams } from 'sslib/common/extend'
var urlParams = getUrlParams();
export default {
    data(){
        return{
            cardData:[],
            cardlist:[[]],
            statDate:'',
            endDate:'',
            userinfo:{},
            card:{},
            begin:6,
            end:4,
            car:'',
            step:2,
            statDate1:'',
            statDate2:'',
            noDate:new Date()
        }
    },
    created(){
        let _this = this;
    
        let card = this.$store.state.parms
        let userinfo = this.$store.state.userInfo

        _this.phone = userinfo.userPhone
        _this.userinfo = userinfo
        _this.card = card
        _this.car = card.cardNumber
        _this.cardData.push(formatNumber(card.cardNumber,_this.begin,_this.end))
        _this.cardlist[0].push(formatNumber(card.cardNumber,_this.begin,_this.end))
        _this.uaId = _this.userinfo.UAId

       _this.endDate =  _this.getDate(0);
       _this.statDate1 =  _this.getDate(-365);
       _this.statDate2 =  _this.getDate(-365);
       _this.statDate =  _this.getDate(-365);

       _this.init()
       _this.queryCardList()
    },
    components:{
      Cell, Group,Datetime, PopupPicker,Picker,SnButton
    },
    methods:{
        //数据初始化
        init(){
            let _this = this;
            // _this.userLogin();
        },

        async queryCardList(){
            let _this = this;
            const data = {
                UAId:_this.uaId,
                phone:_this.phone,
                cpyId:-1,
                validityCheck: 1,
            }
            try {
                const result = await getServerDataH5('/yqt/salaryCard/salaryCard.queryCardList',data,'POST',true);
                if(result.code === 0){
                    let datas = result.cardList
                    let arr = []
                    for(let i=0;i<datas.length;i++){
                        if(datas[i].cardNumber != _this.cardData[0]){
                            arr.push(formatNumber(datas[i].cardNumber,_this.begin,_this.end))
                        }
                    }
                    _this.cardlist[[..._this.cardlist,...arr]]

                }else{
                    showToast(result.rdesc);
                }
            } catch (error) {
                console.log(error);
            }
        },
         onShow () {
            console.log('on show')
        },
        onHide (type) {
            console.log('on hide', type)
        },
        onChange (val) {
            this.cardData = val
            console.log('val change', val)
        },
        getDate(day) {
            var today = new Date();
            var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;
            today.setTime(targetday_milliseconds); //注意，这行是关键代码
            var tYear = today.getFullYear();
            var tMonth = today.getMonth();
            var tDate = today.getDate();
            tMonth = this.doHandleMonth(tMonth + 1);
            tDate = this.doHandleMonth(tDate);
            return tYear+"-"+tMonth+"-"+tDate;      
        },
        doHandleMonth(month){
            var m = month;
            if(month.toString().length == 1){
                m = "0" + month;
            }
            return m;
        },
        nextStep(){
            if(this.isDate(this.statDate,this.endDate)){
                let data = {
                    account: this.cardData[0],
                    startTime: this.statDate,
                    endTime: this.endDate,
                    phone:this.phone
                }
                openRouterByValue('record',data,this);
            }
            
        },
        isDate(startTime,endTime){
            var startTime = new Date(startTime);
            var endTime = new Date(endTime);
            if(endTime.getTime() < startTime.getTime()){
                showToast('终止日期不能小于起始日期')
                return false
            }
            return true
        },
        timestampToTime(timestamp) {
            var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            var D = date.getDate() + ' ';
            var h = date.getHours() + ':';
            var m = date.getMinutes() + ':';
            var s = date.getSeconds();
            return Y+M+D+h+m+s;
        },
        toinfo(n){
            let _this = this
            let startTime = ''
            let endTime = ''
            let type = ''
            if(n == 1){
                let now = new Date(new Date().toLocaleDateString()).getTime()
                let now1 = new Date().getTime()
                startTime= _this.timestampToTime(now)
                endTime= _this.timestampToTime(now1)
                type = 2
            }else{
                startTime= _this.getDate(-7)
                endTime= _this.getDate(0)
                type = ''
            }

            let data = {
                account: _this.cardData[0],
                startTime:startTime,
                endTime: endTime,
                phone:_this.phone,
                type:type
            }
            // console.log(data)
            openRouterByValue('record',data,this);
        }
    }
}
</script>
<style lang="less">
    // @import '~components/style/common.less';
    .weui-cell{padding: 15px 15px !important;
        .vux-label,.weui-label{font-size: 18px !important;width: 90px !important;}
        .weui-cell__ft{font-size: 16px;}
    }
    .vux-cell-value{color: #3891FF;}
    .vux-datetime{p{font-size: 18px;color: #666;width: 90px;}}
    .text{
        text-align: center;
        display: flex;
        justify-content:center;
        color: #ccc;
        .li{
            font-size: 15px;
            color: #999;
            padding: 0 20px;
        }
    }
    .notes{
        font-size:12px;
        color: #999;
        margin: 10px;
    }
    .sn-button button{
        margin: 10px;
        height: 44px;
        line-height: 44px;
        font-size: 16px !important;
    }
    .vux-popup-header-right{
        color: #EB4633;
    }
</style>
