const glob = require('glob')
const path = require('path')

function judgeMode(mode,dev,prod){
    mode === 'production' ? prod : dev
}

function getEntries() {
    const entries = {}
    const src = path.join(path.resolve(__dirname),'../../pages/**/index.*(jsx|tsx|js|ts)')

    glob.sync(src).forEach(path => {
        const name = path.match(/pages\/(.*)\//)[1]
        entries[name] = path
    })
    return entries
}

getEntries()
module.exports = {
    judgeMode,
    getEntries
}