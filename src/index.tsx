import * as React from 'react'
import * as ReactDom from 'react-dom'
import { App } from './app'
import { browserHistory } from 'react-router'
import { BrowserRouter as Router } from 'react-router-dom'

const ClientApp = () => {
    return (
        <Router history={browserHistory}>
            <App/>
        </Router>
    )
}
// compat react17

const params = new URLSearchParams(location.search)
if(params.get('csr')) ReactDom.render(<ClientApp/>,document.getElementById('app'))
else ReactDom.hydrate(<ClientApp/>,document.getElementById('app'))