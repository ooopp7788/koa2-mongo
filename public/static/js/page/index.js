$(function () {
	//弹幕
	$('.block-video .has-danmu').showDanmu();

	$('.module-video-big .has-danmu').showDanmu({
		lines: 5,
		lineHeight: 30
	});

	//tab切换
	var moduleTabEnterTimeOut;
	var tabFun = function ($ele, before, callback) {
		var $this = $ele;
		var tab = $this.data().nav;
		var $thisScope = $this.closest('[data-tab]');
		before && before();
		$this.addClass('active').siblings('a').removeClass('active');
		$thisScope.find('[data-con]').addClass('hidden').filter('[data-con="' + tab + '"]').removeClass('hidden');
	};

	$('[data-nav]').click(function () {
		var $this = $(this);
		var cid = $this.data().nav;

		var $dataTab = $this.closest('[data-tab]');
		if ($dataTab.hasClass('module-article')) {
			tabFun($this, function () {
				if ($this.hasClass('active')) {
					var href = '/v/list' + cid + '/index.htm';
					href = window.globalConfig.rootDomain ? window.globalConfig.rootDomain + href : href;
					$this.attr('href', href).attr('target', '_blank');
				} else {
					$this.attr('href', 'javascript:;').removeAttr('target')
				}
			});
		} else {
			tabFun($this);
		}
	});

	$('.area-banana-rank .column-right .module-tab').on('mouseenter','a',function(){
		var $this = $(this);
		var cid = $this.data().nav;
		var $dataTab = $this.closest('[data-tab]');
		clearTimeout(moduleTabEnterTimeOut);
		moduleTabEnterTimeOut = setTimeout(function(){
			if ($dataTab.hasClass('module-article')) {
				tabFun($this, function () {
					if ($this.hasClass('active')) {
						var href = '/v/list' + cid + '/index.htm';
						href = window.globalConfig.rootDomain ? window.globalConfig.rootDomain + href : href;
						$this.attr('href', href).attr('target', '_blank');
					} else {
						$this.attr('href', 'javascript:;').removeAttr('target')
					}
				});
			} else {
				tabFun($this);
			}
		},150);
	});

	//轮播图
	var $sliderBox = $('#slider-big');
	var $sliderItem = $sliderBox.find('.slider-item');
	var $sliderCon = $sliderBox.find('.slider-con');
	var sliderLength = $sliderItem.length;
	if (sliderLength > 1) {


		var countHtml = '';
		for (var i = 0; i < sliderLength; i++) {
			countHtml += '<span>' + (i + 1) + '</span>';
		}
		$sliderBox.append('<div class="slider-count">' + countHtml + '</div>');
		var sliderIndex = 0;

		var sliderFun = function (index) {
			var itemWidth = $sliderItem.width();
			$sliderCon.width($sliderItem.width() * sliderLength);
			$sliderCon.animate({
				left: -itemWidth * index
			});
			$sliderBox.find('.slider-count span').eq(index).addClass('active').siblings('span').removeClass('active');
		};

		var sliderInterval;
		var sliderAutoPlay = function () {
			sliderInterval = setInterval(function () {
				sliderFun(sliderIndex);
				if (sliderIndex >= sliderLength - 1) {
					sliderIndex = 0;
				} else {
					sliderIndex++;
				}
			}, 3000);
		};
		sliderFun(0);
		sliderAutoPlay();

		$sliderBox.hover(function () {
			clearInterval(sliderInterval);
		}, function () {
			if (sliderIndex >= sliderLength - 1) {
				sliderIndex = 0;
			} else {
				sliderIndex++;
			}
			sliderAutoPlay();
		});

		$sliderBox.on('click', '.slider-count span', function () {
			sliderIndex = $(this).index();
			sliderFun(sliderIndex)
		});
	}


	//首页数据统计
	window.sa && sa.track('HomePage', {
		from: document.referrer,
		firstPage: window.saObj.isFirstPage
	});


	//换一换
	var changeTemplate = (function () {
		var temp = $('#temp-change-video').html();
		var $temp = $(temp).addClass('[recommendClass]');
		return $temp[0].outerHTML;
	})();

	$('.area-change-btn span').click(function () {
		var $this = $(this),
			$areaChannel = $this.closest('.area-channel'),
			$moduleVideo = $areaChannel.find('.module-video'),
			channelId = $areaChannel.attr('data-cid'),
			recommendPageCount = $moduleVideo.attr('data-pagecount'),
			showLength = parseInt($moduleVideo.attr('data-showlength')),
			$jsonChannelChange = $areaChannel.find('script.json-channel-change'),
			$changeBtn = $this.closest('.area-change-btn'),
			size = 50;

		if ($changeBtn.hasClass('loading')) {
			return false;
		}

		$this.data().page = $this.data().page || 0;
		$this.data().recommendData = $.parseJson($areaChannel.find('script.json-channel-recommend').html()) || [];
		$this.data().recommendPage = $this.data().recommendPage == undefined ? 0 : $this.data().recommendPage;
		$this.data().changeData = $this.data().changeData || [];
		$this.data().changeDataOld = $.parseJson($jsonChannelChange.html()) || [];
		$this.data().changeStart = $this.data().changeStart || 0;

		var loading = {
			start : function(){
				$changeBtn.addClass('loading');
			},
			stop : function(){
				setTimeout(function(){
					$changeBtn.removeClass('loading');
				},1000);
			}
		};
		loading.start();

		var getRecommend = function () {
			var page = $this.data().recommendPage;
			var data = $this.data().recommendData.slice(page * recommendPageCount, (page + 1) * recommendPageCount);
			if (data.length <= 0) {
				$this.data().recommendPage = 0;
				if (page > 0) {
					data = getRecommend();
				}
			}
			return data;
		};

		$this.data().recommendPage += 1;

		var readyData = function () {
			var rec = getRecommend();
			var needLen = showLength - rec.length;
			var endNumber = $this.data().changeStart + needLen;
			var needData = $this.data().changeData.slice($this.data().changeStart, endNumber);
			var addLen = needLen - needData.length;
			if (addLen > 0) {
				if ($this.data().lock) {
					var addData = $this.data().changeData.slice(0, addLen);
					needData = needData.concat(addData);
					endNumber = addLen;
				} else {
					getData(function () {
						renderHtml();
					});
					return false;
				}
			}

			$this.data().changeStart = endNumber;
			return rec.concat(needData).sort(function () {
				return Math.random() > 0.5 ? -1 : 1;
			});
		};

		var renderHtml = function () {
			var data = readyData();
			if (data) {
				var html = '';
				$.each(data, function (k, v) {
					v.recommendClass = v.isCrown ? 'is-recommend' : '';
					html += $.parseTemp(changeTemplate, v);
				});
				$moduleVideo.html(html);

				$moduleVideo.find('img[data-original]').lazyload({
					threshold: 200,
					effect: "fadeIn",
					failure_limit: 50
				});
				loading.stop();
			}
		};

		var getData = function (callBack) {
			$.getHttp('/index/change', {
				channelId: channelId,
				page: $this.data().page + 1
			}, function (data) {

				var result = data.data;
				var hits = result.hits;
				var res = [];

				if (result.total < size) {
					$this.data().lock = true;

					//最新弹幕增量与第一次补充最新弹幕增量去重
					res = $.removeRepeatObject($this.data().changeDataOld, hits, 'videoId');
					res = res.concat($this.data().changeDataOld);
				}else{
					res = hits;
				}

				$this.data().page = $this.data().page + 1;
				//弹幕增量与推荐去重
				res = $.removeRepeatObject($this.data().recommendData, res, 'videoId');

				var changeConcatData = [];
				if($this.data().page == 1){
					changeConcatData = $this.data().changeDataOld;
				}else{
					changeConcatData = $this.data().changeData;
				}

				//最新弹幕增量与已存最新弹幕增量去重
				res = $.removeRepeatObject(changeConcatData, res, 'videoId');
				$this.data().changeData = $this.data().changeData.concat(res);

				callBack && callBack();

			}, function () {
				loading.stop();
				$.info.error('获取数据失败!');
			});
		};

		renderHtml();
	});
	//- 圣诞节
	var christmas = function(){
		var t,ctfirst,ctlast,t_ = 12,btn = $('#christmas .close-btn'),countdown,closeCover;
		//-关闭动画事件
		closeCover = function(){
			$('#christmas').hide();
			//-localstorage
			localStorage.christmasDefault = 1;
		}
		//-关闭动画按钮
		btn.on('click',function(){
			closeCover();
		})
		//-当前时间
		t = Date.parse(new Date());
		//- 2016/12/24/20:00
		ctfirst = 1482580800000;
		//- 2016/12/25/24:00
		ctlast = 1482681600000;
		//-出现动画
		if(localStorage.christmasDefault != 1 && parseInt(t) > ctfirst && parseInt(t) < ctlast){
		 $('#christmas').show();
		 }
		//-倒计时
		countdown =  function(t_){
			btn.html("跳过动画("+t_+")");
			if(t_ == 0){
				//-close
				closeCover();
			}else{
				setTimeout(function() {
					countdown(t_)
				},1000)
				t_ --;
			}
		}
		countdown(t_);

	}

	christmas();
});
