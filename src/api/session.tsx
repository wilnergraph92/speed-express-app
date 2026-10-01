/* ==========================================================================
   Speed Express Shipping — session du client
   --------------------------------------------------------------------------
   Une seule source de vérité pour « qui est connecté ». La session est
   gardée sur l'appareil : on ne redemande pas le mot de passe à chaque
   ouverture. Supabase renouvelle le jeton tout seul.
   ========================================================================== */
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, type Profil } from './supabase';

type Contexte = {
  session: Session | null;
  profil: Profil | null;
  prete: boolean;
  rafraichirProfil: () => Promise<void>;
  deconnecter: () => Promise<void>;
};

const Ctx = createContext<Contexte>({
  session: null, profil: null, prete: false,
  rafraichirProfil: async () => {}, deconnecter: async () => {},
});

export function FournisseurSession({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profil, setProfil] = useState<Profil | null>(null);
  const [prete, setPrete] = useState(false);

  const chargerProfil = useCallback(async (s: Session | null) => {
    if (!s) { setProfil(null); return; }
    const { data } = await supabase
      .from('clients')
      .select('id,code,nom_complet,email,telephone,pays,ville,adresse')
      .eq('id', s.user.id)
      .maybeSingle();
    setProfil((data as Profil) ?? null);
  }, []);

  useEffect(() => {
    let vivant = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!vivant) return;
      setSession(data.session);
      chargerProfil(data.session).finally(() => vivant && setPrete(true));
    });

    /* Déconnexion, expiration, renouvellement : tout passe par ici, y
       compris quand c'est Supabase qui décide. */
    const { data: abonnement } = supabase.auth.onAuthStateChange((_evenement, s) => {
      if (!vivant) return;
      setSession(s);
      chargerProfil(s);
    });

    return () => { vivant = false; abonnement.subscription.unsubscribe(); };
  }, [chargerProfil]);

  const valeur: Contexte = {
    session, profil, prete,
    rafraichirProfil: () => chargerProfil(session),
    deconnecter: async () => { await supabase.auth.signOut(); },
  };

  return <Ctx.Provider value={valeur}>{children}</Ctx.Provider>;
}

export const useSession = () => useContext(Ctx);
