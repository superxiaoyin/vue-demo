## 说明：

+ baseComponents文件夹是一些基础组件(所有项目的基础组件都放在这里)

+ bisComponents文件夹是一些业务组件(所有项目的业务组件都放在这里)

+ style文件夹是组件用到的基础样式

+ index是组件对外提供的按需加载的索引

+ map是组件说明和映射表


### 手册

+ components文件夹对外的软连接为
  components https://sz-its-svn-001.sino.sz/svn/TChat/YQT%20SW%201.0/Src/Web/Trunk/SWP-H5-Client/src/components

+ 所有项目共用这一份components（update和commit）

+ 项目对应的基础组件和业务组件放到对应的文件夹

+ 在index.js写好对应的索引

+ 所有项目引用index.js就可以了，需要什么组件直接import


### 引用说明

+ 1、import { SnLoading, SnInput } from 'components/index.js';

+ 2、components: {SnLoading, SnInput}

+ 3、<SnLoading message="SnLoading"></SnLoading>
	<SnInput title="SnInput" type='text' placeholder="SnInput" maxlength=13 v-model='SnInputValue' @focus='SnInputFocus'></SnInput>


	具体操作参考   pages/transfer/transfer.vue页面
	
	
##TODO LIST

##日历组件
####1.PC响应式拉伸样式问题
####2.目前日历组件不符合PC使用习惯（切换月份）
- 日历组件目前替换已完成 20190423 by 钟正

##表格组件

##下拉框组件，带清除功能的 

