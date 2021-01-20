import React from 'react'

export default {
    // prod
    mode: 'dev',
    devPort: 9000,
    // webpack chunk name
    injectScripts: [
        'runtime~index.file.js',
        'vendor.chunk.js',
        'index.chunk.js'
    ],
    // webpack css name
    injectCss: [
        'index.css'
    ],
    layout: (props) => {
        const { css, scripts, app, inlineScript } = props
        return (
            <html lang="en">
                <head>
                    <meta charSet="UTF-8"></meta>
                    <title>default layout</title>
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
}