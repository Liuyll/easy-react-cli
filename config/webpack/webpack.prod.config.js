const merge = require('webpack-merge')
const COMMON_CONFIG = require('./webpack.config')
const UglifyPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')

const PRODUCTION_CONFIG = {
    mode: 'development',
    plugins: [
        new UglifyPlugin(),
        new webpack.NamedChunksPlugin()
    ]
}

module.exports = merge(COMMON_CONFIG,PRODUCTION_CONFIG)