const fs = require('fs');

const cdn = '';
const config = {
    cdn: cdn,
    ssl: 'https://ssl.acfun.tv',
    // api: 'http://webapi.acfun.cn',
    api: 'http://api.acfun.video.com/v1',
    path: cdn + '/static2/src',
    oldPath: 'http://cdn.aixifan.com/dotnet/20130418',
    defaultImg: '/static/img/1.png',
    debug: true,
    log_console: true,
    log_request: true,
    preheat_category: false,
    logger: {
        levels: 'ERROR'//TRACE DEBUG INFO WARN ERROR FATAL
    },
    apiError: false,
    version: '1.0.0',
    sv: JSON.parse(fs.readFileSync('public/static2/rev-manifest.json', 'utf-8'))
}



export default config;