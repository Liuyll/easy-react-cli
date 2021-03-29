const webpack = require('webpack')
const clientConfig = require('../webpack.dev.config')
const serverConfig = require('../webpack.server.config')
const WebpackDevServer = require('webpack-dev-server')
const path = require('path')
const config = require('../../../ssrConfig/config')
const chalk = require('chalk')
const Log = require('../../../log')
const log = Log.log

const { devPort } = config

function startClient() {
    return new Promise(resolve => {
        const compilerClient = webpack(clientConfig)
        compilerClient.hooks.done.tap('done', () => {
            resolve()
        })
        compilerClient.hooks.watchRun.tap('mutationReady', ((init) => () => !init ? log(chalk.green.bold('client dev server restarting...')) : init = false)(true))
        compilerClient.hooks.done.tap('mutationNotify', ((init) => () => !init ? log(chalk.green.bold('client dev server restart success!\r\n')) : init = false)(true))

        const server = new WebpackDevServer(
            compilerClient,
            {
                historyApiFallback: {
                    rewrites: [{
                        from: /.*/g,
                        to: '/'
                    }]
                },
                writeToDisk: true,
                contentBase: [path.resolve(__dirname, '../../../public'), path.resolve(__dirname, '../../../build/client')],
                port: devPort,
                compress: false,
                quiet: true,
                // hmr start
                hot: true,
                // inline: true,
                open: false
            }
        )
      
        server.listen(9000)
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