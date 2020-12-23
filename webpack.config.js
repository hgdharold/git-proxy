const path = require('path');
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'git-proxy.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [new CompressionPlugin()],
  optimization: {
    minimize: true
  },
  target: "node"
};
