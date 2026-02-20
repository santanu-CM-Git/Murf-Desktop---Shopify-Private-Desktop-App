const path = require("path");
const webpack = require("webpack");
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./static/frontend"),
    filename: "[name].js",
  },
  devtool: "eval-cheap-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,   // This rule applies to all CSS files
        use: [
          'style-loader',   // Injects styles into the DOM
          'css-loader',     // Resolves CSS imports and URLs
          'postcss-loader', // Uses PostCSS to process CSS (including Tailwind)
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[hash].[ext]", // Customize the name of the output file
              outputPath: "assets/images",  // Directory where images will be stored
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize:  process.env.NODE_ENV === 'production',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Define the alias `@` to point to the `src` directory
    },
    extensions: ['.js', '.jsx', '.json', '.css', '.png', '.svg'], // Include file extensions for JS, JSX, JSON, and CSS
  },
  plugins: [
    new Dotenv(),
    new webpack.DefinePlugin({
      // "process.env": {
      //   // This has effect on the react lib size
      //   NODE_ENV: JSON.stringify("production"),
      // },
    }),
  ],
};