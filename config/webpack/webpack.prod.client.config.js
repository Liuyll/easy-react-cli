const common = require('./webpack.base.config')
const merge = require('webpack-merge')
const config = require('../../ssrConfig/config')

const { production: { urlPrefix } } = config

module.exports = merge(common('production'), {
    devtool: 'none',
    plugins: [],
    output: {
        publicPath: urlPrefix,
    }
})
