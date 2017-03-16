const md5 = require('md5');
const fs = require('fs')

const cache_path = process.cwd() + '/cache/json/'
/**
 * 通过接口url的md5值来缓存json文件，读取时转成json返回
 * @param {*} url 接口url
 * @param {*} json 接口返回的json
 */
// 设置缓存
const set = (url,json) => {
    const path = cache_path + md5(url) + '.json'
    json = JSON.stringify(json)
    var buffer = new Buffer(json)
    fs.open(path,'w',(err,fd) => {
        fs.write(fd,buffer,0,(err,written,buffer)=>{
        })
    })
}
// 获取缓存
const get = (url) => {
    const path = cache_path + md5(url) + '.json'
    return fs.stat(path , (err, stats) =>{
        if (err) {
            console.log('fs ERROR!')
            return
        }
        const isFile = stats.isFile()
        if (isFile) {
            return JSON.parse(fs.readFileSync(path, 'utf-8'))
        }
    })
}

exports.set = set 
exports.get = get 