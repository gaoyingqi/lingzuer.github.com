;$(function(){
/**
 * 设置MM全局变量
 */
if (typeof MM === "undefined") {
    MM = {};
}
MM.BASE_URL = "http://photo.163.com";


/**
 * MM.util = {}
 */

(function (a) {
    var b = {};
    b.cssPixels = {};
    b.cssPixels.get = function (a, b) {
        a = $(a);
        var c = a.css(b);
        return c ? parseInt(a.css(b).replace("px", ""), 10) : 0;
    };
    b.cssPixels.set = function (a, b, c) {
        return $(a).css(b, c + "px");
    };
    a.cssPixels = b.cssPixels.get;
    b.URL_REGEX = new RegExp("\\b((?:[a-z][a-z0-9_\\-]+:(?:/{1,3}|[a-z0-9%])|www[0-9]{0,3}\\.|[a-z0-9.\\-]+\\.[a-z]{2,4}/)(?:[^ ()<>]+|\\(([^ ()<>]+|(\\([^ ()<>]+\\)))*\\))+(?:\\(([^ ()<>]+|(\\([^ ()<>]+\\)))*\\)|[^ `!()\\[\\]{};:'\".,<>???“”‘’]))", "i"); 
	b.linkify = function (a) {
        var c = a.replace(b.URL_REGEX, '<a target="blank" href="$&">$&</a>');
        return c;
    };
	a.util = b;
})(MM);

typeof console == "undefined" && (console = {
    log: function () {}
});

/**
 * train.core = {}
 */
(function (a) {
    a.error = function () {
        if (typeof console != "undefined" && console.error && typeof console.error == "function") {
            var a = _.toArray(arguments);
            console.error(a.join(", "))
        }
    }, 
    a.addCss3Rule = function (a, b, c) {
        $.each(["-webkit-", "-moz-", ""], function (d, e) {
            a.css(e + b, c)
        })
    }, 
    a.checkBrowserRequirements = function () {
        $.ajaxSetup({
            cache: false, //解决IE浏览器下缓存的问题
			contentType: "application/x-www-form-urlencoded; charset=UTF-8" //解决IE浏览器乱码问题
        });
    }, 
    $(window).load(a.checkBrowserRequirements), 
    a.validate = {}, 
    a.validate.EMAIL_REGEX = /[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+(?:\.[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+)*@(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?/, 
    a.validate.emailFormat = function (b, c, d) {
        return a.validate.EMAIL_REGEX.test(b) ? !0 : (d.push({
            field: c,
            message: "is not a valid email"
        }), !1)
    }, 
    a.validate.dateFormat = function (a, b, c) {
        var d = Date.parse(a);
        return _.isNaN(d) ? (c && c.push({
            field: b,
            message: "is not a valid date"
        }), !1) : !0
    }, 
    a.redirectTo = function (b, c) {
        var d = a.urlFor[b];
        if (d) window.location = a.BASE_URL + d(c);
        else {
            if (c) throw Error("Unknown objectType '" + b + "'.");
            window.location = a.BASE_URL + b
        }
    }, 
	//顶部提示
    a.showTopNotification = function (a, b) {
        var c = $('<div class="top-notification"></div>'),
            d = $("<span></span>"),
            e = $("<a></a>");
        e.text("隐藏"), 
		e.attr("href", ["javascript", "void(0)"].join(":")), 
		c.append(d).append(e);
        var f = $("body");
        $(".viewer").length > 0 && c.css({
            position: "fixed",
            top: "66px",
            opacity: .7,
            filter: "alpha(opacity=70)",
			height: "30px",
			lineHeight: "30px"
        }).css("z-index", 9999), 
		f.prepend(c), 
		e.click(function () {
            $(c).slideUp("fast"), 
			typeof b == "function" && b()
        }), 
		a(c)
    };
    var e = 5e3;
    a.keycodes = {}, 
    a.keycodes.BACKSPACE = 8, 
    a.keycodes.SPACE = 32
})(MM);


/**
 * MM.events = {}
 */
(function (a) {
    var b = {};
	//常量
    b.AUTHENTICATED = "authd";
	
    b._listeners = {}, 
    b.fire = function (c, d) {
        var e = b._listeners[c] || [];
        $.each(e, function (b, c) {
            try {
                c(d)
            } catch (e) {
                a.trackException(e)
            }
        })
    }, 
    b.subscribe = function (a, c) {
        var d = b._listeners[a];
        d || (d = [], b._listeners[a] = d), d.push(c)
    }, 
    b.subscribeOnce = function (a, c) {
        var d;
        d = function () {
            b.unsubscribe(a, d), 
			c.apply(this, arguments)
        }, 
		b.subscribe(a, d)
    }, 
    b.resubscribe = function (a, c) {
        b.unsubscribe(a, c), 
		b.subscribe(a, c)
    }, 
    b.unsubscribe = function (a, c) {
        var d = b._listeners[a];
        d && (b._listeners[a] = _(d).reject(function (a) {
            return a === c
        }))
    }, 
    a.events = b
})(MM);

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/**
 * loading页面
 * @param {Object} mm
 */
(function(mm) {
	var pub = {};
	/**
	 * 初始化方法
	 */
	pub.init = function() {
		$('.container').showLoading();
//		pub.loading();
		//test
		setTimeout(function() {
			pub.loading();
		},1000);
	};
	/**
	 * 加载中
	 */
	pub.loading = function() {
		$.ajax({
            url: mm.BASE_URL+'/html/jjfjj/json/loading.html',
            type: "post",
            success: function (res) {
				var res = eval("("+res+")");
				if (res.success) {
					$('.container').hideLoading();
					location.href = mm.BASE_URL+'/html/jjfjj/index.html';
				}
            }
        });
	};
	mm.load = pub;
})(MM);
/**
 * 选词王首页模块
 * @param {Object} mm
 */
(function(mm) {
	var pub = {},
		_itmarr = [];
	/**
	 * 添加数据
	 * @param {Object} _items
	 */
	pub.setData = function(_items) {
		$('#productBody').html($('#tmplProductPost').tmpl(_items));
	}
	/**
	 * 初始化函数
	 */
	pub.init = function() {
		pub.getProductItems();
		pub.addProduct();
		pub.synchData();
	};
	/**
	 * 获取宝贝ID列表
	 * @return {Object}
	 */
	pub.getProductItems = function() {
		$.ajax({
            url: mm.BASE_URL+'/html/jjfjj/json/getProductItems.html',
            type: "post",
            success: function (res) {
				var res = eval("("+res+")");
				if (res.success) {
					mm.ITEMS = res.data;
					pub.getProduct(res.data);
					pub.getPutInNum(res.data);
					pub.getYesterday(res.data);
				}
            }
        });
	};
	/**
	 * 获取宝贝详情
	 * @param {Array} data ID列表
	 * @return {Object}
	 */
	pub.getProduct = function(data) {
		$.ajax({
            url: mm.BASE_URL+'/html/jjfjj/json/getProduct.html',
            type: "post",
			data: {
                productIds: data
            },
            success: function (res) {
				var res = eval("("+res+")");
				if (res.success) {
					$.each(res.data, function(i, item){      
						_itmarr[i] = $.extend(_itmarr[i]||{}, item);
					});
					pub.setData(_itmarr);
					//pub.getPutInNum(data);
				}
            }
        });
	};
	/**
	 * 获取投放词数量
	 * @param {Array} data ID列表
	 * @return {Object}
	 */
	pub.getPutInNum = function(data) {
		$.ajax({
            url: mm.BASE_URL+'/html/jjfjj/json/getPutInNum.html',
            type: "post",
			data: {
                productIds: data
            },
            success: function (res) {
				var res = eval("("+res+")");
				if (res.success) {
					$.each(res.data, function(i, item){      
						_itmarr[i] = $.extend(_itmarr[i]||{}, item);
					});
					pub.setData(_itmarr);
					//pub.getYesterday(data);
				}
            }
        });
	};
	/**
	 * 获取昨日信息
	 * @param {Array} data ID列表
	 * @return {Object}
	 */
	pub.getYesterday = function(data) {
		$.ajax({
            url: mm.BASE_URL+'/html/jjfjj/json/getYesterday.html',
            type: "post",
			data: {
                productIds: data
            },
            success: function (res) {
				var res = eval("("+res+")");
				if (res.success) {
					$.each(res.data, function(i, item){      
						_itmarr[i] = $.extend(_itmarr[i]||{}, item);
					});
					pub.setData(_itmarr);
				}
            }
        });
	};
	/**
	 * 删除宝贝
	 * @param {Number} id
	 * @return {Object}
	 */
	pub.delProduct = function(id) {
		$.ajax({
            url: mm.BASE_URL+'/html/jjfjj/json/delProduct.html',
            type: "post",
			data: {
                productId: id
            },
            success: function (res) {
				var res = eval("("+res+")");
				if (res.success) {
					$('#id_item_'+id).remove();
				}
            }
        });
	};
	/**
	 * 添加宝贝
	 * @param {Number} id
	 * @return {Object}
	 */
	pub.addProduct = function(id) {
		var addItem = function () {
			if (pub.LOADED) {
				$.colorbox({inline:true, href:'#productBox'});
				return ;
			}
			$.ajax({
	            url: mm.BASE_URL+'/html/jjfjj/json/getProduct.html',
	            type: "post",
				data: {
	                productIds: mm.ITEMS
	            },
	            success: function (res) {
					var res = eval("("+res+")");
					if (res.success) {
						pub.LOADED = true;
						pub.DATA = res.data;
						//$('#addProduct').unbind("click", addItem);
						$('#addProductBody').append($('#tmplProduct').tmpl(res.data));
						pub.dataTables();
						pub.onProductCC();
						pub.onProductOK();
					} else {
						pub.LOADED = null;
						//$('#addProduct').bind("click", addItem);
					}
	            }
	        });
		};
		$('#addProduct').bind("click", addItem);
	};
	/**
	 * 确认添加宝贝
	 * @return {Void}
	 */
	pub.onProductOK = function(data) {
		$('#addProductOK').click(function() {
			var val = $('#addProductBody').find('input:checked').val();
			if (!!val) {
				var num = 3;
				var _tmparr = [];
				if (num > 4) {
					//弹出提示框“宝贝已满”
					$.colorbox({inline:true, href:'#fullProductBox'});
					return;
				} else if (num == 4) {
					//显示提示，并隐藏“继续添加宝贝”按钮
					$('#fullTip').show();
					$('#goAddProduct').hide();
				} else {
					//隐藏提示，显示“继续添加宝贝”按钮
					$('#fullTip').hide();
					$('#goAddProduct').show();
					pub.goAddProduct();
				}
				
				
				
				//显示选择的宝贝
				$.each(pub.DATA, function(i, item){
					if (item.num_iid == val) {
						_tmparr[0] = $.extend(_tmparr[0] || {}, item);
						$('#addProductBD').html($('#tmplAddProduct').tmpl(item));
					}
				});
				
				//获取选中宝贝的推广词数量
				$.ajax({
		            url: mm.BASE_URL+'/html/jjfjj/json/getPutInNum.html',
		            type: "post",
					data: {
		                "num_iid": val
		            },
		            success: function (res) {
						var res = eval("("+res+")");
						if (res.success) {
							$.each(res.data, function(i, item){      
								_tmparr[0] = $.extend(_tmparr[0]||{}, item);
							});
							$('#putInNum').html($('#tmplPutInNum').tmpl(res.data));
							
							//获取选中宝贝的昨日信息
							$.ajax({
					            url: mm.BASE_URL+'/html/jjfjj/json/getYesterday.html',
					            type: "post",
								data: {
					                "num_iid": val
					            },
					            success: function (res) {
									var res = eval("("+res+")");
									if (res.success) {
										$.each(res.data, function(i, item){      
											_tmparr[0] = $.extend(_tmparr[0]||{}, item);
										});
										$('#productBody').append($('#tmplProductPost').tmpl(_tmparr[0]));
									}
					            }
					        });
						}
		            }
		        });
				
				
				//弹出选择宝贝的弹出框
				$.colorbox({inline:true, href:'#addProductBox'});
			} else {
				alert('请选择一个宝贝');
			}
		});
	};
	/**
	 * 继续添加宝贝
	 */
	pub.goAddProduct = function() {
		$('#goAddProduct').click(function() {
			//弹出选择宝贝的弹出框
			$.colorbox({inline:true, href:'#productBox'});
			return;
		});
	}
	/**
	 * 取消添加宝贝
	 * @return {Void}
	 */
	pub.onProductCC = function() {
		$('#addProductCC').click(function() {
			$.colorbox.close();
		});
	};
	/**
	 * 对宝贝列表排序
	 * bSearchable: http://www.datatables.net/forums/discussion/4041/problem-with-bsearchable-boolean/p1
	 * 
	 */
	pub.dataTables = function() {
		$('#addProductTable').dataTable({
			"aLengthMenu": [
	            [1, 2, -1],
	            [1, 2, "All"]
	        ],
            "bProcessing": true,
			"bPaginate": true,//左上角分页按钮
			"iDisplayLength": 1,
			"sPaginationType": "full_numbers", //default 'two_button'
	        "bLengthChange": true,//每行显示记录数
	        "bFilter": true,//搜索栏
	        "bSort": true,//排序
	        "aoColumnDefs": [ 
				{ "bSortable": false, "aTargets": [ 0,2 ] } //那一列不能排序
		    ],
	        "bInfo": true,//Showing 1 to 10 of 23 entries  总记录数每页显示多少等信息
			"aaSorting": [  ],//给列表排序 ，第一个参数表示那列。第二个参数为 desc或是asc
			"oLanguage": {
				"sUrl": mm.BASE_URL+"/html/jjfjj/media/language/de_DE.txt"
			},
			"aoColumns": [ 
	            {"bVisible": true, "bSearchable": false},
	            {"bVisible": true,  "bSearchable": true},                          
	            {"bVisible": true, "bSearchable": false},
	        ],
			"fnDrawCallback": function () {
                $.colorbox({inline:true, href:'#productBox'});
            }
        });
	};
	/**
	 * 数据同步
	 */
	pub.synchData = function() {
		$('#activity_pane').click(function() {
			$('body').showLoading();
//			$.ajax({
//	            url: mm.BASE_URL+'/html/jjfjj/json/synchData.html',
//	            type: "post",
//	            success: function (res) {
//					var res = eval("("+res+")");
//					if (res.success) {
//						$('body').hideLoading();
//					}
//	            }
//	        });
			// test
			setTimeout(function() {
				$.ajax({
		            url: mm.BASE_URL+'/html/jjfjj/json/synchData.html',
		            type: "post",
		            success: function (res) {
						var res = eval("("+res+")");
						if (res.success) {
							$('body').hideLoading();
						}
		            }
		        });
			}, 2000);
		}); 
	};
	mm.index = pub;
})(MM);

/**
 * 选词王模板1页面
 * @param {Object} mm
 */
(function(mm) {
	var pub = {};
	pub.init = function() {
		pub.getProduct();
		pub.getAttribute();
	};
	/**
	 * 添加宝贝数据
	 * @param {Object} _items
	 */
	pub.setData = function(_data) {
		$('#productShow').append($('#tmplProduct').tmpl(_data));
	};
	/**
	 * 添加宝贝属性数据
	 * @param {Object} _items
	 */
	pub.setAttrData = function(_data) {
		$('#attributeBody').append($('#tmplAttribute').tmpl(_data));
	};
	/**
	 * 添加宝贝触发词数据
	 * @param {Object} _items
	 */
	pub.setTagData = function(_data) {
		$('#tags_'+_data.attribute_key_id).append($('#tmplTag').tmpl(_data));
	};
	/**
	 * 获取宝贝详情
	 */
	pub.getProduct = function() {
		var num_iid = ["1234567"];
		$.ajax({
            url: mm.BASE_URL+'/html/jjfjj/json/getProduct.html',
            type: "post",
			data: {
                "num_iid": num_iid
            },
            success: function (res) {
				var res = eval("("+res+")");
				if (res.success) {
					pub.setData(res.data);
				}
            }
        });
	};
	/**
	 * 获取宝贝属性
	 */
	pub.getAttribute = function() {
		var data = '123';
		$.ajax({
            url: mm.BASE_URL+'/html/jjfjj/json/getAttribute.html',
            type: "post",
			data: {
                num_iid: data
            },
            success: function (res) {
				var res = eval("("+res+")");
				if (res.success) {
					pub.setAttrData(res.data);
				}
            }
        });
	};
	/**
	 * 添加宝贝触发词
	 */
	pub.addTag = function(data) {
		var _input = $('#self_'+data.attribute_key_id);
		var word = _input.val();
		if (!$.trim(word)) return;
		data = $.extend({'word': word}||{}, data);
		$.ajax({
            url: mm.BASE_URL+'/html/jjfjj/json/addTag.html',
            type: "post",
			data: data,
            success: function (res) {
				var res = eval("("+res+")");
				if (res.success) {
					_input.val('');
					data = $.extend({'word_id': res.word_id}||{}, data);
					pub.setTagData(data);
				}
            }
        });
	};
	/**
	 * 删除宝贝触发词
	 */
	pub.delTag = function(data,el) {
		$.ajax({
            url: mm.BASE_URL+'/html/jjfjj/json/delTag.html',
            type: "post",
			data: data,
            success: function (res) {
				var res = eval("("+res+")");
				if (res.success) {
					$(el).remove();
				}
            }
        });
	};
	mm.moban1 = pub;
})(MM);


/**
 * 选词王模板2页面
 * @param {Object} mm
 */
(function(mm) {
	var pub = {};
	pub.init = function() {
		mm.moban1.getProduct();
		pub.getPromote();
	};
	/**
	 * 添加宝贝常用促销词数据
	 * @param {Object} _items
	 */
	pub.setPromoteData = function(_data) {
		$('#promotionWrap').append($('#tmplPromoteTag').tmpl(_data));
	};
	/**
	 * 获取宝贝常用促销词
	 */
	pub.getPromote = function() {
		var data = '123';
		$.ajax({
            url: mm.BASE_URL+'/html/jjfjj/json/getPromote.html',
            type: "post",
			data: {
                num_iid: data
            },
            success: function (res) {
				var res = eval("("+res+")");
				if (res.success) {
					pub.setPromoteData(res.data);
				}
            }
        });
	};
	/**
	 * 更新宝贝常用促销词
	 */
	pub.updatePromotionTag = function(data,el) {
		var selected = $(el).hasClass('selected');
		data = {
			"num_iid": "1234567",
			"word": data,
			selected: selected
		}
		$.ajax({
            url: mm.BASE_URL+'/html/jjfjj/json/updatePromotion.html',
            type: "post",
			data: data,
            success: function (res) {
				var res = eval("("+res+")");
				if (res.success) {
					if (selected) {
						$(el).toggleClass('selected');
						$(el).appendTo('#candidateTag');
					} else {
						$(el).toggleClass('selected');
						$(el).appendTo('#selectedTag');
					}
				}
            }
        });
	};
	mm.moban2 = pub;
})(MM);


/**
 * 选词王模板3页面---竞争对手
 * @param {Object} mm
 */
(function(mm) {
	var pub = {};
	pub.init = function() {
		mm.moban1.getProduct();
		pub.getCompetitor();
	};
	/**
	 * 添加宝贝竞争对手数据
	 * @param {Object} _items
	 */
	pub.setCompetitorData = function(_data) {
		$('#competitorWrap').append($('#tmplCompetitor').tmpl(_data));
		pub.checkOne();
	};
	/**
	 * 添加宝贝竞争对手
	 * @param {Object} _items
	 */
	pub.setCompetitorTagData = function(el, _data) {
		$(el).append($('#tmplCompetitorTag').tmpl(_data));
	};
	/**
	 * 获取宝贝竞争对手
	 */
	pub.getCompetitor = function() {
		var data = '123';
		$.ajax({
            url: mm.BASE_URL+'/html/jjfjj/json/getCompetitor.html',
            type: "post",
			data: {
                num_iid: data
            },
            success: function (res) {
				var res = eval("("+res+")");
				if (res.success) {
					pub.setCompetitorData(res.data);
				}
            }
        });
	};
	/**
	 * 添加
	 * @param {Object}
	 */
	pub.add = function(el) {
		$(el).hide();
		$(el).parent().find('.js_val').show();
		$(el).parent().find('input').focus();
	};
	/**
	 * 删除竞争对手
	 */
	pub.delCompetitorTag = function(tag, selected, el) {
		$.ajax({
            url: mm.BASE_URL+'/html/jjfjj/json/delCompetitor.html',
            type: "post",
			data: {
				"tag": tag,
				"selected": selected
			},
            success: function (res) {
				var res = eval("("+res+")");
				if (res.success) {
					$(el).remove();
				}
            }
        });
	};
	/**
	 * 添加竞争对手
	 */
	pub.addCompetitorTag = function(tagParent,el) {
		var val = $(el).parent().find('input').val();
		if (!$.trim(val)) return;
		$(el).parent().find('input').val('');
		pub.setCompetitorTagData(tagParent, {name: val});
	};
	/**
	 * 提交竞争对手
	 */
	pub.subCompetitor = function() {
		var id = '123';
		var harr = [], marr = [], larr = [], sarr = [];
		$.each($('#competitorHigh .name'),function(a,b) {
			harr.push($(b).text());
		});
		$.each($('#competitorMedium .name'),function(a,b) {
			marr.push($(b).text());
		});
		$.each($('#competitorLow .name'),function(a,b) {
			larr.push($(b).text());
		});
		$.each($('#competitorWrap input:checked'),function(a,b) {
			sarr.push($(b).val());
		});
		
		var data = {
			"num_iid":id,
			"level_selected": {
					"high": harr,
					"medium": marr,
					"low": larr,
					"selected": sarr
				}
			};
		$.ajax({
            url: mm.BASE_URL+'/html/jjfjj/json/updateCompetitor.html',
            type: "post",
			data: data,
            success: function (res) {
				var res = eval("("+res+")");
				if (res.success) {
					location.href = 'http://photo.163.com/html/jjfjj/moban/tab4.html';
				}
            }
        });
	};
	/**
	 * 选择一个
	 */
	pub.checkOne = function() {
		var checkboxes = $('#competitorWrap :checkbox');
		checkboxes.click(function(){
			var self = this;
			checkboxes.each(function(){
				if(this!=self) this.checked = ''
			})
		})
	}
	mm.moban3 = pub;
})(MM);


/**
 * 选词王模板4页面
 * @param {Object} mm
 */
(function(mm) {
	var pub = {};
	pub.init = function() {
		mm.moban1.getProduct();
		pub.getTag();
		pub.getPromote();
		pub.getCompetitor();
	};
	/**
	 * 添加宝贝触发词数据
	 * @param {Object} _items
	 */
	pub.setTagData = function(_data) {
		$('#tags').append($('#tmplTag').tmpl(_data));
	};
	/**
	 * 添加宝贝常用促销词数据
	 * @param {Object} _items
	 */
	pub.setPromoteData = function(_data) {
		$('#promote').append($('#tmplPromoteTag').tmpl(_data));
	};
	/**
	 * 添加宝贝竞争对手数据
	 * @param {Object} _items
	 */
	pub.setCompetitorData = function(_data) {
		$('#compete').append($('#tmplCompeteTag').tmpl(_data));
	};
	/**
	 * 添加宝贝触发词
	 */
	pub.getTag = function(data) {
		$.ajax({
            url: mm.BASE_URL+'/html/jjfjj/json/getAttribute.html',
            type: "post",
			data: data,
            success: function (res) {
				var res = eval("("+res+")");
				if (res.success) {
					pub.setTagData(res.data);
				}
            }
        });
	};
	/**
	 * 获取宝贝常用促销词
	 */
	pub.getPromote = function() {
		var data = '123';
		$.ajax({
            url: mm.BASE_URL+'/html/jjfjj/json/getPromote.html',
            type: "post",
			data: {
                num_iid: data
            },
            success: function (res) {
				var res = eval("("+res+")");
				if (res.success) {
					pub.setPromoteData(res.data);
				}
            }
        });
	};
	/**
	 * 获取竞争对手
	 */
	pub.getCompetitor = function() {
		var data = '123';
		$.ajax({
            url: mm.BASE_URL+'/html/jjfjj/json/getCompetitor.html',
            type: "post",
			data: {
                num_iid: data
            },
            success: function (res) {
				var res = eval("("+res+")");
				if (res.success) {
					pub.setCompetitorData(res.data);
				}
            }
        });
	};
	mm.moban4 = pub;
})(MM);

/**
 * 选词模块
 * @param {Object} mm
 */
(function(mm) {
	var pub = {},
		_itmarr = [];
	/**
	 * 初始化函数
	 */
	pub.init = function() {
		mm.moban1.getProduct();
		pub.getPutInNum();
		pub.getCart();
		pub.getChooseCandidateItems();
		pub.slider();
		//pub.subChoose();
		pub.toggleChecked(status);
		pub.fuzzySet();
		pub.subSearchFilter();
	};
	/**
	 * 获取推广词数量
	 */
	pub.getPutInNum = function() {
		$.ajax({
            url: mm.BASE_URL+'/html/jjfjj/json/getPutInNum.html',
            type: "post",
			data: {
                "num_iids": 213
            },
            success: function (res) {
				var res = eval("("+res+")");
				if (res.success) {
					$('#produstSelectMsg .n1').html(res.data[0].t1);
				}
            }
        });
	};
	/**
	 * 获取选词车中的数量
	 */
	pub.getCart = function() {
		$.ajax({
            url: mm.BASE_URL+'/html/jjfjj/json/getCart.html',
            type: "post",
			data: {
                "num_iids": 213
            },
            success: function (res) {
				var res = eval("("+res+")");
				if (res.success) {
					pub.CARTNUM = res.data.length;
					$('#produstSelectMsg .n2').html(res.data.length);
					$('#produstSelectMsg .n3').html(800 - res.data.length);
				}
            }
        });
	};
	/**
	 * 添加数据
	 * @param {Object} _items
	 */
	pub.setData = function(_items) {
		$('#chooseCandidateBody').append($('#tmplChoosePost').tmpl(_items));
		pub.subChoose();
	};
	/**
	 * 获取已选宝贝ID列表
	 * @return {Object}
	 */
	pub.getChooseItems = function() {
		$.ajax({
            url: mm.BASE_URL+'/html/jjfjj/json/getChooseItems.html',
            type: "post",
            success: function (res) {
				var res = eval("("+res+")");
				if (res.success) {
					pub.getChoose(res.data);
				}
            }
        });
	};
	/**
	 * 获取候选宝贝ID列表
	 * @return {Object}
	 */
	pub.getChooseCandidateItems = function() {
		$.ajax({
            url: mm.BASE_URL+'/html/jjfjj/json/getChooseCandidateItems.html',
            type: "post",
            success: function (res) {
				var res = eval("("+res+")");
				if (res.success) {
					pub.getChooseCandidate(res.data);
				}
            }
        });
	};
	/**
	 * 获取宝贝详情
	 * @param {Array} data ID列表
	 * @return {Object}
	 */
	pub.getChooseCandidate = function(data) {
		$.ajax({
            url: mm.BASE_URL+'/html/jjfjj/json/getChooseCandidate.html',
            type: "post",
			data: {
                "num_iids": data
            },
            success: function (res) {
				var res = eval("("+res+")");
				if (res.success) {
					$.each(res.data, function(i, item){      
						_itmarr[i] = $.extend(_itmarr[i]||{}, item);
					});
					pub.getChooseSummary(data);
				}
            }
        });
	};
	/**
	 * 获取已推广宝贝报表
	 * @param {Array} data ID列表
	 * @return {Object}
	 */
	pub.getChooseSummary = function(data) {
		$.ajax({
            url: mm.BASE_URL+'/html/jjfjj/json/getChooseSummary.html',
            type: "post",
			data: {
                "num_iids": data
            },
            success: function (res) {
				var res = eval("("+res+")");
				if (res.success) {
					$.each(res.data, function(i, item){      
						_itmarr[i] = $.extend(_itmarr[i]||{}, item);
					});
					pub.setData(_itmarr);
					pub.dataTables();
				}
            }
        });
	};
	/**
	 * 对宝贝列表排序
	 */
	pub.dataTables = function() {
		$('#chooseCandidateTable').dataTable({
            "aLengthMenu": [
	            [500, 1000, -1],
	            [500, 1000, "All"]
	        ],
            "bProcessing": true,
			"bPaginate": true,//左上角分页按钮
			"iDisplayLength": 500, //一页显示多少条
			"sPaginationType": "full_numbers", //default 'two_button'
	        "bLengthChange": true,//每行显示记录数
	        "bFilter": true,//搜索栏
	        "bSort": true,//排序
			"aoColumnDefs": [ 
				{ "bSortable": false, "aTargets": [ 0 ] } //那一列不能排序
		    ],
	        "bInfo": true,//Showing 1 to 10 of 23 entries  总记录数每页显示多少等信息
			"aaSorting": [  ],//给列表排序 ，第一个参数表示那列。第二个参数为 desc或是asc, [ 1, "asc" ]
			"oLanguage": {
				"sUrl": mm.BASE_URL+"/html/jjfjj/media/language/de_DE.txt"
			},
			"aoColumns": [ 
	            {"bVisible": true, "bSearchable": false},
	            {"bVisible": true,  "bSearchable": true},                          
	            {"bVisible": true, "bSearchable": false},
				{"bVisible": true, "bSearchable": false},
				{"bVisible": true, "bSearchable": false},
				{"bVisible": true, "bSearchable": false},
				{"bVisible": true, "bSearchable": false}
	        ]
        });
	};
	/**
	 * 添加到选词车
	 */
	pub.subChoose = function() {
		$('#subChoose').click(function() {
			var num_iids = [];
			$.each($('#chooseCandidateBody').find('input:checked'), function(i, item){
				num_iids[i] = $(item).val();
			});
			if (!num_iids.length) return;
			$.ajax({
	            url: mm.BASE_URL+'/html/jjfjj/json/addChooseSummary.html',
	            type: "post",
				data: num_iids,
	            success: function (res) {
					var res = eval("("+res+")");
					if (res.success) {
						location.href="http://photo.163.com/html/jjfjj/xuanci/car.html";
					}
	            }
	        });
		});
		$.each($('#chooseCandidateBody').find('input:checkbox'), function(i, item){
			$(item).click(function() {
				pub.subToCart();
			})
		});
		
	};
	/**
	 * 提交到选词车
	 */
	pub.subToCart = function() {
		var querys = [];
			$.each($('#chooseCandidateBody').find('input:checked'), function(i, item){
				var _val = $(item).val();
				$.each(_itmarr, function(j, itm) {
					if (_val == itm.num_iid) {
						querys.push(itm);
					}
				});
			});
			$.ajax({
	            url: mm.BASE_URL+'/html/jjfjj/json/addChooseSummary.html',
	            type: "post",
				data: {
					'num_iid': '3232233',
					'ops': 'del/add',
					'querys': querys
				},
	            success: function (res) {
					var res = eval("("+res+")");
					if (res.success) {
						$('#produstSelectMsg .n2').html(pub.CARTNUM + querys.length);
						$('#produstSelectMsg .n3').html(800 - pub.CARTNUM + querys.length);
						//location.href="http://photo.163.com/html/jjfjj/xuanci/car.html";
					}
	            }
	        });
	}
	/**
	 * 筛选备选词
	 */
	pub.slider = function() {
		//展现量
		$( "#pv-range" ).slider({
			range: true,
			min: 0,
			max: 400,
			values: [ 75, 300 ],
			slide: function( event, ui ) {
				$( "#pv-amount" ).html( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
			}
		});
		$( "#pv-amount" ).html( "$" + $( "#pv-range" ).slider( "values", 0 ) +
			" - $" + $( "#pv-range" ).slider( "values", 1 ) );
		//点击数	
		$( "#click-range" ).slider({
			range: true,
			min: 0,
			max: 400,
			values: [ 75, 300 ],
			slide: function( event, ui ) {
				$( "#click-amount" ).html( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
			}
		});
		$( "#click-amount" ).html( "$" + $( "#click-range" ).slider( "values", 0 ) +
			" - $" + $( "#click-range" ).slider( "values", 1 ) );
		
		$( "#competitor-range" ).slider({
			range: true,
			min: 0,
			max: 400,
			values: [ 75, 300 ],
			slide: function( event, ui ) {
				$( "#competitor-amount" ).html( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
			}
		});
		$( "#competitor-amount" ).html( "$" + $( "#competitor-range" ).slider( "values", 0 ) +
			" - $" + $( "#competitor-range" ).slider( "values", 1 ) );
		
		$( "#avg-range" ).slider({
			range: true,
			min: 0,
			max: 400,
			values: [ 75, 300 ],
			slide: function( event, ui ) {
				$( "#avg-amount" ).html( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
			}
		});
		$( "#avg-amount" ).html( "$" + $( "#avg-range" ).slider( "values", 0 ) +
			" - $" + $( "#avg-range" ).slider( "values", 1 ) );
		
		$( "#recommend-range" ).slider({
			range: true,
			min: 0,
			max: 400,
			values: [ 75, 300 ],
			slide: function( event, ui ) {
				$( "#recommend-amount" ).html( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
			}
		});
		$( "#recommend-amount" ).html( "$" + $( "#recommend-range" ).slider( "values", 0 ) +
			" - $" + $( "#recommend-range" ).slider( "values", 1 ) );
	};
	/**
	 * 全选
	 */
	pub.toggleChecked = function(status) {
		$.each($('#chooseCandidateBody').find('input'), function(){
			$(this).attr("checked",status);
		});
	};
	/**
	 * 多维模糊排序
	 */
	pub.fuzzySet = function() {
		var btn = $('#fuzzyBtn .bt');
		btn.click(function(){
			var self = this;
			$(self).toggleClass("bt_on");
			btn.each(function(){
				if (this != self) {
					$(this).removeClass("bt_on");
				}
			});
		});
	};
	/**
	 * 提交搜索进行快速选词
	 */
	pub.subSearchFilter = function() {
		$('#subSearchFilter').click(function() {
			var i_val = $.trim($('#include_list').val());
			var e_val = $.trim($('#exclude_list').val());
			var include_list = !!i_val ? i_val.split(' ') : [];
			var exclude_list = !!e_val ? e_val.split(' ') : [];
			
			var page_no = 1;
			var page_size = 10; //每页个数
			var total_num = 1000; //根据查询条件查到的总条数
			
			var fuzzy = $('#fuzzyBtn .bt');
			var onfuzzy = $('#fuzzyBtn .bt_on');
			var f_val = onfuzzy.attr('st');
			var fuzzy_sort_type = !!f_val ? f_val : -1;
			
			var data = {
				"num_iid": "3232323",
				"include_list": include_list,
				"exclude_list": exclude_list,
				"indicator_filter": {
					"pv": {
						"upper_limit": $( "#pv-range" ).slider( "values", 1 ),
						"lower_limit": $( "#pv-range" ).slider( "values", 0 )
					},
					"click": {
						"upper_limit": $( "#click-range" ).slider( "values", 1 ),
						"lower_limit": $( "#click-range" ).slider( "values", 0 )
					},
					"avg_price": {
						"upper_limit": $( "#avg-range" ).slider( "values", 1 ),
						"lower_limit": $( "#avg-range" ).slider( "values", 0 )
					},
					"competitor": {
						"upper_limit": $( "#competitor-range" ).slider( "values", 1 ),
						"lower_limit": $( "#competitor-range" ).slider( "values", 0 )
					},
					"recommend": {
						"upper_limit": $( "#recommend-range" ).slider( "values", 1 ),
						"lower_limit": $( "#recommend-range" ).slider( "values", 0 )
					}
				},
				"fuzzy_sort_type": fuzzy_sort_type,
				"page_no": page_no,
				"page_size": page_size
			};
			$.ajax({
	            url: mm.BASE_URL+'/html/jjfjj/json/filterChooseSummary.html',
	            type: "post",
				data: data,
	            success: function (res) {
					var res = eval("("+res+")");
					if (res.success) {
						//渲染列表
						pub.setData(res.keyword_list_in_page);
					}
	            }
	        });
		});
	};
	mm.choose = pub;
})(MM);


/**
 * 选词车
 * @param {Object} mm
 */
(function(mm) {
	var pub = {};
	/**
	 * 初始化方法
	 */
	pub.init = function() {
		mm.moban1.getProduct();
		pub.getCart();
		pub.toggleChecked(status);
		pub.initPrice();
	};
	/**
	 * 添加宝贝数据
	 * @param {Object} _items
	 */
	pub.setData = function(_data) {
		$('#cartBody').html($('#tmplCartPost').tmpl(_data));
	};
	/**
	 * 获取某个宝贝正在选词车的词（同时获得推荐初始价格）
	 */
	pub.getCart = function() {
		$.ajax({
            url: mm.BASE_URL+'/html/jjfjj/json/getCart.html',
            type: "post",
			data: {
				'num_iid': '3232233',
				'need_init_price': true,
				'init_price_strategy': $('#setInitPrice').val() || 0
			},
            success: function (res) {
				var res = eval("("+res+")");
				if (res.success) {
					pub.setData(res.data);
					pub.dataTables();
				}
            }
        });
	};
	/**
	 * 对宝贝列表排序
	 */
	pub.dataTables = function() {
		$('#cartTable').dataTable({
            "aLengthMenu": [
	            [50, 100, -1],
	            [50, 100, "All"]
	        ],
			"bRetrieve": true, //
            "bProcessing": true,
			"bPaginate": true,//左上角分页按钮
			"iDisplayLength": 50, //一页显示多少条
			"sPaginationType": "full_numbers", //default 'two_button'
	        "bLengthChange": true,//每行显示记录数
	        "bFilter": true,//搜索栏
	        "bSort": true,//排序
			"aoColumnDefs": [ 
				{ "bSortable": false, "aTargets": [ 0,2 ] } //那一列不能排序
		    ],
	        "bInfo": true,//Showing 1 to 10 of 23 entries  总记录数每页显示多少等信息
			"aaSorting": [  ],//给列表排序 ，第一个参数表示那列。第二个参数为 desc或是asc, [ 1, "asc" ]
			"oLanguage": {
				"sUrl": mm.BASE_URL+"/html/jjfjj/media/language/de_DE.txt"
			},
			"aoColumns": [ 
	            {"bVisible": true, "bSearchable": false},
	            {"bVisible": true,  "bSearchable": true},                          
	            {"bVisible": true, "bSearchable": false},
				{"bVisible": true, "bSearchable": false}
	        ]
        });
	}
	/**
	 * 全选
	 */
	pub.toggleChecked = function(status) {
		$.each($('#cartBody').find('input:checkbox'), function(){
			$(this).attr("checked",status);
		});
	};
	/**
	 * 初始价格
	 */
	pub.initPrice = function() {
//		var oval = [];
//		$.each($('#cartBody').find('input:text'), function(i, item){      
//			oval[i] = $(item).val();
//		});
		$('#setInitPrice').change(function() {
			pub.getCart();
//			$.each($('#cartBody').find('input:text'), function(i, item){      
//				$(item).val($('#setInitPrice').val() * oval[i]);
//			});
		});
	};
	/**
	 * 提交关键词校验
	 */
	pub.submitBidwords = function() {
		var num = $('#cartBody').find('input:checked').length;
		$.ajax({
            url: mm.BASE_URL+'/html/jjfjj/json/submitBidwordsSatisfied.html',
            type: "post",
			data: {
				'num_iid': '3232233',
				'submit_bidwords_num': num
			},
            success: function (res) {
				var res = eval("("+res+")");
				if (res.success) {
					switch (res.detail_code) {
						case 0:
							pub.submit();
		                case 1:
		                    alert('tip1');
		                    break;
		                case 2:
		                    alert('tip1');
		                    break;
		                default:
		                    alert('网络错误，请稍候再试');
		            }
				}
            }
        });
	};
	/**
	 * 提交关键词
	 */
	pub.submit = function() {
		var querys = [];
		$.each($('#cartBody').find('input:checked'), function(i, item){
			querys[i] = {};
			querys[i].query = $('#query_'+$(item).val()).html();
			querys[i].init_price = $('#init_price_'+$(item).val()).val();
			querys[i].avg_price = $('#avg_price_'+$(item).val()).html();
		});
		$.ajax({
            url: mm.BASE_URL+'/html/jjfjj/json/submitBidwords.html',
            type: "post",
			data: {
				'num_iid': '3232233',
				'querys': querys
			},
            success: function (res) {
				var res = eval("("+res+")");
				if (res.success) {
					//todo
				}
            }
        });
	};
	mm.cart = pub;
})(MM);


});




