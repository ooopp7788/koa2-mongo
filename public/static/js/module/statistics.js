/**
 * 统计代码 业务耦合性较强
 */
$(function(){

    //命名
    var dataArr = [],
        url = 'http://datareport.aixifan.com/web?value=',
        bannerArr = [];

    //处理
    var handlar = {
        commonData:function(event_id){
            event_id = event_id ? event_id : '';
            dataArr = [];
            var dataObj={
                bury_version: 1,
                device_id : $.cookie('uuid'),
                uid : $.user.uid,
                event_id: event_id,
                session_id : $.cookie('session_id'),
                time : new Date().getTime(),
                previous_page : '',
                network : '',
                refer : document.referrer || ''
            },
            dataStr;
            $.each(dataObj,function(i,n){
                dataArr.push(n);
            });
        },
        common:function(){
            bannerArr = dataArr;
            bannerArr[3] = 100010;
            dataStr = bannerArr.join(',');
            $('.header-banner').on('click',function(){
                var ac = $(this).find('a')[0];
                $.get(url+dataStr+','+ac);
            });
        },
        index:function(){
            var eventBindArr = [
                '#slider-big li a',//大轮播图
                '.calendar-box a',//次元日历
                '.slider-small a',//顶部小图推荐
                '.area-monkey .column-left figure a',//猴子推荐小图
                '.area-monkey .column-right .pic-box a', //猴子推荐右边
                '.area-banana-rank .crop-margin figure a',//香蕉榜左边小图
                '.area-banana-rank .module-article li a',//香蕉榜右边文章
                '.area-channel-big .column-box .module-video figure a',//大图频道左边小图
                '.area-channel-big .column-box .module-video-big a',//大图频道左边大图
                '.area-channel-big .module-rank li a',//大图频道右边排行榜
                '.area-channel-big-middle .column-box .module-video figure a',//大图频道两行小图左边小图
                '.area-channel-big-middle .column-box .module-video-big a',//大图频道两行小图左边大图
                '.area-channel-big-middle .module-rank li a',//大图频道两行小图右边排行榜
                '.area-drama .time-line li a',//番剧左边放映表
                '.area-drama .module-drama figure a',//番剧左边新番发布
                '.area-drama .module-season .pic-box a',//番剧右边
                '.area-channel-middle .module-video figure a',//中图频道左边小图
                '.area-channel-middle .module-rank .module-con li a',//中图频道右边排行榜
                '.area-channel-small .module-video figure a',//小图频道
                '.area-recommend span a',//文字推荐
                '.area-ad a'//广告
            ],
            page_url = window.location.href,
            indexArr=[];
            //事件绑定
            $(eventBindArr.join(',')).on('click',function(){
                handlar.commonData(100005);
                var $this = $(this),
                    block_id = $this.closest('[b-id]').attr('b-id'),
                    module_id = $this.closest('[m-id]').attr('m-id'),
                    content_id = $(this).closest('a').attr('href') || $(this).attr('href'),
                    position ,b_pt,m_pt,this_pt,m_pt_arr,m_pt_this;
                m_pt_arr = $this.parents('[b-id]').find('[m-id]');
                m_pt_this = m_pt_arr.filter('[m-id="'+module_id+'"]')[0];

                b_pt = ($this.parents('[b-id]').prevAll().length)+1;
                m_pt = ($.inArray(m_pt_this,m_pt_arr))+1;
                //this_pt = ($this.parent().prevAll().length)+1;
                this_pt = (function(){
                    var this_ptParent = $this.parent();
                    switch(this_ptParent[0].tagName){
                        case 'FIGURE':
                        case 'LI':
                            return (this_ptParent.prevAll().length)+1;
                            break;
                        case 'EM':
                        case 'B':
                        case 'SPAN':
                        case 'P':
                            return ($this.parents('figure,li').prevAll().length)+1
                            break;
                        default:
                            return 0
                    }
                })();
                position = b_pt+'-'+m_pt+'-'+this_pt;
                indexArr = dataArr.concat('',block_id,'',module_id,'',content_id,position,page_url);
                indexArr = indexArr.join(',');
                $.get(url+indexArr);
            });

            $.get(url+dataArr.join(','));
        },
        channel:function(){
            var urlId = location.href.split(/list/)[1].split('/')[0],
                channelId = '',
                childChannelId = '',
                channelArr = [],
                eventBindArr = [],
                channelBindDataArr = [];
            if ($.channel['map'][urlId]){
                channelId = urlId;
                eventBindArr=[
                    '#slider-big li a',//轮播图大图
                    '.slider-small a',//轮播图右边小图
                    '.area-channel-monkey .crop-margin figure a',//猴子推荐
                    '.area-channel-banana .crop-margin figure a',//香蕉榜
                    '.area-channel-channel .video-main .area-main figure a',//频道推荐
                    '.channel-hot-search .hotWord a',
                    '.channel-module-rank .module-main ul li a',
                    '.fame-hall .module-main ul li a'
                ];
                var page_url = window.location.href;
                //事件绑定
                $(eventBindArr.join(',')).on('click',function(){
                    handlar.commonData(100005);
                    var $this = $(this),
                        block_id = $this.closest('[b-id]').attr('b-id'),
                        module_id = $this.closest('[m-id]').attr('m-id'),
                        content_id = $(this).closest('a').attr('href').replace(/#/g,'?'),
                        position ,b_pt,m_pt,this_pt,m_pt_arr,m_pt_this;
                    m_pt_arr = $this.parents('[b-id]').find('[m-id]');
                    m_pt_this = m_pt_arr.filter('[m-id="'+module_id+'"]')[0];

                    b_pt = (function(){
                        var bidElem = $this.parents('[b-id]');
                        if(bidElem.hasClass('area-slider')){
                            return 1
                        }else{
                            var bidElemParent = bidElem.parent();
                            if(bidElemParent.hasClass('column-left')){
                                return (bidElem.prevAll().length)+2
                            }else{
                                var columnLeftLength = $('.main-bottom .column-left>section').length;
                                return (bidElem.prevAll().length)+2+columnLeftLength;
                            }
                        }
                    })();
                    m_pt = ($.inArray(m_pt_this,m_pt_arr))+1;
                    this_pt = (function(){
                        var this_ptParent = $this.parent();
                        switch(this_ptParent[0].tagName){
                            case 'FIGURE':
                            case 'LI':
                                return (this_ptParent.prevAll().length)+1;
                                break;
                            case 'EM':
                            case 'B':
                            case 'SPAN':
                            case 'P':
                                return ($this.parents('figure,li').prevAll().length)+1
                                break;
                            default:
                                return 0
                        }
                    })();
                    position = b_pt+'-'+m_pt+'-'+this_pt;
                    channelBindDataArr = dataArr.concat('',block_id,'',module_id,'',content_id,position,page_url);
                    channelBindDataArr = channelBindDataArr.join(',').toString();
                    $.get(url+channelBindDataArr);
                });
            }else{
                childChannelId = urlId;
            }
            channelArr = dataArr.concat(channelId,childChannelId);
            channelArr = channelArr.join(',');
            $.get(url+channelArr);
        }
    };



    //生成session_id&uuid
    (function(){
        var device_id,session_id,d,deviceId,
            t = new Date(),
            ti = new Date().getTime().toString(),
            product_id = 1000,
            device_type = '',
            device_os = window.navigator.platform,
            resolution = window.screen.width + '*' + window.screen.height,
            cooper_id = '',
            chrome = $.browser.isChrome,
            firefox = $.browser.isFirefox,
            safari = $.browser.isSafari
            browser = [chrome,firefox,safari],
            browser_version = '';

        //判断浏览器。。。
        $.each(browser,function(){
            if(chrome == true && window.navigator.userAgent.indexOf('Edge') > -1){
                browser_version = 'Edge'
            }else if(chrome == true){
                browser_version = 'chrome'
            }else if (firefox == true){
                browser_version = 'firefox'
            }else if (safari == true){
                browser_version = 'safari'
            }
        });
        if(window.navigator.userAgent.indexOf('MSIE 9.0') > -1){
            browser_version = 'IE9'
        }else if(window.navigator.userAgent.indexOf('MSIE 10.0') > -1) {
            browser_version = 'IE10'
        }else if(window.navigator.userAgent.indexOf('rv:11.0') > -1){
            browser_version = 'IE11'
        }else if(window.navigator.userAgent.indexOf('Edge') > -1){
            browser_version = 'Edge'
        }

        //设置30分钟
        t.setTime(t.getTime() + (30 * 60 * 1000));
        //uuid生成&session
        if ($.cookie('uuid')) {
            if (!$.cookie('session_id')) {
                device_id = $.cookie('uuid');
                session_id = ti.substr(-6) + device_id;
                $.cookie("session_id", session_id, {
                    path: "/",
                    expires: t
                });
                handlar.commonData(100101);
                //补全空位
                dataArr.push('');
                $.get(url+dataArr.join(',')+product_id + ',' + device_type + ',' + device_os + ',' + resolution + ',' + cooper_id + ',' + browser_version);
            }
        } else {
            deviceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var d = new Date().getTime();
                var r, s;
                r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                s = c === 'x' ? r : r & 0x7 | 0x8;
                return s.toString(16);
            });
            $.cookie("uuid", deviceId, {
                path: "/",
                expires: 365
            });
            device_id = $.cookie('uuid');
            session_id = ti.substr(-6) + device_id;
            $.cookie("session_id", session_id, {
                path: "/",
                expires: t
            });
            handlar.commonData(100101);
            //补全空位
            dataArr.push('');
            $.get(url+dataArr.join(',')+product_id + ',' + device_type + ',' + device_os + ',' + resolution + ',' + cooper_id + ',' + browser_version);
        }
    })();

    //获取页面eventID及判断当前所属页面
    (function(){
        var url = window.location.href;
        switch (true){
            case /acfun.cn\/$/.test(url) || /tudou.com\/$/.test(url):
                handlar.commonData(200001);
                handlar.index();
                break;
            case /\/v\/list[0-9]+\/index.htm/.test(url):
                handlar.commonData(200002);
                handlar.channel();
                break;
            default:
                handlar.commonData(600000);
                handlar.index();
        }
        handlar.common()
    })();
});
