/* ==========================================================================
   Le détail d'un colis — l'écran du suivi
   --------------------------------------------------------------------------
   Refonte collée à l'écran « Tracking Details » de la maquette, aux couleurs
   de la marque : retour + titre sur le halo, libellés « N° de suivi » /
   « Statut » au-dessus du numéro copiable et de la pastille, axe De → Vers
   avec la barre de progression entre les deux valeurs, dates séparées par un
   pointillé, trois colonnes de faits en rouge, parcours en frise sur carte
   rouge, et grand bouton pilule « Suivi en direct » qui recharge l'écran.
   ========================================================================== */
import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

import { unColis, parcours, surveiller } from '../../api/donnees';
import type { Colis, Etape } from '../../api/supabase';
import { useLangue } from '../../i18n';
import { useTheme } from '../../design/useTheme';
import { ESPACE, ARRONDI, ETAPES } from '../../design/theme';
import { Texte } from '../../design/composants/Texte';
import { Badge } from '../../design/composants/Badge';
import { Frise } from '../../design/composants/Frise';

/* Une colonne « intitulé / valeur » de la maquette ; la valeur peut se
   colorer comme les liens bleus de la référence — en rouge ici. */
function Colonne({ intitule, valeur, teinte }: { intitule: string; valeur?: string | null; teinte?: boolean }) {
  if (!valeur) return null;
  return (
    <View style={{ flex: 1 }}>
      <Texte variante="etiquette" ton="doux">{intitule}</Texte>
      <Texte variante="corpsFort" ton={teinte ? 'accent' : 'normal'} numberOfLines={2} style={{ marginTop: 4 }}>
        {valeur}
      </Texte>
    </View>
  );
}

