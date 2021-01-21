/*eslint no-console: 0*/

const { spawn } = require('child_process')
const process = require('process')
const { buildOptions } = require('./ssrConfig/config')
const { debug, useParallel } = buildOptions

let clientDev
let clientResolve
let buildServer

if(!useParallel) {
    clientDev = spawn('npm', ['run', 'dev'], { shell: true })
    clientDev.stdout.on('data', (data) => {
        data = data.toString()
        debug && console.log(data)
        // flag: Compiled with
        if(data.includes('Compiled successfully.') || data.includes('Compiled with warnings.')) {
            clientResolve()
        }
    })
    
    new Promise(resolve => {
        clientResolve = resolve
    }).then(_ => {
        buildServer = spawn('npm', ['run', 'build:server:dev'], { shell: true })
        buildServer.stdout.on('data', (data) => {
            debug && console.log(data.toString())
        })
        buildServer.stderr.on('data', (err) => {
            debug && console.error(err.toString())
        })
    })
}
else {
    clientDev = spawn('npm', ['run', 'dev'], { shell: true })
    clientDev.stdout.on('data', (data) => {
        debug && console.log(data.toString())
        // flag: Compiled with
    })
    buildServer = spawn('npm', ['run', 'build:server:dev'], { shell: true })
    buildServer.stdout.on('data', (data) => {
        debug && console.log(data.toString())
    })
    buildServer.stderr.on('data', (err) => {
        debug && console.error(err.toString())
    })
}

process.on('SIGINT', () => {
    // linux/mac effect
    clientDev && clientDev.kill('SIGINT')
    buildServer && buildServer.kill('SIGINT')
})