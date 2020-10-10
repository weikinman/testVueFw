var path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
var splitChunks = {
  chunks: 'all', // 三选一： "initial" | "all" | "async" (默认)
  minSize: 30000, // 最小尺寸，30K，development 下是10k，越大那么单个文件越大，chunk 数就会变少（针对于提取公共 chunk 的时候，不管再大也不会把动态加载的模块合并到初始化模块中）当这个值很大的时候就不会做公共部分的抽取了
  maxSize: 0, // 文件的最大尺寸，0为不限制，优先级：maxInitialRequest/maxAsyncRequests < maxSize < minSize
  minChunks: 1, // 默认1，被提取的一个模块至少需要在几个 chunk 中被引用，这个值越大，抽取出来的文件就越小
  maxAsyncRequests: 5, // 在做一次按需加载的时候最多有多少个异步请求，为 1 的时候就不会抽取公共 chunk 了
  maxInitialRequests: 3, // 针对一个 entry 做初始化模块分隔的时候的最大文件数，优先级高于 cacheGroup，所以为 1 的时候就不会抽取 initial common 了
  automaticNameDelimiter: '~', // 打包文件名分隔符
  name: true, // 拆分出来文件的名字，默认为 true，表示自动生成文件名，如果设置为固定的字符串那么所有的 chunk 都会被合并成一个
  cacheGroups: {
      lodashVendors: {
          test: /[\\/]node_modules[\\/]lodash[\\/]/, // 正则规则，如果符合就提取 chunk
          priority: -7 // 缓存组优先级，当一个模块可能属于多个 chunkGroup，这里是优先级
      },
      /* elementUiVendors: {
          test: /[\\/]node_modules[\\/]element-ui[\\/]/, // 正则规则，如果符合就提取 chunk
          priority: -8 // 缓存组优先级，当一个模块可能属于多个 chunkGroup，这里是优先级
      }, */
      vueVendors: {
          test: /[\\/]node_modules[\\/]vue[\\/]/, // 正则规则，如果符合就提取 chunk
          priority: -9 // 缓存组优先级，当一个模块可能属于多个 chunkGroup，这里是优先级
      },
      vendors: {
          test: /[\\/]node_modules[\\/]/, // 正则规则，如果符合就提取 chunk
          priority: -10 // 缓存组优先级，当一个模块可能属于多个 chunkGroup，这里是优先级
      },
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name(module) {
          // get the name. E.g. node_modules/packageName/not/this/part.js
          // or node_modules/packageName
          const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

          // npm package names are URL-safe, but some servers don't like @ symbols
            return `vendor.${packageName.replace('@', '')}`;
         // return `vendor.${packageName}`;
        },
      },
      default: {
          minChunks: 2,
          priority: -20, // 优先级
          reuseExistingChunk: true // 如果该chunk包含的modules都已经另一个被分割的chunk中存在，那么直接引用已存在的chunk，不会再重新产生一个
      }
  }
};

var terserPlugin = new TerserPlugin({
  // 使用 cache，加快二次构建速度
  cache: true,
  terserOptions: {
      comments: false,
      compress: {
          // 删除无用的代码
          unused: true,
          // 删掉 debugger
          drop_debugger: true, // eslint-disable-line
          // 移除 console
          drop_console: false, // eslint-disable-line
          // 移除无用的代码
          dead_code: true // eslint-disable-line
      }
  },
  parallel: true
});
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'boardware-vue-framework.js'
    },
    externals: {
      lodash: {
        commonjs: 'lodash',
        commonjs2: 'lodash',
        amd: 'lodash',
        root: '_'
      },
      axios: {
        commonjs: 'axios',
        commonjs2: 'axios',
        amd: 'axios',
        root: 'axios'
      }
    },
    plugins: [
        new CleanWebpackPlugin(),
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
          filename: '[name].css',
          chunkFilename: '[name]_[hash].css'/* ,
          options: {
              publicPath: './public/'
          } */
      })/* ,
      new BundleAnalyzerPlugin() */
  ],
    module: {
      rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                        presets: ['@babel/preset-env'],
                      //  plugins: ['@babel/transform-runtime']
                    }
                }
        }, 
          {
              test: /\.vue$/,
              loader: 'vue-loader'
          }, {
              test: /\.css$/,
              use: [MiniCssExtractPlugin.loader, 'css-loader']
          }, {
              test: /\.(ttf|woff|woff2|eot|svg)$/,
              use: [
                  {
                      loader: 'file-loader',
                      options: {
                          esModule: false
                      }
                  }
              ]
          }, {
              test: /\.(png|jpg|gif|jpeg)$/,
              use: [
                  {
                      loader: 'url-loader',
                      options: {
                          limit: 8192,
                          name: '[name]_[hash].[ext]',
                          esModule: false
                      }
                  }
              ]
          }
      ]
  }
};