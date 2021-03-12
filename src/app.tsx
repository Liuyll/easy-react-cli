///<reference types="webpack-env" />

import * as React from 'react'
import './app.less'
import Home from '@Components/Home'
import Shop from '@Components/Shop'
import PageNotFound from '@Components/404'
import { Route, Link, Redirect, Switch } from 'react-router-dom'
import { Provider } from './store/context' 
import { routes } from './router'
// import routerConfig from './router'

if(module.hot){
    /* 该dependency还需要研究
      [参考](https://github.com/Jocs/jocs.github.io/issues/15)
      hmr只做非jsx的模块更新,也就是只做js逻辑业务的更新
      eg:accept('/hello.js',() => {
          test.innerHTML = hello()
      })
    */
    module.hot.accept(['./', './components/Shop.tsx'])
}

const App:React.SFC<any> = function(props){
    const { state } = props
    return (
        <Provider store={state}>
            <Link to="/shop">shop</Link>
            <Switch>
                {routes.map(router => {
                    const { path, component, exact, redirect } = router
                    return (
                        <Route path={path} component={component} exact={exact} key={router.path}>
                            {redirect ? <Redirect to={redirect}/> : null}
                        </Route>
                    )
                })}
            </Switch>
        </Provider>
    )
}

export { App }