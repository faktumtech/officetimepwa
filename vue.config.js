// access pkgVersion from inside vue app
// https://medium.com/hceverything/how-to-show-your-app-version-from-package-json-in-your-vue-application-11e882b97d8c
const webpack = require('webpack')
const fs = require('fs')
const packageJson = fs.readFileSync('./package.json')
const appVersion = JSON.parse(packageJson).version || 0
const dbVersion = JSON.parse(packageJson).dbVersion || 0

module.exports = {
  configureWebpack: {
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                PACKAGE_VERSION: '"' + appVersion + '"',
                DEXIEDB_VERSION:  dbVersion
            }
        })
    ]
  },
  // enable eslint standard autofix on save
  chainWebpack: config => {
    config.module.rule('eslint').use('eslint-loader').options({
      fix: true
    })
  },  
  transpileDependencies: [
    'vuetify'
  ],
  pwa: {
    themeColor: '#ffffff', // don't delete
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/mstile-150x150.png'
    }
    // rest is configured in manifest.json
  }
}
