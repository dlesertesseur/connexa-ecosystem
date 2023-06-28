import React, { useState } from "react";
import { Arrow } from "react-konva";

const G2dConnector = ({ name, origin, target, color = "black", bidirectional, userData }) => {
  return (
    <Arrow
      name={name}
      strokeWidth={1}
      fill={color}
      stroke={color}
      points={[origin.x, origin.y, target.x, target.y]}
      pointerLength={6}
      pointerWidth={4}
      pointerAtBeginning={bidirectional}
      pointerAtEnding
      userData={userData}
    />
  );
};

export default G2dConnector;
