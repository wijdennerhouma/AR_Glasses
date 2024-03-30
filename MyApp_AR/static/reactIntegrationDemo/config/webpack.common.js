const paths = require('./paths')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  /**
   * Entry
   *
   * Le point d'entrée où Webpack commence à construire le bundle.
   */
  entry: [paths.src + '/index.js'],

  /**
   * Output
   *
   * Où Webpack sort les assets et les bundles.
   */
  output: {
    path: paths.build,
    filename: '[name].bundle.js',
    publicPath: '/',
  },

  /**
   * Plugins
   *
   * Personnalise le processus de construction de Webpack.
   */
  plugins: [
    /**
     * CleanWebpackPlugin
     *
     * Supprime/nettoie les dossiers de construction et les assets inutilisés lors de la reconstruction.
     */
    new CleanWebpackPlugin(),

    /**
     * CopyWebpackPlugin
     *
     * Copie les fichiers de la source vers le dossier de destination.
     */
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.static,
          to: 'assets',
          globOptions: {
            ignore: ['*.DS_Store'],
          },
        },
      ],
    }),

    /**
     * HtmlWebpackPlugin
     *
     * Génère un fichier HTML à partir d'un modèle.
     */
    new HtmlWebpackPlugin({
      title: 'React-fiber integration demo',
      favicon: paths.static + '/favicon.png',
      template: paths.src + '/template.html', // fichier de template
      filename: 'index.html', // fichier de sortie
    }),
  ],

  /**
   * Module
   *
   * Détermine comment les modules du projet sont traités.
   */
  module: {
    rules: [
      /**
       * JavaScript
       *
       * Utilise Babel pour transpiler les fichiers JavaScript.
       */
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },

      /**
       * Styles
       *
       * Injecte les CSS dans l'en-tête avec des source maps.
       */
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },

      /**
       * Images
       *
       * Copie les fichiers d'image vers le dossier de construction.
       */
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
          context: 'src', // empêche l'affichage de src/ dans le nom de fichier
        },
      },

      /**
       * Fonts
       *
       * Inline les fichiers de police.
       */
      {
        test: /\.(woff(2)?|eot|ttf|otf|)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: '[path][name].[ext]',
          context: 'src', // empêche l'affichage de src/ dans le nom de fichier
        },
      },

       /**
       *
       * .GLB/.GLTF 3D Models
       * .HDR envmaps
       */
      {
        test: /\.(glb|gltf|hdr)$/,
        use:
        [
          {
            loader: 'file-loader',
            options:
            {
              outputPath: 'assets/models/'
            }
          }
        ]
      },
    ],
  },
}
