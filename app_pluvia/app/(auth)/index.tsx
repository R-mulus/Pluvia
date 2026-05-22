import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Pressable,
  Alert
} from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Input } from "@/components/ui/input";
import { User, Lock } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

/// * Definindo o Schema de validação com Zod
const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    // ! LOGIN HARDCODED PARA TESTE
    defaultValues: {
      email: "tiolindomar@gmail.com",
      password: "123456",
    },
  });

  // 3. TANSTACK QUERY: Mutação para fazer o login
  const loginMutation = useMutation({
    mutationFn: async (dados: LoginFormData) => {
      // Chama o Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: dados.email,
        password: dados.password,
      });

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => {
      console.log("Token gerado com sucesso:", data.session?.access_token);
      // Navega para a área logada após o sucesso
      router.replace("/(tabs)/pivos/");
    },
    onError: (error) => {
      Alert.alert("Erro ao entrar", "Credenciais inválidas. Verifique no Supabase.");
      console.error(error);
    },
  });

  // Função disparada ao clicar no botão
  const onSubmit = (dados: LoginFormData) => {
    loginMutation.mutate(dados);
  };

  return (
    <View className="flex-1 bg-background">
      <Image
        source={require("../../assets/images/background_p.jpg")}
        contentFit="cover"
        transition={250}
        className="absolute"
        style={StyleSheet.absoluteFillObject}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 p-4 gap-6 mt-10 pt-10"
      >
        <View className="items-center">
          <Image
            source={require("../../assets/images/logo.png")}
            contentFit="contain"
            style={{ width: 150, height: 60 }}
          />
        </View>

        <View className="w-full p-6 gap-8">
          <View className="gap-3">
            <Text className="text-base font-outfit-medium text-texto text-start">
              Faça seu Login
            </Text>

            {/* CAMPO DE E-MAIL (Controlado pelo Hook Form) */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <View className={`flex-row items-center border-[2px] ${errors.email ? 'border-red-500' : 'border-[#B8B8B8]'} bg-white rounded-xl overflow-hidden h-10`}>
                    <View className="bg-secundaria-azul w-12 h-full items-center justify-center rounded-br-lg">
                      <User size={24} color="white" strokeWidth={2.5} />
                    </View>
                    <Input
                      placeholder="E-mail"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      className="border-0 h-full px-4 bg-white flex-1"
                    />
                  </View>
                  {errors.email && <Text className="text-red-500 text-xs mt-1">{errors.email.message}</Text>}
                </View>
              )}
            />

            {/* CAMPO DE SENHA (Controlado pelo Hook Form) */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <View className={`flex-row items-center border-[2px] ${errors.password ? 'border-red-500' : 'border-[#B8B8B8]'} bg-white rounded-xl overflow-hidden h-10`}>
                    <View className="bg-secundaria-azul w-12 h-full items-center justify-center">
                      <Lock size={24} color="white" strokeWidth={2.5} />
                    </View>
                    <Input
                      placeholder="Senha"
                      secureTextEntry
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      className="border-0 h-full px-4 bg-white flex-1"
                    />
                  </View>
                  {errors.password && <Text className="text-red-500 text-xs mt-1">{errors.password.message}</Text>}
                </View>
              )}
            />
          </View>

          <View className="gap-3">
            <Button
              className={`bg-primaria-azul h-10 rounded-tl-none rounded-br-none rounded-bl-[10] rounded-tr-[10] text-bg ${loginMutation.isPending ? 'opacity-70' : ''}`}
              onPress={handleSubmit(onSubmit)}
              disabled={loginMutation.isPending}
            >
              <Text className="font-outfit">
                {loginMutation.isPending ? "Entrando..." : "Entrar"}
              </Text>
            </Button>

            <Pressable className="active:opacity-50">
              <Text className="text-subtexto text-center text-sm underline">
                Esqueci minha senha
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}