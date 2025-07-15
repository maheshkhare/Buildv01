const path = require('path')

module.exports = {
  entry: './packages/**',
  resolve: {
    alias: {
      WSRoot: path.resolve(__dirname, './'),
      SRC: path.resolve(__dirname, './packages'),
      CSS: path.resolve(__dirname, './packages/assets/css'),
      Components: path.resolve(__dirname, './packages/common-components'),
      Scripts: path.resolve(__dirname, './packages/common-js'),
      Lessons: path.resolve(__dirname, './packages/lessons'),
      Controllers: path.resolve(__dirname, './packages/program-controllers'),
      Data: path.resolve(__dirname, './packages/data')
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',

          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          postcss: [
            require('tailwindcss')(path.resolve(__dirname, './tailwind.js')),
            require('autoprefixer')()
          ]
        }
      },
      {
        test: /\.(ogg|mp3|wav)$/i,
        include: 'SRC',
        loader: 'file-loader'
      }
    ]
  }
}
