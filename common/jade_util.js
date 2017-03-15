const jade = require('jade')
const config = require('./config/config')

const compileFile = jade.compileFile

jade.compileFile = (path,option) =>{
    if(config.debug){
        option = Object.assign({},{cache:true},option)
    } else {
        option = Object.assign({},{cache:true},option)
    }
    return compileFile(path,option)
}

export default jade;