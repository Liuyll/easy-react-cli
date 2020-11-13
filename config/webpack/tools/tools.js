const glob = require('glob')
const path = require('path')

const pagesPrefix = '../../../pages'
function judgeMode(mode,dev,prod){
    return mode === 'production' ? prod : dev
}

function getEntries() {
    const entries = {}
    const src = path.join(path.resolve(__dirname),`${pagesPrefix}/**/index.*(jsx|tsx|js|ts)`)

    glob.sync(src).forEach(path => {
        const name = path.match(/pages\/(.*)\//)[1]
        entries[name] = path
    })

    return entries
}

function generateHTMLPluginTemplate(name,chunk) {
    const templateSrc = path.join(path.resolve(__dirname,`${pagesPrefix}/${name}/index.html`))
    return {
        template: templateSrc,
        filename: `${name}.html`,
        inject: true,
        chunks: ['commons','vendors',`runtime~${name}`,'asyncComponent',chunk]
    }
}

function generateHTMLPlugin(plugin) {
    const entries = getEntries()

    const plugins = Object.keys(entries).map(name => {
        return new plugin(
            generateHTMLPluginTemplate(
                name,
                name
            )
        )
    })

    return plugins
}
module.exports = {
    judgeMode,
    getEntries,
    generateHTMLPluginTemplate,
    generateHTMLPlugin
}