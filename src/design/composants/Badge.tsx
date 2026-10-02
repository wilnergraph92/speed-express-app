/* La pastille de statut, façon maquette : un fond teinté tout doux, le texte
   coloré, aucun contour — le code visuel des statuts reste celui du site. */
import React from 'react';
import { View } from 'react-native';
import { ARRONDI, ESPACE } from '../theme';
import { useTheme } from '../useTheme';
import { Texte } from './Texte';
import { useLangue } from '../../i18n';
import type { Cle } from '../../i18n/textes';

export function Badge({ statut, grand }: { statut: string; grand?: boolean }) {
  const { c } = useTheme();
  const { t } = useLangue();
  const couleurs = c.statuts[statut as keyof typeof c.statuts] ?? c.statuts.expedie;
  return (
    <View style={{
      backgroundColor: couleurs.fond,
      borderRadius: ARRONDI.rond,
      paddingVertical: grand ? 7 : 5,
      paddingHorizontal: grand ? ESPACE.l : ESPACE.m,
      alignSelf: 'flex-start',
    }}>
      <Texte
        variante={grand ? 'corpsFort' : 'petit'}
        style={{ color: couleurs.texte, fontSize: grand ? 13.5 : 12 }}
      >
        {t(statut as Cle) || statut}
      </Texte>
    </View>
  );
}
