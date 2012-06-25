$(function(){
	reload_checkbox_click();
	do_change_select('11768716442','cat');
	$("#monitor_list").addClass("active");
	$("#slide_left").html($("#monitor_detail_desc").html());

	$("input[name='rpt_days']").change(function(){
		show_center_tip("�������»�ȡͳ������");
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

//�������Զ�����
function DataRow(index,type){
	var _this = this; //��this�����������Ժ���_this����this
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

//���ظ�checkbox��click�¼�
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

//һ���ύ�ļ�
function curwords_submit(){
	//������Ŀ����
	var v_cat_checked = false, opt_type_text = "";
	var catmatch_id = 11768716442;
	var catrow = new DataRow(catmatch_id,'cat');
	if(catrow.o_chbox.is(':checked')){
		opt_type_text = catrow.o_select.find("option:selected").text();
		if(catrow.o_select.val() == "bid"){
			opt_type_text = "���ò��ļ�";	
			if(parseFloat(catrow.o_new_price.val()) == parseFloat(catrow.o_max_price.text())){
				alert("����Ŀ���ۡ����¼���ԭ����ͬ�����޸ļ۸��ȡ���ļ۲�����");
				catrow.o_new_price.focus();
				return false;
			}
		}
		v_cat_checked = true;		
	}
	//����ɾ�ʡ��ļ۸���
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
		alert("�ؼ��ʡ�" + $("#id_cur_word_"+error_keyword_id).text() + "��������ԭ����ͬ�����޸ļ۸��ȡ���ļ۲�����");
		return false;
	}
	//У��ѡ�е�ֵ
	var v_keyword_count = v_del_count + v_plus_count + v_fall_count;
	if(v_keyword_count == 0 && v_cat_checked==false){
		alert("��ѡ����Ҫ�ύ�Ĺؼ��ʻ���Ŀ���ۣ�");
		return false;
	}
	//�����ύ��Ϣ
	confirm_msg = "�����ύ��\n";
	if(v_cat_checked==true){
		confirm_msg += "��Ŀ���ۣ�"+opt_type_text+"��\n";	
	}
	if(v_keyword_count > 0){
		confirm_msg += "�ؼ��ʣ�";
		if(v_plus_count>0){confirm_msg += "�Ӽ�"+v_plus_count+"����";	}
		if(v_fall_count>0){confirm_msg += "����"+v_fall_count+"����";	}
		if(v_del_count>0){confirm_msg += "ɾ��"+v_del_count+"����";}
	}
	confirm_msg += "ȷ���ύ��";
	if(confirm(confirm_msg)){
		$('#id_curwords_submit').onclick=function(){return false;}
		show_center_tip("�����ύ��ֱͨ����̨");
		Dajax.web_monitor_adgroup_submit({'adgroup_id':'99196734','form_data':$('#id_curwords_form').formSerialize()});			
	}
}

//һ���ύ�Ӵ�
function addwords_submit(){
	//����Ӵʸ���
	var v_add_count = 0;
	$("input[id^=fthid_add_chdid_]:checked").each(function(){
		v_add_count = v_add_count + 1;
	});
	if(v_add_count == 0){
		alert("��ѡ����Ҫ��ӵĹؼ��ʣ�");
		return false;
	}
	if(confirm("�������"+v_add_count+"���ؼ��ʣ�ȷ���ύ��")){
		$('#id_addwords_submit').onclick=function(){return false;}
		show_center_tip("������ӹؼ��ʵ�ֱͨ����̨");	
		Dajax.web_monitor_adgroup_submit({'adgroup_id':'99196734','form_data':$('#id_addwords_form').formSerialize()});			
	}
}

//�޸����Ż�����
function do_change_type(){
	$('#id_rate').val('0');
	$('#id_rate').css('border','2px red solid');
}

//�޸��˵��۷���
function do_change_rate(){
	show_center_tip("�������¼����Ż�����");
	var v_rpt_days = $("input[type='radio'][name='rpt_days']:checked").val();
	$('#id_rpt_days').val(v_rpt_days);
	$('#id_strategy_form').submit();
}

//�޸��˲��������ֻ������дʺ���Ŀ���ۣ�
function do_change_select(my_idx,my_type){
	var myrow = new DataRow(my_idx,my_type);				
	myrow.o_row.removeClass();
	myrow.o_reset.addClass("hide");	
	if(myrow.o_select.val() == "del"){
		myrow.o_chbox.attr("checked",true); //�Զ�ѡ��
		myrow.o_row.addClass('del_bg tar');
		myrow.o_new_price.attr("readonly","readonly");
		myrow.o_sort.text("1");
	}
	else if(myrow.o_select.val() == "bid"){
		myrow.o_chbox.attr("checked",true); //�Զ�ѡ��
		myrow.o_new_price.removeAttr("readonly");
		myrow.o_sort.text("2"); //��׼ȷ�������ǼӼۻ򽵼�
		check_input_price(my_idx,my_type,myrow);//�жϼ۸�仯
		myrow.o_new_price.focus();
	}
	else{
		myrow.o_chbox.attr("checked",false); //ȡ����ѡ
		myrow.o_row.addClass('keep_bg tar');
		myrow.o_new_price.attr("readonly","readonly");
		myrow.o_sort.text("0");
	}
	//�����Ż��������
	calculate_checked_count(my_type);
}

//�޸Ĺؼ��ʵļ۸�
function do_change_price(my_idx, my_type){
	check_input_price(my_idx, my_type);//�������ļ۸�仯
	calculate_checked_count(my_type);//�����Ż��������
}

//���ó���Ϊϵͳ����ļ۸�
function do_reset_price(my_idx, my_type){
	var myrow = new DataRow(my_idx,my_type);	
	myrow.o_new_price.attr("value",myrow.v_bak_price);//����Ϊԭֵ
	myrow.o_reset.addClass("hide");//����ͼ��
	check_input_price(my_idx, my_type, myrow);//�������ļ۸�仯
	calculate_checked_count(my_type);//�����Ż��������
}

//�޸��˼۸�󣬼��۸�仯
function check_input_price(my_idx, my_type, myrow){
	if(myrow == null){
		var myrow = new DataRow(my_idx,my_type);
	}
	myrow.o_chbox.attr("checked",true);
	var v_need_reset = false;
	var v_new_price = myrow.o_new_price.val();
	//У��Ϸ��ԣ��Ƿ���ָ�Ϊԭֵ
	if(isNaN(v_new_price) || parseFloat(v_new_price)<0.05 || parseFloat(v_new_price)>99.99){
		v_need_reset = true;
		alert("���۴��󣡱�����0.05��99.99֮������֣����ָ�Ϊԭֵ�������³��ۡ�");
	}
	else if(parseFloat(v_new_price)>5 && !confirm("�����õĳ��۴���5.00Ԫ��ȷ��Ҫʹ�øó�����")){
		v_need_reset = true;
	}
	if(v_need_reset == true){		
		myrow.o_new_price.attr("value",myrow.v_bak_price);
		myrow.o_new_price.focus();
		v_new_price = myrow.v_bak_price;
	}
	else{
		//����2λС������������۸���ʾ������ͼ��
		v_new_price = number_fixed(parseFloat(v_new_price),2)
		myrow.o_new_price.attr("value",v_new_price);
	}
	
	if(parseFloat(v_new_price) != parseFloat(myrow.v_bak_price)){
		myrow.o_reset.removeClass("hide");
	}else{
		myrow.o_reset.addClass("hide");
	}

	//�޸ļӼۡ�������ʽ
	var v_row_class = "plus_bg tar";
	if(parseFloat(v_new_price) < parseFloat(myrow.o_max_price.text())){
		v_row_class = "fall_bg tar";
	}
	myrow.o_row.removeClass();
	myrow.o_row.addClass(v_row_class);
}

//���㱻ѡ�еļ�¼����ֻ�������йؼ��ʺͿ���ӵĹؼ��ʣ���������Ŀ�Ͷ���
function calculate_checked_count(my_type){
	if(my_type=="cur"){//���йؼ���
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
	else if(my_type=="add"){//����ӵĹؼ���
		$(".add_count").text($("input[id^=fthid_add_chdid_]:checked").size());
	}
	else if(my_type=="cat"){//��Ŀ����
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

//����س���ҳ����˺�ѡ��
function enter_filter_addword(event){
	var e = event||window.event;
	var curr_key = e.keyCode||e.which||e.charCode;
	if(curr_key == 13){
		do_filter_addword();
	}
}

//��Ӧҳ��onchange�¼���ҳ����˺�ѡ��
function do_filter_addword(event){
	var filter_word_array = new Array();
	var filter_word = $.trim($("#id_filter_addword").val());//ȥ���ҿո�
	filter_word = filter_word.replaceAll(" ", "��", false);//���ո��滻Ϊ��
	filter_word = filter_word.replaceAll(",", "��", false);//��,�滻Ϊ��
	if(filter_word != ""){
		temp_array = filter_word.split("��");
		for(var kk=0; kk<temp_array.length; kk++){
			temp_word = $.trim(temp_array[kk]);//ȥ���пո�
			if(temp_word != ""){
				filter_word_array.push(temp_word);
			}
		}
	}
	/*
	alert("filter_word==>"+filter_word);
	alert("filter_word_array.length==>"+filter_word_array.length);
	*/
	//ƥ��ؼ���
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
			//���ѡ�����"����"����ֻ��Ҫ����filter_word_array�е��κ�һ���Ϳ�����ʾ�����ѡ�����"������"����ֻ��filter_word_array�е�ȫ�����������ſ�����ʾ
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
	calculate_checked_count("add");//���¼���ѡ�еĴ�
}

//�����´ʵļ۸�
function do_setting_price(){
	if(!check_limit_price()) return false;
	if(confirm("�����޸����к�ѡ�ʵ�[��ʼ����]����������޸ĳ�������δ�ύ������ȫ�����ã�ȷ��Ҫִ����")){
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

//У���´��޼۵ĺϷ���
function check_limit_price(){
	var is_correct = true;
	var o_limit_price = $("#id_limit_price");
	if(o_limit_price.val() > 5.0){
		if(!confirm("�����õ�[�´��޼�]����5.0Ԫ��ȷʵ����Ϊ"+o_limit_price.val()+"Ԫ��")){
			is_correct = false;
		}
	}
	if(isNaN(o_limit_price.val()) || o_limit_price.val() < 0.05 || o_limit_price.val() > 99.99){
		alert("[�´��޼�]���ô��󣬱����ǽ���0.05~99.99֮������֣����޸�");
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
		
//����ҳ���ϵĹؼ��ʣ��Ƿ�Ӧ�ø�����������
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
			$('#id_search_count').text(search_count+"��");
		}else{
			$('#id_search_count').text("");
		}
	}	
}

/*�ύ��ĵ���*/
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
	new_current_size = all_current_size + all_added_count - cat_size;//������ӳɹ���,��ȥ��Ŀ����
	$('#current_count').text(new_current_size);
	$('#candidate_count').text($("input[id^=fthid_add_chdid_]").size());
	$('#center_tip_popup').hide();
	
	var alert_msg = "";
	if(added_count>0){alert_msg+="�ɹ����"+added_count+"����";	}
	if(deled_count>0){alert_msg+="�ɹ�ɾ��"+deled_count+"����";	}
	if(upded_count>0){alert_msg+="�ɹ��ļ�"+upded_count+"����\n";	}
	if(add_failed_count>0){alert_msg+="���ʧ��"+add_failed_count+"����";	}
	if(del_failed_count>0){alert_msg+="ɾ��ʧ��"+del_failed_count+"����";	}
	if(upd_failed_count>0){alert_msg+="�ļ�ʧ��"+upd_failed_count+"����";	}
	alert("�Ż������ύ��ɣ�"+alert_msg);
}

//����ɾ���ɹ��ļ�¼
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

//�����޸ĳɹ��ļ�¼
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

//������ӳɹ��ļ�¼
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

//����ɾ���ɹ��ļ�¼
function upded_catmatch_action(upded_catmatch){
	if(upded_catmatch != ""){
		var upded_cat_array = upded_catmatch.split(",");
		action_for_succeed("cat",upded_cat_array[0],upded_cat_array[1]);
	}		
}

//����ɾ��ʧ�ܵļ�¼
function del_failed_action(del_failed_list,deled_count){
	var del_failed_count = 0;
	if(del_failed_list != ""){
		del_failed_array = del_failed_list.split(",");
		del_failed_count = del_failed_array.length;
		if(deled_count>0){
			for(var i=0; i<del_failed_count; i++){
				$("#fthid_cur_chdid_"+del_failed_array[i]).attr("checked",false);//ɾ��ʧ�ܵ�ȥ��ѡ
			}		
		}		
	}
	return del_failed_count;			
}

//�����޸�ʧ�ܵļ�¼
function upd_failed_action(upd_failed_list,upded_count){
	var upd_failed_count = 0;
	if(upd_failed_list != ""){
		upd_failed_array = upd_failed_list.split(",");
		upd_failed_count = upd_failed_array.length;
		if(upded_count>0){
			for(var i=0; i<upd_failed_count; i++){
				$("#fthid_cur_chdid_"+upd_failed_array[i]).attr("checked",false);//�ļ�ʧ�ܵ�ȥ��ѡ
			}		
		}		
	}
	return upd_failed_count;		
}

//�������ʧ�ܵļ�¼�����ʧ�ܵ��ظ�����δ���
function add_failed_action(add_failed_list,added_count){
	var add_failed_count = 0;	
	if(add_failed_list != ""){
		add_failed_array = add_failed_list.split(",");
		add_failed_count = add_failed_array.length;
		if(added_count>0){
			for(var i=0; i<add_failed_count; i++){
				$("#fthid_add_chdid_"+add_failed_array[i]).attr("checked",false);//���ʧ�ܵ�ȥ��ѡ
			}		
		}
	}
	return add_failed_count;		
}

//Ϊ��ӡ��ļ۳ɹ�������̴���
function action_for_succeed(my_type,my_idx,cat_result){
	if(my_type=="add"){//������ӳɹ���[ֻ�гɹ���]
		var myrow = new DataRow(my_idx,my_type);	
		$("#add_note_"+my_idx).text("�����");
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
		if(my_type=="cur"){//����ļ۳ɹ���[ֻ�гɹ���]	
			myrow.o_max_price.text(myrow.o_new_price.val());
		}
		else if(my_type=="cat"){//������Ŀ����[����ʧ�ܵ�]						
			if(cat_result=="online"){ myrow.o_max_price.text(myrow.o_new_price.val());}
			else if(cat_result=="offline"){ v_option_text="�ѹر�"; }
			else if(cat_result=="failed"){ v_option_text="ʧ��"; }
		}
		myrow.o_select.get(0).options.add(new Option(v_option_text, ""));
		myrow.o_select.val("");//ѡ�и���ӵ���	
		myrow.o_reset.addClass("hide");
		myrow.o_new_price.attr("readonly","readonly");
		myrow.o_chbox.attr("checked",false);
		myrow.o_row.removeClass();
		myrow.o_row.addClass('keep_bg tar');					
	}
}

//�޸�select����������ݣ�������Ҫ��ѡ�е��ı�
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
		v_option_text="�ѼӼ�";
	else
		v_option_text="�ѽ���";
	return v_option_text;
}

//�鿴�ؼ�������
function show_k_trend(keyword_id){
	var v_word = $("#id_cur_word_"+keyword_id).text();
	Dajax.web_show_keyword_trend({'keyword_id':keyword_id,'word':v_word});
}
//�鿴��Ŀ����
function show_c_trend(adgroup_id){
	Dajax.web_show_catmatch_trend({'adgroup_id':adgroup_id});
}
//��ʾ�����ػ�������
function base_data_toggle(){	
	if($('#id_base_data').attr('checked')=='checked'){
		$('.base_data').show();
	}else{
		$('.base_data').hide();
	} 
}
//��ʾ������ת������
function conv_data_toggle(){
	if($('#id_conv_data').attr('checked')=='checked'){
		$('.conv_data').show();
	}else{
		$('.conv_data').hide();
	} 
}
//�ַ����滻
String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase){ 
	if(!RegExp.prototype.isPrototypeOf(reallyDo)){ 
		return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith); 
	} 
	else{ 
		return this.replace(reallyDo, replaceWith); 
	} 
}
//�������룬����������Float���ͣ�������String
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
			labels: {formatter: function() {return this.value +'��';},style: {color: '#0000B7' }},
			opposite: false
		},{
			gridLineWidth: 0,
			title: {text: '',style: {color: '#6D00DB'}},
			labels: {formatter: function() {return this.value +'Ԫ';},style: {color: '#6D00DB' }},
			opposite: false
		},{
			gridLineWidth: 0,
			title: {text: '',style: {color: '#4572A7'}},
			labels: {formatter: function() {return this.value +'%';},style: {color: '#4572A7' }},
			opposite: false
		},{
			gridLineWidth: 0,
			title: {text: '',style: {color: '#E84B00'}},
			labels: {formatter: function() {return this.value +'Ԫ';},style: {color: '#E84B00' }},
			opposite: true
		},{
			gridLineWidth: 0,
			title: {text: '',style: {color: '#FF0B85'}},
			labels: {formatter: function() {return this.value +'��';},style: {color: '#FF0B85' }},
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
					'�����': '��',
					'ƽ���������': 'Ԫ',
					'�����': '%',
					'����': 'Ԫ',
					'�ɽ���': 'Ԫ',
					'�ɽ�����': '��',
					'Ͷ�ʻر���': '',
					'���ת����': '%'
				}[this.series.name];
				return this.x +'�� '+ this.series.name + " " + this.y + unit;
			}
		},
		legend: {backgroundColor: '#FFFFFF'},
		series: [{
			name: '�����',
			color: '#0000B7',
			type: 'spline',
			yAxis: 0,
			data: [194 ,187 ,151 ,158 ,162 ,189 ],
			visible: true
		},{
			name: 'ƽ���������',
			color: '#6D00DB',
			type: 'spline',
			yAxis: 1,
			data: [0.79 ,0.8 ,0.86 ,0.79 ,0.85 ,0.78 ],
			visible: true
		},{
			name: '�����',
			color: '#4572A7',
			type: 'spline',
			yAxis: 2,
			data: [0.38 ,0.4 ,0.33 ,0.36 ,0.33 ,0.35 ],
			visible: false
		},{
			name: '����',
			color: '#E84B00',
			type: 'spline',
			yAxis: 3,
			data: [152.31 ,149.74 ,129.1 ,124.66 ,137.31 ,146.82 ],
			visible: false
		},{
			name: '�ɽ���',
			color: '#AA46a3',
			type: 'spline',
			yAxis: 3,
			data: [687.4 ,477.8 ,0 ,0 ,149.4 ,298.8 ],
			visible: false
		},{
			name: '�ɽ�����',
			color: '#FF0B85',
			type: 'spline',
			yAxis: 4,
			data: [4 ,3 ,0 ,0 ,1 ,2 ],
			visible: false
		},{
			name: 'Ͷ�ʻر���',
			color: '#FF0B0B',
			type: 'spline',
			yAxis: 5,
			data: [4.51 ,3.19 ,0.0 ,0.0 ,1.09 ,2.04 ],
			visible: false
		},{
			name: '���ת����',
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
			gridLineWidth: 1,//չ�����������
			title: {text: '',style: {color: '#89A54E'}},
			labels: {formatter: function() {return this.value +'��';},style: {color: '#89A54E'}}
		}, {
			gridLineWidth: 1,//ƽ��������ѡ�����
			title: {text: '',style: {color: '#6D00DB'}},
			labels: {formatter: function() {return this.value +'Ԫ';},style: {color: '#6D00DB'}}			
		},{
			gridLineWidth: 1,//�����
			title: {text: '',style: {color: '#4572A7'}},
			labels: {formatter: function() {return this.value +'%';},style: {color: '#4572A7'}}
		}, {
			gridLineWidth: 1,//���ѡ��ɽ���
			title: {text: '',style: {color: '#E84B00'}},
			labels: {formatter: function() {return this.value +'Ԫ';},style: {color: '#E84B00'}},
			opposite: true
		}, {
			gridLineWidth: 1,//�ɽ�����
			title: {text: '',style: {color: '#FF0B85'}},
			labels: {formatter: function() {return this.value +'��';},style: {color: '#FF0B85'}},
			opposite: true
		}, {
			gridLineWidth: 1,//Ͷ�ʻر���
			title: {text: '',style: {color: '#FF0B0B'}},
			labels: {formatter: function() {return this.value +'';},style: {color: '#FF0B0B'}},
			opposite: true
		}],
		tooltip: {formatter: function() {
				var unit = {'չ����': '��','�����': '��','ƽ���������': 'Ԫ','�����': '%','����': 'Ԫ','�ɽ���': 'Ԫ','�ɽ�����': '��','Ͷ�ʻر���': '','����': 'Ԫ'}[this.series.name];
				return this.x +'�� '+this.series.name +' '+ this.y + unit;
			}
		},
		legend: {backgroundColor: '#FFFFFF'},
		series: [{name: 'չ����',	 color: '#89A54E',type: 'spline',yAxis: 0,data: series_list[0].data,visible: false},
				 {name: '�����',	 color: '#0000B7',type: 'spline',yAxis: 0,data: series_list[1].data,visible: true},
				 {name: 'ƽ���������',color: '#6D00DB',type: 'spline',yAxis: 1,data: series_list[2].data,visible: false},
				 {name: '�����',	 color: '#4572A7',type: 'spline',yAxis: 2,data: series_list[3].data,visible: false},
				 {name: '����',		 color: '#E84B00',type: 'spline',yAxis: 3,data: series_list[4].data,visible: true},
				 {name: '�ɽ���',	 color: '#AA46a3',type: 'spline',yAxis: 3,data: series_list[5].data,visible: false},
				 {name: '�ɽ�����',	 color: '#FF0B85',type: 'spline',yAxis: 4,data: series_list[6].data,visible: false},
				 {name: 'Ͷ�ʻر���',	 color: '#FF0B0B',type: 'spline',yAxis: 5,data: series_list[7].data,visible: false},
				 {name: '����',		 color: '#00F700',type: 'spline',yAxis: 1,data: series_list[8].data,visible: false}]
	});
}

