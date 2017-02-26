const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const path = require('path');

const createConfig = (options) => {

    const name = options.name;

    return {
        entry: Object.assign({
            app: './src/app/app.js'
        }),
        output: {
            path: path.resolve(__dirname, `dist/${name}`),
            filename: '[name].js'
        },
        module: {
            rules: [
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    loader: 'import-glob'
                },
                {
                    test: /\.scss$/,
                    use: [
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                includePaths: [path.resolve(`src/${name}`)]
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                chunks: ['app', 'style'],
                inject: 'head',
                template: './src/index.html'
            }),
            new ScriptExtHtmlWebpackPlugin({
                defaultAttribute: 'defer'
            })
        ]
    };
};

module.exports = ['a', 'b'].map((name) => createConfig({name: name}));
