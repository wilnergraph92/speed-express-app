/* ==========================================================================
   Surcouche de configuration — tout vient de app.json, sauf baseUrl.
   --------------------------------------------------------------------------
   GitHub Pages sert ce dépôt sous le sous-chemin /speed-express-app : le
   build publié doit donc préfixer ses assets et ses routes avec ce chemin
   (experiments.baseUrl). Localement et dans l'aperçu, la variable n'est pas
   définie et baseUrl reste vide : comportement inchangé.
   ========================================================================== */
export default ({ config }) => ({
  ...config,
  experiments: {
    ...config.experiments,
    baseUrl: process.env.GH_PAGES_BASE || '',
  },
});
