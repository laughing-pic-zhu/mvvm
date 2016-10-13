module.exports = {
    entry: './src/init.js',
    output: {
        path: 'dist',
        filename: 'bundle.js'
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
    }
};