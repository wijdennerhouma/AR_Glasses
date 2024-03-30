module.exports = {
  plugins: {
    // Utilisation du plugin postcss-preset-env pour transformer les CSS en utilisant les fonctionnalités des versions récentes
    'postcss-preset-env': {
      browsers: 'last 2 versions', // Prise en charge des deux dernières versions des navigateurs
    },
    // Utilisation du plugin cssnano pour minifier les CSS
    cssnano: {},
  },
}
