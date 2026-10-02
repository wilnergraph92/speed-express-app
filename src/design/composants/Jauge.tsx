/* ==========================================================================
   La jauge horizontale — le parcours en un coup d'œil sur la carte
   --------------------------------------------------------------------------
   Version compacte de la frise, posée sur la carte « colis en cours » comme
   la barre à points de la maquette : les étapes franchies sont pleines et
   reliées par un trait rouge, celles à venir restent creuses et grises.
   ========================================================================== */
import React, { Fragment } from 'react';
import { View } from 'react-native';
import { ETAPES, STATUTS } from '../theme';
import { useTheme } from '../useTheme';
import { Texte } from './Texte';
import { useLangue } from '../../i18n';
import type { Cle } from '../../i18n/textes';
import type { Etape } from '../../api/supabase';

const POINT = 10;

export function Jauge({ statut, etapes }: { statut: string; etapes?: Etape[] }) {
  const { c } = useTheme();
  const { t } = useLangue();
  const bloque = statut === 'action';

  /* Même règle que la frise : un colis bloqué garde le rang de sa dernière
     étape réellement franchie, lu dans l'historique quand on l'a sous la main. */
  const rangAtteint = bloque
    ? (etapes?.reduce((max, e) => Math.max(max, ETAPES[e.statut] ?? 0), 1) ?? 1)
    : (ETAPES[statut] ?? 1);

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {STATUTS.map((nom, i) => {
          const rang = i + 1;
          const franchie = rang <= rangAtteint;
          const courante = rang === rangAtteint;
          const teinte = bloque && courante ? c.statuts.action.texte : c.accent;
          return (
            <Fragment key={nom}>
              <View style={{
                width: POINT, height: POINT, borderRadius: POINT,
                backgroundColor: franchie ? teinte : 'transparent',
                borderWidth: franchie ? 0 : 2, borderColor: c.bordureFranche,
              }} />
              {i < STATUTS.length - 1 && (
                <View style={{
                  flex: 1, height: 3, borderRadius: 2,
                  backgroundColor: rang < rangAtteint ? c.accent : c.bordure,
                }} />
              )}
            </Fragment>
          );
        })}
      </View>
      <View style={{ flexDirection: 'row', marginTop: 6 }}>
        {STATUTS.map((nom, i) => (
          <View key={nom} style={{
            flex: 1,
            alignItems: i === 0 ? 'flex-start' : i === STATUTS.length - 1 ? 'flex-end' : 'center',
          }}>
            <Texte variante="petit" ton={i + 1 <= rangAtteint ? 'normal' : 'faible'} style={{ fontSize: 10.5 }}>
              {t(nom as Cle)}
            </Texte>
          </View>
        ))}
      </View>
    </View>
  );
}
