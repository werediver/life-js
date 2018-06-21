const path = require('path');

module.exports = {
  mode: "development",
  entry: './src/Life.ts',
  output: {
    filename: 'life-bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  }
};
