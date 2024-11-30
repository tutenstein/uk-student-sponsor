const path = require('path')
const JavaScriptObfuscator = require('webpack-obfuscator');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const JsonMinimizerPlugin = require("json-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        main: "./src/js/script.js",
        calculator: "./src/js/calculator.js"    },
    output: {
        path: path.resolve(__dirname, "public/dist"),
        filename: "[name].bundle.js" // Her entry point için ayrı bundle
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {}
                    }
                ]
            },
            {
                test: /\.json$/i,
                type: "asset/resource",
            }
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new JsonMinimizerPlugin(),
        ],
    },
    plugins: [
        new JavaScriptObfuscator({
            rotateStringArray: true
        }),
        new MiniCssExtractPlugin({
            filename: "output.css",
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src", "Student_Sponsor.json"),
                    to: path.resolve(__dirname, "public/dist") // Hedef klasör
                },
            ],
        }),
    ],
};