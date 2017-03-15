const apihost = require('./config/config').api
/**
 * 定义API路径常量
 * @type {string}
 */

export default class {
	constructor() {
        this.host = apihost;
		this.setHost = function (url) {
			return this.host + url;
		};
	}

	/**
	 * 获取页面信息(title,keyword等)
	 * @returns {string}
	 */
	getPages(pageId) {
		return this.setHost('/pages/' + pageId);
	}

	/**
	 * 获取页面信息(title,keyword等)
	 * @returns {string}
	 */
	getTopInfo() {
		return this.setHost('/global?type=web');
	}

	/**
	 * 获取页面所需区块
	 * @param pageId
	 * @returns {string}
	 */
	getAreas(pageId) {
		return this.setHost('/blocks?pageId=' + pageId);
	}

	/**
	 * 根据channelId获取页面所需模块
	 * @param channelId
	 * @returns {string}
	 */
	getChannelAreas(channelId) {
		return this.setHost('/pages?cid=' + channelId);
	}

	/**
	 * 获取模块
	 * @param moduleId
	 * @returns {string}
	 */
	getModules(moduleId) {
		return this.setHost('/query/module?blockId=' + moduleId);
	}

	/**
	 * 获取页面banner
	 * @returns {string}
	 */
	getGlobalBanner() {
		return this.setHost('/global/banner');
	}

	/**
	 * 获取导航信息
	 * @returns {string}
	 */
	getNavigations() {
		return this.setHost('/navigations');
	}

	/**
	 * 获取搜索推荐词
	 * @returns {string}
	 */
	getGlobalSearchText() {
		return this.setHost('/global/seatext');
	}

	/**
	 * 获取排行榜
	 * @param channelId
	 * @param range
	 * @param count
	 * @returns {string}
	 */
	getChannelRank(channelId, range, count) {
		let date = '';
		let host = 'http://www.acfun.cn';

		return this.setHost("/rank.aspx?channelId=" + channelId + "&range=" + range + "&count=" + count + date, host);
	}

	/**
	 * 文章最新回复
	 * @param ids
	 * @param count
	 * @returns {string}
	 */
	getArticleRank(ids, count) {
		return this.setHost('/contents/lastFeedback?channelIds=' + ids + '&count=' + count);
	}

	/**
	 * 获取排行榜
	 * @param channelIds parentChannelIds 多个分类ID
	 * @param isParentChannel 是否是父级分类
	 * @param page 翻页
	 * @param size
	 * @param range 1:日榜 2:周榜 3:月榜 0:使用自定义时间参数(contributeTimeStart,contributeTimeEnd) -1:不限制时间
	 * @param isForce true|false 强制补全size数据(如有翻页请false)
	 * @param sort 1:pageView 2:comment 3:danmu 4:banana 5:active 6:favorite 7:latestComment 8:latestDanmu 0:(默认投稿时间)
	 * @param order 0:正序 1:倒序(后端默认值)
	 * @param typeIds 1:普通 2:福利 3:原创 4:下榜 5:不显示
	 * @param contributeTimeStart
	 * @param contributeTimeEnd
	 * @param tagIds 多个分类ID
	 * @param isEssense true | false (如不过滤请不传)
	 * @param isRecommend true | false(如不过滤请不传)
	 * @param isTopLevel true | false(如不过滤请不传)
	 * @returns {string}
	 */
	getRank(channelIds = [], isParentChannel = false, sort = 0, range = 1, isForce = false, page = 1, size = 10,
			typeIds = [1, 3], order = 1, contributeTimeStart, contributeTimeEnd, tagIds = [], isEssense, isRecommend,
			isTopLevel) {

		if (!think.isArray(channelIds)) {
			return '';
		}

		let sortMap = {
			1: 'pageView',
			2: 'comment',
			3: 'danmu',
			4: 'banana',
			5: 'active',
			6: 'favorite',
			7: 'latestComment',
			8: 'latestDanmu'
		};

		let param = {
			page: page,
			size: size,
			order: order,
			typeIds: typeIds,
			isForce: isForce
		};

		if (isParentChannel) {
			param.parentChannelIds = channelIds;
		} else {
			param.channelIds = channelIds;
		}

		if (sort > 0) {
			param.sort = sortMap[sort];
		}

		if (range >= 0) {
			let date = new Date().getTime();
			let startTime = '';
			let endTime = parseInt(date / 1000 / 60) * 1000 * 60;
			let dayTime = 3600000 * 24;

			switch (range) {
				case 0:
					startTime = contributeTimeStart;
					endTime = contributeTimeEnd;
					break;
				case 1:
					startTime = endTime - dayTime;
					break;
				case 2:
					startTime = endTime - dayTime * 7;
					break;
				case 3:
					startTime = endTime - dayTime * 30;
					break;
				default:
					startTime = endTime - dayTime;
			}
			//if (think.config().debug || think.env == 'testing') {
			//	startTime = new Date(2015, 1, 1).getTime();
			//}
			param.contributeTimeStart = startTime;
			param.contributeTimeEnd = endTime;
		}

		if (think.isArray(tagIds) && tagIds.length) {
			param.tagIds = tagIds;
		}

		/*if (isEssense != undefined) {
			param.isEssense = isEssense;
		}

		if (isEssense != undefined) {
			param.isRecommend = isRecommend;
		}

		if (isEssense != undefined) {
			param.isTopLevel = isTopLevel;
		}*/

		let url = global.objToUrl(param);


		// if (think.config().debug || think.env == 'testing') {
		// 	return 'http://106.38.204.82/query/rank?' + url;
		// } else {
		return this.setHost('/query/rank?' + url);
		// }
	}

