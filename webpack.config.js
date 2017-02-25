const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const path = require('path');

const abTestingList = [
    'a',
    'b'
];

let abTestingEntryConfig = {};
abTestingList.forEach((name) => abTestingEntryConfig[name] = `./src/${name}/style.js`);

const abTestingRuleList = abTestingList.map((name) => ({
    issuer: new RegExp(`${name}\\/style`),
    test: /\.scss$/,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
            'css-loader',
            {
                loader: 'sass-loader',
                options: {
                    data: `@import 'common';`,
                    includePaths: [path.resolve(`src/${name}`)]
                }
            }
        ]
    })
}));

module.exports = {
    entry: Object.assign({
        app: './src/app/app.js'
    }, abTestingEntryConfig),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]/bundle.js'
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'import-glob'
            },
            ...abTestingRuleList
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name]/style.css'),
        ...abTestingList.map((name) => new HtmlWebpackPlugin({
            chunks: ['app', name],
            inject: 'head',
            filename: `${name}.html`,
            template: './src/index.html'
        })),
        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: 'defer'
        })
    ]
};
