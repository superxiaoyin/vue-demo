var path = require('path')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

var alias = {
    'vue$': 'vue/dist/vue.esm.js',
    '@': resolve('src'),
    'src': path.resolve(__dirname, '../src'),
    'assets': path.resolve(__dirname, '../src/assets'),
    'components': path.resolve(__dirname, '../src/components'),
    'lib': path.resolve(__dirname, '../src/lib'),
    'sslib': path.resolve(__dirname, '../src/lib'),
    'style': path.resolve(__dirname, '../src/style'),
    'styles': path.resolve(__dirname, '../src/styles'),
    'resource': path.resolve(__dirname, '../src/resource'),
    'thirdparty': path.resolve(__dirname, '../src/thirdparty')
}

module.exports = alias;