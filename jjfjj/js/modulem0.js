$(function(){
	reload_checkbox_click();
	do_change_select('11768716442','cat');
	$("#monitor_list").addClass("active");
	$("#slide_left").html($("#monitor_detail_desc").html());

	$("input[name='rpt_days']").change(function(){
		show_center_tip("正在重新获取统计数据");
		var v_rpt_days = $("input[type='radio'][name='rpt_days']:checked").val();	
		$('#id_rpt_days').val(v_rpt_days);
		$('#id_strategy_form').submit();
	});

	$("#adg_tabs .tabsS").flowtabs("#adg_tabs .box_c_content > div");
	$("#word_tabs .tabsB").flowtabs("#wordlist_tabs > div");
	
	$("#id_curwords_search").keyup(function(){
		search_tabs_words('cur');
	});
	
	
	var table_sorter_cur_tbl =$('#table_sorter_cur').dataTable({
	 	"bPaginate": false,
	 	"bFilter": false,
	 	"bInfo": false,
		"aoColumns": [{"bSortable": false},{"bSortable": false},{"bSortable": true},{"bSortable": true},{"bSortable": true},{"bSortable": true},
					  {"bSortable": true},{"bSortable": true},{"bSortable": true},{"bSortable": true},{"bSortable": true},{"bSortable": true},
					  {"bSortable": true},{"bSortable": true},{"bSortable": true},{"bSortable": true},{"bSortable": true},{"bSortable": true},
					  {"bSortable": true},{"bSortable": true},{"bSortable": true},{"bSortable": true},{"bSortable": true},{"bSortable": true},
					  {"bSortable": true}]
	});
	
	
	draw_adgroup_trend_chart();
});

//数据行自定义类
function DataRow(index,type){
	var _this = this; //把this保存下来，以后用_this代替this
	_this.type = type;
	_this.index = index;
	if(type == 'cur'){
		_this.o_row = $("#cur_row_"+index);
		_this.o_chbox = $("#fthid_cur_chdid_"+index); 
		_this.o_select = $("#cur_opt_type_"+index);	
		_this.o_reset = $("#cur_img_reset_"+index);		
		_this.o_new_price = $("#cur_new_price_"+index); 
		_this.o_max_price = $("#cur_max_price_"+index);
		_this.v_bak_price = $("#cur_bak_price_"+index).val();
		_this.o_sort = $("#cur_sort_"+index+" span");
	}
	else if(type == 'cat'){
		_this.o_row = $("#cat_row_"+index);
		_this.o_chbox = $("#fthid_cur_chdid_cat_"+index);
		_this.o_select = $("#cat_opt_type_"+index);	
		_this.o_reset = $("#cat_img_reset_"+index);		
		_this.o_new_price = $("#cat_new_price_"+index); 
		_this.o_max_price = $("#cat_max_price_"+index);
		_this.v_bak_price = $("#cat_bak_price_"+index).val();
		_this.o_sort = $("#cat_sort_"+index+" span");				
	}
	else if(type == 'add'){
		_this.o_select = null;
		_this.o_row = $("#add_row_"+index);
		_this.o_chbox = $("#fthid_add_chdid_"+index); 
		_this.o_reset = $("#add_img_reset_"+index);		
		_this.o_new_price = $("#add_new_price_"+index); 
		_this.o_max_price = $("#add_bak_price_"+index);
		_this.v_bak_price = $("#add_bak_price_"+index).text();
	}
}

//重载父checkbox的click事件
function reload_checkbox_click(){
	$("input[id^=fthid]").click(function(){		
		var fthid = '';
		if(this.id.indexOf('_chdid_')==-1){
			fthid = this.id;
			if (this.checked){
				$("input[id^="+fthid+"_chdid_]").attr("checked","checked");
			}
			else{
				$("input[id^="+fthid+"_chdid_]").removeAttr("checked");
			}
		}
		if(this.id.indexOf('_chdid_cat') != -1){
			calculate_checked_count("cat");
		}
		else if(this.id.indexOf('_cur') != -1){
			calculate_checked_count("cur");
		}
		else if(this.id.indexOf('_add') != -1){
			calculate_checked_count("add");
		}
	});		
}

