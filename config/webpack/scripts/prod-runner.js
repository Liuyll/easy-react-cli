const webpack = require('webpack')
const clientConfig = require('../webpack.prod.client.config')
const serverConfig = require('../webpack.server.config')
const chalk = require('chalk')
const Log = require('../../../log')
const log = Log.log

// prod: only pack bundle
function startClient() {
    return new Promise(resolve => {
        webpack(clientConfig, resolve)
    })
}

function startServer() {
    let init = true
    return new Promise(resolve => {
        const compilerServer = webpack(serverConfig)
        compilerServer.hooks.done.tap('done', () => {
            resolve()
        })

        // TODO: watch只执行一次
        compilerServer.watch({
            aggregateTimeout: 200,
            poll: 1000,
            // src由dev-server监控
            ignored: [/src/]
        }, (err, _) => {
            if(err) {
                console.error(err)
            } 
            !init ? log(chalk.green.bold('server reload success!\r\n')) : init = false
        })
    })
}

Promise.all(
    [startClient(), startServer()]
).then(() => {
    log(chalk.green.bold(Log.startStr))
})