/* Tous les textes de l'application passent par ici : c'est ce qui garantit
   qu'aucun écran n'oublie la police de la marque ou ne choisit sa propre
   taille au jugé. */
import React from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';
import { POLICES } from '../theme';
import { useTheme } from '../useTheme';

type Variante = 'titreXL' | 'titre' | 'sousTitre' | 'corps' | 'corpsFort' | 'petit' | 'etiquette' | 'mono' | 'monoGrand';

const STYLES: Record<Variante, TextStyle> = {
  titreXL:    { fontFamily: POLICES.titreFort, fontSize: 30, lineHeight: 34, letterSpacing: -0.6 },
  titre:      { fontFamily: POLICES.titre,     fontSize: 21, lineHeight: 26, letterSpacing: -0.3 },
  sousTitre:  { fontFamily: POLICES.texteDemi, fontSize: 15, lineHeight: 21 },
  corps:      { fontFamily: POLICES.texte,     fontSize: 15, lineHeight: 22 },
  corpsFort:  { fontFamily: POLICES.texteFort, fontSize: 15, lineHeight: 22 },
  petit:      { fontFamily: POLICES.texte,     fontSize: 13, lineHeight: 18 },
  /* Les intitulés au-dessus d'une valeur : petits, espacés, discrets. */
  etiquette:  { fontFamily: POLICES.texteDemi, fontSize: 10.5, lineHeight: 14, letterSpacing: 1.1, textTransform: 'uppercase' },
  mono:       { fontFamily: POLICES.mono,      fontSize: 13.5, letterSpacing: 0.4 },
  monoGrand:  { fontFamily: POLICES.mono,      fontSize: 19, letterSpacing: 0.8 },
};

type Props = TextProps & {
  variante?: Variante;
  ton?: 'normal' | 'doux' | 'faible' | 'accent' | 'inverse';
};

export function Texte({ variante = 'corps', ton = 'normal', style, ...reste }: Props) {
  const { c } = useTheme();
  const couleur = ton === 'doux' ? c.texteDoux
    : ton === 'faible' ? c.texteFaible
    : ton === 'accent' ? c.accent
    : ton === 'inverse' ? c.accentTexte
    : c.texte;
  return <Text {...reste} style={[STYLES[variante], { color: couleur }, style]} />;
}
