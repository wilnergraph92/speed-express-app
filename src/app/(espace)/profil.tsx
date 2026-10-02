/* ==========================================================================
   Profil — compte, langue, notifications
   --------------------------------------------------------------------------
   Refonte : halo de la marque, cartes douces, langues en pilules dont la
   choisie est rouge pleine. Peu de réglages, et aucun qui ne serve. Le choix
   de la langue est ici parce qu'il change tout l'écran : le client le trouve
   là où il s'attend à le trouver, pas caché dans un menu.
   ========================================================================== */
import React, { useEffect, useState } from 'react';
import { View, ScrollView, Pressable, Switch, Linking, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Constants from 'expo-constants';

import { useSession } from '../../api/session';
import { activerNotifications, jetonDeCetAppareil, retirerAppareil } from '../../api/notifications';
import { useLangue, LANGUES, NOMS_LANGUES, type Langue } from '../../i18n';
import { useTheme } from '../../design/useTheme';
import { ESPACE, ARRONDI } from '../../design/theme';
import { Texte } from '../../design/composants/Texte';
import { Carte } from '../../design/composants/Carte';
import { Bouton } from '../../design/composants/Bouton';

const WHATSAPP = '18292653727';
const TELEPHONE = '+18292653727';

function Ligne({ intitule, valeur }: { intitule: string; valeur?: string | null }) {
  const { c } = useTheme();
  if (!valeur) return null;
  return (
    <View style={{
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      paddingVertical: ESPACE.m, borderBottomWidth: 1, borderBottomColor: c.bordure,
    }}>
      <Texte variante="petit" ton="doux">{intitule}</Texte>
      <Texte variante="corpsFort" style={{ flex: 1, textAlign: 'right' }} numberOfLines={1}>{valeur}</Texte>
    </View>
  );
}

export default function Profil() {
  const { c } = useTheme();
  const { t, langue, changerLangue } = useLangue();
  const { profil, session, deconnecter } = useSession();
  const bords = useSafeAreaInsets();

  const [notifs, setNotifs] = useState(false);
  const [jeton, setJeton] = useState<string | null>(null);

  /* On n'allume pas l'interrupteur tant qu'on n'a pas vérifié que le
     téléphone a bien accordé l'autorisation. */
  useEffect(() => {
    jetonDeCetAppareil().then((j) => { setJeton(j); setNotifs(!!j); }).catch(() => {});
  }, []);

  async function basculerNotifs(valeur: boolean) {
    Haptics.selectionAsync().catch(() => {});
    if (valeur && session) {
      const j = await activerNotifications(session.user.id).catch(() => null);
      setJeton(j); setNotifs(!!j);
      if (!j) Alert.alert(t('notifications'), t('erreurGenerale'));
    } else {
      if (jeton) await retirerAppareil(jeton).catch(() => {});
      setNotifs(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.fond }}>
      <LinearGradient colors={[...c.halo]} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 300 }} />
      <ScrollView contentContainerStyle={{ padding: ESPACE.xl, paddingTop: bords.top + ESPACE.l, paddingBottom: 140 }}>
        <Texte variante="titreXL" style={{ marginBottom: ESPACE.xl }}>{t('profil')}</Texte>

        {/* Le compte */}
        <Carte haut style={{ marginBottom: ESPACE.l }}>
          <Texte variante="etiquette" ton="doux">{t('identifiant')}</Texte>
          <Texte variante="monoGrand" style={{ marginTop: 4, marginBottom: ESPACE.m }}>{profil?.code || '—'}</Texte>
          <Ligne intitule={t('nomComplet')} valeur={profil?.nom_complet} />
          <Ligne intitule={t('email')} valeur={profil?.email || session?.user.email} />
          <Ligne intitule={t('telephone')} valeur={profil?.telephone} />
          <Ligne intitule={t('ville')} valeur={profil?.ville} />
        </Carte>

        {/* Les notifications */}
        <Carte style={{ marginBottom: ESPACE.l }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, paddingRight: ESPACE.l }}>
              <Texte variante="corpsFort">{t('notifications')}</Texte>
              <Texte variante="petit" ton="doux" style={{ marginTop: 2 }}>{t('notificationsDetail')}</Texte>
            </View>
            <Switch
              value={notifs}
              onValueChange={basculerNotifs}
              trackColor={{ false: c.bordureFranche, true: c.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Carte>

        {/* La langue */}
        <Carte style={{ marginBottom: ESPACE.l }}>
          <Texte variante="etiquette" ton="doux" style={{ marginBottom: ESPACE.m }}>{t('langue')}</Texte>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ESPACE.s }}>
            {LANGUES.map((l) => {
              const choisie = l === langue;
              return (
                <Pressable
                  key={l}
                  onPress={() => { Haptics.selectionAsync().catch(() => {}); changerLangue(l as Langue); }}
                  style={{
                    paddingVertical: 9, paddingHorizontal: ESPACE.l,
                    borderRadius: ARRONDI.rond,
                    backgroundColor: choisie ? c.accent : c.surface,
                    borderWidth: 1, borderColor: choisie ? c.accent : c.bordure,
                  }}
                >
                  <Texte variante="petit" style={{ color: choisie ? c.accentTexte : c.texteDoux, fontSize: 13.5 }}>
                    {NOMS_LANGUES[l as Langue]}
                  </Texte>
                </Pressable>
              );
            })}
          </View>
        </Carte>

        {/* L'aide */}
        <Carte style={{ marginBottom: ESPACE.xl }}>
          <Texte variante="etiquette" ton="doux" style={{ marginBottom: ESPACE.m }}>{t('aide')}</Texte>
          <Pressable onPress={() => Linking.openURL(`https://wa.me/${WHATSAPP}`)} style={{ paddingVertical: ESPACE.s }}>
            <Texte variante="corpsFort" ton="accent">{t('ecrireWhatsApp')}</Texte>
          </Pressable>
          <Pressable onPress={() => Linking.openURL(`tel:${TELEPHONE}`)} style={{ paddingVertical: ESPACE.s }}>
            <Texte variante="corpsFort" ton="accent">{t('appeler')}</Texte>
          </Pressable>
        </Carte>

        <Bouton
          titre={t('seDeconnecter')}
          variante="contour"
          surPression={async () => {
            if (jeton) await retirerAppareil(jeton).catch(() => {});
            deconnecter();
          }}
        />

        <Texte variante="petit" ton="faible" style={{ textAlign: 'center', marginTop: ESPACE.xl }}>
          {t('version')} {Constants.expoConfig?.version || '1.0.0'}
        </Texte>
      </ScrollView>
    </View>
  );
}
