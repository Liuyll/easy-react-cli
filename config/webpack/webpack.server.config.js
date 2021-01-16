const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const resolvePath = require('./tools/path').resolvePath

module.exports = {
    mode: 'development',
    target: 'node',
    entry: {
        index: path.resolve(__dirname, '../../server/server')
    },
    output: {
        path: path.resolve(__dirname,'../../build/server'),
        filename: 'server.bundle.js',
        publicPath: '/'
        // libraryTarget: 'commonjs2'
    },
    node: {
        __dirname: true
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
                            // 可开启装饰器,也可由ts开启,
                            exclude: /node_modules/,
                            plugins: []
                        },
                        
                    },
                    'ts-loader'
                ]
            },
            {
                test: /\.(sass|less|css)$/,
                use: 'ignore-loader'
            },
            {
                test: /\.(js|jsx)$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env','@babel/preset-react'],
                        // 可开启装饰器,也可由ts开启
                        exclude: /node_modules/,
                        plugins: ["@babel/plugin-transform-runtime"]
                    }, 
                }]
            },
            {
                test: /\.(jpg|png)$/,
                use: [{
                    loader: 'url-loader'
                }],
                exclude: path.resolve(__dirname,'../../node_modules'),
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: resolvePath('../../build')
        })
    ],
    resolve: {
        alias: {
            '@Components': path.resolve(__dirname,'../../src/components')
        },
        extensions: ['.ts', '.tsx', '.js', 'jsx']
    }
}