//一键提交改价
function curwords_submit(){
	//计算类目出价
	var v_cat_checked = false, opt_type_text = "";
	var catmatch_id = 11768716442;
	var catrow = new DataRow(catmatch_id,'cat');
	if(catrow.o_chbox.is(':checked')){
		opt_type_text = catrow.o_select.find("option:selected").text();
		if(catrow.o_select.val() == "bid"){
			opt_type_text = "启用并改价";	
			if(parseFloat(catrow.o_new_price.val()) == parseFloat(catrow.o_max_price.text())){
				alert("【类目出价】的新价与原价相同，请修改价格或取消改价操作。");
				catrow.o_new_price.focus();
				return false;
			}
		}
		v_cat_checked = true;		
	}
	//计算删词、改价个数
	var error_keyword_id = "";
	var v_del_count = 0, v_plus_count = 0, v_fall_count = 0;
	$("input[id^=fthid_cur_chdid_]:checked").each(function(){
		var keyword_id = $(this).val();
		var myrow = new DataRow(keyword_id,'cur');
		if(myrow.o_select.val() == "del"){
			v_del_count = v_del_count + 1;
		}
		if(myrow.o_select.val() == "bid"){
			var v_new_price = parseFloat(myrow.o_new_price.val());
			var v_max_price = parseFloat(myrow.o_max_price.text());
			if(v_new_price > v_max_price){
				v_plus_count = v_plus_count + 1;
			}
			else if(v_new_price < v_max_price){
				v_fall_count = v_fall_count + 1;
			}
			else if(v_new_price == v_max_price){
				error_keyword_id = keyword_id;
				myrow.o_new_price.focus();
				return false;
			}
		}
	});
	if(error_keyword_id != ""){
		alert("关键词【" + $("#id_cur_word_"+error_keyword_id).text() + "】出价与原价相同，请修改价格或取消改价操作。");
		return false;
	}
	//校验选中的值
	var v_keyword_count = v_del_count + v_plus_count + v_fall_count;
	if(v_keyword_count == 0 && v_cat_checked==false){
		alert("请选择需要提交的关键词或类目出价！");
		return false;
	}
	//汇总提交信息
	confirm_msg = "即将提交：\n";
	if(v_cat_checked==true){
		confirm_msg += "类目出价："+opt_type_text+"；\n";	
	}
	if(v_keyword_count > 0){
		confirm_msg += "关键词：";
		if(v_plus_count>0){confirm_msg += "加价"+v_plus_count+"个，";	}
		if(v_fall_count>0){confirm_msg += "降价"+v_fall_count+"个，";	}
		if(v_del_count>0){confirm_msg += "删除"+v_del_count+"个，";}
	}
	confirm_msg += "确认提交吗？";
	if(confirm(confirm_msg)){
		$('#id_curwords_submit').onclick=function(){return false;}
		show_center_tip("正在提交到直通车后台");
		Dajax.web_monitor_adgroup_submit({'adgroup_id':'99196734','form_data':$('#id_curwords_form').formSerialize()});			
	}
}

//一键提交加词
function addwords_submit(){
	//计算加词个数
	var v_add_count = 0;
	$("input[id^=fthid_add_chdid_]:checked").each(function(){
		v_add_count = v_add_count + 1;
	});
	if(v_add_count == 0){
		alert("请选择需要添加的关键词！");
		return false;
	}
	if(confirm("即将添加"+v_add_count+"个关键词，确认提交吗？")){
		$('#id_addwords_submit').onclick=function(){return false;}
		show_center_tip("正在添加关键词到直通车后台");	
		Dajax.web_monitor_adgroup_submit({'adgroup_id':'99196734','form_data':$('#id_addwords_form').formSerialize()});			
	}
}

//修改了优化策略
function do_change_type(){
	$('#id_rate').val('0');
	$('#id_rate').css('border','2px red solid');
}

//修改了调价幅度
function do_change_rate(){
	show_center_tip("正在重新计算优化建议");
	var v_rpt_days = $("input[type='radio'][name='rpt_days']:checked").val();
	$('#id_rpt_days').val(v_rpt_days);
	$('#id_strategy_form').submit();
}

//修改了操作建议后（只针对已有词和类目出价）
function do_change_select(my_idx,my_type){
	var myrow = new DataRow(my_idx,my_type);				
	myrow.o_row.removeClass();
	myrow.o_reset.addClass("hide");	
	if(myrow.o_select.val() == "del"){
		myrow.o_chbox.attr("checked",true); //自动选中
		myrow.o_row.addClass('del_bg tar');
		myrow.o_new_price.attr("readonly","readonly");
		myrow.o_sort.text("1");
	}
	else if(myrow.o_select.val() == "bid"){
		myrow.o_chbox.attr("checked",true); //自动选中
		myrow.o_new_price.removeAttr("readonly");
		myrow.o_sort.text("2"); //不准确，可能是加价或降价
		check_input_price(my_idx,my_type,myrow);//判断价格变化
		myrow.o_new_price.focus();
	}
	else{
		myrow.o_chbox.attr("checked",false); //取消勾选
		myrow.o_row.addClass('keep_bg tar');
		myrow.o_new_price.attr("readonly","readonly");
		myrow.o_sort.text("0");
	}
	//计算优化建议汇总
	calculate_checked_count(my_type);
}

