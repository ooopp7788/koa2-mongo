
const MemoryCache = require('koa-router-cache').MemoryCache;

/** 
 * @param key: {String|GeneratorFunction} cache key. (Required)
 * @param expire: {Number} expire time, in ms. (Required)
 * @param get: {GeneratorFunction} custom getter function for getting data from cache. (Required)
 * @param set: {GeneratorFunction} custom setter function for setting data to cache. (Required)
 * @param passthrough: {GeneratorFunction} whether pass request through, return an object. (Required)
 * @param shouldCache: {Boolean} whether cache this result
 * @param shouldPass: {Boolean} whether pass this request through
 * @param evtName: {String} event name for destroy cache. (Optional)
 * @param destroy: {function} destroy cache. (Optional)
 * @param pathToRegexp {Object} pathToRegexp options, see https: * @paramgithub.com/pillarjs/path-to-regexp#usage. (Optional)
**/

const config = {
    // 首页
    'GET /': {
        key: 'cache:index',
        expire: 2 * 1000,
        get: MemoryCache.get,
        set: MemoryCache.set,
        passthrough: MemoryCache.passthrough,
        evtName: 'clearIndexCache',
        destroy: MemoryCache.destroy
    },
    // 二级页
    'GET /channel': {
        key: 'cache:channel',
        expire: 2 * 60 * 1000,
        get: MemoryCache.get,
        set: MemoryCache.set,
        passthrough: MemoryCache.passthrough,
        evtName: 'clearChannelCache',
        destroy: MemoryCache.destroy
    },
  

}

export default config;