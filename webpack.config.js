const ExtractTextPlugin = require('extract-text-webpack-plugin');


const path = `${__dirname}/dist`;

const ploneExcludes = /(\+\+resource\+\+|\+\+theme\+\+)/;
const jsExcludes = /(\/node_modules\/|test\.js$|\.spec\.js$)/;


module.exports = {
  entry: [
    './app/cover.scss',
    './app/cover.js',
  ],
  output: {
    filename: 'cover.js',
    library: 'cover',
    libraryExport: 'default',
    libraryTarget: 'umd',
    path: path,
    pathinfo: true,
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: new RegExp(`${ploneExcludes.source}|${jsExcludes.source}`),
      use: 'babel-loader',
    }, {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          {
            loader: 'css-loader',
            options: {
              url: (url, resourcePath) => ploneExcludes.test(url)
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      }),
    }, {
      test: /\.(gif|png|jpe?g)$/i,
      exclude: ploneExcludes,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
            context: 'app/',
          }
        },
        {
          loader: 'image-webpack-loader',
          query: {
            mozjpeg: {
              progressive: true,
            },
            pngquant: {
              quality: '65-90',
              speed: 4,
            },
            gifsicle: {
              interlaced: false,
            },
            optipng: {
              optimizationLevel: 7,
            }
          }
        }
      ]
    }, {
      test: /\.svg/,
      exclude: ploneExcludes,
      use: 'svg-url-loader',
    }]
  },
  devtool: 'source-map',
  plugins: [
    new ExtractTextPlugin({
      filename: 'cover.css',
      // filename: `cover-${gitHash}.css`,
      allChunks: true
    }),
  ]
}
