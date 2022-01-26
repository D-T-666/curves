const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  externals: {
    p5: 'p5'
  },
  optimization: {
    chunkIds: "total-size",
    concatenateModules: true,
    innerGraph: false,
    mangleExports: "size",
    minimize: false,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        include: path.resolve(__dirname, 'src'),
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: [
      '.js', '.ts'
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
  },

  devServer: {
    static: {
      directory: path.join(__dirname, 'build'),
    },
    compress: true,
    port: 5500,
  },
};