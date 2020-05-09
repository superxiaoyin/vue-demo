var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var glob = require('glob');
const alias = require("./alias");
var CopyWebpackPlugin = require('copy-webpack-plugin')

var entries =  utils.getMultiEntry('./src/'+config.moduleName+'/**/*.js'); // 获得入口js文件
var chunks = Object.keys(entries);
console.log('入口模块 chunks:'+ chunks)
var projectRoot = path.resolve(__dirname, '../')
const vuxLoader = require('vux-loader')
var vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

var webpackConfig = {
  entry:entries,
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: alias
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[ext]')
        }
      },
      
    ]
  },
  plugins: [
	/*
    // 提取公共模块
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors', // 公共模块的名称
      chunks: chunks,  // chunks是需要提取的模块
      minChunks: 4 || chunks.length //公共模块被使用的最小次数。比如配置为3，也就是同一个模块只有被3个以外的页面同时引用时才会被提取出来作为common chunks。

    }),*/
      // copy custom static assets
      new CopyWebpackPlugin([
          // {
          //   from: path.resolve(__dirname, '../static'),
          //   to: config.build.assetsSubDirectory,
          //   ignore: ['.*']
          // }
          {
              from: path.resolve(__dirname, './dist/dll'),
              to: path.resolve(__dirname, config.build.assetsRoot,'./static/js')
          },
          {
              from: path.resolve(__dirname, '../src/thirdparty'),
              to: path.resolve(__dirname, config.build.assetsRoot, './thirdparty')
          }, {
              from: path.resolve(__dirname, '../src/resource'),
              to: path.resolve(__dirname, config.build.assetsRoot, 'resource')
          },  {
              from: path.resolve(__dirname, '../src/config'),
              to: path.resolve(__dirname, config.build.assetsRoot, 'config')
          }
      ])
  ]
}



module.exports = vuxLoader.merge(webpackConfig, {
    options: {
    
  },	
  plugins: ['vux-ui', 'progress-bar', 'duplicate-style']
})
