module.exports = {
  entry: './src/index.ts',
  output: {
    publicPath: 'bs-bpf-converter/',
    path: __dirname + '/dist',
    libraryTarget: 'umd',
    library: 'bs-bpf-converter',
    filename: 'bs-bpf-converter.js'
  },
  devtool: 'source-map',
  externals: {
    'core-js/fn/object/assign' : 'commonjs core-js/fn/object/assign',
    'core-js/fn/array/from' : 'commonjs core-js/fn/array/from',
    'core-js/es6/set' : 'commonjs core-js/es6/set',
    'core-js/es6/promise' : 'commonjs core-js/es6/promise',
    'redux': 'commonjs redux',
    '@brightsign/bs-content-manager': 'commonjs @brightsign/bs-content-manager',
    '@brightsign/bscore': 'commonjs @brightsign/bscore',
    '@brightsign/bsnconnector': 'commonjs @brightsign/bsnconnector',
    '@brightsign/fsconnector': 'commonjs @brightsign/fsconnector',
    '@brightsign/bsdatamodel': 'commonjs @brightsign/bsdatamodel',
    '@brightsign/bs-device-artifacts': 'commonjs @brightsign/bs-device-artifacts',
    '@brightsign/bs-playlist-dm': 'commonjs @brightsign/bs-playlist-dm',
    '@brightsign/bs-task-manager': 'commonjs @brightsign/bs-task-manager',
    '@brightsign/bacon-core': 'commonjs @brightsign/bacon-core',
    '@brightsign/bs-redux-enhancer': 'commonjs @brightsign/bs-redux-enhancer',
    '@brightsign/ba-uw-dm': 'commonjs @brightsign/ba-uw-dm'
  },
  // target: 'electron',
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".js", ".json"]
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ],
  }
}
