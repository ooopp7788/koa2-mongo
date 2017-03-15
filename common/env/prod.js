const cdn = 'http://cdn.aixifan.com';
const version = '1.9.6';
const path = cdn + '/acfun-pc/' + version;

const config =  {
    cdn: cdn,
    ssl: 'https://ssl.acfun.tv',
    api: 'http://webapi.aixifan.com',
    path: path,
    oldPath: cdn + '/dotnet/20130418',
    defaultImg: path + '/img/1.png',
    debug: false,
    log_console: false,
    preheat_category: true,
    logger: {
        levels: 'ERROR'//TRACE DEBUG INFO WARN ERROR FATAL
    },
    apiError: true,
    version: version
}

export default config;