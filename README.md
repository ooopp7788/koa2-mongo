
application created by [Koa2](http://www.koa.com)

## install dependencies

```
npm install
```

## build static resource

```
gulp build
```

## start server

```
npm start
```

## deploy with pm2

use pm2 to deploy app on production envrioment.

## version URL
/common/config/env/


```
pm2 startOrGracefulReload pm2.json
```