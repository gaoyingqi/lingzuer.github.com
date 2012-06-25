$(function($){
	$.fn.center = function(){
		var top = ($(window).height() - this.height())/2;
		var left = ($(window).width() - this.width())/2;
		var scrollTop = $(document).scrollTop();
		var scrollLeft = $(document).scrollLeft();
		return this.css( { position : 'absolute', top : top + scrollTop, left : left + scrollLeft } ).show();
	};
});

function show_center_tip(message){
	$('#center_tip_popup').show();
	$('#tip_content').html("<img src='/site_media/lagu/images/ajax_black.gif' class='vam'>&nbsp;"+message+"，请稍候...");
}

function check_father(){
	var fthids = $("[id^=fthid_]").get(); 
	for (var i=0;i<fthids.length;i++){
		if (fthids[i].id.indexOf("_chdid_") == -1){	
			if($("input[id^="+fthids[i].id+"_chdid_]:checked").size() == $("input[id^="+fthids[i].id+"_chdid_]").size()){
				$("#"+fthids[i].id).attr("checked","checked");
			}
			else{
				$("#"+fthids[i].id).removeAttr("checked"); 
			}
		}
	}
}

function link_father_and_son(){ 
	$("input[id^=fthid]").click(function(){		 
		var fthid = '';
		var chdid = ''; 
		if (this.id.indexOf('_chdid_')==-1){
			fthid = this.id;
		}
		else{
			fthid = this.id.split('_chdid_')[0];
			chdid = this.id;
		}
		
		if (chdid==''){ 
			if (this.checked){   
				$("input[id^="+fthid+"_chdid_]").attr("checked","checked");
			}
			else{ 
				$("input[id^="+fthid+"_chdid_]").removeAttr("checked");
			}
		}
		else{		
			if($("input[id^="+fthid+"_chdid_]:checked").size() == $("input[id^="+fthid+"_chdid_]").size()){	
				$("#"+fthid).attr("checked","checked"); 
			}
			else{	
				$("#"+fthid).removeAttr("checked");
			}
		}
	});		
}

function getCookie(c_name){
	if (document.cookie.length>0){
		c_start=document.cookie.indexOf(c_name + "=")
		if (c_start!=-1){ 
			c_start=c_start + c_name.length+1 
			c_end=document.cookie.indexOf(";",c_start)
			if (c_end==-1) c_end=document.cookie.length
			return unescape(document.cookie.substring(c_start,c_end))
		} 
	}
	return ""; 
}

function setCookie(name,value,expires,path,domain,secure){
	if (expires==null){
		expires = 1;
	}
	var expDays = expires*24*60*60*1000;
	var expDate = new Date();
	expDate.setTime(expDate.getTime()+expDays);
	var expString = ((expires=="-1") ? "" : (";expires="+expDate.toGMTString()));
	var pathString = ((path==null) ? ";path=/" : (";path="+path));
	var domainString = ((domain==null) ? "" : (";domain="+domain));
	var secureString = ((secure==true) ? ";secure" : "" );
	document.cookie = name + "=" + encodeURI(value) + expString + pathString + domainString + secureString;//encodeURI escape
}
