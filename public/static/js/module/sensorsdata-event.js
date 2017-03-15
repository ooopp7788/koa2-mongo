/**
 * Created by dadong on 16/5/18.
 * 烂代码一坨
 */
$(function(){

    //命名
    var dataArr = [],
        getvl = function(name) {
            var reg;
            reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
            if (reg.test(location.href)) {
                return unescape(RegExp.$2.replace(/\+/g, " "));
            }
        };

    //处理
    var handlar = {
        index:function(){
            var eventBIndArr = [
                '#slider-big li',//大轮播图
                '.calendar-box',//次元日历
                '.slider-small',//顶部小图推荐
                '.area-monkey .column-left figure',//猴子推荐小图
                '.area-monkey .column-right .pic-box', //猴子推荐右边
                '.area-banana-rank .crop-margin figure a',//香蕉榜左边小图
                '.area-banana-rank .column-left .banana-ad a',//香蕉榜左边广告位
                '.area-banana-rank .module-article li a',//香蕉榜右边文章
                '.area-channel-big .column-box .module-video figure',//大图频道左边小图
                '.area-channel-big .column-box .module-video-big',//大图频道左边大图
                '.area-channel-big .module-rank li a',//大图频道右边排行榜
                '.area-channel-big-middle .column-box .module-video figure',//大图频道两行小图左边小图
                '.area-channel-big-middle .column-box .module-video-big',//大图频道两行小图左边大图
                '.area-channel-big-middle .module-rank li a',//大图频道两行小图右边排行榜
                '.area-drama .time-line li',//番剧左边放映表
                '.area-drama .module-drama figure',//番剧左边新番发布
                '.area-drama .module-season .pic-box',//番剧右边
                '.area-channel-middle .module-video figure',//中图频道左边小图
                '.area-channel-middle .module-rank .module-con li a',//中图频道右边排行榜
                '.area-channel-small .module-video figure',//小图频道
                '.area-recommend span',//文字推荐
                '.area-ad a',//广告
                '.area-channel-monkey figure.block-video',//二级页猴子推荐
                '.area-channel-banana figure.block-banana',//二级页香蕉榜
                '.channel-hot-search .hotWord a',//二级页热门标签
                '.fame-hall .module-con li'//二级页热门标签
            ];

            //事件绑定
            $(eventBIndArr.join(',')).on('click',function(){
                var $this = $(this),
                    block_id = $this.closest('[b-id]').attr('b-id'),
                    module_id = $this.closest('[m-id]').attr('m-id'),
                    content = $this.find('a').attr('href') || $this.attr('href'),
                    ac = content.match(/ac\d+/g) || content.match(/ab\d+/g),
                    block_name = $this.closest('[b-name]').attr('b-name'),
                    module_name = $this.closest('[m-name]').attr('m-name'),
                    block_type = $this.closest('[b-type]').attr('b-type'),
                    module_type = $this.closest('[m-type]').attr('m-type'),
                    pageType = '',
                    pageId = '';

                var url = window.location.href;
                switch (true){
                    case /acfun.cn\/$/.test(url) || /tudou.com\/$/.test(url):
                        pageType = 'homepage';
                        break;
                    case /\/v\/list[0-9]+\/index.htm/.test(url):
                        pageType = location.href.match(/\/[v|a]\/list(\d+)/)[1];
                        break;
                    default:
                        pageType = 'homepage';
                }
                var indexArr = dataArr.concat(block_id,module_id,content,block_name,module_name,block_type,module_type,pageType,pageId,ac);
                //indexArr = indexArr.join(',');
                dataTj(indexArr);
            });
        }
    };



    //获取页面eventID及判断当前所属页面
    (function(){
        handlar.index();
    })();

    //- 统计
    var dataTj = function(item){
        window.sa && sa.track('DianJiYunYingWei_PC', {
            product: 'web',
            UID: $.cookie('auth_key') || '',
            channel: getvl('channel') || '',
            userLevel: $.cookie('auth_key') ? '1' :'0',
            pageType: item[7],//页面类型
            pageId: item[8],//ID
            regionId: item[3],//区块名称
            regionType: item[5],//区块类型
            moduleId: item[4],//模块名称
            moduleType: item[6],//模块类型
            linkType: 0,//跳转类型
            content: item[9] || '',//内容
            link: item[2],//链接
            pos: ''//位置
        });
    };
});
