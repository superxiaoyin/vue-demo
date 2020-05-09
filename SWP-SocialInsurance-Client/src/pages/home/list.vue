<template>
<div>

    <div>
    	<divider> 本地测试 LIST</divider>
		<group title="List">
			<cell v-for="el in list" :key="el.id" :title="el.name" value="" is-link :link="el.url"></cell>
		</group>

	</div>


</div>
</template>

<script>
import { Cell,Group,Divider } from 'vux'
export default {
  data() {
    return {
		list:[{
			'id':0,
            'name':'page/index',
            'url':'../index/index.html'
		},{
			'id':1,
			'name':'page/index',
			'url':'../index/index.html'
		},{
			'id':2,
            'name':'page/index',
            'url':'../index/index.html'
		}]
    }
  },
  components: {
	Cell,Group,Divider	
  },
  mounted(){

  },

  methods: {

  }
}
</script>

<style lang="less">

.weui-cells{
font-size: 14px!important;	
}


</style>
