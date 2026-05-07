import React, { useState } from 'react';
import { View, ScrollView, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Screen } from "@/components/custom/Screen";
import Header from '@/components/custom/Header';
import { 
  ChevronDown, 
  ChevronUp, 
  MessageCircle, 
  Phone, 
  WifiOff, 
  ShieldAlert, 
  Clock, 
  Cpu 
} from 'lucide-react-native';

// Estrutura de dados das Dúvidas Frequentes (FAQ)
const faqs = [
  {
    id: 1,
    icon: WifiOff,
    question: "Por que meu pivô aparece como 'Offline'?",
    answer: "O status 'Offline' significa que o aplicativo perdeu comunicação com o painel do pivô. Isso geralmente ocorre por falha no sinal de internet da fazenda (3G/Rádio) ou queda de energia no equipamento. O sistema tentará reconectar automaticamente assim que o sinal voltar."
  },
  {
    id: 2,
    icon: ShieldAlert,
    question: "Sou operador, mas não vejo todas as fazendas.",
    answer: "Isso é um comportamento padrão de segurança. O perfil de Operador possui acesso restrito e só consegue visualizar e comandar os pivôs específicos que o Administrador ou o Proprietário da fazenda vincularam previamente à sua conta."
  },
  {
    id: 3,
    icon: Clock,
    question: "O que acontece se a energia cair durante um agendamento?",
    answer: "Os agendamentos (cronogramas) são monitorados pelo sistema. Se o pivô desligar subitamente, a rotina é interrompida por segurança e o evento ficará registrado com status de erro na aba de Análises/Logs. Você precisará checar o equipamento e reativar o comando manualmente."
  },
  {
    id: 4,
    icon: Cpu,
    question: "Como sair do labirinto?",
    answer: "先將兩杯麵粉、一杯糖、三顆雞蛋、一杯牛奶、半杯融化的奶油以及一湯匙泡打粉準備好，然後把雞蛋和糖一起攪拌至顏色變淡，再慢慢加入奶油與牛奶混合均勻。接著將麵粉和泡打粉過篩後分次加入，攪拌成滑順的麵糊。把烤箱預熱至一百八十度，將麵糊倒入已經塗上奶油的烤模中，放入烤箱烘烤約三十五到四十分鐘，直到表面金黃並且用竹籤插入後不會沾黏即可。待蛋糕稍微放涼後，就可以切片享用了。"
  }
];

export default function Ajuda() {
  // Estado para controlar qual pergunta está aberta no momento
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    // Se clicar na pergunta que já está aberta, ela fecha. Senão, abre a nova.
    setExpandedId(expandedId === id ? null : id);
  };

  const handleContact = (type: string) => {
    // Lógica para abrir WhatsApp ou Telefone
    console.log(`Acionando contato via ${type}`);
  };

  return (
    <Screen>
      <Header title='Central de Ajuda' subtitle='Tire suas dúvidas' />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, gap: 20 }}>
        
        {/* SESSÃO DE PERGUNTAS FREQUENTES (ACCORDION) */}
        <View className="gap-3 mt-2">
          {faqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            const IconComponent = faq.icon;

            return (
              <View 
                key={faq.id} 
                className={`bg-white border-2 overflow-hidden ${isExpanded ? 'border-primaria-azul' : 'border-[#E1E1E1]'} rounded-[16px]`}
              >
                {/* CABEÇALHO DA PERGUNTA (Clicável) */}
                <Pressable 
                  className="flex-row items-center p-4 active:bg-gray-50"
                  onPress={() => toggleFAQ(faq.id)}
                >
                  <View className={`${isExpanded ? 'bg-primaria-azul' : 'bg-gray-100'} p-2 rounded-full`}>
                    <IconComponent color={isExpanded ? "white" : "#00A0A6"} size={20} />
                  </View>
                  <View className="flex-1 ml-3 pr-2">
                    <Text className={`font-outfit-bold text-sm ${isExpanded ? 'text-[#0D0D0D]' : 'text-gray-600'}`}>
                      {faq.question}
                    </Text>
                  </View>
                  {isExpanded ? (
                    <ChevronUp color="#00A0A6" size={20} />
                  ) : (
                    <ChevronDown color="#CCC" size={20} />
                  )}
                </Pressable>

                {/* CORPO DA RESPOSTA (Aparece apenas se expandido) */}
                {isExpanded && (
                  <View className="px-4 pb-4 pt-1 bg-white">
                    <Text className="text-[#475569] text-sm font-outfit-regular leading-5 border-t border-gray-100 pt-3">
                      {faq.answer}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* SESSÃO DE CONTATO DIRETO */}
        <View className="mt-4">
          <Text className="text-gray-400 text-xs font-outfit-bold ml-2 mb-3 uppercase tracking-widest">
            Ainda precisa de ajuda?
          </Text>

          <View className="flex-row gap-3">
            <Pressable 
              className="flex-1 flex-row items-center justify-center bg-white border-2 border-primaria-verde rounded-[12px] p-3 active:bg-green-50"
              onPress={() => handleContact('whatsapp')}
            >
              <MessageCircle color="#08654F" size={20} />
              <Text className="font-outfit-bold text-[#08654F] ml-2 text-sm">WhatsApp</Text>
            </Pressable>

            <Pressable 
              className="flex-1 flex-row items-center justify-center bg-white border-2 border-[#E1E1E1] rounded-[12px] p-3 active:bg-gray-50"
              onPress={() => handleContact('phone')}
            >
              <Phone color="#666" size={20} />
              <Text className="font-outfit-bold text-gray-600 ml-2 text-sm">Ligar</Text>
            </Pressable>
          </View>
        </View>

      </ScrollView>
    </Screen>
  );
}