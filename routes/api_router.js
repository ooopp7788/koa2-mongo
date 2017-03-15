const api_router = require('koa-router')();

const users = require('../controller/api/users');

api_router.get('/users', users)

export default api_router;