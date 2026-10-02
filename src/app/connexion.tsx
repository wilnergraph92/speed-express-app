/* ==========================================================================
   Écran de connexion — la première impression
   --------------------------------------------------------------------------
   Refonte sur le modèle de l'écran de référence : fond blanc, bande latérale
   rouge sur tout le bord gauche (avec son talon anthracite en bas), logo
   centré, phrase d'accueil, champs à étiquette sur la bordure, lien
   « Mot de passe oublié ? » aligné à droite, grand bouton rouge pleine
   largeur et bascule vers l'inscription. L'écran reste blanc même si le
   téléphone est en mode sombre : le logo y est posé tel quel, sur son fond
   d'origine. Le lien de récupération envoie un e-mail qui ramène vers
   l'espace client du site.
   ========================================================================== */
import React, { useState } from 'react';
import { View, Image, ScrollView, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { supabase } from '../api/supabase';
import { useLangue } from '../i18n';
import { useTheme, FournisseurTheme } from '../design/useTheme';
import { ESPACE, MARQUE } from '../design/theme';
import { Texte } from '../design/composants/Texte';
import { Champ } from '../design/composants/Champ';
import { Bouton } from '../design/composants/Bouton';

const BANDE = 26;
const RETOUR_SITE = 'https://wilnergraph92.github.io/speed-express-site/espace-client.html';

export default function Connexion() {
  const { c } = useTheme();
  const { t } = useLangue();
  const router = useRouter();
  const bords = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [occupe, setOccupe] = useState(false);
  const [erreur, setErreur] = useState('');
  const [info, setInfo] = useState('');

  async function entrer() {
    setErreur(''); setInfo('');
    setOccupe(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: motDePasse,
    });
    setOccupe(false);
    /* Un mot de passe refusé et une adresse inconnue donnent le même message :
       dire laquelle des deux est fausse renseignerait un inconnu sur
       l'existence d'un compte. */
    if (error) setErreur(t('identifiantsRefuses'));
    /* La redirection est faite par l'aiguillage dès que la session change. */
  }

  /* Récupération : le lien part vers l'adresse saisie et ramène au site. */
  async function oubli() {
    setErreur(''); setInfo('');
    if (!email.trim()) { setErreur(t('emailRequis')); return; }
    setOccupe(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: RETOUR_SITE,
    });
    setOccupe(false);
    if (error) setErreur(t('erreurGenerale'));
    else setInfo(t('lienEnvoye'));
  }

  return (
    <FournisseurTheme force="light">
      <View style={{ flex: 1, backgroundColor: c.fond }}>
      {/* La bande latérale rouge, signature de l'écran, et son talon sombre. */}
      <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: BANDE, backgroundColor: c.accent }} />
      <View style={{ position: 'absolute', left: 0, bottom: 0, width: BANDE, height: 64, backgroundColor: MARQUE.anthracite }} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1, justifyContent: 'center',
            paddingRight: ESPACE.xxl, paddingLeft: BANDE + ESPACE.xxl,
            paddingTop: bords.top + ESPACE.xxxl, paddingBottom: bords.bottom + ESPACE.xxxl,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Le logo tel quel, centré : l'écran est toujours blanc. */}
          <Image
            source={require('../../assets/images/ses-logo.png')}
            style={{ width: 220, height: 86, resizeMode: 'contain', alignSelf: 'center', marginBottom: ESPACE.xxl }}
          />

          <Texte variante="corps" ton="doux" style={{ textAlign: 'center', marginBottom: ESPACE.xxl }}>
            {t('connectezCompte')}
          </Texte>

          <Champ
            etiquette={t('email')}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholder="client@exemple.com"
          />
          <Champ
            etiquette={t('motDePasse')}
            value={motDePasse}
            onChangeText={setMotDePasse}
            secret
            autoComplete="current-password"
            placeholder="••••••••"
            onSubmitEditing={entrer}
            returnKeyType="go"
          />

          <Pressable onPress={oubli} hitSlop={10} style={{ alignSelf: 'flex-end', marginTop: -ESPACE.m, marginBottom: ESPACE.l }}>
            <Texte variante="corpsFort" ton="accent" style={{ fontSize: 13.5 }}>{t('motDePasseOublie')}</Texte>
          </Pressable>

          {!!info && (
            <View style={{
              backgroundColor: c.statuts.disponible.fond, borderColor: c.statuts.disponible.trait,
              borderWidth: 1, borderRadius: 14, padding: ESPACE.m, marginBottom: ESPACE.l,
            }}>
              <Texte variante="petit" style={{ color: c.statuts.disponible.texte }}>{info}</Texte>
            </View>
          )}
          {!!erreur && (
            <View style={{
              backgroundColor: c.statuts.action.fond, borderColor: c.statuts.action.trait,
              borderWidth: 1, borderRadius: 14, padding: ESPACE.m, marginBottom: ESPACE.l,
            }}>
              <Texte variante="petit" style={{ color: c.statuts.action.texte }}>{erreur}</Texte>
            </View>
          )}

          <Bouton titre={t('seConnecter')} surPression={entrer} occupe={occupe}
            inactif={!email.trim() || !motDePasse} />

          <Pressable onPress={() => router.push('/inscription')} style={{ marginTop: ESPACE.xxl, alignItems: 'center' }} hitSlop={10}>
            <Texte variante="corps" ton="doux">
              {t('pasDeCompte')} <Texte variante="corpsFort" ton="accent">{t('creerCompte')}</Texte>
            </Texte>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
      </View>
    </FournisseurTheme>
  );
}
