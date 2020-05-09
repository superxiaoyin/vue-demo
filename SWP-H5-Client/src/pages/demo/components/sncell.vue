<template>
  <div>
    <SnCell title="交易截止1" value="保护中" value-align='right' noBorder titleColor='blue'></SnCell>  
    <SnCell title="交易截sddsfsdf止2" value="保护中" value-align='right' is-link arrow-direction='down' disabled noBorder></SnCell>  
    <SnCell title="交易截sddsfsdf止2" value="保护中" value-align='right' arrow-direction='down' disabled noBorder></SnCell>  
    <SnCell title="交易截止3" value="保护中" value-align='right' primary='content' is-link @clickSnCell='clickSnCell' noBorder lineHeight='24px'></SnCell>  
    <SnCell title="交易截止4" value="保护中" value-align='right' is-link is-loading :borderIntent="false"  link='http://www.baidu.com' noBorder > </SnCell>  

    <div v-for="(item,index) in obj" :key="index">
      <SnCell :title="item.title" :value="item.value" is-link value-align='right' cellHeight='80px' valueColor='red' primary='content'></SnCell>  
    </div>

  </div>

  
</template>

<script>
import { SnCell } from "components/index.js";
export default {
  components: {
    SnCell
  },
  data() {
    return {
      obj:[
        {
          title:'是大家看法和恐惧的',
          value:'是和恐惧的'
        },
        {
          title:'是大家看法和恐惧的',
          value:'是和恐惧的'
        },
        {
          title:'是大家看法和恐惧的',
          value:'是和恐惧的'
        },
       
      ]
    };
  },
  beforeCreate: function() {},
  created() {},
  mounted() {},
  methods: {
      clickSnCell(item){
        console.log(item)
      }
  }
};
</script>
