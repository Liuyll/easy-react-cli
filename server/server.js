const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const Static = require('koa-static')
import ReactDomServer from 'react-dom/server'
import { render } from './render'
import { dispatch, state } from '../src/store/store'
const { getComponent } = require('../src/router')
import fs from 'fs'

const router = new Router()
router.get('/api/goods', (ctx) => {
    ctx.body = JSON.stringify([
        { name: 'qwe' },
        { name: 'zxc' },
        { name: 'sfd' }
    ])
})

router.get('/(.*)', async (ctx, next) => {
    const renderComponent = getComponent(ctx.url)
    if(renderComponent) {
        if(renderComponent.getInitialData) {
            await renderComponent.getInitialData(dispatch)
        }
    }
    const domStr = ReactDomServer.renderToString(render(ctx))
    let html 
    if(ctx.query && ctx.query.csr) {
        html = fs.readFileSync(path.resolve(__dirname, '../build/client/index.html')).toString()
    }
    else html = `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
            </head>
            <link href="/client/index.css" rel="stylesheet">
            <body>
                <div id="app">${domStr}</div>
            </body>
            <script>
                window.__INITIAL_STATE = ${JSON.stringify(state)}
            </script>
            <script src='/client/runtime~index.file.js'></script>
            <script src='/client/vendor.chunk.js'></script>
            <script src='/client/index.chunk.js'></script>
        </html>
    `
    ctx.body = html
    next()
})

const app = new Koa()
app.use(Static(
    path.resolve(__dirname, '../build')
))

app.use(router.routes())
app.listen(8080)