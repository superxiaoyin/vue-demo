var path = require('path')

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

var alias = {
    'vue$': 'vue/dist/vue.esm.js',
    '@': resolve('src'),
    'src': path.resolve(__dirname, '../src'),
    'sslib': resolve('src/lib'),
    'ssextend': resolve('src/lib/common/extend.js'),
    'assets': path.resolve(__dirname, '../src/assets'),
    'resource': path.resolve(__dirname, '../src/resource'),
    // new alias ( components from svn link )
    'components': resolve('src/components/'),
    'biscomponents': resolve('src/components/bisComponents/'),
}

module.exports = alias;
