/**
 * Created by Amirka on 18.04.2017.
 */

var path = require('path');

module.exports = {
    entry: './webpack/app.js',
    watch: true,
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'public/resources/js'),
        library: 'app'
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader"
            }, {
                loader: "sass-loader",
                options: {
                    includePaths: [ __dirname + "/assets/sass"]
                }
            }]
        }]
    }
};
