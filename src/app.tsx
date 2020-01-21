///<reference types="webpack-env" />

import * as React from 'react'
import Test from './test.jsx'

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
        <div>
            Welcome to Easy-React
            <div>
                <Test></Test>
            </div>
        </div>
    )
}

export { App }