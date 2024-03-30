// Configuration des règles ESLint pour notre projet

module.exports = {
  // Définit que ce fichier de configuration est la racine du projet
  root: true,

  // Indique que notre code s'exécute dans un navigateur et utilise ECMAScript 2020
  env: { browser: true, es2020: true },

  // Utilise les configurations recommandées par défaut pour ESLint
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],

  // Ignore certains fichiers et répertoires lors de l'analyse par ESLint
  ignorePatterns: ['dist', '.eslintrc.cjs'],

  // Options du parser pour indiquer la version ECMAScript utilisée
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },

  // Configuration spécifique à React, indiquant la version utilisée
  settings: { react: { version: '18.2' } },

  // Activation du plugin react-refresh pour la mise à jour en temps réel des composants React
  plugins: ['react-refresh'],

  // Définition des règles spécifiques à notre projet
  rules: {
    // Avertissement si un module exporte autre chose que des composants React
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
