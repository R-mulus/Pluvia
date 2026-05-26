/**
 * ✅ [PORTABILIDADE WEB CONCLUÍDA]
 * * MODIFICAÇÕES REALIZADAS PARA ADAPTAÇÃO WEB:
 * 1. LAYOUT FLUIDO (UX WEB): Removida a trava de largura máxima. O background agora ocupa 100% da tela para não quebrar o contraste de cores.
 * 2. MARGENS LATERAIS WEB: Adicionado 'md:px-16' para aumentar o respiro lateral em telas grandes (Desktop), afastando o conteúdo das bordas de forma elegante.
 */

import * as React from 'react'
import { ViewProps, View } from 'react-native';

export function Screen({ children, className = '', ...props }: ViewProps) {
  return (
    <View 
      // flex-1 e bg-bg garantem que a cor de fundo vá até o final da tela.
      // px-5 é o respiro do celular. md:px-16 é o respiro maior para monitores.
      className={`flex-1 bg-bg px-5 py-4 gap-4 md:px-16 ${className}`} 
      {...props}
    >
      {children}
    </View>
  );
}