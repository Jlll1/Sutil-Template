// Based on https://github.com/fable-compiler/webpack-config-template

const CONFIG = {
  indexHtml: './src/Client/output/index.html',
  entryFile: './src/Client/output/App.js',
  publicDir: './src/Client/public',
  outputDir: './deploy/public',
  devServerPort: 8080,
  devServerProxy: {
    // Redirect requests that start with /api/ to the server on port 8085
    '/api/**': {
        target: 'http://localhost:8085',
        changeOrigin: true
    },
    // redirect websocket requests that start with /socket/ to the server on the port 8085
    '/socket/**': {
        target: 'http://localhost:8085',
        ws: true
    }
  },
}

const CONFIG_TEST = {
  indexHtml: './test/Client/output/index.html',
  entryFile: './test/Client/output/Client.Test.js',
  publicDir: './test/Client',
  outputDir: './test/Client',
  devServerPort: 8081,
  devServerProxy: undefined,
}

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = function(env, arg) {
  const mode = arg.mode ?? 'development';
  const isProduction = mode === 'production';

  const config = env.test ? CONFIG_TEST : CONFIG;

  console.log(`Bundling Client for ${mode} ...`);

  let plugins = [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolve(config.indexHtml)
    }),
  ]

  const devServer = {
    static: {
        directory: resolve(config.publicDir),
        publicPath: '/'
    },
    host: '0.0.0.0',
    port: config.devServerPort,
    proxy: config.devServerProxy,
    hot: true,
    historyApiFallback: true
  };


  if (isProduction) {
    plugins = plugins.concat([
      new CopyWebpackPlugin({
        patterns: [{
          from: resolve(config.publicDir)
        }]
      })
    ])
  }

  return {
    entry: { app: resolve(config.entryFile) },
    output: {
      path: resolve(config.outputDir),
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
