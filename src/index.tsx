import * as React from 'react'
import * as ReactDom from 'react-dom'
import { App } from './app'
import { BrowserRouter as Router } from 'react-router-dom'
import { isCSR } from './utils'

declare module window {
    var __INITIAL_STATE__
}

let initState 
if(typeof window !== 'undefined' && window.__INITIAL_STATE__) {
    initState = window.__INITIAL_STATE__
}

const ClientApp = () => {
    return (
        <Router>
            <App state={initState}/>
        </Router>
    )
}

if(isCSR()) {
    ReactDom.render(<ClientApp/>,document.getElementById('app'))
} else {
    // compat react17
    const renderMethod = module.hot ? ReactDom.render : ReactDom.hydrate
    renderMethod(<ClientApp/>,document.getElementById('app'))
}