import * as React from 'react'
import * as ReactDom from 'react-dom'
import { App } from './app'
import { BrowserRouter as Router } from 'react-router-dom'
import { isCSR } from './utils'
const ClientApp = () => {
    return (
        <Router>
            <App/>
        </Router>
    )
}
// compat react17

if(isCSR()) {
    ReactDom.render(<ClientApp/>,document.getElementById('app'))
} else {
    const renderMethod = module.hot ? ReactDom.render : ReactDom.hydrate
    renderMethod(<ClientApp/>,document.getElementById('app'))
}