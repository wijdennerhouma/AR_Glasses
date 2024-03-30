const paths = require('./paths')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = merge(common, {
  mode: 'production', // Mode de construction en production
  devtool: false, // Désactive la génération de source maps pour la production
  output: {
    path: paths.build, // Répertoire de sortie pour les fichiers construits
    publicPath: '/', // Chemin public des fichiers de sortie
    filename: '[name].[contenthash].bundle.js', // Nom des fichiers de sortie avec un hachage de contenu
  },
  plugins: [
    /**
     * MiniCssExtractPlugin
     *
     * Extrait les fichiers CSS dans des fichiers séparés.
     *
     * Remarque : style-loader est utilisé pour le développement, MiniCssExtractPlugin pour la production.
     * Ils ne peuvent pas être utilisés ensemble dans la même configuration.
     */
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash].css', // Nom des fichiers CSS extraits
      chunkFilename: '[id].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },

  /**
   * Optimization
   *
   * Minimisation des ressources JavaScript et CSS en production.
   */
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    // Une fois que votre construction génère plusieurs morceaux, cette option garantira qu'ils partagent le runtime webpack
    // au lieu d'avoir le leur. Cela aide également avec le caching à long terme, car les morceaux ne changeront que lorsque le code réel changera, pas le runtime webpack.
    runtimeChunk: 'single',
    // Cela divise les dépendances couramment partagées (React, Semantic UI, etc.) en un seul bundle partagé. React, etc.
    // ne changera pas aussi souvent que le code de l'application, donc ce morceau peut être mis en cache séparément du code de l'application.
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom|lodash)[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000, // Taille maximale autorisée pour les points d'entrée de votre application
    maxAssetSize: 512000, // Taille maximale autorisée pour un fichier individuel généré
  },
})
