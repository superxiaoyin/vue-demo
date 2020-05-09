/**
 * 通用校验器
 */
import Vue from 'vue';
import {getClass,isEmptyObject} from '../common/extend.js';
import {ToastPlugin} from 'vux';
Vue.use( ToastPlugin );


var CommonValidator = function(){
	
};


CommonValidator.prototype = {
	/**
	 * 非空
	 * @param {Object} value  验证的数据
	 */
	notEmpty:function(value){
		if ('Object'==getClass(value)&&!isEmptyObject(value)){//对象
			return true;
		}else if ('Array'==getClass(value)&&0<value.length){//数组
			return true;
		}else if (value.trim()){//其他数据
			return true;
		}
		return false;
	},
	/**
	 * 最小长度校验
	 * @param {Object} value  被校验值
	 * @param {Object} min    最小长度
	 */
	checkMinLength:function(value, min){
		return ((value+'').length >= min);
	}
}

export default new CommonValidator();