module.exports = {
  configureWebpack: {
    devtool: 'source-map', // 👈 ADD THIS LINE
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './packages'),
        SRC: path.resolve(__dirname, './packages'),
        WSRoot: path.resolve(__dirname, './'),
        CSS: path.resolve(__dirname, './packages/assets/css'),
        Components: path.resolve(__dirname, './packages/common-components'),
        Scripts: path.resolve(__dirname, './packages/common-js'),
        Lessons: path.resolve(__dirname, './packages/lessons'),
        Controllers: path.resolve(__dirname, './packages/program-controllers'),
        Data: path.resolve(__dirname, './packages/data')
      }
    }
  },
  css: {
    loaderOptions: {
      postcss: {
        path: path.resolve(__dirname, `./postcss.config.js`),
        plugins: [
          require('postcss-import'),
          require('tailwindcss')(path.resolve(__dirname, './tailwind.js')),
          require('autoprefixer')
        ]
      }
    }
  },
  chainWebpack: (config) =>
    config.resolveLoader.modules.add(
      `${path.dirname(require.resolve('@vue/cli-plugin-babel'))}/node_modules`
    )
}