function draw_catmatch_trend_chart(id_container,category_list,series_list){
	chart = new Highcharts.Chart({
		chart: {renderTo: id_container, zoomType: 'xy'},
		title: {text: ''},
		subtitle: {text: ''},
		xAxis: [{categories: category_list}],
		yAxis: [{
			gridLineWidth: 1,//չ�����������
			title: {text: '',style: {color: '#89A54E'}},
			labels: {formatter: function() {return this.value +'��';},style: {color: '#89A54E'}}
		}, {
			gridLineWidth: 1,//ƽ���������
			title: {text: '',style: {color: '#6D00DB'}},
			labels: {formatter: function() {return this.value +'Ԫ';},style: {color: '#6D00DB'}}			
		},{
			gridLineWidth: 1,//�����
			title: {text: '',style: {color: '#4572A7'}},
			labels: {formatter: function() {return this.value +'%';},style: {color: '#4572A7'}}
		}, {
			gridLineWidth: 1,//���ѡ��ɽ���
			title: {text: '',style: {color: '#E84B00'}},
			labels: {formatter: function() {return this.value +'Ԫ';},style: {color: '#E84B00'}},
			opposite: true
		}, {
			gridLineWidth: 1,//�ɽ�����
			title: {text: '',style: {color: '#FF0B85'}},
			labels: {formatter: function() {return this.value +'��';},style: {color: '#FF0B85'}},
			opposite: true
		}, {
			gridLineWidth: 1,//Ͷ�ʻر���
			title: {text: '',style: {color: '#FF0B0B'}},
			labels: {formatter: function() {return this.value +'';},style: {color: '#FF0B0B'}},
			opposite: true
		}],
		tooltip: {formatter: function() {
				var unit = {'չ����': '��','�����': '��','ƽ���������': 'Ԫ','�����': '%','����': 'Ԫ','�ɽ���': 'Ԫ','�ɽ�����': '��','Ͷ�ʻر���': ''}[this.series.name];
				return this.x +'�� '+this.series.name +' '+ this.y + unit;
			}
		},
		
		legend: {backgroundColor: '#FFFFFF'},
		series: [{name: 'չ����',	 color: '#89A54E',type: 'spline',yAxis: 0,data: series_list[0].data,visible: false},
				 {name: '�����',	 color: '#0000B7',type: 'spline',yAxis: 0,data: series_list[1].data,visible: true},
				 {name: 'ƽ���������',color: '#6D00DB',type: 'spline',yAxis: 1,data: series_list[2].data,visible: false},
				 {name: '�����',	 color: '#4572A7',type: 'spline',yAxis: 2,data: series_list[3].data,visible: false},
				 {name: '����',		 color: '#E84B00',type: 'spline',yAxis: 3,data: series_list[4].data,visible: true},
				 {name: '�ɽ���',	 color: '#AA46a3',type: 'spline',yAxis: 3,data: series_list[5].data,visible: false},
				 {name: '�ɽ�����',	 color: '#FF0B85',type: 'spline',yAxis: 4,data: series_list[6].data,visible: false},
				 {name: 'Ͷ�ʻر���',	 color: '#FF0B0B',type: 'spline',yAxis: 5,data: series_list[7].data,visible: false}]
	});
}
