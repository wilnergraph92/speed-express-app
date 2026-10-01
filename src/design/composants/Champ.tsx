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
    <View style={{ marginBottom: ESPACE.l }}>
      <Texte variante="etiquette" ton="doux" style={{ marginBottom: 7, marginLeft: 2 }}>
        {etiquette}
      </Texte>
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: c.surface,
        /* La bordure s'allume à la saisie : sur un fond très sombre, c'est
           le seul repère qui dit où le doigt a atterri. */
        borderColor: actif ? c.accent : c.bordure,
        borderWidth: 1.5,
        borderRadius: ARRONDI.l,
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
            <Texte variante="petit" ton="accent">{visible ? '○' : '●'}</Texte>
          </Pressable>
        )}
      </View>
    </View>
  );
}
