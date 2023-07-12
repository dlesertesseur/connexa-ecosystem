import React from "react";
import { Group, Text } from "react-konva";

const G2dMarker = ({ marker }) => {
  return (
    <Group
      id={marker.id}
      x={marker.positionx}
      y={marker.positionz}
      rotation={-marker.rotationy}
      draggable={marker.draggable}
    >
      <Text
        text={marker.text}
        fontSize={marker.fontSize}
        fontFamily={marker.fontFamily}
        fill={marker.stroke}
        stroke={marker.stroke}
        strokeWidth={0.5}
      />
    </Group>
  );
};

export default G2dMarker;
