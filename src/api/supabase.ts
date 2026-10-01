/* ==========================================================================
   Speed Express Shipping — connexion à la base
   --------------------------------------------------------------------------
   Exactement le même projet Supabase que le site et le tableau de bord :
   un colis enregistré par l'équipe apparaît dans l'application sans aucune
   synchronisation à écrire. La sécurité au niveau des lignes fait le reste —
   un client ne peut lire que ses propres colis et ses propres factures.

   La clé ci-dessous est la clé « publishable ». Elle est publique par
   construction, comme celle du site : elle n'ouvre rien que les règles de
   sécurité n'autorisent déjà. La clé secrète n'a rien à faire ici.
   ========================================================================== */
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://ltbqqchtyzlyakcsxxis.supabase.co';
export const SUPABASE_CLE = 'sb_publishable_my2D1qeEVY2P1L0bO1mr4g_YOaF2sZf';

export const supabase = createClient(SUPABASE_URL, SUPABASE_CLE, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    /* Sur mobile il n'y a pas d'URL à relire : la session arrive par le
       lien profond, traité à part. */
    detectSessionInUrl: false,
  },
});

/* Les cinq statuts partagés avec le site. Une erreur de frappe ici ferait
   silencieusement disparaître des colis de la liste. */
export type Colis = {
  id: string;
  numero: string;
  description: string | null;
  expediteur: string | null;
  destinataire: string | null;
  telephone_destinataire: string | null;
  poids_lb: number | null;
  tarif_lb: number | null;
  valeur_declaree: number | null;
  service: string | null;
  pays_destination: string | null;
  ville_destination: string | null;
  adresse_livraison: string | null;
  statut: string;
  lieu: string | null;
  cree_le: string;
  maj_le: string | null;
};

export type Etape = {
  id: number | string;
  colis_id: string;
  statut: string;
  lieu: string | null;
  cree_le: string;
};

export type Facture = {
  id: string;
  numero: string | null;
  colis_id: string | null;
  montant: number;
  frais_service: number | null;
  montant_paye: number | null;
  devise: string;
  statut: string;
  groupee: boolean | null;
  lignes: unknown;
  echeance_le: string | null;
  cree_le: string;
};

export type Profil = {
  id: string;
  code: string | null;
  nom_complet: string | null;
  email: string | null;
  telephone: string | null;
  pays: string | null;
  ville: string | null;
  adresse: string | null;
};
