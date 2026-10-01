/* ==========================================================================
   La frise du parcours — la pièce centrale de l'application
   --------------------------------------------------------------------------
   Quatre étapes fixes : confirmé, expédié, disponible, livré. Les étapes
   franchies sont pleines, celles à venir sont creuses, et le trait qui les
   relie s'arrête exactement là où le colis en est.

   « Action requise » n'est pas une cinquième étape : c'est un arrêt. Le
   colis garde l'étape qu'il avait atteinte, et le point devient rouge —
   le client voit d'un coup d'œil que quelque chose l'attend.
   ========================================================================== */
import React from 'react';
import { View } from 'react-native';
import { ESPACE, STATUTS, ETAPES } from '../theme';
import { useTheme } from '../useTheme';
import { Texte } from './Texte';
import { useLangue } from '../../i18n';
import type { Cle } from '../../i18n/textes';
import type { Etape } from '../../api/supabase';

const TAILLE = 15;

export function Frise({ statut, etapes }: { statut: string; etapes: Etape[] }) {
  const { c } = useTheme();
  const { t, langue } = useLangue();
  const bloque = statut === 'action';

  /* Un colis « action requise » n'annonce pas son rang : on le retrouve dans
     son historique, à la dernière étape réellement franchie. */
  const rangAtteint = bloque
    ? etapes.reduce((max, e) => Math.max(max, ETAPES[e.statut] ?? 0), 1)
    : (ETAPES[statut] ?? 1);

  /* La date de passage d'une étape, quand l'historique la connaît. */
  const dateDe = (nom: string) => {
    const trouvee = etapes.filter((e) => e.statut === nom).pop();
    if (!trouvee) return null;
    return new Date(trouvee.cree_le).toLocaleDateString(langue, {
      day: 'numeric', month: 'short', year: 'numeric',
    }) + ' · ' + new Date(trouvee.cree_le).toLocaleTimeString(langue, {
      hour: '2-digit', minute: '2-digit',
    });
  };
  const lieuDe = (nom: string) => etapes.filter((e) => e.statut === nom).pop()?.lieu || null;

  return (
    <View>
      {STATUTS.map((nom, i) => {
        const rang = i + 1;
        const franchie = rang <= rangAtteint;
        const courante = rang === rangAtteint;
        const dernier = i === STATUTS.length - 1;
        const couleur = bloque && courante ? c.statuts.action.texte
          : franchie ? c.succes
          : c.texteFaible;

        return (
          <View key={nom} style={{ flexDirection: 'row' }}>
            {/* Colonne du point et du trait */}
            <View style={{ width: 30, alignItems: 'center' }}>
              <View style={{
                width: TAILLE, height: TAILLE, borderRadius: TAILLE,
                borderWidth: franchie ? 0 : 2,
                borderColor: c.bordureFranche,
                backgroundColor: franchie ? couleur : 'transparent',
                marginTop: 3,
              }} />
              {/* Un halo autour du point courant : l'œil y revient tout seul. */}
              {courante && (
                <View style={{
                  position: 'absolute', top: -2, width: TAILLE + 10, height: TAILLE + 10,
                  borderRadius: TAILLE + 10, borderWidth: 2, borderColor: couleur, opacity: 0.35,
                }} />
              )}
              {!dernier && (
                <View style={{
                  flex: 1, width: 2, marginVertical: 4,
                  backgroundColor: rang < rangAtteint ? c.succes : c.bordure,
                }} />
              )}
            </View>

            {/* Colonne du texte */}
            <View style={{ flex: 1, paddingBottom: dernier ? 0 : ESPACE.xl, marginTop: -2 }}>
              <Texte variante="corpsFort" style={{ color: franchie ? c.texte : c.texteFaible }}>
                {t(nom as Cle)}
              </Texte>
              {dateDe(nom) && (
                <Texte variante="petit" ton="doux" style={{ marginTop: 2 }}>{dateDe(nom)}</Texte>
              )}
              {lieuDe(nom) && (
                <Texte variante="petit" ton="faible" style={{ marginTop: 1 }}>{lieuDe(nom)}</Texte>
              )}
              {bloque && courante && (
                <Texte variante="petit" style={{ color: c.statuts.action.texte, marginTop: 4 }}>
                  {t('action')}
                </Texte>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}
