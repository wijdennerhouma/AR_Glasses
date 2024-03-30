const paths = require('./paths')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  /**
   * Mode
   *
   * Définit le mode sur développement ou production.
   */
  mode: 'development',

  /**
   * Devtool
   *
   * Contrôle la génération des source maps.
   */
  devtool: 'inline-source-map',

  /**
   * DevServer
   *
   * Lance un serveur pour un développement rapide.
   */
  devServer: {
    historyApiFallback: true, // Permet la gestion de la navigation avec le mode de navigation HTML5
    contentBase: paths.build, // Spécifie le répertoire à servir
    open: true, // Ouvre automatiquement le navigateur une fois le serveur démarré
    compress: true, // Active la compression gzip pour tous les fichiers servis
    hot: true, // Active le remplacement à chaud (Hot Module Replacement)
    https: true, // Active le serveur en mode HTTPS
    port: 8443, // Port sur lequel le serveur écoute
  },

  plugins: [
    /**
     * HotModuleReplacementPlugin
     *
     * Met à jour uniquement ce qui a changé.
     */
    new webpack.HotModuleReplacementPlugin(),
  ],
})