//修改关键词的价格
function do_change_price(my_idx, my_type){
	check_input_price(my_idx, my_type);//检查输入的价格变化
	calculate_checked_count(my_type);//计算优化建议汇总
}

//重置出价为系统建议的价格
function do_reset_price(my_idx, my_type){
	var myrow = new DataRow(my_idx,my_type);	
	myrow.o_new_price.attr("value",myrow.v_bak_price);//设置为原值
	myrow.o_reset.addClass("hide");//隐藏图标
	check_input_price(my_idx, my_type, myrow);//检查输入的价格变化
	calculate_checked_count(my_type);//计算优化建议汇总
}

//修改了价格后，检查价格变化
function check_input_price(my_idx, my_type, myrow){
	if(myrow == null){
		var myrow = new DataRow(my_idx,my_type);
	}
	myrow.o_chbox.attr("checked",true);
	var v_need_reset = false;
	var v_new_price = myrow.o_new_price.val();
	//校验合法性，非法则恢复为原值
	if(isNaN(v_new_price) || parseFloat(v_new_price)<0.05 || parseFloat(v_new_price)>99.99){
		v_need_reset = true;
		alert("出价错误！必须是0.05至99.99之间的数字，将恢复为原值，请重新出价。");
	}
	else if(parseFloat(v_new_price)>5 && !confirm("您设置的出价大于5.00元，确认要使用该出价吗？")){
		v_need_reset = true;
	}
	if(v_need_reset == true){		
		myrow.o_new_price.attr("value",myrow.v_bak_price);
		myrow.o_new_price.focus();
		v_new_price = myrow.v_bak_price;
	}
	else{
		//保留2位小数，四舍五入价格，显示和隐藏图标
		v_new_price = number_fixed(parseFloat(v_new_price),2)
		myrow.o_new_price.attr("value",v_new_price);
	}
	
	if(parseFloat(v_new_price) != parseFloat(myrow.v_bak_price)){
		myrow.o_reset.removeClass("hide");
	}else{
		myrow.o_reset.addClass("hide");
	}

	//修改加价、降价样式
	var v_row_class = "plus_bg tar";
	if(parseFloat(v_new_price) < parseFloat(myrow.o_max_price.text())){
		v_row_class = "fall_bg tar";
	}
	myrow.o_row.removeClass();
	myrow.o_row.addClass(v_row_class);
}

//计算被选中的记录数，只计算现有关键词和可添加的关键词，不计算类目和定向
function calculate_checked_count(my_type){
	if(my_type=="cur"){//现有关键词
		var v_del_count = 0, v_plus_count = 0, v_fall_count = 0;
		$("input[id^=fthid_cur_chdid_]:checked").each(function(){
			var keyword_id = $(this).val();
			var myrow = new DataRow(keyword_id,'cur');
			if(myrow.o_select.val() == "del"){
				v_del_count = v_del_count + 1;
			}
			if(myrow.o_select.val() == "bid"){
				var v_new_price = parseFloat(myrow.o_new_price.val());
				var v_max_price = parseFloat(myrow.o_max_price.text());
				if(!isNaN(v_new_price)){
					if(v_new_price > v_max_price){
						v_plus_count = v_plus_count + 1;
					}
					else if(v_new_price < v_max_price){
						v_fall_count = v_fall_count + 1;
					}
				}
			}
		});
		$(".del_count").text(v_del_count);
		$(".plus_count").text(v_plus_count);
		$(".fall_count").text(v_fall_count);
	}
	else if(my_type=="add"){//可添加的关键词
		$(".add_count").text($("input[id^=fthid_add_chdid_]:checked").size());
	}
	else if(my_type=="cat"){//类目出价
		$("#id_suggest_catmatch").hide();
		var catmatch_id = 11768716442;
		var catrow = new DataRow(catmatch_id,'cat');
		if(catrow.o_chbox.is(':checked')){
			if(catrow.o_select.val()=="del" || catrow.o_select.val()=="bid"){
				$(".suggest_catmatch").text(catrow.o_select.find("option:selected").text());
				$("#id_suggest_catmatch").show();
			}
		}
	}
}

//点击回车，页面过滤候选词
function enter_filter_addword(event){
	var e = event||window.event;
	var curr_key = e.keyCode||e.which||e.charCode;
	if(curr_key == 13){
		do_filter_addword();
	}
}

