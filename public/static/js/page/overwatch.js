$(function () {
  var isInit = 0;

  //判断是否需要滚动到视频位置
  var firstShow = true;
  //滚动位置
  var scrollTo = $(window).width() <= 1280 ? 585 : 620;
  //轮播图
  var $sliderBox = $('#slider-big');
  var $sliderBigger = $('#slider-bigger').length;
  if($sliderBigger){
      $sliderBox = $('#slider-bigger');
  }
  var $sliderItem = $sliderBox.find('.slider-item');
  var $sliderCon = $sliderBox.find('.slider-con');
  var sliderLength = $sliderItem.length;

  var $sliderTitle = "";
  var $sliderTitleItem = "";
  var $sliderTitleWidth = "";
  if($sliderBigger){
      $sliderTitle = $(".slider-count #slider-title .slider-title");
      $sliderTitleItem = $sliderTitle.find(".slider-title-item");
      $sliderTitleWidth = $sliderTitleItem.width();
  }


  if (sliderLength > 1) {
      var countHtml = '';
      for (var i = 0; i < sliderLength; i++) {
          countHtml += '<span>' + (i + 1) + '</span>';
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
          //title 切换
          if($sliderBigger) {
              $sliderTitle.width($sliderTitleWidth * sliderLength)
              $sliderTitle.stop(true, true).animate({
                  left: -$sliderTitleWidth * index
              });
          }
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
          }, 3e3);
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
              sliderFun(sliderIndex)
          });
      }
  }


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
  $('.hero-box, .tags-box').click(function(ev) {
    var $this = $(this);
    if ($this.hasClass('active')) {
      return;
    }
    sid = $this.data().id;
    var data = {
      sort: cid,
      pageNo: 1
    };
    myShowList(data)
    $('.area-filters .active').removeClass('active')
    $this.addClass('active')
    $('.area-filters a.btn-style.show').removeClass("show")
    $this.parents('.filters-group').find('a.btn-style').addClass("show")
  });

  $('.area-filters a.btn-style').click(function(ev) {
    if ($('.area-filters .active').length > 0) {
      $('.area-filters .active').removeClass('active')
      $('.area-filters a.btn-style.show').removeClass("show")
      sid = null;
      myShowList({
        sort: cid,
        pageNo: 1
      })
    }
  })

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
        if (!firstShow) {
          $('html,body').animate({scrollTop: scrollTo}, 300)
        } else {
          firstShow = false
        }
      },
      error: function () {
        $('#emotion div').html('<p class="alert info danger">获取视频列表失败，请于稍后重试。</p>')
        $('#list-pager').html(' ');
      }

    });
  };

  getData($.nowNum);


  //获取up主名人堂关系
  if($.user.isLogin()){
      var uids = $("#fame-hall").find('[data-uid]');
      for(var i = 0;i<uids.length;i++){
          var uid = $(uids[i]).data().uid;
          var btn = $(uids[i]).find('span.follow');
          (function(btn){
              $.ajax({
                  type : "get",
                  url : "/api/friend.aspx",
                  data : {name:"checkFollow",userId:uid},
                  success : function(data){
                      if(data.success){
                          if(data.isFollowing){
                              btn.html('已关注');
                              btn.data().active=1;
                              btn.css({"color":"#999","background":"#eee"});
                          }
                      }else{
                          btn.data().active=0;
                          btn.html('+关注');
                      }
                  }
              });
          })(btn)
      }

  }else{

  }

  //关注
  var $follow = $("#fame-hall");
  var $shadeLayer = $("#shade-layer");
  var $popLogin = $("#pop-login");
  $follow.on('click', '.follow', function () {
      var btn = $(this);
      //已登录
      if($.user.isLogin()){
          //未关注
          if(btn.data().active == 0){
              var temp = $('#temp-item-follow').html();
              var ipt = $('#ipt-group-follow');

              $.get('/api/friend.aspx', {
                  name: "getGroupList"
              }).done(function(data) {
                  if(data.success){
                      var html = "";
                      data = data.groupList;
                      for(var key in data){
                          html += $.parseTemp(temp,{
                              gid: data[key].groupId,
                              count: data[key].groupCount || 0,
                              name: data[key].groupName || '非法分组'});
                      }
                      ipt.html(html);
                      $.callPop('follow','open','','关注&nbsp;&nbsp;'+btn.data().name,function(){
                          $.post('/api/friend.aspx', {
                              name:"follow",
                              username: btn.data().name,
                              userId: btn.data().userid,
                              groupId: ipt.val()
                          }).done(function(data) {
                              if(data.success){
                                  btn.html('已关注');
                                  btn.data().active=1;
                                  btn.css({"color":"#999","background":"#eee"});
                                  $.info.success("向[" + $.trim(ipt.find('option:selected').text().replace(/\(.*/, '')) + "]中添加关注[" + btn.data().name + "]成功",3e3);
                              }else{
                                  $.info.warning("关注数量超过1024或者用户已关注",3e3);
                              }
                              $.callPop('follow','close','','','');
                          }).fail(function(){
                              $.info.warning("关注数量超过1024或者用户已关注",3e3);
                          });
                      });
                  }
              });
          //已关注
          }else{
              $.callPop('confirm','open','','是否确定取消关注？',function(){
                  $.post('/api/friend.aspx?name=unfollow', {
                      username: btn.data().name,
                      userId: btn.data().userid,
                      groupId: 0
                  }).done(function(data) {
                      if(data.success){
                          btn.html("+关注");
                          btn.data().active=0;
                          btn.css({"color":"#fd4c5b","background":"#fff"});
                          $.info.success("已取消对[" + btn.data().name + "]关注",3e3);

                      }else{
                          $.info.warning("取消失败",3e3);
                      }

                      $.callPop('confirm','close','','','');
                  }).fail(function(){
                      $.info.warning("取消关注失败",3e3);
                  });
              });
          }
      //未登录
      }else{
          //$.callPop('login','open','','','');
          window.location.href=globalConfig.rootDomain + "/login/?returnUrl="+location.href;
      }

  });
  $("#pop-login").on('click','#area-login-btn',function(){
      var form = $(".form-login");
      var count = ($.cookie('ac_login_error') | 0) || 0;
      var captchaCheck = false;
      var captcha = '';
      var username = form.find(".area1 input").val();
      var userpwd = form.find(".area2 input").val();
      if(count > 3) {
          $$('#area-captcha-login').removeClass('hidden');
          $$('#ipt-captcha-login').attr({disabled: false});
          captchaCheck = true
      }
      if(captchaCheck){
          captcha = $.trim($('#ipt-captcha-login').val());
      }
      $.post('/login.aspx', {
          username: username,
          password: userpwd,
          captcha: captcha
      }).done(function(data) {
          location.href = location.href.replace(/#.*/, '');
          //$callPop('login','close','','','');
      });



  });
  //取消弹窗
  $shadeLayer.on('click',function(){
      $.callPop('','close','','','');
  });
  /*
  * name:弹窗名称，event:事件，$thi:对象，message:内容，callback:你懂的( *^_^* )
  */
  $.callPop = function(name,event,$thi,message,callback){
      var $pop = $(".pop");
      var top_ = $(window).scrollTop() + 200;
      var left_=$(window).width() / 2 - 170;
      $pop.css({
          'top':top_,
          'left':left_
      });
      switch (name) {
          case 'confirm' :
              $thi = $("#pop-confirm");
              break;
          case 'login' :
              $thi = $("#pop-login");
              break;
          case 'follow' :
              $thi = $("#pop-follow");
              break;
          default :
              $thi = $(".pop");
      }

      switch (event) {
          case 'close' :
              $pop.hide();
              $shadeLayer.hide();
              break;
          case 'open' :
              var $hint = $thi.find(".win-hint-ensure");
              $hint.html(message);
              $thi.show();
              $shadeLayer.show();
              break;
      }
      switch (name) {
          case 'confirm' :
              setTimeout(function() {
                  $('#btn_ok_ensure').off();
                  $('#btn_cancle_ensure').off();
                  $('#btn_ok_ensure').on('click', function() {
                      if (typeof callback == "function") {
                          callback();
                      }else{
                          console.info('callback:not a function.')
                      }
                  });
                  $('#btn_cancle_ensure').on('click', function() {
                      $.callPop(name,'close','','','');
                  });
              },500);
              break;
          case 'follow' :
              setTimeout(function() {
                  $("#btn-do-follow").off();
                  $("#win-btn-close").off();
                  $("#btn-do-follow").on("click", function () {
                      if (typeof callback == "function") {
                          callback();
                      } else {
                          console.info('callback:not a function.')
                      }
                  });
                  $("#win-btn-close").on("click", function () {
                      $.callPop(name, 'close', '', '', '');
                  });
              },500);
              break;
      }

  }

  // 轮播区块滑动入框
  var scale =$(window).width() <= 1280 ? 'scale(.84)' : '';
  $('.slider-wrap').css({
    transform: "translateX(" +$(window).width()+ "px)" + scale,
    visibility: "visible"
  })
  $('.slider-small li').css({
    transform: "translateX(" +$(window).width()+ "px)",
    visibility: "visible"
  })
  setTimeout(function() {
    $('.slider-wrap').css({
      transition: "transform 0.7s",
      transform: ""
    })
    $('.slider-small li:nth-child(odd)').css({
      transition: "transform 0.7s 0.1s",
      transform: "translateX(0px)"
    })
    $('.slider-small li:nth-child(even)').css({
      transition: "transform 0.7s 0.2s",
      transform: "translateX(0px)"
    })
  })
});
