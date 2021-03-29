const common = require('./webpack.base.config')
const merge = require('webpack-merge')
const config = require('../../ssrConfig/config')

const devPort = config.devPort

module.exports = merge(common,{
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [],
    output: {
        publicPath: `http://localhost:${devPort}`,
    }
})
