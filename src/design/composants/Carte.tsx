/* La carte : le bloc de base de toute l'application. Coins très arrondis,
   bordure à peine visible, ombre discrète — c'est elle qui donne l'allure
   posée du produit. */
import React from 'react';
import { View, Pressable, type ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ARRONDI, ESPACE, ombre } from '../theme';
import { useTheme } from '../useTheme';

type Props = {
  children: React.ReactNode;
  surPression?: () => void;
  style?: ViewStyle | ViewStyle[];
  haut?: boolean;
  sansBordure?: boolean;
};

export function Carte({ children, surPression, style, haut, sansBordure }: Props) {
  const { c, sombre } = useTheme();
  const base: ViewStyle = {
    backgroundColor: haut ? c.surfaceHaut : c.surface,
    borderRadius: ARRONDI.xl,
    borderWidth: sansBordure ? 0 : 1,
    borderColor: c.bordure,
    padding: ESPACE.xl,
    ...(sombre ? {} : ombre(c)),
  };

  if (!surPression) return <View style={[base, style]}>{children}</View>;

  return (
    <Pressable
      onPress={() => {
        /* Un retour tactile léger à l'ouverture d'un colis : le geste est
           confirmé par la main avant même que l'écran ne change. */
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        surPression();
      }}
      style={({ pressed }) => [base, style, pressed && { opacity: 0.72, transform: [{ scale: 0.99 }] }]}
    >
      {children}
    </Pressable>
  );
}
