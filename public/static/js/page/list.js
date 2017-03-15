$(function () {
	var isInit = 0;
	//左右tab的切换
	var tabFun = function ($ele, before, callback) {
		var $this = $ele;
		var tab = $this.data().nav;
		var $thisScope = $this.closest('[data-tab]');
		before && before();
		$this.addClass('active').siblings('a').removeClass('active');
		$thisScope.find('[data-con]').addClass('hidden').filter('[data-con="' + tab + '"]').removeClass('hidden');
	};

	//标签切换
	var sid = null;
	$('.labels [data-tag]').click(function () {
		var $this = $(this);
		tabFun($this);
		sid = $this.data().tag;
		var data = {
			sort: cid,
			pageNo: 1
		};
		myShowList(data);
		myRankData();
		$('.module-tab [data-nav="1"]').addClass('active').siblings('a').removeClass('active');
	});

	$.nowNum = 1;
	if (location.href.indexOf("#page=") > 0) {
		var numStr = (location.href.match(/#page=(\d+)/))[1];
		if (!isNaN(numStr)) {
			$.nowNum = parseInt(numStr);
		}
	}

	var cid = 0;
	$('.list-tab [data-nav]').click(function () {
		cid = $(this).data().nav;
		if(cid != 0){
			$('.area-date').css({'display':'block'});
		}else{
			$('.area-date').css({'display':'none'});
			$('.area-calendar').css({'display':'none'});
		}
		var $this = $(this);
		tabFun($this);
		myShowList({
			sort: cid,
			pageNo: 1
		});
	});

	$('.module-tab [data-nav]').click(function () {
		var $this = $(this);
		tabFun($this);
	});
	//列表切换
	window.localStorage.setItem('color', 'default');
	var $thList = $("#third-view").children('a');
	if ($thList.data().th == "th-large") {
		var name = window.localStorage.getItem('color');
		$("#third-view [data-th ='th-large']").addClass(name);
	}
	var $block = $("#list-data");
	$thList.click(function () {
		var btn = $(this);
		if (!btn.hasClass('default')) {
			$thList.filter('.default').removeClass('default');
			btn.addClass('default');
			if (btn.hasClass('default') && btn.data().th === 'th-large') {
				window.localStorage.setItem('className', 'th-large');
			} else if (btn.hasClass('default') && btn.data().th === 'th-list') {
				window.localStorage.setItem('className', 'th-list');
			} else {
				window.localStorage.setItem('className', 'th-normal');
			}
			add();
		}
	});
	add = function () {
		var m = window.localStorage.getItem('className');
		$("#third-view [data-th ='th-large']").removeClass(name);
		if (m == "th-list") {
			$block.removeClass("th-large th-normal").addClass(m);
			$("#third-view [data-th ='th-list']").addClass(name);
		} else if (m == "th-normal") {
			$block.removeClass("th-large th-list").addClass(m);
			$("#third-view [data-th ='th-normal']").addClass(name);
		} else {
			$block.removeClass("th-normal th-list").addClass(m);
			$("#third-view [data-th ='th-large']").addClass(name);
		}
	};
	add();

	//时间处理
	forDate = function (time) {
		var aryTime = time.split("-");
		var newTime = new Date(aryTime[0], aryTime[1] - 1, aryTime[2]).getTime();
		return newTime;
	};

	//请求分页数据(分页逻辑)
	var todayEnd = ( 23 * 60 * 60 + 59 * 60 + 59) * 1e3;
	myShowList = function (param) {
		if (sid) {
			param.tagIds = sid;
		}

		if(cid != 0){
			param.startDate = forDate($('.area-start-date').html());
			param.endDate = forDate($('.area-end-date').html()) + todayEnd;
		}
		$('#list-video').html("<div id='emotion'><img src='" + window.globalConfig.oldPath + "/umeditor/dialogs/emotion/images/ac/" + $.randomNumber(1, 54) + ".gif'/><div id='list'>正在获取视频列表...</div></div>");
		var reqData, reqNewData;
		reqData = {
			channelId: location.href.match(/\/[v|a]\/list(\d+)/)[1],
			sort: cid,
			pageSize: 20,
			pageNo: param.pageNo || 1
			//startDate: forDate($('.area-start-date').html()),
			//endDate: forDate($('.area-end-date').html()) + todayEnd
		};
		reqNewData = $.extend({}, reqData, param);
		$.ajax({
			type: "GET",
			url: '/list/getlist',
			data: reqNewData,
			dataType: "json",
			success: function (data) {

				if (data.data.data.length > 0) {
					var html = "";
					$.each(data.data.data, function (k, v) {
            switch (v.verified) {
              case 1:
                v.verifiedTitle = "AcFun管理员"
                break;
              case 2:
                v.verifiedTitle = "AcFun官方认证"
                break;
              default:
                v.verifiedTitle = ""
            }
						html += $.parseTemp($('#temp-list-video').html(), v);
					});
					$('#list-video').html(html).find('img[data-original]').lazyload({
						threshold: 200,
						effect: "fadeIn"
					});

					if (data.data.params.num != $.nowNum) {
						$.nowNum = data.data.params.num;
					}
					var pager = $.makePager({
						num: $.nowNum,
						count: data.data.params.totalCount,
						size: data.data.params.pageSize,
						total: data.data.params.pageCount,
						addon: true
					});
					$('#list-pager').html(pager);
					if (isInit == 0) {
						$('#list-pager').readyPager({
							addon: true,
							callback: function (n) {
								console.log(sid);
								return myShowList({
									pageNo: n
								});
							}
						});
						isInit = 1;
					}
				} else {
					$('#emotion div').html("暂无内容.");
					$('#list-pager').html(' ');
				}
				scroll(0, 0);
			},
			error: function () {
				$('#emotion div').html('<p class="alert info danger">获取视频列表失败，请于稍后重试。</p>')
				$('#list-pager').html(' ');
			}

		});
	};

	var myRankData = function (param) {
		var reqData = {
			channelId: location.href.match(/\/[v|a]\/list(\d+)/)[1],
			sort: 1,
			range: 1,
			page: 1,
			size: 5,
			tagIds: sid
		};
		$.ajax({
			type: 'GET',
			url: '/list/getrank',
			data: reqData,
			dataType: "json",
			success: function (data) {
				$('.module-main').html(data.data).find('img[data-original]').lazyload({
					threshold: 200,
					effect: "fadeIn"
				});
			}
		})
	};
	getData($.nowNum);
	// 三级页广告位上报
	$('.list-right-img').on('click',function(){
		sa.track('SanJiYeGuangGao',{
			channel:$.getvl('channel') || '',
			userLevel:$.user.getGroupLevel()?String($.user.getGroupLevel()):'-1',
			url:$(this).find('a').attr('href'),
			secchannelId:Number(location.pathname.split('list')[1].split('/')[0])
		});
	})
});
