// Based on https://github.com/fable-compiler/webpack-config-template

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

let plugins = [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: resolve('./public/index.html')
  }),
]

const devServer = {
    static: {
        directory: resolve('./public'),
        publicPath: '/'
    },
    host: '0.0.0.0',
    port: 8080,
    proxy: {
        // Redirect requests that start with /api/ to the server on port 8085
        '/api/**': {
            target: 'http://localhost:8085',
            changeOrigin: true
        }
    },
    hot: true,
    historyApiFallback: true
};

module.exports = function(env, arg) {
  const mode = arg.mode ?? 'development';
  const isProduction = mode === 'production';

  console.log(`Bundling Client for ${mode} ...`);

  if (isProduction) {
    plugins = plugins.concat([
      new CopyWebpackPlugin({
        patterns: [{
          from: resolve('./public')
        }]
      })
    ])
  }

  return {
    entry: { app: resolve('./src/App.fs.js') },
    output: {
      path: resolve('./deploy/public'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
    },
    resolve: { symlinks: false }, // See https://github.com/fable-compiler/Fable/issues/1490
    mode: mode,
    plugins: plugins,
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    optimization: {
      runtimeChunk: "single",
      moduleIds: 'deterministic',
      splitChunks: {
          chunks: 'all'
      }
    },
    devServer: devServer
  };
}

function resolve(filePath) {
  return path.isAbsolute(filePath) ? filePath : path.join(__dirname, filePath);
}
