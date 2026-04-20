import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line, Text, Path } from 'react-native-svg';

interface RadarComplexoProps {
  // O tamanho total do componente (quadrado)
  size?: number;
  // O ângulo atual do pivô (0 a 359). Ex: 5
  currentAngle: number;
}

// Cores do Design System do Pluvia
const COLORS = {
  primariaVerde: "#0AA146",
  primariaAzul: "#00A0A6",
  texto: "#0D0D0D",
  branco: "#FFFFFF",
};

export default function RadarComplexo({ size = 250, currentAngle = 5 }: RadarComplexoProps) {
  // Definimos um viewBox quadrado de 200x200 para facilitar a matemática.
  // O centro do radar será a coordenada (100, 100).
  const svgSize = 200;
  const center = svgSize / 2; // 100
  const totalRadius = center; // 100 (Raio total do radar)

  // --- Função Auxiliar Matemática (Conversão Polar para Cartesiana) ---
  // Esta função pega um ângulo (em graus) e um raio, e devolve as coordenadas {x, y}
  // no sistema do SVG, ajustando para que 0° seja no topo (Norte).
  const polarToCartesian = (radius: number, angleInDegrees: number) => {
    // No SVG, 0 radianos é no eixo X positivo (Leste).
    // Nós subtraímos 90 graus para girar e colocar o 0° no topo.
    const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180.0);
    return {
      x: center + (radius * Math.cos(angleInRadians)),
      y: center + (radius * Math.sin(angleInRadians)),
    };
  };

  // --- 1. GERAÇÃO DOS ANÉIS CONCÊNTRICOS (Pretos) ---
  const rings = [];
  const numRings = 10; // Número de anéis
  for (let i = 1; i <= numRings; i++) {
    rings.push(
      <Circle
        key={`ring-${i}`}
        cx={center}
        cy={center}
        r={(totalRadius / numRings) * i} // Distribuição uniforme do raio
        fill="none"
        stroke={COLORS.texto}
        strokeWidth="0.5"
      />
    );
  }

  // --- 2. GERAÇÃO DOS TICKS DE MEDIÇÃO (Marcas de grau) ---
  const ticks = [];
  for (let i = 0; i < 360; i++) {
    const endPoint = polarToCartesian(totalRadius, i); // O tick sempre termina na borda
    let startRadius = 0;
    let strokeWidth = 0.5;

    // Lógica para definir a importância e o tamanho do tick
    if (i % 90 === 0) {
      startRadius = totalRadius - 10; // Tick longo (0, 90, 180, 270)
      strokeWidth = 1.5;
    } else if (i % 5 === 0) {
      startRadius = totalRadius - 5; // Tick médio (5, 10, 15, 20...)
      strokeWidth = 1;
    } else {
      startRadius = totalRadius - 2; // Tick curto (todos os outros graus intermediários)
      strokeWidth = 0.5;
    }

    const startPoint = polarToCartesian(startRadius, i);
    ticks.push(
      <Line
        key={`tick-${i}`}
        x1={startPoint.x}
        y1={startPoint.y}
        x2={endPoint.x}
        y2={endPoint.y}
        stroke={COLORS.texto}
        strokeWidth={strokeWidth}
      />
    );
  }

  // --- 3. CÁLCULO DE POSIÇÕES DINÂMICAS DO PONTEIRO ---
  // Ponto exato na borda onde o ponteiro termina
  const pointerEndPoint = polarToCartesian(totalRadius, currentAngle);
  // Posição do rótulo móvel (r=80 para ficar um pouco para dentro da borda)
  const labelPos = polarToCartesian(totalRadius * 0.8, currentAngle);

  // Geração da cunha azul (o bloco de ação) na borda externa.
  // r=98 a r=102, com largura de ~2 graus (1 grau para cada lado).
  const wedgeSize = 1; // graus para cada lado
  const startAngleWedge = currentAngle - wedgeSize;
  const endAngleWedge = currentAngle + wedgeSize;
  
  const wedgePointStart = polarToCartesian(totalRadius - 2, startAngleWedge);
  const wedgePointEnd = polarToCartesian(totalRadius + 2, endAngleWedge);
  const edgePointStart = polarToCartesian(totalRadius + 2, startAngleWedge);
  const edgePointEnd = polarToCartesian(totalRadius - 2, endAngleWedge);

  // Desenhamos a cunha usando um Path complexo (Arco externo, linha, Arco interno, linha)
  const wedgePath = `
    M ${wedgePointStart.x} ${wedgePointStart.y}
    A ${totalRadius - 2} ${totalRadius - 2} 0 0 1 ${edgePointEnd.x} ${edgePointEnd.y}
    L ${wedgePointEnd.x} ${wedgePointEnd.y}
    A ${totalRadius + 2} ${totalRadius + 2} 0 0 0 ${edgePointStart.x} ${edgePointStart.y}
    Z
  `;

  // --- 4. RÓTULOS DE ÂNGULO PRINCIPAIS (0°, 90°, 180°, 270°) ---
  // Nós os posicionamos r=115, um pouco para fora da borda total r=100.
  const angleLabels = [
    { degrees: 0, text: '0°', posRadius: totalRadius * 1.15 },
    { degrees: 90, text: '90°', posRadius: totalRadius * 1.15 },
    { degrees: 180, text: '180°', posRadius: totalRadius * 1.15 },
    { degrees: 270, text: '270°', posRadius: totalRadius * 1.15 },
  ];

  return (
    // View container para centralizar o SVG
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${svgSize} ${svgSize}`}>
        
        {/* Passo 1: O Círculo de Fundo (Verde) */}
        <Circle cx={center} cy={center} r={totalRadius} fill={COLORS.primariaVerde} />

        {/* Passo 2: Os 10 Anéis Concentricos */}
        {rings}

        {/* Passo 3: Os 360 Ticks de grau (Pretos) */}
        {ticks}

        {/* Passo 4: Os Rótulos de Ângulo Principais */}
        {angleLabels.map((label) => {
          const point = polarToCartesian(label.posRadius, label.degrees);
          return (
            <Text
              key={`label-${label.degrees}`}
              x={point.x}
              y={point.y}
              fill={COLORS.texto}
              fontSize="12"
              fontFamily="Outfit_400Regular" // Aplica sua fonte customizada
              textAnchor="middle" // Alinhamento horizontal centralizado
              alignmentBaseline="middle" // Alinhamento vertical centralizado
            >
              {label.text}
            </Text>
          );
        })}

        {/* Passo 5: A Cunha/Bloco Azul (Wedge) na borda (Atrás do ponteiro) */}
        <Path d={wedgePath} fill={COLORS.primariaAzul} />

        {/* Passo 6: O Ponteiro do Pivô (Linha Branca) */}
        <Line
          x1={center}
          y1={center}
          x2={pointerEndPoint.x}
          y2={pointerEndPoint.y}
          stroke={COLORS.branco}
          strokeWidth="1.5"
        />

        {/* Passo 7: O Rótulo da Posição Atual (Círculo Branco e Texto Negro) */}
        {/* Este é o círculo móvel que mostra "5°" na imagem. */}
        <Circle cx={labelPos.x} cy={labelPos.y} r="10" fill={COLORS.branco} stroke={COLORS.texto} strokeWidth="0.5" />
        <Text
          x={labelPos.x}
          y={labelPos.y}
          fill={COLORS.texto}
          fontSize="12"
          fontWeight="bold"
          fontFamily="Outfit_700Bold" // Aplica sua fonte negrito customizada
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {`${currentAngle}°`}
        </Text>

        {/* Passo 8: O Ponto Central (Círculo Branco Pequeno) para acabamento */}
        <Circle cx={center} cy={center} r="4" fill={COLORS.branco} stroke={COLORS.texto} strokeWidth="1" />
      </Svg>
    </View>
  );
}