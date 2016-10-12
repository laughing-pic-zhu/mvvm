module.exports = {
    entry: './src/init.js',
    output: {
        path: 'dist',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: 'src/*.js',
                loader: 'babel',
                include: '',
                presets: ["es2015"]
            }

        ]
    }
};