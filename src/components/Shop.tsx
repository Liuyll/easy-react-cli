import * as React from 'react'
import { useContext } from 'react'
import { Context } from '../store/context'
import { useFetch } from 'rexos'

function Shop(){
    const { store, dispatch } = useContext(Context)
    const timeout = 100
    return (
        <div className="wrap">
            <p>shops:</p>
            {
                store.goods.map((good,index) => (
                    <div key={index}>{good.name}</div>
                ))
            }
            <button onClick={() => dispatch('asyncGetGoods', { delay: timeout })}>add one(delay:{timeout}'s)</button>
        </div>
    )
}

Shop.getInitialData = async (state, dispatch) => {
    const res = await useFetch({ url: 'http://localhost:8080/api/goods' })
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