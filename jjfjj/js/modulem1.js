<script type="text/javascript" language="javascript"> 
	$(function(){
		check_father();
		link_father_and_son();
		$(".hotspot").click(function(){ tooltip.hide(); });
		$(".hotspot").mouseout(function(){ tooltip.hide(); });	
		$(".hotspot").mouseover(function(){ tooltip.show($(this).attr("tip")); });	
	});

	function to_duplicate_check(){
		show_center_tip("正在获取重复词");
		window.location.href="/web/duplicate_check/";
	}
	
	function confirm_download(shop_id,confirm_msg){
		if((confirm_msg != "") && ((confirm(confirm_msg))!=true )){return false;}
		show_center_tip("正在执行数据同步");
		Dajax.web_re_run_increase_download({"shop_id":shop_id});
	}
	
	function close_message(message_id,is_common){
		if(is_common){
			common=1;
		}else{
			common=0;
		}
		Dajax.web_close_message({'message_id':message_id,"is_common":common});
	}
	
	function get_increase_download_info(shop_id){
		Dajax.web_get_increase_download_info({"shop_id":shop_id});
	}
	</script>