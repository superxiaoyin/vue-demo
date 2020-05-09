<template>
  <div
    class="sn-cell" 
    :class="{
      'vux-tap-active': isLink || !!link,
      'weui-cell_access': isLink || !!link,
      'vux-cell-no-border-intent': !borderIntent,
      'sn-cell-disabled': disabled,
      'sn-border':noBorder
    }"
    :style="style"
    @click="onClick">
    <div class="weui-cell__hd">
      <slot name="icon"></slot>
    </div>
    <div class="vux-cell-bd" :class="{'vux-cell-primary': primary === 'title' && valueAlign !== 'left'}">
      <p>
        <label class="sn-cell-label" v-if="title || hasTitleSlot" :style='titleStyle'>
          <slot name="title">{{ title }}</slot>
        </label>
        <slot name="after-title"></slot>
      </p>
      <inline-desc>
        <slot name="inline-desc">{{ inlineDesc }}</slot>
      </inline-desc>
    </div>
    <div class="sn-cell__ft" :style="valueStyle" :class="valueClass">
      <slot name="value"></slot>
      <slot>{{ value }}</slot>
      <v-no-ssr>
        <i class="weui-loading" v-if="isLoading"></i>
      </v-no-ssr>
    </div>
    <slot name="child"></slot>
  </div>
</template>

<script>
import InlineDesc from './inlineDesc'
import { go } from './libs/router'
import props from './props'


export default {
  name: 'cell',
  components: {
    InlineDesc
  },
  props: props(),
  created () {
    /* istanbul ignore if */
    if (typeof SUPPORT_SSR_TAG === 'undefined' && process.env.NODE_ENV === 'development') {
      console.warn('[VUX] 抱歉，当前组件[cell]要求更新依赖 vux-loader@latest')
    }
  },
  beforeMount () {
    this.hasTitleSlot = !!this.$slots.title
    /* istanbul ignore if */
    if (this.$slots.value && process.env.NODE_ENV === 'development') {
      console.warn('[VUX] [cell] slot=value 已经废弃，请使用默认 slot 替代')
    }
  },
  computed: {
    valueStyle(){
      if(this.valueColor){
        return {
            'color': this.valueColor
        }
      }
    },
    titleStyle(){
      if(this.titleColor||this.titleWidth){
        return {
            'color': this.titleColor,
            'width': this.titleWidth
        }
      }
    },
    valueClass () {
      return {
        'vux-cell-primary': this.primary === 'content' || this.valueAlign === 'left',
        'vux-cell-align-left': this.valueAlign === 'left',
        'vux-cell-arrow-transition': !!this.arrowDirection,
        'vux-cell-arrow-up': this.arrowDirection === 'up',
        'vux-cell-arrow-down': this.arrowDirection === 'down'
      }
    },
    style () {
      if (this.alignItems||this.cellHeight) {
        return {
          'alignItems': this.alignItems,
          'height':this.cellHeight
        }
      }
    }
  },
  methods: {
    onClick () {
      /* istanbul ignore next */
      if(!this.disabled){
        if(this.link){
          go(this.link, this.$router)
        }else{
          this.$emit('clickSnCell',this.title)
        }
      }
    }
  },
  data () {
    return {
      hasTitleSlot: true,
      hasMounted: false
    }
  }
} 
</script>

<style scoped lang="less">
@import './styles/variable.less';
@import './styles/tap.less';
@import './styles/setArrow.less';
@import './styles/weui_cell_global.less';
@import './styles/weui-loading.less';

@media screen and (min-width: 480px){
    div.sn-cell {
        padding: 3.5px 15px;
    }
 
    .sn-cell .sn-cell__ft{
      font-size: 14px !important;
    }
}
@media screen and (max-width: 480px){
    div.sn-cell {
        padding: 0.1rem 0.3rem;
    }

    .sn-cell .sn-cell__ft{
      font-size: 0.32rem !important;
    }
}
label.sn-cell-label {
    line-height: 1.5
}
.sn-cell .sn-cell-label{
    color: #666;
    width: 1.9rem;
}
.sn-cell.sn-border:before{
    display: none;
}

.vux-cell-primary {
  flex: 1;
}
.sn-cell-label {
  display: inline-block;
  word-wrap: break-word;
  word-break: break-all;
}
.sn-cell__ft .weui-loading {
  display: inline-block;
}
.sn-cell__ft.vux-cell-align-left {
  text-align: left;
}
.sn-cell.vux-cell-no-border-intent:before {
  left: 0;
}
.weui-cell_access .sn-cell__ft.vux-cell-arrow-down:after {
  transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(90deg);
}
.weui-cell_access .sn-cell__ft.vux-cell-arrow-up:after {
  transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(-90deg);
}
.vux-cell-arrow-transition:after {
  transition: transform 300ms;
}
.sn-cell-disabled {
  .sn-cell-label {
    color: #b2b2b2;
  }
  &.weui-cell_access .sn-cell__ft:after {
    border-color: @cell-disabled-arrow-color;
  }
}
.weui-cell_access .sn-cell__ft:after {
    content: " ";
    display: inline-block;
    height: 6px;
    width: 6px;
    border-width: 2px 2px 0 0;
    border-color: #C8C8CD;
    border-style: solid;
    -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) translateY(-50%);
    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) translateY(-50%);
    top: -2px;
    position: absolute;
    top: 50%;
    right: 2px;
}
.weui-cell_access .sn-cell__ft{
  position: relative;
  padding-right: 13px;
}
</style>
