/**
 * ✅ [PORTABILIDADE WEB CONCLUÍDA - TABELA RESPONSIVA]
 * * MODIFICAÇÕES REALIZADAS:
 * 1. SCROLL VISÍVEL: 'showsHorizontalScrollIndicator' agora é ativado na Web. Isso permite que usuários com mouse consigam ver a barra e arrastar para o lado.
 * 2. TRAVA DE LARGURA: Adicionado 'max-w-full' no ScrollView. Isso impede que a tabela estique a página ao redimensionar a janela do navegador, forçando a ativação do scroll horizontal.
 * 3. RESPIRO DO SCROLLBAR: Na web, scrollbars físicas (Windows/Linux) ocupam altura real. O 'paddingBottom: 8' impede que a barra sobreponha o conteúdo da última linha.
 */

import React from "react";
import { View, ScrollView, Platform } from "react-native";
import { Text } from "@/components/ui/text";

export interface TableColumn<T> {
  key: string;
  title: string | React.ReactNode;
  width: number;
  renderCell?: (item: T, index: number) => React.ReactNode;
}

interface TabelaProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  alerta?: boolean 
}

export function Table<T>({ data, columns, alerta }: TabelaProps<T>) {

  const totalColumnsWidth = columns.reduce((sum, col) => sum + col.width, 0);

  return (
    <ScrollView
      horizontal
      // [WEB FIX] Mostra a barra de rolagem na Web para usuários com mouse
      showsHorizontalScrollIndicator={Platform.OS === "web"}
      // [WEB FIX] 'max-w-full' força o ScrollView a não furar o limite do navegador
      className="w-full max-w-full rounded-xl"
      contentContainerStyle={{
        minWidth: "100%",
        // [WEB FIX] Dá um pequeno respiro embaixo para a barra física de rolagem do PC não engolir o conteúdo
        paddingBottom: Platform.OS === "web" ? 8 : 0, 
      }}
    >
      
      <View className="rounded-xl" style={{ minWidth: totalColumnsWidth, flex: 1 }}>
        {/* // * CABEÇALHO */}
        <View className="flex-row bg-primaria-azul rounded-t-md overflow-hidden border-b-[4px] border-b-white">
          {columns.map((col, index) => (
            <View
              key={col.key}
              style={{ width: col.width, flexGrow: 1 }}
              className={`py-3 items-center justify-center ${
                index < columns.length - 1 ? "border-r-[2px] border-white" : ""
              }`}
            >
              {typeof col.title === "string" ? (
                <Text className="text-white font-outfit-bold text-sm">
                  {col.title}
                </Text>
              ) : (
                col.title
              )}
            </View>
          ))}
        </View>

        {/* // * Linhas */}
        {data.map((row, rowIndex) => {
          // Lógica de Linhas Alternadas (Zebra Striping)
          const isEven = rowIndex % 2 === 0;
          const rowBg = isEven ? "bg-white" : "bg-[#EAEAEA]";
          const isLastRow = rowIndex === data.length - 1;

          return (
            <View key={rowIndex} className={`flex-row ${rowBg} ${
                isLastRow ? "rounded-b-xl overflow-hidden" : ""
              }`}>
              {columns.map((col, colIndex) => {
                const isFirstCol = colIndex === 0;

                const firstColBg = isEven
                  ? "bg-primaria-azul"
                  : "bg-secundaria-azul";

                const defaultCellBg = isFirstCol ? firstColBg : "";

                const defaultTextColor = isFirstCol
                  ? "text-white font-outfit-bold"
                  : "text-[#0D0D0D] font-outfit";

                return (
                  <View
                    key={col.key}
                    style={{ width: col.width, flexGrow: 1 }}
                    className={`justify-center ${defaultCellBg} ${
                      colIndex > 0 && colIndex < columns.length - 1
                        ? "border-r-[2px] border-[#CACACA]"
                        : ""
                    } ${!alerta ? "py-2" : ""}`}
                  >
                    {col.renderCell ? (
                      col.renderCell(row, rowIndex)
                    ) : (
                      <View className="py-3 px-2 items-center w-full">
                        <Text
                          className={`text-sm ${defaultTextColor}`}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {String((row as any)[col.key] || "")}
                        </Text>
                      </View>
                    )}
                  </View> 
                );
              })}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}