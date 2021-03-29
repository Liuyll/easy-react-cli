const merge = require('webpack-merge')
const common = require('./webpack.base.config')
const UglifyPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')

const config = require('../../ssrConfig/config')
const { production: { urlPrefix } } = config
const productConfig = {
    mode: 'production',
    plugins: [
        // new UglifyPlugin(),
        new webpack.NamedChunksPlugin()
    ],
    output: {
        publicPath: urlPrefix
    }
}

module.exports = merge(common('production'), productConfig)