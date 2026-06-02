import React from "react";
import { View, Text, Image, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CircleUser, Bell, Settings, CircleHelp, Headphones, Phone, LogOut } from "lucide-react-native";
import { Separator } from "@/components/ui/separator";
import MenuItem from "@/components/custom/ProfileItem";
import { DrawerActions } from "@react-navigation/native";

import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

type PerfilProps = { navigation?: any; };

export default function Perfil({ navigation }: PerfilProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const { user, signOut } = useAuth();

  const { data: userData, isPending } = useQuery({
    queryKey: ['perfil_completo', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user?.id
  });

  const handleNavegacao = (rota: string) => {
    if (navigation) navigation.closeDrawer();
  };

  if (isPending) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#00A0A6" />
        <Text className="mt-4 font-outfit text-subtexto">Carregando perfil...</Text>
      </View>
    );
  }

  // Fallbacks de segurança
  const nomeExibicao = userData?.nome || user?.email?.split('@')[0] || "Usuário não identificado";
  const emailExibicao = userData?.email || user?.email || "Sem e-mail cadastrado";
  const cargoExibicao = userData?.cargo 
    ? userData.cargo.charAt(0).toUpperCase() + userData.cargo.slice(1).toLowerCase() 
    : "Operador";

  return (
    <View className="flex-1 bg-bg">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} style={{ paddingTop: insets.top + 16, paddingHorizontal: 20 }}>
        {/* === CABEÇALHO DO USUÁRIO === */}
        <View className="flex-row items-center pb-6 mt-4">
          <Image
            source={{ uri: "https://i.pinimg.com/736x/dc/1a/e9/dc1ae92479a355bd04a46e437a6b360d.jpg" }}
            className="w-20 h-20 rounded-full"
            resizeMode="cover"
          />
          <View className="ml-4 flex-1 justify-start">
            <View className="items-start gap-3">
              <View className="px-3 py-1 rounded-lg bg-[#00A0A6]">
                <Text className="text-white text-[12px] font-outfit-medium">{cargoExibicao}</Text>
              </View>
              <Text className="text-[16px] font-outfit-bold text-black flex-shrink-1" numberOfLines={2}>
                {nomeExibicao}
              </Text>
            </View>
            <Text className="text-[12px] font-outfit-regular text-gray-600 mt-1" numberOfLines={1}>
              {emailExibicao}
            </Text>
          </View>
        </View>

        <Separator className="my-2 bg-[#B5B5B5]" decorative />

        {/* ... Restante do seu Menu continua idêntico (Editar Perfil, Notificações, etc) ... */}
        <View className="py-2">
          <MenuItem icon={<CircleUser size={24} color="#000" />} title="Editar Perfil" onPress={() => handleNavegacao("EditarPerfil")} />
          <MenuItem icon={<Bell size={24} color="#000" />} title="Notificações" onPress={() => { if (navigation) navigation.closeDrawer(); }} />
          <MenuItem icon={<Settings size={24} color="#000" />} title="Configurações" onPress={() => handleNavegacao("Configuracoes")} />
        </View>

        <Separator className="my-2 bg-[#B5B5B5]" decorative />

        <View className="py-2">
          <MenuItem icon={<CircleHelp size={24} color="#000" />} title="Sobre Nós" onPress={() => { router.push("/perfil/sobre"); if (navigation) navigation.closeDrawer(); }} />
          <MenuItem icon={<Headphones size={24} color="#000" />} title="Central de Ajuda" onPress={() => { router.push("/perfil/ajuda"); if (navigation) navigation.closeDrawer(); }} />
          <MenuItem icon={<Phone size={24} color="#000" />} title="Fale Conosco" onPress={() => { router.push("/perfil/faleConosco"); if (navigation) navigation.closeDrawer(); }} />
        </View>

        <Separator className="my-2 bg-[#B5B5B5]" decorative />

        <View className="py-2">
          <MenuItem icon={<LogOut size={24} color="#E52207" />} iconColor="#E52207" title="Sair" titleColor="text-[#E52207]" onPress={signOut} />
        </View>
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}