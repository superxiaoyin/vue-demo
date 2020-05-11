<template>
  <div>
    <div class="all-pops">
      <SnButton @SnButtonClick="commonPopShow" type="one">普通弹窗</SnButton>
      <SnButton @SnButtonClick="noTitlePopShow" type="one">不带title弹窗</SnButton>
      <SnButton @SnButtonClick="showOneBtnPopShow" type="one">底部单按钮弹窗</SnButton>
      <SnButton @SnButtonClick="showDescription" type="one">底部单按钮带描述内容</SnButton>
      <SnButton @SnButtonClick="showPrompt" type="one">显示input输入框</SnButton>
    </div>

    <!-- 普通弹窗 -->
    <SnModal
      v-if="commonPopObj.showCommonPop"
      @SnCanclePop="SnCanclePop"
      :title="commonPopObj.title"
      :content="commonPopObj.content"
      :shadowColor="commonPopObj.shadowColor"
    ></SnModal>

    <!-- 不带title弹窗 -->
    <SnModal
      v-if="noTitlePopObj.showNoTitlePop"
      @SnCanclePop="SnCanclePopNoTitle"
      :content="noTitlePopObj.content"
      :shadowColor="noTitlePopObj.shadowColor"
    ></SnModal>

    <!-- 底部单按钮弹窗 -->
    <SnModal
      v-if="onlyOneBtnPopObj.showOneBtnPop"
      @SnConfirmPopOnly="SnConfirmPopOnly"
      :btnType="onlyOneBtnPopObj.btnType"
      :title="onlyOneBtnPopObj.title"
      :content="onlyOneBtnPopObj.content"
      :shadowColor="onlyOneBtnPopObj.shadowColor"
    ></SnModal>

    <!-- 底部单按钮带描述内容 -->
    <SnModal
      v-if="descriptionBtnPopObj.showDescriptionPop"
      @SnConfirmPopOnly="SnConfirmPopOnly"
      :btnType="onlyOneBtnPopObj.btnType"
      :title="onlyOneBtnPopObj.title"
      :shadowColor="onlyOneBtnPopObj.shadowColor"
    >
      <div slot="descriptionContent" class="description_content">
        <p>1.姓名需与所持证件的姓名一致</p>
        <p>2.姓名中间不要输入空格或其他符号。</p>
        <p>3.少数民族的乘客，若需要购买火车票，需要输入姓名中的“·”,如“阿不都·买买提”；如需购买机票，可直接出入“阿卜杜买买提”。</p>
        <p>4.香港、台湾、澳门的护照不支持国内航班，请改用其他证件输入。</p>
      </div>
    </SnModal>


     <!-- 显示input输入框 -->
    <SnModal
      v-if="promptPopObj.showPromptPop"
      @SnCanclePop="SnCanclePop"
      @SnConfirmPop="confirmWithPrompt"
      :title="promptPopObj.title"
      :showPrompt="promptPopObj.showPrompt"
      :shadowColor="commonPopObj.shadowColor"
    ></SnModal>
    
  </div>
</template>

<script>
import { SnModal, SnButton } from "components/index.js";
export default {
  components: {
    SnModal,
    SnButton
  },
  data() {
    return {
      commonPopObj: {
        showCommonPop: false,
        title: "王者荣耀报告",
        content: "你认为王者荣耀里面的'小鲁班'输出强吗，是否，请回答？",
        shadowColor: "rgba(0, 0, 0, .2)"
      },
      noTitlePopObj: {
        showNoTitlePop: false,
        content: "你认为王者荣耀里面的'小鲁班'输出强吗，是否，请回答？",
        shadowColor: "rgba(0, 0, 0, .8)"
      },
      onlyOneBtnPopObj: {
        showOneBtnPop: false,
        btnType: "one",
        title: "填写姓名说明",
        content: "你认为王者荣耀里面的'小鲁班'输出强吗，是否，请回答？",
        shadowColor: "rgba(0, 0, 0, .5)"
      },
      descriptionBtnPopObj: {
        showDescriptionPop: false,
        btnType: "one",
        title: "填写姓名说明",
        content: "你认为王者荣耀里面的'小鲁班'输出强吗，是否，请回答？",
        shadowColor: "rgba(0, 0, 0, .5)"
      },
      promptPopObj: {
        showPromptPop: false,
        showPrompt:true,
        title: "王者荣耀报告",
        shadowColor: "rgba(0, 0, 0, .2)"
      },
    };
  },
  beforeCreate: function() {},
  created() {},
  mounted() {},
  methods: {
    commonPopShow() {
      this.commonPopObj.showCommonPop = true;
    },
    SnCanclePop() {
      this.commonPopObj.showCommonPop = false;
      this.promptPopObj.showPromptPop = false;
    },
    noTitlePopShow() {
      this.noTitlePopObj.showNoTitlePop = true;
    },
    SnCanclePopNoTitle() {
      this.noTitlePopObj.showNoTitlePop = false;
    },
    showOneBtnPopShow() {
      this.onlyOneBtnPopObj.showOneBtnPop = true;
    },
    SnConfirmPopOnly() {
      this.onlyOneBtnPopObj.showOneBtnPop = false;
      this.descriptionBtnPopObj.showDescriptionPop = false;
    },
    showDescription() {
      this.descriptionBtnPopObj.showDescriptionPop = true;
    },
    showPrompt(){
      this.promptPopObj.showPromptPop = true;
    },
    confirmWithPrompt(promptContent){
      this.promptPopObj.showPromptPop = false;
      console.log('promptContent',promptContent)
    }
  }
};
</script>