//响应页面onchange事件，页面过滤候选词
function do_filter_addword(event){
	var filter_word_array = new Array();
	var filter_word = $.trim($("#id_filter_addword").val());//去左右空格
	filter_word = filter_word.replaceAll(" ", "，", false);//将空格替换为，
	filter_word = filter_word.replaceAll(",", "，", false);//将,替换为，
	if(filter_word != ""){
		temp_array = filter_word.split("，");
		for(var kk=0; kk<temp_array.length; kk++){
			temp_word = $.trim(temp_array[kk]);//去所有空格
			if(temp_word != ""){
				filter_word_array.push(temp_word);
			}
		}
	}
	/*
	alert("filter_word==>"+filter_word);
	alert("filter_word_array.length==>"+filter_word_array.length);
	*/
	//匹配关键字
	var is_contain = $("input[name='is_contain']:checked").val();
	$("input[id^=fthid_add_chdid_]").each(function(){
		var show_data = true;
		var o_tmpword = $("#id_add_word_"+$(this).val()); 
		var o_tmpbox = $("#fthid_add_chdid_"+$(this).val());	
		if(filter_word_array.length>0){
			var temp_is_contain = false;
			for(var jj=0; jj<filter_word_array.length; jj++){
				if(o_tmpword.text().indexOf(filter_word_array[jj])!=-1){
					temp_is_contain = true;
					break;
				}
			}
			//如果选择的是"包含"，则只需要包含filter_word_array中的任何一个就可以显示；如果选择的是"不包含"，则只有filter_word_array中的全部都不包含才可以显示
			if((temp_is_contain == true && is_contain == "false")|| 
			   (temp_is_contain == false && is_contain == "true")){	
				show_data = false;
			}
		}
		else{
			show_data = false;
		}
		if(show_data == true){
			o_tmpbox.attr("checked",true);
			o_tmpword.addClass("filtered");
		}
		else{
			o_tmpbox.attr("checked",false);
			o_tmpword.removeClass("filtered");
		}		
	});
	calculate_checked_count("add");//重新计算选中的词
}

//设置新词的价格
function do_setting_price(){
	if(!check_limit_price()) return false;
	if(confirm("即将修改所有候选词的[初始出价]，如果您有修改出价且尚未提交，将被全部重置，确定要执行吗？")){
		var v_price_multi = parseFloat($("#id_price_multi").val());
		var v_limit_price = parseFloat($("#id_limit_price").val());
		var v_default_price = parseFloat($("#adgroup_default_price").val());
		$("input[id^=fthid_add_chdid_]").each(function(){
			var index = $(this).val();
			var v_init_price = 0;
			if(v_price_multi == 0){
				v_init_price = v_default_price;		
			}else{
				var v_cat_g_cpc = $("#cat_g_cpc_"+index).text();
				if(isNaN(v_cat_g_cpc)){
					v_init_price = v_default_price;
				}else{
					v_init_price = v_price_multi * parseFloat(v_cat_g_cpc);
				}
			}
			if(v_init_price > v_limit_price){
				v_init_price = v_limit_price;
			}
			v_init_price = v_init_price.toFixed(2);
			if(v_init_price < 0.05){
				v_init_price = 0.05;
			}
			else if(v_init_price > 99.99){
				v_init_price = 99.99;
			}
			$("#add_new_price_"+index).val(v_init_price);
		});	
	}
}

//校验新词限价的合法性
function check_limit_price(){
	var is_correct = true;
	var o_limit_price = $("#id_limit_price");
	if(o_limit_price.val() > 5.0){
		if(!confirm("您设置的[新词限价]大于5.0元，确实设置为"+o_limit_price.val()+"元吗？")){
			is_correct = false;
		}
	}
	if(isNaN(o_limit_price.val()) || o_limit_price.val() < 0.05 || o_limit_price.val() > 99.99){
		alert("[新词限价]设置错误，必须是介于0.05~99.99之间的数字，请修改");
		is_correct = false;
	}
	if(!is_correct){
		o_limit_price.val(5.0);
		o_limit_price.focus();
		return false;		
	}else{
		return true;	
	}
}
		
//搜索页面上的关键词，是否应该高亮而不隐藏
function search_tabs_words(data_type){
	if(data_type=="cur"){
		var search_count = 0;
		var keyword = $.trim($('#id_curwords_search').val());
		$("#table_sorter_cur span[id^=id_cur_word_]").each(function(){
			if(keyword != "" && $(this).text().indexOf(keyword) != -1){
				$(this).addClass("filtered");
				search_count = search_count+1;
			}else{
				$(this).removeClass("filtered");
			}
		});
		if(keyword != ""){
			$('#id_search_count').text(search_count+"个");
		}else{
			$('#id_search_count').text("");
		}
	}	
}