	/**
	 * 香蕉榜
	 * @param type
	 * @returns {string}
	 */
	getContentsTopList(type) {
		return this.setHost('/contents/toplist?type=' + type);
	}

	/**
	 * 最新分类
	 * @param channelId
	 * @param count
	 * @returns {string}
	 */
	getContentsNewContent(channelId, count) {
		return this.setHost('/contents/newContents?channelId=' + channelId + '&count=' + count);
	}

	/**
	 * 热词
	 * @returns {string}
	 */
	getHotWords() {
		return this.setHost('/hotwords/mobileHotWords.aspx?type=web');
	}

	/**
	 * 二次元锚点
	 * @returns {string}
	 */
	getGlobalCalendar() {
		return this.setHost('/global/suspendedimg');
	}

	/**
	 * 挂件
	 * @param pageNumber
	 * @returns {string}
	 */
	getPendant(pageNumber) {
		return this.setHost('/appSpreadContents/indexguajian?pageNum=' + pageNumber);
	}

	/**
	 * 三级页广告位
	 */
	getListImg(pageNum) {
		return this.setHost('/appSpreadContents/advertising?pageNum=' + pageNum);
	}

	/**
	 * 三级标签位
	 */
	getListLabel(cid) {
		return this.setHost('/tags/de?cid=' + cid);
	}
	/**
	 * 二级标签位
	 */
	getChannnelTags(cid) {
		return this.setHost('/tags/dio?cid=' + cid);
	}

	/**
	 * 弹幕增量接口
	 * @param channelId 分类id,部分大小
	 * @param type danmu | comment | view
	 * @param duration 区间(秒)
	 * @param page
	 * @param size 后端默认10条
	 * @returns {*}
	 */
	getFastRank(channelId, size = 10, page = 1, type = 'danmu', duration = 3600) {
		let param = {
			channelId: channelId,
			type: type,
			duration: duration,
			page: page,
			size: size
		};

		let url = global.objToUrl(param);

		return this.setHost('/query/fastrank?' + url);
	}




	/**
	 * 获取页面信息
	 */
	getSpecialPages(pageId=""){
		return this.setHost('/sp/pages/'+pageId);
	}
	/**
	 * 专题页区块接口
	 */
	getSpecialAreas(pageId=""){
		return this.setHost('/sp/blocks?url='+pageId);
	}
	/**
	 * 获取模块
	 * @param moduleId
	 * @returns {string}
	 */
	getSpecialModules(moduleId,auth_key="") {
		return this.setHost('/sp/modules?blockId=' + moduleId + "&auth_key=" +auth_key);
	}
	/**
	 * tab切换，分页
	 */
	getSpecialTabOrPage(obj0,obj1,obj2,obj3,obj4=""){
		return this.setHost('/sp/vote?voteId='+obj0+'&blockId='+obj1+'&moduleId='+obj2+'&pageNum='+obj3+'&auth_key='+obj4);
	}
	/**
	 * 投票
	 */
	getSpecialBallot(voteid,did){
		return this.setHost("/sp/vote/"+voteid+"/"+did+"/ballot");
	}
	/**
	 * 分享
	 */
	getSpecialShare(pageId){
		return this.setHost("/sp/vote/"+pageId+"/share");
	}


