const router = require('koa-router')();
const superagent = require('superagent');

export default async function (ctx, next) {
  let data ;
  const res = await superagent.get('http://webapi.acfun.cn/modules?blockId=154');
  data = res.body.data;
  console.log(2)
  await ctx.render ('demo/api', {
    title: 'api!',
    data : data[0]
  })
}

