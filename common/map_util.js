/**
 * 定义模块及区块路径
 */
const config = require('./config/config')

let blockPath =  config.PROJ_ROOT + '/views_v2/include/block/';

/**
 * 定义区块路径
 * @type {string}
 */

export const BLOCK_AD = blockPath + 'ad.jade';
export const BLOCK_BANANA_RANK = blockPath + 'banana-rank.jade';
export const BLOCK_CHANNEL_MIDDLE = blockPath + 'channel-middle.jade';
export const BLOCK_CHANNEL_BIG = blockPath + 'channel-big.jade';
export const BLOCK_CHANNEL_SMALL = blockPath + 'channel-small.jade';
export const BLOCK_DRAMA = blockPath + 'drama.jade';
export const BLOCK_HOME_SLIDER = blockPath + 'home-slider.jade';
export const BLOCK_MONKEY_RECOMMEND = blockPath + 'monkey-recommend.jade';
export const BLOCK_LIVE_RECOMMEND = blockPath + 'live-recommend.jade';
export const BLOCK_SLIDER = blockPath + 'slider.jade';




export const BLOCK_CHANNEL_SLIDER = blockPath + 'channel-slider.jade';
export const BLOCK_CHANNEL_RANK = blockPath + 'channel-rank.jade';
export const BLOCK_CHANNEL_BANANA = blockPath + 'channel-banana.jade';
export const BLOCK_CHANNEL_RECOMMEND = blockPath + 'channel-recommend.jade';
export const BLOCK_CHANNEL_CHANNEL = blockPath + 'channel-channel.jade';


/**
 * 守望先锋
 */
export const BLOCK_OVERWATCH_FILTER = blockPath +'overwatch-filter.jade';
export const BLOCK_OVERWATCH_RANK = blockPath +'overwatch-rank.jade';


/**
 * 定义块路径
 * @type {string}
 */
export const BLOCK_MAP = {
	1: BLOCK_HOME_SLIDER, //轮播图
	2: BLOCK_MONKEY_RECOMMEND, //猴子推荐
	3: BLOCK_MONKEY_RECOMMEND, //猴子推荐2
	4: BLOCK_CHANNEL_BIG, //大频道推荐
	5: BLOCK_CHANNEL_MIDDLE, //中频道推荐
	6: BLOCK_CHANNEL_SMALL, //小频道推荐
	7: BLOCK_DRAMA, //番剧
	8: BLOCK_AD, //双图广告
	9: BLOCK_AD, //单图广告
	10: BLOCK_BANANA_RANK, //香蕉榜
	11: "",//空
	12: BLOCK_CHANNEL_SLIDER, //二级页轮播图
	13: BLOCK_CHANNEL_BANANA,//香蕉榜窄版
	14: BLOCK_CHANNEL_RANK,//二级页右侧栏
	15: BLOCK_AD,//单图广告2
	16: BLOCK_CHANNEL_RECOMMEND,//二级页猴子推荐
	17: BLOCK_CHANNEL_CHANNEL,//本区动态
	18: BLOCK_CHANNEL_BIG,//大中频道推荐 6+1(使用大频道推荐模板)
	19: BLOCK_CHANNEL_CHANNEL,//全区动态
	26: BLOCK_SLIDER,//轮播图+6小视频
	28: BLOCK_CHANNEL_SLIDER,//大轮播
	34: BLOCK_LIVE_RECOMMEND, //主播推荐
	35: BLOCK_OVERWATCH_FILTER, //守望先锋筛选类
	36: BLOCK_OVERWATCH_RANK  //守望先锋右侧栏

};

