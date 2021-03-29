const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const Static = require('koa-static')
const { handle } = require('../build/server/server.bundle')

const router = new Router()
router.get('/api/goods', (ctx) => {
    ctx.set('content-type', 'application/json')
    ctx.body = JSON.stringify([
        { name: 'qwe' },
        { name: 'zxc' },
        { name: 'sfd' }
    ])
})

router.get('/hello', ctx => {
    ctx.body = 'hello'
})
router.get('/(.*)', handle)

const app = new Koa()
// static
app.use(Static(
    path.resolve(__dirname, '../public')
))
// server hmr
app.use(Static(
    path.resolve(__dirname, '../build/client'),
    {
        // avoid conflict case: localhost:8080/
        index: 'no_index.html'
    }
))

app.on('error', (err,ctx) => {
    if(err.code === 'ECONNRESET' && ctx.url.includes('vendor.chunk.js')) {
        // console.log(err)
        // 暂时没法解决复用链接的问题
        /**
         * econnreset出现的原因是server复用了已经被客户端发fin的链接，客户端发reset后导致报错
         * 定位到的原因是koa-static上的静态资源
         */
    }
    else console.error(err)
})

app.use(router.routes())
app.listen(8080)

