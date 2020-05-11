<template>
  <div class="modal-box">
    <div class="shadow" :style="'background:' + shadowColor + ''"></div>
    <div class="sn-modal">
      <div v-if="title" class="sn-modal-title">{{title}}</div>
      <div class="sn-modal-content">
        {{content}}
        <input v-if="showPrompt" v-model="promptContent" class="input-prompt" :placeholder="placeholderContent" type="text">
        <slot name="descriptionContent"></slot>
      </div>
      <div class="sn-modal-footer" v-if="btnType ==='one'">
        <div class="sn-confirm-only" @click="confirmPopOnly">{{btnConfirmOne}}</div>
      </div>
      <div class="sn-modal-footer" v-if="btnType ==='two'">
        <div class="sn-cancle" @click="canclePop">{{btnText.btnCancle}}</div>
        <div class="sn-confirm" @click="confirmPop">{{btnText.btnconfirm}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import "./SnModal.less";
export default {
  data(){
    return {
      promptContent:''
    }
  },
  props: {
    // input placeholder内容
    placeholderContent:{
      type:String,
      default:'请输入...'
    },

    // 是否显示Prompt
    showPrompt:Boolean,

    //标题
    title: {
      type: String
    },

    //内容
    content: String,

    //底部显示的按钮
    btnType: {
      type: String,
      default: "two"
    },

    //弹窗的蒙层阴影
    shadowColor: {
      type: String,
      default: "rgba(0, 0, 0, .3)"
    },

    //一个按钮时按钮的text
    btnConfirmOne: {
      type: String,
      default: "我知道了"
    },

    //两个按钮时 按钮的text
    btnText: {
      type: Object,
      default: function() {
        return { btnCancle: "取消", btnconfirm: "确定" };
      }
    }
  },
  methods: {
    canclePop() {
      this.$emit("SnCanclePop");
    },
    confirmPop() {
      this.$emit("SnConfirmPop",this.promptContent);      
    },
    confirmPopOnly() {
      this.$emit("SnConfirmPopOnly");
    }
  }
};
</script>