import { matchPath } from 'react-router-dom'

import Home from '@Components/Home'
import Shop from '@Components/Shop'

const routes =  [
    {
        path: '/',
        component: Home,
        exact: true
    },
    {
        path: '/shop',
        component: Shop,
        exact: true
    }
]

function getComponent(path) {
    const route = routes.find(route => matchPath(path, route))
    if(route) return route.component
}

export {
    routes,
    getComponent
}