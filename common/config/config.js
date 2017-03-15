const cfg = require('../env/' + process.env.NODE_ENV)
let dirname = process.cwd()
const common = {
    PROJ_ROOT : dirname,
    port: 5040, //监听的端口
    esource_on: true,
    route_on: true,
    resource_reg: /^(dist|static\/|[^\/]+\.(?!js|html)\w+$)/,
    domain: 'http://www.acfun.cn',
    webTitle: '天下漫友是一家',
    rootDomain: 'http://www.acfun.cn',
    timeout : 60
};

export default Object.assign({}, common , cfg);
