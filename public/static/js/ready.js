$(function () {
	var $window = $(window);
	var $body = $('body');
	var $header = $('#header');
	var $nav = $('#nav');


	//初始化浏览器信息
	$.browser.initClass();

	//延迟加载
	$('img[data-original]').lazyload({
		threshold: 200,
		effect: "fadeIn"
	});


	//处理登录状态
	var $headerGuide = $('#header-guide');
	var $guideUser = $headerGuide.find('.guide-user');

	if ($.user.isLogin()) {
		//设置用户名
		$guideUser.find('.user-name').text($.user.name);

		//设置头像
		$guideUser.addClass('user-logined');
		$guideUser.find('.user-avatar img').attr('src', $.user.avatar);

		//退出登录返回url
		var returnUrl = '?returnUrl=' + encodeURIComponent(location.href);
		var logoutUrl = $guideUser.find('.user-logout').attr('href') + returnUrl;
		$guideUser.find('.user-logout').attr('href', logoutUrl);

		//初始化用户数据
		$.user.init();

		//设置用户未读消息
		$.user.getUnRead(function (data) {
			var $userMessage = $('#user-message');
			var html = $.user.renderUnRead(data);
			$userMessage.html(html);

			var $userMessageCon = $('#user-message-con');
			if ($userMessageCon.length) {
				var count = $userMessageCon.data().count;
				var href = $userMessageCon.data().url;
				if (parseInt(count) > 0) {
					$guideUser.find('.user-message-count').text(count).removeClass('hidden');
					$('.guide-user').find('.more').attr('href', href);
				}
			}
		});
	}

	//填充历史记录
	var $guideHistory = $headerGuide.find('.guide-history');
	$guideHistory.hover(function () {
		var historyData = $.user.getHistory(3);
		var renderHistory = function (data) {
			var temp = $('#temp-history').html();
			var html = "";
			$.each(data, function (k, v) {
				var tempDate;
				if (v.type === 'bangumi') {
					tempDate = {
						url: '/v/ab' + v.bid + (v.part > 0 ? '_' + v.part : ''),
						title: v.title + ' ' + v.name,
						time: $.parseTime(v.time)
					};
				} else {
					tempDate = {
						url: (v.type && v.type === 'album' ? '/a/aa' : '/v/ac') + v.aid + ((v.part | 0) > 0 ? '_' + (v.part + 1) : ''),
						title: v.title,
						time: $.parseTime(v.time)
					};
				}
				if (window.globalConfig && window.globalConfig.rootDomain) {
					tempDate.url = window.globalConfig.rootDomain + tempDate.url;
				}
				html += $.parseTemp(temp, tempDate);
			});
			$guideHistory.find('ul').html(html || '尚未记录任何历史信息。');
		};
		renderHistory(historyData);
	}, function () {
	});


	//顶部搜索
	$('#search-text').searchComplete();

	//右侧工具栏
	var $toolBar = $('#toolbar');
	var $tollBar_top = $toolBar.find("#to-top");

	//导航栏吸顶
  var navFixed
	if ($nav.length) {
		var navTop = $nav.offset().top - $('.header-top').height();
		navFixed = function(top){
			if(top > navTop){
				$header.addClass('fixed');
			}else{
				$header.removeClass('fixed');
			}
		};
		navFixed($window.scrollTop());
	}

	//全站通知（首页&二级页)
	var noticeJson = store.get('notice-json');
	var getNoticeUrl = 'http://webapi.acfun.cn/appSpreadContents/announcement?pageNum=1';
	var localUrl = location.href;
	var channelId = localUrl.split(/list/)[1] ? localUrl.split(/list/)[1].split('/')[0] : undefined;
	var noticeHtml =
		'<div id="header-notice" class="header-notice">' +
			'<div class="wp clearfix">' +
				'<img src="'+globalConfig.path+'/img/page/index/notice-icon.png" class="fl">' +
				'<p class="fl text-overflow"><%= notice.recommendation %></p>' +
				'<a href="<%= notice.link %>" target="_blank" class="fl">查看详情</a>' +
				'<i class="icon icon-close fr"></i>' +
			'</div>' +
		'</div>';
	var iconCloseBind = function(){
		var headerNotice = $('#header-notice'),
			iconClose = headerNotice.find('.icon-close');
		iconClose.on('click',function(){
			$body.removeClass('notice');
			store.set('notice-json',{status:0,text:noticeJson.text});
		});
	};
	if(/acfun.cn\/$/.test(localUrl) || /tudou.com\/$/.test(localUrl) || $.channel.map[channelId]){
		$.ajax({
			type:'GET',
			url:getNoticeUrl,
			dataType: 'json',
			xhrFields:{
				withCredentials:true
			}
		})
		.done(function(data){
			if(data && data.code == 200){
				data = data.data.list[0];
				if(noticeJson == undefined || noticeJson.status != 0 || noticeJson.text != data.recommendation){
					$body.addClass('notice');
					store.set('notice-json',{status:1,text:data.recommendation});
					var template = $.template(noticeHtml, {variable: "notice"});
					$body.prepend(template(data));
					noticeJson = store.get('notice-json');
					iconCloseBind()
				}
			}else{
				store.remove('notice-json');
				$body.removeClass('notice');
			}
		})
	}

	//二次元日历锚点
	var $calendarAnchor = $('#calendar-anchor');
	$window.on('scroll', function () {
		var top = $window.scrollTop();

		navFixed && navFixed(top);

		//右侧工具栏
		if (top >= $window.height()) {
			$tollBar_top.fadeIn();
		} else {
			$tollBar_top.fadeOut();
		}

		//二次元日历
		if (top >= 560) {
			$calendarAnchor.fadeIn();
		} else {
			$calendarAnchor.fadeOut();
		}
	});

	$calendarAnchor.find('.btn-close').click(function () {
		$calendarAnchor.remove();
	});

	//返回顶部
	$('#to-top').click(function () {
		$('html,body').animate({
			scrollTop: 0
		}, 500);
	});
	$('#to-comm').click(function () {
		var h = $("#area-comment").offset().top;
		if(!$("#header").is(".fixed")){
			h = h - 47;
		}
		$('html,body').animate({

			scrollTop: h-100
		}, 500);
	});




	//banner提示
	var $headerBanner = $('.header-banner');
	if($headerBanner.length>0){
		var $bannerPoint = $headerBanner.find('span.point');
		var headerBannerTop = $headerBanner.offset().top;
		var pointWidth = $bannerPoint.outerWidth();
		var pendantWidth = $headerBanner.find('.header-pendant').width() || 0;
		$headerBanner.hover(function () {
			$bannerPoint.removeClass('hidden');
		}, function () {
			$bannerPoint.addClass('hidden');
		}).mousemove(function (e) {

			var left = e.pageX + 20;
			var top = e.pageY - headerBannerTop - 10;
			if ($window.width() - left < pendantWidth) {
				$bannerPoint.addClass('hidden');
			} else {
				$bannerPoint.removeClass('hidden');
			}

			if ($window.width() - left < pointWidth) {
				$bannerPoint.addClass('left');
				left = e.pageX - pointWidth - 20
			} else {
				$bannerPoint.removeClass('left');
			}
			$bannerPoint.css({
				left: left,
				top: top > 156 ? 156 : top <= 0 ? 0 : top
			});
		});
	}


	//搜索按钮点击
	$('#search-form').submit(function () {
		var $searchText = $('#search-text');
		var textValue = $.trim($searchText.val());
		$.searchCache(textValue)
		var href = '/search/#query=';
		href = window.globalConfig && window.globalConfig.rootDomain ? window.globalConfig.rootDomain + href : href;
		var dataUrl = $searchText.attr('data-url');
		var placeholder = $searchText.attr('placeholder');
		if (textValue) {
			href += textValue;
		} else if (dataUrl) {
			href = dataUrl;
		} else if (placeholder) {
			href += placeholder;
		}

		$(this).attr('action', href);
	});


	//导航延时
	var $navParent = $nav.find('.nav-parent');
	var $navSub = $nav.find('.nav-sub');
	var $navSubCon = $navSub.find('.nav-sub-con');
	var navEnterTimeOut, navLeaveTimeOut, navSubLeaveTimeOut;
	var subNav = {
		hide: function (time) {
			navSubLeaveTimeOut = setTimeout(function () {
				$nav.removeClass('hover').find('li').removeClass('hover');
				$navSub.find('ul').hide();
			}, time >= 0 ? time : 1000);
		}
	};
	//- 二级页面处理
	//if($("#pageType") && $("#pageType").val()=="channel") {
	//	var $navChannelSubCon = $('#channel-nav').find('.nav-sub .nav-channel-sub-con');
	//	var channelId = location.href.split(/list/)[1].split('/')[0];
	//	//根据规则修改channelId获取正则
	//	$navParent.find('[data-cid=' + channelId + ']').addClass('active').siblings('li').removeClass('active');
	//	$navChannelSubCon.find('ul[data-cid=' + channelId + ']').show().siblings('ul').hide();
	//	$navChannelSubCon.find('a[data-cid=' + channelId + ']').parent().addClass('active');
	//}

	$('.nav-parent>ul li').hover(function () {
		var $this = $(this);
		var cid = $(this).attr('data-category');
		clearTimeout(navLeaveTimeOut);
		clearTimeout(navSubLeaveTimeOut);
		navEnterTimeOut = setTimeout(function () {
			$this.addClass('hover').siblings('li').removeClass('hover');
			if (!$navSubCon.find('ul[data-category=' + cid + ']').length) {
				subNav.hide(150);
				return false;
			}

			$nav.addClass('hover');
			var $subUl = $navSub.find('ul');
			var $currentUl = $navSub.find('[data-category=' + cid + ']');
			var subNavLeft = $navSubCon.offset().left;

			//计算左边界
			var left = $this.offset().left - subNavLeft - parseInt(($currentUl.outerWidth() - $this.outerWidth()) / 2);
			left = left < 0 ? 0 : left;

			//计算右边界
			var right = left + $currentUl.outerWidth() - $navSubCon.outerWidth()
			left = right > 0 ? left - right : left;
			$subUl.hide();
			$currentUl.css({
				left: left
			}).show();
		}, 150);
	}, function () {
		clearTimeout(navEnterTimeOut);
		navLeaveTimeOut = setTimeout(function () {
			$nav.removeClass('hover').find('li').removeClass('hover');
			$navSub.find('li').removeClass('hover').find('ul').hide();
		}, 1000);

	});

	$('.nav-sub').hover(function () {
		clearTimeout(navLeaveTimeOut);
		clearTimeout(navSubLeaveTimeOut);
	}, function () {
		subNav.hide();
		//$navParent.find('li').removeClass('hover');
	});

	//手机客户端下载
	var $downloadApp = $header.find('.download-app');
	var $appWp = $downloadApp.find('div[data-img]');
	var appTimeout;
	$downloadApp.hover(function () {
		var $this = $(this);
		appTimeout = setTimeout(function () {
			if (!$downloadApp.find('img').length) {
				$appWp.html('<img src="' + $appWp.attr("data-img") + '">');
			}
			var left = $this.offset().left + $appWp.outerWidth();
			if (left > $(window).width()) {
				$this.addClass('right');
			} else {
				$this.removeClass('right');
			}
			$appWp.show();
		}, 150);
		return false;
	}, function () {
		clearTimeout(appTimeout);
		$appWp.hide();
	});


	$headerGuide.find('.guide-item').each(function(index, item){
		var guideEnterTimeOut;
		$(item).hover(function () {
			clearTimeout(guideEnterTimeOut);
			$(this).addClass('hover');
		}, function () {
			var $this = $(this);
			guideEnterTimeOut = setTimeout(function () {
					$this.removeClass('hover');
			}, 150);
		});
	})


	//彩蛋
	var clickNumber = 0;
	var nowTime = 0;
	var getAcImg = function () {
		var src = window.globalConfig.oldPath + '/umeditor/dialogs/emotion/images/ac/' + $.randomNumber(1, 54) + '.gif';
		var img = new Image().src = src;
		return src;
	};
	var cacheImg;

	var $footerAvatarAc = $('.footer-avatar-ac');
	var $footerAvatarImg = $footerAvatarAc.find('img').attr('src', getAcImg());
	$footerAvatarAc.click(function () {
		var $this = $(this);
		var $num = $this.find('.num');
		var apm;

		nowTime = nowTime ? nowTime : $.now();

		clickNumber++;
		$num.text(clickNumber).show();

		if (clickNumber % 50 === 0) {
			$footerAvatarImg.fadeOut(200, function () {
				$footerAvatarImg.attr('src', cacheImg).fadeIn();
			});
			cacheImg = getAcImg();
		}

		if (clickNumber % 100 === 0) {
			apm = (clickNumber / (($.now() - nowTime) / 1e3 / 60)) | 0;
			if (apm > 600) {
				$.info.warning('未知核弹已经升空。');
				return;
			}
			$.info.show('连续点击了' + clickNumber + '次，APM为' + apm + '次/分。');
		}
		return $num.text($.parsePts(clickNumber)).riseInfo('+1 Click');
	});


	//数据统计
	(function(para) {
		var p = para.sdk_url, n = para.name, w = window, d = document, s = 'script',x = null,y = null;
		w['sensorsDataAnalytic201505'] = n;
		w[n] = w[n] || function(a) {return function() {(w[n]._q = w[n]._q || []).push([a, arguments]);}};
		var ifs = ['track','quick','register','registerPage','registerOnce','registerSession','registerSessionOnce','trackSignup', 'trackAbtest', 'setProfile','setOnceProfile','appendProfile', 'incrementProfile', 'deleteProfile', 'unsetProfile', 'identify'];
		for (var i = 0; i < ifs.length; i++) {
			w[n][ifs[i]] = w[n].call(null, ifs[i]);
		}
		if (!w[n]._t) {
			x = d.createElement(s), y = d.getElementsByTagName(s)[0];
			x.async = 1;
			x.src = p;
			y.parentNode.insertBefore(x, y);
			w[n]._t = 1 * new Date();
			w[n].para = para;
		}
	})({
		sdk_url: globalConfig.path + '/js/lib/sensorsdata.1.3.4.min.js',
		name: 'sa',
		server_url:'http://ssdata.acfun.cn/sa.gif'
	});

	window.saObj = {
		isFirstPage : /^http(s)?:\/\/.*\.acfun\.tv\//ig.test(document.referrer) ? "否" : "是"
	}

	$.getvl = function(name){ // 获取当前路径中某个值
		var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i")
	  if(reg.test(location.href)){
			unescape(RegExp.$2.replace(/\+/g, " "))
		}
	};


	sa.setOnceProfile({ // 神策上报建立用户关系表
		product:'web',
		channel:$.getvl('channel') || '',
		uid:$.user.uid || '',
		activitytime:new Date().getTime()
	});
	// 神策上报  点击banner挂件上报
	$('.header-pendant').on('click',function(){
		sa.track('WEBGuaJianDianJi',{
			channel:$.getvl('channel') || '',
			userLevel:$.user.getGroupLevel()?String($.user.getGroupLevel()):'-1',
			url:$(this).attr('href')
		});
	})
});
