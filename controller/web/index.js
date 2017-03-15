const ApiPath = require('../../common/Api')
const ajax = require('../../common/request_util')

export default async function (ctx, next) {
  console.log('index')

  await ctx.render('index', {
    name : 'lmj',
    title : 'Koa2'
  })
}

