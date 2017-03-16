require('../../model/index').User

export default async function (ctx, next) {
  if ( ctx.body.name.length === 0) {
    console.log('名字没填')
  }
  User.find({ name: ctx.body.name },null,null, (err,docs) => {
    console.log('docs:',docs)
  });
}

