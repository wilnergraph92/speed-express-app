/* ==========================================================================
   Mes colis — l'écran que le client ouvrira le plus souvent
   --------------------------------------------------------------------------
   La liste se recharge toute seule dès que l'équipe touche à un colis depuis
   le tableau de bord : c'est le même canal temps réel que le site. Le client
   n'a rien à tirer vers le bas pour voir que son colis est arrivé.
   ========================================================================== */
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { mesColis, surveiller } from '../../api/donnees';
import type { Colis } from '../../api/supabase';
import { useSession } from '../../api/session';
import { useLangue } from '../../i18n';
import { useTheme } from '../../design/useTheme';
import { ESPACE, ARRONDI, POLICES } from '../../design/theme';
import { Texte } from '../../design/composants/Texte';
import { Carte } from '../../design/composants/Carte';
import { Badge } from '../../design/composants/Badge';
import { Vide } from '../../design/composants/Vide';
import { TextInput } from 'react-native';

export default function MesColis() {
  const { c } = useTheme();
  const { t, langue } = useLangue();
  const { profil } = useSession();
  const router = useRouter();
  const bords = useSafeAreaInsets();

  const [colis, setColis] = useState<Colis[]>([]);
  const [chargement, setChargement] = useState(true);
  const [rafraichit, setRafraichit] = useState(false);
  const [erreur, setErreur] = useState('');
  const [recherche, setRecherche] = useState('');

  const charger = useCallback(async () => {
    try {
      setColis(await mesColis());
      setErreur('');
    } catch {
      setErreur(t('erreurGenerale'));
    } finally {
      setChargement(false);
      setRafraichit(false);
    }
  }, [t]);

  useEffect(() => { charger(); }, [charger]);

  /* Le tableau de bord vient de changer quelque chose : on recharge. */
  useEffect(() => surveiller((quoi) => { if (quoi === 'colis') charger(); }), [charger]);

  const liste = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    if (!q) return colis;
    return colis.filter((x) =>
      [x.numero, x.description, x.expediteur, x.ville_destination]
        .some((v) => (v || '').toLowerCase().includes(q)));
  }, [colis, recherche]);

  const dateCourte = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString(langue, { day: 'numeric', month: 'short' }) : '—';

  if (chargement) {
    return (
      <View style={{ flex: 1, backgroundColor: c.fond, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={c.accent} size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.fond }}>
      <FlatList
        data={liste}
        keyExtractor={(x) => x.id}
        contentContainerStyle={{ padding: ESPACE.xl, paddingTop: bords.top + ESPACE.l, paddingBottom: ESPACE.xxxl }}
        refreshControl={
          <RefreshControl refreshing={rafraichit} onRefresh={() => { setRafraichit(true); charger(); }}
            tintColor={c.accent} colors={[c.accent]} />
        }
        ListHeaderComponent={
          <View style={{ marginBottom: ESPACE.xl }}>
            <Texte variante="titreXL">{t('mesColis')}</Texte>
            {!!profil?.code && (
              <Texte variante="mono" ton="doux" style={{ marginTop: 4 }}>
                {t('identifiant')} · {profil.code}
              </Texte>
            )}

            {colis.length > 3 && (
              <View style={{
                flexDirection: 'row', alignItems: 'center', marginTop: ESPACE.xl,
                backgroundColor: c.surface, borderRadius: ARRONDI.l,
                borderWidth: 1, borderColor: c.bordure, paddingHorizontal: ESPACE.l,
              }}>
                <Texte ton="faible" style={{ fontSize: 15 }}>⌕</Texte>
                <TextInput
                  value={recherche}
                  onChangeText={setRecherche}
                  placeholder={t('rechercherColis')}
                  placeholderTextColor={c.texteFaible}
                  style={{
                    flex: 1, color: c.texte, fontFamily: POLICES.texte, fontSize: 15,
                    paddingVertical: 13, paddingHorizontal: ESPACE.m,
                  }}
                />
              </View>
            )}

            {!!erreur && (
              <Texte variante="petit" style={{ color: c.statuts.action.texte, marginTop: ESPACE.m }}>{erreur}</Texte>
            )}
          </View>
        }
        ListEmptyComponent={
          recherche
            ? <Vide titre={t('aucunResultat')} detail="" icone="⌕" />
            : <Vide titre={t('aucunColis')} detail={t('aucunColisDetail')} />
        }
        renderItem={({ item }) => (
          <Carte surPression={() => router.push(`/colis/${item.id}`)} style={{ marginBottom: ESPACE.m }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1, paddingRight: ESPACE.m }}>
                <Texte variante="monoGrand">{item.numero}</Texte>
                {!!item.description && (
                  <Texte variante="corps" ton="doux" numberOfLines={1} style={{ marginTop: 3 }}>
                    {item.description}
                  </Texte>
                )}
              </View>
              <Badge statut={item.statut} />
            </View>

            {/* Une ligne de faits, séparés par des points : destination, poids,
                dernière mise à jour. C'est ce qu'on lit en diagonale. */}
            <View style={{
              flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap',
              marginTop: ESPACE.l, paddingTop: ESPACE.m,
              borderTopWidth: 1, borderTopColor: c.bordure,
            }}>
              {!!item.ville_destination && (
                <Texte variante="petit" ton="doux">{item.ville_destination}</Texte>
              )}
              {!!item.poids_lb && (
                <Texte variante="petit" ton="faible">
                  {item.ville_destination ? '  ·  ' : ''}{item.poids_lb} lb
                </Texte>
              )}
              <View style={{ flex: 1 }} />
              <Texte variante="petit" ton="faible">
                {t('misAJour')} {dateCourte(item.maj_le || item.cree_le)}
              </Texte>
            </View>
          </Carte>
        )}
      />
    </View>
  );
}
