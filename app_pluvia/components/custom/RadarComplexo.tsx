/**
 * ⚠️ [PORTABILIDADE WEB EM ANDAMENTO]
 *
 * MODIFICAÇÕES REALIZADAS PARA ADAPTAÇÃO WEB:
 *
 * 1. IMPORTAÇÃO DO PLATFORM:
 * - Adicionado 'Platform' do react-native para ajustes condicionais específicos da Web.
 *
 * 2. PRESERVE ASPECT RATIO NO SVG:
 * - Adicionado:
 *   preserveAspectRatio="xMidYMid meet"
 * - Evita deformação, stretch e overflow do SVG no navegador.
 *
 * 3. REMOÇÃO DE fontFamily DENTRO DO SVG:
 * - Removidos:
 *   fontFamily="Outfit_400Regular"
 *   fontFamily="Outfit_700Bold"
 * - Fontes customizadas em SVG apresentavam serrilhado, vazamento e renderização inconsistente na Web.
 *
 * 4. CORREÇÃO DE CENTRALIZAÇÃO DE TEXTO SVG:
 * - Substituído:
 *   alignmentBaseline="middle"
 * - Por:
 *   dy=".35em"
 * - alignmentBaseline possui comportamento inconsistente entre navegadores.
 * - dy garante centralização visual mais estável na Web.
 *
 * 5. FONT WEIGHT VIA SVG:
 * - Adicionado:
 *   fontWeight="700"
 * - Substitui a necessidade da fonte bold customizada dentro do SVG.
 *
 * 6. AJUSTE DE FONTES PARA WEB:
 * - Font sizes aumentados condicionalmente na Web:
 *   10 → 11
 *   8 → 9
 * - Navegadores renderizam SVG text menor e menos nítido que no mobile.
 *
 * 7. AJUSTE DE STROKE WIDTH:
 * - Linhas abaixo de 1px ficavam borradas na Web.
 * - Ajustes aplicados:
 *   0.5 → 1
 *   0.3 → 1
 * - Mantido valor original no mobile.
 *
 * 8. SUAVIZAÇÃO DE TRAÇOS:
 * - Adicionado:
 *   strokeLinecap="round"
 * - Aplicado em:
 *   <Line />
 *   <Path />
 * - Reduz efeito serrilhado nas extremidades.
 *
 * 9. AJUSTE DE ESPESSURA DO PATH:
 * - Alterado:
 *   6 → 5 (Web)
 * - Na Web o traço aparentava visualmente mais espesso.
 *
 * 10. AJUSTE VISUAL DOS TICKS:
 * - Alterado:
 *   1.5 → 1.2 (Web)
 * - Evita estouro visual e excesso de peso nos marcadores.
 *
 * 11. REDUÇÃO DA OPACIDADE DOS ANÉIS:
 * - Alterado:
 *   opacity="0.4" → opacity="0.25"
 * - Navegadores exibiam os círculos auxiliares visualmente muito fortes.
 *
 * 12. REMOÇÃO DE OFFSET MANUAL NO TEXTO:
 * - Removido:
 *   x={point.x + 2}
 * - Mantido:
 *   x={point.x}
 * - Compensação manual quebrava alinhamento horizontal na Web.
 */


import React from 'react';
import { View, Platform } from 'react-native';
import Svg, {
  Circle,
  Line,
  Text as SvgText,
  Path,
} from 'react-native-svg';

interface RadarComplexoProps {
  size?: number;
  currentAngle: number;
  startAngle?: number;
}

const COLORS = {
  primariaVerde: "#0AA146",
  secundariaAzul: "#00595C",
  texto: "#0D0D0D",
  branco: "#FFFFFF",
};

