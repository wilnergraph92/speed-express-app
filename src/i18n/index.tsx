/* ==========================================================================
   Speed Express Shipping — choix de la langue
   --------------------------------------------------------------------------
   Au premier lancement, l'application prend la langue du téléphone si elle
   fait partie des quatre proposées, et le français sinon. Le choix du client
   est ensuite retenu : il prime toujours sur celui du système.
   ========================================================================== */
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import textes, { LANGUES, type Langue, type Cle } from './textes';

const CLE_STOCKAGE = 'ses-langue';

/* La langue du téléphone, ramenée à l'une des quatre. Le créole haïtien se
   déclare « ht », mais certains systèmes renvoient « ht-HT » : on ne garde
   que les deux premières lettres. */
function langueDuTelephone(): Langue {
  const codes = getLocales().map((l) => (l.languageCode || '').slice(0, 2).toLowerCase());
  const trouvee = codes.find((c) => (LANGUES as readonly string[]).includes(c));
  return (trouvee as Langue) || 'fr';
}

type Contexte = {
  langue: Langue;
  t: (cle: Cle) => string;
  changerLangue: (l: Langue) => void;
  prete: boolean;
};

const Ctx = createContext<Contexte>({
  langue: 'fr', t: (c) => textes.fr[c], changerLangue: () => {}, prete: false,
});

export function FournisseurLangue({ children }: { children: React.ReactNode }) {
  const [langue, setLangue] = useState<Langue>('fr');
  const [prete, setPrete] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(CLE_STOCKAGE)
      .then((retenue) => {
        setLangue(retenue && (LANGUES as readonly string[]).includes(retenue)
          ? (retenue as Langue)
          : langueDuTelephone());
      })
      /* Un stockage illisible ne doit pas empêcher l'application de démarrer :
         on retombe sur la langue du téléphone. */
      .catch(() => setLangue(langueDuTelephone()))
      .finally(() => setPrete(true));
  }, []);

  const changerLangue = useCallback((l: Langue) => {
    setLangue(l);
    AsyncStorage.setItem(CLE_STOCKAGE, l).catch(() => {});
  }, []);

  const t = useCallback((cle: Cle) => textes[langue][cle] ?? textes.fr[cle], [langue]);

  return <Ctx.Provider value={{ langue, t, changerLangue, prete }}>{children}</Ctx.Provider>;
}

export const useLangue = () => useContext(Ctx);
export { LANGUES, NOMS_LANGUES, type Langue } from './textes';
