(function(){
    var mUrl,u,isAndroid,isIOS,routes,localHref;
    u = navigator.userAgent;
    isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    localHref = location.href;
    routes = [
        [/\/a\/aa(\d+)/,"/a/aa$1?"],
        [/\/a\/ab(\d+)/,"/v/?ab=$1?"],
        [/\/a\/ac(\d+)/,"/v/?ac=$1&type=article"],
        [/\/a\/ad(\d+)/,"/ad$1"],

        [/\/v\/ab(\d+)/,"/v/?ab=$1"],
        [/\/v\/ab(\d+)_(\d+)/,"/v/?ab=$1&part=$2"],
        [/\/v\/ac(\d+)/,"/v/?ac=$1"],
        [/\/v\/ac(\d+)_(\d+)/,"/v/?ac=$1&part=$2"],

        [/\/[av]\/list(\d+)\/.*/,"/list/?channel=$1"],
        [/\/sp\/cw2016(.*)/,"/newyear2016$1"],
        [/\/sp\/acdc2016/,"/sp/acdc2016"],
        [/\/sp\/2016chuanpuwang\//,"/2016chuanpuwang/"],
        [/\/sp\/2017chunwanyure/,"/newyear2017"],

        [/\/app\/download\//,"/app/download/"]
    ];

    if(isAndroid || isIOS){
        if(location.href == "http://www.acfun.cn/"){
            location = "http://m.acfun.cn/";
        }else {
            for (var k = 0; k < routes.length; k++) {
                if (localHref.match(routes[k][0])) {
                    localHref = localHref.replace(new RegExp(location.origin), "http://m.acfun.cn")
                    mUrl = localHref.replace(routes[k][0], routes[k][1]);
                    location = mUrl;
                    break;
                }
            }
        }
    }
})()