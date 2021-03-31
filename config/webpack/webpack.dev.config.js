const common = require('./webpack.base.config')
const merge = require('webpack-merge')
const mocktools = require('./tools/mocktool')
const path = require('path')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

module.exports = merge(common('development'),{
    devtool: 'inline-source-map',
    devServer: {
        historyApiFallback: {
            rewrites: [{
                from: /.*/g,
                to: '/'
            }]
        },
        contentBase: path.resolve(__dirname, '../../public'),
        port: 9000,
        compress: false,
        // hmr start
        hot: true,
        inline: true,
        before: (app) => mocktools(app)
    },
    plugins: [
        new HardSourceWebpackPlugin()
    ]
})
