import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CircleUser,
  Bell,
  Settings,
  CircleHelp,
  Headphones,
  Phone,
  LogOut,
} from "lucide-react-native";
import { Separator } from "@/components/ui/separator";
import MenuItem from "@/components/custom/ProfileItem";

// ? Tipagem dos dados do usuário
export type UserData = {
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
};

// ? Tipagem dos props da tela
type PerfilProps = {
  navigation?: any; // * Recebe o controle de navegação do Drawer
  userData?: UserData; // * Prepara o componente para receber dados reais da API no futuro
};

export default function Perfil({ navigation, userData }: PerfilProps) {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    // Se o componente receber dados da API por props, usa eles.
    // Se não, injeta o Mock
    if (userData) {
      setUser(userData);
    } else {
      setUser({
        role: "Administrador",
        name: "Renan da Towner",
        email: "Renandatowner@gmail.com",
        avatarUrl:
          "https://i.pinimg.com/736x/dc/1a/e9/dc1ae92479a355bd04a46e437a6b360d.jpg",
      });
    }
  }, [userData]);

  // Função auxiliar para navegar e fechar a gaveta ao mesmo tempo
  const handleNavegacao = (rota: string) => {
    console.log(`Navegar para: ${rota}`);
    // Se a prop navigation existir (estiver dentro do Drawer), fecha a gaveta
    if (navigation) {
      navigation.closeDrawer();
    }
    // * Aqui viria o router.push('/rota') no futuro
  };

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bg">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        style={{ paddingTop: insets.top + 16, paddingHorizontal: 20 }}
      >
        {/* === CABEÇALHO DO USUÁRIO === */}
        <View className="flex-row items-center pb-6">
          <Image
            source={{ uri: user.avatarUrl }}
            className="w-20 h-20 rounded-full"
            resizeMode="cover"
          />

          <View className="ml-4 flex-1 justify-start">
            <View className="items-start gap-3">
              <View className="px-3 py-1 rounded-lg bg-[#00A0A6]">
                <Text className="text-white text-[12px] font-outfit-medium">
                  {user.role}
                </Text>
              </View>
              {/* O flex-shrink-1 impede que nomes gigantes empurrem a tag pra fora da tela */}
              <Text
                className="text-[16px] font-outfit-bold text-black flex-shrink-1"
                numberOfLines={1}
              >
                {user.name}
              </Text>
            </View>

            <Text
              className="text-[12px] font-outfit-regular text-gray-600 mt-1"
              numberOfLines={1}
            >
              {user.email}
            </Text>
          </View>
        </View>

        <Separator className="my-2 bg-[#B5B5B5]" decorative />

        {/* // * Primeiro Bloco do Menu */}

        <View className="py-2">
          <MenuItem
            icon={<CircleUser size={24} color="#000" />}
            title="Editar Perfil"
            onPress={() => handleNavegacao("EditarPerfil")}
          />
          <MenuItem
            icon={<Bell size={24} color="#000" />}
            title="Notificações"
            onPress={() => handleNavegacao("Notificacoes")}
          />
          <MenuItem
            icon={<Settings size={24} color="#000" />}
            title="Configurações"
            onPress={() => handleNavegacao("Configuracoes")}
          />
        </View>

        <Separator className="my-2 bg-[#B5B5B5]" decorative />

        {/* // * Segundo Bloco do Menu */}
        <View className="py-2">
          <MenuItem
            icon={<CircleHelp size={24} color="#000" />}
            title="Sobre Nós"
            onPress={() => handleNavegacao("SobreNos")}
          />
          <MenuItem
            icon={<Headphones size={24} color="#000" />}
            title="Central de Ajuda"
            onPress={() => handleNavegacao("CentralAjuda")}
          />
          <MenuItem
            icon={<Phone size={24} color="#000" />}
            title="Fale Conosco"
            onPress={() => handleNavegacao("FaleConosco")}
          />
        </View>

        <Separator className="my-2 bg-[#B5B5B5]" decorative />

        {/* // * Terceiro Bloco do Menu */}

        <View className="py-2">
          <MenuItem
            icon={<LogOut size={24} color="#E52207" />}
            iconColor="#E52207"
            title="Sair"
            titleColor="text-[#E52207]"
            onPress={() => handleNavegacao("SobreNos")}
          />
        </View>
      </ScrollView>
    </View>
  );
}
