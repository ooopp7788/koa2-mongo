$(function(){
/***FLASH**/
    var $host = "http://www.acfun.cn";
    $.video = {vid:""};
    function Player(param){
        param = param ? param : {};
        this.el = document.getElementById('ACFlashPlayer');
        this.$elPlayer = $('#player');
        this.path = globalConfig.cdn+'/flash/player-view-homura.swf';
        this.width = param.width || $(window).width() <= 1280 ? 940 : 1120;
        this.height = param.height || 549;
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
                hint:this.hint
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
    var playInit = function(param){
        $.video.vid = param.vid;
        var vv = window.globalConfig.version;
        var play = new Player();
        var from = param.from;
        var vid = param.vid;
        var sid = param.sid;
        var autoPlay = 0;
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
                    flashvars: {
                        type: 'tudou'
                    }
                });
            //- 我站
            default:
                return play.init({
                    //path: globalConfig.cdn + '/flash/player-view-homura.swf',
                    path:'http://cdn.aixifan.com/flash/player-view-homura.swf',
                    flashvars: {
                        type: 'acfun',
                        vid:vid,
                        videoId:vid,
                        autoplay:autoPlay
                    }
                });
        }
    }
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
    //flash 调用js
    var f = window.f = new Flashcall();


    //- 视频点击
    //$("#listVideo").on("click","figure",function(){
    //    $('#ACFlashPlayer').css({'border':'none'});
    //    var $this = $(this),
    //        vid = $this.data().vid,
    //        title = $this.data().title,
    //        from = "zhuzhan",
    //        date = $this.data().date;
    //        url_ = $this.data().url;
	//
    //    $.ajax({
    //        type: "get",
    //        url: $host + '/video/getVideo.aspx?id='+vid,
    //        xhrFields: {
    //            withCredentials: true
    //        }
    //    }).done(function (data) {
    //        $('#ACFlashPlayer').css({'border':'1px solid #eee'});
    //        from = data.sourceType || "";
    //        $this.addClass("active").siblings("figure").removeClass("active");
    //        playInit({vid:vid,sid:data.sourceId,title:title,from:from,date:date});
	//
    //        $("#player .hints .date").html(date);
    //        $("#player .hints .title").html(title);
    //        $("#player .hints a").attr("href",url_);
    //    });
	//
    //});
    ////- 播放第一个
    //var figures = $("#listVideo").find("figure");
    //if(figures.length >= 0){
    //    $(figures[0]).click();
    //}

    //- 举报
    $("#report").on("click",function(){
        $this = $(this);
        window.open(encodeURI('/report/#name='+$this.data().uname+';from=' + self.location.href.replace(/#.*/g, '') + ';type=用户;oid=;desc=用户'+$this.data().uname+' 违规。;proof='+$this.data().proof+''));
        return false;
    });
    /**
     * 页面逻辑
     */
    if($.user.isLogin()){
        $(".user-avatar").show();
    }
    /**tab1切换*/
    $(".head-list .tab").on("click","a",function(){
        $(this).addClass("active").siblings("a").removeClass("active");
        var n = parseInt($(this).data().con);
        switch (n){
            case 0:
                $(".contentlist").show();
                $(".flowlist").hide();
                $(".flowedlist").hide();
                break;
            case 1:
                $(".contentlist").hide();
                $(".flowlist").show();
                $(".flowedlist").hide();
                break;
            case 2:
                $(".contentlist").hide();
                $(".flowlist").hide();
                $(".flowedlist").show();
                break;
            default :
                $(".contentlist").show();
                $(".flowlist").hide();
                $(".flowedlist").hide();
        }
    });
    /**tab2切换*/
    $(".contentlist .table").on("click",".tab",function(){
        $(this).addClass("active").siblings(".tab").removeClass("active");
        var m = parseInt($(this).data().order);
        var n = parseInt($(this).data().con);
        //-
        if(m == 2){
            $('.newest').text('最新');
        }else{
            $('.newest').text('最热');
        }
        $(".news").find("[data-order='"+m+"']").addClass("active").siblings().removeClass("active");
        //-
        switch (n){
            case 0:
                $("#listVideo").show();
                $("#listArticle").hide();
                $("#listHeji").hide();
                $(".upplayer").show();
                break;
            case 1:
                $("#listVideo").hide();
                $("#listArticle").show();
                $("#listHeji").hide();
                $(".upplayer").hide();
                break;
            case 2:
                $("#listVideo").hide();
                $("#listArticle").hide();
                $("#listHeji").show();
                $(".upplayer").hide();
                break;
            default :
                $("#listVideo").show();
                $("#listArticle").hide();
                $("#listHeji").hide();
                $(".upplayer").show();
        }
    });
    if(pageCount.video < 10 && pageCount.article > pageCount.video && $(".contentlist .table [data-con=1]")){
        $(".contentlist .table [data-con=1]").click()
    }

    /**
     * @param param
     * pageNum
     */
    var showList = function(param){

        var divList =  $("#listVideo,#listArticle,#listHeji,#flowlist,#flowedlist");
        for(var i=0;i<divList.length;i++){
            if(!$(divList[i]).is(":hidden")){
                content = $(divList[i]);
                switch (i){
                    case 0:
                        type = "video";
                        break;
                    case 1:
                        type = "article";
                        break;
                    case 2:
                        type = "collection";
                        break;
                    case 3:
                        type = "flow";
                        break;
                    default:
                        type = "flowed";
                }
            }
        }

        content.find(".contentView").html('<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
        $.ajax({
            type: "get",
            url: '/space/next?uid='+UPUser.userId+'&type='+type+'&orderBy='+$(".news .active").data().order+'&pageNo='+param.pageNum,
            xhrFields: {
                withCredentials: true
            }
        }).done(function (data) {
            data = data.data;
            if(data.success){
                var page = data.page;
                var html = data.html;

                var pager = $.makePager({
                    num: page.pageNo,
                    count: page.totalCount,
                    size: page.pageSize,
                    total: page.totalPage,
                    addon: true,
                    hasjumpPage: true
                });
                $('#list-pager-'+type).html(pager);

                content.find(".contentView").html(html);
            }

            if(type == "video"){
                var videoView =  $("#listVideo [data-vid="+$.video.vid+"]");
                if(videoView){
                    videoView.addClass("active");
                }
            }
        }).fail(function(){
            content.find(".contentView").html("<div id='emotion'><img src='" + window.globalConfig.oldPath + "/umeditor/dialogs/emotion/images/ac/" + $.randomNumber(1, 54) + ".gif'/><div id='list'>获取列表失败，请于稍后重试。</div></div>");
            $('#list-pager-'+type).html(' ');
        });
    };

    //页面初始化分页
    var Fun = function(){
        var ary = [pageList.video,pageList.article,pageList.collection,pageList.flowed,pageList.flow];
        for(var i = 0; i<ary.length; i++)
            if(ary[i]){
                var pager = $.makePager({
                    num: ary[i].pageNo,
                    count: ary[i].totalCount,
                    size: ary[i].pageSize,
                    total: ary[i].totalPage,
                    addon: true,
                    hasjumpPage: true
                });
                if(i ==0){
                    $('#list-pager-video').html(pager);
                    $('#list-pager-video').readyPager({
                        addon: true,
                        callback: function (n) {
                            return showList({
                                pageNum: n
                            });
                        }
                    });
                }else if(i == 1){
                    $('#list-pager-article').html(pager);
                    $('#list-pager-article').readyPager({
                        addon: true,
                        callback: function (n) {
                            return showList({
                                pageNum: n
                            });
                        }
                    });
                }else if(i == 2){
                    $('#list-pager-collection').html(pager);
                    $('#list-pager-collection').readyPager({
                        addon: true,
                        callback: function (n) {
                            return showList({
                                pageNum: n
                            });
                        }
                    });
                }else if(i == 3){
                    $('#list-pager-flowed').html(pager);
                    $('#list-pager-flowed').readyPager({
                        addon: true,
                        callback: function (n) {
                            return showList({
                                pageNum: n
                            });
                        }
                    });
                }else if(i == 4){
                    $('#list-pager-flow').html(pager);
                    $('#list-pager-flow').readyPager({
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


    //- 最新
    $('.sort').hover(function () {
        $('.news').css({'display': 'block'});
    }, function () {
        $('.news').css({'display': 'none'});
    });
    $('.news').on('click', 'a', function () {
        $(this).addClass("active").siblings().removeClass("active");
        $('.news').css({'display': 'none'});
        var sort = $(this).data().sort;
        $(".contentlist .table .tab.active").data().order = sort;
        if(sort == 2){
            $('.newest').text('最新');
        }else if(sort == 1){
            $('.newest').text('最热');
        }
        var order = $(this).data().order;
        showList({pageNum:1});
    });
    /***头部逻辑*/
    $('.mesL').hover(function () {
        $(this).addClass('hover');
        $('.av').removeClass('hidden');
    }, function () {
        $('.mesL').removeClass('hover');
        $('.av').addClass('hidden');
    });
    $('.i-share').hover(function () {
        $('#bdshare').show();
        $('.mesL').removeClass('hover');
        $('.av').addClass('hidden');
    }, function () {
        $('#bdshare').hide();
        $('.mesL').addClass('hover');
        $('.av').removeClass('hidden');
    });

    //-hover效果
    funHover = function(){
        $('#fow').on('mouseenter', function () {
            $(this).html('取消关注');
        });
        $('#fow').on('mouseleave', function () {
            $(this).html('已关注');
        });
    }
    //-关注
    $(".mesR").on("click", "#fow", function () {
        var btn = $(this);
        //已登录
        if ($.user.isLogin()) {
            //未关注
            if (btn.data().status == 0) {
                if ($.user.group != 3) {
                    var temp = $('#temp-item-follow').html();
                    var ipt = $('#ipt-group-follow');
                    $.ajax({
                        type: "get",
                        url: $host + '/api/friend.aspx?name=getGroupList',
                        xhrFields: {
                            withCredentials: true
                        }
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
                            $.callPop('follow', 'open', '', '关注&nbsp;&nbsp;' + $('.mesL .name').html(), function () {
                                $.ajax({
                                    type: "post",
                                    url: $host + '/api/friend.aspx',
                                    data: {
                                        name: "follow",
                                        username: $('.mesL .name').html(),
                                        userId: UPUser.userId,
                                        groupId: ipt.val()
                                    },
                                    xhrFields: {
                                        withCredentials: true
                                    }
                                }).done(function (data) {
                                    if (data.success) {
                                        btn.data().status = 1;
                                        btn.addClass('active').html('已关注');
                                        var gropname = $("#ipt-group-follow").text().match('(.*)\\(')[1];
                                        var userm =  $('.mesL .name').html();
                                        $.info.success('向['+gropname+'])中添加关注['+userm+']成功。',3e3);
                                        funHover();
                                    } else {
                                        $.info.warning("关注数量超过1024或者用户已关注", 3e3);
                                    }
                                    $.callPop('follow', 'close', '', '', '');
                                }).fail(function () {
                                    $.info.warning("关注数量超过1024或者用户已关注", 3e3);
                                });
                            });
                        }
                    }).fail(function (err) {
                        $.info.warning("系统忙，请稍后再试", 3e3);
                    });
                } else {
                    $.info.warning("不能关注自己的啦！", 3e3);
                }
                //已关注
            } else {
                $.callPop('confirm', 'open', '', '是否确定取消关注？', function () {
                    $.ajax({
                        type: "post",
                        url: $host + '/api/friend.aspx?name=unfollow',
                        data: {username: $('.mesL .name').html(), userId: UPUser.userId, groupId: 0},
                        xhrFields: {
                            withCredentials: true
                        }
                    }).done(function (data) {
                        if (data.success) {
                            btn.data().status = 0;
                            btn.removeClass('active').html('+关注');
                            $.info.success('取消关注['+$('.mesL .name').html()+']成功。',3e3);
                            btn.off('mouseenter');
                            btn.off('mouseleave');
                        } else {
                            $.info.warning("取消失败", 3e3);
                        }
                        $.callPop('confirm', 'close', '', '', '');
                    }).fail(function () {
                        $.info.warning("取消关注失败", 3e3);
                        $.callPop('confirm', 'close', '', '', '');
                    });
                });
            }
            //未登录
        } else {
            window.location.href = "http://www.acfun.cn/login/?returnUrl=" + location.href;
        }
    });
    //- 关注
    var funCollect = function(){
        $.get('/api/friend.aspx', {
            name:"checkFollow",
            userId:UPUser.userId
        }).done(function(data) {
            var $tool = $("section .mesR #fow");
            if (data.success) {
                if (data.isFollowing) {
                    $tool.html('已关注').data().status=1;
                    $tool.addClass("active");
                    funHover();
                } else {
                    $tool.html('+&nbsp;关注').data().status=0;
                    $tool.removeClass("active");
                }
            }
        }).fail(function(){
        });
    }
    funCollect();
    //取消弹窗
    var $shadeLayer = $("#shade-layer");
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

    setTimeout(function () {
        $('#bdshare').share({
            text: UPUser.username+"的个人空间 - @AcFun弹幕视频网 - 认真你就输啦",
            url: location.href + ($.user.isLogin() ? '?shareUid=' + $.user.uid : ''),
            preview: ""
        }, '');
    },1e3);

    var isUpSelf = $.user.uid == window.UPUser.userId;
    if(isUpSelf) {
        var rootModal = $('#modal'),
            rootBody = rootModal.find('.body');
        $('#changeBg').removeClass('hidden').on('click', function () {
            editCover();
        });

        rootModal
            .on('click', '.fade', function () {
                hideModal();
            });
        rootBody
            .on('click', '.buttonCancel', function () {
                hideModal();
            })
            .on('click', '.buttonRefresh', function () {
                rootBody.find('.preview img').attr('src', window.globalConfig.path + '/img/page/space/bg.png');
                rootBody.find('.action .buttonRefresh').addClass('disabled');
            })
            .on('click', '.buttonCoverConfirm', function () {
                var $this = $(this);
                $this.addClass('disabled');
                $.ajax({
                    url: $host + '/member/spaceImageSubmit.aspx',
                    type: 'post',
                    contentType: 'application/x-www-form-urlencoded',
                    cache: false,
                    dataType: "json",
                    data: {
                        spaceImage: rootBody.find('.preview img').attr('src')
                    }
                }).done(function () {
                    hideModal();
                    window.location.reload();
                }).always(function () {
                    $this.removeClass('disabled');
                }).fail(function () {
                    rootBody.find('.errorTip').removeClass('hidden').html('操作失败，请稍后重试');
                });
            });

        var bindUpload = function () {
            var isWidthHeightRight = null;
            var qiniu = new window.QiniuJsSDK();
            qiniu.uploader({
                runtimes: 'html5,flash,html4',
                browse_button: 'buttonUpload',
                //uptoken: 'jkVZqwN195Da4xtSPZ0lwnlj2cgBq07sPZyTBwvq:RzlgEHQJvhRLHmi32687UGT3fX8=:eyJzY29wZSI6InRlc3QtZG91dyIsImRlYWRsaW5lIjoxNDc5NzE2NjA1fQ==',
                uptoken_url: window.globalConfig.rootDomain + '/appcms/api/qiniu/uptoken',
                domain: 'http://imgs.aixifan.com/',
                max_file_size: '5mb',
                flash_swf_url: window.globalConfig.path + '/flash/Moxie.swf',
                dragdrop: false,
                auto_start: true,
                init: {
                    'FilesAdded': function (up, files) {
                        window.plupload.each(files, function (file) {
                            // 文件添加进队列后,处理相关的事情
                        });
                    },
                    'BeforeUpload': function (up, file) {
                        hideAll();
                        rootBody.find('.preview .loading').removeClass('hidden');
                        //判断图片的宽高
                        var img = new Image();
                        img.src = URL.createObjectURL(file.getNative());
                        isWidthHeightRight = new $.Deferred();
                        img.onload = function () {
                            if(img.width < 1920 || img.height < 300) {
                                isWidthHeightRight.reject();
                            } else {
                                isWidthHeightRight.resolve();
                            }
                        };
                    },
                    'FileUploaded': function (up, file, info) {
                        // 上传完成后，刷新展示数据
                        hideAll();
                        var domain = up.getOption('domain'),
                            res = JSON.parse(info),
                            sourceLink = domain + res.key,
                            domPicture = rootBody.find('.preview');
                        //由于onload事件是有延迟的，所以用defer对象
                        isWidthHeightRight.done(function () {
                            sourceLink += '?imageMogr2/thumbnail/1920x/crop/1920x1080';
                            domPicture.find('img').attr('src', sourceLink).removeClass('hidden');
                            rootBody.find('.action .buttonRefresh').removeClass('disabled');
                        }).fail(function () {
                            rootBody.find('.preview .error').removeClass('hidden');
                            rootBody.find('.errorTip').removeClass('hidden').html('抱歉，图片宽高不能小于1920*300px');
                        });

                    },
                    'Error': function (up, err, errTip) {
                        //上传出错时,展示错误消息
                        hideAll();
                        rootBody.find('.preview .error').removeClass('hidden');
                        if(err.code == -600 && err.message == 'File size error.') {
                            rootBody.find('.errorTip').removeClass('hidden').html('抱歉，图片文件大小不能超过5M');
                        } else {
                            rootBody.find('.errorTip').removeClass('hidden').html('操作失败');
                        }
                    },
                    'Key': function (up, file) {
                        var suffix = '',
                            date = new Date().getTime();
                        if (file.name.indexOf('.') > 0) {
                            suffix = '.' + file.name.split(".").pop();
                        }
                        return 'pc/' + date + '/' + date + suffix;
                    }
                },
                filters: {
                    mime_types: [
                        {title: "Image files", extensions: "jpg,gif,png"}
                    ]
                }
            });
        };

        var hideAll = function () {
            rootBody.find('.preview .error').addClass('hidden');
            rootBody.find('.preview .loading').addClass('hidden');
            rootBody.find('.errorTip').addClass('hidden');
        };

        var editCover = function () {
            hideAll();
            rootModal.removeClass('hidden');
            $('body').css({
                'overflow': 'hidden',
                'padding-right': '17px'
            });
        };

        var hideModal = function () {
            rootModal.addClass('hidden');
            $('body').css({
                'overflow': 'scroll',
                'padding-right': '0'
            });
        };

        var requestAjax = function (options) {
            $.ajax($.extend(true, {
                cache: false,
                dataType: "json",
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                contentType: 'application/json;charset=UTF-8'
            }, options)).done(function (data) {
                if (data.success) {
                    def.resolve(data.data);
                } else {
                    def.reject(data.message);
                }
            }).fail(function () {
                def.reject('请求失败');
            });
            return def;
        };

        bindUpload();
    }
});
