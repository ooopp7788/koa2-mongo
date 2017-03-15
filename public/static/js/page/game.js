/**
 * Created by user on 2016/12/12.
 */
$(function(){
	var $host = 'http://games.aixifan.com/';
	var type = '',like = '',count = 0,limit = 6,n = 0,countF = 0,limitF = 10;
	//轮播图
	var $sliderBox = $('#slider-big');
	var $sliderBigger = $('#slider-bigger').length;
	if($sliderBigger){
		$sliderBox = $('#slider-bigger');
	}
	var $sliderItem = $sliderBox.find('.slider-item');
	var $sliderCon = $sliderBox.find('.slider-con');
	var sliderLength = $sliderItem.length;
	if (sliderLength > 1) {
		var countHtml = '';
		for (var i = 0; i < sliderLength; i++) {
			countHtml += '<span></span>';
		}
		if(!$sliderBigger){
			$sliderBox.append('<div class="slider-count">' + countHtml + '</div>');
		}
		var sliderIndex = 0;

		var sliderFun = function (index) {
			var itemWidth = $sliderItem.width();
			$sliderCon.width($sliderItem.width() * sliderLength);
			$sliderCon.stop(true,true).animate({
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
			}, 2e3);
		};
		sliderFun(0);
		sliderAutoPlay();

		$sliderBox.hover(function () {
			clearInterval(sliderInterval);
			sliderIndex--;
		}, function () {
			if (sliderIndex >= sliderLength - 1) {
				sliderIndex = 0;
			} else {
				sliderIndex++;
			}
			sliderAutoPlay();
		});

		if($sliderBigger){
			$sliderBox.on('mouseover', '.slider-count span', function () {
				sliderIndex = $(this).index();
				sliderFun(sliderIndex);
			});
		}else {
			$sliderBox.on('click', '.slider-count span', function () {
				sliderIndex = $(this).index();
				sliderFun(sliderIndex);
			});
		}

		//点击左右
		$('.btnL').on('click',function(){
			var num = $('.slider-count span.active').index();
			if(num == 0){
				$('.slider-count span').eq(sliderLength-1).click();
			}else{
				$('.slider-count span').eq(num-1).click();
			}
			clearInterval(sliderInterval);
		});
		$('.btnR').on('click',function(){
			var num = $('.slider-count span.active').index();
			if(num == sliderLength-1){
				$('.slider-count span').eq(0).click();
			}else{
				$('.slider-count span').eq(num+1).click();
			}
			clearInterval(sliderInterval);
		});
	}

	if($.user.isLogin()){
		$(".user-avatar").show();
	}

	$(window).resize(function () {
		var $count = $('.slider-count').width();
		var $boxW = $('.slider-big').width();
		var widthN = ($boxW - $count)/2;
		$('.slider-count').css({
			'right': widthN
		});
	}).resize();

	//游戏列表鼠标跟随
	var listMove = function(){
		var _type = '';
		if(n==0){
			_type = '.all';
		}else if(n==1){
			_type = '.news';
		}else if(n==2){
			_type = '.hot';
		}else if(n==3){
			_type = '.web';
		}
		$(_type).find('.gameList .listBox').mousemove(function(e){
			var e=e?e:window.event;
			var $this = $(this);
			var listTop = e.pageY - $this.offset().top;
			var listLeft = e.pageX - $this.offset().left;
			$this.find('.listpop').css({
				'display':'block',
				'top':(listTop + 10) +'px',
				'left':(listLeft + 10) +'px'
			})
		});
		$(_type).find('.gameList .listBox').mouseleave(function(){
			$(this).find('.listpop').css({
				'display':'none'})
		});
	};
	listMove();


	//消息列表时间转换
	function getDateDiff(dateTimeStamp){
		var dt = new Date(dateTimeStamp).getTime();
		var minute = 1000 * 60;
		var hour = minute * 60;
		var day = hour * 24;
		var halfamonth = day * 15;
		var month = day * 30;
		var now = new Date().getTime();
		var diffValue = now - dt;
		if(diffValue < 0){return;}
		var monthC =diffValue/month;
		var weekC =diffValue/(7*day);
		var dayC =diffValue/day;
		var hourC =diffValue/hour;
		var minC =diffValue/minute;
		if(monthC>=1){
			result="" + parseInt(monthC) + "月前";
		}
		else if(weekC>=1){
			result="" + parseInt(weekC) + "周前";
		}
		else if(dayC>=1){
			result=""+ parseInt(dayC) +"天前";
		}
		else if(hourC>=1){
			result=""+ parseInt(hourC) +"小时前";
		}
		else if(minC>=1){
			result=""+ parseInt(minC) +"分钟前";
		}else
			result="刚刚";
		return result;
	}


	//消息列表渲染
	var messageList = function(count,limit){
		var temp = $('#list-message').html();
		var html = '',imgs='',data,addre='',clas='';
		count = String(count);
		limit = String(limit);
		if(type == ""){
			data = "_afOther="+JSON.stringify({limit:[count,limit]})+"&_afGet="+JSON.stringify({num:"1"});
		}else{
			data = "_afOther="+JSON.stringify({limit:[count,limit]})+"&_afWhere="+JSON.stringify({type:type})+"&_afGet="+JSON.stringify({num:"1"});
		}

		$.ajax({
			type: 'get',
			url: $host+'api/game/inform',
			data: data,
			crossdomain: true
		}).done(function(data){
			if(data.errorid == 0){
				var datas = data.vdata.result;
				var countP = data.vdata.num;
				var $url = 'http://www.acfun.cn';
				if(datas.length>0){
					for(var i=0;i<datas.length;i++){
						if(datas[i].flag == '0'){
							addre = $url + '/v/' + datas[i].addre;
							imgs = '';
						}else if(datas[i].flag == '1'){
							addre = $url + '/a/' + datas[i].addre;
							imgs = '';
						}else if(datas[i].flag == '2'){
							addre = $url + '/v/' + datas[i].addre;
							imgs = '';
						}else if(datas[i].flag == '3'){
							addre = $url + '/a/' + datas[i].addre;
							imgs = '';
						}else if(datas[i].flag == '4'){
							addre = $url + '/u/' + datas[i].addre;
							imgs = '';
						}else if(datas[i].flag == '8'){
							addre = datas[i].addre;
							imgs = '';
						}else if(datas[i].flag == '16'){
							addre = datas[i].addre;
							imgs = "<image src='" + datas[i].icon + "'/>";
						}else if(datas[i].flag == '17'){
							addre = '/package/#giftId='+ datas[i].addre;
							imgs = "<image src='" + datas[i].icon + "'/>";
						}

						if(datas[i].type == 'notice'){
							clas = 'notice';
						}else{
							clas = '';
						}

						html += $.parseTemp(temp,{
							url: addre,
							avatar: "<image src='" + datas[i].headImg + "'/>",
							content: datas[i].content,
							nice: datas[i].nice,
							text: datas[i].text,
							date: getDateDiff((datas[i].createAt)*1000),
							icon: imgs,
							clas: clas
						})
					}
					if(countP > limit){
						$('.message-box .refresh').show();
						ref(countP);
					}else{
						$('.message-box .refresh').hide();
					}
					$('.message-box .listMessage').html(html);
				}else{
					$('.message-box .listMessage').html('');
					$('.message-box .refresh').hide();
				}
			}

		})
	};
	messageList(0,6);

	//tab切换
	$('.mes-tab').on('click', "a", function () {
		var $this = $(this);
		$this.addClass("active").siblings().removeClass("active");
		type = $this.data().con;
		count = 0;
		limit=6;
		messageList(count,limit);
	});
	//点击刷新
	var ref = function(countP){
		$('.message-box .refresh').off().on('click',function(){
			count += limit;
			if(count > (Math.ceil(countP/limit-1))*6){
				count = 0;
				limit = 6;
				messageList(count,limit);
			}else{
				messageList(count,limit);
			}
		});
	};

	var key = $.cookie('auth_key');
	var key_ac_sha1 = $.cookie('auth_key_ac_sha1');
	var _key_ac_sha1_ =($.cookie('auth_key_ac_sha1_'))?encodeURIComponent(($.cookie('auth_key_ac_sha1_')).replace(/\s/g, '+')) : '';

	//flash游戏渲染
	var flashList = function(countF,limitF){
		var tempF = $('#temp-flash').html(),html='',clas='',data;
		countF = String(countF);
		limitF = String(limitF);

		if(like==1){
			data = "like="+1+"&auth_key="+key+"&auth_key_ac_sha1="+key_ac_sha1+"&auth_key_ac_sha1_="+_key_ac_sha1_+"&_afGet="+JSON.stringify({num:"1"})+"&_afOther="+JSON.stringify({limit:[countF,limitF]});
		}else{
			data = "auth_key="+key+"&auth_key_ac_sha1="+key_ac_sha1+"&auth_key_ac_sha1_="+_key_ac_sha1_+"&_afGet="+JSON.stringify({num:"1"})+"&_afOther="+JSON.stringify({limit:[countF,limitF]});
		}
		$.ajax({
			type: 'get',
			url: $host + 'api/game/flash',
			data: data,
			crossdomain: true
		}).done(function(data){
			if(data.errorid == 0){
				var flashData = data.vdata.result;
				var countN = data.vdata.num;
				if(flashData.length>0){
					for(var i=0;i<flashData.length;i++){
						if(like==1){
							clas = 'active';
						}else{
							if(flashData[i].like){
								clas = 'active';
							}else{
								clas = '';
							}
						}
						html += $.parseTemp(tempF,{
							url: flashData[i].url,
							title: flashData[i].title,
							id: flashData[i]._afid,
							like: clas
						})
					}
					$('.flash-list .flash-box').html(html);
					if(countN > limitF) {
						$('.flash-list .refresh').removeClass('hidden');
						flashFre(countN);
					}else{
						$('.flash-list .refresh').addClass('hidden');
					}
				}else{
					$('.flash-list .flash-box').html('');
					$('.flash-list .refresh').addClass('hidden');
				}

			}
		}).fail(function(){

		})
	};
	flashList(0,10);
	//flash  tab
	$('.message-tab').on('click', "a", function () {
		var $this = $(this);
		$this.addClass("active").siblings().removeClass("active");
		like = $this.data().con;
		countF = 0;
		limitF = 10;
		if(like == 1){
			if($.user.isLogin()){
				flashList(countF,limitF);
			}else{
				window.location.href = "http://www.acfun.cn/login/?returnUrl=" + location.href;
			}
		}else{
			flashList(countF,limitF);
		}

	});

	//换一换
	var flashFre = function(countN){
		$('.flash-list .refresh').off().on('click',function(){
			countF += limitF;
			if(countF > (Math.ceil(countN/limitF-1))*10){
				countF = 0;
				limitF = 10;
				flashList(countF,limitF);
			}else{
				flashList(countF,limitF);
			}
		});
	};


	$('.flash-list').on('click', ".gameImg", function () {
		var $this = $(this);
		var fid = $this.parent().data().id;

		if($.user.isLogin()){
			$.ajax({
				type: 'get',
				url: $host + 'api/game/likef?flash_id='+ fid+'&auth_key='+key+'&auth_key_ac_sha1='+key_ac_sha1+'&auth_key_ac_sha1_='+_key_ac_sha1_
			}).done(function(data){
				if(data.errorid == 0){
					if($this.hasClass('active')){
						$this.removeClass('active');
					}else{
						$this.addClass('active');
					}
				}
			})
		}else{
			window.location.href = "http://www.acfun.cn/login/?returnUrl=" + location.href;
		}

	});

	$(".listTab").on("click","a",function(){
		$(this).addClass("active").siblings("a").removeClass("active");
		n = $(this).data().con;
		listMove();
		switch (n){
			case 0:
				$(".all").show();
				$(".news,.hot,.web").hide();
				break;
			case 1:
				$(".news").show();
				$(".all,.hot,.web").hide();
				break;
			case 2:
				$(".hot").show();
				$(".all,.news,.web").hide();
				break;
			default :
				$(".web").show();
				$(".all,.news,.hot").hide();
		}
	});

	//分页
	var showList = function(param){
	    var $content;
		var divList =  $(".all,.news,.hot,.web");
		for(var i=0;i<divList.length;i++){
			if(!$(divList[i]).is(":hidden")){
				$content = $(divList[i]);
				switch (i){
					case 0:
						type = "all";
						break;
					case 1:
						type = "news";
						break;
					case 2:
						type = "hot";
						break;
					case 3:
						type = "web";
						break;
				}
			}
		}
		var pageN = (param.pageNum-1)*8;
		$.ajax({
			type: "get",
			url: '/game/next?type='+type+'&pageNo='+pageN,
			xhrFields: {
				withCredentials: true
			}
		}).done(function (data) {
			data = data.data;
			if(data){
				var page = data.page;
				var html = data.html;

				var pager = $.makePager({
					num: param.pageNum,
					count: page,
					size: 8,
					total: page/8,
					addon: true,
					hasjumpPage: true
				});
				$('#list-pager-'+type).html(pager);

				$content.find(".gameList").html(html);
				listMove();
			}
		}).fail(function(){
			$content.find(".gameList").html("<div id='emotion'><img src='" + window.globalConfig.oldPath + "/umeditor/dialogs/emotion/images/ac/" + $.randomNumber(1, 54) + ".gif'/><div id='list'>获取列表失败，请于稍后重试。</div></div>");
			$('#list-pager-'+type).html(' ');
		});
	};

	//页面初始化分页
	var Fun = function(){
		var pageNo = 1, size = 8;
		var ary = [pageCount.all,pageCount.news,pageCount.hot,pageCount.web];
		for(var i = 0; i<ary.length; i++)
			if(ary[i]){
				var pager = $.makePager({
					num: pageNo,
					count: ary[i],
					size: size,
					total: ary[i]/size,
					addon: true,
					hasjumpPage: false
				});
				if(i ==0){
					$('#list-pager-all').html(pager);
					$('#list-pager-all').readyPager({
						addon: true,
						callback: function (n) {
							return showList({
								pageNum: n
							});
						}
					});
				}else if(i == 1){
					$('#list-pager-news').html(pager);
					$('#list-pager-news').readyPager({
						addon: true,
						callback: function (n) {
							return showList({
								pageNum: n
							});
						}
					});
				}else if(i == 2){
					$('#list-pager-hot').html(pager);
					$('#list-pager-hot').readyPager({
						addon: true,
						callback: function (n) {
							return showList({
								pageNum: n
							});
						}
					});
				}else if(i == 3){
					$('#list-pager-web').html(pager);
					$('#list-pager-web').readyPager({
						addon: true,
						callback: function (n) {
							return showList({
								pageNum: n
							});
						}
					});
				}

			}
	};
	Fun();


	//------------------------------------统计---------------------------------------------
	var game = function(param,target,resource,page){
		window.sa && sa.track(param, {
			product: 'web',
			UID: String(user.uid),
			channel: $.getQueryString("channel") || '',
			userLevel: $.user.isLogin() ? (user.level > 0 ? 1 : 0) : -1,
			client:'Web',
			target: target,
			resource: resource,
			page: 'PC_GC'
		});
	};
	var gameUser = function(){
		window.sa && sa.setProfile({
			distinct_id:'',
			product: 'web',
			uid: String(user.uid),
			channel: $.getQueryString("channel") || ''
		});
	};
	gameUser();

	//游戏banner
	$('#slider-big').on('click','a',function(){
		var resource = 'PC_GC_Banner: 584e15d68e450a006ac98055';
		var target = $(this).attr('href');
		game('gm_navigational_click',target,resource);
	});
	$('.list-box').on('click','.box-img a,.download',function(){
		var resource = 'PC_GC_Promo: 584e15d68e450a006ac98055';
		var target = $(this).attr('href');
		game('gm_page_open',target,resource);
	});
	$('.listBox').on('click','.appointment',function(){
		var resource = 'PC_GC_GameList: 584e15d68e450a006ac98055';
		var target = $(this).attr('href');
		game('gm_page_open',target,resource);
	});
	$('.game-advertise').on('click',function(){
		var resource = 'PC_GC_Ad: 584e15d68e450a006ac98055';
		var target = $(this).attr('href');
		game('gm_navigational_click',target,resource);
	});
	$('.listMessage').on('click','.mes-list',function(){
		var resource = 'PG_GC_Message: 584e15d68e450a006ac98055';
		var target = $(this).data().url;
		game('gm_page_open',target,resource);
	});
});