<template>
  <div style="overflow: hidden;">
      <group>
        <SnInput title="SnInput" type='text' placeholder="SnInput" maxlength=13 v-model='SnInputValue' @focus='SnInputFocus'></SnInput>
        <x-input title="" v-model="SnInputValue1" placeholder="请输入内容"></x-input>
        <x-input title="请输入内容" v-model="SnInputValue1" placeholder="请输入内容"></x-input>
        <x-input title="SnInput组件测试长度换行" v-model="SnInputValue" placeholder="请输入内容"></x-input>
        <x-input title="请假天数" v-model="SnInputValue1" placeholder="请输入请假天数" placeholder-align='right' text-align='left'></x-input>
        <x-input title="请假事由" v-model="SnInputValue1" placeholder="请输入请假的理由" placeholder-align='right' text-align='right' :max='13'></x-input>

        <x-textarea title="请假理由" v-model="SnInputValue2" :autosize=true placeholder="请输入请假的理由"></x-textarea>

        <!-- <SnTextarea title="SnTextarea" placeholder="SnTextarea" rows='3' maxlength=133 v-model='SnTextareaValue' @focus='SnTextareaFocus'></SnTextarea> -->
        <SnXTextarea title="SnXTextarea" placeholder="SnXTextarea"  v-model='SnTextareaValue'></SnXTextarea>

      </group>
  </div>
</template>

<script>
import { SnInput,SnTextarea,SnXTextarea } from 'components/index.js';
import {Group,Cell,XInput,XTextarea} from 'vux';
export default {
  components: {
      Group,
      SnInput,
      SnTextarea,
      SnXTextarea,
      XInput,
      XTextarea,
  },
  data() {
    return {
      SnInputValue: 'SnInput',
      SnInputValue1:'',
      SnInputValue2:'请输入请假的理由请输入请假的理由请输入请假的理由请输入请假的理由请输入请假的理由请输入请假的理由请输入请假的理由请输入请假的理由',
      SnTextareaValue:'',
    };
  },
  beforeCreate: function() {},
  created() {
    let _this = this;
  },
  mounted() {},
  methods: {
    SnInputFocus(val) {
        console.log(val)
    },
    SnTextareaFocus(val) {
        console.log(val)
    },
  }
};
</script>