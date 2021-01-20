const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const AnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const tools = require('./tools/tools')
const getEntries = tools.getEntries
const generateHTMLPlugin = tools.generateHTMLPlugin
const serverPath = '/'

module.exports = {
    entry: {
        ...getEntries()
    },
    output: {
        path: path.resolve(__dirname,'../../build'),
        filename: this.mode === 'production' ? '[name].[contenthash:8].file.js' : '[name].[hash:8].file.js',
        chunkFilename: this.mode === 'production' ? '[name].[chunkhash:8].chunk.js' : '[name].[hash:8].chunk.js',
        publicPath: tools.judgeMode(this.mode,'/',serverPath),
    },
    module: {
        rules: [
            {
                test: /\.(tsx|ts)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-typescript', '@babel/preset-env','@babel/preset-react'],
                            // 可开启装饰器,也可由ts开启
                            plugins: ['@babel/plugin-transform-runtime'],
                            exclude: /node_modules/
                        },
                    },
                ]
            },
            {
                test: /\.css/,
                use: [this.mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader','css-loader']
            },
            {
                test: /\.less/,
                use: [this.mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader','css-loader','less-loader']
            },
            {
                test: /\.(js|jsx)$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env','@babel/preset-react'],
                        // 可开启装饰器,也可由ts开启
                        plugins: ['@babel/plugin-transform-runtime'],
                        exclude: /node_modules/
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
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: path.resolve(__dirname, '../../build')
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        // new AnalyzerPlugin({
        //     analyzerPort: 8889
        // }),
        ...generateHTMLPlugin(HtmlWebpackPlugin)
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
            chunks: 'all',
            // minSize: 30000,
            minChunks: 2,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: {
                commons: {
                    test: module => {
                        return /[\\/]node_modules[\\/](react|react-dom|antd)/.test(module.context)
                    },
                    chunks: 'all',
                    name: 'commons',
                    priority: 20
                },
                vendors: {
                    test: /node_modules/,
                    chunks: 'all',
                    name: 'vendors',
                    priority: 10
                },
                asyncComponent: {
                    test: '*',
                    chunks: 'async',
                    name: 'async-component',
                    priority: 30
                }
            }
        }
    },
    // react cdn有问题，如果找到靠谱的自行开启
    // externals: {
    //     'react': 'React',
    //     'react-dom': 'ReactDom'
    // },
    resolve: {
        alias: {
            '@Components': path.resolve(__dirname,'../../src/components')
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    }
}
