var webpack=require('webpack');
var arr=process.argv[2];
var flag=true;
var plugins=[];
var filename='mvvm.js';
if(arr){
    flag=arr.split('=')[1];
    if(flag){
        plugins.push(new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }));
        filename='mvvm.min.js';
    }
}

module.exports = {
    entry: './src/init.js',
    output: {
        path: 'dist',
        filename: filename
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query:{
                    presets: ["es2015"]
                }

            }
        ]
    },
    plugins:plugins
};

