const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const Static = require('koa-static')
import ReactDomServer from 'react-dom/server'
import { render } from './render'
import { serverDispatch, cloneState } from '../src/store/state'
const { getComponent } = require('../src/router')
import fs from 'fs'
import configs from '../config'
import { generateHtmlFromElement, generateHtmlStreamFromElement } from './utils'

const router = new Router()
router.get('/api/goods', (ctx) => {
    ctx.body = JSON.stringify([
        { name: 'qwe' },
        { name: 'zxc' },
        { name: 'sfd' }
    ])
})

router.get('/(.*)', async (ctx, next) => {
    let {
        injectScripts,
        injectCss,
        layout,
        devPort,
        mode
    } = configs

    let prefix 
    prefix = mode === 'dev' ? `http://localhost:${devPort}/` : '/'
    const isStream = false
    injectScripts = injectScripts.map(script => prefix + script)
    injectCss = injectCss.map(css => prefix + css)

    let serverState = cloneState()
    let renderComponent = getComponent(ctx.url)
    while(renderComponent.redirect) {
        renderComponent = getComponent(renderComponent.redirect)
    }
    // browser handle router
    // if(renderComponent.redirect) {
    //     return ctx.redirect(renderComponent.redirect)
    // }

    renderComponent = renderComponent.component
    if(renderComponent && renderComponent.getInitialData) {
        await renderComponent.getInitialData(serverState, serverDispatch)
    } else serverState = null
    const context = {}
    const app = render({ ctx, state: serverState, context })
    let html 

    if(ctx.query && ctx.query.csr) {
        html = fs.readFileSync(path.resolve(__dirname, '../build/client/index.html')).toString()
    }
    else {
        if(layout) {
            const inlineScript = `window.__INITIAL_STATE__ = ${JSON.stringify(serverState)}`
            const props = { app, css: injectCss, scripts: injectScripts, inlineScript }
            const el = renderComponent.customLayout ? renderComponent.customLayout(props) : layout(props)
            if(isStream) {
                const stream = generateHtmlStreamFromElement(el)
                ctx.body = stream
                ctx.set('Content-Type', 'text/html')
                next()
            } else {
                html = generateHtmlFromElement(el)
            }
        } else {
            const injectStateScript = serverState ? `<script>window.__INITIAL_STATE__ = ${JSON.stringify(serverState)}</script>` : ''
            const domStr = ReactDomServer.renderToString(app)
            html = 
            `
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                    </head>
                    <link href="http://localhost:9000/index.css" rel="stylesheet">
                    <body>
                        <div id="app">${domStr}</div>
                    </body>
                    ${injectStateScript}
                    <script src='http://localhost:9000/runtime~index.file.js'></script>
                    <script src='http://localhost:9000/vendor.chunk.js'></script>
                    <script src='http://localhost:9000/index.chunk.js'></script>
                </html>
            `
        }
    }
    if(!isStream) {
        ctx.body = html
        next()
    }
})

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

