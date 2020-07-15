const path = require('path');
const CWD = process.cwd();
const baseConfig = require('./webpack.base');
const config = Object.assign({}, baseConfig, {
  entry: {
    'example': path.join(CWD, './examples/index.ts')
  }, // string | object | array
  mode: "development", // "production" | "development" | "none"
  devServer: {
    port: 9000,
    contentBase: path.join(CWD), // boolean | string | array, static file location
    compress: true, // enable gzip compression
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
    noInfo: false, // only errors & warns on hot reload
    // ...
  },
});
module.exports = config;