/* Les trois onglets de l'espace client. Barre translucide très sombre, sans
   libellé superflu : trois destinations, trois icônes, le nom dessous. */
import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, type ColorValue } from 'react-native';
import { useLangue } from '../../i18n';
import { useTheme } from '../../design/useTheme';
import { POLICES } from '../../design/theme';
import { Texte } from '../../design/composants/Texte';

function Icone({ signe, couleur }: { signe: string; couleur: ColorValue }) {
  return <Texte style={{ fontSize: 21, color: couleur, lineHeight: 25 }}>{signe}</Texte>;
}

export default function Onglets() {
  const { c } = useTheme();
  const { t } = useLangue();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.accent,
        tabBarInactiveTintColor: c.texteFaible,
        tabBarStyle: {
          backgroundColor: c.fondHaut,
          borderTopColor: c.bordure,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 86 : 66,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontFamily: POLICES.texteDemi, fontSize: 11.5, marginTop: 2 },
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
