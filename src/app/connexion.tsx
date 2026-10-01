/* ==========================================================================
   Écran de connexion — la première impression
   --------------------------------------------------------------------------
   Fond très sombre, dégradé rouge en haut : le logo se détache sans qu'on
   ait besoin d'un bandeau. Deux champs, un bouton, rien d'autre au premier
   coup d'œil. Les chemins secondaires (créer un compte, mot de passe oublié)
   restent accessibles mais ne disputent pas la place au geste principal.
   ========================================================================== */
import React, { useState } from 'react';
import { View, Image, ScrollView, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { supabase } from '../api/supabase';
import { useLangue } from '../i18n';
import { useTheme } from '../design/useTheme';
import { ESPACE, MARQUE } from '../design/theme';
import { Texte } from '../design/composants/Texte';
import { Champ } from '../design/composants/Champ';
import { Bouton } from '../design/composants/Bouton';

export default function Connexion() {
  const { c, sombre } = useTheme();
  const { t } = useLangue();
  const router = useRouter();
  const bords = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [occupe, setOccupe] = useState(false);
  const [erreur, setErreur] = useState('');

  async function entrer() {
    setErreur('');
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

  return (
    <View style={{ flex: 1, backgroundColor: c.fond }}>
      {/* Lueur rouge en haut d'écran : la marque, sans bandeau. */}
      <LinearGradient
        colors={[MARQUE.rouge + '38', MARQUE.rouge + '10', 'transparent']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 360 }}
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: ESPACE.xxl, paddingTop: bords.top + ESPACE.xxxl }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Le logo d'origine a un texte sombre : il disparaîtrait sur le
              fond noir. La variante claire ne sert qu'au thème sombre. */}
          <Image
            source={sombre
              ? require('../../assets/images/ses-logo-sombre.png')
              : require('../../assets/images/ses-logo.png')}
            style={{ width: 168, height: 56, resizeMode: 'contain', marginBottom: ESPACE.xxl }}
          />

          <Texte variante="titreXL">{t('bonjour')}</Texte>
          <Texte variante="corps" ton="doux" style={{ marginTop: 6, marginBottom: ESPACE.xxl }}>
            {t('sousTitreConnexion')}
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
  );
}