/*提交后的调用*/
function do_submited_precess(deled_id_list, upded_id_list, added_id_list, del_failed_list, upd_failed_list, add_failed_list, upded_catmatch, is_addwords_submit){	
	/*alert("deled_id_list==>"+deled_id_list);alert("upded_id_list==>"+upded_id_list);alert("added_id_list==>"+added_id_list);
	alert("del_failed_list==>"+del_failed_list);alert("upd_failed_list==>"+upd_failed_list);alert("add_failed_list==>"+add_failed_list);
	alert("upded_catmatch==>"+upded_catmatch);alert("is_addwords_submit==>"+is_addwords_submit);*/
	
	var deled_count=0, upded_count=0, added_count=0, del_failed_count=0, upd_failed_count=0, add_failed_count=0;
	if(is_addwords_submit=="false"){
		deled_count = deled_success_action(deled_id_list);
		upded_count = upded_success_action(upded_id_list);
		del_failed_count = del_failed_action(del_failed_list,deled_count);
		upd_failed_count = upd_failed_action(upd_failed_list,upded_count);
		upded_catmatch_action(upded_catmatch);
		calculate_checked_count("cat");
		calculate_checked_count("cur");
		$('#id_curwords_submit').onclick=function(){curwords_submit();}
	}
	else{
		added_count = added_success_action(added_id_list);
		add_failed_count = add_failed_action(add_failed_list,added_count);
		calculate_checked_count("add");
		$('#id_addwords_submit').onclick=function(){addwords_submit();}
	}
	
	var cat_size = $("input[id^=fthid_cur_chdid_cat_]").size();
	var all_current_size = $("input[id^=fthid_cur_chdid_]").size();
	var all_added_count = $("#table_sorter_add thead .keep_bg").size();
	new_current_size = all_current_size + all_added_count - cat_size;//加上添加成功的,减去类目出价
	$('#current_count').text(new_current_size);
	$('#candidate_count').text($("input[id^=fthid_add_chdid_]").size());
	$('#center_tip_popup').hide();
	
	var alert_msg = "";
	if(added_count>0){alert_msg+="成功添加"+added_count+"个；";	}
	if(deled_count>0){alert_msg+="成功删除"+deled_count+"个；";	}
	if(upded_count>0){alert_msg+="成功改价"+upded_count+"个；\n";	}
	if(add_failed_count>0){alert_msg+="添加失败"+add_failed_count+"个；";	}
	if(del_failed_count>0){alert_msg+="删除失败"+del_failed_count+"个；";	}
	if(upd_failed_count>0){alert_msg+="改价失败"+upd_failed_count+"个；";	}
	alert("优化建议提交完成！"+alert_msg);
}

//处理删除成功的记录
function deled_success_action(deled_id_list){
	var deled_count = 0;
	if(deled_id_list != ""){
		deled_id_array = deled_id_list.split(",");
		deled_count = deled_id_array.length;
		for(var i=0; i<deled_count; i++){
			$("#cur_row_"+deled_id_array[i]).remove();
		}
	}
	return deled_count;
}

//处理修改成功的记录
function upded_success_action(upded_id_list){
	var upded_count = 0;
	if(upded_id_list != ""){
		upded_id_array = upded_id_list.split(",");
		upded_count = upded_id_array.length;
		for(var i=0; i<upded_count; i++){
			action_for_succeed("cur",upded_id_array[i],"");
		}
	}
	return upded_count;
}

//处理添加成功的记录
function added_success_action(added_id_list){
	var added_count = 0;
	if(added_id_list != ""){
		added_id_array = added_id_list.split(",");
		added_count = added_id_array.length;	
		for(var i=0; i<added_count; i++){
			action_for_succeed("add",added_id_array[i],"");
		}	
	}
	return added_count;	
}

//处理删除成功的记录
function upded_catmatch_action(upded_catmatch){
	if(upded_catmatch != ""){
		var upded_cat_array = upded_catmatch.split(",");
		action_for_succeed("cat",upded_cat_array[0],upded_cat_array[1]);
	}		
}

//处理删除失败的记录
function del_failed_action(del_failed_list,deled_count){
	var del_failed_count = 0;
	if(del_failed_list != ""){
		del_failed_array = del_failed_list.split(",");
		del_failed_count = del_failed_array.length;
		if(deled_count>0){
			for(var i=0; i<del_failed_count; i++){
				$("#fthid_cur_chdid_"+del_failed_array[i]).attr("checked",false);//删除失败的去勾选
			}		
		}		
	}
	return del_failed_count;			
}

//处理修改失败的记录
function upd_failed_action(upd_failed_list,upded_count){
	var upd_failed_count = 0;
	if(upd_failed_list != ""){
		upd_failed_array = upd_failed_list.split(",");
		upd_failed_count = upd_failed_array.length;
		if(upded_count>0){
			for(var i=0; i<upd_failed_count; i++){
				$("#fthid_cur_chdid_"+upd_failed_array[i]).attr("checked",false);//改价失败的去勾选
			}		
		}		
	}
	return upd_failed_count;		
}

