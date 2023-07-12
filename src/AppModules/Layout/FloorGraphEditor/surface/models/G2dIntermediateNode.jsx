import React from "react";
import { Circle } from "react-konva";

const G2dIntermediateNode = ({
  node,
  radioNode = 15,
  draggable = false,
  onSelect = null,
  color="grey",
  userData
}) => {
  return (
    <Circle
      id={node.id}
      x={node.locationx}
      y={node.locationz}
      width={radioNode}
      height={radioNode}
      fill={color}
      name={node.name}
      perfectDrawEnabled={true}
      draggable={draggable}
      onMouseDown={onSelect}
      onTap={onSelect}
      userData={userData}
    />
  );
};

export default G2dIntermediateNode;
