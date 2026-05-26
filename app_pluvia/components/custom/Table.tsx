import React from "react";
import { View, ScrollView, Platform } from "react-native";
import { Text } from "@/components/ui/text";

// toda coluna precisa de uma chave, título e largura.
// O "renderCell" permite injetar qualquer visual customizado numa célula (como a tag de aviso)
export interface TableColumn<T> {
  key: string;
  title: string | React.ReactNode;
  width: number;
  renderCell?: (item: T, index: number) => React.ReactNode;
}

interface TabelaProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  alerta?: boolean // ! Tabelas de alerta devem conter este prop para evitar erros de estilização
}

export function Table<T>({ data, columns, alerta }: TabelaProps<T>) {

  const totalColumnsWidth = columns.reduce((sum, col) => sum + col.width, 0);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="w-full rounded-xl"
      contentContainerStyle={{
        minWidth: "100%", // 👈 Cresce para preencher a tela
      }}
    >
      
      <View className="rounded-xl" style={{ minWidth: totalColumnsWidth, flex: 1 }}>
        {/* // * CABEÇALHO */}
        <View className="flex-row bg-primaria-azul rounded-t-md overflow-hidden border-b-[4px] border-b-white">
          {columns.map((col, index) => (
            <View
              key={col.key}
              // style={{ width: col.width }}
              style={{ width: col.width, flexGrow: 1 }}
              className={`py-3 items-center justify-center ${
                // Adiciona o divisor branco, exceto na última coluna
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
                // Arredonda as pontas inferiores se for a última linha
                isLastRow ? "rounded-b-xl overflow-hidden" : ""
              }`}>
              {columns.map((col, colIndex) => {
                const isFirstCol = colIndex === 0;

                // Zebra striping também na coluna ID
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
                    // style={{ width: col.width }}
                    style={{ width: col.width, flexGrow: 1 }}
                    className={`justify-center ${defaultCellBg} ${
                      // Divisor cinza vertical: não aplica na primeira nem na última coluna
                      colIndex > 0 && colIndex < columns.length - 1
                        ? "border-r-[2px] border-[#CACACA]"
                        : ""
                    } ${!alerta ? "py-2" : ""}`}
                  >
                    {/* Se a coluna mandou uma renderização customizada, usa ela. Se não, usa o texto padrão. */}
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