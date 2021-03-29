/* eslint-disable */

function log(s) {
    console.log(s)
}

const startStr = `
ssr staring...
server render: localhost:8080
client render: localhost:8080/?csr=true
`

module.exports = {
    startStr,
    log
}