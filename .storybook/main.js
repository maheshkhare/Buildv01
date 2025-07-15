const workspaceConfig = require('../webpack.config.js');

module.exports = {
  addons: ['@storybook/addon-knobs/register', '@storybook/addon-docs/preset', '@storybook/addon-actions/register'],

  // Merge together storybook webpack aliases with custom aliases added to root webpack.config.js
  webpackFinal: (config) => {
    config.module.rules.unshift({
      test: /\.(ogg)$/i,
        loader: 'file-loader',
      options: {name: 'static/media/[name].[hash:8].[ext]', esModule: false }
    })
    return { ...config, resolve: { ...config.resolve, alias: {...config.resolve.alias, ...workspaceConfig.resolve.alias }} };
  }
}
