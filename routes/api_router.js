const api_router = require('koa-router')();

const login = require('../controller/api/login');
const register = require('../controller/api/register');

api_router.post('/login', login)
api_router.post('/register', register)

export default api_router;