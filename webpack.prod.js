const {merge} = require("webpack-merge");
const common = require("./webpack.common.js");
const TerserPlugin = require("terser-webpack-plugin");
const {PurgeCSSPlugin} = require("purgecss-webpack-plugin");
const glob = require("glob");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: {removeAll: true}, // Remove all comments
            },
          ],
        },
      }),
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: {
            unused: true,
            drop_debugger: true,
            drop_console: true,
            dead_code: true,
          },
          output: {
            comments: false,
          },
        },
      }),
    ],
    usedExports: true,
    sideEffects: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(
        `${path.join(__dirname, "src")}/**/*.{js,jsx,ts,tsx,html}`,
        {nodir: true}
      ),
    }),
  ],
});
