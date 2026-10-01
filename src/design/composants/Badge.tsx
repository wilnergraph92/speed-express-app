/* La pastille de statut, aux couleurs exactes du site : un client qui passe
   du tableau de bord à l'application retrouve le même code visuel. */
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
      borderColor: couleurs.trait,
      borderWidth: 1,
      borderRadius: ARRONDI.rond,
      paddingVertical: grand ? 7 : 4.5,
      paddingHorizontal: grand ? ESPACE.l : ESPACE.m,
      alignSelf: 'flex-start',
    }}>
      <Texte
        variante={grand ? 'corpsFort' : 'petit'}
        style={{ color: couleurs.texte, fontSize: grand ? 14 : 12.5 }}
      >
        {t(statut as Cle)}
      </Texte>
    </View>
  );
}
