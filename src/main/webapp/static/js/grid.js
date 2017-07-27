var plugin = IBM.namespace("cdl.kvm");

plugin.grid=function(){
	
	this.opts = {
			ctx:"",
			view_detail:{show:true,thumbBtnId:"#view-thumb",listBtnId:"#view-list",defaultView:"#view-thumb"},
			keyword_detail:{show:false,keywordId:"#keyword",keyword:""},
			radio_detail:{show:false,radioId:"#radio",checked:false},
			select_detail:[{selectId:"#select",selectName:"",selectValue:""}],
			checkBox_detail:{show:false,mainId:"#controlAll",sonClass:".checkItem",sonName:"checkItem",divId:"#but-sm",btnId1:"#btn-bm-reset",btnId2:"#btn-bm-add"},
			page_detail:{currentPage:1,pageSize:10},
			time_detail:{show:false,format:"yyyy-mm-dd",startDateDivId:"#startTimeDiv",startDateId:"#startTime",startDate:"",endDateDivId:"#endTimeDiv",endDateId:"#endTime",endDate:""},
			sort_detail:{show:false,sortParam:"id",sort:"desc",sortColumn:[0]},
			ajax_detail:{url:"",type:"POST",tableDiv:"#list-div"},
			info_detail:{url:"",type:"POST",modelClass:".detail",modelDiv:"#detail"},
			delete_detail:{show:false,url:"",type:"POST",deleteClass:".delete"},
			batchOperate_detail:{show:true,url:"",type:"POST",operateId:"#removeAssociate"},
			export_detail:{show:false,buttonId:"#export",url:""},
			query_detail:{buttonId:"#query"},
			fields_detail:{type:'TEXT',display_fields:[]}
	};
	this.conditions = {
			view:"",
			keyword:"",
			radioParams:false,
			selectParams:"",
			startDate:"",
			endDate:"",
			currentPage:1,
			pageSize:10,
			sortParam:"id",
			sort:"desc",
			otherCondition:"",
	};
	//加载数据时提示
//	this.loadingInfo = '<div style="margin:0 auto;margin-left:45%;margin-top:30px;"><img height="60px;" src="static/image/loading.gif"  alt="加载中，请稍后..." /></div>';
	this.loadingInfo = '<div style="width: 100%; text-align: center; font-size: 32px; margin-top: 10px;" class="ajax-loading"><i class="fa fa-spinner fa-spin"></i></div>';
	//日期格式转换
	this.format = function(time,format){
		var t = new Date(time);
		var tf = function(i){
			return (i < 10 ? '0' : '') + i;
		};
		return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
			switch(a){
				case 'yyyy':
					return tf(t.getFullYear());
					break;
				case 'MM':
					return tf(t.getMonth() + 1);
					break;
				case 'mm':
					return tf(t.getMinutes());
					break;
				case 'dd':
					return tf(t.getDate());
					break;
				case 'HH':
					return tf(t.getHours());
					break;
				case 'ss':
					return tf(t.getSeconds());
					break;
			};
		}); 
	};
	this.init=function(opts){
		this.initParam(opts);
		this.initFunction(opts);
		this.getData();
		this.event();
	};
	//初始化函数
	this.initFunction = function(opts){
		if(opts.time_detail){
			if(opts.time_detail.show){
				this.initDatePicker();
			}
		}
		//单选按钮初始化，主要是在涉及到页面跳转的地方在回到list时的页面显示
		if(opts.radio_detail){
			if(opts.radio_detail.show&&opts.radio_detail.checked=='true'){
				$(opts.radio_detail.radioId).iCheck('check');
			}
		}
	};
	//初始化查询条件
	this.initParam = function(opts){
		var obj = this;
		if(opts.ctx){
			obj.opts.ctx = opts.ctx;
//			obj.loadingInfo = '<div style="margin:0 auto;margin-left:45%;margin-top:30px;"><img height="60px;" src="'+obj.opts.ctx+'/static/image/loading.gif"  alt="加载中，请稍后..." /></div>';
		}
		//获取初始关键字
		if(opts.keyword_detail){
			if(opts.keyword_detail.show){
				obj.opts.keyword_detail = opts.keyword_detail;
				obj.conditions.keyword = opts.keyword_detail.keyword;
			}
		}
		//获取视图
		if(opts.view_detail){
			if(opts.view_detail.show){
				obj.opts.view_detail = opts.view_detail;
				obj.conditions.view = opts.view_detail.defaultView;
			}
		}
		//获取化分页信息
		if(opts.page_detail){
			obj.opts.page_detail = opts.page_detail;
			obj.conditions.currentPage = opts.page_detail.currentPage;
			obj.conditions.pageSize = opts.page_detail.pageSize;
		}
		//排序
		if(opts.sort_detail){
			if(opts.sort_detail.show){
				//获取初始排序字段
				obj.conditions.sortParam = opts.sort_detail.sortParam;
				//获取初始排序方式
				obj.conditions.sort = opts.sort_detail.sort;
				obj.opts.sort_detail = opts.sort_detail;
			}
		}
		//初始化时间参数
		if(opts.time_detail){
			if(opts.time_detail.show){
				//获取初始开始时间
				obj.conditions.startDate = opts.time_detail.startDate;
				//获取初始结束时间
				obj.conditions.endDate = opts.time_detail.endDate;
				obj.opts.time_detail = opts.time_detail;
			}
		}
		//获取初始select状态
		if(opts.select_detail){
			obj.opts.select_detail = opts.select_detail;
			var selectString = "";
			for(var i=0;i<obj.opts.select_detail.length;i++){
				if(obj.opts.select_detail[i].selectValue==null||obj.opts.select_detail[i].selectValue==""){
					//selectString+=obj.opts.select_detail[i].selectName+":"+null+"/";
				}else{
					selectString+=obj.opts.select_detail[i].selectName+":"+obj.opts.select_detail[i].selectValue+"/";
				}
			}
			obj.conditions.selectParams = selectString;
		}
		//获取初始radio状态
		if(opts.radio_detail){
			if(opts.radio_detail.show){
				obj.conditions.radioParams = opts.radio_detail.checked;
				obj.opts.radio_detail = opts.radio_detail;
			}
		}
		//初始化删除参数
		if(opts.delete_detail){
			if(opts.delete_detail.show){
				obj.opts.delete_detail =  opts.delete_detal;
			}
		}
		//初始化导出按钮参数
		if(opts.export_detail){
			if(opts.export_detail.show){
				obj.opts.export_detail = opts.export_detail;
			}
		}
		//初始化查询按钮参数
		if(opts.query_detail){
			if(opts.query_detail.show){
				obj.opts.query_detail = opts.query_detail;
			}
		}
		//初始化ajax
		if(opts.ajax_detail){
			obj.opts.ajax_detail = opts.ajax_detail;
		}
		//初始化弹出详情
		if(opts.info_detail){
			if(opts.info_detail.show){
				obj.opts.info_detail = opts.info_detail;
			}
		}
		//初始化复选框
		if(opts.checkBox_detail){
			if(opts.checkBox_detail.show){
				obj.opts.checkBox_detail = opts.checkBox_detail;
			}
		}
		//初始化批量操作
		if(opts.batchOperate_detail){
			if(opts.batchOperate_detail.show){
				obj.opts.batchOperate_detail = opts.batchOperate_detail;
			}
		}
		//初始化表格
		if(opts.fields_detail){
			obj.opts.fields_detail = opts.fields_detail;
		}
	};
	//初始化日期组件
	this.initDatePicker = function(){
		var obj = this;
		var currentDate = new Date();//当前日期
		$(obj.opts.time_detail.startDateDivId).datepicker({
			todayHighlight:true,
			endDate : currentDate
	    });
		$(obj.opts.time_detail.endDateDivId).datepicker({
			todayHighlight:true,
			endDate : currentDate
	    });
	};
	//ajax请求列表数据	
	this.getData=function(){
		var obj=this;
		var param = obj.conditions;
		$.ajax({
			url: obj.opts.ajax_detail.url,
			type: obj.opts.ajax_detail.type,
			dataType:'text',
			data:param,
			beforeSend : function(){
				$(obj.opts.ajax_detail.tableDiv).html(obj.loadingInfo);
				if(obj.opts.query_detail.buttonId){
					$(obj.opts.query_detail.buttonId).attr({disabled: "disabled"});
				}
			},
			success: function(data){
				if(obj.opts.fields_detail.type=='JSON'){
					obj.builderTable(data);
				}else if(obj.opts.fields_detail.type=='HTML'){
					$(obj.opts.ajax_detail.tableDiv).html(data);
				}
			},
			complete: function (xhr) {
				if(xhr.status==911){
					window.location = obj.opts.ctx+"/login";
				}
				if(obj.opts.query_detail.buttonId){
					$(obj.opts.query_detail.buttonId).removeAttr("disabled");
				}
		    },
			error:function(XMLHttpRequest){
				console.log('服务器异常');
			}
		});	
	}; 
	//如果‘TEXT’,拼接table
	this.builderTable = function(data){
		var obj = this;
		var json = $.parseJSON(data);
		var list = eval(json.tableData.list);
		var pagniationBottom = json.pagniationBottom;
		var sortParam = json.sortParam;
//		var sort = json.sort;
		var sortValue = json.sortValue;
		var table_content="";
		table_content+='<table class="table table-striped table-hover">';
		table_content+='<thead>';
		table_content+='<tr>';
		if(obj.opts.checkBox_detail.show){
			//拼接复选框
			table_content+='<th style="width:40px;border-right: #f6f6f6 1px solid;"><input type="checkbox" style="margin-left:-3px;" value="all" id="'+(obj.opts.checkBox_detail.mainId).split("#")[1]+'"/></th>';
		}
		$(obj.opts.fields_detail.display_fields).each(function(i,item){
			if(item.sortColumn){
				var sortClass = sortParam!=item.sortColumn?"sorting":(sortValue==true?'sorting_asc':'sorting_desc');
				table_content+='<th class="'+sortClass+'" data-i18n="'+item.i18n+'" style="border-right: #f6f6f6 1px solid; width:'+item.width+'px" data-columnname="'+item.sortColumn+'" data-i18n="table.id">'+i18n.t(item.i18n)+'</th>';
			}else{
				table_content+='<th data-i18n="'+item.i18n+'" style="border-right: #f6f6f6 1px solid; width:'+item.width+'px" data-columnname="" data-i18n="table.id">'+i18n.t(item.i18n)+'</th>';
			}
		});
		table_content+='</tr>';
		table_content+='</thead>';
		table_content+='<tbody>';
		$(list).each(function(i,item){
			table_content+='<tr data-id="'+item["id"]+'">';
			if(obj.opts.checkBox_detail.show){
				table_content+='<td><input type="checkbox" value="'+item["id"]+'" name="'+obj.opts.checkBox_detail.sonName+'" class="'+(obj.opts.checkBox_detail.sonClass).split(".")[1]+'" /></td>';
			}
			$(obj.opts.fields_detail.display_fields).each(function(j,field){
				var value;
				var fieldArray=field.dataIndex.split(".");
				if(fieldArray.length>0){
					value=item[fieldArray[0]];
					for(var j=1;j<fieldArray.length;j++){
						if(value==null){
							value="";
							break;
						}
						value=value[fieldArray[j]];
					}
				}
				if(typeof value=='undefined'){
					value="";
				}
				var temp = 0;
				//如果是日期需要转换格式
				if(field.format){
					if(field.format==''){
						table_content+='<td>'+obj.format(value, "yyyy-MM-dd HH:mm")+'</td>';
					}else{
						table_content+='<td>'+obj.format(value, field.format)+'</td>';
					}
					temp++;
				}else if(field.labelStyle&&temp==0){
					//如果字段需要按不同颜色label显示
					table_content+='<td><span class="label '+field.labelStyle[value]+'">'+value+'</span></td>';
					temp++;
				}else if(field.contracted&&temp==0){
					//用于内容的省略
					table_content+='<td><div style="width:'+field.width+'px; white-space:nowrap; text-overflow:ellipsis;overflow:hidden;">'+value+'</div></td>';
					temp++;
				}else if(field.type&&temp==0){
					if(field.type=='operation'){
						table_content+='<td>';
						//下拉按钮
						if(field.dropButtons){
							table_content+='<div class="btn-group col-sm" style="padding-top:5px;">';
							//TODO
							table_content+='<button type="button" class="'+field.dropButtons.buttonClass+' dropdown-toggle" data-toggle="dropdown" data-i18n="'+field.dropButtons.i18n+'">'+i18n.t(field.dropButtons.i18n);
							table_content+='<span class="caret"></span>';
							table_content+='</button>';
							table_content+='<ul class="dropdown-menu">';
							$(field.dropButtons.dropMenu).each(function(d,dbutton){
								table_content+='<li>';
								//TODO
								table_content+='<a style="margin:0px" href="'+dbutton.href+'" class="'+dbutton.buttonClass+'" data-id="'+item["id"]+'" data-i18n="'+dbutton.i18n+'">'+i18n.t(dbutton.i18n)+'</a>';
								table_content+='</li>';
							});
							table_content+='</ul>';
							table_content+='</div>';
						}
						//button
						$(field.buttons).each(function(e,button){
							//TODO
							table_content+='<a style="margin-top:5px;padding-left:10px;" data-i18n="'+button.i18n+'" type="button" class="'+button.buttonClass+'" data-toggle="modal" data-target="'+button.target+'" data-id="'+item["id"]+'">'+i18n.t(button.i18n)+'</a>&nbsp;&nbsp;';
						});
						table_content+='</td>';
					}
					temp++;
				}else{
					table_content+='<td>'+value+'</td>';
				}
			});
			table_content+='</tr>';
		});
		table_content+='</tbody>';
		table_content+='</table>';
		//拼接分页信息
		table_content+='<div class="row" style="width:95%;margin:0 auto;">';
		table_content+='<div class="col-md-12">'+pagniationBottom+'<div>';
		tbale_content+='</div>';
		$(obj.opts.ajax_detail.tableDiv).empty().append(table_content);
	};
	//事件
	this.event=function(){
		var obj = this;
		
		//视图选择
		if(obj.opts.view_detail&&obj.opts.view_detail.show){
			$(obj.opts.view_detail.viewClass).click(function(){
				$(obj.opts.view_detail.viewClass).removeClass("disabled").removeClass("btn-primary").addClass("btn-white");
				$(this).removeClass("btn-white").addClass("btn-primary").addClass("disabled");
				obj.conditions.view = $(this).data("view");
				obj.getData();
			});
		}
		
		//输入框回车事件
		$(obj.opts.keyword_detail.keywordId).keydown(function(e){
			if(e.keyCode==13){
				obj.conditions.keyword = $.trim($(obj.opts.keyword_detail.keywordId).val());
				obj.getData();
			};
		}); 
		
		//查询table
		$(obj.opts.query_detail.buttonId).click(function(){
			if(obj.opts.keyword_detail.show){
				obj.conditions.keyword = $.trim($(obj.opts.keyword_detail.keywordId).val());
			}
			if(obj.opts.time_detail.show){
				obj.conditions.startDate = $(obj.opts.time_detail.startDateId).val();
				obj.conditions.endDate = $(obj.opts.time_detail.endDateId).val();
			}
			//TODO解决方法待优化
			var selectString = "";
			for(var i=0;i<obj.opts.select_detail.length;i++){
				if($(obj.opts.select_detail[i].selectId).val()==null){
//					selectString+=obj.opts.select_detail[i].selectName+":"+null+"/";
				}else{
					selectString+=obj.opts.select_detail[i].selectName+":"+$(obj.opts.select_detail[i].selectId).val()+"/";
				}
			}
			obj.conditions.selectParams = selectString;
			obj.conditions.currentPage = 1;
			obj.getData();
		});
		
		//弹出详细信息页
		$(obj.opts.ajax_detail.tableDiv).on("click",obj.opts.info_detail.modelClass,function(){
			var id = $(this).data('id');
			var param = {'id':id};
			$.ajax({
				url: obj.opts.info_detail.url,
				type: obj.opts.info_detail.type,
				dataType:'text',
				data:param,
				beforeSend : function(){
					$(obj.opts.info_detail.modelDiv).html(obj.loadingInfo);
				},
				success: function(result){
					$(obj.opts.info_detail.modelDiv).html(result);
				},
				error:function(XMLHttpRequest){
					console.log('服务器异常');
				}
			});
		});
		
		//导出
		$(obj.opts.export_detail.buttonId).click(function(){
			if(obj.opts.export_detail.show){
				var param = "?startDate="+obj.conditions.startDate;
				param+="&endDate="+obj.conditions.endDate;
				param+="&keyword="+obj.conditions.keyword;
				param+="&selectParams="+obj.conditions.selectParams;
				param+="&radioParams="+obj.conditions.radioParams;
				window.location = obj.opts.export_detail.url+param;
			}
		});
		
		//排序
		if(obj.opts.sort_detail&&obj.opts.sort_detail.show){
			//列表排序绑定事件
			$(obj.opts.ajax_detail.tableDiv).on("click","table>thead th",function(e){	
				//判断当前点的列是否在可排序 的数组中
				var columnname = $(this).data('columnname');
				var t = jQuery.inArray(columnname, obj.opts.sort_detail.sortColumn);
				if(t==-1){
					return;
				}
				obj.conditions.sortParam = $.trim(columnname);					
				if($(this).is(".sorting_desc")){					
					obj.conditions.sort = "asc";
				}
				else{					
					obj.conditions.sort = "desc";
				}	
				obj.conditions.currentPage = 1;
				obj.getData();
			}); 
			
			//缩略图排序绑定事件
			if(obj.opts.view_detail&&obj.opts.view_detail.show){
				$(obj.opts.ajax_detail.tableDiv).on("click",".btn-sort",function(e){	
					//判断当前点的列是否在可排序 的数组中
					var columnname = $(this).data('columnname');
					var t = jQuery.inArray(columnname, obj.opts.sort_detail.sortColumn);
					if(t==-1){
						return;
					}
					obj.conditions.sortParam = $.trim(columnname);					
					if($(this).find("i").is(".fa-sort-desc")){					
						obj.conditions.sort = "asc";
					}
					else{					
						obj.conditions.sort = "desc";
					}	
					obj.conditions.currentPage = 1;
					obj.getData();
				}); 
			}
		}
		
		//icheck复选框样式
		if(obj.opts.radio_detail&&obj.opts.radio_detail.show){
			$(obj.opts.radio_detail.radioId).iCheck({
	        	checkboxClass: 'icheckbox_flat-green',
	            radioClass: 'iradio_flat-green',
	            increaseArea: '20%', // optional
	        });
			//选中
			$(obj.opts.radio_detail.radioId).on('ifChecked', function(event){  
				obj.conditions.radioParams = true;
				obj.conditions.currentPage = 1;
				obj.getData();
			});
			//去除选中
			$(obj.opts.radio_detail.radioId).on('ifUnchecked', function(event){  
				obj.conditions.radioParams = false;
				obj.conditions.currentPage = 1;
				obj.getData();
			});
		}
		//全选、取消全选的事件  
		$(obj.opts.ajax_detail.tableDiv).on('click',obj.opts.checkBox_detail.mainId,function(){
			var isChecked = $(this).prop("checked");
		    $(obj.opts.ajax_detail.tableDiv+" input[name='"+obj.opts.checkBox_detail.sonName+"']").prop("checked", isChecked);
		    var coun=$(obj.opts.ajax_detail.tableDiv+" input[name='"+obj.opts.checkBox_detail.sonName+"']:checked").length;
		    if (coun >0) {
			    $(obj.opts.checkBox_detail.divId+" "+obj.opts.checkBox_detail.btnId1).removeAttr("disabled","disabled");
			    $(obj.opts.checkBox_detail.divId+" "+obj.opts.checkBox_detail.btnId2).removeAttr("disabled","disabled");
			}else {
				$(obj.opts.checkBox_detail.divId+" "+obj.opts.checkBox_detail.btnId1).attr("disabled","disabled");
				$(obj.opts.checkBox_detail.divId+" "+obj.opts.checkBox_detail.btnId2).attr("disabled","disabled");
			}
		});
		
		//子复选框的事件  
		$(obj.opts.ajax_detail.tableDiv).on('click',obj.opts.checkBox_detail.sonClass,function(){
			//当没有选中某个子复选框时，SelectAll取消选中  
			if (!$(obj.opts.checkBox_detail.sonClass).checked) {  
			    $(obj.opts.ajax_detail.tableDiv+" "+obj.opts.checkBox_detail.mainId).prop("checked",false);
			}  
			var chsub = $(obj.opts.ajax_detail.tableDiv+" input[name='"+obj.opts.checkBox_detail.sonName+"']").length; //获取subcheck的个数  
			var checkedsub = $(obj.opts.ajax_detail.tableDiv+" input[name='"+obj.opts.checkBox_detail.sonName+"']:checked").length; //获取选中的subcheck的个数  
			if (checkedsub == chsub) {  
			    $(obj.opts.ajax_detail.tableDiv+" "+obj.opts.checkBox_detail.mainId).prop("checked",true);  
			}
			if (checkedsub == 0) {
				$(obj.opts.checkBox_detail.divId+" "+obj.opts.checkBox_detail.btnId1).attr("disabled","disabled");
				$(obj.opts.checkBox_detail.divId+" "+obj.opts.checkBox_detail.btnId2).attr("disabled","disabled");
			}else {
				$(obj.opts.checkBox_detail.divId+" "+obj.opts.checkBox_detail.btnId1).removeAttr("disabled","disabled");
				$(obj.opts.checkBox_detail.divId+" "+obj.opts.checkBox_detail.btnId2).removeAttr("disabled","disabled");
			}
		});
		
		//批量操作
		$(obj.opts.batchOperate_detail.operateId).click(function(){
			var itemIds = "";
			var checkedItems=$(obj.opts.ajax_detail.tableDiv).find(':checked').parents('tr');
			for(var i=0,j=checkedItems.length; i<j;i++){
				var id = $(checkedItems[i]).data('id');
				if(!isNaN(id)){
					itemIds+=$(checkedItems[i]).data('id')+",";
				}
			}
			if(itemIds==""||itemIds==null){
				BootstrapDialog.show({
		            title: i18n.t("message.warning"),
	                message: '<span style="color:red" >'+i18n.t("message.pleaseSelect")+'</span>',
		            buttons: [{
		                label: i18n.t("table.cancel"),
		                action: function(dialog) {
		                    dialog.close();
		                }
		            }]
		        });
			}else{
				BootstrapDialog.show({
		            title: i18n.t("message.operationTitle"),
	                message: i18n.t("message.operationConfirm"),
		            buttons: [{
		                label: i18n.t("table.submit"),
		                cssClass: 'btn-primary',
		                action: function(dialog) {
		                    dialog.close();
							$.ajax({
							  url: obj.opts.batchOperate_detail.url,
							  type:obj.opts.batchOperate_detail.type,
							  dataType:'text',
							  data:{"ids":itemIds},
							  success: function(data){
						           if(0==data){
						        	   obj.getData();
						           }else if(1==data){
										BootstrapDialog.show({
						 					title: i18n.t("message.operationError"),
						                    message: '<span style="color:red" >'+i18n.t("message.operationResult")+'</span>',
								            buttons: [{
								                label: i18n.t("table.cancel"),
								                cssClass: 'btn-primary',
								                action: function(dialog) {
								                    dialog.close();
								                }
								            }]
								        });
						           }
							  	},
							  	error:function(XMLHttpRequest){
									console.log('服务器异常');
								}
							});
		                } 
		            }, {
		                label: i18n.t("table.cancel"),
		                action: function(dialog) {
		                    dialog.close();
		                }
		            }]
		        });
			}
		});
		
		//删除
		$(obj.opts.ajax_detail.tableDiv).on("click",obj.opts.delete_detail.deleteClass,function(){
			var url = obj.opts.delete_detail.url;
			var id = $(this).data('id');
			var param = {'id':id};
			BootstrapDialog.show({
	            title: i18n.t("message.deletetitle"),
                message: i18n.t("message.deleteconfirm"),
	            buttons: [{
	                label: i18n.t("table.submit"),
	                cssClass: 'btn-primary',
	                action: function(dialog) {
	                    dialog.close();
						$.ajax({
						  url: url,
						  type:obj.opts.delete_detail.type,
						  dataType:'text',
						  data:param,
						  success: function(data){
					           if(0==data){
					        	   obj.getData();
					           }else if(1==data){
									BootstrapDialog.show({
					 					title: i18n.t("message.deleteerror"),
					                    message: '<span style="color:red" >'+i18n.t("message.deleteresult")+'</span>',
							            buttons: [{
							                label: i18n.t("table.cancel"),
							                cssClass: 'btn-primary',
							                action: function(dialog) {
							                    dialog.close();
							                }
							            }]
							        });
					           }
						  	},
						  	error:function(XMLHttpRequest){
								console.log('服务器异常');
							}
						});
	                } 
	            }, {
	                label: i18n.t("table.cancel"),
	                action: function(dialog) {
	                    dialog.close();
	                }
	            }]
	        });
		});
		
		//分页点击事件
		$(obj.opts.ajax_detail.tableDiv).on('click','.page-click',function(){
			var current = $(this).data('currentpage');
			var psize = $(this).data('pagesize');
			var reg = new RegExp("^" + "#");
			//表明是GO跳转
			if (reg.test(current)) {
				current = $(current).val();
			}
//			alert("currentPage="+current+",pageSize="+psize);
			$("#page10").removeClass("label label-primary");
			$("#page20").removeClass("label label-primary");
			$("#page50").removeClass("label label-primary");
			if (psize == 10) {
				$("#page10").addClass("label label-primary");
			}
			if (psize == 20) {
				$("#page20").addClass("label label-primary");
			}
			if (psize == 50) {
				$("#page50").addClass("label label-primary");
			}
			obj.conditions.currentPage = current;
			obj.conditions.pageSize = psize;
			obj.getData();
		});
	};
};