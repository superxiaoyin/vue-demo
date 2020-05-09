'use strict'
// 银行前端主题配置文件
// 输入 entry，输出 output
module.exports = {
    default: {
        entry: { //输入
            src_dir: '../bankConfig/bank/default/img',
            style_dir: '../bankConfig/bank/default/style',
            components_style: '../bankConfig/bank/default/compstyle',
            biscomponents_img:'../bankConfig/bank/default/compimg'
        },
        output: { //输出
            src_dir: '../src/resource/img', //图片资源文件夹
            style_dir: '../src/style', //项目内样式文件夹,目前暂无
            components_style: '../src/components/style', //全局样式文件夹
            biscomponents_img:'../src/components/bisComponents/resource/img'
        }
    },
    beijing: {
        entry: {
            src_dir: '../bankConfig/bank/beijing/img',
            style_dir: '../bankConfig/bank/beijing/style',
            components_style: '../bankConfig/bank/beijing/compstyle'
        },
        output: {
            src_dir: '../src/resource/img',
            style_dir: '../src/style', 
            components_style: '../src/components/style'
        }
    },
    ganshu: {
        entry: {
            src_dir: '../bankConfig/bank/ganshu/img',
            style_dir: '../bankConfig/bank/ganshu/style',
            components_style: '../bankConfig/bank/ganshu/compstyle',
            biscomponents_img:'../bankConfig/bank/ganshu/compimg'
        },
        output: {
            src_dir: '../src/resource/img', 
            style_dir: '../src/style', 
            components_style: '../src/components/style',
            biscomponents_img:'../src/components/bisComponents/resource/img'
        }
    },
}