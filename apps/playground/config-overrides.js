const {
  override,
  addWebpackAlias,
  addWebpackPlugin
} = require('customize-cra')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const path = require('path')

module.exports = override(
  addWebpackAlias({
    '@pages': path.resolve(__dirname, 'src/pages'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@hooks': path.resolve(__dirname, 'src/hooks'),
    '@libs': path.resolve(__dirname, 'src/libs'),
    '@assets': path.resolve(__dirname, 'src/assets')
  }),
  addWebpackPlugin(
    new NodePolyfillPlugin({
      excludeAliases: ['console']
    })
  )
)
