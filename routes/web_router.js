const web_router = require('koa-router')();

const index = require('../controller/web/index');

web_router.get('/', index);

export default web_router;