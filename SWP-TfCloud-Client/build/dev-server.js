require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}
var chalk = require('chalk')

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

var port = process.env.PORT || config.dev.port
var autoOpenBrowser = !!config.dev.autoOpenBrowser
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

app.use(require('connect-history-api-fallback')())

app.use(devMiddleware)

app.use(hotMiddleware)

var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

//本地调试打开的页面uri
var uri = 'http://localhost:' + port+'/pages/cloud.html'

devMiddleware.waitUntilValid(function () {
    //chalk.red('')
  console.info( chalk.yellow('> 构建完成，已自动在浏览器打开页面，如未自动打开，请手工复制下面的链接，复制到浏览器里打开。') )
  console.info( chalk.green('> Listening at ' + uri + '\n') )
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
})

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.info(chalk.green("\n > 正在构建初始化中，构建完成后，将自动在浏览器打开本地调试页面"));
  // when env is testing, don't need open it
})
