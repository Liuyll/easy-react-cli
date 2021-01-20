/*eslint no-console: 0*/

const { spawn } = require('child_process')
const process = require('process')

const clientDev = spawn('npm', ['run', 'dev'], { shell: true })
const buildServer = spawn('npm', ['run', 'build:server:dev'], { shell: true })

let clientResolve,
    serverResolve

clientDev.stdout.on('data', (data) => {
    data = data.toString()
    // console.log(data)
    // flag: Compiled with
    if(data.includes('Compiled successfully.') || data.includes('Compiled with warnings.')) {
        clientResolve()
    }
})

buildServer.stdout.on('data', (data) => {
    data = data.toString()
    console.log(data)
    // flag: poll
    if(data.includes('server/server.js')) {
        serverResolve()
    }
})


clientDev.stderr.on('data', (err) => {
    console.log(err.toString())
})

buildServer.stderr.on('data', (err) => {
    // console.log('---------')
    console.log(err.toString())
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
    const server = spawn('node', ['build/server/server.bundle.js'], { shell: true })
    server.stdout.on('data', (data) => {
        console.log(data.toString())
    })
    server.stderr.on('data', (err) => {
        console.log(err.toString())
    })
})

