///<reference types="webpack-env" />

import * as React from 'react'
import './app.less'
import Home from '@Components/Home'
import Shop from '@Components/Shop'
import { Route, Link } from 'react-router-dom'
import { state } from './store/store'
import { Provider } from './store/context' 

if(module.hot){
    /* 该dependency还需要研究
      [参考](https://github.com/Jocs/jocs.github.io/issues/15)
      hmr只做非jsx的模块更新,也就是只做js逻辑业务的更新
      eg:accept('/hello.js',() => {
          test.innerHTML = hello()
      })
    */
    module.hot.accept('./')
}

const App:React.SFC<any> = function(){
    return (
        <Provider store={{ store: state }}>
            <Link to="/shop">shop</Link>
            <Route path="/" component={Home} exact={true}></Route>
            <Route path="/shop" component={Shop} exact={true}></Route>
        </Provider>
    )
}

export { App }