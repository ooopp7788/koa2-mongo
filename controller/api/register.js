require('../../model/index').User

export default async function (ctx, next) {
  if ( ctx.body.name.length === 0) {
    console.log('名字没填')
  }
  User.save({ name: ctx.body.name,password:ctx.body.password },null,null, (err,product,numAffected) => {
    console.log('register:',product,numAffected)
    ctx.redirect('/')
  });
}

