const Koa = require('koa');
const app = new Koa();

const views = require('koa-views');
const path = require('path');
const co = require('co');
const convert = require('koa-convert');
const logger = require('koa-logger');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logUtil = require('./common/log_util');
const router = require('koa-router')();
const staticCache = require('koa-static-cache');
const routerCache = require('koa-router-cache');
const MemoryCache = routerCache.MemoryCache;
const gzip = require('koa-gzip');

//router
const web_router = require('./routes/web_router');
const api_router = require('./routes/api_router');
//config
const config = require('./common/config/global');
const routerCacheConfig = require('./common/config/router_cache_config');

// middlewares
app.use(convert(bodyparser));
app.use(convert(json()));
app.use(logger())

//静态文件服务
app.use(convert(staticCache(path.join(__dirname, 'public'), {
    maxAge: 365 * 24 * 60 * 60,
    gzip: true
})));

app.use(gzip());

//路由缓存服务
app.use(routerCache(app, routerCacheConfig));

app.use(views(__dirname + '/view', {
    extension: 'jade'
}));

// config(在view中增加config变量)
app.use(async (ctx, next) => {
    ctx.state.config = config
    await next();
});

// logger
app.use(async (ctx, next) => {

    const start = new Date();

    let ms;

    try {

        await next();

        ms = new Date() - start;

        logUtil.logResponse(ctx,ms);

    } catch(error){

        ms = new Date() - start;

        logUtil.logError(ctx,error,ms);

    }

});

// 对/n/api路由进行response处理
// app.use(response_formatter('^/n/api'));

// 页面路由
router.use('/', web_router.routes(), web_router.allowedMethods());
// api路由
router.use('/n/api', api_router.routes(), api_router.allowedMethods());

app.use(router.routes(), router.allowedMethods());

app.on('error', function(err, ctx){
    logUtil.logError(ctx, err, 0);
});


module.exports = app;