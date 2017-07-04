"use strict";

const path = require("path");
const webpack = require("webpack");

module.exports = function (env) {

  var isDevMode = (env == "dev");

  var config = {
    context: path.resolve(__dirname, "src"),
    entry: "./index.js",
    output: {
      library: "spriteFX",
      libraryTarget: "umd",
      publicPath: "/test",
      path: path.resolve(__dirname, "dist"),
      filename: isDevMode ? "spriteFX.js" : "spriteFX.min.js",
      sourceMapFilename: isDevMode ? "spriteFX.js.map" : "spriteFX.min.js.map",
    },
    resolve: {
      extensions: [".js"],
      alias: {
        // "ui": path.resolve(__dirname, "src/ui/"),
        // "util": path.resolve(__dirname, "src/util/"),
        // "colorModels": path.resolve(__dirname, "src/colorModels/"),
        // "modules": path.resolve(__dirname, "src/modules/"),
      }
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              "babelrc": false,
              "presets": ["es2015", "stage-2"]
            }
          }
        }
      ]
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: [
          "spriteFX",
          "--------",
          "Github: github.com/jaames/spriteFX",
          "Author: James Daniel (github.com/jaames | rakujira.jp)",
          "Last updated: " + new Date().toDateString(),
        ].join("\n")
      }),
    ],
    devtool: "source-map",
    devServer: {
      port: process.env.PORT || 8080,
      host: "localhost",
      publicPath: "http://localhost:8080/test/",
      contentBase: path.join(__dirname, "./"),
      watchContentBase: true,
    }
  }

  if (!isDevMode) {
    config.plugins = config.plugins.concat([
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        mangle: {
          props: {
            // Mangle protected properties that start with _
            regex: /^_/
          }
        }
      })
    ]);
  }

  return config;
}
