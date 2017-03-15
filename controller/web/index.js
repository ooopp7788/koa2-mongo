const ApiPath = require('../../common/Api')
const ajax = require('../../common/request_util')

export default async function (ctx, next) {
  console.log('index')
  const api = new ApiPath(ctx.state.config.api)
  let infoApi = [
    api.getNavigations(),
    api.getGlobalBanner(),
    api.getGlobalSearchText(),
    //apiPath.getPages(1),
    api.getHotWords(),
    api.getPendant(1)
  ]
  let blocksApi = [api.getChannelAreas(70)]
  const infoDataList = await ajax.get(ctx,infoApi)
  const blockList = await ajax.get(ctx,blocksApi)

  // if (blockList.code === 200) {

  // } else {
  //   ctx.status = 500
  // }

  // 获取所有block
  const apiList = []
  if (blockList[0] && blockList[0].code == 200) {
    for (let block of blockList[0].data) {
      if (block.id) {
        let url = api.getModules(block.id)
        apiList.push(url)
      }
    }
  }

  const channelName = '科技'
  const pageInfoData = {
      name: channelName,
      seoDescription: channelName + ",A站,ACFUN,ACG,弹幕,视频,动画,漫画,游戏,斗鱼,新番,鬼畜,东方,初音,DOTA,MUGEN,LOL,Vocaloid,MAD,AMV,天下漫友是一家",
      seoKey: channelName + ",A站,ACFUN,ACG,弹幕",
      seoTitle: channelName + " - ACFUN"
  }

  await ctx.render('index_index', {
    pageInfo : pageInfoData,
    url : apiList
  })
}

