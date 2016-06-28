import path from 'path';
import webpack from 'webpack';
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin';
import webpackIsmorphicToolsConfig  from './webpack-isomorphic-tools';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(webpackIsmorphicToolsConfig);

export default {
    devtool: 'inline-source-map',
    context: __dirname,
    entry: {
         'main': [
          'babel-polyfill',
          'webpack/hot/only-dev-server',
          './src/index'
        ]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]-[hash].js',
        chunkFilename: '[name]-[chunkhash].js',
        publicPath: '/static/'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('[name]-[chunkhash].css', {allChunks: true}),
        webpackIsomorphicToolsPlugin
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: [ 'babel' ],
                exclude: /node_modules/,
                include: __dirname
            },
            { 
                test: /\.scss$/, 
                loader: ExtractTextPlugin.extract("style-loader", "css-loader") 
                // loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap'
            },
            {
                test: webpackIsomorphicToolsPlugin.regular_expression('images'),
                loader: 'url-loader?limit=10240' 
            }
        ]
    }
}