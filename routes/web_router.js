const web_router = require('koa-router')();

const index = require('../controller/web/index');
const login = require('../controller/web/login');
const ucenter = require('../controller/web/ucenter');
const register = require('../controller/web/register');

web_router.get('/', index);
web_router.get('login', login);
web_router.get('register', register);
web_router.get('ucenter', ucenter);

export default web_router;