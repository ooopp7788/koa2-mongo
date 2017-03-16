const superagent = require('superagent')
const async = require('async')
const logUtil = require('./log_util')
const cache = require('./cache_json_util')

const get = async (ctx,apiList,option) => {
    let header = {
        'Host': 'api.acfun.video.com',
        'Content-Type': 'application/json;charset=UTF-8'
    }
    
    if(option) {}

    if (Object.prototype.toString.call(apiList) != "[object Array]") {
        logUtil.logError('ajax.get argv[0] must be an Array!')
    }
    return new Promise((resolve,reject)=>{
        async.mapLimit (apiList,20,(url,callback)=>{
            let start = new Date()
            return new Promise((resolve,reject)=>{
                superagent.get(url).set(header).end((error,res)=>{
                    if (res){
                        if (error) {
                            logUtil.logError(ctx, error, new Date() - start)
                            reject(error)          
                        }
                        let ms = new Date() - start
                        logUtil.logRequest(res,ms)
                        callback(null,res.body.vdata)
                        cache.set(url,res.body)
                    } else {
                        let result = cache.get(url)
                        if (!result) {
                            reject('no cache file for' + url)
                        }
                        callback(null,result)
                    }
                })
            })
        }, (error,result)=>{
            resolve(result)
        });
    }) 
}

exports.get = get