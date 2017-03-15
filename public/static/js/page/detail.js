$(function(){
    //视频是否准备好了
    var hasReady = false
    $.config = localStorage.config ? JSON.parse(localStorage.config) : "";
    ZeroClipboard.config( { swfPath: window.globalConfig.path+"/flash/ZeroClipboard.swf" } );

    // 检查是否支持flash
    function checkFlash() {
      var hasFlash = false;
      try {
          hasFlash = Boolean(new ActiveXObject('ShockwaveFlash.ShockwaveFlash'));
      } catch(exception) {
          hasFlash = ('undefined' != typeof navigator.mimeTypes['application/x-shockwave-flash']);
      }
      if (!hasFlash) {
        var html = '<div class="noflash-alert"><p>提示</p><div class="description"><img src="http://cdn.aixifan.com/dotnet/20130418/style/image/iconfont-flash.png"><p>请下载最新的flash插件</p></div><a href="http://get.adobe.com/cn/flashplayer/" target="_blank" class="button">去下载</a></div>'
        $('#player').css({'position': "relative"}).append(html)
        $('#ACFlashPlayer').css({height: '730px'})
      }
    }
    checkFlash()

    //提供给flash用的方法
    window.flashload = function() {
      window.location.reload()
    }
    var vv = window.globalConfig.version;
    $('#nav').hide();
    var $P = $("#pageInfo");
    var videoInfo = {}
    if (pageInfo && pageInfo.videoList) {
      videoInfo = pageInfo.videoList[pageInfo.P]
    }
    if($.user.isLogin()){
        if($.user.group == 2 || $.user.group == 3){
            $.user.group = $P.data().uid == $.user.uid ? 3 : 2;
        }
    }else{
        $.user.group = 1;
    }
    if($.user.isLogin()){
        $(".user-avatar").show();
        if($.user.group == 0){
            $(".barrage-management").show();
        }
    }
    //-实时浏览器宽度
    $(window).resize(function(){
        windowWidth = $(window).width()
        // if(!$("#player object").is(".fullscreen")){
        //     if( windowWidth <= 1440 && $("#player object")) {
        //         $("#player object").css({width:980,height:471});
        //     }else{
        //         $("#player object").css({width:1160,height:730});
        //     }
        // }
        if ($("section.player #player").hasClass('small')) {
          var positon = $('#player').position()
          if (windowWidth < positon.left + 260) {
            $('#player').css({left: (windowWidth-260) + 'px'})
          }
        }
    });

    $("head").append('<style>section.player #player.small{left:' + (($(window).width() + $('.wp.nav-parent').width())/2 - 260) + 'px}</style>')
    //-实时浏览器滚动
    $(window).scroll(function(){
        if (!hasReady) {
          return
        }
        if($(window).scrollTop() > 1050){
            //- 不允许拖动
            if($.config != "" && !$.config.player.playerFloatAllowed){}else{
                if(videoInfo.source_type == "zhuzhan") {
                    $("section.player #player").addClass("small");
                }
            }
        }else{
            $("section.player #player").removeClass("small");
        }
        //-192.168.60.204
    });

    //-播放器窗口拖动
    $(function(){
        var inner = $("#player");
        $("#player .handle").one("mouseenter",function(){
            inner.draggable({
                handle: $("#player .handle"),
                containment: 'window',
                scroll: false
            })
        });
    });
    //-观看、评论、**、**、**...
    $.collectCount = function(){
        $.get('/content_view.aspx', {
            contentId: $P.data().aid
        }).done(function(data) {
            $crumb.find(".view .sp2").text($.parsePts(data[0]) || 0);
            $crumb.find(".comm .sp2").text($.parsePts(data[1]) || 0);
            $crumb.find(".collection .sp4").text($.parsePts(data[5]) || 0);
            $crumb.find(".banana .sp4").text($.parsePts(data[6]) || 0);
            // $.baiFenDian();
        });
    };
    //-合辑订阅状态、数量
    $.specialCount = function(){
        $.get('/special_view.aspx', {
            specialId: $.fomatHash().album.split(",")[0]
        }).done(function(data) {
            if(data.success){
                var $btn = $("section.collection .top .subs");
                data = data.data;
                $btn.find(".sp1").html("&nbsp;"+$.parsePts(data[1]) || 0);
                if(data[2] && data[2] == 1){
                    $btn.addClass("active").data().status = 1;
                    $btn.find("i").text("已订阅");
                }
            }else{

            }
        });
    }

    function Player(param){
        param = param ? param : {};
        this.el = document.getElementById('ACFlashPlayer');
        this.$elPlayer = $('#player');
        this.path = globalConfig.cdn+'/flash/player-view-homura.swf';
        this.width = param.width || $(window).width() <= 1440 ? 980 : 1160;
        this.height = param.height || 568;
        this.fs = param.fs || 0;
        this.autoplay = param.autoplay || 0;
        this.hints = [
            '右键点击视频中的弹幕可以屏蔽发送该弹幕用户的所有弹幕。',
            '播放器右下的四个按钮依次是屏蔽弹幕、循环视频、详细设置和全屏播放。',
            '打开右侧弹幕列表后，可以在列表下方开启合并重复弹幕、连播模式等功能。',
            '“更多设置项”里可以设置更多功能，也可以使用更细致的屏蔽功能。',
            '点击弹幕发送条左侧的“A”字按钮可以设置弹幕大小、模式和字色。',
            '播放器下方的分享功能可以把你喜欢的视频分享到微博、qq空间、贴吧和人人网。',
            '视频右上方有收藏、点赞和跳到评论区功能，多利用它们让up主获得更多支持吧。',
            '如有发现广告、人身攻击等违规弹幕，可以通过右键举报功能通知管理员处理。',
            '如果发现感兴趣的系列类投稿，可以通过关注up主的方式获得最新更新推送。',
            '对UP主的最好支持就是多发弹幕多评论，并且在收藏后给UP主“投个食”！',
            '双击播放画面即可进入或退出全屏播放。',
            '按下“↑”和“↓”键即可调节音量。音量最高可达500%25。',
            '按下“←”和“→”键即可后退或前进一小段。',
            '播放器会自动记录你的每一次操作。',
            '在"更多设置项"中可以设置弹幕的透明度。',
            '“弹幕”的正确发音是“dan4 mu4”，而不是“tan2 mu4”，不要念错了哟。'
        ];
        this.hint = '小贴士：' + this.hints[parseInt(Math.random() * this.hints.length)];
        this.version = '10.0.0';
        this.backgroundURL = pageInfo.coverImage || '';
    }
    Player.prototype.init = function(param){
        var o = $.extend(true, {
            path: this.path,
            version: this.version,
            subPath: 'false',
            width: this.width,
            height: this.height,
            flashvars: {
                wmode: 'window',
                allowFullscreenInteractive: 'true',
                allowfullscreen: 'true',
                allowscriptaccess: 'always',
                hint:this.hint,
                backgroundURL: this.backgroundURL
            },
            params: {
                wmode: 'window',
                allowFullscreenInteractive: 'true',
                allowfullscreen: 'true',
                allowscriptaccess: 'always'
            },
            attributes: {
                wmode: 'window',
                allowFullscreenInteractive: 'true',
                allowfullscreen: 'true',
                allowscriptaccess: 'always'
            }
        }, param);



        console.info(o);
        //创建flash播放器
        swfobject.embedSWF(o.path || this.path,this.el,o.width, o.height, o.version, o.subPath, o.flashvars, o.params, o.attributes);
    };
    //- 播放器判断及参数配置
    var play = new Player();
    //-play.init({vid:3801461});
    var playInit = function(){
        //$player.from
        var from = videoInfo.source_type;
        var vid = videoInfo.id || "0";
        var sid = videoInfo.source_id || "0";
        var autoPlay = parseInt($.fomatHash().autoplay) || 0;
        switch (from) {
            case 'qq':
            case 'qq2':
                return play.init({
                    path: globalConfig.cdn+'/player/cooperation/AcFunXQQ.swf?v=' + vv,
                    flashvars: {
                        type: "qq",
                        sourceId: sid,
                        videoId: vid,
                        vid: sid,
                        autoplay: autoPlay
                    },
                    params: {
                        scale: 'noScale',
                        allowFullscreen: 'true',
                        allowScriptAccess: 'always',
                        bgcolor: '#000000'
                    }
                });
            case 'pptvcoop':
            case 'pptv':
                return play.init({
                    path: globalConfig.cdn+'/player/cooperation/AcFunXPPtvCoop.swf?v=' + vv,
                    flashvars: {
                        type: "pptv",
                        sourceId: sid,
                        videoId: vid,
                        vid: sid,
                        autoplay: autoPlay
                    },
                    params: {
                        scale: 'noScale',
                        allowFullscreen: 'true',
                        allowScriptAccess: 'always',
                        bgcolor: '#000000'
                    }
                });
            case 'mgtv':
                return play.init({
                    path: globalConfig.cdn+'/player/cooperation/AcFunXMangoTv.swf?v=' + vv,
                    flashvars: {
                        type: "mgtv",
                        sourceId: sid,
                        videoId: vid,
                        vid: sid,
                        autoplay: autoPlay
                    },
                    params: {
                        scale: 'noScale',
                        allowFullscreen: 'true',
                        allowScriptAccess: 'always',
                        bgcolor: '#000000'
                    }
                });
            //- 优酷
            case 'youku':
            case 'youku2':
                return play.init({
                    path: globalConfig.cdn+'/player/cooperation/AcFunXYouku.swf?v=' + vv,
                    flashvars: {
                        type: "youku",
                        sourceId: sid,
                        videoId: vid,
                        vid: sid,
                        autoplay: autoPlay
                    },
                    params: {
                        scale: 'noScale',
                        allowFullscreen: 'true',
                        allowScriptAccess: 'always',
                        bgcolor: '#000000'
                    }
                });
            case 'letv2':
                return play.init({
                    path: 'https://ssl.acfun.tv/flash/CoopPlayer.swf?v=' + vv,
                    flashvars: {
                        type: "letv",
                        sourceId: sid,
                        videoId: vid,
                        vid: sid,
                        autoplay: autoPlay
                    },
                    params: {
                        scale: 'noScale',
                        allowFullscreen: 'true',
                        allowScriptAccess: 'always',
                        bgcolor: '#000000'
                    }
                });
            case 'sohu':
                return play.init({
                    path: globalConfig.cdn+'/player/cooperation/AcFunXSohu.swf?v=' + vv,
                    flashvars: {
                        type: "sohu",
                        sourceId: sid,
                        videoId: vid,
                        vid: sid,
                        autoplay: autoPlay
                    },
                    params: {
                        scale: 'noScale',
                        allowFullscreen: 'true',
                        allowScriptAccess: 'always',
                        bgcolor: '#000000'
                    }
                });
            case 'iqiyi':
                return play.init({
                    path: globalConfig.cdn+'/player/cooperation/AcFunXQiyi.swf?v=' + vv,
                    flashvars: {
                        type: 'iqiyi',
                        sourceId: sid,
                        videoId: vid,
                        autoplay: autoPlay,
                        oldcs: 1,
                        tvId: vid
                    },
                    params: {
                        scale: 'noScale',
                        allowFullscreen: 'true',
                        allowScriptAccess: 'always',
                        bgcolor: '#000000'
                    }
                });

            case 'tudou':
                return play.init({
                    path: 'http://www.tudou.com/v/' + sid + '&autoplay=true&withRecommentList=true/v.swf',
                    width: '100%',
                    height: '100%',
                    flashvars: {
                        type: 'tudou'
                    }
                });
            //- 我站
            default:
                return play.init({
                    path: globalConfig.cdn + '/flash/player-view-homura.swf',
                    //-path: '/static/flash/1.swf',
                    flashvars: {
                        type: 'acfun',
                        vid:vid,
                        videoId:vid,
                        autoplay:autoPlay
                    }
                });
        }
    }
    playInit();


    //flash 调用js
    function Flashcall(){
        Player.apply(this, arguments);
    }

    //调用登陆||答题激活
    Flashcall.prototype.call = function(param){
        console.log(param)
        if(param.action == 'login'){
            window.location.href=globalConfig.rootDomain + '/login/?returnUrl=' + location.href;
        }
    };

    //全屏
    Flashcall.prototype.fullscreen = function(param){

    };

    //下一P
    Flashcall.prototype.nextPart = function(param){
        var elem1,elem2,block1,block2;
        block1 = $("section.part");
        block2 = $("section.collection");
        //- 合辑、分P同时出现先走下一P、最后一P走下一辑


        elem1 = block1.find('a.active').next('a.single-p');
        if (elem1.length) {//- 进入下一P
            var a = elem1.attr('href');
            return location.href = a.indexOf("#") > 0 ? a+";autoplay=1" : a+"#autoplay=1";
        } else {//- 最后一P：有下一辑走下一辑，没下一辑直接提示结束
            if(block2 && block2.find('figure').length > 0){
                elem2 = block2.find(".video-list figure.active").next("figure");
                if(elem2.length){
                    var b = elem2.find("a").attr('href');
                    return location.href = b+";autoplay=1";
                }else{
                    return $.info.success('已到达合辑的末尾，或无法获得可继续播放的视频。', 3e3);
                }
            }else{
                // return $.info.success('已到达分P的末尾，或无法获得可继续播放的视频。', 3e3);
            }
        }
    };

    //播放状态
    Flashcall.prototype.play = function(param){
        //-console.info(param);
        //-param = param.toString().split(',');
        switch(param.status){
            case 'play':
                console.log('已经开始播放');
                break
            default:
                console.log('未知播放状态');
        }
    };
    //-播放统计
    Flashcall.prototype.qm = function(param){
        var sType = pageInfo.videoList[pageInfo.P].source_type;
        var s_map = function(type){
            switch (type){
                case "zhuzhan":
                    return 1;
                case "qq":
                case "qq2":
                case "iqiyi":
                case "tudou":
                case "youku":
                case "youku2":
                case "sohu":
                case "mgtv":
                case "letv2":
                case "pptv":
                case "pptvcoop":
                    return 2;
            }
        }
        window.sa && sa.track(param.action, {
            product: "web",
            channelId: String($P.data().pcid) || "",
            secchannelId: $P.data().cid || 0,
            contentId: String(location.pathname.match(/(v|a)\/(\S*)/)[2]),
            videoId: String($P.data().vid),
            contentType: (location.pathname.match("ac") != null) ? 1 : 2,
            broadcastType: param.data.broadcastType,
            playerType: String(s_map(sType)) || "",
            upId: $P.data().uid,
            UID: String($.user.uid  || "0"),
            channel: $.getvl('channel') || '',
            userLevel: $.user.getGroupLevel()==null?"-1":String($.user.getGroupLevel())
        });
    }

    //高级弹幕
    Flashcall.prototype.spEnable = function(param){
        var swit = 0
        try {
          swit = param.swit;
        } catch (e) {
          console.log("高级弹幕有误");
        }

        if(swit){
            $.info.show('进入高级弹幕模式。', 3e3);
            this.$elPlayer.data('spEnable',1).css({
                width:1160,
                height:702
            }).resize()
            $('#ACFlashPlayer').css({
              height:702,
              width:1165
            })
        }else{
            $.info.show('退出高级弹幕模式。', 3e3);
            this.$elPlayer.data('spEnable',0).css({
                width:"",
                height:""
            }).resize()
            $('#ACFlashPlayer').css({
              height:"",
              width:""
            })
        }
    };

    Flashcall.prototype.ready = function() {
      hasReady = true
    }

    //页面全屏
    Flashcall.prototype.webFullscreen = function(param){
        if(param.swit==1){
            $("#header #nav").css({"z-index":0});
            $("#player object").css({"position":"fixed","z-index":"999",top:0,left:0,width:"100%",height:"100%"}).addClass("fullscreen");
            $("body").scrollTop(0).css("overflow-y",'hidden');
            $('#toolbar').css({display: "none"})
        }else{
            $("body").css("overflow-y",'auto');
            $("#header #nav").css({"z-index":9});
            // var w = 1160,h = 572;
            var w = 1160,h = 730;
            if($(window).width()<=1440){
                w = 980;
                // h = 470;
                h = 628;
            }
            $('#toolbar').css({display: "block"})
            $("#player object").css({"position":"relative","z-index":"999",top:0,left:0,width:w,height:h}).removeClass("fullscreen");
        }
        //todo
    };

    //实时数据
    Flashcall.prototype.showOnline = function(param){
        //- console.log(param)

        var count = param.num.split(',');

        $(".crumb span.danmu span.sp2").html($.parsePts(count[1]))

    };

    //flash 调用js
    var f = window.f = new Flashcall();




    //-加载合辑信息
    var loadAlbum = function(){
        var $collec = $("section.collection");
        var album = $.fomatHash().album;
        var block1 = $("#temp-collection").html();
        var block2 = $("#temp-video").html();
        var html = "",html2="";
        if(album && album.length){
            var fun = function(a){
                var c = $.fomatHash().album.split(",");
                return c[0]+","+c[1]+","+a+","+c[3]
            }
            //-处理合辑视频 URL
            var parts = $("section.part .single-p");
            for(var i = 0; i < parts.length;i ++){
                var o = $(parts[i]);
                o.attr("href",o.attr("href")+"#album="+$.fomatHash().album)
            }
            //-合辑数据请求
            var albums = album.split(",");
            var params = {
                albumId: albums[0],
                groupId: albums[1] == 0 ? null : albums[1],
                contentId: $P.data().aid
            }

            $.get(window.globalConfig.api+'/query/album/albumWithContents', params)
            .done(function(data) {
                if(data.code == 200){
                    data = data.data;
                    html += $.parseTemp(block1,{
                        title: data.title,
                        subscribeSize: $.parsePts(data.subscribeSize) || 0,
                        username: data.userName,
                        countSize: $.parsePts(data.countSize) || 0,
                        updateTime: data.updateTime
                    });

                    var list = data.contentList;
                    for(var key in list){
                        html2 += $.parseTemp(block2,{
                            cid: list[key].contentId,
                            href: '/v/ac'+list[key].contentId+'#album='+fun(list[key].contentId),
                            cover: "<img src='"+list[key].cover+"'/>",
                            title: list[key].title,
                            viewCount: $.parsePts(list[key].viewCount) || 0,
                            danmuSize: $.parsePts(list[key].danmuSize) || 0
                        });
                    }
                    //- 判断正在播放的合辑
                    var b = parseInt(albums[2]);
                    //- 当合辑数大于等于1时显示区块，否则移除区块
                    if(data.contentList.length >= 1){
                        $collec.css({display: "block"})
                        $collec.html(html);
                        $collec.find('.top .title a').attr('href', '/a/aa' + albums[0] + "#group=" + albums[1])
                        $collec.find('.up-crumb .up a').attr('href', '/u/' + $P.data().uid + '.aspx')
                        //- 将视频添模块加到区块中
                        var more = "";
                        if(parseInt(albums[3])>6){
                            more = "<a href='/a/aa"+albums[0]+"#group="+albums[1]+"' class='more-btn fl'> <span>查看更多</span> <i></i></a>";
                        }
                        $collec.find(".video-list").html(html2+more);
                        $($collec.find(".video-list [data-collec="+$P.data().aid+"]")).addClass("active");
                        $.specialCount();
                    }else{
                        $collec.remove();
                    }

                }else{
                    $.info.warning("数据通信失败。请于稍后重试。", 3e3);
                }
            }).fail(function(){
                $.info.warning("服务器通信失败。请于稍后重试。", 3e3);
            });

        }else{
            $collec.remove();
        }
    }
    if($.fomatHash().album){
        loadAlbum();
    }




    //- 举报
    $("section.head .crumbs").on("click",".sp7",function(){
        $this = $(this);
        window.open(encodeURI('/report/#name='+$this.data().uname+';from=' + self.location.href.replace(/#.*/g, '') + ';type=投稿;oid=' + $this.data().oid + ';desc='+location.pathname.match('/v\/(ab|ac)')[1]+$this.data().oid+' 稿件内容违规。;proof='+$this.data().proof+''));
        return false;
    });
    //- 分P
    var $part = $("section.part");
    $part.on("click",".open",function(){
        $this = $(this);
        $this.parent().parent().removeClass('gheight');
        $part.find('.single-p.hidden').removeClass('hidden');
        $('.part-wrap').scrollTop($('.single-p.active').position().top - 48)
        $this.siblings('span').show();
        $this.hide();
    });
    $part.on("click",".close",function(){
        $this = $(this);
        $this.parent().parent().addClass('gheight');
        var prevPart = $('.single-p.active').prevAll("a") // 这个方法是倒序排列
        var nextPart = $('.single-p.active').nextAll("a")
        function needShow (prev, next) {
          if (prev) {
            prevPart.each(function(index, ele) {
              if (index+1 > prev) {
                $(ele).addClass('hidden')
              }
            })
          }
          if (next) {
            nextPart.each(function(index, ele) {
              if (index+1 > next) {
                $(ele).addClass('hidden')
              }
            })
          }
        }
        if ($part.find('.single-p').length > 4) {
          if (prevPart.length < 1) {
            needShow(0, 3)
          } else if (nextPart.length < 2) {
            var prevLength = 3 - nextPart.length
            needShow(prevLength, nextPart.length)
          } else {
            needShow(1, 2)
          }
        }
        $this.siblings('span').show();
        $this.hide();
    });
    if ($part.find('.single-p').length > 4) {
        $part.find(".close").click()
    }
    //- 简介
    var $intro_desc = $(".introduction .columen-left .desc");
    if($intro_desc.find(".sp1").height() > $intro_desc.height()){
        $intro_desc.find(".open").show()
    }
    $intro_desc.on('click','.open',function(){
        $(this).parent().removeClass('gheight');
        $(this).siblings('span').show();
        $(this).hide();
    });
    $intro_desc.on('click','.close',function(){
        $(this).parent().addClass('gheight');
        $(this).siblings('span').show();
        $(this).hide();
    });
    //- 分享
    $('#bdshare').share({
        text: "",
        url:  location.href + ($.user.isLogin() ? '?shareUid=' + $.user.uid : ''),
        preview: "",
        desc:"",
        comment:""
    }, '');
    //- 分享更多
    var $sharepop = $("#share-more");
    var tag;
    $("section.crumb .share-more").hover(function(){
        clearTimeout(tag)
        var baseUrl = location.href;
        var urlParam = 'vid=' + videoInfo.id + '&ref=' + baseUrl
        var surl = baseUrl + ($.user.isLogin() ? '?shareUid=' + $.user.uid : '');
        var sflash = window.globalConfig.cdn + '/player/ACFlashPlayer.out.swf?' + urlParam;
        var shtml = '<embed height="348",width="550",class="player",allowFullScreenInteractive="true",pluginspage="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash",AllowScriptAccess="always",rel="noreferrer",flashvars="' + urlParam + '",src="' + sflash + '",type="application/x-shockwave-flash",allowfullscreen="true",quality="high",wmode="window"></embed>';
        var sframe = '<iframe style="width:704px;height:436px;" src="' + sflash + '" id="ACFlashPlayer-re" frameborder="0"></iframe>';

        $sharepop.find(".ipt-url").val(surl);
        $sharepop.find(".ipt-flash").val(sflash);
        $sharepop.find(".ipt-html").val(shtml);
        $sharepop.find(".ipt-iframe").val(sframe);

        var $l = $(this).offset().left-80;
        var $t = $(this).offset().top+47;

        $sharepop.css({left:$l,top:$t});
        $sharepop.show();
        $(this).find('.icon').addClass('reversion')
    },function(){
      tag = setTimeout(function() {
        $sharepop.hide();
        $("section.crumb .share-more").find('.icon').removeClass('reversion')
      }, 500)
    });
    $sharepop.hover(function(){
        $sharepop.show();
        $("section.crumb .share-more").find('.icon').addClass('reversion')
        clearTimeout(tag)
    },function(){
        tag = setTimeout(function() {
          $sharepop.hide();
          $("section.crumb .share-more").find('.icon').removeClass('reversion')
        }, 500)
    });
    var clip = new ZeroClipboard($sharepop.find("span.copy"));
    clip.on( "copy", function (event) {
        var clipboard = event.clipboardData;
        var $thi = $(event.target);
        clipboard.setData("text/plain", $thi.siblings("input").val());
        $.info.success("复制成功", 3e3);
    });


    //- 用户信息
    var $userDiv = $('.introduction .column-right .user');
    $.selUser = function(){
        $.ajax({
            type :"get",
            url: window.globalConfig.api+'/query/user?userId='+$userDiv.data().uid,
            dataType:"json",
            xhrFields: {
                withCredentials: true
            }
        }).done(function(data){
            if(data.code == 200){
                data = data.data;
                var $crumbs = $('.introduction .column-right .crumbs');
                $crumbs.find('span.sp1').html($.parsePts(data.contributionCount));
                $crumbs.find('span.sp2').html($.parsePts(data.fansCount));
                var $upurl = '/u/'+data.id+'.aspx';
                $crumbs.parent().find('.desc').html(data.signature).attr('title', data.signature);

            }else{

            }
        });
    }
    $.selUser();



    //- comm
    setTimeout(function () {
        var commid = $P.data().aid;
        return comment(commid, function () {
        });
    }, 500);



    //- 收藏、投蕉
    var $crumb = $("section.crumb");
    $crumb.find("span.collection").hover(function(){
        if($(this).is(".active")){
            // $(this).find("span.sp3").text("取消收藏");
        }
    },function(){
        if($(this).is(".active")) {
            $(this).find("span.sp3").text("已收藏");
        }
    });
    $crumb.find("span.collection").on("click",function(){
        console.info("收藏|取消收藏");
        if ($(this).hasClass('disabled')) {
          return
        }
        if(!$.user.isLogin()){
            window.location.href=globalConfig.rootDomain + "/login/?returnUrl="+location.href;
        }else {
            $this = $(this);
            var s = 0;
            if ($this.data().status == 0) {
                s = 1;
            }
            $this.addClass("disabled")
            $.ajax({
                type: "post",
                url: '/member/collect.aspx',
                data: {cId: $P.data().aid, operate: s},
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                }
            }).done(function (data) {
                $this.removeClass("disabled")
                if (data.success) {
                    // 为了更快
                    // $.collect($this);
                    if (s) {
                        $crumb.find(".collection").addClass('active').data().status = 1;
                        $crumb.find(".collection").find(".sp3").text('已收藏');
                    } else {
                        $crumb.find(".collection").removeClass('active').data().status = 0;
                        $crumb.find(".collection").find(".sp3").text('收藏');
                    }
                    var pts = $this.find(".sp4");
                    var ptsNum = pts.text();
                    if(ptsNum.indexOf('万') == -1){
                        ptsNum = parseInt(ptsNum.replace(',',''));
                        if(s){
                            pts.text($.parsePts(++ptsNum));
                        }else{
                            --ptsNum;
                            ptsNum = ptsNum < 0 ? 0 : ptsNum
                            pts.text($.parsePts(ptsNum));
                        }
                    }
                }
            }).fail(function(err) {
              $this.removeClass("disabled")
            });
        }
    });
    //-投蕉
    var flybanana = function(fly,i,b){
        var o = "toujiao";
        if($(window).width() <= 1440){
            o = "toujiao_narrow";
        }
        if(i == b){
            fly.find(".banana-"+i).css({"animation":o+" "+parseFloat(1.8-i*0.2)+"s 0s ease both"});
        }else{
            setTimeout(function(){fly.find(".banana-"+i).css({"animation":o+" "+parseFloat(1.8-i*0.2)+"s 0s ease both"});},(b-i)*50);
        }
    };
    //-气泡
    var flybubble = function(fly,i){
        fly.find(".bubble-"+i).css({"animation":"fadeOutUp  "+parseFloat(1-i*0.2)+"s 0s ease both"});
    };
    var bananaTimeer
    $crumb.find("span.banana").hover(function(){
        if($(this).data().status == 0){
            $(this).find(".div-banana").show();
        }
    },function(){
        var $this = $(this);//-
        bananaTimeer = setTimeout(function () {
            $this.find(".div-banana").hide();
        }, 100);
    });
    $crumb.find("span.banana .div-banana").hover(function(){
        clearTimeout(bananaTimeer);
    },function(){
    });
    var bananaOverFlag = 2
    var bananaOverResult = false
    $crumb.find("span.banana .div-banana").on("click",".bananaer",function(){
        var $this = $(this)
        var bananaNum = parseInt($this.data().num)
        if(!$.user.isLogin()){
            window.location.href=globalConfig.rootDomain + "/login/?returnUrl="+location.href;
        }else {
            if($.user.group == 3){
                $.info.warning("不能给自己投蕉!", 3e3);
                return;
            }
            bananaOverFlag = 2
            bananaOverResult = false
            throwBananaAnimate(bananaNum)
            setTimeout(function(){
              bananaCount(0, bananaNum)
            },2e3);
            $crumb.find(".banana").addClass('active').data().status = 1;
            $crumb.find(".banana").find(".sp3").text('投蕉中');
            $.ajax({
                type: "post",
                url: '/banana/throwBanana.aspx',
                data: {contentId: $P.data().aid, count: bananaNum, userId: $.user.uid},
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                }
            }).done(function(data) {
                if (data.success > 0) {
                    $crumb.find(".banana").find(".sp3").text('已投蕉');
                    var pts = $crumb.find("span.banana .sp4");
                    var ptsNum = pts.text();
                    if(ptsNum.indexOf('万') == -1){
                        ptsNum = parseInt(ptsNum.replace(',',''));
                        pts.text($.parsePts(ptsNum+bananaNum));
                    }
                    bananaCount(1, bananaNum)
                    $.info.success("成功投食了" + bananaNum + "根香蕉。", 3e3);
                } else {
                    bananaCount(2, 0)
                    $crumb.find(".banana").find(".sp3").text('投蕉');
                    $.info.warning(data.info, 3e3);
                }
            }).fail(function() {
                bananaCount(2, 0)
                $crumb.find(".banana").find(".sp3").text('投蕉');
                $.info.warning('投食操作失败。请于稍后重新操作。', 3e3);
            });
        }
    });
    $crumb.find("span.banana .div-banana .bananaer").hover(function(){
        var num = $(this).data().num;
        $(this).addClass("active").prevAll(".bananaer").addClass("active");
        $crumb.find("span.banana .div-banana").find("span.text").html("喂<span>"+$P.data().name+"</span>食 "+num+" 香蕉");
    },function(){
        $(this).removeClass("active").siblings(".bananaer").removeClass("active");
        $crumb.find("span.banana .div-banana").find("span.text").html("喂<span>"+$P.data().name+"</span>食&nbsp;0&nbsp;香蕉");
    });

    //-合辑订阅
    $("section.collection").on("click",".top .subs",function(){
        if($.user.isLogin()) {
            $this = $(this);
            if($this.data().status == 0){
                $.ajax({
                    type: "post",
                    url: '/member/specialCollect.aspx',
                    data: {specialId: $.fomatHash().album.split(",")[0], operate: 1},
                    dataType: "json",
                    xhrFields: {
                        withCredentials: true
                    }
                }).done(function (data) {
                    if (data.success) {
                        $.info.success("订阅成功",3e3);
                        $this.addClass("active");
                        $this.find("i").text("已订阅");
                        $this.data().status = 1;
                        /*var pstNum = $this.find("span");
                        if (pstNum.text().indexOf('万') == -1) {
                            pstNum.text(parseInt(pstNum.text()) + 1);
                        }*/
                        $.specialCount();
                    }
                }).fail(function(){
                    $.info.error("订阅失败",3e3);
                });
            }else{
                $.callPop('confirm','open','','是否确定取消订阅？',function(){
                    $.ajax({
                        type: "post",
                        url: '/member/specialCollect.aspx',
                        data: {specialId: $.fomatHash().album.split(",")[0], operate: 0},
                        dataType: "json",
                        xhrFields: {
                            withCredentials: true
                        }
                    }).done(function (data) {
                        if (data.success) {
                            $.info.success("取消订阅成功",3e3);
                            $this.removeClass("active");
                            $this.find("i").text("订阅");
                            $this.data().status = 0;
                            /*var pstNum = $this.find("span");
                            if (pstNum.text().indexOf('万') == -1) {
                                pstNum.text(parseInt(pstNum.text()) - 1);
                            }*/
                            $.specialCount();
                            $.callPop('follow', 'close', '', '', '');
                        }
                    }).fail(function(){
                        $.info.error("取消订阅失败",3e3);
                        $.callPop('follow', 'close', '', '', '');
                    });
                });
            }

        }else{
            window.location.href=globalConfig.rootDomain + "/login/?returnUrl="+location.href;
        }
    });







    //-关注
    var $shadeLayer = $("#shade-layer");
    $("div.introduction .user .tool .flow").on("click",function(){
        var btn = $(this);
        var $crumbs = $('.introduction .column-right .crumbs')
        //已登录
        if($.user.isLogin()){
            //未关注
            if(btn.data().status == 0){
                if($.user.group != 3) {
                    var temp = $('#temp-item-follow').html();
                    var ipt = $('#ipt-group-follow');
                    $.get('/api/friend.aspx', {
                        name: "getGroupList"
                    }).done(function (data) {
                        if (data.success) {
                            var html = "";
                            data = data.groupList;
                            for (var key in data) {
                                html += $.parseTemp(temp, {
                                    gid: data[key].groupId,
                                    count: data[key].groupCount || 0,
                                    name: data[key].groupName || '非法分组'
                                });
                            }
                            ipt.html(html);
                            $.callPop('follow', 'open', '', '关注&nbsp;&nbsp;' + btn.data().name, function () {
                                $.post('/api/friend.aspx', {
                                    name: "follow",
                                    username: btn.data().name,
                                    userId: btn.data().userid,
                                    groupId: ipt.val()
                                }).done(function (data) {
                                    if (data.success) {
                                        btn.html('已关注');
                                        btn.data().status = 1;
                                        btn.css({"color": "#999", "background": "#eee"});
                                        $.info.success("向[" + $.trim(ipt.find('option:selected').text().replace(/\(.*/, '')) + "]中添加关注[" + btn.data().name + "]成功", 3e3);
                                        // 为了更快
                                        var ptsNum = $crumbs.find('span.sp2').text();
                                        if(ptsNum.indexOf('万') == -1){
                                            ptsNum = parseInt(ptsNum.replace(',',''));
                                            $crumbs.find('span.sp2').text($.parsePts(++ptsNum));
                                        }
                                        // $.selUser();
                                    } else {
                                        $.info.warning("关注数量超过1024或者用户已关注", 3e3);
                                    }
                                    $.callPop('follow', 'close', '', '', '');
                                }).fail(function () {
                                    $.info.warning("关注数量超过1024或者用户已关注", 3e3);
                                });
                            });
                        }
                    }).fail(function(err) {
                      $.info.warning("系统忙，请稍后再试", 3e3);
                    });
                } else {
                    $.info.warning("不能关注自己的啦！", 3e3);
                }
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
                            btn.data().status=0;
                            btn.css({"color":"#fff","background":"#fd4c5b"});
                            $.info.success("已取消对[" + btn.data().name + "]关注",3e3);
                            // for speed
                            var ptsNum = $crumbs.find('span.sp2').text();
                            if(ptsNum.indexOf('万') == -1){
                                ptsNum = parseInt(ptsNum.replace(',',''));
                                --ptsNum;
                                ptsNum = ptsNum < 0 ? 0 : ptsNum;
                                $crumbs.find('span.sp2').text($.parsePts(ptsNum));
                            }
                            // $.selUser();
                        }else{
                            $.info.warning("取消失败",3e3);
                        }
                        $.callPop('confirm','close','','','');
                    }).fail(function(){
                        $.info.warning("取消关注失败",3e3);
                        $.callPop('confirm','close','','','');
                    });
                });
            }
            //未登录
        }else{
            window.location.href=globalConfig.rootDomain + "/login/?returnUrl="+location.href;
        }






    });
    //取消弹窗
    $shadeLayer.on('click',function(){
        $.callPop('','close','','','');
    });

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

    //数据统计
    window.sa && sa.track('Detailpage', {
        type: "视频",
        from: document.referrer,
        firstPage: window.saObj.isFirstPage,
        channelId: String($P.data().pcid) || "",
        secChannelId: String($P.data().cid) || "",
        ac: String($P.data().aid),
        UPId: String($P.data().uid),
        uId: String($.user.uid) || "",
        channel: $.getQueryString("channel") || "",
        product: "web"
    });
    // 视频详情页广告位统计
    $('#bd_ad1,.smallAd,.ad-header a').on('click',function(){
      if($(this).attr('id') == 'bd_ad1' || $(this).parent().attr('id') == 'ad-header'){
        ev = 'ShiPinTongLanGuangGao'
      }else if($(this).hasClass('smallAd')){
        ev = 'ShiPinFangTuGuangGao'
      }
      sa.track(ev,{
        channel:$.getvl('channel') || '',
        userLevel:$.user.getGroupLevel()?String($.user.getGroupLevel()):"-1",
        url:$(this).find('a').attr('href') || $(this).attr('href'),
        ac:String($P.data().aid),
        channelId:pageInfo.parentChannelId?String(pageInfo.parentChannelId):'',
        secchannelId:pageInfo.channelId,
        product: "web",
        UID: String($.user.uid  || "0")
      });
    });

    //用户等级
    var level = 0;
    $.get('/online.aspx')
    .done(function (data) {
      if (data.success) {
        level = data.level || 0
      }
    });

    //- 标签
    var $tag = $("div.introduction #bd_tag");
    $tag.on("click",".add",function(){
        if($.user.isLogin()){
            if((level >= 5) || $.user.group == 0 || $.user.group == 3) {//-大于5级的普通会员、管理员、up主本人
                if ($(this).data().status == 0) {
                    $(this).hide();
                    $tag.find(".tagInp").show().focus();
                } else if ($(this).data().status == 1) {
                    $.info.warning("该视频被设置为禁止添加标签", 3e3);
                } else {
                    $.info.warning("标签到达上限", 3e3);
                }
            } else{
                $.info.warning("用户等级不足[5]。无权添加标签", 3e3);
            }
        }else{
            window.location.href=globalConfig.rootDomain + "/login/?returnUrl="+location.href;
        }
    });
    $tag.on('keyup', ".tagInp", function(ev) {
      var keyCode = ev.keyCode || ev.which;
      if (13 == keyCode) {
        $(".tagInp").trigger('blur')
      }
    })
    $tag.on("blur",".tagInp",function(){
        console.info("addTag");
        var tagV = $(this).val();
        if (/\#|\,|\//.test(tagV)) {
          $.info.warning("标签不能包含“#,/”等特殊字符", 3e3);
          return
        }
        if(tagV != ""){
            $.post('/addTag.aspx', {
                tagName: tagV,
                contentId: $P.data().aid
            }).done(function(data) {
                if(data.success){
                    console.info(tagV);
                    $.info.success("添加标签["+tagV+"]成功", 3e3);
                    $(this).hide().val("");
                    $.collect();
                    //-$tag.find(".add").show();
                }else{
                    $.info.warning(data.result, 3e3);
                }
            }).fail(function(){
                $.info.error("服务器通信失败。请于稍后重试。", 3e3);
            });
        }else{
            $(this).hide().val("");
            $tag.find(".add").show();
        }
    });
    $tag.on("click",".icon-delete1",function(){
        var tag = $(this).siblings("a");
        $.callPop('confirm','open','','是否确定删除标签['+tag.text()+']？',function(){
            $.post('/delTag.aspx', {
                tagId: tag.data().tid,
                contentId: $P.data().aid
            }).done(function(data) {
                if(data.success){
                    tag.stop().remove();
                    $.info.success("删除标签["+tag.text()+"]成功", 3e3);
                    $.collect();
                }else{
                    $.info.warning(data.result);
                }
                $.callPop('confirm','close','','','');
            }).fail(function(){
                $.info.error("服务器通信失败。请于稍后重试。", 3e3);
                $.callPop('confirm','close','','','');
            });
        });
    });

    //- 收藏、点赞、投食、关注、标签
    $.collect = function(ele){
        if (ele) {
          ele.addClass("disabled")
        }
        $.get('/member/collect_up_exist.aspx', {
            contentId: $P.data().aid
        }).done(function(data) {
            if (ele) {
              ele.removeClass("disabled")
            }
            var a, html, inner, j, len1, ref, temp;
            var $intro_tool = $("div.introduction .user .tool");
            var $intro_tag = $("div.introduction #bd_tag");
            if (data.success) {
                if (data.data.collect) {
                    $crumb.find(".collection").addClass('active').data().status = 1;
                    $crumb.find(".collection").find(".sp3").text('已收藏');
                } else {
                    $crumb.find(".collection").removeClass('active').data().status = 0;
                    $crumb.find(".collection").find(".sp3").text('收藏');
                }
                if (parseInt(data.data.banana) > 0) {
                    $crumb.find(".banana").addClass('active').data().status = 1;
                    $crumb.find(".banana").find(".sp3").text('已投蕉');
                } else {
                    $crumb.find(".banana").removeClass('active').data().status = 0;
                    $crumb.find(".banana").find(".sp3").text('投蕉');
                }
                if (data.data.follow) {
                    $intro_tool.find(".flow").html('已关注').css({"color":"#999","background":"#eee"}).data().status=1;
                } else {
                    $intro_tool.find(".flow").html('+&nbsp;关注').css({"color":"#fff","background":"#fd4c5b"}).data().status=0;
                }
                if (data.data.tagList) {
                    inner = $intro_tag;
                    temp = $('#temp-tag-view').html();
                    html = '';
                    ref = data.data.tagList;
                    for (j = 0, len1 = ref.length; j < len1; j++) {
                        a = ref[j];
                        html += $.parseTemp(temp, {
                            tid: a.tagId,
                            name: $.parseSafe(a.tagName)
                            //-count: $.parsePts(a.refCount)
                        });
                    }

                    inner.html(html+ ($.user.group == 1 ? "" : "<a href='javascript:void(0)' data-status='0' class='fl add'>+添加</a><input placeholder='请输入标签' class='tagInp' />"));
                    if($.user.group == 1 || $.user.group == 2){//未登录、普通用户
                        $intro_tag.find(".icon-delete1").remove();
                    }

                    if(ref.length >= 10){
                        $intro_tag.find(".add").data().status = 2;
                    }
                }
            }
        }).fail(function(){
          if (ele) {
            ele.removeClass("disabled")
          }
        });
    }
    $.collect();
    //-触发：观看、评论、**、**、**...
    //-$.collectCount();
    if($P.data().isshowcount == 1){
        $.collectCount();
    }else{
        $crumb.find(".view .sp2").text(0);
        $crumb.find(".collection .sp4").text(0);
    }


    //视频详情页+主播推荐
    var ary = pageInfo.tagList;
    var name = [];
    for (var i = 0; i < ary.length; i++) {
        var tabName = (ary[i]).name;
        name.push(tabName)
    }
    var temp1 = $('#anchor-temp').html();
    var str='',html='';
    var dataNew = {tags:name.join(',')};
    $.get('http://webapi.aixifan.com/live/compere/recomList',dataNew).done(function (data) {
        if(data.code == 200){
            if (data.data.compereList.length) {
                $('.columen-right').addClass('adActive');
                var dataList = data.data.compereList;
                var names = '',state = '',hid = '',ac='',av = '';
                if(data.data.compereSize == 1 && dataList.length <= 3){
                    for(var i = 0; i < dataList.length; i++){
                        if(dataList[i].isLive){
                            names = 'live';
                            state = '直播';
                        }else{
                            names = '';
                            state = '回放';
                        }
                        if(i >= 1){
                            hid = 'hidden';
                            ac = 'active';
                            av = 'active';
                        }else{
                            hid = '';
                            ac = '';
                            av = '';
                        }
                        str = $.parseTemp(temp1, {
                            userImg: "<img src='"+dataList[i].userLittleImg+"' width='40' height='40' />",
                            followed: $.parsePts(dataList[i].followed),
                            title: dataList[i].title,
                            nickName: dataList[i].nickName,
                            verifiedInfo: dataList[i].description,
                            img:dataList[i].coverImage,
                            videoId: dataList[i].videoId,
                            isLive: dataList[i].isLive,
                            liveType: dataList[i].liveType,
                            platformId:dataList[i].platformId,
                            compereId: dataList[i].compereId,
                            contentId: dataList[i].id,
                            live:names,
                            state:state,
                            hid:hid,
                            ac: ac,
                            av: av
                        });
                        html += str;
                    }
                }else{
                    if(dataList.length > 3){
                        $('.openanchor').removeClass('hidden');
                    }
                    for(var i = 0; i < dataList.length; i++){
                        if(dataList[i].isLive){
                            names = 'live';
                            state = '直播';
                        }else{
                            names = '';
                            state = '回放';
                        }
                        str = $.parseTemp(temp1, {
                            userImg: "<img src='"+dataList[i].userLittleImg+"' width='40' height='40' />",
                            followed: $.parsePts(dataList[i].followed),
                            title: dataList[i].title,
                            nickName: dataList[i].nickName,
                            verifiedInfo: dataList[i].verifiedInfo,
                            img:dataList[i].coverImage,
                            videoId: dataList[i].videoId,
                            isLive: dataList[i].isLive,
                            liveType: dataList[i].liveType,
                            platformId:dataList[i].platformId,
                            compereId: dataList[i].compereId,
                            contentId: dataList[i].id,
                            live:names,
                            state:state,
                            hid:hid
                        });
                        html += str;
                    }
                }
                $('.anchorMessage').html(html);
                }else{
                $('.anchor-right').addClass('hidden');
            }
            }
    }).fail(function(){
        $('.anchor-right').addClass('hidden');
    });

    $('.openanchor').on('click',function(){
        if($('.anchorMessage').css('max-height') == 'none'){
            $('.anchorMessage').css({'max-height':'553px'});
            $(this).find('span').html('展开全部主播');
            $(this).find('.icon').removeClass('active');
        }else{
            $('.anchorMessage').css({'max-height':'none'});
            $(this).find('span').html('收起');
            $(this).find('.icon').addClass('active');
        }
    });

    function throwBananaAnimate(bananaNum) {
      var fly = $crumb.find("span.banana .fly-banana");
      switch(bananaNum){
          case 1:
              fly.find(".banana-1").nextAll().hide();
              break;
          case 2:
              fly.find(".banana-2").nextAll().hide();
              break;
          case 3:
              fly.find(".banana-3").nextAll().hide();
              break;
          case 4:
              fly.find(".banana-4").nextAll().hide();
              break;
      }
      fly.show();
      $crumb.find("span.banana .div-banana").css({"animation":"unpulse0 .1s 0s ease both"});
      for(var i = bananaNum;i>0;i--){
          flybanana(fly,i,bananaNum);
      }
      $(".introduction .user .avatar").css({"animation": "touxiang 1.5s 0s ease both"})
      setTimeout(function() {
        $(".introduction .user .eating").css({"opacity": 1})
      }, 800)
    }

    function bananaOkAnimate(result, bananaNum) {
      $(".introduction .user .eating").css({opacity: 0, transform: "translateY(-15px)"})
      setTimeout(function() {
        $(".introduction .user .eating").css({transform: "translateY(0px)"})
      }, 500)
      if (result == 1) {
        $(".introduction .user .banana-num").css({"animation":"fadeOutUp  1.8s 0s ease both"}).addClass("active-" + bananaNum);
        for (var i = 3;i>0;i--) {
          flybubble($(".introduction .user .bubble"),i)
        }
      } else {
        $crumb.find(".banana").removeClass('active').data().status = 0;
        $(".div-banana").css({animation: ""})
        $('#bd_throwbanana').css({display:""})
        $('#bd_throwbanana .bananaer').css({animation: "",display: ""})
        $(".introduction .user .avatar").css({animation:""})
      }
    }

    function bananaCount(result, bananaNum) {
      if (result) {
        bananaOverResult = result
      }
      bananaOverFlag--
      if (bananaOverFlag == 0) {
        bananaOkAnimate(bananaOverResult, bananaNum)
      }
    }
















    //- 百分点数据
    $.creatBFD = function() {
        window["_BFD"] = window["_BFD"] || {};
        return _BFD.dtshowRec = function(data, bid, req_id) {
            console.log(data);
            var a, html, index, j, len1, temp;
            temp = $('#temp-recom-view').text();
            html = '';
            for (index = j = 0, len1 = data.length; j < len1; index = ++j) {
                a = data[index];
                html += $.parseTemp(temp, {
                    //aid: a.iid,
                    //index: index,
                    //date: a.time,
                    userurl: '/u/' + (a.userId || 4) + '.aspx',
                    link: a.url + '?from-baifendian',
                    img: "<img src='"+$.parseSafe(a.img)+"' width='90' height='50'/>",
                    title: $.parseSafe(a.title),
                    view: $.parsePts(a.view),
                    comm: a.comment,
                    username: $.parseSafe(a.name[0])
                });
            }
            $('#bd_recommend').html(html);
            return _BFD.bind(data, "dtshowRec", bid, req_id, 1);
        };
    };
    //调用百分点
    // $.creatBFD();

    //- 百分点
    $.baiFenDian = function() {
        return $(function(){
            window["_BFD"] = window["_BFD"] || {};
            _BFD.BFD_INFO={
                "title" : $P.data().title,//文章标题
                "id" : $P.data().aid,//文章id
                "url" : 'http://www.acfun.cn/v/ac201714',//location.href,//文章链接
                "author" : $P.data().name,//作者
                "keywords" : "",//keywords关键字
                "abs" : $P.data().desc,//摘要描述
                "pic" : $P.data().pic,//推荐图片链接，建议回传图片分辨率一致
                "attr" : {
                    "contribute":0,
                    "audience":0,
                    "view":$P.data().view,
                    "comment":$P.data().comment,
                    "collect":$P.data().collect
                }, //以此为投稿、听众、观看人数、评论人数、收藏人数
                "user_id" : $.user.isLogin()? $.user.uid:0,//网站当前用户id，如果未登录就为0或空字符串
                "page_type" : "movie_detail"//当前页面全称，请勿修改
            };
            //-正式提测前记得一定不要写死哦
            //已修改为正式
            var parentIds = $P.data().pcid,
                url = location.href;
            if(parentIds == 68){
                _BFD.BFD_INFO.cat_id= [68,96,162,163,141,121,142,99,100,143,97], //类别id 数组格式
                    _BFD.BFD_INFO.cat_name = ["影视","电影","日剧","美剧","国产剧","网络剧","韩剧","布袋·特摄","纪录片","其它","剧集"],
                    _BFD.BFD_INFO.category = [["影视","http://www.acfun.cn/v/list68/index.htm"],[$('.breadcrumb>a:eq(1)').text(),url]]
            }else if(parentIds == 1) {
                _BFD.BFD_INFO.cat_id= [106, 107, 108, 133, 67, 120, 109, 159], //类别id 数组格式
                    _BFD.BFD_INFO.cat_name= ["动画短片", "MAD·AMV", "MMD·3D", "2.5次元", "新番连载", "国产动画", "旧番补档", "动画资讯", "诡水疑云", "黑白无双"],
                    _BFD.BFD_INFO.category = [["动画", "http://www.acfun.cn/v/list1/index.htm"], [$('.breadcrumb>a:eq(1)').text(),url]]
            }else if(parentIds == 59){
                _BFD.BFD_INFO.cat_id = [83,145,84,85,165,72], //类别id 数组格式
                    _BFD.BFD_INFO.cat_name = ["游戏集锦","电子竞技","主机单机","英雄联盟","桌游卡牌","Mugen","虚空之遗","抗韩中年人"],
                    _BFD.BFD_INFO.category = [["游戏","http://www.acfun.cn/v/list59/index.htm"],[$('.breadcrumb>a:eq(1)').text(),url]]
            }else if(parentIds == 60) {
                _BFD.BFD_INFO.cat_id= [86, 87, 88, 89, 98], //类别id 数组格式
                    _BFD.BFD_INFO.cat_name= ["生活娱乐", "鬼畜调教", "萌宠", "美食", "综艺", "大力逸峰·我的天空", " 特别的刘备迎娶特别的孙权"],
                    _BFD.BFD_INFO.category= [["娱乐", "http://www.acfun.cn/v/list60/index.htm"], [$('.breadcrumb>a:eq(1)').text(),url]]
            }else if(parentIds == 58) {
                _BFD.BFD_INFO.cat_id= [136,137,103,138,139,140], //类别id 数组格式
                    _BFD.BFD_INFO.cat_name= ["原创·翻唱", "演奏", "Vocaloid", "日系音乐", "综合音乐", "演唱会", "AcFun翻唱排行榜", "花たん"],
                    _BFD.BFD_INFO.category = [["音乐", "http://www.acfun.cn/v/list58/index.htm"], [$('.breadcrumb>a:eq(1)').text(),url]]
            }else if(parentIds == 123){
                _BFD.BFD_INFO.cat_id = [134,135], //类别id 数组格式
                    _BFD.BFD_INFO.cat_name = ["宅舞","综合舞蹈","虎视眈眈","优颖酱"],
                    _BFD.BFD_INFO.category = [["舞蹈","http://www.acfun.cn/v/list123/index.htm"],[$('.breadcrumb>a:eq(1)').text(),url]]
            }else if(parentIds == 70) {
                _BFD.BFD_INFO.cat_id= [147,148,91,149,150,151,90,122], //类别id 数组格式
                    _BFD.BFD_INFO.cat_name= ["SF", "黑科技", "数码", "广告", "白科技", "自我发电", " 科学技术","汽车","教程","军情解码"],
                    _BFD.BFD_INFO.category= [["科技", "http://www.acfun.cn/v/list70/index.htm"], [$('.breadcrumb>a:eq(1)').text(),url]]
            }else if(parentIds == 69) {
                _BFD.BFD_INFO.cat_id= [152,94,95,153,154,93], //类别id 数组格式
                    _BFD.BFD_INFO.cat_name= ["综合体育", "足球", "篮球", "搏击", "11区体育", "惊奇体育", "跑酷","WWE"],
                    _BFD.BFD_INFO.category= [["体育", "http://www.acfun.cn/v/list69/index.htm"], [$('.breadcrumb>a:eq(1)').text(),url]]
            }else if(parentIds == 124) {
                _BFD.BFD_INFO.cat_id= [127,128,129,130], //类别id 数组格式
                    _BFD.BFD_INFO.cat_name= ["造型", "西皮", "爱豆", "其他"],
                    _BFD.BFD_INFO.category= [["彼♀女", "http://www.acfun.cn/v/list124/index.htm"], [$('.breadcrumb>a:eq(1)').text(),url]]
            }else if(parentIds == 125) {
                _BFD.BFD_INFO.cat_id= [92,131,132], //类别id 数组格式
                    _BFD.BFD_INFO.cat_name= ["军事", "历史", "焦点"],
                    _BFD.BFD_INFO.category= [["鱼♂塘", "http://www.acfun.cn/v/list125/index.htm"], [$('.breadcrumb>a:eq(1)').text(),url]]
            }
            if(parentIds){
                window["_BFD"] = window["_BFD"] || {};
                _BFD.client_id = "Cacfun";
                _BFD.BFD_USER = {
                    "user_id" : $.user.isLogin()? $.user.uid:0, //网站当前用户id，如果未登录就为0或空字符串
                    "p_id" : $P.data().channelId //当前页面id
                };
                _BFD.script = document.createElement("script");
                _BFD.script.type = "text/javascript";
                _BFD.script.async = true;
                _BFD.script.charset = "utf-8";
                _BFD.script.src = (('https:' == document.location.protocol?'https://ssl-static1':'http://static1')+'.bfdcdn.com/service/acfun/acfun.js');
                document.getElementsByTagName("head")[0].appendChild(_BFD.script);
            };
        });
    };
    $('#search-text').focus(function(){
      $('#search-btn').css({color: "#fd4c5d"})
    }).blur(function(){
      $('#search-btn').css({color: "#909699"})
    })

    
    //浏览记录
    var saveHistory = function(){

        var value,view,base,page,len,item;
        value = JSON.parse(localStorage.getItem('cache'));
        if(value == null){
            value = {history:{views:null}};
        }
        view = (base = value.history).views != null ? base.views : base.views = [];

        page = pageInfo;
        for(i = j = 0,len = view.length; j<len; i = ++j){
            item = view[i];
            if(page.id == item.aid){
                view.splice(i,1);
                break;
            }
        }

        view.push({
            time: $.now(),
            date: page.contributeTime,
            aid: page.id,
            title: page.title,
            cid: page.channelId,
            tags: page.tagList,
            preview: page.coverImage,
            uid: page.userId,
            name: page.username,
            part: page.P,
            avatar: page.userAvatar,
            cont: null
        });

        if (view.length > (window.localStorage ? 100 : 20)) {
            view.splice(0, 1);
        }
        value.history.views = view;
        value = JSON.stringify(value);
        return localStorage.setItem('cache',value);

    };
    setTimeout(saveHistory, 1e4);
});
