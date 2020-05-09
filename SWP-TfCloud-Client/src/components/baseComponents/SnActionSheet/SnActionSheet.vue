<template>
  <div class="sn-action-sheet-item">
    <transition name="sn-actionsheet-mask">
      <div class="sn-mask" @click="onClickingMask" v-show="open"></div>
    </transition>
    <transition
      name="fade"
      @after-enter="$emit('on-after-show')"
      @after-leave="$emit('on-after-hide')"
    >
      <div class="actionsheet" v-show="open">
        <!-- 辅助性说明 -->
        <div v-if="descriptionText" class="description">{{descriptionText}}</div>
        <ul>
          <li
            v-for="(item,index) in menu"
            :key="index"
            :class="{active:clickIndex===index,[`sn-actionsheet-menu-${item.type || 'default'}`]:true}"
            @click.stop="showMenuItem(index,item)"
          >{{item.label+item.id+'元'}}</li>
        </ul>
        <!-- 操作按钮 -->
        <div v-if="showCancel" class="operation">
          <div class="opacity"></div>
          <div class="cancleBtn" @click="cancleFun">{{cancelText}}</div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import "./SnActionSheet.less";
export default {
  name: "actionsheet",
  components: {},
  props: {
    value: Boolean,
    //渲染显示的字段
    label:{
      type:String,
      default:'label'
    },
    //是否显示取消按钮
    showCancel: Boolean,

    //取消按钮的别名
    cancelText: {
      type: String,
      default: "取消"
    },

    //辅助说明文字
    descriptionText: String,

    //渲染的数据array
    menu: {
      type: Array,
      default: () => ({})
    },

    //点击mask是否隐藏actionsheet
    closeOnClickingMask: {
      type: Boolean,
      default: true
    },

    //点击menuItem是否隐藏actionsheet
    closeOnClickingMenu: {
      type: Boolean,
      default: true
    },

    //选择menuItem是否显示选中的效果
    showSelectedEffect: {
      type: Boolean,
      default: false
    },

    //判断是否时选中的label
    titleLabel:String
  },
  data() {
    return {
      open: false,
      clickIndex: -1
    };
  },
  watch: {
    open(val) {
      this.$emit("input", val);
    },
    value: {
      handler: function(val) {
        this.open = val;
        if(val){
          //如果是true判断
          let index = this.menu.findIndex((value)=>{
            return value[this.label] === this.titleLabel
          })
          this.clickIndex = index
        }
      },
      immediate: true
    }
  },
  methods: {
    cancleFun() {
      this.$emit("on-click-menu-cancel");
    },
    onClickingMask() {
      if (this.closeOnClickingMask) {
        this.$emit("on-click-menu-cancel");
      }
    },
    showMenuItem(index, item) {
      if (this.showSelectedEffect ) {
        this.clickIndex = index;
      }

      this.$emit("on-click-menu", index, item);

      
        if (this.closeOnClickingMenu) {
          setTimeout(() => {
            this.$emit("on-click-menu-cancel");
            this.clickIndex = -1;
          }, 50);
        }
      
    }
  }
};
</script>

