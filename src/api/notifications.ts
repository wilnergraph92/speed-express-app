/* ==========================================================================
   Speed Express Shipping — notifications sur l'appareil
   --------------------------------------------------------------------------
   Le principe : l'appareil s'enregistre dans la table « appareils » avec un
   jeton fourni par Expo. Quand l'équipe change le statut d'un colis dans le
   tableau de bord, un déclencheur de la base appelle le service d'envoi
   d'Expo, qui pousse le message vers les appareils du client concerné.

   Rien n'est envoyé depuis l'application elle-même : c'est la base qui
   décide, parce qu'elle seule sait quand un statut change réellement.

   Le simulateur ne reçoit pas de notifications — il faut un vrai téléphone.
   On le dit ici plutôt que de laisser croire à une panne.
   ========================================================================== */
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { supabase } from './supabase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/* Demande l'autorisation et rend le jeton Expo de cet appareil, ou null si
   le client refuse — un refus n'est pas une erreur, l'application continue. */
export async function jetonDeCetAppareil(): Promise<string | null> {
  if (!Device.isDevice) return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('colis', {
      name: 'Suivi des colis',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 220, 110, 220],
      lightColor: '#E8121B',
    });
  }

  const { status: existant } = await Notifications.getPermissionsAsync();
  let accorde = existant;
  if (existant !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    accorde = status;
  }
  if (accorde !== 'granted') return null;

  /* L'identifiant du projet Expo est nécessaire depuis le SDK 49 ; sans lui
     le jeton est refusé silencieusement à la première compilation réelle. */
  const projet = Constants.expoConfig?.extra?.eas?.projectId
    ?? Constants.easConfig?.projectId;

  const { data } = await Notifications.getExpoPushTokenAsync(
    projet ? { projectId: projet } : undefined
  );
  return data ?? null;
}

/* Enregistre l'appareil pour ce client. Le même téléphone réinstallé reçoit
   un nouveau jeton : la clé primaire est le jeton, pas le client, et un
   client peut avoir plusieurs appareils. */
export async function enregistrerAppareil(clientId: string, jeton: string) {
  const { error } = await supabase.from('appareils').upsert({
    jeton,
    client_id: clientId,
    plateforme: Platform.OS,
    vu_le: new Date().toISOString(),
  }, { onConflict: 'jeton' });
  if (error) throw error;
}

export async function retirerAppareil(jeton: string) {
  await supabase.from('appareils').delete().eq('jeton', jeton);
}

/* Branche l'appareil au démarrage, une fois le client connu. Rend une
   fonction d'arrêt pour les écouteurs. */
export async function activerNotifications(clientId: string): Promise<string | null> {
  const jeton = await jetonDeCetAppareil();
  if (!jeton) return null;
  await enregistrerAppareil(clientId, jeton);
  return jeton;
}
