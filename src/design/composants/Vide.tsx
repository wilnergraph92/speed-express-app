/* L'écran vide n'est pas une erreur : c'est le premier écran que verra un
   nouveau client. Il doit expliquer, pas s'excuser. */
import React from 'react';
import { View } from 'react-native';
import { ESPACE } from '../theme';
import { useTheme } from '../useTheme';
import { Texte } from './Texte';

export function Vide({ titre, detail, icone = '📦' }: { titre: string; detail: string; icone?: string }) {
  const { c } = useTheme();
  return (
    <View style={{ alignItems: 'center', paddingVertical: ESPACE.xxxl * 1.5, paddingHorizontal: ESPACE.xl }}>
      <View style={{
        width: 76, height: 76, borderRadius: 38, backgroundColor: c.pastille,
        alignItems: 'center', justifyContent: 'center', marginBottom: ESPACE.xl,
      }}>
        <Texte style={{ fontSize: 32 }}>{icone}</Texte>
      </View>
      <Texte variante="titre" style={{ textAlign: 'center' }}>{titre}</Texte>
      <Texte variante="corps" ton="doux" style={{ textAlign: 'center', marginTop: ESPACE.s, maxWidth: 300 }}>
        {detail}
      </Texte>
    </View>
  );
}
