/* ==========================================================================
   Speed Express Shipping — système de design
   --------------------------------------------------------------------------
   Une seule source pour les couleurs, les textes et les espacements. Rien
   n'est écrit en dur dans les écrans : une valeur changée ici se propage
   partout, et les deux thèmes restent cohérents entre eux.

   Le thème sombre est le thème de référence. Un client qui suit un colis le
   fait souvent le soir, dehors, d'un coup d'œil : le fond très sombre fait
   ressortir le rouge de la marque et économise la batterie sur les écrans
   OLED. Le thème clair existe quand même, parce que le téléphone décide.
   ========================================================================== */

/* Les couleurs de la marque, identiques à celles du site et des factures. */
export const MARQUE = {
  rouge: '#E8121B',
  rougeSombre: '#B60D14',
  rougeClair: '#FF7278',
  anthracite: '#20242A',
  encre: '#0B0C0E',
};

/* Les cinq statuts d'un colis, dans l'ordre du parcours. « action » n'est pas
   une étape : c'est un arrêt qui peut survenir à n'importe quel moment. */
export const STATUTS = ['confirme', 'expedie', 'disponible', 'livre'] as const;
export type Statut = (typeof STATUTS)[number] | 'action';

/* Le rang d'un statut dans le parcours, repris tel quel de ses-api.js pour
   que l'application et le site racontent exactement la même histoire. */
export const ETAPES: Record<string, number> = {
  confirme: 1, expedie: 2, disponible: 3, livre: 4,
};

type JeuDeCouleurs = {
  fond: string; fondHaut: string; surface: string; surfaceHaut: string;
  bordure: string; bordureFranche: string;
  texte: string; texteDoux: string; texteFaible: string;
  accent: string; accentTexte: string; accentDoux: string;
  succes: string; alerte: string;
  statuts: Record<Statut, { fond: string; trait: string; texte: string }>;
  ombre: string;
};

/* Thème sombre — la référence. */
const sombre: JeuDeCouleurs = {
  fond: '#08090B',
  fondHaut: '#0E1013',
  surface: '#131619',
  surfaceHaut: '#1B1F24',
  bordure: 'rgba(255,255,255,.07)',
  bordureFranche: 'rgba(255,255,255,.14)',
  texte: '#F4F5F7',
  texteDoux: '#A3ABB8',
  texteFaible: '#6B7482',
  accent: MARQUE.rouge,
  accentTexte: '#FFFFFF',
  accentDoux: 'rgba(232,18,27,.14)',
  succes: '#2FD04A',
  alerte: '#FFB020',
  ombre: '#000000',
  statuts: {
    confirme:   { fond: 'rgba(90,120,255,.14)', trait: 'rgba(90,120,255,.34)', texte: '#8FA6FF' },
    expedie:    { fond: 'rgba(255,255,255,.08)', trait: 'rgba(255,255,255,.18)', texte: '#D3D9E2' },
    disponible: { fond: 'rgba(47,208,74,.14)',  trait: 'rgba(47,208,74,.36)',  texte: '#5CE07A' },
    livre:      { fond: 'rgba(47,208,74,.10)',  trait: 'rgba(47,208,74,.26)',  texte: '#3FBF58' },
    action:     { fond: 'rgba(232,18,27,.16)',  trait: 'rgba(232,18,27,.40)',  texte: '#FF7278' },
  },
};

/* Thème clair — les mêmes couleurs de statut que le site, à l'identique. */
const clair: JeuDeCouleurs = {
  fond: '#F6F7F9',
  fondHaut: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceHaut: '#FFFFFF',
  bordure: 'rgba(11,12,14,.09)',
  bordureFranche: 'rgba(11,12,14,.16)',
  texte: '#0B0C0E',
  texteDoux: '#5B6470',
  texteFaible: '#8A929E',
  accent: MARQUE.rouge,
  accentTexte: '#FFFFFF',
  accentDoux: 'rgba(232,18,27,.10)',
  succes: '#0B7A19',
  alerte: '#B45309',
  ombre: '#0B0C0E',
  statuts: {
    confirme:   { fond: 'rgba(26,46,210,.10)', trait: 'rgba(26,46,210,.30)', texte: '#1A2ED2' },
    expedie:    { fond: 'rgba(32,36,42,.09)',  trait: 'rgba(32,36,42,.22)',  texte: '#20242A' },
    disponible: { fond: 'rgba(19,192,44,.12)', trait: 'rgba(19,192,44,.35)', texte: '#0B7A19' },
    livre:      { fond: 'rgba(11,122,25,.10)', trait: 'rgba(11,122,25,.30)', texte: '#0B7A19' },
    action:     { fond: 'rgba(232,18,27,.10)', trait: 'rgba(232,18,27,.30)', texte: '#B60D14' },
  },
};

export const THEMES = { sombre, clair };

/* Les trois polices du site. Saira porte les titres, Manrope le texte
   courant, IBM Plex Mono les numéros de colis — un chiffre et une lettre
   doivent rester distinguables quand on lit un code à voix haute. */
export const POLICES = {
  titre: 'Saira_700Bold',
  titreFort: 'Saira_800ExtraBold',
  texte: 'Manrope_500Medium',
  texteFort: 'Manrope_700Bold',
  texteDemi: 'Manrope_600SemiBold',
  mono: 'IBMPlexMono_500Medium',
};

/* Échelle d'espacement par pas de 4 : toutes les marges du produit en
   sortent, ce qui évite les alignements approximatifs. */
export const ESPACE = { xs: 4, s: 8, m: 12, l: 16, xl: 20, xxl: 28, xxxl: 40 } as const;

export const ARRONDI = { s: 10, m: 14, l: 20, xl: 26, rond: 999 } as const;

/* Ombres portées : discrètes, jamais décoratives. Elles servent à dire
   « cette carte est au-dessus », pas à faire joli. */
export const ombre = (c: JeuDeCouleurs, force: 'douce' | 'forte' = 'douce') => ({
  shadowColor: c.ombre,
  shadowOpacity: force === 'forte' ? 0.3 : 0.16,
  shadowRadius: force === 'forte' ? 24 : 12,
  shadowOffset: { width: 0, height: force === 'forte' ? 10 : 4 },
  elevation: force === 'forte' ? 10 : 4,
});

export type Couleurs = JeuDeCouleurs;
