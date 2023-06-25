import React from "react";
import { Circle } from "react-konva";

const G2dNode = ({node, radioNode = 15, color = "green", draggable=false, onSelect}) => {
  return (
    <Circle
      id={node.id}
      x={node.positionx}
      y={node.positionz}
      width={radioNode}
      height={radioNode}
      fill={color}
      name={node.name}
      draggable={draggable}
      userData={node}
      onMouseDown={onSelect}
      onTap={onSelect}
    />
  );
};

export default G2dNode;
