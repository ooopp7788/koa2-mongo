const cfg = require('../env/' + process.env.NODE_ENV)
let dirname = process.cwd()
const common = {
    ROOT_PATH : dirname,
    resource_reg: /^(dist|static\/|[^\/]+\.(?!js|html)\w+$)/,
};

export default Object.assign({}, common , cfg);
