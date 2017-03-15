const getMd5 = require('crypto').createHash

let count = 0
let file_map = {}
const base_path = process.cwd() + '/cache/json'

const hasCache = (str) => {
    let md5 = getMd5(str)
    if (!file_map[md5]) {
        return true
    }
    return false
}

const set = (str,json) => {
    file_map[str] = json
}

const get = (str,json) => {
    return file_map
}

exports.set = set 
exports.get = get 