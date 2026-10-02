/* ==========================================================================
   Création de compte
   --------------------------------------------------------------------------
   Même mécanique que le site : Supabase crée le compte, et la base attribue
   elle-même l'identifiant client (SES-00000). L'application ne choisit
   aucun numéro — deux clients créés en même temps depuis deux appareils
   auraient pu recevoir le même.

   Le lien de confirmation renvoie vers l'espace client du site : il
   fonctionne même si le client ouvre son e-mail sur un autre appareil, où
   l'application n'est pas installée.
   ========================================================================== */
import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { supabase } from '../api/supabase';
import { useLangue } from '../i18n';
import { useTheme, FournisseurTheme } from '../design/useTheme';
import { ESPACE } from '../design/theme';
import { Texte } from '../design/composants/Texte';
import { Champ } from '../design/composants/Champ';
import { Bouton } from '../design/composants/Bouton';

const RETOUR_SITE = 'https://wilnergraph92.github.io/speed-express-site/espace-client.html';

export default function Inscription() {
  const { c } = useTheme();
  const { t, langue } = useLangue();
  const router = useRouter();
  const bords = useSafeAreaInsets();

  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [occupe, setOccupe] = useState(false);
  const [erreur, setErreur] = useState('');
  const [faite, setFaite] = useState(false);

  async function creer() {
    setErreur('');
    setOccupe(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: motDePasse,
      options: {
        emailRedirectTo: RETOUR_SITE,
        data: { nom_complet: nom.trim().slice(0, 120), telephone: telephone.trim(), langue },
      },
    });
    setOccupe(false);
    if (error) setErreur(error.message);
    else setFaite(true);
  }

  return (
    <FournisseurTheme force="light">
      <View style={{ flex: 1, backgroundColor: c.fond }}>
      {/* Le halo de la marque, comme sur l'écran de connexion. */}
      <LinearGradient
        colors={[...c.halo]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 360 }}
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: ESPACE.xxl, paddingTop: bords.top + ESPACE.xl }}
          keyboardShouldPersistTaps="handled"
        >
          <Texte variante="titreXL">{t('creerCompte')}</Texte>
          <Texte variante="corps" ton="doux" style={{ marginTop: 6, marginBottom: ESPACE.xxl }}>
            {t('sousTitreConnexion')}
          </Texte>

          {faite ? (
            <View style={{
              backgroundColor: c.statuts.disponible.fond, borderColor: c.statuts.disponible.trait,
              borderWidth: 1, borderRadius: 16, padding: ESPACE.xl,
            }}>
              <Texte variante="corpsFort" style={{ color: c.statuts.disponible.texte }}>
                {t('inscriptionFaite')}
              </Texte>
            </View>
          ) : (
            <>
              <Champ etiquette={t('nomComplet')} value={nom} onChangeText={setNom} autoComplete="name" />
              <Champ etiquette={t('email')} value={email} onChangeText={setEmail}
                autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
              <Champ etiquette={t('telephone')} value={telephone} onChangeText={setTelephone}
                keyboardType="phone-pad" autoComplete="tel" />
              <Champ etiquette={t('motDePasse')} value={motDePasse} onChangeText={setMotDePasse}
                secret autoComplete="new-password" />

              {!!erreur && (
                <View style={{
                  backgroundColor: c.statuts.action.fond, borderColor: c.statuts.action.trait,
                  borderWidth: 1, borderRadius: 14, padding: ESPACE.m, marginBottom: ESPACE.l,
                }}>
                  <Texte variante="petit" style={{ color: c.statuts.action.texte }}>{erreur}</Texte>
                </View>
              )}

              <Bouton titre={t('creerCompte')} surPression={creer} occupe={occupe}
                inactif={!nom.trim() || !email.trim() || motDePasse.length < 8} />
            </>
          )}

          <Pressable onPress={() => router.back()} style={{ marginTop: ESPACE.xxl, alignItems: 'center' }} hitSlop={10}>
            <Texte variante="corps" ton="doux">
              {t('dejaUnCompte')} <Texte variante="corpsFort" ton="accent">{t('seConnecter')}</Texte>
            </Texte>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
      </View>
    </FournisseurTheme>
  );
}
