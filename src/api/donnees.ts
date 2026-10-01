/* ==========================================================================
   Speed Express Shipping — lecture des colis et des factures
   --------------------------------------------------------------------------
   Aucune requête ne filtre sur le client : c'est la base qui s'en charge,
   par ses règles de sécurité. Un client ne peut pas lire le colis d'un
   autre, même en modifiant l'application — la vérification est du côté
   serveur, pas ici.

   Le temps réel reprend exactement le mécanisme du site : dès que l'équipe
   change un statut dans le tableau de bord, l'écran du client se met à jour,
   sans qu'il ait à tirer la liste vers le bas.
   ========================================================================== */
import { supabase, type Colis, type Etape, type Facture } from './supabase';

export async function mesColis(): Promise<Colis[]> {
  const { data, error } = await supabase
    .from('colis')
    .select('id,numero,description,expediteur,destinataire,telephone_destinataire,poids_lb,tarif_lb,valeur_declaree,service,pays_destination,ville_destination,adresse_livraison,statut,lieu,cree_le,maj_le')
    .order('maj_le', { ascending: false, nullsFirst: false })
    .order('cree_le', { ascending: false });
  if (error) throw error;
  return (data as Colis[]) ?? [];
}

export async function unColis(id: string): Promise<Colis | null> {
  const { data, error } = await supabase
    .from('colis')
    .select('id,numero,description,expediteur,destinataire,telephone_destinataire,poids_lb,tarif_lb,valeur_declaree,service,pays_destination,ville_destination,adresse_livraison,statut,lieu,cree_le,maj_le')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return (data as Colis) ?? null;
}

/* Le parcours du colis, de la plus ancienne étape à la plus récente : c'est
   l'ordre dans lequel on le lit sur une frise. */
export async function parcours(colisId: string): Promise<Etape[]> {
  const { data, error } = await supabase
    .from('colis_historique')
    .select('id,colis_id,statut,lieu,cree_le')
    .eq('colis_id', colisId)
    .order('cree_le', { ascending: true });
  if (error) throw error;
  return (data as Etape[]) ?? [];
}

export async function mesFactures(): Promise<Facture[]> {
  const { data, error } = await supabase
    .from('factures')
    .select('id,numero,colis_id,montant,frais_service,montant_paye,devise,statut,groupee,lignes,echeance_le,cree_le')
    .order('cree_le', { ascending: false });
  if (error) throw error;
  return (data as Facture[]) ?? [];
}

export async function uneFacture(id: string): Promise<Facture | null> {
  const { data, error } = await supabase
    .from('factures')
    .select('id,numero,colis_id,montant,frais_service,montant_paye,devise,statut,groupee,lignes,echeance_le,cree_le')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return (data as Facture) ?? null;
}

export async function modifierProfil(id: string, champs: Record<string, string | null>) {
  const { error } = await supabase.from('clients').update(champs).eq('id', id);
  if (error) throw error;
}

/* Écoute les changements venus du tableau de bord. Rend une fonction à
   appeler pour se désabonner — un écran quitté qui garderait son canal
   ouvert finirait par en ouvrir des dizaines. */
export function surveiller(rappel: (quoi: 'colis' | 'factures') => void) {
  const canal = supabase
    .channel('ses-app-' + Math.random().toString(36).slice(2))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'colis' }, () => rappel('colis'))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'colis_historique' }, () => rappel('colis'))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'factures' }, () => rappel('factures'))
    .subscribe();
  return () => { supabase.removeChannel(canal); };
}

/* Les totaux d'une facture, calculés comme sur le site : le montant stocké
   est le grand total, frais de service compris. */
export function totaux(f: Facture) {
  const frais = Number(f.frais_service ?? 0);
  const grandTotal = Number(f.montant ?? 0);
  const paye = Number(f.montant_paye ?? 0);
  return {
    totalColis: Math.max(0, grandTotal - frais),
    frais,
    grandTotal,
    paye,
    balance: Math.max(0, grandTotal - paye),
    reglee: f.statut === 'payee' || grandTotal - paye <= 0,
  };
}
