/* ==========================================================================
   Le champ de saisie « outlined » de la refonte
   --------------------------------------------------------------------------
   Comme sur la maquette de connexion : un contour arrondi posé sur le fond,
   et l'étiquette en petites capitales qui chevauche la bordure supérieure,
   découpée par un fond de la même couleur que l'écran. La bordure s'allume
   en rouge à la saisie : sur n'importe quel fond, c'est le repère qui dit où
   le doigt a atterri.
   ========================================================================== */
import React, { useState } from 'react';
import { View, TextInput, Pressable, type TextInputProps } from 'react-native';
import { ARRONDI, ESPACE, POLICES } from '../theme';
import { useTheme } from '../useTheme';
import { Texte } from './Texte';

type Props = TextInputProps & { etiquette: string; secret?: boolean };

export function Champ({ etiquette, secret, style, ...reste }: Props) {
  const { c } = useTheme();
  const [actif, setActif] = useState(false);
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ marginBottom: ESPACE.xl, marginTop: ESPACE.s }}>
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        borderColor: actif ? c.accent : c.bordureFranche,
        borderWidth: 1.5,
        borderRadius: ARRONDI.m,
      }}>
        <TextInput
          {...reste}
          secureTextEntry={secret && !visible}
          onFocus={(e) => { setActif(true); reste.onFocus?.(e); }}
          onBlur={(e) => { setActif(false); reste.onBlur?.(e); }}
          placeholderTextColor={c.texteFaible}
          style={[{
            flex: 1,
            color: c.texte,
            fontFamily: POLICES.texte,
            fontSize: 16,
            paddingVertical: 15,
            paddingHorizontal: ESPACE.l,
          }, style]}
        />
        {secret && (
          <Pressable onPress={() => setVisible((v) => !v)} hitSlop={12} style={{ paddingHorizontal: ESPACE.l }}>
            <Texte variante="petit" ton={visible ? 'accent' : 'faible'}>{visible ? '○' : '●'}</Texte>
          </Pressable>
        )}
      </View>
      {/* L'étiquette chevauche la bordure, fond raccord avec l'écran. */}
      <View
        pointerEvents="none"
        style={{ position: 'absolute', top: -8, left: 12, backgroundColor: c.fond, paddingHorizontal: 6 }}
      >
        <Texte variante="etiquette" ton="doux">{etiquette}</Texte>
      </View>
    </View>
  );
}
