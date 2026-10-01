/* ==========================================================================
   Mes factures
   --------------------------------------------------------------------------
   En haut, la seule information qui compte vraiment : ce qui reste à payer,
   tous colis confondus. En dessous, le détail facture par facture.

   Les montants sont lus tels quels dans la base : l'application ne recalcule
   jamais un prix. Une facture émise est une pièce comptable — si elle dit
   310 $, elle dira 310 $ même si le tarif du colis a changé depuis.
   ========================================================================== */
import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { mesFactures, surveiller, totaux } from '../../api/donnees';
import type { Facture } from '../../api/supabase';
import { useLangue } from '../../i18n';
import { useTheme } from '../../design/useTheme';
import { ESPACE } from '../../design/theme';
import { Texte } from '../../design/composants/Texte';
import { Carte } from '../../design/composants/Carte';
import { Vide } from '../../design/composants/Vide';

export default function MesFactures() {
  const { c } = useTheme();
  const { t, langue } = useLangue();
  const bords = useSafeAreaInsets();

  const [factures, setFactures] = useState<Facture[]>([]);
  const [chargement, setChargement] = useState(true);
  const [rafraichit, setRafraichit] = useState(false);

  const charger = useCallback(async () => {
    try { setFactures(await mesFactures()); }
    catch { /* la liste précédente reste affichée plutôt qu'un écran vide */ }
    finally { setChargement(false); setRafraichit(false); }
  }, []);

  useEffect(() => { charger(); }, [charger]);
  useEffect(() => surveiller((quoi) => { if (quoi === 'factures') charger(); }), [charger]);

  const argent = (n: number, devise: string) => {
    try { return n.toLocaleString(langue, { style: 'currency', currency: devise, minimumFractionDigits: 2 }); }
    catch { return n.toFixed(2) + ' ' + devise; }
  };

  /* Le reste à payer, toutes factures confondues. */
  const duTotal = factures.reduce((s, f) => s + totaux(f).balance, 0);
  const devise = factures[0]?.devise || 'USD';

  if (chargement) {
    return (
      <View style={{ flex: 1, backgroundColor: c.fond, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={c.accent} size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.fond }}>
      <FlatList
        data={factures}
        keyExtractor={(f) => f.id}
        contentContainerStyle={{ padding: ESPACE.xl, paddingTop: bords.top + ESPACE.l, paddingBottom: ESPACE.xxxl }}
        refreshControl={
          <RefreshControl refreshing={rafraichit} onRefresh={() => { setRafraichit(true); charger(); }}
            tintColor={c.accent} colors={[c.accent]} />
        }
        ListHeaderComponent={
          <View style={{ marginBottom: ESPACE.xl }}>
            <Texte variante="titreXL" style={{ marginBottom: ESPACE.xl }}>{t('mesFactures')}</Texte>
            {factures.length > 0 && (
              <Carte haut>
                <Texte variante="etiquette" ton="doux">
                  {duTotal > 0 ? t('aRegler') : t('toutEstRegle')}
                </Texte>
                <Texte
                  variante="titreXL"
                  style={{ marginTop: 6, color: duTotal > 0 ? c.accent : c.succes }}
                >
                  {argent(duTotal, devise)}
                </Texte>
              </Carte>
            )}
          </View>
        }
        ListEmptyComponent={<Vide titre={t('aucuneFacture')} detail={t('aucuneFactureDetail')} icone="🧾" />}
        renderItem={({ item }) => {
          const T = totaux(item);
          return (
            <Carte style={{ marginBottom: ESPACE.m }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View>
                  <Texte variante="mono" ton="doux">{item.numero || '—'}</Texte>
                  <Texte variante="titre" style={{ marginTop: 4 }}>{argent(T.grandTotal, item.devise)}</Texte>
                </View>
                <View style={{
                  backgroundColor: T.reglee ? c.statuts.livre.fond : c.statuts.action.fond,
                  borderColor: T.reglee ? c.statuts.livre.trait : c.statuts.action.trait,
                  borderWidth: 1, borderRadius: 999, paddingVertical: 4.5, paddingHorizontal: ESPACE.m,
                }}>
                  <Texte variante="petit" style={{
                    color: T.reglee ? c.statuts.livre.texte : c.statuts.action.texte, fontSize: 12.5,
                  }}>
                    {T.reglee ? t('payee') : t('impayee')}
                  </Texte>
                </View>
              </View>

              <View style={{ marginTop: ESPACE.l, paddingTop: ESPACE.m, borderTopWidth: 1, borderTopColor: c.bordure }}>
                {[
                  [t('totalColis'), argent(T.totalColis, item.devise)],
                  [t('fraisService'), argent(T.frais, item.devise)],
                  [t('paye'), argent(T.paye, item.devise)],
                ].map(([intitule, valeur]) => (
                  <View key={intitule} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 }}>
                    <Texte variante="petit" ton="doux">{intitule}</Texte>
                    <Texte variante="petit">{valeur}</Texte>
                  </View>
                ))}
                {T.balance > 0 && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: ESPACE.s, marginTop: ESPACE.xs, borderTopWidth: 1, borderTopColor: c.bordure }}>
                    <Texte variante="corpsFort">{t('balance')}</Texte>
                    <Texte variante="corpsFort" ton="accent">{argent(T.balance, item.devise)}</Texte>
                  </View>
                )}
              </View>
            </Carte>
          );
        }}
      />
    </View>
  );
}
