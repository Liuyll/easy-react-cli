const merge = require('webpack-merge')
const COMMON_CONFIG = require('./webpack.base.config')
const UglifyPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')

const config = require('../../ssrConfig/config')
const { production: { urlPrefix } } = config
const PRODUCTION_CONFIG = {
    mode: 'production',
    plugins: [
        // new UglifyPlugin(),
        new webpack.NamedChunksPlugin()
    ],
    output: {
        publicPath: urlPrefix
    }
}

module.exports = merge(COMMON_CONFIG,PRODUCTION_CONFIG)