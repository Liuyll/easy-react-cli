const common = require('./webpack.base.config')
const merge = require('webpack-merge')
const mocktools = require('./tools/mocktool')
const path = require('path')
const { devPort } = require('../../ssrConfig/config')

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
        writeToDisk: true,
        contentBase: [path.resolve(__dirname, '../../public'), path.resolve(__dirname, '../../build/client')],
        port: devPort,
        compress: false,
        // hmr start
        hot: true,
        // inline: true,
        before: (app) => mocktools(app),
        open: false
    },
    plugins: []
})
