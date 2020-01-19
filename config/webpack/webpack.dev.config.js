const resolveApp = require('./path').resolveApp

module.exports = {
    mode: 'development',
    devServer: {
        contentBase: resolveApp('../../public'),
        port: 9000,
        compress: false,
        hot: true
    }
}