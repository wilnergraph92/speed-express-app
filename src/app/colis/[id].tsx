/* ==========================================================================
   Le détail d'un colis — l'écran du suivi
   --------------------------------------------------------------------------
   Trois blocs, dans l'ordre où l'on se pose les questions : où en est-il,
   par où est-il passé, et qu'y a-t-il dedans. Le numéro se copie d'une
   pression : un client au téléphone avec l'équipe doit pouvoir le dicter
   sans le recopier à la main.
   ========================================================================== */
import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

import { unColis, parcours, surveiller } from '../../api/donnees';
import type { Colis, Etape } from '../../api/supabase';
import { useLangue } from '../../i18n';
import { useTheme } from '../../design/useTheme';
import { ESPACE, ARRONDI } from '../../design/theme';
import { Texte } from '../../design/composants/Texte';
import { Carte } from '../../design/composants/Carte';
import { Badge } from '../../design/composants/Badge';
import { Frise } from '../../design/composants/Frise';

/* Une ligne « intitulé / valeur ». Les valeurs vides ne s'affichent pas :
   une fiche à moitié remplie de tirets donne l'impression d'un défaut. */
function Ligne({ intitule, valeur, mono }: { intitule: string; valeur?: string | null; mono?: boolean }) {
  const { c } = useTheme();
  if (!valeur) return null;
  return (
    <View style={{
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
      paddingVertical: ESPACE.m, borderBottomWidth: 1, borderBottomColor: c.bordure,
    }}>
      <Texte variante="petit" ton="doux" style={{ flex: 1 }}>{intitule}</Texte>
      <Texte variante={mono ? 'mono' : 'corpsFort'} style={{ flex: 1.4, textAlign: 'right' }}>{valeur}</Texte>
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

  const charger = useCallback(async () => {
    if (!id) return;
    try {
      const [c1, e1] = await Promise.all([unColis(id), parcours(id)]);
      setColis(c1);
      setEtapes(e1);
    } finally {
      setChargement(false);
    }
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

  const dateLongue = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString(langue, { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  const lieu = [colis.ville_destination, colis.pays_destination].filter(Boolean).join(', ');

  return (
    <View style={{ flex: 1, backgroundColor: c.fond }}>
      <ScrollView contentContainerStyle={{ padding: ESPACE.xl, paddingTop: bords.top + ESPACE.s, paddingBottom: ESPACE.xxxl }}>
        <Pressable onPress={() => router.back()} hitSlop={14} style={{ marginBottom: ESPACE.l }}>
          <Texte variante="corps" ton="accent">‹  {t('mesColis')}</Texte>
        </Pressable>

        {/* Bloc d'en-tête : le statut d'abord, c'est la seule chose que le
            client vient vraiment vérifier. */}
        <Carte haut style={{ marginBottom: ESPACE.l }}>
          <Badge statut={colis.statut} grand />
          <Pressable onPress={copierNumero} style={{ marginTop: ESPACE.l }}>
            <Texte variante="monoGrand" style={{ fontSize: 23 }}>{colis.numero}</Texte>
            <Texte variante="petit" ton={copie ? 'accent' : 'faible'} style={{ marginTop: 3 }}>
              {copie ? t('copie') : '⧉'}
            </Texte>
          </Pressable>
          {!!colis.description && (
            <Texte variante="corps" ton="doux" style={{ marginTop: ESPACE.m }}>{colis.description}</Texte>
          )}
        </Carte>

        {/* Le parcours */}
        <Carte style={{ marginBottom: ESPACE.l }}>
          <Texte variante="etiquette" ton="doux" style={{ marginBottom: ESPACE.xl }}>{t('parcours')}</Texte>
          <Frise statut={colis.statut} etapes={etapes} />
        </Carte>

        {/* Les faits */}
        <Carte>
          <Texte variante="etiquette" ton="doux" style={{ marginBottom: ESPACE.s }}>{t('detail')}</Texte>
          <Ligne intitule={t('expediteur')} valeur={colis.expediteur} />
          <Ligne intitule={t('destinataire')} valeur={colis.destinataire} />
          <Ligne intitule={t('telephone')} valeur={colis.telephone_destinataire} mono />
          <Ligne intitule={t('destination')} valeur={lieu || colis.adresse_livraison} />
          <Ligne intitule={t('poids')} valeur={colis.poids_lb ? `${colis.poids_lb} lb` : null} />
          <Ligne intitule={t('enregistreLe')} valeur={dateLongue(colis.cree_le)} />
        </Carte>
      </ScrollView>
    </View>
  );
}
