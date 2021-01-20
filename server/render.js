import React from 'react'
import ReactDomServer from 'react-dom/server'
import { App } from '../src/app.tsx'
import { StaticRouter } from 'react-router'
import configs from '../config'
import { getComponent } from '../src/router'
import { serverDispatch, cloneState } from '../src/store/state'
import { generateHtmlFromElement, generateHtmlStreamFromElement } from './utils'
import fs from 'fs'

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
}

export {
    render,
    handle,
    ReactDomServer
}