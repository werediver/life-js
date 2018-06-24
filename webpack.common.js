const path = require("path");

module.exports = {
  entry: "./src/Life.ts",
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist")
  }
};
