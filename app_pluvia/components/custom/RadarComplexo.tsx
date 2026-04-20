import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, Path } from 'react-native-svg';

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

export default function RadarComplexo({ size = 250, currentAngle = 5, startAngle = 0 }: RadarComplexoProps) {
  const svgSize = 200;
  const center = 100;
  const totalRadius = 100;

  // 1. REGRA DO LIMITE: Garantir que não passe de 359 (se passar de 360, ele volta pro zero)
  const safeStart = startAngle % 360;
  // Permite que o currentAngle chegue a 360 para representar a volta completa, 
  // mas se for 361, vira 1.
  const safeCurrent = currentAngle > 360 ? currentAngle % 360 : currentAngle;

  const polarToCartesian = (radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180.0);
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
        strokeWidth="0.5"
        opacity="0.4"
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
      strokeWidth = 1.5;
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
      />
    );
  }

  const angleLabels = [
    { degrees: 0, text: '0°' },
    { degrees: 90, text: '90°' },
    { degrees: 180, text: '180°' },
    { degrees: 270, text: '270°' },
  ];

  // 2. LÓGICA DO ARCO BLINDADA PARA 360 GRAUS
  const getArcPath = (radius: number, startDeg: number, endDeg: number) => {
    // Se o movimento for exatamente uma volta completa (360)
    // Desenhamos duas metades de círculo (dois arcos de 180) para o SVG não bugar
    if (endDeg - startDeg === 360 || (startDeg === 0 && endDeg === 360)) {
        const start = polarToCartesian(radius, startDeg);
        const mid = polarToCartesian(radius, startDeg + 180);
        
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

    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  };

  const arcPath = getArcPath(totalRadius - 3, safeStart, safeCurrent);

  const currentEndPoint = polarToCartesian(totalRadius, safeCurrent);
  const startEndPoint = polarToCartesian(totalRadius, safeStart);
  const labelPos = polarToCartesian(totalRadius * 0.65, safeCurrent);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${svgSize} ${svgSize}`}>
        
        <Circle cx={center} cy={center} r={totalRadius} fill={COLORS.primariaVerde} />
        {rings}
        <Path d={arcPath} fill="none" stroke={COLORS.secundariaAzul} strokeWidth="6" />
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
          const point = polarToCartesian(totalRadius - 24, label.degrees);
          return (
            <SvgText
              key={`label-${label.degrees}`}
              x={point.x + 2} // O +2 que você adicionou para ajuste óptico
              y={point.y}
              fill={COLORS.branco}
              fontSize="10"
              fontFamily="Outfit_400Regular"
              textAnchor="middle"
              alignmentBaseline="middle"
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

        <Circle cx={labelPos.x} cy={labelPos.y} r="12" fill={COLORS.branco} stroke={COLORS.texto} strokeWidth="0.3" />
        <SvgText
          x={labelPos.x}
          y={labelPos.y}
          fill={COLORS.texto}
          fontSize="8"
          fontFamily="Outfit_700Bold"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {/* Se for 360, exibe visualmente 360 em vez de 0 */}
          {`${safeCurrent === 0 && currentAngle === 360 ? 360 : safeCurrent}°`}
        </SvgText>

        <Circle cx={center} cy={center} r="4" fill={COLORS.branco} stroke={COLORS.texto} strokeWidth="1" />
      </Svg>
    </View>
  );
}