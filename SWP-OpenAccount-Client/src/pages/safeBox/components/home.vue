<template>
  <div class="buyconfirm-warp">
    
    <tab custom-bar-width="60px">
      <tab-item selected @on-item-click="tabs">全部</tab-item>
      <tab-item @on-item-click="tabs">支付成功</tab-item>
      <tab-item @on-item-click="tabs">使用中</tab-item>
      <tab-item @on-item-click="tabs">已到期</tab-item>
      <tab-item @on-item-click="tabs">已退租</tab-item>
    </tab>

    <SnSearch @searchInfo="searchBranch"></SnSearch>
    <SnLoading v-if="pageLoading"></SnLoading>
    
    <!-- 查询记录 -->
    <div v-show="tabid===0">
      <div class="emptyBox">
        <!-- 空状态 -->
        <SnEmpty v-show="isEmpty" icon="no-search"  class="snemty"></SnEmpty>
        <!-- 有数据 -->
        <HomeCard :typeMsg='"全部"'  v-show="!isEmpty"></HomeCard>
        <div class="footer button-on">
          <div class="btns" @click="next">租用保管箱</div>
        </div>
      </div>
    </div>

    <div v-show="tabid===1">
      <HomeCard :typeMsg='"支付成功"'></HomeCard>
    </div>

    <div v-show="tabid===2">
      <HomeCard :typeMsg='"使用中"'></HomeCard>
    </div>

    <div v-show="tabid===3">
      <HomeCard :typeMsg='"已到期"'></HomeCard>
    </div>

    <div v-show="tabid===4">
      <HomeCard :typeMsg='"已退租"'></HomeCard>
    </div>

  </div>
</template>

<script>
import { Tab, TabItem } from "vux";
import { SnModal, SnSearch, SnEmpty,SnLoading } from "components/index.js";
import { openRouterByValue ,getServerDataH5} from "../../handler/handler";
import HomeCard from './homeCard';

export default {
  name:'home',
  components: {
    SnSearch,
    SnEmpty,
    Tab,
    TabItem,
    SnModal,
    HomeCard,
    SnLoading
  },
  data() {
    return {
      typeMsg:'',
      tabid: 0,
      isEmpty: true,
      pageLoading:true,
    };
  },
  created(){
    this.init()
  
    setTimeout(()=>{
      this.pageLoading=false;
    },1000)
  },
  methods: {
    async init(){
      let _this=this;
      let param={
        queryboxTpye:1,
      }
      let result= await getServerDataH5(textUrl+'/qyt/savebox/buybox/findboxType',param,'POST')
      console.log(result)
      
    },
    pay() {
      let _this = this;
      openRouterByValue("safeBoxInfo", "", _this);
    },
    tabs(index) {
      let _this = this;
      _this.tabid = index;
      console.log("序号", index);
    },
    next() {
      let _this = this;
      openRouterByValue("handleRentIntroduce", "", _this);
    },
    searchBranch(keys) {
      console.log(keys, "value");
    },
  }
};
</script>

<style lang="less">
@import (reference) "~components/style/common";
@import "~vux/src/styles/1px.less";
.vux-tab .vux-tab-item.vux-tab-selected {
  color: #000 !important;
  font-weight: 400;
}
.vux-tab-bar-inner {
  background-color: #f5266f;
}
.sn-modal-content {
  text-align: center;
}
.buyconfirm-warp {
  .emptyBox {
    .snemty {
      position: relative;
      margin-top: 4rem;
    }
    .footer {
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 99;
      width: 100%;
      height: 1.12rem;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px -2px 8px 0px rgba(0, 0, 0, 0.06);
      padding: 7px 0.3rem 0;
      .btns {
        height: 0.8rem;
        line-height: 0.8rem;
        background: linear-gradient(132deg,rgba(255, 134, 109, 1) 0%,rgba(250, 65, 143, 1) 100%);
        border-radius: 40px;
        text-align: center;
        color: #fff;
        font-size: 0.32rem;
      }
    }
  }
  .topSearch .topBtn .btnSearch {
    width: 80%;
    margin-left: 20%;
  }
}

</style>