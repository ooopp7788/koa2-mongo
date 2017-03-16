const ApiPath = require('../../common/Api')
const ajax = require('../../common/request_util')

export default async function (ctx, next) {
  console.log('register')

  await ctx.render('register', {
    title : '注册'
  })
}