//处理添加失败的记录，添加失败的重复词如何处理
function add_failed_action(add_failed_list,added_count){
	var add_failed_count = 0;	
	if(add_failed_list != ""){
		add_failed_array = add_failed_list.split(",");
		add_failed_count = add_failed_array.length;
		if(added_count>0){
			for(var i=0; i<add_failed_count; i++){
				$("#fthid_add_chdid_"+add_failed_array[i]).attr("checked",false);//添加失败的去勾选
			}		
		}
	}
	return add_failed_count;		
}

//为添加、改价成功的做后继处理
function action_for_succeed(my_type,my_idx,cat_result){
	if(my_type=="add"){//处理添加成功的[只有成功的]
		var myrow = new DataRow(my_idx,my_type);	
		$("#add_note_"+my_idx).text("已添加");
		$("#id_add_word_"+my_idx).removeClass("filtered");
		myrow.o_reset.addClass("hide");
		myrow.o_new_price.attr("readonly","readonly");
		myrow.o_row.removeClass("plus_bg");
		myrow.o_row.addClass("keep_bg");
		myrow.o_chbox.attr("checked",false);
		myrow.o_chbox.attr("disabled",true);
		myrow.o_chbox.remove();
		$(myrow.o_row).insertAfter($("#id_add_title"));
	}
	else{
		var myrow = new DataRow(my_idx,my_type);
		var v_option_text = get_option_text(myrow.o_select, parseFloat(myrow.o_max_price.text()), parseFloat(myrow.o_new_price.val()));
		if(my_type=="cur"){//处理改价成功的[只有成功的]	
			myrow.o_max_price.text(myrow.o_new_price.val());
		}
		else if(my_type=="cat"){//处理类目出价[包含失败的]						
			if(cat_result=="online"){ myrow.o_max_price.text(myrow.o_new_price.val());}
			else if(cat_result=="offline"){ v_option_text="已关闭"; }
			else if(cat_result=="failed"){ v_option_text="失败"; }
		}
		myrow.o_select.get(0).options.add(new Option(v_option_text, ""));
		myrow.o_select.val("");//选中刚添加的项	
		myrow.o_reset.addClass("hide");
		myrow.o_new_price.attr("readonly","readonly");
		myrow.o_chbox.attr("checked",false);
		myrow.o_row.removeClass();
		myrow.o_row.addClass('keep_bg tar');					
	}
}

//修改select下拉框的内容，返回需要被选中的文本
function get_option_text(select_obj,old_value,input_value){
	if(select_obj.find("option").length>3){
		select_obj.children("option").each(function(){
			var tmp_value = $(this).val();
			if(tmp_value != "del" && tmp_value != "bid" && tmp_value != "keep"){
				$(this).remove();
			}
		});				
	}
	var v_option_text = "";
	if(old_value < input_value)
		v_option_text="已加价";
	else
		v_option_text="已降价";
	return v_option_text;
}

