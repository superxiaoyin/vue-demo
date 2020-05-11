export default function () {
  return {
    // 左边标题文字
    title: [String, Number],
    // 右侧文字，复杂的样式布局请使用slot
    value: [String, Number, Array],
    // 点击链接，可以为http(s)协议，也可以是 vue-router 支持的地址形式
    isLink: Boolean,
    // 是否显示加载图标，适用于异步加载数据的场景
    isLoading: Boolean,

    // 标题下面文字，一般为说明文字
    inlineDesc: [String, Number],

    // 可选值为 ['title', 'content']，对应的div会加上weui_cell_primary类名实现内容宽度自适应
    primary: {
      type: String,
      default: 'title'
    },

    // 点击链接，可以为http(s)协议，也可以是 vue-router 支持的地址形式
    link: [String, Object],

    // 文字值对齐方式，可选值为 left right。当设为 right 时，primary 值将会设为 content
    valueAlign: [String, Boolean, Number],

    // 是否显示边框与左边的间隙
    borderIntent: {
      type: Boolean,
      default: true
    },

    // 对 label 和箭头(如果使用 is-link )显示不可操作样式
    disabled: Boolean,
    
    // 右侧箭头方向，可选有 up down
    arrowDirection: String, // down or up

    // align-items 样式值
    alignItems: {
      type:String,
      default:'center'
    },

    // 是否显示border false 显示  true 不显示
    noBorder:{
      type:Boolean,
      default:false
    },

    // 定制cellHeight 设置cell的高度 
    cellHeight:{
      type:String,
      default:'auto'
    },

    //定制value的字体颜色
    valueColor:{
      type:String,
      default:'#333'
    },

    //定制title的字体颜色
    titleColor:{
      type:String,
      default:'#666'
    },

    //定制title的宽度
    titleWidth:{
      type:String,
      default:'1.9rem'
    },

    
  }
}
