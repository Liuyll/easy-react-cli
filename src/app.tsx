///<reference types="webpack-env" />

import * as React from 'react'
import './app.less'

if(module.hot){
    module.hot.accept('./')
}

const App:React.SFC<any> = function(){
    return (
        <div className="wrap">
            Welcome to Easy-React
            <div className="content">
                <img src='./test.jpg' />
            </div>
        </div>
    )
}

export { App }