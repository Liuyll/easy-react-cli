const os = require('os')
const path = require('path')
const { spawn } = require('child_process')
const log = require('../../../log').log
const chalk = require('chalk')
const nodemon = require('nodemon')

let init = true
let compilerNext
class AutoRestartSSRServerPlugin {
    ssrServer = null
    useProtectedMode = false
    shouldRestart = false

    constructor(useProtectedMode) {
        this.useProtectedMode = useProtectedMode
    }
    apply(compiles) {
        compiles.hooks.watchRun.tap('notifyReload', () => {
            if(init) init = false
            else log(chalk.blue.bold('server restarting. waiting...'))
        })
        compiles.hooks.afterEmit.tapAsync('AutoRestartSSRServerPlugin', (_,next) => {
            if(this.ssrServer) {
                this.restartSSRServer(next)
            } else {
                this.startSSRServer(next)
            }
            // next()
        })
    }

    restartSSRServer(next) {
        if(this.useProtectedMode) {
            this.shouldRestart = true
            this.killSSRServer()
            compilerNext = next
        } else {
            this.killSSRServer()
            this.startSSRServer(next)
        }
    }
    killSSRServer() {
        if(this.useProtectedMode) {
            nodemon.emit('quit')
        } else {
            const pid = this.ssrServer.pid
            // win can't kill child_process by signal
            if(os.platform() === 'win32') spawn('taskkill', ['/pid', pid, '/f', '/t'])
            else this.ssrServer.kill('SIGKILL')
        }
    }
    
    startSSRServer(next) {
        // node
        if(this.useProtectedMode) {
            this.startSSRServerProtected(next)
        } else {
            const server = spawn('node', [path.resolve(__dirname, '../../../server/server.js')], { shell: true })
            server.stdout.on('data', (data) => {
                log(data.toString())
            })
            server.stderr.on('data', (err) => {
                log(err.toString())
            })
            this.ssrServer = server
            log(chalk.blue.bold('ssrServer app is working...'))
            next()
        }
    }
    
    // nodemon
    startSSRServerProtected(next) {
        nodemon({ 
            script: path.resolve(__dirname, '../../../server/server.js'),
            watch: ["server/server.js"]
        })
            .on('start', () => {
                log(chalk.blue.bold('ssrServer app is working...'))
                next()
            })
            .on('restart', () => {
                log(chalk.blue.bold('ssrServer is restart...'))
                next()
            })
            .on('crash', () => {
                log(chalk.red.bold('ssrServer is crash...'))
            })
            .on('exit', () => {
                if(this.shouldRestart) {
                    this.shouldRestart = false
                    this.startSSRServerProtected(() => {
                        log(chalk.green.bold('restart success'))
                        if(compilerNext) {
                            compilerNext()
                            compilerNext = null
                        }
                    })
                }
            })
        this.ssrServer = true
    }
}

module.exports = AutoRestartSSRServerPlugin