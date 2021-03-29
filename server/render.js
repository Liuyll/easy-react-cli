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
        useStreamResponse,
        production: {
            chunkHash
        }
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
        // ctx.set('Keep-Alive', 'timeout=5')
        const indexPath = mode === 'dev' ? '../build/client/index.html' : '../build/client/index-produce.html'
        ctx.set('Content-Type', 'text/html; charset=utf-8')
        const stream = fs.createReadStream(path.resolve(__dirname, indexPath))
        html = stream
    }
    else {
        let layout 
        if(useLayout) {
            layout = require('../ssrConfig/layout').default
        } else {
            layout = require('../ssrConfig/default_layout').default
        }

        // 处理bundle hash
        if(mode === 'prod' && chunkHash) {
            const templateHtml = fs.readFileSync(path.resolve(__dirname, '../build/client/index-produce.html')).toString()
            const jsPattern = /<script type="text\/javascript" src="(.*?)"><\/script>/g
            const cssPattern = /<link href="(.*?)" rel="stylesheet">/g

            const replaceScripts = []
            const replaceCss = []

            const scripts = templateHtml.matchAll(jsPattern)
            for(let script of scripts) {
                replaceScripts.push(script[1])
            }

            const css = templateHtml.matchAll(cssPattern)
            for(let _css of css) {
                replaceCss.push(_css[1])
            }

            injectScripts = replaceScripts
            injectCss = replaceCss
        }

        const inlineScript = `window.__INITIAL_STATE__ = ${JSON.stringify(serverState)}`
        const props = { app, css: injectCss, scripts: injectScripts, inlineScript }
        const el = renderComponent.customLayout ? renderComponent.customLayout(props) : layout(props)
        if(useStreamResponse) {
            const stream = generateHtmlStreamFromElement(el)
            ctx.body = stream
            ctx.set('Content-Type', 'text/html; charset=utf-8')
            return next()
        } else {
            html = generateHtmlFromElement(el)
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