//查看关键词趋势
function show_k_trend(keyword_id){
	var v_word = $("#id_cur_word_"+keyword_id).text();
	Dajax.web_show_keyword_trend({'keyword_id':keyword_id,'word':v_word});
}
//查看类目趋势
function show_c_trend(adgroup_id){
	Dajax.web_show_catmatch_trend({'adgroup_id':adgroup_id});
}
//显示和隐藏基础数据
function base_data_toggle(){	
	if($('#id_base_data').attr('checked')=='checked'){
		$('.base_data').show();
	}else{
		$('.base_data').hide();
	} 
}
//显示和隐藏转化数据
function conv_data_toggle(){
	if($('#id_conv_data').attr('checked')=='checked'){
		$('.conv_data').show();
	}else{
		$('.conv_data').hide();
	} 
}
//字符串替换
String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase){ 
	if(!RegExp.prototype.isPrototypeOf(reallyDo)){ 
		return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith); 
	} 
	else{ 
		return this.replace(reallyDo, replaceWith); 
	} 
}
//四舍五入，参数必须是Float类型，不能是String
function number_fixed(data,scale){
	return (parseInt(data * Math.pow(10, scale) + 0.5)/ Math.pow(10, scale)).toString();
}
function draw_adgroup_trend_chart(){
	var chart = new Highcharts.Chart({
		chart: {renderTo: 'trend_chart',zoomType: 'xy'},
		title: {text: ''},
		subtitle: {text: ''},
		xAxis: [{categories: ['5-29','5-30','5-31','6-1','6-2','6-3']}],
		yAxis: [{
			gridLineWidth: 0,
			title: {text: '',style: {color: '#0000B7'}},
			labels: {formatter: function() {return this.value +'次';},style: {color: '#0000B7' }},
			opposite: false
		},{
			gridLineWidth: 0,
			title: {text: '',style: {color: '#6D00DB'}},
			labels: {formatter: function() {return this.value +'元';},style: {color: '#6D00DB' }},
			opposite: false
		},{
			gridLineWidth: 0,
			title: {text: '',style: {color: '#4572A7'}},
			labels: {formatter: function() {return this.value +'%';},style: {color: '#4572A7' }},
			opposite: false
		},{
			gridLineWidth: 0,
			title: {text: '',style: {color: '#E84B00'}},
			labels: {formatter: function() {return this.value +'元';},style: {color: '#E84B00' }},
			opposite: true
		},{
			gridLineWidth: 0,
			title: {text: '',style: {color: '#FF0B85'}},
			labels: {formatter: function() {return this.value +'笔';},style: {color: '#FF0B85' }},
			opposite: true
		},{
			gridLineWidth: 0,
			title: {text: '',style: {color: '#FF0B0B'}},
			labels: {formatter: function() {return this.value +'';},style: {color: '#FF0B0B' }},
			opposite: true
		},
		],
		tooltip: {formatter: function() {
				var unit = {
					'点击量': '次',
					'平均点击花费': '元',
					'点击率': '%',
					'花费': '元',
					'成交额': '元',
					'成交笔数': '笔',
					'投资回报率': '',
					'点击转化率': '%'
				}[this.series.name];
				return this.x +'日 '+ this.series.name + " " + this.y + unit;
			}
		},
		legend: {backgroundColor: '#FFFFFF'},
		series: [{
			name: '点击量',
			color: '#0000B7',
			type: 'spline',
			yAxis: 0,
			data: [194 ,187 ,151 ,158 ,162 ,189 ],
			visible: true
		},{
			name: '平均点击花费',
			color: '#6D00DB',
			type: 'spline',
			yAxis: 1,
			data: [0.79 ,0.8 ,0.86 ,0.79 ,0.85 ,0.78 ],
			visible: true
		},{
			name: '点击率',
			color: '#4572A7',
			type: 'spline',
			yAxis: 2,
			data: [0.38 ,0.4 ,0.33 ,0.36 ,0.33 ,0.35 ],
			visible: false
		},{
			name: '花费',
			color: '#E84B00',
			type: 'spline',
			yAxis: 3,
			data: [152.31 ,149.74 ,129.1 ,124.66 ,137.31 ,146.82 ],
			visible: false
		},{
			name: '成交额',
			color: '#AA46a3',
			type: 'spline',
			yAxis: 3,
			data: [687.4 ,477.8 ,0 ,0 ,149.4 ,298.8 ],
			visible: false
		},{
			name: '成交笔数',
			color: '#FF0B85',
			type: 'spline',
			yAxis: 4,
			data: [4 ,3 ,0 ,0 ,1 ,2 ],
			visible: false
		},{
			name: '投资回报率',
			color: '#FF0B0B',
			type: 'spline',
			yAxis: 5,
			data: [4.51 ,3.19 ,0.0 ,0.0 ,1.09 ,2.04 ],
			visible: false
		},{
			name: '点击转化率',
			color: '#00F700',
			type: 'spline',
			yAxis: 2,
			data: [2.06 ,1.6 ,0.0 ,0.0 ,0.62 ,1.06 ],
			visible: false
		}]
	});	
}

