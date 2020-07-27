const resolveApp = require('./path').resolveApp
const common = require('./webpack.config')
const merge = require('webpack-merge')
const mocktools = require('./mocktool')
const HotModuleReplacementPlugin = require('webpack').HotModuleReplacementPlugin

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
        contentBase: resolveApp('../../build'),
        port: 9000,
        compress: false,
        hot: true,
        inline: true,
        before: (app) => mocktools(app)
    },
    plugins: [
        new HotModuleReplacementPlugin()
    ]
})
