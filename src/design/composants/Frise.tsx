/* ==========================================================================
   La frise du parcours — la pièce centrale de l'application
   --------------------------------------------------------------------------
   Refonte : le parcours se lit sur une carte rouge aux couleurs de la
   marque, comme le panneau coloré de la maquette. Quatre étapes fixes :
   confirmé, expédié, disponible, livré. Les étapes franchies sont pleines,
   celles à venir sont creuses, et le trait qui les relie s'arrête exactement
   là où le colis en est.

   « Action requise » n'est pas une cinquième étape : c'est un arrêt. Le
   colis garde l'étape qu'il avait atteinte, et le point courant est cerclé
   plus fort — le client voit d'un coup d'œil que quelque chose l'attend.
   ========================================================================== */
import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ARRONDI, ESPACE, MARQUE, STATUTS, ETAPES } from '../theme';
import { Texte } from './Texte';
import { useLangue } from '../../i18n';
import type { Cle } from '../../i18n/textes';
import type { Etape } from '../../api/supabase';

const TAILLE = 14;
const BLANC = '#FFFFFF';

export function Frise({ statut, etapes }: { statut: string; etapes: Etape[] }) {
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
    <LinearGradient
      colors={[MARQUE.rouge, MARQUE.rougeSombre]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: ARRONDI.xl, overflow: 'hidden' }}
    >
      <View style={{ padding: ESPACE.xl, paddingBottom: ESPACE.xxl }}>
        {/* Un colis discret en filigrane, comme l'illustration de la maquette. */}
        <Texte style={{ position: 'absolute', right: 12, bottom: 2, fontSize: 84, opacity: 0.14, color: BLANC }}>
          📦
        </Texte>

        {STATUTS.map((nom, i) => {
          const rang = i + 1;
          const franchie = rang <= rangAtteint;
          const courante = rang === rangAtteint;
          const dernier = i === STATUTS.length - 1;

          return (
            <View key={nom} style={{ flexDirection: 'row' }}>
              {/* Colonne du point et du trait */}
              <View style={{ width: 28, alignItems: 'center' }}>
                <View style={{
                  width: TAILLE, height: TAILLE, borderRadius: TAILLE,
                  borderWidth: franchie ? 0 : 2,
                  borderColor: 'rgba(255,255,255,.5)',
                  backgroundColor: franchie ? BLANC : 'transparent',
                  marginTop: 3,
                }} />
                {/* Un halo blanc autour du point courant : l'œil y revient. */}
                {courante && (
                  <View style={{
                    position: 'absolute', top: -2, width: TAILLE + 10, height: TAILLE + 10,
                    borderRadius: TAILLE + 10, borderWidth: 2, borderColor: BLANC, opacity: bloque ? 0.7 : 0.35,
                  }} />
                )}
                {!dernier && (
                  <View style={{
                    flex: 1, width: 2, marginVertical: 4,
                    backgroundColor: rang < rangAtteint ? BLANC : 'rgba(255,255,255,.3)',
                  }} />
                )}
              </View>

              {/* Colonne du texte */}
              <View style={{ flex: 1, paddingBottom: dernier ? 0 : ESPACE.xl, marginTop: -2 }}>
                <Texte variante="corpsFort" style={{ color: franchie ? BLANC : 'rgba(255,255,255,.6)' }}>
                  {t(nom as Cle)}
                </Texte>
                {dateDe(nom) && (
                  <Texte variante="petit" style={{ marginTop: 2, color: 'rgba(255,255,255,.72)' }}>
                    {dateDe(nom)}
                  </Texte>
                )}
                {lieuDe(nom) && (
                  <Texte variante="petit" style={{ marginTop: 1, color: 'rgba(255,255,255,.55)' }}>
                    {lieuDe(nom)}
                  </Texte>
                )}
                {bloque && courante && (
                  <Texte variante="corpsFort" style={{ color: BLANC, marginTop: 4 }}>
                    {t('action')}
                  </Texte>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </LinearGradient>
  );
}
