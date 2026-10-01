import React from 'react';
import { Pressable, ActivityIndicator, View, type ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ARRONDI, ESPACE } from '../theme';
import { useTheme } from '../useTheme';
import { Texte } from './Texte';

type Props = {
  titre: string;
  surPression: () => void;
  variante?: 'plein' | 'contour' | 'discret';
  occupe?: boolean;
  inactif?: boolean;
  style?: ViewStyle;
};

export function Bouton({ titre, surPression, variante = 'plein', occupe, inactif, style }: Props) {
  const { c } = useTheme();
  const eteint = inactif || occupe;

  const fonds = {
    plein: c.accent,
    contour: 'transparent',
    discret: c.surfaceHaut,
  };

  return (
    <Pressable
      disabled={eteint}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        surPression();
      }}
      style={({ pressed }) => [{
        backgroundColor: fonds[variante],
        borderWidth: variante === 'contour' ? 1.5 : 0,
        borderColor: c.accent,
        borderRadius: ARRONDI.l,
        paddingVertical: 15,
        paddingHorizontal: ESPACE.xl,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 52,
        opacity: eteint ? 0.5 : pressed ? 0.85 : 1,
        transform: [{ scale: pressed && !eteint ? 0.985 : 1 }],
      }, style]}
    >
      {occupe
        ? <ActivityIndicator color={variante === 'plein' ? c.accentTexte : c.accent} />
        : <View>
            <Texte
              variante="corpsFort"
              style={{ color: variante === 'plein' ? c.accentTexte : c.accent, fontSize: 15.5 }}
            >
              {titre}
            </Texte>
          </View>}
    </Pressable>
  );
}
