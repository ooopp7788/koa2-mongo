/**
 * Created by user on 16/2/19.
 */
$(function(){
    //延迟加载
    $('img[data-original]').lazyload({
        threshold: 200,
        effect: "fadeIn",
        failurelimit : 20
    });
    //弹幕
    $('.block-video .has-danmu').showDanmu();

    $('.module-video-big .has-danmu').showDanmu({
        lines: 5,
        lineHeight: 30
    });

    //排行榜tab切换
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

    //最新弹幕换一换
    var $btnChange = $(".area-header .area-change-btn");
    $btnChange.on('click',function(){
        var obj0 = $(this);
        if(obj0.hasClass('loading')){
            return;
        }
        var $thisScope = obj0.closest('[data-tab]');
        var $pageNum = $thisScope.find('.video-main').data().pagenum;
        //计算tab值
        var dataCon = parseInt($thisScope.find('[data-con].active').data().con);
        var btn = obj0.closest('.area-change-btn');
        var $videoMain = $thisScope.find('.video-main');
        $(btn).addClass('loading');
        if($videoMain.data().pagenum != 1 && dataCon<4){//静态切换
            dataCon++;
            $thisScope.find('[data-con]').removeClass('active').addClass('hidden').filter('[data-con="' + dataCon + '"]').removeClass('hidden').addClass('active');
            $thisScope.find('.area-main').eq(dataCon).find('img[data-original]').lazyload({
                threshold: 200,
                effect: "fadeIn",
                failurelimit : 20
            });
            setTimeout(function(){
                $(btn).removeClass('loading');
            },1e3);

        }else{//获取新模板
            var $channelId = obj0.closest('[data-cid]');
            $(btn).addClass('loading');
            $.get('/channel/area', {
                channelId: $channelId.data().cid,
                pageNum: $pageNum,
                pageSize: $channelId.data().size
            }).done(function (data) {
                $videoMain.data().pagenum = $pageNum + 1;
                $channelId.find('section.video-main').html(data.data);
                $(btn).removeClass('loading');
                $thisScope.find('.area-main').eq(0).find('img[data-original]').lazyload({
                    threshold: 200,
                    effect: "fadeIn",
                    failurelimit : 20
                });
            })
        }
    });
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

});
