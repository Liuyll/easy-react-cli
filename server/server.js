const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const Static = require('koa-static')
const { handle } = require('../build/server/server.bundle')

const router = new Router()
router.get('/api/goods', (ctx) => {
    ctx.body = JSON.stringify([
        { name: 'qwe' },
        { name: 'zxc' },
        { name: 'sfd' }
    ])
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

app.use(router.routes())
app.listen(8080)

