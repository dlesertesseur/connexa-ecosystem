import React from "react";
import { Circle } from "react-konva";

const G2dNode = ({node, radioNode = 15, color = "orange", draggable=false}) => {
  return (
    <Circle
      x={node.positionx - (radioNode / 2)}
      y={node.positionz - (radioNode / 2)}
      width={radioNode}
      height={radioNode}
      fill={color}
      type={node.name}
      draggable={draggable}
    />
  );
};

export default G2dNode;
