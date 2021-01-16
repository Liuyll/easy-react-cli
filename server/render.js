import React from 'react'
import { App } from '../src/app.tsx'
import { StaticRouter } from 'react-router'

function render(ctx) {
    return (
        <StaticRouter location={ctx.url}>
            <App />
        </StaticRouter>
    )
}

export {
    render,
}