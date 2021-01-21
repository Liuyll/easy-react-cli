/*eslint no-console: 0*/
const os = require('os')
const path = require('path')
const { spawn } = require('child_process')

class AutoRestartSSRServerPlugin {
    ssrServer
    apply(compiles) {
        compiles.hooks.afterEmit.tapAsync('AutoRestartSSRServerPlugin', (_,next) => {
            if(this.ssrServer) {
                this.restartSSRServer()
            } else {
                this.startSSRServer()
            }
            if(this.ssrServer) console.log('ssrServer is working...')
            next()
        })
    }

    restartSSRServer() {
        this.killSSRServer()
        this.startSSRServer()
    }
    killSSRServer() {
        const pid = this.ssrServer.pid
        // win can't kill child_process by signal
        if(os.platform() === 'win32') spawn('taskkill', ['/pid', pid, '/f', '/t'])
        else this.ssrServer.kill('SIGKILL')
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