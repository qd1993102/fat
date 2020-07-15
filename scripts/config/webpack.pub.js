const path = require('path');
const CWD = process.cwd();
const baseConfig = require('./webpack.base');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const config = Object.assign({}, baseConfig, {
  entry: {
    'index': path.join(CWD, './index.ts')
  }, // string | object | array
  output: {
    path: path.resolve(CWD, "lib"), // string
    filename: '[name].umd.js',
    libraryTarget: 'umd'
  },
  mode: "production", // "production" | "development" | "none"
});
module.exports = config;