function draw_keyword_trend_chart(id_container,category_list,series_list){
	chart = new Highcharts.Chart({
		chart: {renderTo: id_container, zoomType: 'xy'},
		title: {text: ''},
		subtitle: {text: ''},
		xAxis: [{categories: category_list}],
		yAxis: [{
			gridLineWidth: 1,//展现量、点击量
			title: {text: '',style: {color: '#89A54E'}},
			labels: {formatter: function() {return this.value +'次';},style: {color: '#89A54E'}}
		}, {
			gridLineWidth: 1,//平均点击花费、出价
			title: {text: '',style: {color: '#6D00DB'}},
			labels: {formatter: function() {return this.value +'元';},style: {color: '#6D00DB'}}			
		},{
			gridLineWidth: 1,//点击率
			title: {text: '',style: {color: '#4572A7'}},
			labels: {formatter: function() {return this.value +'%';},style: {color: '#4572A7'}}
		}, {
			gridLineWidth: 1,//花费、成交额
			title: {text: '',style: {color: '#E84B00'}},
			labels: {formatter: function() {return this.value +'元';},style: {color: '#E84B00'}},
			opposite: true
		}, {
			gridLineWidth: 1,//成交笔数
			title: {text: '',style: {color: '#FF0B85'}},
			labels: {formatter: function() {return this.value +'笔';},style: {color: '#FF0B85'}},
			opposite: true
		}, {
			gridLineWidth: 1,//投资回报率
			title: {text: '',style: {color: '#FF0B0B'}},
			labels: {formatter: function() {return this.value +'';},style: {color: '#FF0B0B'}},
			opposite: true
		}],
		tooltip: {formatter: function() {
				var unit = {'展现量': '次','点击量': '次','平均点击花费': '元','点击率': '%','花费': '元','成交额': '元','成交笔数': '笔','投资回报率': '','出价': '元'}[this.series.name];
				return this.x +'日 '+this.series.name +' '+ this.y + unit;
			}
		},
		legend: {backgroundColor: '#FFFFFF'},
		series: [{name: '展现量',	 color: '#89A54E',type: 'spline',yAxis: 0,data: series_list[0].data,visible: false},
				 {name: '点击量',	 color: '#0000B7',type: 'spline',yAxis: 0,data: series_list[1].data,visible: true},
				 {name: '平均点击花费',color: '#6D00DB',type: 'spline',yAxis: 1,data: series_list[2].data,visible: false},
				 {name: '点击率',	 color: '#4572A7',type: 'spline',yAxis: 2,data: series_list[3].data,visible: false},
				 {name: '花费',		 color: '#E84B00',type: 'spline',yAxis: 3,data: series_list[4].data,visible: true},
				 {name: '成交额',	 color: '#AA46a3',type: 'spline',yAxis: 3,data: series_list[5].data,visible: false},
				 {name: '成交笔数',	 color: '#FF0B85',type: 'spline',yAxis: 4,data: series_list[6].data,visible: false},
				 {name: '投资回报率',	 color: '#FF0B0B',type: 'spline',yAxis: 5,data: series_list[7].data,visible: false},
				 {name: '出价',		 color: '#00F700',type: 'spline',yAxis: 1,data: series_list[8].data,visible: false}]
	});
}

function draw_catmatch_trend_chart(id_container,category_list,series_list){
	chart = new Highcharts.Chart({
		chart: {renderTo: id_container, zoomType: 'xy'},
		title: {text: ''},
		subtitle: {text: ''},
		xAxis: [{categories: category_list}],
		yAxis: [{
			gridLineWidth: 1,//展现量、点击量
			title: {text: '',style: {color: '#89A54E'}},
			labels: {formatter: function() {return this.value +'次';},style: {color: '#89A54E'}}
		}, {
			gridLineWidth: 1,//平均点击花费
			title: {text: '',style: {color: '#6D00DB'}},
			labels: {formatter: function() {return this.value +'元';},style: {color: '#6D00DB'}}			
		},{
			gridLineWidth: 1,//点击率
			title: {text: '',style: {color: '#4572A7'}},
			labels: {formatter: function() {return this.value +'%';},style: {color: '#4572A7'}}
		}, {
			gridLineWidth: 1,//花费、成交额
			title: {text: '',style: {color: '#E84B00'}},
			labels: {formatter: function() {return this.value +'元';},style: {color: '#E84B00'}},
			opposite: true
		}, {
			gridLineWidth: 1,//成交笔数
			title: {text: '',style: {color: '#FF0B85'}},
			labels: {formatter: function() {return this.value +'笔';},style: {color: '#FF0B85'}},
			opposite: true
		}, {
			gridLineWidth: 1,//投资回报率
			title: {text: '',style: {color: '#FF0B0B'}},
			labels: {formatter: function() {return this.value +'';},style: {color: '#FF0B0B'}},
			opposite: true
		}],
		tooltip: {formatter: function() {
				var unit = {'展现量': '次','点击量': '次','平均点击花费': '元','点击率': '%','花费': '元','成交额': '元','成交笔数': '笔','投资回报率': ''}[this.series.name];
				return this.x +'日 '+this.series.name +' '+ this.y + unit;
			}
		},
		
		legend: {backgroundColor: '#FFFFFF'},
		series: [{name: '展现量',	 color: '#89A54E',type: 'spline',yAxis: 0,data: series_list[0].data,visible: false},
				 {name: '点击量',	 color: '#0000B7',type: 'spline',yAxis: 0,data: series_list[1].data,visible: true},
				 {name: '平均点击花费',color: '#6D00DB',type: 'spline',yAxis: 1,data: series_list[2].data,visible: false},
				 {name: '点击率',	 color: '#4572A7',type: 'spline',yAxis: 2,data: series_list[3].data,visible: false},
				 {name: '花费',		 color: '#E84B00',type: 'spline',yAxis: 3,data: series_list[4].data,visible: true},
				 {name: '成交额',	 color: '#AA46a3',type: 'spline',yAxis: 3,data: series_list[5].data,visible: false},
				 {name: '成交笔数',	 color: '#FF0B85',type: 'spline',yAxis: 4,data: series_list[6].data,visible: false},
				 {name: '投资回报率',	 color: '#FF0B0B',type: 'spline',yAxis: 5,data: series_list[7].data,visible: false}]
	});
}
