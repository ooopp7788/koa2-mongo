/**
 * Created by user on 16/4/26.
 */
$(function() {
    //-var spUrl = window.globalConfig.api;
    var spUrl = "http://webapi.acfun.cn";
    //延迟加载
    $('img[data-original]').lazyload({
        threshold: 200,
        effect: "fadeIn",
        failurelimit: 20
    });
    /*16进制颜色转为RGB格式*/
    var $colorRgb = function(sHex,sAlpha){
        //十六进制颜色值的正则表达式
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        var sColor = sHex.toLowerCase();
        if(sColor && reg.test(sColor)){
            if(sColor.length === 4){
                var sColorNew = "#";
                for(var i=1; i<4; i+=1){
                    sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
                }
                sColor = sColorNew;
            }
            //处理六位的颜色值
            var sColorChange = [];
            for(var i=1; i<7; i+=2){
                sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
            }
            return "rgba(" + sColorChange.join(",") + ","+sAlpha+")";
        }else{
            return sColor;
        }
    };
    //- 此方法仅适用于投票专题页，内有数据格式化
    $parseTempForSpecial = function (string, object) {
        for (var key in object) {
            var value = object[key];

            if(key == "itemCountDisplay"){//格式化十万以上的数据
                key = "itemCount";
                string = string.replace(new RegExp('\\[' + key + '\\]', 'g'), value);
                key = "itemCountDisplay";
                if(parseInt(value) >= 100000){
                    value = Math.round(parseInt(value) / 10000 * 10) / 10 + '万';
                }
                string = string.replace(new RegExp('\\[' + key + '\\]', 'g'), value);

            }else if(key == "voted"){//格式化投票状态
                if(value || value == "true"){
                    key = "addClass";value = "disabled";
                    string = string.replace(new RegExp('\\[' + key + '\\]', 'g'), value);
                    key = "itemBtn";value = "已投票";
                    string = string.replace(new RegExp('\\[' + key + '\\]', 'g'), value);
                    key = "itemStatus";value = 1;
                    string = string.replace(new RegExp('\\[' + key + '\\]', 'g'), value);
                }else{
                    key = "itemBtn";value = "投票";
                    string = string.replace(new RegExp('\\[' + key + '\\]', 'g'), value);
                    key = "itemStatus";value = 0;
                    string = string.replace(new RegExp('\\[' + key + '\\]', 'g'), value);
                }
            }else{
                string = string.replace(new RegExp('\\[' + key + '\\]', 'g'), value);
            }
        }
        return string;
    };
    //- 分页组件
    var pageTool = function(obja,objb,objc){
        return $.makePager({
            num: obja,
            count: objb,
            size: objc,
            addon: true,
            hasfirst:true,
            haslast: true,
            long:7
        });
    }
    //- 组加票
    var addGroupTicket = function($btn){
        var $bar = $("section .progress-bar");
        var $ljia = $bar.find(".ljia");
        var $rjia = $bar.find(".rjia");
        if ($btn.is(".teama")) {
            $ljia.show();
            $ljia.animate({'top': '-50px'}, 1e3, 'swing', function () {
                $ljia.css({'top': 0, 'display': 'none'})
            });
            var num = $bar.data().l + 1;
            $bar.data().l = num;
            var numFormat = num;
            /*if (num >= 100000) {
                numFormat = Math.round(num / 10000 * 10) / 10 + '万'
            }*/
            $bar.find('.lnum').text(numFormat + "票");

        } else {
            $rjia.show();
            $rjia.animate({'top': '-50px'}, 1e3, 'swing', function () {
                $rjia.css({'top': 0, 'display': 'none'})
            });
            var num = $bar.data().r + 1;
            $bar.data().r = num;
            var numFormat = num;
            /*if (num >= 100000) {
                numFormat = Math.round(num / 10000 * 10) / 10 + '万'
            }*/
            $bar.find('.rnum').text(numFormat + "票");
        }
        var l_count = parseInt($bar.data().l);
        var r_count = parseInt($bar.data().r);

        var addPoint = parseFloat((l_count/(l_count+r_count))*100);
        $bar.find(".bar").css({width:addPoint+"%"});





    }
    //投票
    $("section").on("click",'.ticketBtn',function(){
        var $btn = $(this);
        var bean = $(this).closest('figure');
        bean = bean.find('[data-voteid]');
        if($.user.isLogin()){
            if($btn.data().status == 0){
                $.ajax({
                    type :"post",
                    url: spUrl+"/sp/vote/"+bean.data().voteid+"/"+bean.data().did+"/ballot",
                    dataType:"json",
                    data:{voteid:bean.data().voteid,did:bean.data().did,v:new Date().getTime()},
                    cache: false,
                    xhrFields: {
                        withCredentials: true
                    }
                }).done(function(data){
                    if(data.code == 1){
                        var $num = $btn.parent().find(".ticketNum");
                        var addEff = $btn.parent().find(".showAddEff");
                        var num = parseInt($num.data().val);
                        num ++;
                        if(addEff){
                            onAddTickerEff(addEff);
                        }
                        $num.data().val=num;
                        var numFormat = num;
                        if(num >= 100000){
                            numFormat = Math.round(num / 10000 * 10) / 10 + '万'
                        }
                        $num.html(numFormat+"票");
                        $btn.html("已投票").addClass("disabled");
                        $btn.data().status=1;
                        if(data.data.remain != 0){
                            bubble($btn,"感谢投票！还有<span>"+data.data.remain+"</span>次投票机会",3e3);
                            $.info.success("感谢投票！还有<span>"+data.data.remain+"</span>次投票机会",3e3);
                        }else if(data.data.remain == 0 && data.data.isShare == 0){
                            callSharePop('open');
                        }else{
                            bubble($btn,data.message,3e3);
                            $.info.success(data.message,3e3);
                        }
                        if($btn.closest("section").is(".area-battle")){
                            var $btn_ = $btn.closest(".team");
                            if($btn_.length) {
                                //-组加票
                                addGroupTicket($btn_);
                            }
                        }



                    }else if(data.code==-12){
                        callSharePop('open');
                    }else{
                        $.info.warning(data.message,3e3);
                        bubble($btn,data.message,3e3);
                    }
                });

            }else{
                $.info.warning("已经给该作品投过票了~",3e3);
                bubble($btn,"已经给该作品投过票了~",3e3);
            }

        }else{
            window.location.href=globalConfig.rootDomain + "/login/?returnUrl="+location.href;
        }



    });
    var onAddTickerEff = function($item){
        $item.css("visibility","visible");
        var eCount = 0;
        var effect = function(){
            if(eCount > 2){
                $item.css("visibility","hidden");
                return
            };
            eCount++
            $item.fadeOut(500).fadeIn(500);
            setTimeout(effect,1000);
        }
        setTimeout(effect,200);

    }

    //- 读取投票项数据(主榜、推荐、对战)
    var showDatas = function($btn,type,module,showType){
        $btn.find("div.area-info").html("<div style='width: 150px;margin: 0 auto;'><img src='" + window.globalConfig.oldPath + "/umeditor/dialogs/emotion/images/ac/" + $.randomNumber(1, 54) + ".gif'/><div style='width:150px;height:40px;background:#d9edf6;line-height:40px;text-align:center;font-size:15px;margin-top:5px'>正在获取投票列表...</div></div>");
        var url = spUrl+"/sp/vote";
        if($btn.data().ispic == 0){
            url = spUrl+"/sp/modules";
        }
        var moduleid = module;
        if(type == 2){
            moduleid = module.data().module;
        }
        $.ajax({
            url:url,
            type:"get",
            dataType:"json",
            //async: false,
            data:{
                voteId:$btn.data().pageid,
                blockId:$btn.data().areaid,
                moduleId:moduleid,//默认取全部数据
                pageNum:1//默认取第一页
            },
            xhrFields: {
                withCredentials: true
            }
        }).done(function (data) {
            var html = "";
            var dataList = "";
            //春季投票需要判断当前活动状态
            var spState = 0;
            var tmpinfodata = $btn.find("div.area-info").data();
            if(tmpinfodata.spstate !== undefined && tmpinfodata.spstate !== null){
                spState = tmpinfodata.spstate;
            }
            if(data.code == 200){
                //- 非图片
                if($btn.data().ispic == 1 || type == '1'){
                    dataList = data.data.list;
                    $.each(dataList, function (k, v) {
                        if(showType === '0'){
                            html += $parseTempForSpecial($('#temp-special-video').html(), v);
                        }else{
                            html += $parseTempForSpecial($('#temp-special-banner').html(), v);
                        }
                    });
                    if(type == '1'){
                        $btn.find("div.area-info").html(html);
                        if($btn.is(".area-middle") || $btn.is(".area-large")){
                            for(v in dataList){
                                $($btn.find("div.area-info").find(".block-video-ticket")[v]).addClass("large");
                            }
                        }
                        if($btn.is(".area-banner")){
                            $.each(dataList, function (k, v) {
                                $($btn.find("div.area-info").find(".block-video-banner")[v]);
                            });
                        }
                    }else{
                        var $bar = $(".progress-bar");
                        if(module.is('.teama')){
                            $bar.data().l = dataList[0].moduleCount;
                            $bar.find('.lnum').html(dataList[0].moduleCount+'票');
                        }else{
                            $bar.data().r = dataList[0].moduleCount;
                            $bar.find('.rnum').html(dataList[0].moduleCount+'票');
                            setTimeout(function(){
                                progressBar();
                            },1e3);
                        }
                        module.find("div.area-info").html(html);
                        $btn.find(".btn-filter").show();
                    }
                    removeTicketBtnForCheckSpStatus();
                    $btn.find(".list-paper").show();
                }else{//- 对战区并且是图片选项
                    $btn.find(".area-info").addClass("pic");
                    dataList = data.data;
                    var htmla="<img src=\""+dataList[1].image+"\"/>";
                    var htmlb="<img src=\""+dataList[2].image+"\"/>";
                    var $bar = $(".progress-bar");

                    //- 左对战
                    $bar.data().l = dataList[1].moduleCount;
                    $bar.find('.lnum').html(dataList[1].moduleCount+'票');
                    $btn.find('.teama div.area-info').html(htmla);
                    //- 右对战
                    $bar.data().r = dataList[2].moduleCount;
                    $bar.find('.rnum').html(dataList[2].moduleCount+'票');
                    $btn.find('.teamb div.area-info').html(htmlb);
                    setTimeout(function(){
                        progressBar();
                    },1e3);
                }
                $btn.find('img[data-original]').lazyload({
                    threshold: 200,
                    effect: "fadeIn",
                    failurelimit : 20
                });
            }

        });
    }
    if($("section.area-battle").length){
        var $thi = $("section.area-battle");
        //- 为了优化接口数量，图片选项只需随意一个连接就好
        if($thi.data().ispic == 1){
            showDatas($thi,'2',$thi.find('.teama'),'0');
            showDatas($thi,'2',$thi.find('.teamb'),'0');
        }else{
            showDatas($thi,'2',$thi.find('.teama'),'0');
        }

    }
    if($("section.area-small").length){
        showDatas($("section.area-small"),'1','0','0');
    }
    if($("section.area-middle").length){
        showDatas($("section.area-middle"),'1','0','0');
    }
    if($("section.area-large").length){
        showDatas($("section.area-large"),'1','0','0');
    }
    if($("section.area-banner").length){
        showDatas($("section.area-banner"),'1','0','1');
    }
    if($(".area-large-info")){
        //春季banner移入移除特效
        $("section").on("mouseover mouseout",'.block-video-banner',function(event){
            var acnum = $(this).find('.acNum');
            if(acnum){
                if(event.type === "mouseover"){
                    acnum.removeClass('acNumHide');
                    acnum.addClass('acNumShow');
                }else{
                    acnum.removeClass('acNumShow');
                    acnum.addClass('acNumHide');
                }
            }
        });
    }


    //对战区块
    var progressBar = function() {
        if ($(".area-battle").length) {
            var $battle = $(".area-battle");
            var $bar = $battle.find(".progress-bar");
            var l_count = parseInt($bar.data().l);
            var r_count = parseInt($bar.data().r);
            //控制进度条增长
            var bar_width = 50;
            if ((l_count + r_count) != 0) {
                bar_width = parseFloat((l_count / (l_count + r_count)) * 100);
            }
            $bar.find(".bar").animate({width: bar_width+"%"}, 1e3, 'swing');
        }
    }
    //组投票+1
    $(".btn-support").on('click',function(){
        var $btn = $(this);
        var $team = $btn.closest(".team");
        var $section = $btn.closest("section");
        var $bar = $("section .progress-bar");
        var $ljia = $bar.find(".ljia");
        var $rjia = $bar.find(".rjia");

        if($.user.isLogin()){
            if($btn.data().status == 0){
                $.ajax({
                    type :"post",
                    url: spUrl+"/sp/modules/"+$btn.data().voteid+"/"+$team.data().module+"/ballot",
                    dataType:"json",
                    data:{v:new Date().getTime()},
                    cache: false,
                    xhrFields: {
                        withCredentials: true
                    }
                }).done(function(data){
                    if(data.code ==1){
                        addGroupTicket($team);
                        //- 提示
                        if(data.data.remain != 0){
                            bubble($btn,"感谢投票！还有<span>"+data.data.remain+"</span>次投票机会",3e3);
                            $.info.success("感谢投票！还有<span>"+data.data.remain+"</span>次投票机会",3e3);
                        }else if(data.data.remain == 0 && data.data.isShare == 0){
                            callSharePop('open');
                        }else{
                            bubble($btn,data.message,3e3);
                            $.info.success(data.message,3e3);
                        }
                    }else if(data.code==-12){
                        callSharePop('open');
                    }else{
                        $.info.warning(data.message,3e3);
                        bubble($btn,data.message,3e3);
                    }
                });

            }else{
                $.info.warning("已经给该组投过票了~",3e3);
                bubble($btn,"已经给该组投过票了~",3e3);
            }

        }else{
            window.location.href=globalConfig.rootDomain + "/login/?returnUrl="+location.href;
        }
    });




    //tab，分页   数据加载
    var showAreaData = function(areaBody,bean,num,$btn,order,itemShowType){
        areaBody.html("<div style='width: 150px;margin: 0 auto;'><img src='" + window.globalConfig.oldPath + "/umeditor/dialogs/emotion/images/ac/" + $.randomNumber(1, 54) + ".gif'/><div style='width:150px;height:40px;background:#d9edf6;line-height:40px;text-align:center;font-size:15px;margin-top:5px'>正在获取投票列表...</div></div>");
        $.ajax({
            url:spUrl+"/sp/vote",
            type:"get",
            dataType:"json",
            data:{
                voteId:bean.data().pageid,
                blockId:bean.data().areaid,
                moduleId:$btn.data().id,
                pageNum:num,
                sort:'desc',
                order:order
            },
            xhrFields: {
                withCredentials: true
            }
        }).done(function (data) {
            var html = "";
            if(data.code == 200){
                var dataItem = data.data;
                $.each(dataItem.list, function (k, v) {
                    if(itemShowType === 0){
                        html += $parseTempForSpecial($('#temp-special-video').html(), v);
                    }else{
                        html += $parseTempForSpecial($('#temp-special-banner').html(), v);
                    }

                });
                areaBody.html(html);
                bean.data().count = dataItem.count;
                bean.data().pagenum = dataItem.num;
                if(bean.data().blocktype == "22"){//-大图
                    for(v in dataItem.list){
                        $(areaBody.find(".block-video-ticket")[v]).addClass("large");
                    }
                    var $pageLarge = $("#list-pager-large");
                    $pageLarge.html(pageTool($pageLarge.data().pagenum,$pageLarge.data().count,16));
                }else if(bean.data().blocktype == "23"){//- 小图
                    //small分页
                    var $pageSmall = $("#list-pager-small");
                    $pageSmall.html(pageTool($pageSmall.data().pagenum,$pageSmall.data().count,20));
                }else if(bean.data().blocktype == "27"){//-对战区
                    if($btn.closest(".team").is(".teama")){
                        var $pageDL = $("#list-pager-l");
                        $pageDL.html(pageTool($pageDL.data().pagenum,$pageDL.data().count,8));
                    }else{
                        var $pageDR = $("#list-pager-r");
                        $pageDR.html(pageTool($pageDR.data().pagenum,$pageDR.data().count,8));
                    }
                }else if(bean.data().blocktype == '37'){
                    for(v in dataItem.list){
                        $(areaBody.find(".block-video-banner")[v]);
                    }
                    var $pageBanner = $("#list-pager-banner");
                    $pageBanner.html(pageTool($pageBanner.data().pagenum,$pageBanner.data().count,8));
                }
                areaBody.find('img[data-original]').lazyload({
                    threshold: 200,
                    effect: "fadeIn",
                    failurelimit : 20
                });
                removeTicketBtnForCheckSpStatus();
            }
        });
    }
    //候选榜tab切换
    $(".tab-list").on("click","li",function(){
        var order = 'id';
        var $btn = $(this);
        $btn.addClass('active').siblings('li').removeClass('active');
        var bean = $btn.closest('section');
        order = bean.find('.btn-filter .active').data().val;
        var areaBody = bean.find('.area-info');
        bean = bean.find('[data-pageid]');
        var itemShowType = 0;
        if(areaBody.data() && areaBody.data().showtype !== undefined && areaBody.data().showtype !== null){
            itemShowType =  areaBody.data().showtype;
        }

        showAreaData(areaBody,bean,1,$btn,order,itemShowType);

    });
    //分页事件绑定
    $("#list-pager-small,#list-pager-large,#list-pager-banner,#list-pager-l,#list-pager-r").on('click','span',function(){
        var $btn = $(this);
        var bean = $btn.closest('section');
        var order = 'id';
        //对战分页
        if($btn.closest('[data-blocktype]').data().blocktype == 27){
            bean = $btn.closest('.team');
            order = bean.find('.tab-list .active').data().val;
        }else{
            order = bean.find('.btn-filter .active').data().val;
        }
        var areaBody = bean.find('.area-info');
        var tabBtn = bean.find('.tab-list .active');
        bean = bean.find('[data-pageid]');
        var itemShowType = 0;
        if(areaBody.data() && areaBody.data().showtype !== undefined && areaBody.data().showtype !== null){
            itemShowType =  areaBody.data().showtype;
        }
        showAreaData(areaBody,bean,$btn.data().page,tabBtn,order,itemShowType);
    });
    //对战排序筛选
    $("section.area-battle .team .btn-filter").on('click','span',function(){
        var $btn = $(this);
        var bean = $btn.closest('.team');
        bean = bean.find('[data-pageid]');
        var areaBody = $btn.closest('.team').find('.area-info');
        $btn.addClass('active').siblings('span').removeClass('active');
        var itemShowType = 0;
        if(areaBody.data() && areaBody.data().showtype !== undefined && areaBody.data().showtype !== null){
            itemShowType =  areaBody.data().showtype;
        }
        showAreaData(areaBody,bean,1,$btn,$btn.data().val,itemShowType);
    });
    //推荐位排序筛选
    $("section.area .btn-filter.area-rec").on('click','span',function(){
        var $btn = $(this);
        var bean = $btn.closest('section');
        var areaBody = bean.find('.area-info');
        var tabBtn = bean.find('.tab-list .active');
        bean = bean.find('[data-pageid]');
        $btn.addClass('active').siblings('span').removeClass('active');
        var itemShowType = 0;
        if(areaBody.data() && areaBody.data().showtype !== undefined && areaBody.data().showtype !== null){
            itemShowType =  areaBody.data().showtype;
        }
        showAreaData(areaBody,bean,1,tabBtn,$btn.data().val,itemShowType);
    });

    //large分页
    var $pageLarge = $("#list-pager-large");
    if($pageLarge.length){
        $pageLarge.html(pageTool($pageLarge.data().pagenum,$pageLarge.data().count,16));
    }
    //small分页
    var $pageSmall = $("#list-pager-small");
    if($pageSmall.length){
        $pageSmall.html(pageTool($pageSmall.data().pagenum,$pageSmall.data().count,20));
    }
    var $pageBanner = $("#list-pager-banner");
    if($pageBanner.length){
        $pageBanner.html(pageTool($pageBanner.data().pagenum,$pageBanner.data().count,8));
    }
    //对战分页
    var $pageDL = $("#list-pager-l");
    if($pageDL.length){
        $pageDL.html(pageTool($pageDL.data().pagenum,$pageDL.data().count,8));
    }
    var $pageDR = $("#list-pager-r");
    if($pageDR.length){
        $pageDR.html(pageTool($pageDR.data().pagenum,$pageDR.data().count,8));
    }
    //删除所有投票按钮根据当前活动状态 现在只删除春季投票的 投票活动过后可以删除这段代码
    var removeTicketBtnForCheckSpStatus = function(){
        if($("section.area-banner").length){
            var spState = 0;
            var tmpinfodata = $("section.area-banner").find("div.area-info").data();
            if(tmpinfodata.spstate !== undefined && tmpinfodata.spstate !== null){
                spState = tmpinfodata.spstate;
            }
            if(spState === 2){
                $('.clearfix .ticketBtn').remove()
            }
        }
    }


    //分享
    if($(".area-share").length){
        $('#bdshare').share({
            text: $("#share-info").data().sharetext,
            url:  location.href + ($.user.isLogin ? '?shareUid=' + $.user.uid : ''),
            preview: $("#share-info").data().shareimg,
            desc:"",
            comment:""
        }, '');
        $('#bdshare-pop').share({
            text: $("#share-info").data().sharetext,
            url: location.href + ($.user.isLogin ? '?shareUid=' + $.user.uid : ''),
            preview: $("#share-info").data().shareimg,
            desc:"",
            comment:""
        }, '');
    }


    //分享pop
    $("#bdshare,#bdshare-pop").on("click","a",function(){
        var pageId = $("#share-info").data().pageid;
        $.ajax({
            type :"post",
            url: spUrl+'/sp/vote/'+pageId+'/share',
            data:{"pageId":pageId},
            dataType:"json",
            xhrFields: {
                withCredentials: true
            }
        }).done(function(data){
        });
    } );




    var $shadeLayer = $("#shade-layer");
    //open or close pop
    var callSharePop = function(func){
        $thi = $("#pop-share");
        var $pop = $(".pop");
        var top_ = $(window).scrollTop() + 200;
        var left_=$(window).width() / 2 - 216;
        $pop.css({
            'top':top_,
            'left':left_
        });
        if(func == 'open'){
            $thi.show();
            $shadeLayer.show();
        }else{
            $thi.hide();
            $shadeLayer.hide();
        }


    }
    //取消弹窗
    $shadeLayer.on('click',function(){
        callSharePop('close');
    });
    $(".btnok,#pop-btn-close").on('click',function(){
        callSharePop('close');
    });

    //气泡
    var closeBull="";
    var bubble = function(thi,text,t){
        var bub = $("#special-bubble");
        var top_ = thi.offset().top+30;
        var left_=thi.offset().left-26;
        bub.css({
            'top':top_,
            'left':left_
        });
        bub.html("<div class='arrow-up'></div>"+text);
        bub.fadeIn();
        clearInterval(closeBull);
        closeBull = setInterval(function(){
            bub.fadeOut();
        },t);
    }

    //春季投票因为比较宽所以需要在规则去以及分享区同步宽度
    if($(".special-ticket-wp-banner").length){
        var stwbWidth = $(".special-ticket-wp-banner").css("width")
        $(".rule,.area-share").css({"width":stwbWidth});
    }
    //区块背景颜色处理
    var sHex = $("#block-background").data().background;
    var sAlpha = $("#block-background").data().backgroundalpha || 1;
    $(".area-large,.area-small,.area-middle,.area-banner,.rule,.banner-video-block,.area-share").css({"background":$colorRgb(sHex,sAlpha)});
    //html标签处理
    var shareModule = $("#share_text");
    if(shareModule.length){
        $("#share_text").html($("#share_text").text()).show();
    }


    var arr = $(".rule-info");
    if(arr.length){
        for(var x = 0;x < arr.length; x++){
            var ruleId = $(arr[x]).attr("id");
            $("#"+ruleId).html($("#"+ruleId).text()).show();
        }
    }
    //数据统计
    window.sa && sa.track('Detailpage', {
        type: "专题",
        from: document.referrer,
        firstPage: window.saObj.isFirstPage,
        channelId: "",
        secChannelId: "",
        ac: "",
        UPId: "",
        uId: String($.user.uid) || "",
        channel: $.getQueryString("channel") || "",
        product: "web"
    });


    if($("#block-background").data().commid) {
        //comm
        setTimeout(function () {
            var commid = $("#block-background").data().commid;
            return comment(commid, function () {
            });
        }, 500);
    }else{
        $(".area-comm").hide();
        $("#to-comm").hide();
    }

});
