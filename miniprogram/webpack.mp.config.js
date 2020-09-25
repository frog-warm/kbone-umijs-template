const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MpPlugin = require('mp-webpack-plugin');
const isOptimize = false; // 是否压缩业务代码，开发者工具可能无法完美支持业务代码使用到的 es 特性，建议自己做代码压缩

module.exports = {
  mode: 'production',
  entry: {
    home: path.resolve(__dirname, '../src/pages/home/main.mp.tsx'),
    service: path.resolve(__dirname, '../src/pages/service/main.mp.tsx'),
    my: path.resolve(__dirname, '../src/pages/my/main.mp.tsx'),
  },
  output: {
    path: path.resolve(__dirname, '../build/mp/common'), // 放到小程序代码目录中的 common 目录下
    filename: '[name].js', // 必需字段，不能修改
    library: 'createApp', // 必需字段，不能修改
    libraryExport: 'default', // 必需字段，不能修改
    libraryTarget: 'window', // 必需字段，不能修改
  },
  target: 'web', // 必需字段，不能修改
  optimization: {
    runtimeChunk: false, // 必需字段，不能修改
    splitChunks: {
      // 代码分隔配置，不建议修改
      chunks: 'all',
      minSize: 1000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 100,
      maxInitialRequests: 100,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },

    minimizer: isOptimize
      ? [
          // 压缩CSS
          new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.(css|wxss)$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
              preset: [
                'default',
                {
                  discardComments: {
                    removeAll: true,
                  },
                  minifySelectors: false, // 因为 wxss 编译器不支持 .some>:first-child 这样格式的代码，所以暂时禁掉这个
                },
              ],
            },
            canPrint: false,
          }),
          // 压缩 js
          new TerserPlugin({
            test: /\.js(\?.*)?$/i,
            parallel: true,
          }),
        ]
      : [],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      // {
      //     test: /\.[t|j]sx?$/,
      //     loader: 'babel-loader',
      //     exclude: /node_modules/,
      //     options: {
      //         plugins : [
      //             ["transform-react-jsx"],
      //             ["class"],
      //         ]
      //     }
      // },
      {
        test: /\.(ts|js)x?$/,
        use: [
          'thread-loader',
          {
            loader: 'babel-loader?cacheDirectory',
            options: {
              configFile: false, // 避免babel加载babel.config.js
              presets: [
                '@babel/preset-typescript', // 支持typescript
                '@babel/preset-react', // 支持react
              ],
              plugins: ['@babel/plugin-proposal-class-properties'],
            },
          },
          {
            loader: 'webpack-strip-block',
            options: {
              // 依据标记移除代码块
              start: 'strip-block--h5-only:begin',
              end: 'strip-block--h5-only:end',
            },
          },
        ],
        exclude: [
          /node_modules/,
          path.resolve(__dirname, '../src/.umi'),
          path.resolve(__dirname, '../src/.umi-production'),
        ],
        sideEffects: false, // 小程序开启tree shaking
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      },
    ],
  },
  resolve: {
    // extensions: ['*', '.js', '.vue', '.json']
    extensions: ['*', '.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve('src'),
      '@@': path.resolve('src/.umi'),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.isMiniprogram': process.env.isMiniprogram, // 注入环境变量，用于业务代码判断
    }),
    new MiniCssExtractPlugin({
      filename: '[name].wxss',
    }),
    new MpPlugin(require('./miniprogram.config')),
  ],
};
