import React from 'react'
import { App } from '../src/app.tsx'
import { StaticRouter } from 'react-router'

function render({ ctx, state, context }) {
    return (
        <StaticRouter location={ctx.url} context={context}>
            <App state={state}/>
        </StaticRouter>
    )
}

export {
    render,
}