export default function RadarComplexo({
  size = 250,
  currentAngle = 5,
  startAngle = 0,
}: RadarComplexoProps) {

  const svgSize = 200;
  const center = 100;
  const totalRadius = 100;

  const safeStart = startAngle % 360;
  const safeCurrent =
    currentAngle > 360
      ? currentAngle % 360
      : currentAngle;

  const polarToCartesian = (
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians =
      (angleInDegrees - 90) * (Math.PI / 180.0);

    return {
      x: center + (radius * Math.cos(angleInRadians)),
      y: center + (radius * Math.sin(angleInRadians)),
    };
  };

  const rings = [];
  const numRings = 10;

  for (let i = 1; i < numRings; i++) {
    rings.push(
      <Circle
        key={`ring-${i}`}
        cx={center}
        cy={center}
        r={(totalRadius / numRings) * i}
        fill="none"
        stroke={COLORS.texto}
        strokeWidth={Platform.OS === "web" ? 1 : 0.5}
        opacity="0.25"
      />
    );
  }

  const ticks = [];

  for (let i = 0; i < 360; i += 5) {
    const endPoint = polarToCartesian(totalRadius, i);
    
    let startRadius = 0;
    let strokeWidth = 1;

    if (i % 90 === 0) {
      startRadius = totalRadius - 12;
      strokeWidth = 2;
    } else {
      startRadius = totalRadius - 6;
      strokeWidth = Platform.OS === "web" ? 1.2 : 1.5;
    }

    const startPoint = polarToCartesian(startRadius, i);

    ticks.push(
      <Line
        key={`tick-${i}`}
        x1={startPoint.x}
        y1={startPoint.y}
        x2={endPoint.x}
        y2={endPoint.y}
        stroke={COLORS.branco}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    );
  }

  const angleLabels = [
    { degrees: 0, text: '0°' },
    { degrees: 90, text: '90°' },
    { degrees: 180, text: '180°' },
    { degrees: 270, text: '270°' },
  ];

  const getArcPath = (
    radius: number,
    startDeg: number,
    endDeg: number
  ) => {

    if (
      endDeg - startDeg === 360 ||
      (startDeg === 0 && endDeg === 360)
    ) {

      const start = polarToCartesian(radius, startDeg);

      const mid = polarToCartesian(
        radius,
        startDeg + 180
      );

      return `
        M ${start.x} ${start.y}
        A ${radius} ${radius} 0 1 1 ${mid.x} ${mid.y}
        A ${radius} ${radius} 0 1 1 ${start.x} ${start.y}
      `;
    }

    let diff = endDeg - startDeg;

    if (diff === 0) return "";

    if (diff < 0) diff += 360;

    const largeArcFlag = diff > 180 ? 1 : 0;

    const start = polarToCartesian(radius, startDeg);

    const end = polarToCartesian(radius, endDeg);

    return `
      M ${start.x} ${start.y}
      A ${radius} ${radius}
      0 ${largeArcFlag} 1
      ${end.x} ${end.y}
    `;
  };

  const arcPath = getArcPath(
    totalRadius - 3,
    safeStart,
    safeCurrent
  );

  const currentEndPoint = polarToCartesian(
    totalRadius,
    safeCurrent
  );

  const startEndPoint = polarToCartesian(
    totalRadius,
    safeStart
  );

  const labelPos = polarToCartesian(
    totalRadius * 0.65,
    safeCurrent
  );

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        preserveAspectRatio="xMidYMid meet"
      >

        <Circle
          cx={center}
          cy={center}
          r={totalRadius}
          fill={COLORS.primariaVerde}
        />

        {rings}

        <Path
          d={arcPath}
          fill="none"
          stroke={COLORS.secundariaAzul}
          strokeWidth={Platform.OS === "web" ? 5 : 6}
          strokeLinecap="round"
        />

        {ticks}

        <Line
          x1={center}
          y1={center}
          x2={startEndPoint.x}
          y2={startEndPoint.y}
          stroke={COLORS.texto}
          strokeWidth="2"
        />

        {angleLabels.map((label) => {
          const point = polarToCartesian(
            totalRadius - 24,
            label.degrees
          );

          return (
            <SvgText
              key={`label-${label.degrees}`}
              x={point.x}
              y={point.y}
              fill={COLORS.branco}
              fontSize={Platform.OS === "web" ? 11 : 10}
              fontWeight="700"
              textAnchor="middle"
              dy=".35em"
            >
              {label.text}
            </SvgText>
          );
        })}

        <Line
          x1={center}
          y1={center}
          x2={currentEndPoint.x}
          y2={currentEndPoint.y}
          stroke={COLORS.branco}
          strokeWidth="2"
        />

        <Circle
          cx={labelPos.x}
          cy={labelPos.y}
          r="12"
          fill={COLORS.branco}
          stroke={COLORS.texto}
          strokeWidth={Platform.OS === "web" ? 1 : 0.3}
        />

        <SvgText
          x={labelPos.x}
          y={labelPos.y}
          fill={COLORS.texto}
          fontSize={Platform.OS === "web" ? 9 : 8}
          fontWeight="700"
          textAnchor="middle"
          dy=".35em"
        >
          {`${safeCurrent === 0 && currentAngle === 360
            ? 360
            : safeCurrent
          }°`}
        </SvgText>

        <Circle
          cx={center}
          cy={center}
          r="4"
          fill={COLORS.branco}
          stroke={COLORS.texto}
          strokeWidth="1"
        />

      </Svg>
    </View>
  );
}