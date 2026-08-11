/*
    ! SOLUCIONANDO O PROBLEMA DOS ALERTS NÃO FUNCIONAREM NA WEB
    -- solução provisória 
    -- necessário solução unitária de alerta
        -- estilizar alerta por alerta
*/

import { Alert, Platform } from 'react-native';

export const setupGlobalAlert = () => {
  // Executa essa lógica APENAS se estiver rodando na Web
  if (Platform.OS === 'web') {
    Alert.alert = (title, message, buttons) => {
      // 1. Se não houver botões, é apenas um aviso simples
      if (!buttons || buttons.length === 0) {
        window.alert([title, message].filter(Boolean).join('\n'));
        return;
      }

      // 2. Se houver botões, exibe o popup de confirmação do navegador
      const result = window.confirm([title, message].filter(Boolean).join('\n'));

      if (result) {
        // Se o usuário clicou em "OK" (Confirmar)
        // Procura o botão que NÃO é o de cancelar, ou o primeiro botão disponível
        const confirmButton = buttons.find(b => b.style !== 'cancel' && b.text?.toLowerCase() !== 'cancelar') || buttons[0];
        confirmButton?.onPress?.();
      } else {
        // Se o usuário clicou em "Cancelar"
        // Procura especificamente o botão com estilo 'cancel' ou texto 'Cancelar'
        const cancelButton = buttons.find(b => b.style === 'cancel' || b.text?.toLowerCase() === 'cancelar');
        cancelButton?.onPress?.();
      }
    };
  }
};