/* Les trois onglets de l'espace client, version refonte : la barre devient
   une pilule flottante posée au-dessus du contenu, comme sur la maquette —
   fond de carte, grand arrondi, ombre douce, trois destinations. */
import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLangue } from '../../i18n';
import { useTheme } from '../../design/useTheme';
import { ESPACE, POLICES, ombre } from '../../design/theme';
import { Texte } from '../../design/composants/Texte';

function Icone({ signe, couleur }: { signe: string; couleur: ColorValue }) {
  return <Texte style={{ fontSize: 20, color: couleur, lineHeight: 24 }}>{signe}</Texte>;
}

export default function Onglets() {
  const { c, sombre } = useTheme();
  const { t } = useLangue();
  const bords = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.lien,
        tabBarInactiveTintColor: c.texteFaible,
        tabBarStyle: {
          position: 'absolute',
          left: ESPACE.l,
          right: ESPACE.l,
          bottom: bords.bottom + ESPACE.s,
          height: Platform.OS === 'ios' ? 78 : 68,
          borderRadius: 34,
          backgroundColor: c.fondHaut,
          borderTopWidth: 0,
          paddingTop: 8,
          /* La pilule flotte : ombre forte en clair, simple liseré en sombre. */
          ...(sombre
            ? { borderWidth: 1, borderColor: c.bordure }
            : ombre(c, 'forte')),
        },
        tabBarLabelStyle: { fontFamily: POLICES.texteDemi, fontSize: 11, marginTop: 2 },
      }}
    >
      <Tabs.Screen name="index" options={{
        title: t('mesColis'),
        tabBarIcon: ({ color }) => <Icone signe="📦" couleur={color} />,
      }} />
      <Tabs.Screen name="factures" options={{
        title: t('mesFactures'),
        tabBarIcon: ({ color }) => <Icone signe="🧾" couleur={color} />,
      }} />
      <Tabs.Screen name="profil" options={{
        title: t('profil'),
        tabBarIcon: ({ color }) => <Icone signe="👤" couleur={color} />,
      }} />
    </Tabs>
  );
}
