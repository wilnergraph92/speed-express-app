/* Le thème suit le réglage du téléphone. Pas d'interrupteur dans
   l'application : un client qui a choisi le mode sombre pour tout son
   appareil ne veut pas le rechoisir ici. */
import { useColorScheme } from 'react-native';
import { THEMES, type Couleurs } from './theme';

export function useTheme(): { c: Couleurs; sombre: boolean } {
  const schema = useColorScheme();
  const sombre = schema !== 'light';
  return { c: sombre ? THEMES.sombre : THEMES.clair, sombre };
}
