import React from "react";
import { Arrow } from "react-konva";

const G2dConnector = ({ origin, target, color = "black", bidirectional }) => {
  return (
    <Arrow
      strokeWidth={1}
      fill={color}
      stroke={color}
      points={[origin.x, origin.y, target.x, target.y]}
      pointerLength={6}
      pointerWidth={4}
      pointerAtBeginning={bidirectional}
      pointerAtEnding
    />
  );
};

export default G2dConnector;
