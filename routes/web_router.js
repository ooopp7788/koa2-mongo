const web_router = require('koa-router')();

const index = require('../controller/web/index');
const channel = require('../controller/web/channel');

web_router.get('/', index);
web_router.get('channel', channel);

export default web_router;