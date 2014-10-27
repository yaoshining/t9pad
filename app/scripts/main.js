/*------------------------------------------------------------------------------------------------------------------------
 @package: t9pad

 @author: Shining Yao
 @www: http://www.yaoshining.com

 @copyright: COPYRIGHT 26 Shining Yao
 @license: MIT

 =============================================================================
 Filename: main.js
 =============================================================================
 This file is the main entry point for js on the t9pad app.
 --------------------------------------------------------------------------------------------------------------------- */
 "use strict"
 var Handlers = {
 	addEmail: function(){
 		$.openDialog({
 			header: {
 				title: "新邮件"
 			},
 			rightButtons: [{
 				text: "发送",
 				btnClass: "combtn",
 				handler: "sendEmail"
 			}],
 			leftButtons: [{
 				text: "返回",
 				btnClass: "prev-btn",
 				closeButton: true
 			}],
 			contentEl: (function(){
 				var content = $("<div>").text("加载中...");
 				$.get('tmpl/newEmail.html', function(tmpl) {
 					content.replaceWith($(tmpl));
 				});
 				return content;
 			})()
 		});
 	},
 	sendEmail: function(el){
 		console.log($(el).find("form.email-form").serializeArray());
 	},
 	showEventDetail: function(eventObject){
 		$.openDialog({
 			header: {
 				title: eventObject.title
 			},
 			leftButtons: [{
 				text: "返回",
 				btnClass: "prev-btn",
 				closeButton: true
 			}],
 			contentEl: (function(){
 				var url = eventObject.src;
 				return $("<iframe>",{
 					src: url,
 					height: "100%",
 					width: "100%",
 					frameborder: 0,
 					scrolling: "no"
 				})
 			})()
 		});
 	},
 	previewAttachment: function(href){
 		var attachBtn = this;
 		$.openDialog({
 			header: {
 				title: "附件预览"
 			},
 			leftButtons: [{
 				text: "返回",
 				btnClass: "prev-btn",
 				closeButton: true
 			}],
 			contentEl: (function(){
 				var url = href?href:attachBtn.href;
 				return $("<iframe>",{
 					src: url,
 					height: "100%",
 					width: "100%",
 					frameborder: 0,
 					scrolling: "no"
 				}).load(function(){
 					var container = this;
 					var wrapper = $('<div>').addClass("extra-wrapper").css({
 						height: "100%",
 						overflow: "auto"
 					});
 					$(this.contentWindow.document).find("img").wrapAll(wrapper);
 				})
 			})()
 		});
 	},
 	refreshContent: function(data,selector){
 		var el = $(".content-area-wrapper").filter(function(index) {
 			return $(this).css("display")==="block";
 		});
 		var contentView = el.closest('.container').data("_contentView");
 		contentView.refreshContent(el,data, selector);
 	}
 };
 $(function(){
 	var navWrapper = $("#navWrapper");
 	var iconBar = $("#iconBar");
 	var contentContainer = $(".container");
 	var userInfoWrapper = $("#userInfo");
 	var dialogWindow = $("#dialogWindow");
 	var modulesUrl = "/t9/t9/pda2/login/act/T9PdaLoginAct/getModulesListJSON.act";
 	// var modulesUrl = "data/menus.json";
 	var userInfoUrl = "/t9/t9/pda2/login/act/T9PdaLoginAct/getPersonInfo.act";
 	// var userInfoUrl = "data/userInfo.json";
 	$.getJSON(userInfoUrl, function(info) {
 		var id = info.id;
 		var name = info.userName;
 		var gender = info.gender;
 		var nameText = userInfoWrapper.find('.login-info-text > span');
 		var genderImg = userInfoWrapper.find('.login-info-img > img')
 		nameText.text(name);
 		if(gender==="1"){
 			genderImg.filter(".female").show();
 		}
 		if(gender==="0"){
 			genderImg.filter(".male").show();
 		}
 	});
 	initApplication();
 	contentContainer.panel({
 		display: "overlay",
 		position: "right",
 		animate: false,
 		theme: "a",
 		dismissible: false,
 		beforeopen: function(){

 		},
 		open: function(){
 			$.hideLoader();
 		}
 	}).contentView({
 		beforeLoad: function(){
 			$.showLoader();
 			contentContainer.promise().done(function(){
 				$(this).panel("close");
 			})
 		},
 		afterRender: function(){
 			contentContainer.promise().done(function(){
 				$(this).panel("open");
 			})
 		}
 	});
 	iconBar.on('tap', '.icon', function(event) {
 		event.preventDefault();
 		if($(this).is(".icon-skins")){
 			var skinNum = Math.floor(Math.random()*9);
 			var skinImg = new Image();
 			$.showLoader();
 			skinImg.src = "img/skins/"+skinNum+".jpg";
 			skinImg.onload = function(){
				$(document.body).css("background-image","url('img/skins/"+skinNum+".jpg')");
				$.hideLoader();
 			}
 			window.localStorage.setItem("skinIndex",skinNum);
 		}
 		if($(this).is(".icon-refresh")){
 			window.location.reload();
 		}
 		if($(this).is(".icon-logout")){
 			window.location = "relogin:";
 		}
 	});
 	$.showLoader({text: "正在加载菜单..."});
 	$.getJSON(modulesUrl,function(menus) {
 		$.each(menus, function(i, e) {
 			var menuElement = $("<li>").append($("<a>").addClass("app").addClass(e.iconClass).text(e.name));
 			e.menuElement = menuElement;
 			if(e.number){
 				menuElement.append($("<span>").addClass("badge").text(e.number))
 			}
			navWrapper.find("ul.nav-scroll").append(menuElement);
			menuElement.on("tap",function(){
	 			var content = contentContainer.loadContent(e, true);
		 		$(this).closest('li').siblings().each(function(i,e){
		 			if($(e).is(".active")){
		 				$(e).removeClass('active');
		 			}
		 		});
		 		$(this).closest("li").addClass("active");
		 		var sideContentArea = $(this).closest("#sideContentArea");
		 		var mainContentArea = sideContentArea.siblings("#mainContentArea");
		 		if(sideContentArea){
		 			sideContentArea.removeClass("layout-both").addClass("layout-side");
		 		}
		 		if(mainContentArea){
		 			mainContentArea.removeClass("layout-both").addClass("slide-out-r");
		 		}
			});
 		});
 		new IScroll("#navWrapper",{
 			scrollbars: true,
 			mouseWheel: true
 		});
 		$.hideLoader();
 	});
 	contentContainer.on("tap",".common-list>li",function(){
 		$(this).siblings().each(function(i,e){
 			if($(e).is(".active")){
 				$(e).removeClass('active');
 			}
 		});
 		$(this).removeClass("unvisited").addClass("active");
 		var sideContentArea = $(this).closest("#sideContentArea");
 		var contentData = sideContentArea.find("#sideContent").data("contentData");
 		var dataList = contentData.dataList;
 		var data = dataList[$(this).index()];
 		var listView = contentData.listview;
 		var mainContentArea = sideContentArea.siblings("#mainContentArea");
 		var rightButtons = mainContentArea.find(".right-btns");
 		rightButtons.empty();
 		$(listView.rightButtons).each(function(i,e){
 			var btn = $("<span>").addClass("btn").addClass(e.btnClass).on({
 				click: Handlers[e.handlerName]
 			});
			rightButtons.append(btn);
 		});
 		mainContentArea.mainContentArea({
 			iframe: true,
 			href: listView.url,
 			data: data.paramData,
 			beforeLoad: function(){
 				$.showLoader();
 			},
 			afterRender: function(){
 				$.hideLoader();
 			}
 		});
 		mainContentArea.trigger("show");
 	});
 	$(".page").on("swipeleft",function(event){
		$(".container").panel("open");
 		// $("#sideContentArea").removeClass("layout-both").addClass("layout-side");
 		// $("#mainContentArea").removeClass("layout-both").addClass("slide-out-r");
 	});
 });
