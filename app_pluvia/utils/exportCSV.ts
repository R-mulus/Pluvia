import * as Sharing from 'expo-sharing';
import * as MailComposer from 'expo-mail-composer'; // 👉 NOVO IMPORT
import { Alert, Platform } from 'react-native';
import { File, Paths } from 'expo-file-system';

export const exportarParaCSV = async (
  dados: any[], 
  nomeFicheiro: string, 
  modo: 'compartilhar' | 'email' = 'compartilhar' // 👉 NOVO PARÂMETRO COM PADRÃO
) => {
  if (!dados || dados.length === 0) {
    Alert.alert('Aviso', 'Não há dados suficientes para exportar.');
    return;
  }

  try {
    const chaves = Object.keys(dados[0]);
    const cabecalho = chaves.join(';');

    const linhas = dados.map(linha => {
      return chaves.map(chave => {
        const valor = linha[chave];
        const valorString = String(valor ?? '').replace(/"/g, '""').replace(/\n/g, ' ');
        return `"${valorString}"`;
      }).join(';');
    });

    const conteudoCSV = '\ufeff' + [cabecalho, ...linhas].join('\n');

    // === LÓGICA PARA WEB ===
    if (Platform.OS === 'web') {
      if (modo === 'email') {
        Alert.alert('Aviso', 'Na versão Web, a planilha será baixada. Você pode anexá-la manualmente ao seu e-mail.');
      }
      const blob = new Blob([conteudoCSV], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${nomeFicheiro}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } 
    // === LÓGICA PARA MOBILE (ANDROID/IOS) ===
    else {
      const ficheiro = new File(Paths.cache, `${nomeFicheiro}.csv`);
      await ficheiro.write(conteudoCSV);

      // 👉 SE O MODO FOR 'EMAIL', ABRE O APP DE E-MAIL NATIVO
      if (modo === 'email') {
        const emailDisponivel = await MailComposer.isAvailableAsync();
        if (emailDisponivel) {
          await MailComposer.composeAsync({
            subject: `Relatório do Sistema Pluvia: ${nomeFicheiro.replace(/_/g, ' ')}`,
            body: `Olá,\n\nSegue em anexo a planilha com os dados solicitados exportados diretamente do aplicativo Pluvia.\n\nAtenciosamente,\nSistema de Telemetria`,
            attachments: [ficheiro.uri],
            // recipients: ['email_do_chefe@empresa.com'], // Opcional: já preencher quem vai receber!
          });
        } else {
          Alert.alert('Aviso', 'Não há nenhum aplicativo de e-mail configurado neste dispositivo.');
        }
      } 
      // 👉 SE O MODO FOR 'COMPARTILHAR', ABRE A GAVETA GERAL (WhatsApp, etc)
      else {
        const partilhaDisponivel = await Sharing.isAvailableAsync();
        if (partilhaDisponivel) {
          await Sharing.shareAsync(ficheiro.uri, {
            mimeType: 'text/csv',
            dialogTitle: 'Compartilhar Planilha',
            UTI: 'public.comma-separated-values-text'
          });
        } else {
          Alert.alert('Aviso', 'O compartilhamento não está disponível neste dispositivo.');
        }
      }
    }
  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    Alert.alert('Erro', 'Ocorreu um problema ao gerar a planilha.');
  }
};