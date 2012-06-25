var Dajax = {       
	    web_show_keyword_trend: function(argv){
			this.dajax_call('web','show_keyword_trend',argv);
		},
	    web_show_catmatch_trend: function(argv){
			this.dajax_call('web','show_catmatch_trend',argv);
		},
		web_monitor_remove: function(argv){
			this.dajax_call('web','monitor_remove',argv);
		},
		web_monitor_addition: function(argv){
			this.dajax_call('web','monitor_addition',argv);
		},
	    web_monitor_config_show: function(argv){
			this.dajax_call('web','monitor_config_show',argv);
		},
	    web_monitor_config_submit: function(argv){
			this.dajax_call('web','monitor_config_submit',argv);
		},
	    web_monitor_adgroup_submit: function(argv){
			this.dajax_call('web','monitor_adgroup_submit',argv);
		},
		web_monitor_auto_submit: function(argv){
			this.dajax_call('web','monitor_auto_submit',argv);
		},		
		web_monitor_shop_submit: function(argv){
			this.dajax_call('web','monitor_shop_submit',argv);
		},	
	    web_set_agent: function(argv){
			this.dajax_call('web','set_agent',argv);
		},
	    web_check_report_status: function(argv){
			this.dajax_call('web','check_report_status',argv);
		},
	    web_get_increase_download_info: function(argv){
			this.dajax_call('web','get_increase_download_info',argv);
		},
	    web_re_run_increase_download: function(argv){
			this.dajax_call('web','re_run_increase_download',argv);
		},
	    web_close_message: function(argv){
			this.dajax_call('web','close_message',argv);
		},
	    web_bulk_delete_duplicate: function(argv){
			this.dajax_call('web','bulk_delete_duplicate',argv);
		},
	    web_quick_add_keywords_submit: function(argv){
			this.dajax_call('web','quick_add_keywords_submit',argv);
		},
		web_is_data_ready: function(argv){
			this.dajax_call('web','is_data_ready',argv);
		},
		router_reset_shopmngtask: function(argv){
			this.dajax_call('router','reset_shopmngtask',argv);
		},
	    router_re_run_data_download: function(argv){
			this.dajax_call('router','re_run_data_download',argv);
		},
	    router_change_service_status: function(argv){
			this.dajax_call('router','change_service_status',argv);
		},
	    router_re_run_shop_task: function(argv){
			this.dajax_call('router','re_run_shop_task',argv);
		},
	    router_add_permission: function(argv){
			this.dajax_call('router','add_permission',argv);
		},
	dajax_call: function(app,fun,argv)
	{
		argv.csrfmiddlewaretoken = getCookie('csrftoken');
		$.post('/dajax/'+app+'.'+fun+'/', argv,
			function(data){ 
				function clear_quotes(arg){
					return arg.replace(new RegExp('"', 'g'),'\\"');
				} 
				
				$.each(data, function(i,elem){
					switch(elem.cmd)
					{
						case 'alert':
							alert(elem.val)
						break;

						case 'data':
							eval( elem.fun+"(elem.val);" );
						break;

						case 'as': 
							elem.val = clear_quotes(elem.val);
							eval( "jQuery.each($(\""+elem.id+"\"),function(){ this."+elem.prop+" = \""+elem.val+"\";});");
						break;

						case 'addcc':
							jQuery.each(elem.val,function(){
					 			eval( "$('"+elem.id+"').addClass(\""+this+"\");" );
							});
						break;
						
						case 'remcc':
							jQuery.each(elem.val,function(){
					 			eval( "$('"+elem.id+"').removeClass(\""+this+"\");" );
							});
						break;
						
						case 'ap':
							elem.val = clear_quotes(elem.val);
							eval( "jQuery.each($(\""+elem.id+"\"),function(){ this."+elem.prop+" += \""+elem.val+"\";});");
						break;
						
						case 'pp':
							elem.val = clear_quotes(elem.val);
							eval( "jQuery.each($(\""+elem.id+"\"),function(){ this."+elem.prop+" = \""+elem.val+"\" + this."+elem.prop+";});");
						break;
						
						case 'clr':
							eval( "jQuery.each($(\""+elem.id+"\"),function(){ this."+elem.prop+" = \"\";});");
						break;
						
						case 'red':
					 		window.setTimeout('window.location="'+elem.url+'";',elem.delay);
						break;
						
						case 'js': 
					 		eval(elem.val);
						break;
						
						case 'rm':
					 		eval( "$(\""+elem.id+"\").remove();");
						break;
						
						default:
							alert('Unknown action!');
					}
		          });
		        }, "json");
	}
};