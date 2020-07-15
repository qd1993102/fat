const path = require('path');
const CWD = process.cwd();

module.exports = {
  // mode: "development", // "production" | "development" | "none"
  // Chosen mode tells webpack to use its built-in optimizations accordingly.
  entry: {
    // 'example': path.join(CWD, './examples/index.ts')
  }, // string | object | array
  // defaults to ./src
  // Here the application starts executing
  // and webpack starts bundling
  output: {
    // options related to how webpack emits results
    // path: path.resolve(CWD, "dist"), // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)
    filename: "[name].js", // string
    // the filename template for entry chunks
    // publicPath: "/assets/", // string
    // the url to the output directory resolved relative to the HTML page
    // library: "MyLibrary", // string,
    // the name of the exported library
    // libraryTarget: "umd", // universal module definition
    // the type of the exported library
    /* Advanced output configuration (click to show) */
    /* Expert output configuration (on own risk) */
  },
  module: {
    // configuration regarding modules
    rules: [
      // rules for modules (configure loaders, parser options, etc.)
      {
        test: /\.(jsx|ts)?$/,
        loader: 'ts-loader',
        options: {
          onlyCompileBundledFiles: true
        },
        // options for the loader
      },
      // { oneOf: [ / rules / ] },
      // only use one of these nested rules
      // { rules: [ / rules / ] },
      // use all of these nested rules (combine with conditions to be useful)
      // { resource: { and: [ / conditions / ] } },
      // matches only if all conditions are matched
      // { resource: { or: [ / conditions / ] } },
      // { resource: [ / conditions / ] },
      // matches if any condition is matched (default for arrays)
      // { resource: { not: / condition / } }
      // matches if the condition is not matched
    ],
    /* Advanced module configuration (click to show) */
  },
  resolve: {
    // options for resolving module requests
    // (does not apply to resolving to loaders)
    modules: [
      path.join(CWD, './node_modules')
    ],
    // directories where to look for modules
    extensions: [".ts", ".js", ".json", ".jsx", ".css"],
    // extensions that are used
    alias: {
      "src": path.join(CWD, './src'),
      "root": path.join(CWD, './'),
      // a list of module name aliases
      // "module": "new-module",
      // alias "module" -> "new-module" and "module/path/file" -> "new-module/path/file"
      // "only-module$": "new-module",
      // alias "only-module" -> "new-module", but not "only-module/path/file" -> "new-module/path/file"
      // "module": path.resolve(__dirname, "app/third/module.js"),
      // alias "module" -> "./app/third/module.js" and "module/file" results in error
      // modules aliases are imported relative to the current context
    },
    /* Alternative alias syntax (click to show) */
    /* Advanced resolve configuration (click to show) */
  },
  // performance: {
  //   hints: "warning", // enum
  //   maxAssetSize: 200000, // int (in bytes),
  //   maxEntrypointSize: 400000, // int (in bytes)
  //   assetFilter: function(assetFilename) {
  //     // Function predicate that provides asset filenames
  //     return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
  //   }
  // },
  devtool: "source-map", // enum
  // enhance debugging by adding meta info for the browser devtools
  // source-map most detailed at the expense of build speed.
  context: CWD, // string (absolute path!)
  // the home directory for webpack
  // the entry and module.rules.loader option
  //   is resolved relative to this directory
  target: "web", // enum
  // the environment in which the bundle should run
  // changes chunk loading behavior and available modules
  // externals: ["react", /^@angular/],
  // Don't follow/bundle these modules, but request them at runtime from the environment
  // stats: "errors-only",
  // lets you precisely control what bundle information gets displayed
  plugins: [
    // ...
  ],
}