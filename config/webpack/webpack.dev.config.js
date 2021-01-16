const resolvePath = require('./tools/path').resolvePath
const common = require('./webpack.base.config')
const merge = require('webpack-merge')
const mocktools = require('./tools/mocktool')
const path = require('path')

module.exports = merge(common,{
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        historyApiFallback: {
            rewrites: [{
                from: /.*/g,
                to: '/'
            }]
        },
        contentBase: resolvePath('../../public'),
        port: 9000,
        compress: false,
        // hmr start
        hot: true,
        inline: true,
        before: (app) => mocktools(app)
    },
    plugins: []
})