	/**
	 * 视频详情页
	 */
	getDetailsPage(ids){
		return this.setHost("/query/content?ids="+ids+"&status=-1");
	}
	/**
	 * 视频合集
	 */
	getAlbum(id,gid,cid,sid){
		return this.setHost("/query/album/albumWithContents?albumId="+id+"&groupId="+gid+"&contentId="+cid+"&sort="+sid);
	}
	/**
	 * 视频详情页广告位
	 */
	getDetailsAd(id){
		return this.setHost("/appSpreadContents/detailpage"+id+"?pageNum=1");
	}
	/**
	 * 视频详情页-广告位
	 */
	getAdvertising(id){
		return this.setHost("/appSpreadContents/advertising"+id+"?pageNum=1")
	}
	/**
	 * 搜索结果页广告位
	 */
	getSearchAd() {
		return this.setHost('/appSpreadContents/search?pageNum=1');
	}

	/**
	 * 根据id和类型推荐内容
	* typeId:类型(1-ac视频稿件,2-ab番剧稿件,3-ac文章稿件)
	 */

	getErrorPageRecom(id, typeId) {
	return this.setHost("/query/errorPageRecom?typeId=" + typeId + "&id=" + id);
	}

	/**
	 * up主空间页-ta的投稿
	 */
	getContributions(userId,pageSize,isArticle,orderBy,pageNo){
	    	return "http://www.acfun.cn/u/contributeList.aspx?userId="+userId+"&pageSize="+pageSize+"&isArticle="+isArticle+"&orderBy="+orderBy+"&pageNo="+pageNo;
	}
	/**
	 * up主空间页-ta的合辑
	 */
	getCollection(userId,pageSize,pageNo,order){
	    return "http://www.acfun.cn/u/specialList.aspx?userId="+userId+"&pageSize="+pageSize+"&pageNo="+pageNo+"&order="+order;
	}
	/**
	 * up主空间页-用户信息
	 */
	getUserInfo(uid){
		return "http://www.acfun.cn/u/profile.aspx?userId="+uid;
	}
	/**
	 * up主空间页-关注列表
	 */
	getFlowList(name,uid,pageNo,pageSize){
		return "http://www.acfun.cn/api/friendExt.aspx?name="+name+"&userId="+uid+"&pageNo="+pageNo+"&pageSize="+pageSize;
	}
	/**
	 * 游戏banner
	 */
	getGameBanner(){
		return "http://games.aixifan.com/api/game/banner";
	}
	/**
	 * 游戏bg
	 */
	getGameBg(){
		return "http://games.aixifan.com/api/game/bgimg";
	}
	/**
	 *游戏首页-广告位
	 */
	getGameAdvert(){
		return "http://games.aixifan.com/api/game/advert";
	}
	/**
	 * 游戏首页-游戏推荐
	 */
	getGameTop(){
		return "http://games.aixifan.com/api/game/top";
	}
	/**
	 * 游戏首页-游戏列表
	 */
	getGameListWeb(name,num,pageNo,pageSize){
		return 'http://games.aixifan.com/api/game/list?_afWhere={"type":"'+name+'"}&_afGet={"num":"'+num+'"}&_afOther={"limit":["'+pageNo+'","'+pageSize+'"]}';
	}
	getGameListNew(name,num,pageNo,pageSize){
		return 'http://games.aixifan.com/api/game/list?_afWhere={"status":"'+name+'"}&_afGet={"num":"'+num+'"}&_afOther={"limit":["'+pageNo+'","'+pageSize+'"]}';
	}
	getGameListHot(name,num,pageNo,pageSize){
		return 'http://games.aixifan.com/api/game/list?_afWhere={"status":"'+name+'"}&_afGet={"num":"'+num+'"}&_afOther={"limit":["'+pageNo+'","'+pageSize+'"]}';
	}
	getGameList(num,pageNo,pageSize){
		return 'http://games.aixifan.com/api/game/list?_afGet={"num":"'+num+'"}&_afOther={"limit":["'+pageNo+'","'+pageSize+'"]}';
	}

	/**
	 * 礼包页banner
	 */
	getGiftBanner(){
		return "http://games.aixifan.com/api/gift/banner";
	}
	/**
	 *礼包页-广告位
	 */
	getGiftAdvert(){
		return "http://games.aixifan.com/api/gift/advert";
	}
	/**
	 * 礼包页-游戏推荐
	 */
	getGiftTop(){
		return "http://games.aixifan.com/api/gift/top";
	}


    /**
     * http://webapi.aixifan.com/live/contentList?blockId=190
     * 首页获取直播推荐模块数据
     */
  getLiveForIndex(blockId){
        return this.setHost("/live/contentList?blockId="+blockId);
    }

}
