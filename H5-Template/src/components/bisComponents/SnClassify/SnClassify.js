/**
 * 费用报销归类
 */
$.fn.tree = function(arrData, clickCb) {
	var $root = $(this);
	var genNode = function($parent, nodeData, level) {
		$parent = $parent || $root;
		var $node = $(
				'<div class="node">' + '<div class="expand"></div>'
						+ '<div class="node-check"></div>' + '<div class="text">'
						+ nodeData.value + '</div>' + '</div>').appendTo(
				$parent).data('node', nodeData);
		if (nodeData.sub && nodeData.sub.length > 0) {
			var $children = $('<div class="children"></div>').appendTo($node);
			// 只展开一级节点的子节点
			// if (level == 1) {
			// $node.children('.expand').addClass('sub on');
			// } else {
				$node.children('.expand').addClass('sub');
				$children.hide();
			// }
			$.each(nodeData.sub, function(index, item) {
				genNode($children, item, level + 1);
			});
		}
	}
	// 生成UI
	$.each(arrData, function(index, item) {
		genNode(null, item, 1)
	});
	// 绑定事件
	// 展开/折叠
	$('.expand.sub', this).on(
			'click',
			function() {
				$(this).is('.on') ? $(this).siblings('.children').fadeOut()
						: $(this).siblings('.children').fadeIn();
				$(this).toggleClass('on');
			});
	// 选择节点
	var onClick = function(noCb) {
		$root.find('.node-check.on').removeClass('on');
		$(this).addClass('on');
		var node = $(this).parent().data('node');
		$root.data('value', node);
		if(node && noCb !== true){
			clickCb && clickCb.call(this, node)
		}
	}
	$('.node-check', $root).click(onClick);
	
	 return {
         getValue: function(){
        	 return $root.data('value');
         },
         setValue: function(value){
             $root.find('.node').each(function(index, item){
            	 var nodeData = $(item).data('node');
            	 if(nodeData.id == value){
            		 onClick.call($(item).children('.node-check'), true);
            		 $(item).parent().siblings('.expand').addClass('sub on');
            		 $(item).parent().show();
            	 }
             });
         },
         init: function(){
        	 $root.find('.children').hide();
    		 $root.find('.node-check.on, .expand.on').removeClass('on');
    		 $root.data('value', undefined);	 
         }
     }
}
// 个人费用
window.treedata =  [ {
	id: 1, value : '工资'
}, {
	id: 2, value : '社保',
	sub : [ {
		id: 3, value : '养老保险'
	}, {
		id: 4, value : '医疗保险'
	}, {
		id: 5, value : '失业保险'
	}, {
		id: 6, value : '工伤保险'
	}, {
		id: 7, value : '生育保险'
	} ]
}, {
	id: 8, value : '住房公积金'
}, {
	id: 9, value : '福利费',
	sub : [ {
		id: 10, value : '误餐'
	}, {
		id: 11, value : '部门活动'
	} ]
}, {
	id: 12, value : '差旅费',
	sub : [ {
		id: 13, value : '飞机'
	}, {
		id: 14, value : '其他长途交通'
	}, {
		id: 15, value : '市内交通'
	}, {
		id: 16, value : '住宿'
	}, {
		id: 17, value : '办公'
	}, {
		id: 18, value : '出差补助'
	}, {
		id: 19, value : '租房'
	}, {
		id: 20, value : '其他差旅费用'
	} ]
}, {
	id: 21, value : '办公费',
	sub : [ {
		id: 22, value : '办公费办公用品'
	}, {
		id: 23, value : '快递'
	}, {
		id: 24, value : '水电管理费'
	} ]
}, {
	id: 25, value : '业务招待费',
}, {
	id: 26, value : '广告宣传费',
	sub : [ {
		id: 27, value : '广告'
	}, {
		id: 28, value : '宣传'
	} ]
}, {
	id: 29, value : '通讯费',
	sub : [ {
		id: 30, value : '手机'
	}, {
		id: 31, value : '上网'
	}, {
		id: 32, value : '固定电话'
	} ]
}, {
	id: 33, value : '交通',
	sub : [ {
		id: 34, value : '公共交通'
	}, {
		id: 35, value : '其他交通费'
	} ]
}, {
	id: 36, value : '培训会务费',
	sub : [ {
		id: 37, value : '培训'
	}, {
		id: 38, value : '会务'
	} ]
}, {
	id: 39, value : '研究开发费',
	sub : [ {
		id: 40, value : '物料领用'
	}, {
		id: 41, value : '外购物料'
	}, {
		id: 42, value : '外购软件'
	}, {
		id: 43, value : '设备购买'
	}, {
		id: 44, value : '模具费'
	}, {
		id: 45, value : '设计费'
	}, {
		id: 46, value : '试产费'
	}, {
		id: 47, value : '评测登记费'
	}, {
		id: 48, value : '专利费'
	}, {
		id: 49, value : '外包费'
	} ]
}, {
	id: 50, value : '工程维护费',
	sub : [ {
		id: 51, value : '测试用机'
	}, {
		id: 52, value : '其他领用'
	} ]
} , {
	id: 53, value : '各项税费',
	sub : [ {
		id: 54, value : '印花税'
	}, {
		id: 55, value : '房产税'
	}, {
		id: 56, value : '车船使用税'
	}, {
		id: 57, value : '城镇土地使用税'
	}, {
		id: 58, value : '堤围费'
	}, {
		id: 59, value : '其他'
	}, ]
}, {
	id: 60, value : '房租水电管理费',
	sub : [ {
		id: 61, value : '物管费'
	}, {
		id: 62, value : '电费'
	}, {
		id: 63, value : '水,加压及排污费'
	}, {
		id: 64, value : '房租'
	}, {
		id: 65, value : '维修费'
	}, {
		id: 66, value : '电梯费'
	}, {
		id: 67, value : '采暖费'
	}, ]
}, {
	id: 68, value : '公共汽车费',
	sub : [ {
		id: 69, value : '汽油费'
	}, {
		id: 70, value : '停车费'
	}, {
		id: 71, value : '洗车费'
	}, {
		id: 72, value : '过路过桥费'
	}, {
		id: 73, value : '公共汽车费维修费'
	}, {
		id: 74, value : '保养费'
	}, {
		id: 75, value : '年审费'
	}, {
		id: 76, value : '保险费'
	}, ]
}, {
	id: 77, value : '公共差旅费',
	sub : [ {
		id: 78, value : '公共差旅费董事'
	}, {
		id: 79, value : '公共差旅费其他'
	}, ]
}, {
	id: 80, value : '公共招待费',
	sub : [ {
		id: 81, value : '公共招待费董事'
	}, {
		id: 82, value : '公共招待费其他'
	}, ]
}, {
	id: 83, value : '公共通讯费',
	sub : [ {
		id: 84, value : '会议电话费'
	}, {
		id: 85, value : '网络费'
	}, {
		id: 86, value : '公司电话费'
	}, {
		id: 87, value : '400呼叫中心年费'
	}, ]
}, {
	id: 88, value : '公共办公费',
	sub : [ {
		id: 89, value : '财务审计费'
	}, {
		id: 90, value : '税务审计费'
	}, {
		id: 91, value : '咨询费'
	}, {
		id: 92, value : '律师费'
	}, {
		id: 93, value : '董事费'
	}, {
		id: 94, value : '办公用品'
	}, {
		id: 95, value : '快递费'
	}, {
		id: 96, value : '花卉'
	}, {
		id: 97, value : '桶装水'
	}, {
		id: 98, value : '清洁费'
	}, {
		id: 99, value : '设备租赁维护费'
	}, {
		id: 100, value : '办公软件'
	}, {
		id: 101, value : '残保金'
	}, {
		id: 102, value : '辅料及返工费'
	}, {
		id: 103, value : '报刊书籍'
	}, {
		id: 104, value : '其他费用'
	}, ]
}, {
	id: 105, value : '各类年费',
	sub : [ {
		id: 106, value : '市高新技术协会年费'
	}, {
		id: 107, value : '市软件行业协会年费'
	}, {
		id: 108, value : '招聘年服务费'
	}, {
		id: 109, value : 'ISO年费'
	}, {
		id: 110, value : '税务软件年费'
	}, {
		id: 111, value : '金蝶软件服务年费'
	}, {
		id: 112, value : '中国自动识别技术协会年费'
	}, {
		id: 113, value : '防伪行业协会会员费'
	}, {
		id: 114, value : '防伪技术协会会费'
	}, {
		id: 115, value : '企业邮局年费'
	}, {
		id: 116, value : '证券查询及上市费用'
	}, {
		id: 117, value : '中国上市公司协会会费'
	}, {
		id: 118, value : '400客服系统年费'
	}, {
		id: 119, value : '深圳市商用密码行业协会会费'
	}, {
		id: 120, value : '深圳市防伪协会会费'
	}, {
		id: 121, value : '证券交易所上市年费'
	}, {
		id: 122, value : '公司董事及高级职员责任保险费'
	}, {
		id: 123, value : '虚拟主机年费'
	}, {
		id: 124, value : 'NETWORK BOX M-385I UTM+ 服务费'
	}, {
		id: 125, value : '中国支付清算协会'
	}, {
		id: 126, value : '213栋光纤年费'
	}, {
		id: 127, value : 'CMMI ML3咨询及评估服务费'
	}, ]
}, {
	id: 128, value : '公共福利费',
	sub : [ {
		id: 129, value : '团体保险'
	}, {
		id: 130, value : '员工体检'
	}, {
		id: 131, value : '团体活动'
	}, {
		id: 132, value : '体育活动'
	}, {
		id: 133, value : '生日福利'
	}, {
		id: 134, value : '过节福利'
	}, {
		id: 135, value : '医药用品'
	}, {
		id: 136, value : '慰问费'
	}, {
		id: 137, value : '其他福利费'
	} ]
}];