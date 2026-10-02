/* ==========================================================================
   Le thème suit le réglage du téléphone — sauf quand un écran le force.
   --------------------------------------------------------------------------
   Pas d'interrupteur dans l'application : un client qui a choisi le mode
   sombre pour tout son appareil ne veut pas le rechoisir ici. Mais certains
   écrans de marque (la connexion, l'inscription) restent blancs quel que
   soit le réglage : le logo y est posé tel quel, sur son fond d'origine.
   `FournisseurTheme` permet à un écran d'imposer 'light' ou 'dark' à tous
   ses descendants (Texte, Champ, Bouton, cartes…).
   ========================================================================== */
import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { THEMES, type Couleurs } from './theme';

type Force = 'light' | 'dark' | null;

const CtxForce = createContext<Force>(null);

export function FournisseurTheme({ force, children }: {
  force: 'light' | 'dark';
  children: React.ReactNode;
}) {
  return React.createElement(CtxForce.Provider, { value: force }, children);
}

export function useTheme(): { c: Couleurs; sombre: boolean } {
  const schema = useColorScheme();
  const force = useContext(CtxForce);
  const sombre = force ? force === 'dark' : schema !== 'light';
  return { c: sombre ? THEMES.sombre : THEMES.clair, sombre };
}
