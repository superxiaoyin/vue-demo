const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry:{
		'lib':[
			'./src/lib/common/base.js',
			'./src/lib/common/extend.js',
			'./src/lib/base64.js'
		]
	},
	output:{
		path:path.resolve(__dirname,'dist/dll'),
		filename:'[name].js',
		library:'[name]'
	},
	externals:[{
		'vue':'Vue',
		'vuex':'Vuex'
	}],
	module:{
		rules:[{
			test:/\.vue$/,
			use:[{
				loader:'vue-loader'
			}]
		},{
			test:/\.js$/,
			exclude:/node_modules/,
			use:['babel-loader']
		}]
	},
	plugins:[
        new webpack.DllPlugin({
            path:'./build/dist/manifest.json',
            name:'[name]'
        }),
        /*
        new CopyWebpackPlugin([{
            from:path.resolve(__dirname,'./dist/dll'),
            to:path.resolve(__dirname,'../../YQT-Web-New/WebRoot/home')
        }]),
        */
	]
};
