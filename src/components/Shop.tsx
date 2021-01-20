import * as React from 'react'
import { useContext } from 'react'
import axios from 'axios'
import { Context } from '../store/context'

function Shop(){
    const { store, dispatch } = useContext(Context)
    return (
        <div className="wrap">
            <p>shops:</p>
            {
                store.goods.map((good,index) => (
                    <div key={index}>{good.name}</div>
                ))
            }
            <button onClick={() => dispatch('asyncGetGoods')}>add one</button>
        </div>
    )
}

Shop.getInitialData = async (state, dispatch) => {
    const res = await axios('http://localhost:8080/api/goods')
    dispatch(state, 'setGoods', res.data)
}

// custom layout
Shop.customLayout = (props) => {
    const { css, scripts, app, inlineScript } = props
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8"></meta>
                <title>custom layout</title>
                {css && css.map(_css => <link rel="stylesheet" href={_css}></link>)}
            </head>
            <body>
                <div id="app">
                    {app}
                </div>
                <script dangerouslySetInnerHTML={{ __html: inlineScript }}></script>
                <div dangerouslySetInnerHTML={{ __html: scripts && scripts.map(script => {
                    return `<script src='${script}'></script>`
                }).join('') 
                }}/>
            </body>
        </html>
    )
}

export default Shop