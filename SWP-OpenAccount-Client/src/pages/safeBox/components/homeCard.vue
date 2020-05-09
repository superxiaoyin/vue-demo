<template>
  <div>
    <div :class="`templet-nopay ${isGrey?'cb':''}`"  @click="pay">
      <div class="templet-title">
        <span class="number t20">订单编号:{{123456789}}</span>
        <span class="state t20">
          <span class="price">￥{{6666}}</span>
          <span class="payType">{{typeMsg==="全部"?'quanbu':typeMsg}}</span>
        </span>
      </div>

      <div class="templet-content">
        <div :class="`content-left ${isGrey?'cb':''}`">
          <span><span class="fb">保管箱规格:</span> {{'大'}}</span>
          <span><span class="fb">保管箱租用时间:</span>{{'2020/03/01'}}</span>
          <span><span class="fb">保管箱到期时间:</span>{{'2020/03/01'}}</span>
        </div>
        <div class="content-right">
          <span class="topBtnOne" @click.stop="searchInfo(!isGrey?'renewal':'')">
          <div :class="`btnSearchOne w50 mt3 ${!isGrey?'backColoRed':''}` ">续租</div>
          </span>
          <span class="topBtnOne" @click.stop="searchInfo(!isGrey?'rentWithDraw':'')">
          <div class="btnSearchOne w50 mt3">退租</div>
          </span>
        </div>
      </div>
    </div>

    <!-- 退租弹框 -->
    <SnModal
      v-if="rentWithDraw.showOneBtnPop"
      @SnConfirmPopOnly="rentWithDrawModel"
      :btnType="rentWithDraw.btnType"
      :title="rentWithDraw.title"
      :content="rentWithDraw.content"
      :shadowColor="rentWithDraw.shadowColor"
      :btnConfirmOne="'确定'"
    ></SnModal>
  </div>
</template>

<script>
import { openRouterByValue } from "../../handler/handler";
import { SnModal } from "components/index.js";
export default {
  name:'homeCard',
  components: {
    SnModal,
  },
  props: {
    typeMsg: {
      type: String,
    }
  },
  data(){
    return{
    isGrey:false,
    rentWithDraw: {
      showOneBtnPop: false,
      btnType: "one",
      title: "提示",
      content:"尊敬的客户，因退租业务请在线下办理。办理地址:四川省泸州市江阳区红叶大道336号,业务联系电话：125458756412",
      shadowColor: "rgba(0, 0, 0, .5)"
    },
  }
  },
  created(){
    if(this.typeMsg==='未支付'){
      this.isShow=true
    }else if(this.typeMsg==='已退租'){
      this.isGrey=true;
    }
  },
  methods:{
    pay(){
      let _this = this;
      openRouterByValue("safeBoxInfo", "", _this);
    },
    searchInfo(info) {
      let _this = this;
      if(info){
        if (info === "renewal") {
          this.typeMsg === '已到期'? (_this.rentWithDraw.showOneBtnPop = true):( openRouterByValue("rentWithDraw", "", _this));
        } else if (info === "rentWithDraw") {
          _this.rentWithDraw.showOneBtnPop = true;
        }
      }
    },
    rentWithDrawModel() {
      let _this = this;
      _this.rentWithDraw.showOneBtnPop = false;
    },
  }
}
</script>

<style lang='less'>
.templet-nopay {
  position: relative;
  height: 3.5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
    .cb {
      color: #bbbbbb;
    }
  .templet-title {
    margin: 0 auto;
    padding: 0.06rem 0.3rem 0 0.3rem;
    height: 0.6rem;
    width: 94%;
    border-radius: 0.1rem 0.1rem 0 0;
    border-bottom: none;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: #ffffff;
    .number {
      font-size: 0.2rem;
      margin-right: 1rem;
      color: #bbbbbb;
    }
    .price {
      margin-right: 0.2rem;
      font-size: 0.2rem;
      color: #bbbbbb;
    }
    .payType {
      font-size: 0.2rem;
      height: 100%;
      width: 1.2rem;
      text-align: center;
      color: #bbbbbb;
    }
    .state {
      width: 2.3rem;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
    }
    .t20 {
      position: relative;
      top: 30%;
    }
  }
  .templet-content {
    background-color: #ffffff;
    margin: 0 auto;
    border-top: 1px solid rgba(209, 209, 209, 0.3);
    height: 2.8rem;
    width: 94%;
    border-radius: 0 0 0.1rem 0.1rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .content-left {
      padding-left: 0.2rem;
      height: 100%;
      width: 5rem;
      font-size: 0.25rem;
      display: flex;
      flex-direction: column;
      line-height: 0.85rem;
      padding-left: 0.3rem;
      padding-top: 0.1rem;
      .fb {
        font-weight: bold !important;
      }
    }
    .content-right {
      height: 100%;
      width: 2rem;
    }
  }
.w50 {
  width: 54%;
}
.mt3 {
  margin-top: 0.3rem;
}
.backColoRed {
  background: linear-gradient(132deg,rgba(255, 134, 109, 1) 0%,rgba(250, 65, 143, 1) 100%) !important;
}
.backColoRed:active {
  background: linear-gradient(132deg,rgba(255, 209, 200, 1) 0%,rgba(243, 117, 170, 1) 100%) !important;
}
.topBtnOne {
  flex: 0 0 1.5rem;
  font-size: 0.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  .btnSearchOne {
    background: linear-gradient(132deg,rgba(207, 207, 207, 1),rgba(209, 209, 209, 1) 100%);
    margin-top: 0.54rem;
    margin-bottom: 0.06rem;
    // @color-blue
    height: 0.54rem;
    line-height: 0.54rem;
    text-align: center;
    border-radius: 0.06rem;
    color: #fff;
    cursor: pointer;
    &:active {
      background: linear-gradient(132deg,rgba(255, 255, 255, 1),rgb(226, 226, 226, 1) 100%);
      //  @color-blue-press
    }
  }
}
}
</style>