export default function DetailColis() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { c } = useTheme();
  const { t, langue } = useLangue();
  const router = useRouter();
  const bords = useSafeAreaInsets();

  const [colis, setColis] = useState<Colis | null>(null);
  const [etapes, setEtapes] = useState<Etape[]>([]);
  const [chargement, setChargement] = useState(true);
  const [copie, setCopie] = useState(false);

  const charger = useCallback(() => {
    const travail = id
      ? Promise.all([unColis(id), parcours(id)])
        .then(([c1, e1]) => { setColis(c1); setEtapes(e1); })
      : Promise.resolve();
    /* Les setState vivent dans des rappels de promesse, jamais dans le corps
       de l'effet : le compilateur React l'exige. */
    travail.finally(() => setChargement(false));
  }, [id]);

  useEffect(() => { charger(); }, [charger]);
  useEffect(() => surveiller((quoi) => { if (quoi === 'colis') charger(); }), [charger]);

  async function copierNumero() {
    if (!colis) return;
    await Clipboard.setStringAsync(colis.numero);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setCopie(true);
    setTimeout(() => setCopie(false), 1600);
  }

  function suiviEnDirect() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setChargement(true);
    charger();
  }

  if (chargement) {
    return (
      <View style={{ flex: 1, backgroundColor: c.fond, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={c.accent} size="large" />
      </View>
    );
  }

  if (!colis) {
    return (
      <View style={{ flex: 1, backgroundColor: c.fond, alignItems: 'center', justifyContent: 'center', padding: ESPACE.xl }}>
        <Texte variante="corps" ton="doux">{t('erreurGenerale')}</Texte>
      </View>
    );
  }

  const dateLongue = (iso: string | null) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleDateString(langue, { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return '—'; }
  };

  const lieu = [colis.ville_destination, colis.pays_destination].filter(Boolean).join(', ');
  const bloque = colis.statut === 'action';
  const rangAtteint = bloque
    ? etapes.reduce((max, e) => Math.max(max, ETAPES[e.statut] ?? 0), 1)
    : (ETAPES[colis.statut] ?? 1);

  return (
    <View style={{ flex: 1, backgroundColor: c.fond }}>
      <LinearGradient colors={[...c.halo]} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 420 }} />
      <ScrollView contentContainerStyle={{ padding: ESPACE.xl, paddingTop: bords.top + ESPACE.s, paddingBottom: ESPACE.xxxl }}>
        {/* Retour + titre, comme l'en-tête de la maquette. */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: ESPACE.xxl }}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={{
              width: 42, height: 42, borderRadius: 21, backgroundColor: c.surface,
              borderWidth: 1, borderColor: c.bordure,
              alignItems: 'center', justifyContent: 'center', marginRight: ESPACE.m,
            }}
          >
            <Texte style={{ fontSize: 19, color: c.texte, marginTop: -2 }}>‹</Texte>
          </Pressable>
          <Texte variante="titre">{t('suivi')}</Texte>
        </View>

        {/* « N° de suivi » / « Statut » : le numéro copiable et la pastille. */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: ESPACE.xl }}>
          <View style={{ flex: 1, paddingRight: ESPACE.m }}>
            <Texte variante="etiquette" ton="doux" style={{ marginBottom: 6 }}>{t('numColis')}</Texte>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Texte variante="monoGrand" style={{ fontSize: 23 }}>{colis.numero}</Texte>
              <Pressable onPress={copierNumero} hitSlop={10} style={{
                width: 34, height: 34, borderRadius: 17, backgroundColor: c.pastille,
                alignItems: 'center', justifyContent: 'center', marginLeft: ESPACE.m,
              }}>
                <Texte style={{ fontSize: 15, color: copie ? c.lien : c.texte }}>{copie ? '✓' : '⧉'}</Texte>
              </Pressable>
            </View>
            {copie && <Texte variante="petit" ton="accent" style={{ marginTop: 2 }}>{t('copie')}</Texte>}
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Texte variante="etiquette" ton="doux" style={{ marginBottom: 6 }}>{t('statut')}</Texte>
            <Badge statut={colis.statut} grand />
          </View>
        </View>

        {!!colis.description && (
          <Texte variante="corps" ton="doux" style={{ marginTop: -ESPACE.m, marginBottom: ESPACE.l }}>
            {colis.description}
          </Texte>
        )}

        {/* De → Vers : libellés, puis valeurs en rouge autour de la barre. */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: ESPACE.s }}>
          <Texte variante="petit" ton="doux">{t('de')}</Texte>
          <Texte variante="petit" ton="doux">{t('vers')}</Texte>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: ESPACE.xl }}>
          <Texte variante="corpsFort" ton="accent" numberOfLines={1} style={{ flex: 1, paddingRight: ESPACE.m }}>
            {colis.expediteur || '—'}
          </Texte>
          <View style={{ flex: 1.4, height: 6, borderRadius: 3, backgroundColor: c.bordure, overflow: 'hidden' }}>
            <View style={{
              height: 6, borderRadius: 3, backgroundColor: c.accent,
              width: `${Math.round((rangAtteint / 4) * 100)}%`,
            }} />
          </View>
          <Texte variante="corpsFort" ton="accent" numberOfLines={1} style={{ flex: 1, paddingLeft: ESPACE.m, textAlign: 'right' }}>
            {lieu || colis.adresse_livraison || '—'}
          </Texte>
        </View>

        {/* Les deux dates, séparées par un pointillé comme la maquette. */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: ESPACE.s }}>
          <Texte variante="petit" ton="doux">{t('enregistreLe')}</Texte>
          <Texte variante="petit" ton="doux">{t('misAJour')}</Texte>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: ESPACE.xl }}>
          <Texte variante="corps">{dateLongue(colis.cree_le)}</Texte>
          <View style={{
            flex: 1, marginHorizontal: ESPACE.m,
            borderTopWidth: 1, borderStyle: 'dashed', borderColor: c.bordureFranche,
          }} />
          <Texte variante="corps">{dateLongue(colis.maj_le || colis.cree_le)}</Texte>
        </View>

        {/* Les trois colonnes de faits, valeurs teintées comme la maquette. */}
        <View style={{ flexDirection: 'row', marginBottom: ESPACE.xxl }}>
          <Colonne intitule={t('expediteur')} valeur={colis.expediteur} teinte />
          <Colonne intitule={t('destinataire')} valeur={colis.destinataire} teinte />
          <Colonne intitule={t('poids')} valeur={colis.poids_lb ? `${colis.poids_lb} lb` : null} teinte />
        </View>

        {/* Le parcours, sur carte rouge. */}
        <View style={{ marginBottom: ESPACE.xl }}>
          <Frise statut={colis.statut} etapes={etapes} />
        </View>

        {/* Le grand bouton pilule, comme « Live Tracking ». */}
        <Pressable
          onPress={suiviEnDirect}
          style={({ pressed }) => [{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            borderRadius: ARRONDI.rond, borderWidth: 1.5, borderColor: c.accent,
            paddingVertical: 15, minHeight: 54,
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.985 : 1 }],
          }]}
        >
          <Texte variante="corpsFort" ton="accent" style={{ fontSize: 15.5 }}>
            ⦿  {t('suiviEnDirect')}
          </Texte>
        </Pressable>
      </ScrollView>
    </View>
  );
}
