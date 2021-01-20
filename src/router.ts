import { matchPath } from 'react-router-dom'

import Home from '@Components/Home'
import Shop from '@Components/Shop'
import PageNotFound from '@Components/404'

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
    },
    {
        path: '/404',
        component: PageNotFound,
        exact: true
    },
    {
        path: '*',
        redirect: '/404',
        component: null
    }
]

function getComponent(path) {
    const route = routes.find(route => matchPath(path, route))
    return route
}

export {
    routes,
    getComponent
}