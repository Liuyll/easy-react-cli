const path = require('path')
const devServer = require('webpack-dev-server')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const resolveApp = require('./path').resolveApp

module.exports = {
    entry: path.resolve(__dirname,'../../src/index.tsx'),
    output: {
        path: path.resolve(__dirname,'../../build'),
        filename: this.mode === 'production' ? '[name].[contenthash:8].file.js' : '[name].[hash:8].file.js',
        chunkFilename: this.mode === 'production' ? '[name].[chunkhash:8].chunk.js' : '[name].[hash:8].chunk.js'
    },
    module: {
        rules: [
            {
                test: /\.(tsx|ts)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env','@babel/preset-react'],
                            // 可开启装饰器,也可由ts开启
                            plugins: []
                        },
                        
                    },
                    'ts-loader'
                ]
            },
            {
                test: /\.less/,
                use: ['css-loader']
            },
            {
                test: /\.(js|jsx)$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env','@babel/preset-react'],
                        // 可开启装饰器,也可由ts开启
                        plugins: []
                    }, 
                }]
            }
        ],
        // exclude:path.resolve(__dirname,'../../node_modules')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname,'../../src/index.html'),
            inject: true,
            filename: 'index.html'
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: resolveApp('../../build')
        })
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                test: /\.(tsx|jsx|ts|js)$/,
                exclude: /node_modules/,
                include: /src/,
                cache: true,
            })
        ],
        // named way:runtime~${entryPoint}.js
        runtimeChunk: true,
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /node_modules/,
                    chunks: 'initial',
                    name: 'vendor',
                    priority: 10
                },
                react: {
                    test: /node_modules\/(react|react-dom)/,
                    chunks: 'all',
                    name: 'react',
                    priority: 20
                },
                default: {
                    test: '*',
                    name: 'default',
                    minChunks: 2,
                    priority: -20,
                    maxInitialRequests: 3,
                    reuseExistingChunk: true
                }
            }
        }
    },
    resolve: {
        alias: {
            '@Components': path.resolve(__dirname,'../../src/components')
        },
        extensions: ['.ts', '.tsx', '.js', 'jsx']
    },
    devServer: {
        port: '8080',
        contentBase: path.resolve(__dirname,'../../public')
    }
}
