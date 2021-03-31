const merge = require('webpack-merge')
const common = require('./webpack.base.config')
const UglifyPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')

const PRODUCTION_CONFIG = {
    plugins: [
        new webpack.NamedChunksPlugin()
    ]
}

module.exports = merge(common('production'), PRODUCTION_CONFIG)