function initApplication(){
	$.mobile.loader.prototype.options.text = "加载中...";
 	$.mobile.loader.prototype.options.theme = "b";
 	$.mobile.loader.prototype.options.textonly = false;
 	$.mobile.loader.prototype.options.textVisible = true;
 	var skinNum = localStorage.getItem("skinIndex") || 0;
 	$(document.body).css("background-image","url('img/skins/"+skinNum+".jpg')");
 	$(document).on({
 		scrollstart: function(e){
 			e.preventDefault();
 		}
 	});
 	$(document).on("show",".main-content-area",function(){
 		$(this).siblings("#sideContentArea").removeClass("layout-side").addClass("layout-both");
 		$(this).removeClass("slide-out-r").removeClass("layout-side").addClass("layout-both");
 	});
 	$.extend({
 		showLoader: function(config){
 			var defaults = {
				text: "加载中...",
				textVisible: true,
				theme: "b",
				textonly: false,
				html: ""
			};
			$.extend(defaults,config);
	 		$.mobile.loading("show",defaults);
 		},
 		hideLoader: function(){
 			$.mobile.loading("hide");
 		},
 		openDialog: function(config){
 			var headerTitle = $(dialogWindow).find(".header-title");
 			var leftBtnsArea = $(dialogWindow).find(".left-btns");
 			var rightBtnsArea = $(dialogWindow).find(".right-btns");
 			var content = $(dialogWindow).find(".content-area > .content");
 			headerTitle.empty();
 			leftBtnsArea.empty();
 			rightBtnsArea.empty();
 			content.empty();
 			if(config.iframe){

 			}else{
 				var title = config.header.title;
 				var leftBtns = config.leftButtons;
 				var rightBtns = config.rightButtons;
 				var contentEl = config.contentEl;
 				headerTitle.text(title);
 				$(rightBtns).each(function(i,e){
					rightBtnsArea.append($("<span>").addClass("btn").addClass(e.btnClass).text(e.text).on("click",function(){
						if($.isFunction(Handlers[e.handler])){
							Handlers[e.handler].apply(this,content);
						}
						if(e.closeButton){
							$.closeDialog();
						}
					}));
 				});
 				$(leftBtns).each(function(i,e){
					leftBtnsArea.append($("<span>").addClass("btn").addClass(e.btnClass).text(e.text).on("click",function(){
						if($.isFunction(Handlers[e.handler])){
							Handlers[e.handler].apply(this);
						}
						if(e.closeButton){
							$.closeDialog();
						}
					}));
 				});
 				content.html(contentEl);
 				$(dialogWindow).show();
				$(dialogWindow).find(".content-area").slideDown();
 			}
 		},
 		closeDialog: function(){
 			$(dialogWindow).find(".content-area").slideUp(function(){
				$(dialogWindow).hide();
 			});
 		}
 	});
 	$.fn.extend({
 		contentView: function(config){
 			var contentView = this;
 			var defaults = {
 				tmpl: null,
 				contents: [],
 				current: null,
 				cache: false,
 				loadContent: function(e,display){
 					var elem = null;
 					if(e.el){
 						elem = e.el;
 						if(!this.cache){
 							contentView.refresh(e,elem,display);
 						}else{
 							if(display){
								contentView.showContent(elem);
	 						}
	 						contentView.trigger('afterRender',[e]);
 						}
 					} else {
 						var html = this.tmpl(e);
	 					var elem = $(html);
	 					contentView.refresh(e,elem,display);
	 					this.contents.push(elem);
	 					this.append(elem);
	 					e.el = elem;
	 				}
 					return elem;
 				},
 				showContent: function(elem){
 					this.contents.forEach(function(el){
						el.hide();
 					});
 					elem.show();
 				},
 				refreshContent: function(el,data,selector){
 					var elem = el.find(selector);
			 		var view = elem.data("view");
			 		view.data = data;
			 		var e = elem.data("e");
			 		this.renderViewComp(e, view, elem);
 				},
 				afterRender: function(event,el){
 					console.log(el);
 				},
 				beforeLoad: function(event){
 					console.log("before load");
 				},
 				refresh: function(e,elem,display){
 					if(e.view.type === "single"){
 						this.renderViewComp(e,e.view,elem,function(){
 							if(display){
 								contentView.showContent(elem);
 							}
 						});
 						// if(e.view.frame){
		 				// 		// elem.find("#sideContentArea").html($("<iframe>",{
	 					// 		elem.html($("<iframe>",{
			 			// 		src: e.view.href,
			 			// 		height: "100%",
			 			// 		width: "100%",
			 			// 		frameborder: 0,
			 			// 		scrolling: "no"
			 			// 	}).load(function(){
			 			// 		var menuElement = e.menuElement;
			 			// 		var frameElement = this;
			 			// 		this.contentWindow.readItem = function(){
			 			// 			var badge = menuElement.find(".badge");
			 			// 			var value = Number(badge.text()-1);
			 			// 			if(value<=0){
			 			// 				badge.hide();
			 			// 			}else {
			 			// 				badge.text(value)
			 			// 			}
			 			// 		};
			 			// 		this.contentWindow.showMainContent = function(config){
			 			// 			var mainContentArea = elem.find("#mainContentArea");
			 			// 			mainContentArea.mainContentArea({
							//  			iframe: config.iframe,
							//  			href: config.href,
							//  			beforeLoad: function(){
							//  				$.showLoader();
							//  			},
							//  			afterRender: function(){
							//  				mainContentArea.trigger('show');
							//  				$.hideLoader();
							//  			}
							//  		});
			 			// 		};
			 			// 		$(this.contentWindow.document).on("scrollstart",function(e){
			 			// 			e.preventDefault();
			 			// 		});
			 			// 		// $(this.contentWindow.document).on('click', '.list_item', function(event) {
			 			// 		// 	event.preventDefault();
			 			// 		// 	frameElement.contentWindow.showMainContent({iframe: true,href: this.href});
			 			// 		// });
			 			// 		if(display){
			 			// 			contentView.showContent(elem);
			 			// 		}
			 			// 		contentView.trigger('afterRender',[e]);
			 			// 	}));
	 					// }else{
	 					// 	var sideContent = elem.find("#sideContent");
	 					// 	$.get(e.view.tmplUrl, function(tmpl){
		 				// 		$.getJSON(e.view.dataUrl, function(data) {
		 				// 			var compiled = _.template(tmpl);
		 				// 			var html = compiled({data: data});
		 				// 			sideContent.html($(html)).data('contentData', data);
		 				// 			setTimeout(function(){
		 				// 				var scroller = new IScroll(sideContent[0],{
							// 	 			scrollbars: true,
							// 	 			mouseWheel: true
							// 	 		});
		 				// 			}, 500);
			 			// 			if(display){
				 		// 				contentView.showContent(elem);
				 		// 			}
				 		// 			contentView.trigger('afterRender',[e]);
			 			// 		});
		 				// 	});
	 					// }
 					}else if(e.view.type === "split"){
 						if(e.view.left){
 							var selector = "#sideContent";
 							if(e.view.left.frame){
 								selector = "#sideContentArea";
 							}
							this.renderViewComp(e,e.view.left,elem.find(selector),function(){
	 							if(display){
	 								contentView.showContent(elem);
	 							}
	 						});
 						}
 						if(e.view.right){
 							var selector = "#mainContent";
 							if(e.view.right.frame){
 								selector = "#mainContentArea";
 							}
 							this.renderViewComp(e,e.view.right,elem.find(selector),function(){
	 							if(display){
	 								contentView.showContent(elem);
	 							}
	 						});
 						}
 					}
 				},
 				renderViewComp: function(e,view,elem,callback){
 					elem.data("view",view);
 					elem.data("e",e);
 					contentView.trigger("beforeLoad");
 					if(view.frame){
 						elem.html($("<iframe>",{
		 					src: view.href,
		 					height: "100%",
		 					width: "100%",
		 					frameborder: 0,
		 					scrolling: "no"
	 					}).load(function(){
		 					var menuElement = e.menuElement;
		 					var frameElement = this;
		 					this.contentWindow.readItem = function(step){
		 						step = step || 1;
		 						var badge = menuElement.find(".badge");
		 						var value = Number(badge.text()-step);
		 						if(value<=0){
		 							badge.hide();
		 						}else {
		 							badge.text(value)
		 						}
		 					};
		 					this.contentWindow.refreshContent = function(selector,data){
		 						contentView.refreshContent(e.el, data, selector);
		 					}
		 					// this.contentWindow.showMainContent = function(config){
		 					// 	var mainContentArea = elem.find("#mainContentArea");
		 					// 	mainContentArea.mainContentArea({
						 	// 		iframe: config.iframe,
						 	// 		href: config.href,
						 	// 		beforeLoad: function(){
						 	// 			$.showLoader();
						 	// 		},
						 	// 		afterRender: function(){
						 	// 			mainContentArea.trigger('show');
						 	// 			$.hideLoader();
						 	// 		}
						 	// 	});
		 					// };
		 					$(this.contentWindow.document).on("scrollstart",function(e){
		 						e.preventDefault();
		 					});
		 					// $(this.contentWindow.document).on('click', '.list_item', function(event) {
		 					// 	event.preventDefault();
		 					// 	frameElement.contentWindow.showMainContent({iframe: true,href: this.href});
		 					// });
		 					if($.isFunction(callback)){
		 						callback.apply(this, []);
		 					}
		 					contentView.trigger('afterRender',[e]);
	 					}))
 					}else{
 						$.get(view.tmplUrl, function(tmpl){
	 						$.getJSON(view.dataUrl, view.data,function(data) {
	 							var compiled = _.template(tmpl);
	 							var html = compiled({data: data});
	 							elem.html($(html)).data('contentData', data);
	 							setTimeout(function(){
	 								var scroller = new IScroll(elem[0],{
							 			scrollbars: true,
							 			mouseWheel: true
							 		});
	 							}, 500);
		 						if($.isFunction(callback)){
			 						callback.apply(elem, []);
			 					}
			 					contentView.trigger('afterRender',[e]);
		 					});
	 					});
 					}
 				}
 			};
 			$.ajax({
 				url: 'tmpl/content.html',
 				type: 'GET',
 				dataType: 'html',
 				async: false
 			})
 			.done(function(data) {
 				defaults.tmpl = _.template(data);
 			});
 			config = $.extend(defaults,config);
 			$.extend(this,config);
			this.data('_contentView', config);
			this.on({
				afterRender: function(event,el){
 					contentView.afterRender(event,el);
 				},
 				beforeLoad: function(event){
 					contentView.beforeLoad(event);
 				}
 			});
 			return this;
 		},
 		mainContentArea: function(config){
 			var area = this;
 			var iframe = config.iframe;
 			var param = config.data?$.param(config.data):"";
 			area.trigger("mainContentArea.beforeLoad");
 			if(iframe){
 				area.html($("<iframe>",{
 					src: config.href+"?"+param,
 					height: "100%",
 					width: "100%",
 					frameborder: 0,
 					scrolling: "no"
 				}).load(function(){
 					area.trigger('mainContentArea.afterRender',[this]);
 				}));
 				area.on({
 					"mainContentArea.afterRender": function(event,el){
 						config.afterRender(event,el);
 					},
 					"mainContentArea.beforeLoad": function(event){
 						config.beforeLoad(event);
 					}
 				});
 			}
 		}
 	});
}