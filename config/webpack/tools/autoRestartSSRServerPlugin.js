/*eslint no-console: 0*/

const path = require('path')
const { spawn } = require('child_process')

class AutoRestartSSRServerPlugin {
    ssrServer
    apply(compiles) {
        compiles.plugin('after-emit', (_,next) => {
            if(this.ssrServer) {
                this.restartSSRServer()
            } else {
                this.startSSRServer()
            }
            next()
        })
        
    }

    restartSSRServer() {
        this.killSSRServer()
        this.startSSRServer()
    }
    killSSRServer() {
        const pid = this.ssrServer.pid
        spawn('taskkill', ['/pid', pid, '/f', '/t'])
    }
    startSSRServer() {
        const server = spawn('node', [path.resolve(__dirname, '../../../server/server.js')], { shell: true })
        server.stdout.on('data', (data) => {
            console.log(data.toString())
        })
        server.stderr.on('data', (err) => {
            console.log(err.toString())
        })
        this.ssrServer = server
    }
}

module.exports = AutoRestartSSRServerPlugin