import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { 
  Bell, 
  TriangleAlert, 
  Droplet, 
  Clock, 
  CheckCircle2, 
  Info,
  Wifi,
  PauseCircle,
  PlayCircle,
  CalendarClock,
  Trash2
} from "lucide-react-native";
import { Separator } from "@/components/ui/separator";

// Hook que busca os dados reais no banco
import { useAlertas } from "@/hooks/api/useLogs";

export default function Notification({ navigation }: any) {
  const insets = useSafeAreaInsets();
  
  // Buscamos os 30 últimos eventos para a lista de notificações
  const { data: alertasReais, isPending } = useAlertas("todos", 30);

  return (
    <View className="flex-1 w-full px-5 bg-white">
      
      <View
        className="pb-4 flex-row items-center gap-3 self-start"
        style={{ paddingTop: Platform.OS === 'web' ? 16 : insets.top + 16 }}
      >
        <Text className="text-lg font-outfit-bold text-[#0D0D0D]">Notificações</Text>
      </View>

      <Separator className="my-2 bg-[#B5B5B5]" decorative />

      <ScrollView className="flex-1 pt-4 gap-6" showsVerticalScrollIndicator={false}>
        
        {isPending ? (
          <ActivityIndicator size="large" color="#00A0A6" className="mt-10" />
        ) : !alertasReais || alertasReais.length === 0 ? (
          <View className="items-center justify-center mt-10 opacity-50">
            <Bell size={48} color="#666" />
            <Text className="font-outfit text-[#666] mt-4 text-center">Nenhuma notificação recente.</Text>
          </View>
        ) : (
          alertasReais.map((alerta: any, index: number) => {
            
            const dataObjeto = new Date(alerta.timestamp);
            const horaFormatada = dataObjeto.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
            const dataFormatada = dataObjeto.toLocaleDateString("pt-BR", { day: '2-digit', month: 'short' });
            
            const nomePivo = Array.isArray(alerta.pivos) ? alerta.pivos[0]?.nome_pivo : alerta.pivos?.nome_pivo;
            const identificacao = nomePivo || `Pivô ${alerta.pivo_id?.substring(0, 5) || "Sistema"}`;

            // 👉 LÓGICA DO DICIONÁRIO DE CORES E ÍCONES (Baseado no seu Banco de Dados)
            let Icone = Info;
            let corTema = "#00A0A6"; // Azul padrão
            
            // 1. ERROS E FALHAS
            if (alerta.tipo_evento === 'erro' || alerta.codigo?.includes('FALHA') || alerta.codigo?.includes('ERRO')) {
              corTema = "#D32F2F"; // Vermelho
              Icone = TriangleAlert;
            } 
            // 2. SUCESSOS E CONCLUSÕES
            else if (alerta.tipo_evento === 'conclusao' || alerta.codigo === 'CRONOGRAMA_FINALIZADO') {
              corTema = "#0AA146"; // Verde
              Icone = CheckCircle2;
            } 
            // 3. CONEXÃO MODBUS
            else if (alerta.codigo === 'MODBUS_CONECTADO') {
              corTema = "#0AA146"; // Verde
              Icone = Wifi;
            }
            // 4. PAUSAS
            else if (alerta.tipo_evento?.includes('pausa') || alerta.codigo?.includes('PARADA')) {
              corTema = "#F59E0B"; // Laranja/Amarelo
              Icone = PauseCircle;
            }
            // 5. INÍCIO E COMANDOS DE CONTINUAR
            else if (alerta.codigo === 'CRONOGRAMA_INICIADO' || alerta.codigo === 'COMANDO_CONTINUAR') {
              corTema = "#00A0A6"; // Azul
              Icone = PlayCircle;
            }
            // 6. AGENDAMENTOS
            else if (alerta.codigo === 'CRONOGRAMA_AGENDADO' || alerta.codigo === 'CRONOGRAMA_ATIVADO') {
              corTema = "#00A0A6"; // Azul
              Icone = CalendarClock;
            }
            // 7. EXCLUSÕES
            else if (alerta.codigo?.includes('EXCLUIDO')) {
              corTema = "#666666"; // Cinza
              Icone = Trash2;
            }

            // Tratamento do texto
            const tituloVisual = alerta.codigo 
              ? alerta.codigo.split(':')[0].replace(/_/g, ' ') 
              : "Aviso do Sistema";
              
            const nomeAgendamento = alerta.codigo?.includes(':') ? alerta.codigo.split(':')[1] : null;

            return (
              <React.Fragment key={alerta.id}>
                <TouchableOpacity activeOpacity={0.7} className="flex-row items-start cursor-pointer hover:opacity-70 transition-opacity">
                  
                  <View className="mt-1 items-center justify-center self-start">
                    <Icone size={32} color={corTema} />
                  </View>
                  
                  <View className="flex-1 ml-3 gap-1">
                    <Text className="font-outfit-bold text-sm" style={{ color: corTema }}>
                      {tituloVisual}
                    </Text>
                    <Text className="font-outfit-regular text-xs text-[#333]">
                      O {identificacao} registrou este evento. {nomeAgendamento ? `Ref: ${nomeAgendamento}. ` : ""}{alerta.operador_id ? "Ação enviada pelo App." : "Ação de sistema/hardware."}
                    </Text>
                    
                    <View className="flex-row items-center justify-end mt-1 opacity-70">
                       {/* <Clock size={10} color="#666" className="mr-1" /> */}
                       <Text className="font-outfit-medium text-[10px] text-subtexto">
                         {dataFormatada} às {horaFormatada}
                       </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {index < alertasReais.length - 1 && <Separator className="my-4 bg-[#dedede]" decorative />}
              </React.Fragment>
            );
          })
        )}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}