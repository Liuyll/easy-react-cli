const { spawn } = require('child_process')
const process = require('process')

const clientDev = spawn('npm', ['run', 'dev'], { shell: true })
const buildServer = spawn('npm', ['run', 'build:server:dev'], { shell: true })

let clientResolve,
    serverResolve

clientDev.stdout.on('data', (data) => {
    data = data.toString()
    // flag: Compiled with
    if(data.includes('Compiled successfully.') || data.includes('Compiled with warnings.')) {
        clientResolve()
    }
})

buildServer.stdout.on('data', (data) => {
    data = data.toString()
    // flag: poll
    if(data.includes('server/server.js')) {
        serverResolve()
    }
})

process.on('SIGINT', () => {
    clientDev.kill('SIGINT')
    buildServer.kill('SIGINT')
})

Promise.all([
    new Promise(_resolve => clientResolve = _resolve),
    new Promise(_resolve => serverResolve = _resolve)
]).then(() => {
    console.log('start ssr server')
    spawn('node', ['build/server/server.bundle.js'], { shell: true })
})

