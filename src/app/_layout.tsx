/* ==========================================================================
   Speed Express Shipping — racine de l'application
   --------------------------------------------------------------------------
   Trois choses se mettent en place ici, dans cet ordre : les polices de la
   marque, la langue, la session. L'écran de démarrage reste affiché tant que
   les trois ne sont pas prêtes — sans quoi le client verrait un instant la
   police par défaut du téléphone, puis un saut de mise en page.
   ========================================================================== */
import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Saira_700Bold, Saira_800ExtraBold } from '@expo-google-fonts/saira';
import { Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { IBMPlexMono_500Medium } from '@expo-google-fonts/ibm-plex-mono';

import { FournisseurLangue, useLangue } from '../i18n';
import { FournisseurSession, useSession } from '../api/session';
import { useTheme } from '../design/useTheme';

SplashScreen.preventAutoHideAsync().catch(() => {});

/* Aiguillage : connecté → l'espace, déconnecté → la connexion. Tant que la
   session n'est pas lue, on ne décide rien : rediriger trop tôt ferait
   clignoter l'écran de connexion devant un client déjà identifié. */
function Aiguillage() {
  const { session, prete: sessionPrete } = useSession();
  const { prete: languePrete } = useLangue();
  const { c } = useTheme();
  const segments = useSegments();
  const router = useRouter();

  const prete = sessionPrete && languePrete;

  useEffect(() => {
    if (!prete) return;
    SplashScreen.hideAsync().catch(() => {});
    const dansEspace = segments[0] === '(espace)';
    if (session && !dansEspace) router.replace('/(espace)');
    else if (!session && dansEspace) router.replace('/connexion');
  }, [prete, session, segments, router]);

  if (!prete) return null;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.fond } }}>
      <Stack.Screen name="connexion" />
      <Stack.Screen name="inscription" />
      <Stack.Screen name="(espace)" />
      <Stack.Screen name="colis/[id]" options={{ presentation: 'card' }} />
    </Stack>
  );
}

export default function Racine() {
  const [policesPretes] = useFonts({
    Saira_700Bold, Saira_800ExtraBold,
    Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold,
    IBMPlexMono_500Medium,
  });

  if (!policesPretes) return null;

  return (
    <SafeAreaProvider>
      <FournisseurLangue>
        <FournisseurSession>
          <StatusBar style="auto" />
          <Aiguillage />
        </FournisseurSession>
      </FournisseurLangue>
    </SafeAreaProvider>
  );
}
