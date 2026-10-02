/* ==========================================================================
   Mes colis — l'écran que le client ouvrira le plus souvent
   --------------------------------------------------------------------------
   Refonte : halo rouge dégradé en haut d'écran, le colis en cours mis en
   avant sur une carte avec sa jauge de parcours (comme la maquette), puis la
   liste des autres envois en lignes pastille + numéro + pastille de statut.
   La liste se recharge toute seule dès que l'équipe touche à un colis depuis
   le tableau de bord : c'est le même canal temps réel que le site.
   ========================================================================== */
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
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
import { Jauge } from '../../design/composants/Jauge';
import { Vide } from '../../design/composants/Vide';

/* Une ligne de la liste récente : pastille, numéro, description, statut. */
function LigneColis({ colis: x, surPression }: { colis: Colis; surPression: () => void }) {
  const { c } = useTheme();
  return (
    <Carte surPression={surPression} style={{ marginBottom: ESPACE.m, padding: ESPACE.l }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{
          width: 46, height: 46, borderRadius: 23, backgroundColor: c.pastille,
          alignItems: 'center', justifyContent: 'center', marginRight: ESPACE.m,
        }}>
          <Texte style={{ fontSize: 20 }}>📦</Texte>
        </View>
        <View style={{ flex: 1, paddingRight: ESPACE.m }}>
          <Texte variante="mono" style={{ fontSize: 14.5 }}>{x.numero}</Texte>
          {!!x.description && (
            <Texte variante="petit" ton="doux" numberOfLines={1} style={{ marginTop: 2 }}>
              {x.description}
            </Texte>
          )}
        </View>
        <Badge statut={x.statut} />
      </View>
    </Carte>
  );
}

export default function MesColis() {
  const { c } = useTheme();
  const { t } = useLangue();
  const { profil } = useSession();
  const router = useRouter();
  const bords = useSafeAreaInsets();

  const [colis, setColis] = useState<Colis[]>([]);
  const [chargement, setChargement] = useState(true);
  const [rafraichit, setRafraichit] = useState(false);
  const [erreur, setErreur] = useState('');
  const [recherche, setRecherche] = useState('');

  const charger = useCallback(() => {
    mesColis()
      .then((d) => { setColis(d); setErreur(''); })
      .catch(() => setErreur(t('erreurGenerale')))
      .finally(() => { setChargement(false); setRafraichit(false); });
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

  /* Le colis mis en avant : le premier qui n'est pas encore livré. */
  const encours = useMemo(
    () => (recherche ? null : liste.find((x) => x.statut !== 'livre') ?? null),
    [liste, recherche]);
  const reste = useMemo(
    () => (encours ? liste.filter((x) => x.id !== encours.id) : liste),
    [liste, encours]);

  if (chargement) {
    return (
      <View style={{ flex: 1, backgroundColor: c.fond, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={c.accent} size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.fond }}>
      {/* Le halo de la marque, signature de la refonte. */}
      <LinearGradient colors={[...c.halo]} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 320 }} />
      <FlatList
        data={encours ? reste : liste}
        keyExtractor={(x) => x.id}
        contentContainerStyle={{ padding: ESPACE.xl, paddingTop: bords.top + ESPACE.l, paddingBottom: 140 }}
        refreshControl={
          <RefreshControl refreshing={rafraichit} onRefresh={() => { setRafraichit(true); charger(); }}
            tintColor={c.accent} colors={[c.accent]} />
        }
        ListHeaderComponent={
          <View style={{ marginBottom: ESPACE.l }}>
            <Texte variante="titreXL">{t('mesColis')}</Texte>
            {!!profil?.code && (
              <Texte variante="mono" ton="doux" style={{ marginTop: 4 }}>
                {t('identifiant')} · {profil.code}
              </Texte>
            )}

            {colis.length > 3 && (
              <View style={{
                flexDirection: 'row', alignItems: 'center', marginTop: ESPACE.l,
                backgroundColor: c.surface, borderRadius: ARRONDI.rond,
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
                    paddingVertical: 12, paddingHorizontal: ESPACE.m,
                  }}
                />
              </View>
            )}

            {!!erreur && (
              <Texte variante="petit" style={{ color: c.statuts.action.texte, marginTop: ESPACE.m }}>{erreur}</Texte>
            )}

            {/* Le colis en cours, en vedette : jauge de parcours et destination. */}
            {encours && (
              <Carte haut style={{ marginTop: ESPACE.l, marginBottom: ESPACE.xl }}>
                <Pressable onPress={() => router.push(`/colis/${encours.id}`)}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: ESPACE.xl }}>
                    <View style={{
                      width: 46, height: 46, borderRadius: 23, backgroundColor: c.pastille,
                      alignItems: 'center', justifyContent: 'center', marginRight: ESPACE.m,
                    }}>
                      <Texte style={{ fontSize: 20 }}>🚚</Texte>
                    </View>
                    <View style={{ flex: 1, paddingRight: ESPACE.m }}>
                      <Texte variante="etiquette" ton="doux">{t('numColis')}</Texte>
                      <Texte variante="monoGrand" style={{ fontSize: 18, marginTop: 2 }}>{encours.numero}</Texte>
                    </View>
                    <Badge statut={encours.statut} />
                  </View>

                  <Jauge statut={encours.statut} />

                  <View style={{
                    flexDirection: 'row', justifyContent: 'space-between',
                    marginTop: ESPACE.l, paddingTop: ESPACE.m, borderTopWidth: 1, borderTopColor: c.bordure,
                  }}>
                    <View style={{ flex: 1, paddingRight: ESPACE.m }}>
                      <Texte variante="etiquette" ton="doux">{t('destinataire')}</Texte>
                      <Texte variante="corpsFort" numberOfLines={1} style={{ marginTop: 2 }}>
                        {encours.destinataire || '—'}
                      </Texte>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                      <Texte variante="etiquette" ton="doux">{t('destination')}</Texte>
                      <Texte variante="corpsFort" numberOfLines={1} style={{ marginTop: 2 }}>
                        {encours.ville_destination || '—'}
                      </Texte>
                    </View>
                  </View>
                </Pressable>
              </Carte>
            )}

            {encours && reste.length > 0 && (
              <Texte variante="titre" style={{ marginBottom: ESPACE.m }}>{t('recents')}</Texte>
            )}
          </View>
        }
        ListEmptyComponent={
          recherche
            ? <Vide titre={t('aucunResultat')} detail="" icone="⌕" />
            : <Vide titre={t('aucunColis')} detail={t('aucunColisDetail')} />
        }
        renderItem={({ item }) => (
          <LigneColis colis={item} surPression={() => router.push(`/colis/${item.id}`)} />
        )}
      />
    </View>
  );
}
