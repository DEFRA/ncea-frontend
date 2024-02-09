const path = require('path');

module.exports = {
  mode: 'production',
  entry: './assets/scripts/allScripts.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../src/public'),
  },
  stats: {
    warnings: true,
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            comments: false,
            presets: [['@babel/preset-env']],
          },
        },
      },
    ],
  },
};
