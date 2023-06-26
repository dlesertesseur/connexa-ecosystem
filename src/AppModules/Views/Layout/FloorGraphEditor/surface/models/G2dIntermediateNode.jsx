import React from "react";
import { Circle } from "react-konva";

const G2dIntermediateNode = ({
  node,
  radioNode = 15,
  draggable = false,
  onSelect = null,
  color="grey"
}) => {
  return (
    <Circle
      id={node.id}
      x={node.positionx}
      y={node.positionz}
      width={radioNode}
      height={radioNode}
      fill={color}
      name={node.name}
      perfectDrawEnabled={true}
      draggable={draggable}
      onMouseDown={onSelect}
      onTap={onSelect}
    />
  );
};

export default G2dIntermediateNode;
