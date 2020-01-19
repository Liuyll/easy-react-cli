const resolveApp = require('./path').resolveApp
const common = require('./webpack.config')
const merge = require('webpack-merge')

module.exports = merge(common,{
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: resolveApp('../../public'),
        port: 9000,
        compress: false,
        hot: true
    }
})
