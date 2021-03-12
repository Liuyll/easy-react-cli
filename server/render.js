import React from 'react'
import ReactDomServer from 'react-dom/server'
import { App } from '../src/app.tsx'
import { StaticRouter } from 'react-router'
import configs from '../ssrConfig/config'
import { getComponent } from '../src/router'
import { serverDispatch, cloneState } from '../src/store/state'
import { generateHtmlFromElement, generateHtmlStreamFromElement } from './utils'
import fs from 'fs'
import path from 'path'

function render({ ctx, state, context }) {
    return (
        <StaticRouter location={ctx.url} context={context}>
            <App state={state}/>
        </StaticRouter>
    )
}

async function handle(ctx, next){
    let {
        injectScripts,
        injectCss,
        devPort,
        mode,
        useLayout,
        useStreamResponse
    } = configs

    let prefix = mode === 'dev' ? `http://localhost:${devPort}/` : '/'
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
        ctx.set('Connection', 'Close')
        const indexPath = mode === 'dev' ? '../build/client/index.html' : '../build/client/index-produce.html'
        ctx.set('Content-Type', 'text/html; charset=utf-8')
        html = fs.createReadStream(path.resolve(__dirname, indexPath))
    }
    else {
        if(useLayout) {
            const layout = require('../ssrConfig/layout').default
            const inlineScript = `window.__INITIAL_STATE__ = ${JSON.stringify(serverState)}`
            const props = { app, css: injectCss, scripts: injectScripts, inlineScript }
            const el = renderComponent.customLayout ? renderComponent.customLayout(props) : layout(props)
            if(useStreamResponse) {
                const stream = generateHtmlStreamFromElement(el)
                ctx.body = stream
                ctx.set('Content-Type', 'text/html; charset=utf-8')
                next()
                return 
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
                    <link href="${prefix}index.css" rel="stylesheet">
                    <body>
                        <div id="app">${domStr}</div>
                    </body>
                    ${injectStateScript}
                    <script src='${prefix}runtime~index.file.js'></script>
                    <script src='${prefix}vendor.chunk.js'></script>
                    <script src='${prefix}index.chunk.js'></script>
                </html>
            `
        }
    }
    ctx.body = html
    next()
}

export {
    render,
    handle,
    ReactDomServer
}