const ApiPath = require('../../common/Api')
const http = require('../../common/request_util')
const logUtil = require('../../common/log_util')
const block_map = require('../../common/map_util').BLOCK_MAP
const jade = require('../../common/jade_util')
const fs = require('fs')

export default async function (ctx, next) {
  const api = new ApiPath(ctx.state.config.api)
  let infoApi = [
    api.getTopInfo()
  ]
  let blocksApi = [api.getChannelAreas(70)]
  
  const infoDataList = await http.get(ctx,infoApi)
  const blockList = await http.get(ctx,blocksApi)

  const channelName = '科技'
  const pageInfoData = {
      name: channelName,
      seoDescription: channelName + ",A站,ACFUN,ACG,弹幕,视频,动画,漫画,游戏,斗鱼,新番,鬼畜,东方,初音,DOTA,MUGEN,LOL,Vocaloid,MAD,AMV,天下漫友是一家",
      seoKey: channelName + ",A站,ACFUN,ACG,弹幕",
      seoTitle: channelName + " - ACFUN"
  }

  let html_top = ''
  let html_left = ''
  let html_right = ''

  const topblock = blockList[0][0]
  blockList[0].shift()

  const topDataList = await http.get(ctx,[api.getModules(topblock.id)])
  html_top = jade.compileFile(block_map[topblock.block_type])({topData:topDataList[0]})

  let tpl = {}

  for (let block of blockList[0]){
    let path = block_map[block.block_type]
    let temp = jade.compileFile(path)({block:block}) 
    
    for (let module of block.module) {
      if (!tpl['tpl'+module]) {
        let path = `${process.cwd()}/views_v2/dotTpl/tpl_89.html`
        let tplStr = fs.readFileSync(path,'utf-8')
        tpl['tpl_'+module] = tplStr.replace(/\n\s*/g, "");
      }
    }
    if (block.block_type == 14) {
      html_right += temp
    } else {
      html_left += temp
    }
  }

  console.log('rendering')
  
  await ctx.render('channel_index', {
    pageInfo : pageInfoData,
    headerSearchBox : true,
    infoData : infoDataList[0],
    topData : topDataList[0],
    channelId : 70,
		parentCId : 70,
    blocks : blockList[0],
    html : {
      top : html_top,
      left : html_left,
      right : html_right
    },
    tpl: JSON.stringify(tpl)
  })
}

