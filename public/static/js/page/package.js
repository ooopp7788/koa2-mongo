/**
 * Created by user on 2016/12/12.
 */
$(function(){//轮播图
	var lock = true;

	$('.btnlogin .btn1').attr('href',"http://www.acfun.cn/reg/?returnUrl=" + location.href);
	$('.btnlogin .btn2').attr('href',"http://www.acfun.cn/login/?returnUrl=" + location.href);
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
			//sliderFun(sliderIndex);
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
	//-全局定义礼包id数组
	var $conidArr = [];
	var $listAry = [],searchAry=[];
	if($.user.isLogin()){
		$(".user-avatar").show();
	}

	//礼包列表鼠标跟随
	$('.list-box').mousemove(function(e){
		var e=e?e:window.event;
		var $this = $(this);
		var listTop = e.pageY - $this.offset().top;
		var listLeft = e.pageX - $this.offset().left;
		$('.packspop').eq($(this).index()).css({
			'display':'block',
			'top':(listTop + 10) +'px',
			'left':(listLeft + 10) +'px'
		})
	});
	$('.list-box').mouseleave(function(){
		$('.packspop').eq($(this).index()).css({
			'display':'none'})
	});

	var $host = "http://games.aixifan.com";
	var key = $.cookie('auth_key');
	var key_ac_sha1 = $.cookie('auth_key_ac_sha1');
	var _key_ac_sha1_ = ($.cookie('auth_key_ac_sha1_'))?encodeURIComponent(($.cookie('auth_key_ac_sha1_')).replace(/\s/g, '+')) : '';

	//我的礼包/package/mygift?
	var myGift = function(){
		var html='',str='';
		$.ajax({
			type: 'get',
			url: $host +'/api/gift/user?auth_key='+key+'&auth_key_ac_sha1='+key_ac_sha1+'&auth_key_ac_sha1_='+_key_ac_sha1_+'',
			crossdomain: true
		}).done(function(data){
			if(data.errorid == 0){
				var data = data.vdata.result;
				if(data.length>0){

					for(var i=0;i<data.length;i++){
						var giftAry = [];
						for(var z=0; z<data[i].content.length;z++){
							var dataZ = JSON.parse((data[i].content)[z]);
							str = dataZ.text;
							giftAry.push(str);
						}
						var giftname = giftAry.join('、');
						var num = $.formatDate((data[i].createAt)*1000,'[Y]-[M]-[D]');

						html+='<div class="mes-list clearfix"><div class="mesimg fl"><img src="'+data[i].gift_icon+'" /></div><div class="fr"><div class="title"><span>'+data[i].gift_name+'</span></div><div class="areames"><div class="date">领取于'+num+'</div><div class="lists"><div class="text-overflow">'+giftname+'</div><i></i></div><div class="giftnum text-overflow hidden">礼包码：<span>'+data[i].code+'</span></div><div class="packtypeL hidden">';
						for(var y=0; y<data[i].content.length;y++){
							var dataH = JSON.parse((data[i].content)[y]);
							html += '<div class="pack1"><img src="'+dataH.imgSrc+'"><span>'+dataH.text+'×'+dataH.num+'</span></div>'
						}
						html+= '</div> </div> </div> </div>';

					}
					$('.message-box .myGiftRoll').html(html);
					giftSty();
				}else{
					$('.message-box').html('<div class="nothing"><div class="acimg"><div class="imgS"></div><span>毛都没有</span> </div> </div>')
				}
			}
		})
	};
	if($.user.isLogin()){
		myGift();
	}else{
		$('.message-box').find('.notlong').removeClass('hidden');
	}
	//我的礼包点击
	$('.message-box').on('click','.mes-list',function(){
		$this = $(this);
		if($this.find('.packtypeL').hasClass('hidden')){
			$this.find('.giftnum').removeClass('hidden');
			$this.find('.packtypeL').removeClass('hidden');
			$this.siblings().find('.giftnum').addClass('hidden');
			$this.siblings().find('.packtypeL').addClass('hidden');
		}else{
			$this.find('.giftnum').addClass('hidden');
			$this.find('.packtypeL').addClass('hidden');
		}
		giftSty();
	});

	//我的礼包出现滚动条样式
	var giftSty = function(){
		var giftS = $('.myGiftRoll').height();
		var mesBox = $('.message-box').height();
		if(giftS >= mesBox){
			$('.mes-list').find('.title').css({'width':'178px'});
			$('.mes-list').find('.lists div').css({'width':'156px'});
		}
	};


	var dataF = function(data,packnum,rennum,html,con,has,hisTory){
		for(var i=0;i<data.length;i++){
			var num = $.formatDate((data[i].startAt)*1000,'[Y]-[M]-[D]');
			var total = $.formatDate((data[i].endAt)*1000,'[Y]-[M]-[D]');
			if(data[i].code){
				packnum = '礼包码：' + data[i].code;
				rennum = '领取于：' + $.formatDate((data[i].getAt)*1000,'[Y]-[M]-[D]');
				has = '<a href="javascript:;" class="appointment btnhas fr" data-fid = "'+data[i]._afid+'"><i></i>已领取</a>'
			}else{
				packnum = num +'~'+ total;
				rennum = '已有'+ data[i].num +'人领取  共' + data[i].total + '个';
				if(hisTory){
					has = '<a href="javascript:;" class="appointment notbtn fr" data-fid = "'+data[i]._afid+'">已抢光</a>'
				}else{
					has = '<a href="javascript:;" class="appointment receive btns fr" data-fid = "'+data[i]._afid+'">领取</a>'
				}
			}

			html += '<div class="listBox clearfix fl" data-id = "'+data[i]._afid+'" data-name="'+data[i].name+'">';
			html += '<div class="listT"><div class="listimg fl"><img src="'+data[i].icon+'" /></div>';
			html += '<div class="listright fl">';
			html += '<div class="leftL">';
			html += '<div class="title text-overflow">'+data[i].name+'</div><a href="javascript:;" title="'+data[i].info+'">礼包说明</a><div class="name text-overflow">'+rennum+'</div><div class="date text-overflow">'+packnum+'</div> </div> </div>'+has+'</div>';
			html+='<div class="Package-details clearfix hidden"><div class="detailR clearfix"><div class="topX"></div>';
			for(var y=0; y<data[i].content.length;y++){
				var dataH = JSON.parse((data[i].content)[y]);
				html += '<div class="detailBox fl"><img src="'+dataH.imgSrc+'" /><div class="packname text-overflow">'+dataH.text+'</div><div class="num">×'+dataH.num+'</div> </div>'
			}
			html+= '</div></div>';
			html += '</div>';

		}
		if(con==0){
			$('.gameList').html(html);
		}else{
			$('.gameList').append(html);
			$('.history-gift').css({
				'display':'none'
			});
		}

	};
	//礼包列表
	var giftList = function(){
		var temp = $('#temp-gift-list').html();
		var html='',packnum,rennum,con=0;
		$.ajax({
			type: 'get',
			url: $host + '/api/gift/list?auth_key='+key+'&auth_key_ac_sha1='+key_ac_sha1+'&auth_key_ac_sha1_='+_key_ac_sha1_+'',
			crossdomain: true
		}).done(function(data){
			if(data.errorid == 0){
				var data = data.vdata.result;
				if(data.length || data.length > 0){
					dataF(data,packnum,rennum,html,con);

					aryFun();
				}
			}
		})
	};
	giftList();

	//加载历史礼包
	$('.history-gift').on('click','.gift',function(){
		var html='',packnum,rennum,con=1,has,hisTory = true;
		$conidArr = [];
		searchAry = [];
		$.ajax({
			type: 'get',
			url: $host + '/api/gift/olist',
			crossdomain: true
		}).done(function(data){
			if(data.errorid == 0){
				var data = data.vdata.result;
				if(data.length > 0){
					dataF(data,packnum,rennum,html,con,has,hisTory);
					aryFun();
					giftSearch();
				}else{
					$('.history-gift').css({
						'display':'none'
					});
				}
			}
		})
	});

	//礼包列表click
	$('.gameList').on('click','.listBox',function(){
		var $this = $(this);
		if($this.find('.Package-details').hasClass('hidden')){
			$this.find('.Package-details').removeClass('hidden');
			$this.siblings().find('.Package-details').addClass('hidden');
		}else{
			$this.find('.Package-details').addClass('hidden');
		}


	});

	//如果广告位配置的礼包点击
	$('#adver').on('click',function(){
		var gifId = $(this).data().id;
		if(gifId){
			if($.inArray(gifId,$conidArr) >= 0){
				var topI = $('.gameList [data-id="'+gifId+'"]').offset().top - 200;
				$("html,body").animate({scrollTop: topI}, 1e3);
				$('.gameList [data-id="'+gifId+'"]').click();
			}
		}
	});

	//礼包列表展开事件
	var aryFun = function(){
		$listAry = $('.gameList .listBox');
		var id,name;
		for(var j = 0;j < $listAry.length;j++ ){
			id = $($listAry[j]).data().id;
			name = $($listAry[j]).data().name;
			$conidArr.push(id);
			searchAry.push(name);
		}

		//获取hash
		var isGiftId = $.fomatHash().giftId;
		if(isGiftId){
			if($.inArray(isGiftId,$conidArr) >= 0){
				var topG = $('.gameList [data-id="'+isGiftId+'"]').offset().top - 200;
				$("html,body").animate({scrollTop: topG}, 1e3);
				$('.gameList [data-id="'+isGiftId+'"]').click();
			}
		}
	};

	//-点击最热礼包跳到礼包列表
	$('.recommend-list').on('click','.list-box',function(){
		if($.inArray($(this).data().id,$conidArr) >= 0){
			var _top = $('.gameList [data-id="'+$(this).data().id+'"]').offset().top - 200;

			$("html,body").animate({scrollTop: _top}, 1e3);
			$('.gameList [data-id="'+$(this).data().id+'"]').click();
		}
	});

	//-点击轮播礼包跳到礼包列表
	$('#slider-big').on('click','.slider-item',function(){
		if($.inArray($(this).data().id,$conidArr) >= 0){
			var _top = $('.gameList [data-id="'+$(this).data().id+'"]').offset().top - 200;

			$("html,body").animate({scrollTop: _top}, 1e3);
			$('.gameList [data-id="'+$(this).data().id+'"]').click();
		}
	});

	//点击领取
	if(lock){
		$('.gameList').on('click','.receive',function(){
			lock = false;
			var $this=$(this);
			$this.addClass('active');
			var giftId = $this.data().fid;
			gift('gm_gift_try',giftId);
			if($.user.isLogin()){
				$.ajax({
					type: 'get',
					url: $host + '/api/gift/code?gift_id='+giftId+'&auth_key='+key+'&auth_key_ac_sha1='+key_ac_sha1+'&auth_key_ac_sha1_='+_key_ac_sha1_+'',
					crossdomain: true
				}).done(function(data){
					gift('gm_gift_success',giftId);
					lock = true;
					$this.removeClass('active');
					if(data.errorid == 0){
						var dataD = data.vdata.result;
						if(dataD.code){
							$this.parent().find('.date').html('礼包码：' + dataD.code);
							$this.parent().find('.name').html('领取于：' + $.formatDate((dataD.getAt)*1000,'[Y]-[M]-[D]'));
							$this.parent().find('.appointment').html('<i></i>已领取');
							$this.parent().find('.appointment').removeClass('receive btns');
							$this.parent().find('.appointment').addClass('btnhas');
							myGift();
						}
					}else{
						$.info.warning(data.errordesc, 3e3);
					}
				}).fail(function(error){
					lock = true;
					$(this).removeClass('active');
					$.info.warning(error.errordesc, 3e3);
					gift('gm_gift_success',giftId);
				})
			}else{
				window.location.href = "http://www.acfun.cn/login/?returnUrl=" + location.href
			}

		});
	}

	//-
	var giftSearch = function (){
		if(searchAry){
			var val = $('#search-gift').val();
			if( '' == val )
			{
				$('.gameList').find('.listBox').css({
					"display":"block"
				});
			}
			else
			{
				for(var i in searchAry){
					var item = String(searchAry[i]);
					if(item.indexOf(val) != -1){
						$('.gameList [data-name="'+item+'"]').css({
							"display":"block"
						});
					}else{
						$('.gameList [data-name="'+item+'"]').css({
							"display":"none"
						});
					}
				}
			}
		}

	}

	$('#search-gift').keyup(function(){
		giftSearch();
	});

	$('#search-gift').keydown(function(e){
		if(e.keyCode == 13){
			$('#search-gift-btn').click();
		}
	});
	//搜索按钮
	$('#search-gift-btn').on('click',function(){
		giftSearch();
	});

	$(window).resize(function () {
		var $count = $('.slider-count').width();
		var $boxW = $('.box').width();
		var widthN = ($boxW - $count)/2;
		$('.slider-count').css({
			'margin-right': widthN
		});
		$('.slider-item').css({
			'width': $boxW
		});
		$('.slider-item img').css({
			'margin-left': -(1920-$boxW)/2
		});
	}).resize();


	//------------------------------------统计---------------------------------------------
	var gift = function(param,giftId){
		window.sa && sa.track(param, {
			product: 'web',
			UID: String(user.uid),
			channel: $.getQueryString("channel") || '',
			userLevel: $.user.isLogin() ? (user.level > 0 ? 1 : 0) : -1,
			giftId: giftId
		});
	};
	var giftUser = function(){
		window.sa && sa.setProfile({
			distinct_id:'',
			product: 'web',
			uid: String(user.uid),
			channel: $.getQueryString("channel") || ''
		});
	};
	giftUser();

	//礼包页
	//$('#slider-big').on('click','a',function(){
	//	var id = 'PC_GI_Banner: 584e15d68e450a006ac98055';
	//	gift('gm_navigational_click',id);
	//});
	//$('.list-box').on('click',function(){
	//	var id = 'PC_GI_Promo: 584e15d68e450a006ac98055';
	//	gift('gm_page_open',id);
	//});
	//$('.game-advertise').on('click',function(){
	//	var id = 'PC_GI_Ad: 584e15d68e450a006ac98055';
	//	gift('gm_navigational_click',id);
	//});
	$('.gameList').on('click','.listBox',function(){
		var id = $(this).data().id;
		gift('gm_gift_expend',id);
	});
});